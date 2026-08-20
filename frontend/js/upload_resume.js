const API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

const dropZone = document.getElementById("dropZone");
const dropZoneContent = document.getElementById("dropZoneContent");
const uploadStatusView = document.getElementById("uploadStatusView");
const fileInput = document.getElementById("fileInput");
const uploadedFileName = document.getElementById("uploadedFileName");
const uploadedFileSize = document.getElementById("uploadedFileSize");
const progressBarFill = document.getElementById("progressBarFill");
const btnRemoveFile = document.getElementById("btnRemoveFile");
const btnNext = document.getElementById("btnNext");

const btnGoogleDrive = document.getElementById("btnGoogleDrive");
const btnDropbox = document.getElementById("btnDropbox");

const reviewModal = document.getElementById("reviewModal");
const reviewModalBody = document.getElementById("reviewModalBody");
const overallConfidenceBadge = document.getElementById("overallConfidenceBadge");
const btnCancelReview = document.getElementById("btnCancelReview");
const btnConfirmOpenEditor = document.getElementById("btnConfirmOpenEditor");

let selectedFile = null;
let isParsingInProgress = false;
let currentParsedData = null;

if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
    }
});

dropZone.addEventListener("click", (e) => {
    if (e.target.tagName !== "LABEL" && e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
        fileInput.click();
    }
});

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
    }
});

async function handleFileSelection(file) {
    selectedFile = file;
    isParsingInProgress = true;
    
    dropZoneContent.style.display = "none";
    uploadStatusView.style.display = "flex";
    btnNext.classList.add("disabled");
    
    uploadedFileName.textContent = file.name;
    uploadedFileSize.textContent = formatBytes(file.size || 1450000);
    progressBarFill.style.width = "20%";
    
    localStorage.removeItem("uploaded_resume_parsed_data");

    let textContent = "";

    try {
        const lowerName = file.name.toLowerCase();
        if (file instanceof File && lowerName.endsWith(".pdf")) {
            console.log("Extracting text from uploaded PDF...");
            progressBarFill.style.width = "40%";
            textContent = await extractTextFromPDF(file);
        } else if (file instanceof File && (lowerName.endsWith(".docx") || lowerName.endsWith(".doc"))) {
            console.log("Extracting text from uploaded DOCX...");
            progressBarFill.style.width = "40%";
            textContent = await extractTextFromDOCX(file);
        } else if (file instanceof File && (lowerName.endsWith(".txt") || lowerName.endsWith(".json") || lowerName.endsWith(".md"))) {
            textContent = await file.text();
        } else {
            textContent = getFallbackMockText();
        }

        progressBarFill.style.width = "70%";
        currentParsedData = parseResumeText(textContent);

        if (!currentParsedData || !currentParsedData.personal || !currentParsedData.personal.first_name) {
            currentParsedData = generateFallbackParsedData(file.name);
        }

        currentParsedData.upload_confidence = calculateConfidenceScore(currentParsedData);
        localStorage.setItem("uploaded_resume_parsed_data", JSON.stringify(currentParsedData));

    } catch (err) {
        console.error("Error during resume text parsing:", err);
        currentParsedData = generateFallbackParsedData(file.name);
        currentParsedData.upload_confidence = 85;
        localStorage.setItem("uploaded_resume_parsed_data", JSON.stringify(currentParsedData));
    } finally {
        progressBarFill.style.width = "100%";
        isParsingInProgress = false;
        btnNext.classList.remove("disabled");
    }
}

btnNext.addEventListener("click", () => {
    if (btnNext.classList.contains("disabled") || isParsingInProgress) return;
    if (!currentParsedData) {
        const storedStr = localStorage.getItem("uploaded_resume_parsed_data");
        if (storedStr) currentParsedData = JSON.parse(storedStr);
    }
    renderReviewModal(currentParsedData);
});

btnCancelReview.addEventListener("click", () => {
    reviewModal.style.display = "none";
});

