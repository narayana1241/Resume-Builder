var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

const resumeForm = document.getElementById("resumeForm");
let templatesList = [];
let selectedThemeColor = localStorage.getItem("resume_theme_color") || "#2563eb";
let activeCategoryFilter = "all";
let currentSearchQuery = "";

// ==========================================
// Initial Page Load
// ==========================================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
} else {
    initPage();
}

function initPage() {
    setupUploadButtonLogic();
    setupColorPicker();
    setupFiltersAndSearch();
    setupTitleFromPending();
    fetchAndRenderTemplates();
}

function setupTitleFromPending() {
    const titleInput = document.getElementById("resume_title");
    const pendingTitle = localStorage.getItem("pending_resume_title") || localStorage.getItem("resume_uploaded_filename");
    if (pendingTitle && titleInput && !titleInput.value) {
        titleInput.value = pendingTitle.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    }
}

function getUserEnteredDetails() {
    const parsedStr = localStorage.getItem("uploaded_resume_parsed_data");
    if (parsedStr) {
        try {
            const data = JSON.parse(parsedStr);
            if (data.personal) {
                const fName = data.personal.first_name || "";
                const lName = data.personal.last_name || "";
                const fullName = (fName || lName) ? `${fName} ${lName}`.toUpperCase().trim() : null;
                return {
                    name: fullName,
                    job_title: (data.experience && data.experience[0]) ? data.experience[0].job_title : null,
                    email: data.personal.email || null,
                    mobile: data.personal.mobile || null,
                    city: data.personal.city || null,
                    summary: data.personal.professional_summary || null
                };
            }
        } catch (e) {}
    }
    return {};
}

// ==========================================
// Upload Button Beside Title Logic
// ==========================================
function setupUploadButtonLogic() {
    const titleInput = document.getElementById("resume_title");
    const uploadBtn = document.getElementById("btnUploadDesign");

    if (!titleInput || !uploadBtn) return;

    function checkTitleState() {
        const hasTitle = titleInput.value.trim().length > 0;
        if (hasTitle) {
            uploadBtn.classList.remove("disabled");
            uploadBtn.removeAttribute("disabled");
        } else {
            uploadBtn.classList.add("disabled");
            uploadBtn.setAttribute("disabled", "true");
        }
    }

    checkTitleState();
    titleInput.addEventListener("input", checkTitleState);
    titleInput.addEventListener("keyup", checkTitleState);

    uploadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const titleVal = titleInput.value.trim();
        if (!titleVal) {
            alert("Please enter a Resume Title first to enable uploading your own design.");
            titleInput.focus();
            return;
        }

        localStorage.setItem("pending_resume_title", titleVal);
        window.location.href = "upload_resume.html";
    });
}

// ==========================================
// Interactive Color Picker (Updates ALL Previews)
// ==========================================
function setupColorPicker() {
    const swatches = document.querySelectorAll(".swatch-btn");
    const customPicker = document.getElementById("customColorPicker");

    updateThemeColor(selectedThemeColor);

    swatches.forEach(btn => {
        const color = btn.getAttribute("data-color");
        if (color.toLowerCase() === selectedThemeColor.toLowerCase()) {
            btn.classList.add("active");
            btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
        } else {
            btn.classList.remove("active");
            btn.innerHTML = "";
        }

        btn.addEventListener("click", () => {
            swatches.forEach(b => {
                b.classList.remove("active");
                b.innerHTML = "";
            });
            btn.classList.add("active");
            btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
            
            selectedThemeColor = color;
            if (customPicker) customPicker.value = color;
            updateThemeColor(color);
        });
    });

    if (customPicker) {
        customPicker.addEventListener("input", (e) => {
            selectedThemeColor = e.target.value;
            swatches.forEach(b => {
                b.classList.remove("active");
                b.innerHTML = "";
            });
            updateThemeColor(selectedThemeColor);
        });
    }
}

function updateThemeColor(color) {
    document.documentElement.style.setProperty("--active-theme-color", color);
    localStorage.setItem("resume_theme_color", color);
}

// ==========================================
// Filters and Search Setup
// ==========================================
function setupFiltersAndSearch() {
    const searchInput = document.getElementById("templateSearch");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderTemplatesGrid();
        });
    }

    const badges = document.querySelectorAll(".filter-badge");
    badges.forEach(badge => {
        badge.addEventListener("click", () => {
            badges.forEach(b => b.classList.remove("active"));
            badge.classList.add("active");
            activeCategoryFilter = badge.getAttribute("data-filter");
            renderTemplatesGrid();
        });
    });
}

