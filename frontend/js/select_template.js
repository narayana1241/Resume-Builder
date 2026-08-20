var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

const resume_id = localStorage.getItem("resume_id");
const user_id = localStorage.getItem("user_id");

let templatesList = [];
let activeTemplateId = null;
let currentSearchQuery = "";
let activeCategoryFilter = "all";
let selectedThemeColor = localStorage.getItem("resume_theme_color") || "#2563eb";

window.addEventListener("DOMContentLoaded", async () => {
    const localTemplateOverride = localStorage.getItem(`resume_template_id_${resume_id}`);
    activeTemplateId = localTemplateOverride ? Number(localTemplateOverride) : null;

    setupColorPicker();
    setupEventListeners();
    await fetchTemplates();
});

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

async function fetchTemplates() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/templates`);
        const result = await response.json();

        if (result.success && result.data) {
            templatesList = Array.isArray(result.data) ? result.data : (result.data.data || []);
            if (!activeTemplateId && templatesList.length > 0) {
                activeTemplateId = Number(templatesList[0].template_id);
            }
            renderTemplatesGrid();
        } else {
            fallbackTemplates();
        }
    } catch (err) {
        console.error("Fetch templates error:", err);
        fallbackTemplates();
    }
}

function fallbackTemplates() {
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
    if (!activeTemplateId) activeTemplateId = 1;
    renderTemplatesGrid();
}

function renderTemplatesGrid() {
    const grid = document.getElementById("templatesGalleryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const filteredTemplates = templatesList.filter(tpl => {
        const matchesSearch = tpl.template_name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                              tpl.template_folder.toLowerCase().includes(currentSearchQuery.toLowerCase());
        
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

    filteredTemplates.forEach((tpl, index) => {
        const isCurrent = Number(tpl.template_id) === Number(activeTemplateId);
        const cardClass = isCurrent ? "gallery-card active" : "gallery-card";
        
        const badgeText = tpl.is_premium ? "Premium" : "ATS Friendly";
        const badgeClass = tpl.is_premium ? "premium-overlay-badge" : "ats-overlay-badge";
        const checkmarkBadge = isCurrent 
            ? `<div class="checkmark-badge"><i class="fa-solid fa-check"></i></div>` 
            : "";

        const miniPreviewHtml = buildCleanMiniResumePreview(tpl, index);

        const card = document.createElement("div");
        card.className = cardClass;
        card.innerHTML = `
            <div class="gallery-card-img-box">
                ${miniPreviewHtml}
                <div class="${badgeClass}">${badgeText}</div>
                ${checkmarkBadge}
                <div class="gallery-card-overlay">
                    <button class="btn-choose-template">Choose Template</button>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            activeTemplateId = Number(tpl.template_id);
            if (resume_id) {
                localStorage.setItem(`resume_template_id_${resume_id}`, activeTemplateId);
            }
            localStorage.setItem("resume_theme_color", selectedThemeColor);

            renderTemplatesGrid();

            setTimeout(() => {
                window.location.href = "editor.html";
            }, 250);
        });

        grid.appendChild(card);
    });
}

function buildCleanMiniResumePreview(tpl, index) {
    const layoutIndex = (index !== undefined ? index : ((tpl.template_id || 1) - 1)) % 8;
    const name = "ADI NAGANABOINA";

    switch(layoutIndex) {
        case 0:
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

function setupEventListeners() {
    const btnBack = document.getElementById("btnBackToEditor");
    if (btnBack) {
        btnBack.addEventListener("click", () => {
            window.location.href = "editor.html";
        });
    }

    const searchInput = document.getElementById("templateSearch");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchQuery = e.target.value;
            renderTemplatesGrid();
        });
    }

    document.querySelectorAll(".filter-badge").forEach(badge => {
        badge.addEventListener("click", () => {
            document.querySelectorAll(".filter-badge").forEach(b => b.classList.remove("active"));
            badge.classList.add("active");
            activeCategoryFilter = badge.getAttribute("data-filter");
            renderTemplatesGrid();
        });
    });
}
