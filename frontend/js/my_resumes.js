var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

let resumesList = [];
let templatesList = [];
let searchQuery = "";
let selectedTemplate = "all";
let sortBy = "recent";

window.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    // Header Profile name
    const cachedName = localStorage.getItem("full_name");
    const usernameEl = document.getElementById("username");
    if (cachedName && usernameEl) {
        usernameEl.textContent = cachedName;
    }

    await fetchTemplates();
    await fetchResumes();
    setupEventListeners();
});

// Fetch all templates
async function fetchTemplates() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/templates`);
        const result = await response.json();
        if (result.success && result.data && result.data.data) {
            templatesList = result.data.data;
            populateTemplateFilter();
        }
    } catch (err) {
        console.error("Error fetching templates:", err);
    }
}

// Populate template filter dropdown
function populateTemplateFilter() {
    const filter = document.getElementById("templateFilter");
    if (!filter) return;
    
    templatesList.forEach(tpl => {
        const option = document.createElement("option");
        option.value = tpl.template_folder;
        option.textContent = tpl.template_name;
        filter.appendChild(option);
    });
}

// Fetch user resumes list
async function fetchResumes() {
    const userId = localStorage.getItem("user_id");
    try {
        const response = await fetch(`${API_BASE_URL}/api/resume/list/${userId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            resumesList = result.data;
            renderResumesGrid();
        }
    } catch (err) {
        console.error("Error fetching user resumes:", err);
    }
}

// Render Grid
function renderResumesGrid() {
    const grid = document.getElementById("resumesGrid");
    const emptyState = document.getElementById("emptyState");
    if (!grid) return;

    grid.innerHTML = "";

    // 1. Filter Resumes
    let filtered = resumesList.filter(res => {
        const matchesSearch = res.resume_title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Find corresponding template details
        const tpl = templatesList.find(t => t.template_name === res.template_name);
        const matchesTemplate = selectedTemplate === "all" || (tpl && tpl.template_folder === selectedTemplate);
        
        return matchesSearch && matchesTemplate;
    });

    // 2. Sort Resumes
    filtered.sort((a, b) => {
        if (sortBy === "recent") {
            return new Date(b.updated_on) - new Date(a.updated_on);
        } else if (sortBy === "oldest") {
            return new Date(a.updated_on) - new Date(b.updated_on);
        } else if (sortBy === "name") {
            return a.resume_title.localeCompare(b.resume_title);
        }
        return 0;
    });

    // Toggle Empty State view
    if (filtered.length === 0) {
        grid.style.display = "none";
        emptyState.style.display = "flex";
        return;
    }

    grid.style.display = "grid";
    emptyState.style.display = "none";

    filtered.forEach((res, index) => {
        // Find template folder
        const tpl = templatesList.find(t => t.template_name === res.template_name);
        const templateFolder = tpl ? tpl.template_folder : "Template-001";
        
        // Determine dynamic status status
        // Cycle status for demonstration/mock UI realism (Completed, In Progress, Draft)
        let status = "progress";
        let statusText = "In Progress";
        if (index % 3 === 0) {
            status = "completed";
            statusText = "Completed";
        } else if (index % 3 === 2) {
            status = "draft";
            statusText = "Draft";
        }

        const card = document.createElement("div");
        card.className = "resume-card";
        card.innerHTML = `
            <div class="resume-card-img-box">
                <img src="templates/${templateFolder}/preview.png" 
                     onerror="this.src='https://placehold.co/400x500?text=Preview';" 
                     alt="${res.resume_title} Thumbnail" 
                     class="resume-card-img">
            </div>
            <div class="resume-card-info">
                <h3>${res.resume_title}</h3>
                <div class="resume-card-meta">
                    <span class="resume-card-date">${timeAgo(res.updated_on)}</span>
                    <span class="status-badge ${status}">${statusText}</span>
                </div>
            </div>
            <div class="resume-card-actions">
                <button class="action-item" onclick="viewResume('${res.resume_id}')">
                    <i class="fa-regular fa-eye"></i>
                    <span>Preview</span>
                </button>
                <button class="action-item" onclick="editResume('${res.resume_id}')">
                    <i class="fa-regular fa-pen-to-square"></i>
                    <span>Edit</span>
                </button>
                <button class="action-item" onclick="downloadResume('${res.resume_id}')">
                    <i class="fa-solid fa-download"></i>
                    <span>Download</span>
                </button>
                <button class="action-item danger-hover" onclick="deleteResumeCard('${res.resume_id}')">
                    <i class="fa-regular fa-trash-can"></i>
                    <span>Delete</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Action Event Handlers
function viewResume(resumeId) {
    localStorage.setItem("resume_id", resumeId);
    window.location.href = "preview.html";
}

function editResume(resumeId) {
    localStorage.setItem("resume_id", resumeId);
    window.location.href = "editor.html";
}

function downloadResume(resumeId) {
    localStorage.setItem("resume_id", resumeId);
    window.location.href = "preview.html?download=true";
}

async function deleteResumeCard(resumeId) {
    if (confirm("Are you sure you want to delete this resume? This cannot be undone.")) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/resume/delete/${resumeId}`, {
                method: "DELETE"
            });
            const result = await response.json();
            if (result.success) {
                await fetchResumes();
            } else {
                alert("Error deleting resume: " + result.message);
            }
        } catch (err) {
            console.error("Error deleting resume card:", err);
        }
    }
}

// Set up Search & Filters Event Listeners
function setupEventListeners() {
    document.getElementById("resumeSearch").addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderResumesGrid();
    });

    document.getElementById("templateFilter").addEventListener("change", (e) => {
        selectedTemplate = e.target.value;
        renderResumesGrid();
    });

    document.getElementById("sortFilter").addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderResumesGrid();
    });
}

// Time calculation helper
function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = now - past;

    if (elapsed < msPerMinute) {
         return 'Updated just now';   
    } else if (elapsed < msPerHour) {
         return 'Updated ' + Math.round(elapsed/msPerMinute) + ' minutes ago';   
    } else if (elapsed < msPerDay ) {
         return 'Updated ' + Math.round(elapsed/msPerHour ) + ' hours ago';   
    } else if (elapsed < msPerMonth) {
        const days = Math.round(elapsed/msPerDay);
        return 'Updated ' + days + (days === 1 ? ' day' : ' days') + ' ago';   
    } else if (elapsed < msPerYear) {
        const months = Math.round(elapsed/msPerMonth);
        return 'Updated ' + months + (months === 1 ? ' month' : ' months') + ' ago';   
    } else {
        const years = Math.round(elapsed/msPerYear);
        return 'Updated ' + years + (years === 1 ? ' year' : ' years') + ' ago';   
    }
}
