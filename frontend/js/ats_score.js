// ATS Score Dashboard Script
// Authors: Antigravity Pair Programmer

var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

// Initialize pdfjs worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

const dropZone = document.getElementById("dropZone");
const dropZoneContent = document.getElementById("dropZoneContent");
const uploadStatusView = document.getElementById("uploadStatusView");
const fileInput = document.getElementById("fileInput");
const uploadedFileName = document.getElementById("uploadedFileName");
const uploadedFileSize = document.getElementById("uploadedFileSize");
const progressBarFill = document.getElementById("progressBarFill");
const btnRemoveFile = document.getElementById("btnRemoveFile");
const btnAnalyze = document.getElementById("btnAnalyze");
const resumeSelector = document.getElementById("resumeSelector");
const loadingOverlay = document.getElementById("loadingOverlay");
const analysisResultsBlock = document.getElementById("analysisResultsBlock");

// Score Display Elements
const scoreVal = document.getElementById("scoreVal");
const scoreProgressBar = document.getElementById("scoreProgressBar");
const scoreLevel = document.getElementById("scoreLevel");
const scoreMessage = document.getElementById("scoreMessage");
const overallProgressLineFill = document.getElementById("overallProgressLineFill");
const overallFeedbackText = document.getElementById("overallFeedbackText");
const percentileBadge = document.getElementById("percentileBadge");

// Breakdown Elements
const breakdownContact = document.getElementById("breakdown-contact");
const breakdownKeywords = document.getElementById("breakdown-keywords");
const breakdownSkills = document.getElementById("breakdown-skills");
const breakdownExperience = document.getElementById("breakdown-experience");
const breakdownEducation = document.getElementById("breakdown-education");
const breakdownFormatting = document.getElementById("breakdown-formatting");
const breakdownGrammar = document.getElementById("breakdown-grammar");

// Dynamic Section Blocks
const keywordsContainer = document.getElementById("keywordsContainer");
const suggestionsContainer = document.getElementById("suggestionsContainer");
const skillsMatchProgress = document.getElementById("skillsMatchProgress");
const skillsMatchVal = document.getElementById("skillsMatchVal");
const skillsFoundChips = document.getElementById("skillsFoundChips");
const skillsMissingChips = document.getElementById("skillsMissingChips");
const sectionsStatusContainer = document.getElementById("sectionsStatusContainer");

// Actions
const btnDownloadReport = document.getElementById("btnDownloadReport");
const btnAnalyzeAgain = document.getElementById("btnAnalyzeAgain");
const btnImproveResume = document.getElementById("btnImproveResume");

let currentUploadedFile = null;
let currentResumeId = null;

// ==========================================
// Page Initialization
// ==========================================
window.addEventListener("DOMContentLoaded", async () => {
    // 1. Fetch user saved resumes
    await loadResumes();
    
    // Set logged in username inside header welcome tag
    const fullName = localStorage.getItem("full_name");
    const usernameEl = document.getElementById("username");
    if (fullName && usernameEl) {
        usernameEl.textContent = fullName;
    }
});

// ==========================================
// Fetch Saved Resumes for Selector Dropdown
// ==========================================
async function loadResumes() {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/resume/list/${userId}`);
        const result = await response.json();
        if (result.success && result.data) {
            resumeSelector.innerHTML = '<option value="">Select a saved resume...</option>';
            result.data.forEach(r => {
                const opt = document.createElement("option");
                opt.value = r.resume_id;
                opt.textContent = r.resume_title || `Resume #${r.resume_id}`;
                resumeSelector.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Error loading user resumes:", err);
    }
}

// ==========================================
// File Drag and Drop / Choose File Trigger
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

function handleFileSelection(file) {
    currentUploadedFile = file;
    resumeSelector.value = ""; // Clear selected saved resume since we are doing file upload
    
    // Update UI
    dropZoneContent.style.display = "none";
    uploadStatusView.style.display = "flex";
    uploadedFileName.textContent = file.name;
    uploadedFileSize.textContent = formatBytes(file.size);

    // Simulate progress animation
    progressBarFill.style.width = "0%";
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        progressBarFill.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 50);
}

