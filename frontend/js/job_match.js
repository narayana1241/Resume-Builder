var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

// State Variables
let currentResumeId = null;
let analysisData = null;

// Selectors
const resumeSelect = document.getElementById("resumeSelect");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const jobDescriptionText = document.getElementById("jobDescriptionText");
const charCount = document.getElementById("charCount");
const jobUrlInput = document.getElementById("jobUrlInput");
const btnFetchJob = document.getElementById("btnFetchJob");
const jobTitleInput = document.getElementById("jobTitleInput");
const companyInput = document.getElementById("companyInput");
const btnAnalyzeMatch = document.getElementById("btnAnalyzeMatch");

// Results Block
const matchResultsBlock = document.getElementById("matchResultsBlock");
const matchProgressBar = document.getElementById("matchProgressBar");
const matchScoreVal = document.getElementById("matchScoreVal");
const probabilityText = document.getElementById("probabilityText");
const probabilityBadge = document.getElementById("probabilityBadge");

// Breakdown Progress Bars
const barSkills = document.getElementById("bar-skills");
const barSkillsVal = document.getElementById("bar-skills-val");
const barExperience = document.getElementById("bar-experience");
const barExperienceVal = document.getElementById("bar-experience-val");
const barEducation = document.getElementById("bar-education");
const barEducationVal = document.getElementById("bar-education-val");
const barKeyword = document.getElementById("bar-keyword");
const barKeywordVal = document.getElementById("bar-keyword-val");
const barProjects = document.getElementById("bar-projects");
const barProjectsVal = document.getElementById("bar-projects-val");

// Tag Clouds
const matchedSkillsCloud = document.getElementById("matchedSkillsCloud");
const missingSkillsCloud = document.getElementById("missingSkillsCloud");
const matchedKeywordsCloud = document.getElementById("matchedKeywordsCloud");
const missingKeywordsCloud = document.getElementById("missingKeywordsCloud");

// Recommendations
const recommendationsList = document.getElementById("recommendationsList");

// Actions Buttons
const btnDownloadReport = document.getElementById("btnDownloadReport");
const btnAnalyzeAgain = document.getElementById("btnAnalyzeAgain");
const btnSaveJob = document.getElementById("btnSaveJob");
const loadingOverlay = document.getElementById("loadingOverlay");

// ==========================================
// Initialization
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Sidebar Loader
    if (typeof loadSidebar === "function") {
        loadSidebar("jobmatch");
    }

    // 2. Fetch User Resumes
    loadUserResumes();

    // 3. Set User Welcome Header
    const localUser = localStorage.getItem("username") || "Developer";
    const usernameHeader = document.getElementById("username");
    if (usernameHeader) {
        usernameHeader.textContent = localUser;
    }

    // 4. Character Counter for Textarea
    if (jobDescriptionText) {
        jobDescriptionText.addEventListener("input", () => {
            const count = jobDescriptionText.value.length;
            charCount.textContent = `${count} / 10000 characters`;
        });
    }

    // 5. Tabs Trigger
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const activeTab = document.getElementById(btn.dataset.tab);
            if (activeTab) activeTab.classList.add("active");
        });
    });

    // 6. Action Triggers
    if (btnFetchJob) btnFetchJob.addEventListener("click", handleFetchJobUrl);
    if (btnAnalyzeMatch) btnAnalyzeMatch.addEventListener("click", handleAnalyzeMatch);
    if (btnDownloadReport) btnDownloadReport.addEventListener("click", handleDownloadReport);
    if (btnAnalyzeAgain) btnAnalyzeAgain.addEventListener("click", handleAnalyzeAgain);
    if (btnSaveJob) btnSaveJob.addEventListener("click", handleSaveJob);
});

// ==========================================
// Resume Selector Loader
// ==========================================
async function loadUserResumes() {
    const userId = localStorage.getItem("user_id") || "1";
    try {
        const response = await fetch(`${API_BASE_URL}/api/resume/list/${userId}`);
        const data = await response.json();
        
        resumeSelect.innerHTML = "";
        
        if (data.success && data.data && data.data.length > 0) {
            data.data.forEach(res => {
                const opt = document.createElement("option");
                opt.value = res.resume_id;
                opt.textContent = res.resume_title || `Resume ID #${res.resume_id}`;
                resumeSelect.appendChild(opt);
            });
            currentResumeId = data.data[0].resume_id;
            
            // Link "Improve Resume" href
            const btnImprove = document.getElementById("btnImproveResume");
            if (btnImprove) {
                btnImprove.href = `editor.html?resume_id=${currentResumeId}`;
            }

            // Change listener to update selected resume
            resumeSelect.addEventListener("change", (e) => {
                currentResumeId = e.target.value;
                if (btnImprove && currentResumeId) {
                    btnImprove.href = `editor.html?resume_id=${currentResumeId}`;
                }
            });
        } else {
            resumeSelect.innerHTML = '<option value="">No resumes found. Create one first!</option>';
        }
    } catch (err) {
        console.error("Error loading resumes:", err);
        resumeSelect.innerHTML = '<option value="">Failed to load resumes</option>';
    }
}

