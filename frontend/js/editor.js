var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

// ==========================================
// Resume Editor Workspace Controller
// ==========================================

const resume_id = localStorage.getItem("resume_id");
const user_id = localStorage.getItem("user_id");

let previewData = null;
let activeTemplateId = null;
let templatesList = [];
let currentStep = "contacts";

const stepsOrder = ["contacts", "education", "experience", "skills", "projects", "certifications"];

// ==========================================
// Initialization
// ==========================================
window.addEventListener("DOMContentLoaded", async () => {
    // Session Check
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    await loadWorkspaceData();
    setupEventListeners();
    setupRealtimeBinding();
});

// ==========================================
// Load Initial Data
// ==========================================
async function loadWorkspaceData() {
    try {
        // 1. Fetch Resume Data
        const response = await fetch(
            `${API_BASE_URL}/api/resume/preview/list/${resume_id}?user_id=${user_id}`
        );
        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            alert("Resume data not found.");
            window.location.href = "dashboard.html";
            return;
        }

        previewData = result.data[0];
        
        // Setup initial default arrays if empty
        if (!previewData.personal_details) previewData.personal_details = [{}];
        if (!previewData.education) previewData.education = [];
        if (!previewData.experience) previewData.experience = [];
        if (!previewData.skills) previewData.skills = [];
        if (!previewData.projects) previewData.projects = [];
        if (!previewData.certifications) previewData.certifications = [];

        // Set navbar title
        const titleBadge = document.getElementById("resumeTitleBadge");
        if (titleBadge && previewData.resume_title) {
            titleBadge.textContent = previewData.resume_title;
        }

        // Set active template ID (from local storage override, else db value)
        const localTemplateOverride = localStorage.getItem(`resume_template_id_${resume_id}`);
        activeTemplateId = localTemplateOverride ? Number(localTemplateOverride) : Number(previewData.template_id);

        // 2. Fetch templates metadata
        const templatesRes = await fetch(`${API_BASE_URL}/api/templates`);
        const templatesJson = await templatesRes.json();
        if (templatesJson.success && templatesJson.data && templatesJson.data.data) {
            templatesList = templatesJson.data.data;
        }

        // 3. Pre-fill forms
        prefillContactsForm();
        renderEducationList();
        renderExperienceList();
        renderSkillsList();
        renderProjectsList();
        renderCertificationsList();

        // 4. Render Live Preview
        await renderLivePreview();

    } catch (err) {
        console.error("Error loading workspace details:", err);
    }
}

// ==========================================
// Form Pre-filling
// ==========================================
function prefillContactsForm() {
    const personal = previewData.personal_details[0] || {};
    document.getElementById("first_name").value = personal.first_name || "";
    document.getElementById("last_name").value = personal.last_name || "";
    document.getElementById("email").value = personal.email || "";
    document.getElementById("mobile").value = personal.mobile || "";
    document.getElementById("date_of_birth").value = personal.date_of_birth ? personal.date_of_birth.substring(0, 10) : "";
    document.getElementById("pincode").value = personal.pincode || "";
    document.getElementById("city").value = personal.city || "";
    document.getElementById("state").value = personal.state || "";
    document.getElementById("country").value = personal.country || "";
    document.getElementById("linkedin_url").value = personal.linkedin_url || "";
    document.getElementById("github_url").value = personal.github_url || "";
    document.getElementById("portfolio_url").value = personal.portfolio_url || "";
    document.getElementById("address").value = personal.address || "";
    document.getElementById("professional_summary").value = personal.professional_summary || "";
}

// ==========================================
// Live Preview Rendering
// ==========================================
async function renderLivePreview() {
    const container = document.getElementById("templateContainer");
    if (!container) return;

    const activeTemplate = templatesList.find(t => Number(t.template_id) === Number(activeTemplateId));
    const templateFolder = activeTemplate ? activeTemplate.template_folder : `Template-${String(activeTemplateId).padStart(3, '0')}`;

    try {
        await TemplateLoader.load(templateFolder, "templateContainer", previewData);
        adjustResumeScale();
    } catch (err) {
        console.error("Error rendering template preview:", err);
    }
}

