var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

// ==========================================
// Resume Preview Workspace - Split View Controller
// ==========================================

const resume_id = localStorage.getItem("resume_id");
const user_id = localStorage.getItem("user_id");

let previewData = null;
let activeTemplateId = null;
let templatesList = [];

console.log("resume_id:", resume_id);
console.log("user_id:", user_id);

window.addEventListener("DOMContentLoaded", () => {
    loadPreviewWorkspace();
});

// ==========================================
// Load Preview & Sidebar Templates
// ==========================================
async function loadPreviewWorkspace() {
    try {
        // 1. Fetch Resume details
        const response = await fetch(
            `${API_BASE_URL}/api/resume/preview/list/${resume_id}?user_id=${user_id}`
        );
        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            alert("Resume data not found.");
            return;
        }

        previewData = result.data[0];
        
        // Setup initial default arrays if empty/null in database
        if (!previewData.personal_details) previewData.personal_details = [{}];
        if (!previewData.education) previewData.education = [];
        if (!previewData.experience) previewData.experience = [];
        if (!previewData.skills) previewData.skills = [];
        if (!previewData.projects) previewData.projects = [];
        if (!previewData.certifications) previewData.certifications = [];
        
        // Check local storage for template overrides, otherwise use db value
        const localTemplateOverride = localStorage.getItem(`resume_template_id_${resume_id}`);
        activeTemplateId = localTemplateOverride ? Number(localTemplateOverride) : Number(previewData.template_id);

        // 2. Fetch Templates list from API
        const templatesRes = await fetch(`${API_BASE_URL}/api/templates`);
        const templatesJson = await templatesRes.json();
        
        if (templatesJson.success && templatesJson.data && templatesJson.data.data) {
            templatesList = templatesJson.data.data;
        }

        // 3. Render left templates sidebar
        renderTemplatesSidebar();

        // 4. Render initial template on the right side
        await renderActiveTemplate();

        // 5. Check if auto-download is requested
        await checkAutoDownload();

    } catch (err) {
        console.error("Error loading preview workspace:", err);
        alert("Unable to load preview.");
    }
}

// ==========================================
// Render Left Sidebar Templates
// ==========================================
function renderTemplatesSidebar() {
    const container = document.getElementById("sidebarTemplatesContainer");
    if (!container) return;

    container.innerHTML = "";

    templatesList.forEach(tpl => {
        const isCurrentActive = Number(tpl.template_id) === Number(activeTemplateId);
        const activeClass = isCurrentActive ? "active" : "";

        // Build sidebar card element
        const card = document.createElement("div");
        card.className = `sidebar-card ${activeClass}`;
        card.setAttribute("data-id", tpl.template_id);
        card.innerHTML = `
            <div class="sidebar-card-img-box">
                <img src="templates/${tpl.template_folder}/preview.png" 
                     onerror="this.src='https://placehold.co/240x160?text=Preview';" 
                     alt="${tpl.template_name} Preview" 
                     class="sidebar-card-img">
            </div>
            <div class="sidebar-card-info">
                <h4>${tpl.template_name}</h4>
                <p>Designed for professional resumes.</p>
            </div>
        `;

        // Click handler to switch template instantly
        card.addEventListener("click", async () => {
            if (Number(tpl.template_id) === Number(activeTemplateId)) return;

            // Update active styling
            document.querySelectorAll(".sidebar-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            // Update state
            activeTemplateId = Number(tpl.template_id);
            localStorage.setItem(`resume_template_id_${resume_id}`, activeTemplateId);

            // Reload template preview instantly
            await renderActiveTemplate();
        });

        container.appendChild(card);
    });
}

// ==========================================
// Load & Render Active Template Markup
// ==========================================
async function renderActiveTemplate() {
    const container = document.getElementById("templateContainer");
    if (!container) return;

    // Find folder name from templates list, fallback to formatted padded string
    const activeTemplate = templatesList.find(t => Number(t.template_id) === Number(activeTemplateId));
    const templateFolder = activeTemplate ? activeTemplate.template_folder : `Template-${String(activeTemplateId).padStart(3, '0')}`;

    console.log(`Rendering layout template from: ${templateFolder}`);

    try {
        container.innerHTML = `<div style="padding: 40px; text-align: center;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; color: var(--primary);"></i> Loading template...</div>`;
        await TemplateLoader.load(templateFolder, "templateContainer", previewData);
        adjustResumeScale();
    } catch (err) {
        console.error("Error loading layout markup:", err);
        container.innerHTML = `<div style="padding: 20px; color: var(--danger); text-align: center;">Error loading template layout details.</div>`;
    }
}

// ==========================================
// Toolbar Navigation and PDF download
// ==========================================
document.getElementById("btnBack").addEventListener("click", function() {
    window.history.back();
});

document.getElementById("btnDownload").addEventListener("click", async function() {
    const resume = document.getElementById("templateContainer");
    
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

    const options = {
        margin: 0.3,
        filename: `${resumeName}.pdf`,
        image: {
            type: "jpeg",
            quality: 0.98
        },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait"
        }
    };

    // Temporarily reset CSS scale transform for un-distorted PDF export
    const originalTransform = resume.style.transform;
    const originalWidth = resume.style.width;
    resume.style.transform = "none";
    resume.style.width = "794px";

    try {
        await html2pdf().set(options).from(resume).save();
    } catch (pdfErr) {
        console.error("PDF generation error:", pdfErr);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        // Restore scale transform
        resume.style.transform = originalTransform;
        resume.style.width = originalWidth;
        adjustResumeScale();
    }
});

// Auto-download helper trigger
async function checkAutoDownload() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("download") === "true") {
        // Short timeout to guarantee page templates rendering completes
        setTimeout(() => {
            document.getElementById("btnDownload").click();
        }, 1200);
    }
}

// ==========================================
// Auto-scale A4 Resume Page to Fit Viewport Width
// ==========================================
function adjustResumeScale() {
    const viewport = document.querySelector(".preview-panel");
    const container = document.getElementById("templateContainer");
    if (!viewport || !container) return;

    const viewportWidth = viewport.clientWidth;
    const baseWidth = 794; // 210mm in pixels at 96 DPI
    const padding = 24;
    const availableWidth = Math.max(300, viewportWidth - padding);

    if (availableWidth < baseWidth) {
        const scale = availableWidth / baseWidth;
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = "top center";
        container.style.width = `${baseWidth}px`;
        container.style.display = "block";
        
        const previewArea = document.querySelector(".preview-area");
        if (previewArea) {
            const containerHeight = Math.max(container.scrollHeight, container.offsetHeight, 1123);
            previewArea.style.minHeight = `${containerHeight * scale + 40}px`;
            previewArea.style.height = "auto";
            previewArea.style.width = `${availableWidth}px`;
            previewArea.style.overflow = "visible";
        }
    } else {
        container.style.transform = "none";
        container.style.width = "auto";
        container.style.display = "block";
        const previewArea = document.querySelector(".preview-area");
        if (previewArea) {
            previewArea.style.height = "auto";
            previewArea.style.minHeight = "auto";
            previewArea.style.width = "auto";
            previewArea.style.overflow = "visible";
        }
    }
}

// Attach listeners
window.addEventListener("resize", adjustResumeScale);