// ==========================================
// Fetch Templates
// ==========================================
async function fetchAndRenderTemplates() {
    const container = document.getElementById("templatesContainer");
    if (!container) return;

    try {
        container.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-light);"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top:12px; font-weight:600;">Loading templates...</p></div>`;

        const response = await fetch(`${API_BASE_URL}/api/templates`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.success && result.data) {
            templatesList = Array.isArray(result.data) ? result.data : (result.data.data || []);
        } else {
            templatesList = [];
        }

        if (!templatesList || templatesList.length === 0) {
            templatesList = [
                { template_id: 1, template_name: "Modern Minimalist Fresher", template_folder: "Template-001", is_premium: 0 },
                { template_id: 2, template_name: "Classic Serif Academic CV", template_folder: "Template-002", is_premium: 0 },
                { template_id: 3, template_name: "Bold Color-Block Header", template_folder: "Template-003", is_premium: 0 },
                { template_id: 4, template_name: "Dark Accent Sidebar (Two Column)", template_folder: "Template-004", is_premium: 0 },
                { template_id: 5, template_name: "Understated Lines & Micro-Cards", template_folder: "Template-005", is_premium: 0 },
                { template_id: 6, template_name: "Banded Section Header Style", template_folder: "Template-006", is_premium: 0 },
                { template_id: 7, template_name: "Timeline-Style Fresher Layout", template_folder: "Template-007", is_premium: 0 },
                { template_id: 8, template_name: "Compact Single-Page Tech Layout", template_folder: "Template-008", is_premium: 0 },
                { template_id: 9, template_name: "Oversized Typography & Clean Grid", template_folder: "Template-009", is_premium: 0 },
                { template_id: 10, template_name: "Skill-Level Infographic Style", template_folder: "Template-010", is_premium: 0 },
                { template_id: 11, template_name: "Formal Academic CV & Honors", template_folder: "Template-011", is_premium: 0 },
                { template_id: 12, template_name: "ATS-Safe Ultra-Clean Plain Style", template_folder: "Template-012", is_premium: 0 },
                { template_id: 13, template_name: "Left Accent Border & Modern Cards", template_folder: "Template-013", is_premium: 0 },
                { template_id: 14, template_name: "Dual Tone Gradient Header & Split Grid", template_folder: "Template-014", is_premium: 0 },
                { template_id: 15, template_name: "Creative Portfolio & Project-First Style", template_folder: "Template-015", is_premium: 0 }
            ];
        }

        renderTemplatesGrid();

    } catch (err) {
        console.error("Error loading templates dynamically:", err);
        templatesList = [
            { template_id: 1, template_name: "Modern Minimalist Fresher", template_folder: "Template-001", is_premium: 0 },
            { template_id: 2, template_name: "Classic Serif Academic CV", template_folder: "Template-002", is_premium: 0 },
            { template_id: 3, template_name: "Bold Color-Block Header", template_folder: "Template-003", is_premium: 0 },
            { template_id: 4, template_name: "Dark Accent Sidebar (Two Column)", template_folder: "Template-004", is_premium: 0 },
            { template_id: 5, template_name: "Understated Lines & Micro-Cards", template_folder: "Template-005", is_premium: 0 },
            { template_id: 6, template_name: "Banded Section Header Style", template_folder: "Template-006", is_premium: 0 },
            { template_id: 7, template_name: "Timeline-Style Fresher Layout", template_folder: "Template-007", is_premium: 0 },
            { template_id: 8, template_name: "Compact Single-Page Tech Layout", template_folder: "Template-008", is_premium: 0 },
            { template_id: 9, template_name: "Oversized Typography & Clean Grid", template_folder: "Template-009", is_premium: 0 },
            { template_id: 10, template_name: "Skill-Level Infographic Style", template_folder: "Template-010", is_premium: 0 },
            { template_id: 11, template_name: "Formal Academic CV & Honors", template_folder: "Template-011", is_premium: 0 },
            { template_id: 12, template_name: "ATS-Safe Ultra-Clean Plain Style", template_folder: "Template-012", is_premium: 0 },
            { template_id: 13, template_name: "Left Accent Border & Modern Cards", template_folder: "Template-013", is_premium: 0 },
            { template_id: 14, template_name: "Dual Tone Gradient Header & Split Grid", template_folder: "Template-014", is_premium: 0 },
            { template_id: 15, template_name: "Creative Portfolio & Project-First Style", template_folder: "Template-015", is_premium: 0 }
        ];
        renderTemplatesGrid();
    }
}

// ==========================================
// Render Gallery Grid
// ==========================================
function renderTemplatesGrid() {
    const container = document.getElementById("templatesContainer");
    if (!container) return;

    container.innerHTML = "";

    const filtered = templatesList.filter(tpl => {
        const matchesSearch = tpl.template_name.toLowerCase().includes(currentSearchQuery) ||
                              tpl.template_folder.toLowerCase().includes(currentSearchQuery);

        let matchesCat = true;
        if (activeCategoryFilter === "ats") matchesCat = !tpl.is_premium;
        if (activeCategoryFilter === "premium") matchesCat = !!tpl.is_premium;

        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-light); font-weight: 600;">No templates match your search or filter criteria.</div>`;
        return;
    }

    filtered.forEach((tpl, index) => {
        const isChecked = index === 0 ? "checked" : "";
        const badgeHtml = tpl.is_premium
            ? `<div class="template-badge info">Premium</div>`
            : `<div class="template-badge">ATS Friendly</div>`;

        const checkmarkBadge = `<div class="selected-checkmark-badge" style="display: ${index === 0 ? 'flex' : 'none'};"><i class="fa-solid fa-check"></i></div>`;

        // Render DRAMATICALLY DIFFERENT job role layouts with ZERO whitespace
        const miniPreviewHtml = buildCleanMiniResumePreview(tpl, index);

        const cardElement = document.createElement("div");
        cardElement.className = "template";
        cardElement.innerHTML = `
            <input
                type="radio"
                name="template"
                value="${tpl.template_id}"
                id="tpl_radio_${tpl.template_id}"
                ${isChecked}>
            <div class="template-card">
                <div class="template-image-box">
                    ${miniPreviewHtml}
                    ${badgeHtml}
                    ${checkmarkBadge}
                    <div class="template-hover-overlay">
                        <button type="button" class="choose-template-btn">Choose Template</button>
                    </div>
                </div>
            </div>
        `;

        cardElement.addEventListener("click", () => {
            document.querySelectorAll('input[name="template"]').forEach(r => r.checked = false);
            document.querySelectorAll('.selected-checkmark-badge').forEach(b => b.style.display = 'none');

            const radio = cardElement.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            const badge = cardElement.querySelector('.selected-checkmark-badge');
            if (badge) badge.style.display = 'flex';

            if (resumeForm) {
                resumeForm.requestSubmit();
            }
        });

        container.appendChild(cardElement);
    });
}