// ==========================================
// Realtime input binding
// ==========================================
function setupRealtimeBinding() {
    const contactsInputs = [
        "first_name", "last_name", "email", "mobile", "date_of_birth", 
        "pincode", "city", "state", "country", "linkedin_url", 
        "github_url", "portfolio_url", "address", "professional_summary"
    ];

    contactsInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                if (!previewData.personal_details[0]) previewData.personal_details[0] = {};
                previewData.personal_details[0][id] = el.value;
                
                // Re-render preview instantly
                renderLivePreview();
                
                // Debounce and auto-save
                debouncedSaveContacts();
            });
        }
    });
}

// Debounce helper for contacts saving
let saveTimeout = null;
function debouncedSaveContacts() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        await saveContactsData();
    }, 1500);
}

async function saveContactsData() {
    const personal = previewData.personal_details[0] || {};
    try {
        const response = await fetch(`${API_BASE_URL}/api/personal/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resume_personal_id: personal.resume_personal_id || null,
                resume_id: resume_id,
                first_name: document.getElementById("first_name").value,
                last_name: document.getElementById("last_name").value,
                email: document.getElementById("email").value,
                mobile: document.getElementById("mobile").value,
                date_of_birth: document.getElementById("date_of_birth").value || null,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                state: document.getElementById("state").value,
                country: document.getElementById("country").value,
                pincode: document.getElementById("pincode").value,
                linkedin_url: document.getElementById("linkedin_url").value,
                github_url: document.getElementById("github_url").value,
                portfolio_url: document.getElementById("portfolio_url").value,
                professional_summary: document.getElementById("professional_summary").value
            })
        });
        const result = await response.json();
        if ((result.error_cd === "00000" || result.error_cd === "0") && result.ref_id) {
            personal.resume_personal_id = Number(result.ref_id);
        }
    } catch (err) {
        console.error("Auto-save contacts error:", err);
    }
}

// ==========================================
// Wizard Navigation
// ==========================================
async function switchStep(newStep) {
    if (!stepsOrder.includes(newStep)) return;
    
    // Auto-save contacts details when leaving the contacts step
    if (currentStep === "contacts" && newStep !== "contacts") {
        try {
            await saveContactsData();
        } catch (err) {
            console.error("Error auto-saving contacts on step switch:", err);
        }
    }
    
    // Hide active step content, show new one
    document.getElementById(`step-${currentStep}`).style.display = "none";
    document.getElementById(`step-${newStep}`).style.display = "block";

    // Update steps nav bar styling
    document.querySelectorAll(".step-nav-item").forEach(item => {
        if (item.getAttribute("data-step") === newStep) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    currentStep = newStep;
    const currentIndex = stepsOrder.indexOf(currentStep);

    // Manage Previous Button
    const btnPrev = document.getElementById("btnPrevStep");
    if (currentIndex === 0) {
        btnPrev.classList.add("disabled");
    } else {
        btnPrev.classList.remove("disabled");
    }

    // Manage Next Button Label
    const btnNext = document.getElementById("btnNextStep");
    if (currentIndex === stepsOrder.length - 1) {
        btnNext.innerHTML = 'Preview & Finish <i class="fa-solid fa-flag-checkered"></i>';
    } else {
        const nextStepName = stepsOrder[currentIndex + 1];
        const displayLabel = nextStepName.charAt(0).toUpperCase() + nextStepName.slice(1);
        btnNext.innerHTML = `Next: ${displayLabel} <i class="fa-solid fa-chevron-right"></i>`;
    }
}

// ==========================================
// Setup Event Listeners
// ==========================================
function setupEventListeners() {
    // 1. Navbar Navigation
    document.getElementById("btnBackToDashboard").addEventListener("click", () => {
        if (confirm("Go back to dashboard? Your changes are auto-saved.")) {
            window.location.href = "dashboard.html";
        }
    });

    document.getElementById("btnDownloadPDF").addEventListener("click", async () => {
        await saveContactsData();
        
        // Save state to database first
        const activeTemplate = templatesList.find(t => Number(t.template_id) === Number(activeTemplateId));
        const templateId = activeTemplate ? activeTemplate.template_id : activeTemplateId;
        const resumeName = previewData.resume_title || "Untitled Resume";
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/resume/save-json`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user_id,
                    resume_id: resume_id,
                    resume_name: resumeName,
                    template_id: templateId,
                    resume_json: previewData
                })
            });
            const result = await response.json();
            if (result.success) {
                console.log("Resume state saved to database successfully.");
            } else {
                console.warn("Failed to save resume state to database:", result.message);
            }
        } catch (err) {
            console.error("Error saving resume state to database:", err);
        }

        const resume = document.getElementById("templateContainer");
        const options = {
            margin: 0.3,
            filename: `${resumeName}.pdf`,
            image: {
                type: "jpeg",
                quality: 1
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: "in",
                format: "a4",
                orientation: "portrait"
            }
        };
        html2pdf().set(options).from(resume).save();
    });

    // Toggle Full Screen Preview Pane
    document.getElementById("btnToggleFullScreen").addEventListener("click", () => {
        const container = document.querySelector(".editor-split-container");
        const isFullScreen = container.classList.toggle("full-screen-preview");
        
        const toggleIcon = document.getElementById("toggleIcon");
        const toggleText = document.getElementById("toggleText");
        
        if (isFullScreen) {
            toggleIcon.className = "fa-solid fa-compress";
            toggleText.textContent = "Split Screen";
        } else {
            toggleIcon.className = "fa-solid fa-expand";
            toggleText.textContent = "Full Screen";
        }
        
        // Dispatch window resize event so the templates refresh
        window.dispatchEvent(new Event('resize'));
    });

    // 2. Wizard Header Clicks
    document.querySelectorAll(".step-nav-item").forEach(item => {
        item.addEventListener("click", async () => {
            const targetStep = item.getAttribute("data-step");
            await switchStep(targetStep);
        });
    });

    // 3. Footer Navigation Buttons
    document.getElementById("btnPrevStep").addEventListener("click", async () => {
        const currentIndex = stepsOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            await switchStep(stepsOrder[currentIndex - 1]);
        }
    });

    document.getElementById("btnNextStep").addEventListener("click", async () => {
        const currentIndex = stepsOrder.indexOf(currentStep);
        if (currentIndex === stepsOrder.length - 1) {
            // Save contacts and redirect to preview page
            await saveContactsData();
            window.location.href = "preview.html";
        } else {
            // Go to next step
            await switchStep(stepsOrder[currentIndex + 1]);
        }
    });

    // 4. Education Add Action
    document.getElementById("btnAddEducation").addEventListener("click", async () => {
        const degree = document.getElementById("degree").value;
        const institution = document.getElementById("institution").value;
        if (!degree || !institution) {
            alert("Degree and Institution name are required.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/education/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resume_id,
                    degree: degree,
                    institution: institution,
                    university: document.getElementById("university").value,
                    field_of_study: document.getElementById("field_of_study").value,
                    start_year: document.getElementById("start_year").value || null,
                    end_year: document.getElementById("end_year").value || null,
                    cgpa_percentage: document.getElementById("cgpa_percentage").value,
                    currently_studying: document.getElementById("currently_studying").checked
                })
            });
            const result = await res.json();
            alert(result.message);

            // Reset Form fields
            document.getElementById("degree").value = "";
            document.getElementById("institution").value = "";
            document.getElementById("university").value = "";
            document.getElementById("field_of_study").value = "";
            document.getElementById("start_year").value = "";
            document.getElementById("end_year").value = "";
            document.getElementById("cgpa_percentage").value = "";
            document.getElementById("currently_studying").checked = false;

            // Refresh List and Live Preview
            await reloadEducationData();
        } catch (err) {
            console.error("Save education error:", err);
        }
    });

    // 5. Experience Add Action
    document.getElementById("btnAddExperience").addEventListener("click", async () => {
        const company = document.getElementById("company_name").value;
        const type = document.getElementById("employment_type").value;
        if (!company || !type) {
            alert("Company Name and Employment Type are required.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/experience/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resume_id,
                    company_name: company,
                    job_title: document.getElementById("job_title").value,
                    employment_type: type,
                    location: document.getElementById("location").value,
                    start_date: document.getElementById("start_date").value || null,
                    end_date: document.getElementById("end_date").value || null,
                    currently_working: document.getElementById("currently_working").checked,
                    job_description: document.getElementById("job_description").value
                })
            });
            const result = await res.json();
            alert(result.message);

            // Reset Form fields
            document.getElementById("company_name").value = "";
            document.getElementById("job_title").value = "";
            document.getElementById("employment_type").value = "";
            document.getElementById("location").value = "";
            document.getElementById("start_date").value = "";
            document.getElementById("end_date").value = "";
            document.getElementById("currently_working").checked = false;
            document.getElementById("job_description").value = "";

            // Refresh List and Live Preview
            await reloadExperienceData();
        } catch (err) {
            console.error("Save experience error:", err);
        }
    });

    // 6. Skills Add Action
    document.getElementById("btnAddSkill").addEventListener("click", async () => {
        const skillName = document.getElementById("skill_name").value;
        if (!skillName) {
            alert("Skill name is required.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/skills/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resume_id,
                    skill_name: skillName,
                    skill_category: document.getElementById("skill_category").value,
                    skill_level: document.getElementById("skill_level").value,
                    experience_years: document.getElementById("experience_years").value || null
                })
            });
            const result = await res.json();
            alert(result.message);

            // Reset Form fields
            document.getElementById("skill_name").value = "";
            document.getElementById("skill_category").selectedIndex = 0;
            document.getElementById("skill_level").selectedIndex = 0;
            document.getElementById("experience_years").value = "";

            // Refresh List and Live Preview
            await reloadSkillsData();
        } catch (err) {
            console.error("Save skills error:", err);
        }
    });

    // 7. Projects Add Action
    document.getElementById("btnAddProject").addEventListener("click", async () => {
        const projectName = document.getElementById("project_name").value;
        if (!projectName) {
            alert("Project Name is required.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/projects/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resume_id,
                    project_name: projectName,
                    role: document.getElementById("role").value,
                    technologies_used: document.getElementById("technologies_used").value,
                    start_date: document.getElementById("proj_start_date").value || null,
                    end_date: document.getElementById("proj_end_date").value || null,
                    github_url: document.getElementById("proj_github_url").value,
                    live_project_url: document.getElementById("live_project_url").value,
                    project_description: document.getElementById("project_description").value
                })
            });
            const result = await res.json();
            alert(result.message);

            // Reset Form fields
            document.getElementById("project_name").value = "";
            document.getElementById("role").value = "";
            document.getElementById("technologies_used").value = "";
            document.getElementById("proj_start_date").value = "";
            document.getElementById("proj_end_date").value = "";
            document.getElementById("proj_github_url").value = "";
            document.getElementById("live_project_url").value = "";
            document.getElementById("project_description").value = "";

            // Refresh List and Live Preview
            await reloadProjectsData();
        } catch (err) {
            console.error("Save projects error:", err);
        }
    });

    // 8. Certifications Add Action
    document.getElementById("btnAddCertification").addEventListener("click", async () => {
        const certName = document.getElementById("certification_name").value;
        const issuer = document.getElementById("issuing_organization").value;
        if (!certName || !issuer) {
            alert("Certification Name and Issuing Organization are required.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/certifications/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resume_id,
                    certification_name: certName,
                    issuing_organization: issuer,
                    issue_date: document.getElementById("issue_date").value || null,
                    expiry_date: document.getElementById("expiry_date").value || null,
                    credential_id: document.getElementById("credential_id").value,
                    credential_url: document.getElementById("credential_url").value,
                    description: document.getElementById("cert_description").value
                })
            });
            const result = await res.json();
            alert(result.message);

            // Reset Form fields
            document.getElementById("certification_name").value = "";
            document.getElementById("issuing_organization").value = "";
            document.getElementById("issue_date").value = "";
            document.getElementById("expiry_date").value = "";
            document.getElementById("credential_id").value = "";
            document.getElementById("credential_url").value = "";
            document.getElementById("cert_description").value = "";

            // Refresh List and Live Preview
            await reloadCertificationsData();
        } catch (err) {
            console.error("Save certifications error:", err);
        }
    });

    // 9. Change Template Page Redirection
    document.getElementById("btnChangeTemplateWorkspace").addEventListener("click", () => {
        window.location.href = "select_template.html";
    });
}