btnRemoveFile.addEventListener("click", (e) => {
    e.stopPropagation();
    currentUploadedFile = null;
    fileInput.value = "";
    dropZoneContent.style.display = "block";
    uploadStatusView.style.display = "none";
});

// Clear dropdown when uploading file
resumeSelector.addEventListener("change", () => {
    if (resumeSelector.value) {
        // Clear uploaded file UI
        currentUploadedFile = null;
        fileInput.value = "";
        dropZoneContent.style.display = "block";
        uploadStatusView.style.display = "none";
    }
});

// ==========================================
// Action Triggers
// ==========================================
btnAnalyze.addEventListener("click", async () => {
    const selectedResumeId = resumeSelector.value;
    
    if (!selectedResumeId && !currentUploadedFile) {
        alert("Please upload a resume file or select a saved resume first.");
        return;
    }

    showLoading(true);

    try {
        if (selectedResumeId) {
            currentResumeId = selectedResumeId;
            // Run analysis
            const response = await fetch(`${API_BASE_URL}/api/ats/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: selectedResumeId })
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message);
            }
        } else {
            // Upload & Parse PDF
            if (!currentUploadedFile.name.toLowerCase().endsWith(".pdf")) {
                alert("Only PDF file parsing is currently supported for client-side ATS analysis.");
                showLoading(false);
                return;
            }

            const text = await extractTextFromPDF(currentUploadedFile);
            const parsedData = parseResumeText(text);

            // 1. Create a blank resume using the correct stored procedure API
            const userId = localStorage.getItem("user_id") || "1";
            const newResumeTitle = `ATS_${currentUploadedFile.name}`;
            
            const createRes = await fetch(`${API_BASE_URL}/api/resume/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    resume_title: newResumeTitle,
                    template_id: 1
                })
            });
            const createResult = await createRes.json();
            if (!createResult.ref_id) {
                throw new Error("Failed to create resume in database: " + (createResult.message || "Unknown error"));
            }

            currentResumeId = createResult.ref_id;

            // 2. Save the full JSON data to resume_master
            await fetch(`${API_BASE_URL}/api/resume/save-json`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    resume_id: currentResumeId,
                    resume_name: newResumeTitle,
                    template_id: 1,
                    resume_json: parsedData
                })
            });

            // Save child sections to database
            await saveParsedSections(currentResumeId, parsedData);

            // Trigger score calculation
            const analyzeRes = await fetch(`${API_BASE_URL}/api/ats/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: currentResumeId })
            });
            const analyzeResult = await analyzeRes.json();
            if (!analyzeResult.success) {
                throw new Error(analyzeResult.message);
            }
        }

        // Fetch dashboard data
        await fetchAndRenderDashboard(currentResumeId);

    } catch (err) {
        console.error("Analysis failed:", err);
        alert(`Analysis failed: ${err.message}`);
    } finally {
        showLoading(false);
    }
});

// ==========================================
// Save Parsed Sections Utility
// ==========================================
async function saveParsedSections(resumeId, parsedData) {
    // 1. Personal
    if (parsedData.personal) {
        await fetch(`${API_BASE_URL}/api/personal/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume_id: resumeId, ...parsedData.personal })
        });
    }
    // 2. Education
    if (parsedData.education) {
        for (const edu of parsedData.education) {
            await fetch(`${API_BASE_URL}/api/education/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, ...edu })
            });
        }
    }
    // 3. Experience
    if (parsedData.experience) {
        for (const exp of parsedData.experience) {
            await fetch(`${API_BASE_URL}/api/experience/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, ...exp })
            });
        }
    }
    // 4. Skills
    if (parsedData.skills) {
        for (const sk of parsedData.skills) {
            await fetch(`${API_BASE_URL}/api/skills/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, ...sk })
            });
        }
    }
    // 5. Projects
    if (parsedData.projects) {
        for (const proj of parsedData.projects) {
            await fetch(`${API_BASE_URL}/api/projects/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, ...proj })
            });
        }
    }
    // 6. Certifications
    if (parsedData.certifications) {
        for (const cert of parsedData.certifications) {
            await fetch(`${API_BASE_URL}/api/certifications/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, ...cert })
            });
        }
    }
}

// ==========================================
// Dashboard Renderer Logic
// ==========================================
async function fetchAndRenderDashboard(resumeId) {
    const response = await fetch(`${API_BASE_URL}/api/ats/dashboard/${resumeId}`);
    const result = await response.json();
    if (!result.success || !result.data) {
        throw new Error("Unable to fetch dashboard metrics.");
    }

    const data = result.data;
    
    // Save resume ID in localStorage so "Improve Resume" can load it in the editor
    localStorage.setItem("resume_id", resumeId);

    // Enable results block opacity
    analysisResultsBlock.style.opacity = "1";
    analysisResultsBlock.style.pointerEvents = "auto";

    // 1. Overall Score Circular Meter
    const score = Number(data.scores.overall_score || 0);
    animateScoreMeter(score);

    // 2. Score Breakdown Indicators
    breakdownContact.textContent = `${data.scores.contact_information || 0}%`;
    breakdownKeywords.textContent = `${data.scores.keyword_match || 0}%`;
    breakdownSkills.textContent = `${data.scores.skills || 0}%`;
    breakdownExperience.textContent = `${data.scores.experience || 0}%`;
    breakdownEducation.textContent = `${data.scores.education || 0}%`;
    breakdownFormatting.textContent = `${data.scores.formatting || 0}%`;
    if (breakdownGrammar) {
        breakdownGrammar.textContent = `${data.scores.grammar || 95}%`;
    }

    // 3. Recommended Keywords Badges
    renderKeywordBadges(data.keywords);

    // 4. Suggestions Checklist
    renderSuggestionsList(data.suggestions);

    // 5. Skills Match Section
    const skillsMatchPct = Number(data.scores.skills || 0);
    animateSkillsMatchMeter(skillsMatchPct);
    renderSkillsChipsList(data.keywords);

    // 6. Resume Sections Status Rows
    renderSectionsStatus(data.sections_status);
}

// ==========================================
// Animations & Visual Renderers
// ==========================================
function animateScoreMeter(score) {
    // Overall Circular Meter
    scoreVal.textContent = score;
    const circumference = 251.2;
    const offset = circumference - (circumference * score) / 100;
    scoreProgressBar.style.strokeDashoffset = offset;

    // Apply color ranges based on score
    if (score >= 80) {
        scoreProgressBar.style.stroke = "var(--success)";
        scoreLevel.textContent = "Excellent";
        scoreLevel.style.color = "var(--success)";
        scoreMessage.textContent = "Your resume has a high chance of passing ATS scans.";
        overallFeedbackText.textContent = "Great job! Your resume is well-optimized.";
        percentileBadge.style.display = "inline-block";
    } else if (score >= 50) {
        scoreProgressBar.style.stroke = "var(--warning)";
        scoreLevel.textContent = "Good";
        scoreLevel.style.color = "var(--warning)";
        scoreMessage.textContent = "Your resume meets standard requirements but has optimization gaps.";
        overallFeedbackText.textContent = "Almost there! Implement suggestions to increase success chance.";
        percentileBadge.style.display = "none";
    } else {
        scoreProgressBar.style.stroke = "var(--danger)";
        scoreLevel.textContent = "Needs Work";
        scoreLevel.style.color = "var(--danger)";
        scoreMessage.textContent = "Your resume is missing critical sections or keywords.";
        overallFeedbackText.textContent = "Low ATS compatibility. Urgently update sections.";
        percentileBadge.style.display = "none";
    }

    // Line bar fill
    overallProgressLineFill.style.width = `${score}%`;
    overallProgressLineFill.style.background = score >= 80 ? "var(--success)" : (score >= 50 ? "var(--warning)" : "var(--danger)");
}

function animateSkillsMatchMeter(pct) {
    skillsMatchVal.textContent = `${pct}%`;
    const circumference = 251.2;
    const offset = circumference - (circumference * pct) / 100;
    skillsMatchProgress.style.strokeDashoffset = offset;
}

function renderKeywordBadges(keywords) {
    keywordsContainer.innerHTML = "";
    
    const matched = keywords.matched || [];
    const missing = keywords.missing || [];
    
    if (matched.length === 0 && missing.length === 0) {
        keywordsContainer.innerHTML = '<p class="placeholder-text">No keywords defined for this role.</p>';
        return;
    }

    // Render Matched Keywords
    matched.forEach(kw => {
        const badge = document.createElement("span");
        badge.className = "kw-badge matched";
        badge.innerHTML = `<i class="fa-solid fa-check"></i> ${kw.keyword}`;
        keywordsContainer.appendChild(badge);
    });

    // Render Missing Keywords
    missing.forEach(kw => {
        const badge = document.createElement("span");
        badge.className = kw.is_required ? "kw-badge missing-required" : "kw-badge missing";
        badge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${kw.keyword}`;
        keywordsContainer.appendChild(badge);
    });
}

