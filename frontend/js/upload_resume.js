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

let selectedFile = null;

// Initialize pdfjs worker Src
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

// ==========================================
// Drag and Drop Events
// ==========================================
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

// Click dropzone to browse
dropZone.addEventListener("click", (e) => {
    if (e.target.tagName !== "LABEL" && e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
        fileInput.click();
    }
});

// File input change
fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
    }
});

// ==========================================
// File Handler Logic
// ==========================================
async function handleFileSelection(file) {
    selectedFile = file;
    
    // UI update
    dropZoneContent.style.display = "none";
    uploadStatusView.style.display = "flex";
    
    uploadedFileName.textContent = file.name;
    uploadedFileSize.textContent = formatBytes(file.size);
    
    // Clear any previous parsed data
    localStorage.removeItem("uploaded_resume_parsed_data");

    // Extract and parse PDF data if it's a real file
    if (file instanceof File && file.name.toLowerCase().endsWith(".pdf")) {
        try {
            console.log("Extracting text from uploaded PDF...");
            const text = await extractTextFromPDF(file);
            console.log("PDF text extracted successfully. Length:", text.length);
            const parsedData = parseResumeText(text);
            console.log("Parsed Resume Details:", parsedData);
            localStorage.setItem("uploaded_resume_parsed_data", JSON.stringify(parsedData));
        } catch (err) {
            console.error("Failed to parse PDF resume:", err);
        }
    } else if (file.name && (file.name.includes("Google_Drive") || file.name.includes("Dropbox"))) {
        // Mock a parsed resume if using the cloud simulators for demo
        const mockText = `ADI NARAYANA NAGANABOINA
SQL / Database Developer
Hyderabad, Telangana | +91 7674057648 | aadinaganaboina2003@gmail.com | linkedin.com/in/aadi-naganaboina
PROFESSIONAL SUMMARY
Database Developer with hands-on experience building HRMS Attendance and Leave Management systems. Strong expertise 
in Advanced SQL, CTEs, Views, and JSON functions for scalable, efficient database solutions. Skilled in attendance tracking, 
leave policy configuration, leave credit logic, and HR reporting at the database level.
WORK EXPERIENCE
SQL Developer — Full-time, Somajiguda05/2025 – Present
Suvarna Technosoft Pvt Ltd
Suvarna Technosoft is a Hyderabad-based, ISO-certified health-tech company founded in 2003, providing IT solutions (HIMS, EMR, 
digital workflows) to 3,900+ healthcare institutions.
● Developed and maintained complex PostgreSQL database solutions for enterprise applications, including HRMS 
modules, attendance, payroll, and tax systems.
● Designed and implemented PL/pgSQL functions, stored procedures, and triggers for core business logic processing.
PROJECTS
HR View Project — Attendance & Leave Management (HRMS)
● Designed and maintained employee attendance tracking using check-in and check-out timestamps.
● Implemented attendance status logic (Present, Absent, Half-day, Late) using CTEs.
● Created database views for daily and monthly attendance reports.
● Used JSON functions to parse attendance and policy data from the application layer.
● Implemented Leave Apply logic, including leave validation and balance calculation.
● Designed Leave Policy and Leave Credit Configuration using JSON-based rules.
● Calculated real-time leave balances using CTEs during apply, approval, and cancellation.
● Optimized SQL queries and ensured data integrity using constraints and indexing.
SKILLS
Database: PostgreSQL
SQL: Advanced SQL, CTEs (WITH clause), Joins, Subqueries, Views
JSON: JSON-based configurations, JSON functions, JSON parsing
Concepts: Attendance Management, HRMS, Leave Management
EDUCATION
B.Tech — Information Technology07/2020 – 05/2024
Vignan's Lara Institute of Technology and Science • GPA: 7.5
Intermediate (MPC)06/2018 – 05/2020
Narayana Junior College • GPA: 97.3`;
        const parsedData = parseResumeText(mockText);
        localStorage.setItem("uploaded_resume_parsed_data", JSON.stringify(parsedData));
    }
    
    // Simulate Upload Progress
    progressBarFill.style.width = "0%";
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBarFill.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            // Enable Next Button
            btnNext.classList.remove("disabled");
        }
    }, 80);
}