// ==========================================
// List Rendering Functions
// ==========================================
function renderEducationList() {
    const tbody = document.getElementById("educationListBody");
    tbody.innerHTML = "";
    previewData.education.forEach(edu => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${edu.degree}</strong></td>
                <td>${edu.institution}</td>
                <td>${edu.start_year} - ${edu.currently_studying ? "Present" : edu.end_year}</td>
                <td>
                    <button class="delete-btn btn-sm" onclick="deleteEducation(${edu.education_id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderExperienceList() {
    const tbody = document.getElementById("experienceListBody");
    tbody.innerHTML = "";
    previewData.experience.forEach(exp => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${exp.job_title}</strong></td>
                <td>${exp.company_name}</td>
                <td>${exp.start_date ? exp.start_date.substring(0, 7) : ""} - ${exp.currently_working ? "Present" : (exp.end_date ? exp.end_date.substring(0, 7) : "")}</td>
                <td>
                    <button class="delete-btn btn-sm" onclick="deleteExperience(${exp.experience_id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderSkillsList() {
    const tbody = document.getElementById("skillsListBody");
    tbody.innerHTML = "";
    previewData.skills.forEach(skill => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${skill.skill_name}</strong></td>
                <td>${skill.skill_category || "Other"}</td>
                <td>${skill.skill_level}</td>
                <td>
                    <button class="delete-btn btn-sm" onclick="deleteSkill(${skill.skill_id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderProjectsList() {
    const tbody = document.getElementById("projectsListBody");
    tbody.innerHTML = "";
    previewData.projects.forEach(proj => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${proj.project_name}</strong></td>
                <td>${proj.role || "N/A"}</td>
                <td>
                    <button class="delete-btn btn-sm" onclick="deleteProject(${proj.project_id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderCertificationsList() {
    const tbody = document.getElementById("certificationsListBody");
    tbody.innerHTML = "";
    previewData.certifications.forEach(cert => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${cert.certification_name}</strong></td>
                <td>${cert.issuing_organization}</td>
                <td>
                    <button class="delete-btn btn-sm" onclick="deleteCertification(${cert.certification_id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// Reload Sub-Data Functions
// ==========================================
async function reloadPreviewData() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/resume/preview/list/${resume_id}?user_id=${user_id}`
        );
        const result = await response.json();
        
        if (result && result.data && result.data.length > 0) {
            previewData = result.data[0];
            
            // Setup initial default arrays if empty
            if (!previewData.personal_details) previewData.personal_details = [{}];
            if (!previewData.education) previewData.education = [];
            if (!previewData.experience) previewData.experience = [];
            if (!previewData.skills) previewData.skills = [];
            if (!previewData.projects) previewData.projects = [];
            if (!previewData.certifications) previewData.certifications = [];
        }
    } catch (err) {
        console.error("Error reloading preview data from server:", err);
    }
}

async function reloadEducationData() {
    await reloadPreviewData();
    renderEducationList();
    await renderLivePreview();
}

async function reloadExperienceData() {
    await reloadPreviewData();
    renderExperienceList();
    await renderLivePreview();
}

async function reloadSkillsData() {
    await reloadPreviewData();
    renderSkillsList();
    await renderLivePreview();
}

async function reloadProjectsData() {
    await reloadPreviewData();
    renderProjectsList();
    await renderLivePreview();
}

async function reloadCertificationsData() {
    await reloadPreviewData();
    renderCertificationsList();
    await renderLivePreview();
}

// ==========================================
// Delete Sub-Items Actions
// ==========================================
window.deleteEducation = async function(id) {
    if (confirm("Delete this education entry?")) {
        try {
            await fetch(`${API_BASE_URL}/api/education/delete/${id}`, { method: "DELETE" });
            await reloadEducationData();
        } catch (err) { console.error(err); }
    }
};

window.deleteExperience = async function(id) {
    if (confirm("Delete this experience entry?")) {
        try {
            await fetch(`${API_BASE_URL}/api/experience/delete/${id}`, { method: "DELETE" });
            await reloadExperienceData();
        } catch (err) { console.error(err); }
    }
};

window.deleteSkill = async function(id) {
    if (confirm("Delete this skill entry?")) {
        try {
            await fetch(`${API_BASE_URL}/api/skills/delete/${id}`, { method: "DELETE" });
            await reloadSkillsData();
        } catch (err) { console.error(err); }
    }
};

window.deleteProject = async function(id) {
    if (confirm("Delete this project entry?")) {
        try {
            await fetch(`${API_BASE_URL}/api/projects/delete/${id}`, { method: "DELETE" });
            await reloadProjectsData();
        } catch (err) { console.error(err); }
    }
};

window.deleteCertification = async function(id) {
    if (confirm("Delete this certification entry?")) {
        try {
            await fetch(`${API_BASE_URL}/api/certifications/delete/${id}`, { method: "DELETE" });
            await reloadCertificationsData();
        } catch (err) { console.error(err); }
    }
};

// ==========================================
// Auto-scale A4 Resume Page to Fit Viewport Width
// ==========================================
function adjustResumeScale() {
    const viewport = document.querySelector(".live-preview-viewport");
    const container = document.getElementById("templateContainer");
    if (!viewport || !container) return;

    const viewportWidth = viewport.clientWidth;
    const baseWidth = 794; // 210mm in pixels at 96 DPI
    const padding = 20; // 10px padding on each side
    const availableWidth = viewportWidth - padding;

    if (availableWidth < baseWidth) {
        const scale = availableWidth / baseWidth;
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = "top center";
        container.style.width = `${baseWidth}px`;
        container.style.display = "block";
        
        // Scale the parent .preview-area size wrapper to reclaim scaled blank space
        const previewArea = document.querySelector(".preview-area");
        if (previewArea) {
            const containerHeight = container.offsetHeight || container.scrollHeight || 1123;
            previewArea.style.height = `${containerHeight * scale}px`;
            previewArea.style.width = `${availableWidth}px`;
            previewArea.style.overflow = "hidden";
        }
    } else {
        container.style.transform = "none";
        container.style.width = "auto";
        container.style.display = "block";
        const previewArea = document.querySelector(".preview-area");
        if (previewArea) {
            previewArea.style.height = "auto";
            previewArea.style.width = "auto";
            previewArea.style.overflow = "visible";
        }
    }
}

// Attach listeners
window.addEventListener("resize", adjustResumeScale);