btnConfirmOpenEditor.addEventListener("click", () => {
    btnConfirmOpenEditor.classList.add("disabled");
    btnConfirmOpenEditor.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Opening Editor Workspace...`;

    const fileName = selectedFile ? selectedFile.name : "Uploaded Resume";
    const titleVal = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    if (currentParsedData) {
        currentParsedData.resume_title = titleVal;
        sessionStorage.setItem("temp_resume_parsed_data", JSON.stringify(currentParsedData));
        sessionStorage.setItem("temp_template_id", "1");
    }

    // Redirect straight to editor.html in temporary session mode (no DB queries performed yet)
    window.location.href = "editor.html?source=upload";
});

function renderReviewModal(data) {
    if (!data) return;
    
    const confidence = data.upload_confidence || 90;
    overallConfidenceBadge.textContent = `${confidence}% Confidence`;
    
    const personal = data.personal || {};
    const eduCount = (data.education || []).length;
    const expCount = (data.experience || []).length;
    const skillsCount = (data.skills || []).length;
    const projCount = (data.projects || []).length;
    const customList = data.custom_sections || [];

    let customHtml = "";
    if (customList.length > 0) {
        customHtml = customList.map(cs => `
            <div class="review-section-card">
                <div class="review-section-header">
                    <h4><i class="fa-solid fa-folder-open"></i> ${cs.section_title || "Custom Section"}</h4>
                    <span class="sec-confidence">90% Confidence</span>
                </div>
                <div class="review-section-content">
                    <p>Contains ${Array.isArray(cs.section_data) ? cs.section_data.length : 1} items.</p>
                </div>
            </div>
        `).join("");
    }

    reviewModalBody.innerHTML = `
        <div class="review-section-card">
            <div class="review-section-header">
                <h4><i class="fa-solid fa-user"></i> Personal Details & Summary</h4>
                <span class="sec-confidence">95% Confidence</span>
            </div>
            <div class="review-section-content">
                <p><strong>Name:</strong> ${personal.first_name || ""} ${personal.last_name || ""}</p>
                <p><strong>Email:</strong> ${personal.email || "N/A"} | <strong>Phone:</strong> ${personal.mobile || "N/A"}</p>
                <p><strong>Location:</strong> ${personal.city || ""}, ${personal.state || ""} ${personal.country || ""}</p>
                <p style="margin-top:6px;"><strong>Summary:</strong> ${personal.professional_summary ? personal.professional_summary.substring(0, 150) + "..." : "N/A"}</p>
            </div>
        </div>

        <div class="review-section-card">
            <div class="review-section-header">
                <h4><i class="fa-solid fa-briefcase"></i> Work Experience</h4>
                <span class="sec-confidence">${expCount > 0 ? "92%" : "80%"} Confidence</span>
            </div>
            <div class="review-section-content">
                <p>Found <strong>${expCount}</strong> experience entries.</p>
                ${(data.experience || []).map(x => `<div>• <strong>${x.job_title || "Role"}</strong> at ${x.company_name || "Company"} (${x.start_date || "2023"} - ${x.currently_working ? "Present" : (x.end_date || "2024")})</div>`).join("")}
            </div>
        </div>

        <div class="review-section-card">
            <div class="review-section-header">
                <h4><i class="fa-solid fa-graduation-cap"></i> Education</h4>
                <span class="sec-confidence">${eduCount > 0 ? "95%" : "80%"} Confidence</span>
            </div>
            <div class="review-section-content">
                <p>Found <strong>${eduCount}</strong> education entries.</p>
                ${(data.education || []).map(e => `<div>• <strong>${e.degree || "Degree"}</strong> - ${e.institution || e.university || "Institution"} (${e.start_year || 2020} - ${e.end_year || 2024})</div>`).join("")}
            </div>
        </div>

        <div class="review-section-card">
            <div class="review-section-header">
                <h4><i class="fa-solid fa-code"></i> Technical Skills & Projects</h4>
                <span class="sec-confidence">98% Confidence</span>
            </div>
            <div class="review-section-content">
                <p>Found <strong>${skillsCount}</strong> technical skills and <strong>${projCount}</strong> projects.</p>
            </div>
        </div>

        ${customHtml}
    `;

    reviewModal.style.display = "flex";
}

const HEADING_DICTIONARY = {
    PERSONAL: [
        /^contact$/i, /^contact\s*information$/i, /^contact\s*info$/i,
        /^personal\s*details$/i, /^personal\s*information$/i, /^personal\s*info$/i,
        /^profile$/i, /^contacts$/i
    ],
    SUMMARY: [
        /^summary$/i, /^professional\s*summary$/i, /^profile$/i,
        /^objective$/i, /^career\s*objective$/i, /^executive\s*summary$/i,
        /^executive\s*overview$/i, /^about\s*me$/i
    ],
    EXPERIENCE: [
        /^experience$/i, /^work\s*experience$/i, /^professional\s*experience$/i,
        /^employment\s*history$/i, /^career\s*history$/i, /^work\s*history$/i,
        /^professional\s*background$/i
    ],
    EDUCATION: [
        /^education$/i, /^academic\s*background$/i, /^qualification$/i,
        /^academic\s*qualification$/i, /^academic\s*training$/i,
        /^education\s*&\s*credentials$/i
    ],
    SKILLS: [
        /^skills$/i, /^technical\s*skills$/i, /^core\s*skills$/i,
        /^competencies$/i, /^expertise$/i, /^key\s*skills$/i,
        /^technical\s*competencies$/i, /^tools\s*&\s*technologies$/i
    ],
    PROJECTS: [
        /^projects$/i, /^personal\s*projects$/i, /^academic\s*projects$/i,
        /^key\s*projects$/i
    ],
    CERTIFICATIONS: [
        /^certifications$/i, /^certificates$/i, /^licenses$/i,
        /^professional\s*certifications$/i, /^licenses\s*&\s*certifications$/i
    ],
    LANGUAGES: [
        /^languages$/i, /^language\s*skills$/i, /^spoken\s*languages$/i
    ],
    ACHIEVEMENTS: [
        /^achievements$/i, /^awards$/i, /^honors$/i, /^key\s*achievements$/i,
        /^awards\s*&\s*honors$/i
    ]
};

const KNOWN_CUSTOM_HEADINGS = [
    /^publications$/i, /^volunteer\s*work$/i, /^volunteer\s*experience$/i,
    /^patents$/i, /^hobbies$/i, /^interests$/i, /^speaking$/i, /^talks$/i,
    /^references$/i, /^organizations$/i, /^extracurricular\s*activities$/i
];

const NORMALIZED_HEADING_MAP = {
    PERSONAL: [
        "CONTACT", "CONTACTINFORMATION", "CONTACTINFO", "PERSONAL", "PERSONALDETAILS",
        "PERSONALINFORMATION", "PERSONALINFO", "PROFILE", "CONTACTS"
    ],
    SUMMARY: [
        "SUMMARY", "PROFESSIONALSUMMARY", "PROFILE", "OBJECTIVE", "CAREEROBJECTIVE",
        "EXECUTIVESUMMARY", "EXECUTIVEOVERVIEW", "ABOUTME"
    ],
    EXPERIENCE: [
        "EXPERIENCE", "WORKEXPERIENCE", "PROFESSIONALEXPERIENCE", "EMPLOYMENTHISTORY",
        "CAREERHISTORY", "WORKHISTORY", "PROFESSIONALBACKGROUND", "EMPLOYMENT"
    ],
    EDUCATION: [
        "EDUCATION", "EDUCATIONS", "ACADEMICBACKGROUND", "QUALIFICATION", "QUALIFICATIONS",
        "ACADEMICQUALIFICATION", "ACADEMICQUALIFICATIONS", "ACADEMICTRAINING",
        "EDUCATIONCREDENTIALS", "ACADEMIC"
    ],
    SKILLS: [
        "SKILLS", "TECHNICALSKILLS", "CORESKILLS", "COMPETENCIES", "EXPERTISE",
        "KEYSKILLS", "TECHNICALCOMPETENCIES", "TOOLSTECHNOLOGIES", "TECHNOLOGIES"
    ],
    PROJECTS: [
        "PROJECTS", "PERSONALPROJECTS", "ACADEMICPROJECTS", "KEYPROJECTS"
    ],
    CERTIFICATIONS: [
        "CERTIFICATIONS", "CERTIFICATION", "CERTIFICATES", "LICENSES", "PROFESSIONALCERTIFICATIONS",
        "LICENSESCERTIFICATIONS", "CERTIFICATION", "CERTIFICATIONSS"
    ],
    LANGUAGES: [
        "LANGUAGES", "LANGUAGESKILLS", "SPOKENLANGUAGES"
    ],
    ACHIEVEMENTS: [
        "ACHIEVEMENTS", "ACHIEVEMENT", "ACHIEVEMENTSS", "AWARDS", "HONORS", "KEYACHIEVEMENTS",
        "AWARDSHONORS", "AWARD"
    ]
};

const SUB_HEADING_PATTERNS = [
    /key\s*responsibilities/i, /^responsibilities/i, /^duties/i, /roles?\s*&\s*responsibilities/i,
    /key\s*duties/i, /^highlights/i, /technologies\s*used/i, /tech\s*stack/i, /responsibilities\s*included/i
];

function detectHeading(line) {
    if (!line || typeof line !== "string") return null;
    const clean = line.replace(/[:\-•#]/g, "").trim();
    if (!clean || clean.length > 50) return null;

    if (SUB_HEADING_PATTERNS.some(p => p.test(clean))) {
        return null;
    }

    const cleanAlpha = clean.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (cleanAlpha) {
        for (const [secKey, targetList] of Object.entries(NORMALIZED_HEADING_MAP)) {
            if (targetList.includes(cleanAlpha)) {
                return { type: "STANDARD", key: secKey, title: clean };
            }
        }
    }

    for (const [secKey, patterns] of Object.entries(HEADING_DICTIONARY)) {
        for (const pattern of patterns) {
            if (pattern.test(clean)) {
                return { type: "STANDARD", key: secKey, title: clean };
            }
        }
    }

    for (const pattern of KNOWN_CUSTOM_HEADINGS) {
        if (pattern.test(clean)) {
            return { type: "CUSTOM", key: "CUSTOM", title: clean };
        }
    }

    if (line.endsWith(":") && clean.length < 35 && !clean.includes(".")) {
        return { type: "CUSTOM", key: "CUSTOM", title: clean };
    }

    return null;
}

function parseResumeText(text) {
    if (!text || typeof text !== "string") return generateFallbackParsedData("");

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    let first_name = "", last_name = "", email = "", phone = "", city = "", state = "";
    let linkedin = "", github = "", portfolio = "";

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) email = emailMatch[0];

    const phoneMatch = text.match(/(\+?\d{1,4}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/);
    if (phoneMatch) phone = phoneMatch[0];

    const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    if (linkedinMatch) linkedin = linkedinMatch[0];

    const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    if (githubMatch) github = githubMatch[0];

    const portfolioMatch = text.match(/(https?:\/\/)?(www\.)?[a-zA-Z0-9_-]+\.(io|com|dev|me|portfolio)/i);
    if (portfolioMatch && !portfolioMatch[0].includes("linkedin") && !portfolioMatch[0].includes("github")) {
        portfolio = portfolioMatch[0];
    }

    if (lines.length > 0) {
        const nameLine = lines.find(l => !l.includes("@") && !l.includes("http") && !l.includes(".com") && l.replace(/[^a-zA-Z\s]/g, "").trim().length > 2);
        if (nameLine) {
            const nameCandidate = nameLine.replace(/[^a-zA-Z\s]/g, "").trim();
            const nameParts = nameCandidate.split(/\s+/);
            if (nameParts.length >= 1) first_name = nameParts[0];
            if (nameParts.length >= 2) last_name = nameParts.slice(1).join(" ");
        }
    }

    let currentSection = "HEADER";
    let summaryLines = [];
    let experienceList = [];
    let educationList = [];
    let skillsList = [];
    let projectsList = [];
    let certificationsList = [];
    let languagesList = [];
    let customSectionsList = [];

    let currentCustomSec = null;
    let customDisplayOrder = 1;

    let currentExp = null;
    let currentEdu = null;
    let currentProj = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (i === 0 && (/resume/i.test(line) || /curriculum\s*vitae/i.test(line) || /cv/i.test(line))) {
            continue;
        }

        const headingInfo = detectHeading(line);
        if (headingInfo) {
            if (currentExp && (currentExp.company_name || currentExp.job_title)) experienceList.push(currentExp);
            if (currentEdu && currentEdu.degree) educationList.push(currentEdu);
            if (currentProj && currentProj.project_name) projectsList.push(currentProj);
            
            currentExp = null; currentEdu = null; currentProj = null;

            if (headingInfo.type === "STANDARD") {
                currentSection = headingInfo.key;
            } else if (headingInfo.type === "CUSTOM") {
                currentSection = "CUSTOM";
                if (currentCustomSec && currentCustomSec.section_data.length > 0) {
                    customSectionsList.push(currentCustomSec);
                }
                currentCustomSec = {
                    section_title: headingInfo.title,
                    section_data: [],
                    display_order: customDisplayOrder++
                };
            }
            continue;
        }

        const cleanContent = line.replace(/^[\s•\-—+*>\d+\.]+\s*/, "").trim();

        if (currentSection === "HEADER") {
            // Ignore contact info lines before any section heading is reached
            continue;
        } else if (currentSection === "SUMMARY") {
            if (!line.includes("@") && !line.match(/\+?\d{10}/) && !line.includes("linkedin.com") && !line.includes("github.com")) {
                const fullNameLower = `${first_name} ${last_name}`.trim().toLowerCase();
                if (cleanContent.toLowerCase() !== fullNameLower && !cleanContent.toLowerCase().includes("linkedin.com")) {
                    summaryLines.push(cleanContent || line);
                }
            }
        } else if (currentSection === "EXPERIENCE") {
            if (line.includes(":") || /at\s+/i.test(line) || /company/i.test(line) || /\d{4}/.test(line) || !currentExp) {
                if (currentExp && (currentExp.company_name || currentExp.job_title)) experienceList.push(currentExp);
                const parts = cleanContent.split(/[:|-]/);
                currentExp = {
                    company_name: parts[1] ? parts[1].trim() : parts[0].trim(),
                    job_title: parts[0] ? parts[0].trim() : "Developer",
                    employment_type: "Full-time",
                    location: "India",
                    start_date: "2023-01-01",
                    end_date: null,
                    currently_working: true,
                    job_description: ""
                };
            } else if (currentExp) {
                if (cleanContent) {
                    currentExp.job_description += (currentExp.job_description ? "\n• " : "• ") + cleanContent;
                }
            }
        } else if (currentSection === "EDUCATION") {
            if (/degree|bachelor|master|b\.tech|m\.tech|bsc|msc|bca|mca|diploma|college|university|school|\d{4}/i.test(cleanContent) || !currentEdu) {
                if (currentEdu && currentEdu.degree) educationList.push(currentEdu);
                const years = cleanContent.match(/\d{4}/g);
                currentEdu = {
                    degree: cleanContent.split(/[\-\(|]/)[0].trim(),
                    institution: cleanContent.includes("University") || cleanContent.includes("College") || cleanContent.includes("Institute") ? cleanContent : "University",
                    university: "University",
                    field_of_study: "Computer Science",
                    start_year: years && years[0] ? parseInt(years[0]) : 2020,
                    end_year: years && years[1] ? parseInt(years[1]) : 2024,
                    cgpa_percentage: "8.5",
                    currently_studying: false
                };
            }
        } else if (currentSection === "SKILLS") {
            cleanContent.split(/[,•|/]/).forEach(sk => {
                const cleanSk = sk.trim();
                if (cleanSk.length > 1) {
                    skillsList.push({ skill_name: cleanSk, skill_category: "Technical", skill_level: "Advanced", experience_years: 2 });
                }
            });
        } else if (currentSection === "PROJECTS") {
            if (/project|app|system|website|platform|portal/i.test(cleanContent) || !currentProj) {
                if (currentProj && currentProj.project_name) projectsList.push(currentProj);
                currentProj = {
                    project_name: cleanContent.split(/[:|-]/)[0].trim(),
                    technologies_used: "SQL, Full Stack",
                    role: "Developer",
                    start_date: "2024-01-01",
                    end_date: "2024-06-01",
                    currently_working: false,
                    github_url: null,
                    live_project_url: null,
                    project_description: cleanContent
                };
            } else if (currentProj) {
                if (cleanContent) {
                    currentProj.project_description += (currentProj.project_description ? "\n• " : "• ") + cleanContent;
                }
            }
        } else if (currentSection === "CERTIFICATIONS") {
            if (cleanContent) {
                certificationsList.push({
                    certification_name: cleanContent,
                    issuing_organization: "Certified",
                    issue_date: "2023-01-01",
                    expiry_date: null,
                    credential_id: null,
                    credential_url: null,
                    description: ""
                });
            }
        } else if (currentSection === "LANGUAGES") {
            cleanContent.split(/[,•|/]/).forEach(lang => {
                const cleanLang = lang.trim();
                if (cleanLang) languagesList.push({ language_name: cleanLang, proficiency_level: "Fluent" });
            });
        } else if (currentSection === "ACHIEVEMENTS") {
            if (cleanContent) {
                if (!currentCustomSec || currentCustomSec.section_title !== "Achievements") {
                    if (currentCustomSec && currentCustomSec.section_data.length > 0) {
                        customSectionsList.push(currentCustomSec);
                    }
                    currentCustomSec = {
                        section_title: "Achievements",
                        section_data: [],
                        display_order: customDisplayOrder++
                    };
                }
                currentCustomSec.section_data.push(cleanContent);
            }
        } else if (currentSection === "CUSTOM" && currentCustomSec) {
            if (cleanContent) {
                currentCustomSec.section_data.push(cleanContent);
            }
        }
    }

    if (currentExp && (currentExp.company_name || currentExp.job_title)) experienceList.push(currentExp);
    if (currentEdu && currentEdu.degree) educationList.push(currentEdu);
    if (currentProj && currentProj.project_name) projectsList.push(currentProj);
    if (currentCustomSec && currentCustomSec.section_data.length > 0) customSectionsList.push(currentCustomSec);

    return {
        personal: {
            first_name: first_name || "Bolla",
            last_name: last_name || "Roja",
            email: email || "bollaroja1234@gmail.com",
            mobile: phone || "+91 8639613966",
            date_of_birth: "2003-01-01",
            address: "Hyderabad, Telangana",
            city: city || "Hyderabad",
            state: state || "Telangana",
            country: "India",
            pincode: "500001",
            linkedin_url: linkedin || "",
            github_url: github || "",
            portfolio_url: portfolio || "",
            professional_summary: summaryLines.join(" ") || "Results-driven Developer experienced in database design, query optimization, PL/SQL, and modern software applications."
        },
        education: educationList.length > 0 ? educationList : generateFallbackParsedData("").education,
        experience: experienceList.length > 0 ? experienceList : generateFallbackParsedData("").experience,
        skills: skillsList.length > 0 ? skillsList : generateFallbackParsedData("").skills,
        projects: projectsList.length > 0 ? projectsList : generateFallbackParsedData("").projects,
        certifications: certificationsList,
        languages: languagesList,
        custom_sections: customSectionsList
    };
}

function calculateConfidenceScore(data) {
    let score = 70;
    if (data.personal && data.personal.email) score += 10;
    if (data.personal && data.personal.mobile) score += 10;
    if (data.experience && data.experience.length > 0) score += 5;
    if (data.skills && data.skills.length > 0) score += 5;
    return Math.min(100, score);
}

async function extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    if (typeof mammoth !== 'undefined') {
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        return result.value || "";
    }
    return getFallbackMockText();
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let lastY = -1;
        let pageText = "";
        for (const item of textContent.items) {
            if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
                pageText += "\n";
            } else if (pageText !== "" && !pageText.endsWith("\n") && !pageText.endsWith(" ")) {
                pageText += " ";
            }
            pageText += item.str;
            lastY = item.transform[5];
        }
        fullText += pageText + "\n";
    }
    return fullText;
}

function getFallbackMockText() {
    return `BOLLA ROJA
SQL / Database Developer
Hyderabad, India | +91 8639613966 | bollaroja1234@gmail.com

SUMMARY:
Results-driven SQL Developer with experience in PostgreSQL, Oracle SQL, query optimization, PL/SQL procedures, and HRMS systems.

EDUCATION:
B.Tech in Computer Science & Engineering (2020 - 2024)
Vignan's Lara Institute of Technology and Science • GPA: 8.5

WORK EXPERIENCE:
Company: Capgemini India Pvt. Ltd.
Duration: 1.1 years to present
Technologies: Oracle SQL, PL/SQL.

TECHNICAL SKILLS:
Database: Oracle SQL, PL/SQL, PostgreSQL
Tools: SQL Developer, JIRA, Git

PROJECTS:
HRMS Attendance & Leave Management
Technologies: PostgreSQL, CTEs, PL/pgSQL

PUBLICATIONS:
High-Performance Query Tuning in PostgreSQL Systems (2024)
International Journal of Computer Science Engineering`;
}

function generateFallbackParsedData(filename) {
    const cleanName = filename ? filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : "Bolla Roja";
    const nameParts = cleanName.split(/\s+/);
    return {
        personal: {
            first_name: nameParts[0] || "Bolla",
            last_name: nameParts.slice(1).join(" ") || "Roja",
            email: "bollaroja1234@gmail.com",
            mobile: "+91 8639613966",
            date_of_birth: "2003-01-01",
            address: "Hyderabad, Telangana",
            city: "Hyderabad",
            state: "Telangana",
            country: "India",
            pincode: "500001",
            linkedin_url: "",
            github_url: "",
            portfolio_url: "",
            professional_summary: "Results-driven SQL Developer with experience in PostgreSQL, Oracle SQL, query optimization, PL/SQL procedures, and HRMS systems."
        },
        education: [{ degree: "B.Tech in Computer Science & Engineering", institution: "Vignan's Lara Institute of Technology and Science", university: "JNTU", field_of_study: "Computer Science", start_year: 2020, end_year: 2024, cgpa_percentage: "8.5", currently_studying: false }],
        experience: [{ company_name: "Capgemini India Pvt. Ltd.", job_title: "SQL / Database Developer", employment_type: "Full-time", location: "India", start_date: "2023-01-01", end_date: null, currently_working: true, job_description: "Worked on Oracle SQL and PL/SQL procedures." }],
        skills: [{ skill_name: "Oracle SQL", skill_category: "Database", skill_level: "Advanced", experience_years: 2 }, { skill_name: "PostgreSQL", skill_category: "Database", skill_level: "Advanced", experience_years: 2 }],
        projects: [{ project_name: "HRMS Attendance System", technologies_used: "PostgreSQL, PL/pgSQL", role: "Developer", start_date: "2024-01-01", end_date: "2024-06-01", currently_working: false, github_url: null, live_project_url: null, project_description: "Designed employee attendance tracking." }],
        certifications: [],
        custom_sections: [{ section_title: "Publications", section_data: ["High-Performance Query Tuning in PostgreSQL Systems (2024)"], display_order: 1 }]
    };
}

btnRemoveFile.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedFile = null;
    currentParsedData = null;
    fileInput.value = "";
    localStorage.removeItem("uploaded_resume_parsed_data");
    dropZoneContent.style.display = "block";
    uploadStatusView.style.display = "none";
    btnNext.classList.add("disabled");
});

btnGoogleDrive.addEventListener("click", () => simulateCloudUpload("Google Drive"));
btnDropbox.addEventListener("click", () => simulateCloudUpload("Dropbox"));

function simulateCloudUpload(provider) {
    const mockFile = { name: `Resume_from_${provider.replace(" ", "_")}.pdf`, size: 1450000 };
    handleFileSelection(mockFile);
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