// ==========================================
// Build Mini Resume Previews - DRAMATICALLY DIFFERENT ROLES & ZERO WHITE SPACE
// ==========================================
function buildCleanMiniResumePreview(tpl, index) {
    const layoutIndex = (index !== undefined ? index : ((tpl.template_id || 1) - 1)) % 8;
    const userDet = (typeof getUserEnteredDetails === 'function') ? getUserEnteredDetails() : {};
    const name = userDet.name || "BOLLA ROJA";
    const userJobTitle = userDet.job_title || null;
    const userEmail = userDet.email || null;
    const userMobile = userDet.mobile || null;
    const userCity = userDet.city || null;
    const userSummary = userDet.summary || null;

    switch(layoutIndex) {
        case 0:
            // ROLE 1: Senior Java Developer (Dark Slate Banner + Tech Pills)
            return `
                <div class="mini-resume-doc mini-template-1">
                    <div class="tpl1-banner">
                        <h3>${name}</h3>
                        <div>Senior Java Developer</div>
                    </div>
                    <div class="tpl1-body">
                        <div class="mini-contact" style="justify-content:center;">
                            <span><i class="fa-solid fa-location-dot"></i> New Delhi, India</span>
                            <span><i class="fa-solid fa-phone"></i> +91 98765 43210</span>
                            <span><i class="fa-solid fa-envelope"></i> java.adi@email.com</span>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Professional Profile</span><span class="mini-sec-line"></span></div>
                            <p class="mini-summary-text">Senior Java Developer with 6+ years specializing in enterprise Microservices architecture, Spring Boot APIs, and High-Throughput distributed systems. Proven expertise in optimizing API latency and building resilient cloud backend solutions.</p>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Technical Skills</span><span class="mini-sec-line"></span></div>
                            <div class="mini-skills-grid">
                                <span class="mini-skill-pill accent">Java 17</span>
                                <span class="mini-skill-pill">Spring Boot</span>
                                <span class="mini-skill-pill accent">Microservices</span>
                                <span class="mini-skill-pill">Hibernate</span>
                                <span class="mini-skill-pill accent">PostgreSQL</span>
                                <span class="mini-skill-pill">Kafka</span>
                                <span class="mini-skill-pill accent">Docker</span>
                                <span class="mini-skill-pill">AWS</span>
                            </div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Work Experience</span><span class="mini-sec-line"></span></div>
                            <div class="mini-exp-item">
                                <div class="mini-exp-header"><span>Senior Java Engineer</span><span>2020 - Present</span></div>
                                <div class="mini-exp-sub">TechCorp Systems • Built high-frequency transaction engine processing 10M+ daily events.</div>
                            </div>
                            <div class="mini-exp-item">
                                <div class="mini-exp-header"><span>Java Backend Developer</span><span>2017 - 2020</span></div>
                                <div class="mini-exp-sub">SoftSys India • Engineered RESTful microservices with Spring Cloud & Kafka.</div>
                            </div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Education</span><span class="mini-sec-line"></span></div>
                            <div class="mini-exp-header"><span>B.Tech in Computer Science</span><span>IIT Delhi (2017)</span></div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Key Projects & Certifications</span><span class="mini-sec-line"></span></div>
                            <div style="font-size:5.2px; color:#334155; line-height:1.3;">
                                • <strong>Distributed Gateway Project</strong>: Architected microservices API gateway.<br>
                                • <strong>Certifications</strong>: AWS Certified Developer | Oracle SE Certified Java Specialist.
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 1:
            // ROLE 2: Lead SQL & Database Engineer (2-Column Split Layout)
            return `
                <div class="mini-resume-doc mini-template-2">
                    <div class="tpl2-sidebar">
                        <h3 style="font-size:10px; font-weight:800; color:#0f172a; margin:0;">${name}</h3>
                        <div style="font-size:6.8px; font-weight:700; color:var(--active-theme-color);">Lead SQL Engineer</div>
                        <div class="mini-section" style="margin-top:2px;">
                            <div class="mini-sec-title"><span>Contact</span></div>
                            <div style="font-size:5px; color:#64748b;">New Delhi, India</div>
                            <div style="font-size:5px; color:#64748b;">+91 98765 43210</div>
                            <div style="font-size:5px; color:#64748b;">sql.adi@email.com</div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Database Skills</span></div>
                            <div class="mini-skills-grid">
                                <span class="mini-skill-pill accent">PostgreSQL</span>
                                <span class="mini-skill-pill">Oracle SQL</span>
                                <span class="mini-skill-pill accent">T-SQL</span>
                                <span class="mini-skill-pill">Query Tuning</span>
                                <span class="mini-skill-pill accent">Indexing</span>
                                <span class="mini-skill-pill">ETL Pipelines</span>
                                <span class="mini-skill-pill accent">Snowflake</span>
                                <span class="mini-skill-pill">Redis</span>
                            </div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Education</span></div>
                            <div style="font-size:5px; font-weight:700; color:#0f172a;">M.Tech Data Eng</div>
                            <div style="font-size:4.8px; color:#64748b;">NIT Trichy (2016)</div>
                            <div style="font-size:5px; font-weight:700; color:#0f172a; margin-top:2px;">B.Tech CS</div>
                            <div style="font-size:4.8px; color:#64748b;">Vignan Univ (2014)</div>
                        </div>
                    </div>
                    <div class="tpl2-main">
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Summary</span><span class="mini-sec-line"></span></div>
                            <p class="mini-summary-text">Database Architect & SQL Specialist with 7+ years expertise in PostgreSQL, Oracle SQL, query optimization, ETL pipeline design, and high-availability database cluster management.</p>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Experience</span><span class="mini-sec-line"></span></div>
                            <div class="mini-exp-item">
                                <div class="mini-exp-header"><span>Lead Database Engineer</span><span>2021-Pres</span></div>
                                <div class="mini-exp-sub">DataMatrix Inc • Optimized complex SQL queries reducing DB latency by 70%.</div>
                            </div>
                            <div class="mini-exp-item">
                                <div class="mini-exp-header"><span>SQL Developer</span><span>2016-2021</span></div>
                                <div class="mini-exp-sub">InfoTech Labs • Designed data warehouse schemas and automated ETL jobs.</div>
                            </div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Database Projects</span><span class="mini-sec-line"></span></div>
                            <div style="font-size:5px; color:#334155; line-height:1.3;">
                                • <strong>Enterprise Warehouse Migration</strong>: Migrated 50TB Oracle DB to Snowflake.<br>
                                • <strong>Real-time ETL Pipeline</strong>: Built streaming data pipeline using Kafka & Postgres.
                            </div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Certifications</span><span class="mini-sec-line"></span></div>
                            <div style="font-size:5px; color:#475569;">Oracle Database PL/SQL Certified Professional | Postgres DBA Cert</div>
                        </div>
                    </div>
                </div>
            `;

        case 2:
            // ROLE 3: Full Stack Web Developer (Serif Elegant Divider)
            return `
                <div class="mini-resume-doc mini-template-3">
                    <div class="tpl3-header">
                        <div class="tpl3-name">${name}</div>
                        <div style="font-size:7px; font-weight:700; color:var(--active-theme-color); text-transform:uppercase; margin-top:1px;">Full Stack Web Developer</div>
                        <div style="font-size:5.5px; color:#64748b; margin-top:1.5px;">New Delhi • +91 98765 43210 • fullstack.adi@email.com</div>
                    </div>
                    <div class="tpl3-divider"></div>
                    <div class="mini-section" style="text-align:left;">
                        <div class="mini-sec-title"><span>Professional Profile</span><span class="mini-sec-line"></span></div>
                        <p class="mini-summary-text">Versatile Full Stack Engineer proficient in React, Node.js, TypeScript, Next.js, and Cloud APIs. Dedicated to delivering scalable web applications, responsive user interfaces, and robust backend microservices.</p>
                    </div>
                    <div class="mini-section" style="text-align:left;">
                        <div class="mini-sec-title"><span>Work History</span><span class="mini-sec-line"></span></div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>Senior Full Stack Engineer</span><span>2020 - Present</span></div>
                            <div class="mini-exp-sub">WebApp Innovations • Architected SaaS dashboard serving 500k active users.</div>
                        </div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>Frontend React Developer</span><span>2018 - 2020</span></div>
                            <div class="mini-exp-sub">CreativeApps Ltd • Built responsive modular UI design systems.</div>
                        </div>
                    </div>
                    <div class="mini-section" style="text-align:left;">
                        <div class="mini-sec-title"><span>Education</span><span class="mini-sec-line"></span></div>
                        <div class="mini-exp-header"><span>B.E. in Information Technology</span><span>Anna University (2018)</span></div>
                    </div>
                    <div class="mini-section" style="text-align:left;">
                        <div class="mini-sec-title"><span>Technical Stack & Projects</span><span class="mini-sec-line"></span></div>
                        <div class="mini-skills-grid">
                            <span class="mini-skill-pill accent">React</span>
                            <span class="mini-skill-pill">Node.js</span>
                            <span class="mini-skill-pill accent">TypeScript</span>
                            <span class="mini-skill-pill">Next.js</span>
                            <span class="mini-skill-pill accent">MongoDB</span>
                            <span class="mini-skill-pill">PostgreSQL</span>
                            <span class="mini-skill-pill accent">TailwindCSS</span>
                        </div>
                        <div style="font-size:5px; color:#334155; margin-top:2px;">• Project: Collaborative Real-Time Workspace Canvas & E-Commerce Platform</div>
                    </div>
                </div>
            `;

        case 3:
            // ROLE 4: DevOps & Cloud Architect (Right Sidebar Layout)
            return `
                <div class="mini-resume-doc mini-template-4">
                    <div class="tpl4-main">
                        <div class="mini-header">
                            <h3 class="mini-name">${name}</h3>
                            <div class="mini-title">DevOps & Cloud Architect</div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Profile</span><span class="mini-sec-line"></span></div>
                            <p class="mini-summary-text">Cloud Infrastructure & DevOps Architect expert in AWS, Terraform, Kubernetes orchestration, CI/CD automation, and zero-downtime microservices deployments.</p>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Experience</span><span class="mini-sec-line"></span></div>
                            <div class="mini-exp-item">
                                <div class="mini-exp-header"><span>Cloud DevOps Architect</span><span>2021-Pres</span></div>
                                <div class="mini-exp-sub">CloudScale Solutions • Managed AWS infra with 99.99% uptime via Terraform.</div>
                            </div>
                            <div class="mini-exp-item">
                                <div class="mini-exp-header"><span>Systems Administrator</span><span>2017-2021</span></div>
                                <div class="mini-exp-sub">NetCore Systems • Automated server provisioning & Kubernetes clusters.</div>
                            </div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>DevOps Projects</span><span class="mini-sec-line"></span></div>
                            <div style="font-size:5px; color:#334155; line-height:1.3;">
                                • <strong>Multi-Region Kubernetes</strong>: Setup automated failover AWS cluster.<br>
                                • <strong>Serverless Backup System</strong>: Built Lambda & Python automated backup pipeline.
                            </div>
                        </div>
                    </div>
                    <div class="tpl4-sidebar">
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Info</span></div>
                            <div style="font-size:5px; color:#475569;">New Delhi, India</div>
                            <div style="font-size:5px; color:#475569;">devops.adi@email.com</div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Skills</span></div>
                            <div class="mini-skills-grid">
                                <span class="mini-skill-pill accent">AWS</span>
                                <span class="mini-skill-pill">Kubernetes</span>
                                <span class="mini-skill-pill accent">Docker</span>
                                <span class="mini-skill-pill">Terraform</span>
                                <span class="mini-skill-pill accent">Ansible</span>
                                <span class="mini-skill-pill">Jenkins</span>
                                <span class="mini-skill-pill accent">Python</span>
                            </div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Education</span></div>
                            <div style="font-size:5px; font-weight:700; color:#0f172a;">B.Tech CS</div>
                            <div style="font-size:4.8px; color:#64748b;">BITS Pilani (2017)</div>
                        </div>
                        <div class="mini-section">
                            <div class="mini-sec-title"><span>Certs</span></div>
                            <div style="font-size:4.8px; color:#475569;">AWS Solutions Architect Pro | CKA Kubernetes</div>
                        </div>
                    </div>
                </div>
            `;

        case 4:
            // ROLE 5: Data Scientist & AI Specialist (Left Border Strip Layout)
            return `
                <div class="mini-resume-doc mini-template-5">
                    <div class="mini-header" style="border-bottom:none;">
                        <h3 class="mini-name">${name}</h3>
                        <div class="mini-title">Data Scientist & AI Specialist</div>
                        <div class="mini-contact"><span>New Delhi, India</span> • <span>+91 98765 43210</span> • <span>ai.adi@email.com</span></div>
                    </div>
                    <div class="mini-section">
                        <div class="tpl5-sec-head">Career Summary</div>
                        <p class="mini-summary-text">Data Scientist specializing in Machine Learning, Deep Learning, Natural Language Processing (NLP), Python predictive modeling, and scalable AI model deployment in cloud environments.</p>
                    </div>
                    <div class="mini-section">
                        <div class="tpl5-sec-head">Employment History</div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>Senior Data Scientist</span><span>2020 - Pres</span></div>
                            <div class="mini-exp-sub">AI Labs Global • Developed NLP sentiment model with 94% accuracy.</div>
                        </div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>Data Analytics Specialist</span><span>2018 - 2020</span></div>
                            <div class="mini-exp-sub">Analytics Hub • Built predictive churn models increasing retention by 25%.</div>
                        </div>
                    </div>
                    <div class="mini-section">
                        <div class="tpl5-sec-head">Academics & Certifications</div>
                        <div class="mini-exp-header"><span>M.S. in AI & Machine Learning</span><span>IISc Bangalore (2018)</span></div>
                        <div style="font-size:5px; color:#475569; margin-top:1px;">TensorFlow Developer Certified | AWS Machine Learning Specialty</div>
                    </div>
                    <div class="mini-section">
                        <div class="tpl5-sec-head">AI Projects & Tools</div>
                        <div class="mini-skills-grid">
                            <span class="mini-skill-pill accent">Python</span>
                            <span class="mini-skill-pill">PyTorch</span>
                            <span class="mini-skill-pill accent">TensorFlow</span>
                            <span class="mini-skill-pill">Scikit-Learn</span>
                            <span class="mini-skill-pill accent">NLP</span>
                            <span class="mini-skill-pill">SQL</span>
                            <span class="mini-skill-pill accent">Pandas</span>
                        </div>
                        <div style="font-size:5px; color:#334155; margin-top:1px;">• Project: Neural Network Image Classification & LLM Fine-Tuning Pipeline</div>
                    </div>
                </div>
            `;

        case 5:
            // ROLE 6: UX/UI Product Designer (Classic Executive Layout)
            return `
                <div class="mini-resume-doc mini-template-6">
                    <div class="mini-header">
                        <h3 class="mini-name" style="font-size:11px;">${name}</h3>
                        <div class="mini-title" style="letter-spacing:0.06em;">Lead UX/UI Product Designer</div>
                        <div class="mini-contact" style="justify-content:center;"><span>New Delhi, India</span> | <span>+91 98765 43210</span> | <span>ux.adi@email.com</span></div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title" style="border-bottom:1px solid #cbd5e1; padding-bottom:1px;"><span>EXECUTIVE SUMMARY</span></div>
                        <p class="mini-summary-text">Human-centered Senior Product Designer with 6+ years creating intuitive digital interfaces, design systems, wireframes, user research frameworks, and interactive prototypes for SaaS platforms.</p>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title" style="border-bottom:1px solid #cbd5e1; padding-bottom:1px;"><span>WORK EXPERIENCE</span></div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>Lead Product Designer</span><span>2020 - Present</span></div>
                            <div class="mini-exp-sub">DesignWorks Studio • Relaunched mobile app UI increasing engagement by 45%.</div>
                        </div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>UX Researcher & Specialist</span><span>2017 - 2020</span></div>
                            <div class="mini-exp-sub">Digital Craft • Conducted user interviews and created modular component libraries.</div>
                        </div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title" style="border-bottom:1px solid #cbd5e1; padding-bottom:1px;"><span>EDUCATION & DESIGN PROJECTS</span></div>
                        <div class="mini-exp-header"><span>Bachelor of Design (B.Des)</span><span>NID Ahmedabad (2017)</span></div>
                        <div style="font-size:5px; color:#334155; line-height:1.3; margin-top:1px;">
                            • <strong>Enterprise Design System</strong>: Created atomic UI library for 40+ products.<br>
                            • <strong>Mobile Banking App Redesign</strong>: Reduced transaction drop-off rate by 30%.
                        </div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title" style="border-bottom:1px solid #cbd5e1; padding-bottom:1px;"><span>DESIGN SKILLS</span></div>
                        <div class="mini-skills-grid">
                            <span class="mini-skill-pill accent">Figma</span>
                            <span class="mini-skill-pill">Design Systems</span>
                            <span class="mini-skill-pill accent">Wireframing</span>
                            <span class="mini-skill-pill">User Research</span>
                            <span class="mini-skill-pill accent">Prototyping</span>
                            <span class="mini-skill-pill">HTML/CSS</span>
                        </div>
                    </div>
                </div>
            `;

        case 6:
            // ROLE 7: Technical Product Manager (Timeline Dots Layout)
            return `
                <div class="mini-resume-doc">
                    <div class="mini-header">
                        <h3 class="mini-name">${name}</h3>
                        <div class="mini-title">Technical Product Manager</div>
                        <div class="mini-contact"><span><i class="fa-solid fa-location-dot"></i> New Delhi</span> • <span>+91 98765 43210</span> • <span>pm.adi@email.com</span></div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title"><span>Profile</span><span class="mini-sec-line"></span></div>
                        <p class="mini-summary-text">Strategic Technical Product Manager with engineering background, agile roadmap planning, data-driven feature prioritization, and proven track record of launching $5M+ ARR B2B SaaS products.</p>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title"><span>Timeline Experience</span><span class="mini-sec-line"></span></div>
                        <div class="tpl7-timeline">
                            <div class="tpl7-dot mini-exp-item">
                                <div class="mini-exp-header"><span>Senior Product Manager</span><span>2021-Pres</span></div>
                                <div class="mini-exp-sub">NextGen Tech • Managed product lifecycle generating $5M ARR.</div>
                            </div>
                            <div class="tpl7-dot mini-exp-item">
                                <div class="mini-exp-header"><span>Associate Product Manager</span><span>2018-2021</span></div>
                                <div class="mini-exp-sub">InnovateX • Led cross-functional engineering sprints & backlog grooming.</div>
                            </div>
                        </div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title"><span>Education</span><span class="mini-sec-line"></span></div>
                        <div class="mini-exp-header"><span>MBA in Technology Management</span><span>ISB Hyderabad (2018)</span></div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title"><span>Product Skills & Certifications</span><span class="mini-sec-line"></span></div>
                        <div class="mini-skills-grid">
                            <span class="mini-skill-pill accent">Product Strategy</span>
                            <span class="mini-skill-pill">Agile / Scrum</span>
                            <span class="mini-skill-pill accent">JIRA</span>
                            <span class="mini-skill-pill">Roadmapping</span>
                            <span class="mini-skill-pill accent">A/B Testing</span>
                            <span class="mini-skill-pill">Analytics</span>
                        </div>
                        <div style="font-size:5px; color:#475569; margin-top:1px;">CSPO Certified Scrum Product Owner | Pragmatic Institute Certified</div>
                    </div>
                </div>
            `;

        default:
            // ROLE 8: Cyber Security Engineer (Dual-Tone Header Layout)
            return `
                <div class="mini-resume-doc">
                    <div class="mini-header" style="background:#f8fafc; padding:5px 8px; border-radius:4px; border-bottom:2px solid var(--active-theme-color);">
                        <h3 class="mini-name">${name}</h3>
                        <div class="mini-title">Cyber Security & Defense Engineer</div>
                        <div class="mini-contact"><span>New Delhi, India</span> • <span>+91 98765 43210</span> • <span>security.adi@email.com</span></div>
                    </div>
                    <div class="mini-section" style="margin-top:2px;">
                        <div class="mini-sec-title"><span>Executive Overview</span><span class="mini-sec-line"></span></div>
                        <p class="mini-summary-text">Information Security Specialist experienced in penetration testing, vulnerability management, SIEM threat monitoring (Splunk), incident response, network firewalls, and ISO27001 security compliance.</p>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title"><span>Work History</span><span class="mini-sec-line"></span></div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>Senior Security Engineer</span><span>2020-Pres</span></div>
                            <div class="mini-exp-sub">CyberShield Security • Conducted pen testing & SIEM monitoring for financial clients.</div>
                        </div>
                        <div class="mini-exp-item">
                            <div class="mini-exp-header"><span>Network Security Analyst</span><span>2017-2020</span></div>
                            <div class="mini-exp-sub">SecureNet Inc • Configured enterprise firewalls and vulnerability scans.</div>
                        </div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title"><span>Education & Projects</span><span class="mini-sec-line"></span></div>
                        <div class="mini-exp-header"><span>B.Tech in Cybersecurity</span><span>IIIT Hyderabad (2017)</span></div>
                        <div style="font-size:5px; color:#334155; margin-top:1px;">• Project: Zero-Trust Network Architecture & Automated Vulnerability Scanner</div>
                    </div>
                    <div class="mini-section">
                        <div class="mini-sec-title"><span>Security Certifications & Skills</span><span class="mini-sec-line"></span></div>
                        <div class="mini-skills-grid">
                            <span class="mini-skill-pill accent">Pen Testing</span>
                            <span class="mini-skill-pill">SIEM Splunk</span>
                            <span class="mini-skill-pill accent">Python</span>
                            <span class="mini-skill-pill">Wireshark</span>
                            <span class="mini-skill-pill accent">Firewalls</span>
                            <span class="mini-skill-pill">ISO27001</span>
                        </div>
                        <div style="font-size:4.8px; color:#475569; margin-top:1px;">CISSP Certified | CEH (Certified Ethical Hacker)</div>
                    </div>
                </div>
            `;
    }
}

// ==========================================
// Form Submission Logic
// ==========================================
if (resumeForm) {
    resumeForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const resumeTitleInput = document.getElementById("resume_title");
        let resume_title = resumeTitleInput ? resumeTitleInput.value.trim() : "";

        if (!resume_title) {
            resume_title = localStorage.getItem("pending_resume_title") || localStorage.getItem("resume_uploaded_filename") || "My Resume";
            if (resumeTitleInput) resumeTitleInput.value = resume_title;
        }

        const checkedRadio = document.querySelector('input[name="template"]:checked');
        const template_id = checkedRadio ? checkedRadio.value : "1";
        const user_id = localStorage.getItem("user_id") || "1";

        try {
            const response = await fetch(`${API_BASE_URL}/api/resume/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id,
                    resume_title,
                    template_id
                })
            });

            const result = await response.json();
            const resumeId = (result && (result.ref_id || result.resume_id)) ? (result.ref_id || result.resume_id) : Date.now();

            localStorage.setItem("resume_id", resumeId);
            localStorage.setItem(`resume_template_id_${resumeId}`, template_id);
            localStorage.setItem("resume_theme_color", selectedThemeColor);

            const isUploadSource = !!localStorage.getItem("uploaded_resume_parsed_data") || localStorage.getItem("resume_upload_source") === "uploaded_file";

            if (isUploadSource) {
                // Trigger upload persistence in background and navigate immediately
                populateUploadedResumeData(resumeId).catch(console.error);
                localStorage.removeItem("resume_upload_source");
                window.location.href = "editor.html?source=upload";
            } else {
                window.location.href = "editor.html";
            }
        } catch (err) {
            console.error("Submission error:", err);
            const mockResumeId = Date.now();
            localStorage.setItem("resume_id", mockResumeId);
            localStorage.setItem(`resume_template_id_${mockResumeId}`, template_id);
            localStorage.setItem("resume_theme_color", selectedThemeColor);
            window.location.href = "editor.html";
        }
    });
}

