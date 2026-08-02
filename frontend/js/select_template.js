const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

// ==========================================
// Select Resume Template Controller (Full Page)
// ==========================================

const resume_id = localStorage.getItem("resume_id");
const user_id = localStorage.getItem("user_id");

let templatesList = [];
let activeTemplateId = null;
let currentSearchQuery = "";
let activeCategoryFilter = "all";

window.addEventListener("DOMContentLoaded", async () => {
    // Session check
    if (!resume_id || !user_id) {
        alert("Session lost. Returning to dashboard.");
        window.location.href = "dashboard.html";
        return;
    }

    // Retrieve active template override or default
    const localTemplateOverride = localStorage.getItem(`resume_template_id_${resume_id}`);
    activeTemplateId = localTemplateOverride ? Number(localTemplateOverride) : null;

    await fetchTemplates();
    setupEventListeners();
});

// ==========================================
// Fetch Templates Metadata
// ==========================================
async function fetchTemplates() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/templates`);
        const result = await response.json();

        if (result.success && result.data && result.data.data) {
            templatesList = result.data.data;
            
            // If activeTemplateId wasn't set, default to first template in database
            if (!activeTemplateId && templatesList.length > 0) {
                activeTemplateId = Number(templatesList[0].template_id);
            }
            
            renderTemplatesGrid();
        } else {
            console.error("Templates loading error:", result);
        }
    } catch (err) {
        console.error("Fetch templates error:", err);
    }
}

// ==========================================
// Render Gallery Grid
// ==========================================
function renderTemplatesGrid() {
    const grid = document.getElementById("templatesGalleryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    // Filter templates list
    const filteredTemplates = templatesList.filter(tpl => {
        // Search filter
        const matchesSearch = tpl.template_name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                              tpl.template_folder.toLowerCase().includes(currentSearchQuery.toLowerCase());
        
        // Category filter
        let matchesCategory = true;
        if (activeCategoryFilter === "ats") {
            matchesCategory = !tpl.is_premium;
        } else if (activeCategoryFilter === "premium") {
            matchesCategory = !!tpl.is_premium;
        }

        return matchesSearch && matchesCategory;
    });

    if (filteredTemplates.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-light); font-weight: 600;">No templates match your search or filter criteria.</div>`;
        return;
    }

    filteredTemplates.forEach(tpl => {
        const isCurrent = Number(tpl.template_id) === Number(activeTemplateId);
        const cardClass = isCurrent ? "gallery-card active" : "gallery-card";
        
        // Badges HTML
        const badgeText = tpl.is_premium ? "Premium" : "ATS Friendly";
        const badgeClass = tpl.is_premium ? "premium-overlay-badge" : "ats-overlay-badge";
        const checkmarkBadge = isCurrent 
            ? `<div class="checkmark-badge"><i class="fa-solid fa-check"></i></div>` 
            : "";

        const card = document.createElement("div");
        card.className = cardClass;
        card.innerHTML = `
            <div class="gallery-card-img-box">
                <img src="templates/${tpl.template_folder}/preview.png" 
                     onerror="this.src='https://placehold.co/400x500?text=Preview';" 
                     alt="${tpl.template_name} Layout Preview" 
                     class="gallery-card-img">
                <div class="${badgeClass}">${badgeText}</div>
                ${checkmarkBadge}
                <div class="gallery-card-overlay">
                    <button class="btn btn-primary btn-choose-template">Choose Template</button>
                </div>
            </div>
            <div class="gallery-card-info">
                <h4>${tpl.template_name}</h4>
                <p>Designed for professional resumes.</p>
            </div>
        `;

        // Click selection: save selection state and auto-redirect back to editor
        card.addEventListener("click", () => {
            activeTemplateId = Number(tpl.template_id);
            localStorage.setItem(`resume_template_id_${resume_id}`, activeTemplateId);
            
            // Highlight checkmark visually
            renderTemplatesGrid();

            // Redirect back to editor instantly
            setTimeout(() => {
                window.location.href = "editor.html";
            }, 300);
        });

        grid.appendChild(card);
    });
}

// ==========================================
// Setup Listeners
// ==========================================
function setupEventListeners() {
    // 1. Back button
    document.getElementById("btnBackToEditor").addEventListener("click", () => {
        window.location.href = "editor.html";
    });

    // 2. Search keyup
    document.getElementById("templateSearch").addEventListener("input", (e) => {
        currentSearchQuery = e.target.value;
        renderTemplatesGrid();
    });

    // 3. Category badge filters
    document.querySelectorAll(".filter-badge").forEach(badge => {
        badge.addEventListener("click", () => {
            document.querySelectorAll(".filter-badge").forEach(b => b.classList.remove("active"));
            badge.classList.add("active");
            activeCategoryFilter = badge.getAttribute("data-filter");
            renderTemplatesGrid();
        });
    });
}