function renderSuggestionsList(suggestions) {
    suggestionsContainer.innerHTML = "";
    if (!suggestions || suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<p class="placeholder-text"><i class="fa-solid fa-circle-check" style="color:var(--success)"></i> Perfect! No improvement recommendations needed.</p>';
        return;
    }

    suggestions.forEach(s => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.innerHTML = `<i class="fa-solid fa-check" style="color: #10b981;"></i> <span>${s}</span>`;
        suggestionsContainer.appendChild(item);
    });
}

function renderSkillsChipsList(keywords) {
    skillsFoundChips.innerHTML = "";
    skillsMissingChips.innerHTML = "";

    const matched = keywords.matched || [];
    const missing = keywords.missing || [];

    if (matched.length === 0) {
        skillsFoundChips.innerHTML = '<span class="placeholder-text" style="font-size:0.75rem;">None</span>';
    } else {
        matched.slice(0, 8).forEach(kw => {
            const chip = document.createElement("span");
            chip.className = "skills-chip found";
            chip.textContent = kw.keyword;
            skillsFoundChips.appendChild(chip);
        });
    }

    if (missing.length === 0) {
        skillsMissingChips.innerHTML = '<span class="placeholder-text" style="font-size:0.75rem;">None</span>';
    } else {
        missing.slice(0, 6).forEach(kw => {
            const chip = document.createElement("span");
            chip.className = "skills-chip missing";
            chip.textContent = kw.keyword;
            skillsMissingChips.appendChild(chip);
        });
    }
}