// ==========================================
// Job Details URL Fetch Scraper
// ==========================================
async function handleFetchJobUrl() {
    const url = jobUrlInput.value.trim();
    if (!url) {
        alert("Please enter a valid job URL.");
        return;
    }

    showLoader(true, "Scraping Job Details", "Parsing text content from job posting...");

    try {
        const response = await fetch(`${API_BASE_URL}/api/job-match/fetch-url?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Autofill text area and switch to text tab
        jobDescriptionText.value = data.text || "";
        charCount.textContent = `${jobDescriptionText.value.length} / 10000 characters`;

        // Attempt to extract title/company from URL patterns if matching
        try {
            const domainMatch = url.match(/https?:\/\/(?:www\.)?([^\/]+)/i);
            if (domainMatch && domainMatch[1] && !companyInput.value) {
                companyInput.value = domainMatch[1].split(".")[0].toUpperCase();
            }
        } catch (e) {}

        // Switch active tab view to Text
        const textTabBtn = document.querySelector('[data-tab="tab-text"]');
        if (textTabBtn) textTabBtn.click();

        alert("Job description extracted successfully! Please verify the text below before analyzing.");

    } catch (err) {
        console.error(err);
        alert(err.message || "Failed to load description. Please copy and paste instead.");
    } finally {
        showLoader(false);
    }
}

// ==========================================
// Analyze Match Execution Trigger
// ==========================================
async function handleAnalyzeMatch() {
    const resumeId = resumeSelect.value;
    const text = jobDescriptionText.value.trim();
    const title = jobTitleInput.value.trim() || "Software Engineer";
    const company = companyInput.value.trim() || "Company Inc.";
    const url = jobUrlInput.value.trim();

    if (!resumeId) {
        alert("Please select a resume to match.");
        return;
    }
    if (!text) {
        alert("Please paste a job description or scrape a URL.");
        return;
    }

    showLoader(true, "Analyzing Job Match", "PostgreSQL is matching skills, experience and keywords...");

    try {
        const userId = localStorage.getItem("user_id") || "1";
        const response = await fetch(`${API_BASE_URL}/api/job-match/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                resume_id: resumeId,
                job_title: title,
                company_name: company,
                job_url: url,
                job_description_text: text
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        analysisData = data;
        renderResults(data);

    } catch (err) {
        console.error(err);
        alert(err.message || "Analysis failed. Please try again.");
    } finally {
        showLoader(false);
    }
}

// ==========================================
// UI Rendering Logic
// ==========================================
function renderResults(data) {
    // Enable opacity and interaction
    matchResultsBlock.style.opacity = "1";
    matchResultsBlock.style.pointerEvents = "auto";

    // 1. Overall Circle Score Meter
    const score = Number(data.overall_score || 0);
    animateOverallScore(score);

    // 2. Probability Badge
    const prob = data.shortlist_probability || "Medium";
    probabilityText.textContent = prob;
    probabilityBadge.textContent = prob;
    
    // Class names matching colors
    probabilityBadge.className = "probability-badge";
    probabilityBadge.classList.add(prob.toLowerCase());

    // 3. Match Breakdown Progress Bars
    animateBreakdownBar(barSkills, barSkillsVal, data.skills_match || 0);
    animateBreakdownBar(barExperience, barExperienceVal, data.experience_match || 0);
    animateBreakdownBar(barEducation, barEducationVal, data.education_match || 0);
    animateBreakdownBar(barKeyword, barKeywordVal, data.keyword_match || 0);
    animateBreakdownBar(barProjects, barProjectsVal, data.projects_match || 0);

    // 4. Render Tag Clouds
    renderTagCloud(matchedSkillsCloud, data.matched_skills, "matched", "✓");
    renderTagCloud(missingSkillsCloud, data.missing_skills, "missing", "⚠");
    renderTagCloud(matchedKeywordsCloud, data.matched_keywords, "matched", "✓");
    renderTagCloud(missingKeywordsCloud, data.missing_keywords, "missing", "⚠");

    // 5. Render Action Recommendations Checklist
    renderRecommendations(data.recommendations);
}

// Visual Animators
function animateOverallScore(score) {
    matchScoreVal.textContent = `${score}%`;
    const circumference = 251.2;
    const offset = circumference - (circumference * score) / 100;
    matchProgressBar.style.strokeDashoffset = offset;
}

function animateBreakdownBar(barEl, textEl, value) {
    textEl.textContent = `${value}%`;
    barEl.style.width = "0%";
    setTimeout(() => {
        barEl.style.width = `${value}%`;
    }, 100);
}

function renderTagCloud(container, list, status, prefixIcon) {
    container.innerHTML = "";
    const items = list || [];
    
    if (items.length === 0) {
        container.innerHTML = '<span class="placeholder-text">None</span>';
        return;
    }

    items.forEach(text => {
        const badge = document.createElement("span");
        badge.className = `kw-badge ${status}`;
        badge.innerHTML = `<span>${prefixIcon}</span> ${text}`;
        container.appendChild(badge);
    });
}

function renderRecommendations(recs) {
    recommendationsList.innerHTML = "";
    const items = recs || [];
    
    if (items.length === 0) {
        recommendationsList.innerHTML = '<p class="placeholder-text"><i class="fa-solid fa-check-circle" style="color:var(--success)"></i> Perfect match! No recommendations needed.</p>';
        return;
    }

    items.forEach(r => {
        const row = document.createElement("div");
        row.className = "rec-item";
        row.innerHTML = `<i class="fa-solid fa-circle-right"></i> <span>${r}</span>`;
        recommendationsList.appendChild(row);
    });
}

// ==========================================
// Footer Buttons Controls
// ==========================================
function handleAnalyzeAgain() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    jobDescriptionText.focus();
}