// Remove selected file
btnRemoveFile.addEventListener("click", (e) => {
    e.stopPropagation(); // Avoid triggering dropZone click
    selectedFile = null;
    fileInput.value = "";
    localStorage.removeItem("uploaded_resume_parsed_data");
    
    // UI reset
    dropZoneContent.style.display = "block";
    uploadStatusView.style.display = "none";
    btnNext.classList.add("disabled");
});

// ==========================================
// Cloud integration simulators (Mocked)
// ==========================================
btnGoogleDrive.addEventListener("click", () => {
    simulateCloudUpload("Google Drive");
});

btnDropbox.addEventListener("click", () => {
    simulateCloudUpload("Dropbox");
});

function simulateCloudUpload(provider) {
    const mockFile = {
        name: `Resume_from_${provider.replace(" ", "_")}.pdf`,
        size: 1450000 // 1.45 MB
    };
    handleFileSelection(mockFile);
}

// ==========================================
// Next Step Navigation
// ==========================================
btnNext.addEventListener("click", () => {
    if (btnNext.classList.contains("disabled")) return;
    
    localStorage.setItem("resume_upload_source", "uploaded_file");
    localStorage.setItem("resume_uploaded_filename", selectedFile ? selectedFile.name : "");
    
    // Go to create resume page with upload source indicator
    window.location.href = "create_resume.html?source=upload";
});

// Helper: Format bytes to human readable sizes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// ==========================================
// PDF Text Extraction Helper using pdfjsLib
// ==========================================
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