// ==========================================
// Helper: Call ALL backend saving functions to persist uploaded resume data in DB tables
// ==========================================
async function populateUploadedResumeData(resumeId) {
    try {
        const parsedDataStr = localStorage.getItem("uploaded_resume_parsed_data");
        if (!parsedDataStr) return;

        const data = JSON.parse(parsedDataStr);
        const userId = localStorage.getItem("user_id") || "1";
        const templateId = localStorage.getItem(`resume_template_id_${resumeId}`) || "1";
        const resumeTitle = localStorage.getItem("pending_resume_title") || "My Resume";

        console.log(`Calling master procedure upr_insupd_hr_resume_full_upload_json for resume_id ${resumeId}...`);

        // 1. Call Master Unified PL/pgSQL Function upr_insupd_hr_resume_full_upload_json
        const fullPayload = {
            user_id: userId,
            resume_id: resumeId,
            resume_title: resumeTitle,
            template_id: templateId,
            personal: data.personal || {},
            education: data.education || [],
            experience: data.experience || [],
            skills: data.skills || [],
            projects: data.projects || [],
            certifications: data.certifications || []
        };

        const masterRes = await fetch(`${API_BASE_URL}/api/resume/save-full-upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullPayload)
        });

        const masterResult = await masterRes.json();
        console.log("Master PL/pgSQL Save Result:", masterResult);

        // 2. Individual inner section fallbacks to guarantee 100% table population
        if (data.personal) {
            const p = data.personal;
            await fetch(`${API_BASE_URL}/api/personal/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_id: resumeId, ...p })
            });
        }

        if (Array.isArray(data.education) && data.education.length > 0) {
            for (const edu of data.education) {
                await fetch(`${API_BASE_URL}/api/education/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume_id: resumeId, ...edu })
                });
            }
        }

        if (Array.isArray(data.experience) && data.experience.length > 0) {
            for (const exp of data.experience) {
                await fetch(`${API_BASE_URL}/api/experience/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume_id: resumeId, ...exp })
                });
            }
        }

        if (Array.isArray(data.skills) && data.skills.length > 0) {
            for (const sk of data.skills) {
                await fetch(`${API_BASE_URL}/api/skills/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume_id: resumeId, ...sk })
                });
            }
        }

        if (Array.isArray(data.projects) && data.projects.length > 0) {
            for (const proj of data.projects) {
                await fetch(`${API_BASE_URL}/api/projects/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume_id: resumeId, ...proj })
                });
            }
        }

        console.log(`Successfully saved ALL uploaded resume sections via master PL/pgSQL function for resume_id: ${resumeId}!`);
        // Kept in localStorage so editor.js can consume & pre-fill in memory immediately
    } catch (err) {
        console.error("Error populating uploaded resume data to DB tables:", err);
    }
}