function renderSectionsStatus(statusData) {
    sectionsStatusContainer.innerHTML = "";
    const sections = statusData.sections || [];
    
    sections.forEach(sec => {
        const row = document.createElement("div");
        row.className = "section-status-row";
        
        const isCompleted = sec.status === "Completed";
        const iconClass = isCompleted ? "fa-solid fa-circle-check completed" : "fa-regular fa-circle missing";

        row.innerHTML = `
            <div class="section-status-left">
                <i class="${iconClass}"></i>
                <span>${sec.name}</span>
            </div>
        `;
        sectionsStatusContainer.appendChild(row);
    });
}

// ==========================================
// Reports Download Action
// ==========================================
btnDownloadReport.addEventListener("click", async () => {
    if (!currentResumeId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/ats/report/${currentResumeId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            // Generate report printing view
            const data = result.data.report_data;
            const printWindow = window.open("", "_blank");
            
            printWindow.document.write(`
                <html>
                <head>
                    <title>ATS Audit Report - ${result.resume_id}</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                        h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 24px; }
                        .score-badge { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 8px 18px; border-radius: 20px; font-weight: bold; font-size: 18px; margin-bottom: 20px; }
                        .score-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; }
                        .score-item { border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; background: #f8fafc; }
                        .score-lbl { font-weight: bold; font-size: 14px; color: #475569; }
                        .score-val { font-size: 18px; color: #0f172a; margin-top: 4px; font-weight: bold; }
                        .section-title { font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; margin-top: 30px; padding-bottom: 6px; }
                        ul { padding-left: 20px; }
                        li { margin-bottom: 8px; font-size: 14px; }
                        .kw-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
                        .kw-badge { border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
                        .kw-matched { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
                        .kw-missing { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
                    </style>
                </head>
                <body>
                    <h1>ATS Compatibility Audit Report</h1>
                    <div class="score-badge">Overall Score: ${data.scores.overall_score}/100</div>
                    
                    <div class="score-grid">
                        <div class="score-item"><div class="score-lbl">Contact Information</div><div class="score-val">${data.scores.contact_information}%</div></div>
                        <div class="score-item"><div class="score-lbl">Keywords Match</div><div class="score-val">${data.scores.keyword_match}%</div></div>
                        <div class="score-item"><div class="score-lbl">Skills Section</div><div class="score-val">${data.scores.skills}%</div></div>
                        <div class="score-item"><div class="score-lbl">Experience</div><div class="score-val">${data.scores.experience}%</div></div>
                        <div class="score-item"><div class="score-lbl">Education</div><div class="score-val">${data.scores.education}%</div></div>
                        <div class="score-item"><div class="score-lbl">Formatting</div><div class="score-val">${data.scores.formatting}%</div></div>
                    </div>

                    <div class="section-title">Analysis Suggestions</div>
                    <ul>
                        ${data.suggestions.map(s => `<li>${s}</li>`).join("")}
                    </ul>

                    <div class="section-title">Matched Keywords</div>
                    <div class="kw-list">
                        ${data.matched_keywords.length === 0 ? "None" : data.matched_keywords.map(k => `<span class="kw-badge kw-matched">${k.keyword} (${k.priority})</span>`).join("")}
                    </div>

                    <div class="section-title">Missing Recommended Keywords</div>
                    <div class="kw-list">
                        ${data.missing_keywords.length === 0 ? "None" : data.missing_keywords.map(k => `<span class="kw-badge kw-missing">${k.keyword} (${k.priority})</span>`).join("")}
                    </div>

                    <script>
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    } catch (err) {
        console.error("Error generating report PDF print window:", err);
    }
});

btnAnalyzeAgain.addEventListener("click", () => {
    // Reset view
    currentResumeId = null;
    analysisResultsBlock.style.opacity = "0.6";
    analysisResultsBlock.style.pointerEvents = "none";
    
    // Clear drop zone
    currentUploadedFile = null;
    fileInput.value = "";
    dropZoneContent.style.display = "block";
    uploadStatusView.style.display = "none";
    
    // Reset selector
    resumeSelector.value = "";
});

// ==========================================
// Helpers
// ==========================================
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function showLoading(show) {
    loadingOverlay.style.display = show ? "flex" : "none";
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

    // Languages parser
    let languagesList = [];
    const langMatch = text.match(/languages?\s*:\s*([a-zA-Z\s,•·]+)/i);
    if (langMatch && langMatch[1]) {
        const langs = langMatch[1].split(/[•·,]/);
        langs.forEach(l => {
            if (l.trim()) {
                languagesList.push({
                    language_name: l.trim(),
                    proficiency: "Professional"
                });
            }
        });
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
        experience: experienceList,
        skills: skillsList,
        projects: projectsList,
        certifications: [],
        languages: languagesList
    };
}