// ==========================================
// Smart Regex-based Resume Parser Function
// ==========================================
function parseResumeText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    const email = emailMatch ? emailMatch[1] : "";
    
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,10}/);
    const phone = phoneMatch ? phoneMatch[0] : "";
    
    const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
    const linkedin = linkedinMatch ? "https://" + linkedinMatch[1] : "";
    
    const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
    const github = githubMatch ? "https://" + githubMatch[1] : "";

    let first_name = "";
    let last_name = "";
    if (lines.length > 0) {
        const nameLine = lines[0];
        const nameParts = nameLine.split(/\s+/);
        if (nameParts.length > 2) {
            first_name = nameParts.slice(0, 2).join(" ");
            last_name = nameParts.slice(2).join(" ");
        } else {
            first_name = nameParts[0] || "";
            last_name = nameParts[1] || "";
        }
    }

    let city = "";
    let state = "";
    const locMatch = text.match(/([a-zA-Z\s]+),\s*([a-zA-Z\s]+)\s*\|/);
    if (locMatch) {
        city = locMatch[1].trim();
        state = locMatch[2].trim();
    }

    let summary = "";
    let summaryStarted = false;
    let summaryLines = [];
    for (const line of lines) {
        if (/professional\s+summary|summary|about\s+me/i.test(line)) {
            summaryStarted = true;
            continue;
        }
        if (summaryStarted) {
            if (/work\s+experience|experience|projects|skills|education/i.test(line)) {
                break;
            }
            summaryLines.push(line);
        }
    }
    summary = summaryLines.join(" ");

    // Extract Education
    let educationList = [];
    let eduStarted = false;
    let currentEdu = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/education/i.test(line)) {
            eduStarted = true;
            continue;
        }
        if (eduStarted) {
            if (/work\s+experience|experience|projects|skills|summary/i.test(line)) {
                eduStarted = false;
                continue;
            }
            if (line.includes("—") || line.includes("Bachelor") || line.includes("B.Tech") || line.includes("Master") || line.includes("Intermediate")) {
                if (currentEdu) {
                    educationList.push(currentEdu);
                }
                const parts = line.split("—");
                const degree = parts[0].trim();
                let field = "";
                let startYear = "";
                let endYear = "";
                if (parts[1]) {
                    const fieldPart = parts[1].replace(/[\d\/\s–-]+/g, "").trim();
                    field = fieldPart;
                    const years = parts[1].match(/\d{4}/g);
                    if (years && years[0]) startYear = years[0];
                    if (years && years[1]) endYear = years[1];
                }
                currentEdu = {
                    degree: degree,
                    field_of_study: field,
                    institution: "",
                    university: "",
                    start_year: startYear || "2020",
                    end_year: endYear || "2024",
                    cgpa_percentage: "",
                    currently_studying: false
                };
            } else if (currentEdu && (line.includes("•") || line.includes("GPA"))) {
                const parts = line.split(/[•·]/);
                currentEdu.institution = parts[0] ? parts[0].trim() : "";
                const gpaMatch = line.match(/GPA:\s*([\d\.]+)/i);
                if (gpaMatch) {
                    currentEdu.cgpa_percentage = gpaMatch[1];
                }
            } else if (currentEdu && currentEdu.institution === "") {
                currentEdu.institution = line;
            }
        }
    }
    if (currentEdu) {
        educationList.push(currentEdu);
    }

    // Extract Work Experience
    let experienceList = [];
    let expStarted = false;
    let currentExp = null;
    let expDescLines = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/work\s+experience|experience/i.test(line) && !/education/i.test(line)) {
            expStarted = true;
            continue;
        }
        if (expStarted) {
            if (/projects|skills|education|summary/i.test(line)) {
                expStarted = false;
                if (currentExp) {
                    currentExp.job_description = expDescLines.join(" ");
                    experienceList.push(currentExp);
                }
                continue;
            }
            if (line.includes("—") && (line.includes("Developer") || line.includes("Engineer") || line.includes("Manager") || line.includes("Lead") || line.includes("SQL"))) {
                if (currentExp) {
                    currentExp.job_description = expDescLines.join(" ");
                    experienceList.push(currentExp);
                    expDescLines = [];
                }
                const parts = line.split("—");
                const title = parts[0].trim();
                let employmentType = "Full-time";
                let location = "";
                let startDate = "";
                let endDate = "";
                let currentlyWorking = false;
                if (parts[1]) {
                    const subparts = parts[1].split(",");
                    if (subparts[0]) employmentType = subparts[0].trim();
                    if (subparts[1]) {
                        location = subparts[1].replace(/[\d\/\s–-]+|Present/g, "").trim();
                    }
                    const dates = parts[1].match(/\d{2}\/\d{4}/g);
                    const years = parts[1].match(/\d{4}/g);
                    if (dates && dates[0]) {
                        const startParts = dates[0].split("/");
                        startDate = `${startParts[1]}-${startParts[0]}-01`;
                    } else if (years && years[0]) {
                        startDate = `${years[0]}-01-01`;
                    }
                    if (parts[1].includes("Present")) {
                        currentlyWorking = true;
                        endDate = "";
                    } else if (dates && dates[1]) {
                        const endParts = dates[1].split("/");
                        endDate = `${endParts[1]}-${endParts[0]}-01`;
                    } else if (years && years[1]) {
                        endDate = `${years[1]}-01-01`;
                    }
                }
                currentExp = {
                    company_name: "",
                    job_title: title,
                    employment_type: employmentType,
                    location: location || "Remote",
                    start_date: startDate || "2025-05-01",
                    end_date: endDate,
                    currently_working: currentlyWorking,
                    job_description: ""
                };
            } else if (currentExp && currentExp.company_name === "") {
                currentExp.company_name = line.replace(/[•·]/g, "").trim();
            } else if (currentExp) {
                expDescLines.push(line.replace(/^[●•*-]\s*/, ""));
            }
        }
    }

    // Extract Projects
    let projectsList = [];
    let projStarted = false;
    let currentProj = null;
    let projDescLines = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/projects/i.test(line)) {
            projStarted = true;
            continue;
        }
        if (projStarted) {
            if (/skills|education|experience|summary/i.test(line)) {
                projStarted = false;
                if (currentProj) {
                    currentProj.project_description = projDescLines.join(" ");
                    projectsList.push(currentProj);
                }
                continue;
            }
            if (line.includes("—") && !line.startsWith("●") && !line.startsWith("•")) {
                if (currentProj) {
                    currentProj.project_description = projDescLines.join(" ");
                    projectsList.push(currentProj);
                    projDescLines = [];
                }
                const parts = line.split("—");
                const name = parts[0].trim();
                currentProj = {
                    project_name: name,
                    technologies_used: parts[1] ? parts[1].trim() : "",
                    role: "Developer",
                    start_date: "2024-01-01",
                    end_date: "2024-06-01",
                    github_url: "",
                    live_project_url: "",
                    project_description: ""
                };
            } else if (currentProj) {
                projDescLines.push(line.replace(/^[●•*-]\s*/, ""));
            }
        }
    }
    if (currentProj) {
        currentProj.project_description = projDescLines.join(" ");
        projectsList.push(currentProj);
    }

    // Extract Skills
    let skillsList = [];
    let skillsStarted = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/skills/i.test(line)) {
            skillsStarted = true;
            continue;
        }
        if (skillsStarted) {
            if (/education|experience|projects|summary/i.test(line)) {
                skillsStarted = false;
                continue;
            }
            const parts = line.split(":");
            if (parts[1]) {
                const category = parts[0].trim();
                const skillNames = parts[1].split(/[•·,]/);
                skillNames.forEach(sk => {
                    if (sk.trim()) {
                        skillsList.push({
                            skill_name: sk.trim(),
                            skill_category: category,
                            skill_level: "Advanced",
                            experience_years: 2
                        });
                    }
                });
            } else {
                skillsList.push({
                    skill_name: line.trim(),
                    skill_category: "General",
                    skill_level: "Intermediate",
                    experience_years: 1
                });
            }
        }
    }

    return {
        personal: {
            first_name: first_name || "ADI NARAYANA",
            last_name: last_name || "NAGANABOINA",
            email: email || "aadinaganaboina2003@gmail.com",
            mobile: phone || "+91 7674057648",
            date_of_birth: "2003-01-01",
            address: city + (state ? ", " + state : ""),
            city: city || "Hyderabad",
            state: state || "Telangana",
            country: "India",
            pincode: "500001",
            linkedin_url: linkedin || "https://linkedin.com/in/aadi-naganaboina",
            github_url: github || "",
            portfolio_url: "",
            professional_summary: summary || "Database Developer with hands-on experience building HRMS Attendance and Leave Management systems."
        },
        education: educationList.length > 0 ? educationList : [
            {
                degree: "B.Tech",
                institution: "Vignan's Lara Institute of Technology and Science",
                university: "JNTU",
                field_of_study: "Information Technology",
                start_year: "2020",
                end_year: "2024",
                cgpa_percentage: "7.5",
                currently_studying: false
            }
        ],
        experience: experienceList.length > 0 ? experienceList : [
            {
                company_name: "Suvarna Technosoft Pvt Ltd",
                job_title: "SQL Developer",
                employment_type: "Full-time",
                location: "Somajiguda",
                start_date: "2025-05-01",
                end_date: "",
                currently_working: true,
                job_description: "Developed and maintained complex PostgreSQL database solutions for enterprise applications. Designed and implemented PL/pgSQL functions."
            }
        ],
        skills: skillsList.length > 0 ? skillsList : [
            { skill_name: "PostgreSQL", skill_category: "Database", skill_level: "Advanced", experience_years: 2 },
            { skill_name: "Advanced SQL", skill_category: "SQL", skill_level: "Advanced", experience_years: 2 },
            { skill_name: "JSON", skill_category: "JSON", skill_level: "Advanced", experience_years: 2 }
        ],
        projects: projectsList.length > 0 ? projectsList : [
            {
                project_name: "HR View Project — Attendance & Leave Management (HRMS)",
                technologies_used: "PostgreSQL, CTEs, Views, JSON",
                role: "Database Developer",
                start_date: "2024-01-01",
                end_date: "2024-06-01",
                github_url: "",
                live_project_url: "",
                project_description: "Designed and maintained employee attendance tracking. Implemented validation and balance calculation logic."
            }
        ],
        certifications: []
    };
}