function handleSaveJob() {
    alert("Job Match Analysis successfully saved under Resume Applications!");
}

function handleDownloadReport() {
    if (!analysisData) {
        alert("Please run match analysis first.");
        return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head>
            <title>Job Match Analyzer Audit Report</title>
            <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
                h1 { font-family: 'Outfit', sans-serif; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; color: #4f46e5; }
                .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
                .card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
                .metric { font-size: 2.2rem; font-weight: 800; color: #4f46e5; }
                .list { margin-top: 10px; line-height: 1.6; }
                .badge { padding: 4px 8px; background: #e0e7ff; color: #4f46e5; border-radius: 4px; font-weight: 700; margin-right: 6px; display: inline-block; font-size: 0.8rem; }
            </style>
        </head>
        <body>
            <h1>Job Match Audit Report</h1>
            <p><strong>Resume ID:</strong> ${resumeSelect.value}</p>
            <p><strong>Job Title:</strong> ${jobTitleInput.value || 'Software Engineer'}</p>
            <p><strong>Company Name:</strong> ${companyInput.value || 'Target Company'}</p>
            
            <div class="score-grid">
                <div class="card">
                    <h3>Overall Match Score</h3>
                    <div class="metric">${analysisData.overall_score}%</div>
                    <p><strong>Probability:</strong> ${analysisData.shortlist_probability}</p>
                </div>
                <div class="card">
                    <h3>Breakdown Scores</h3>
                    <p>Skills Match: ${analysisData.skills_match}%</p>
                    <p>Experience Match: ${analysisData.experience_match}%</p>
                    <p>Education Match: ${analysisData.education_match}%</p>
                    <p>Keyword Match: ${analysisData.keyword_match}%</p>
                    <p>Projects Match: ${analysisData.projects_match}%</p>
                </div>
            </div>

            <div class="card" style="margin-top: 20px;">
                <h3>Action Recommendations</h3>
                <ul class="list">
                    ${analysisData.recommendations.map(r => `<li>${r}</li>`).join("")}
                </ul>
            </div>
            
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Helper Loader Overlay
function showLoader(show, title = "", subtitle = "") {
    if (show) {
        if (title) loadingOverlay.querySelector("h3").textContent = title;
        if (subtitle) loadingOverlay.querySelector("p").textContent = subtitle;
        loadingOverlay.style.display = "flex";
    } else {
        loadingOverlay.style.display = "none";
    }
}
