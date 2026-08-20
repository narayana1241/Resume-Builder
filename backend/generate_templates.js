const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "..", "frontend", "templates");

const templates = {
  "Template-001": {
    name: "The Campus Pioneer",
    is_premium: true,
    html: `<div class="resume tpl-001">
    <div class="top-accent"></div>
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-pill-box">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title"><i class="fa-solid fa-compass"></i> Career Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <div class="two-col-grid">
        <div class="col-main">
            <!-- {{#if projects}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-laptop-code"></i> Academic Projects</h3>
                <div class="items-list">
                    <!-- {{#projects}} -->
                    <div class="project-card">
                        <div class="item-header">
                            <span class="item-title"><strong>{{project_name}}</strong></span>
                            <span class="item-date">{{start_date}} - {{end_date}}</span>
                        </div>
                        <div class="role-badge">Role: {{role}} | Stack: {{technologies_used}}</div>
                        <p class="item-details">{{project_description}}</p>
                        <div class="links-row">
                            <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank"><i class="fa-brands fa-github"></i> Repository</a><!-- {{/if}} -->
                            <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank"><i class="fa-solid fa-globe"></i> Live Demo</a><!-- {{/if}} -->
                        </div>
                    </div>
                    <!-- {{/projects}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- {{#if experience}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-briefcase"></i> Internships & Experience</h3>
                <div class="items-list">
                    <!-- {{#experience}} -->
                    <div class="resume-item">
                        <div class="item-header">
                            <span class="item-title"><strong>{{job_title}}</strong></span>
                            <span class="item-date">{{start_date}} - {{end_date_or_present}}</span>
                        </div>
                        <div class="item-sub"><strong>{{company_name}}</strong> | {{location}}</div>
                        <p class="item-details">{{job_description}}</p>
                    </div>
                    <!-- {{/experience}} -->
                </div>
            </section>
            <!-- {{/if}} -->
        </div>

        <div class="col-side">
            <!-- {{#if education}} -->
            <section class="resume-section side-card">
                <h3 class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</h3>
                <div class="items-list">
                    <!-- {{#education}} -->
                    <div class="edu-card">
                        <div class="edu-degree">{{degree}}</div>
                        <div class="edu-field">{{field_of_study}}</div>
                        <div class="edu-inst">{{institution}}</div>
                        <div class="edu-meta">{{start_year}} - {{end_year}}</div>
                        <!-- {{#if cgpa_percentage}} --><div class="gpa-badge">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
                    </div>
                    <!-- {{/education}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- {{#if skills}} -->
            <section class="resume-section side-card">
                <h3 class="section-title"><i class="fa-solid fa-code"></i> Skills</h3>
                <div class="skills-flex">
                    <!-- {{#skills}} -->
                    <div class="skill-pill">
                        <span class="s-name">{{skill_name}}</span>
                        <span class="s-level">{{skill_level}}</span>
                    </div>
                    <!-- {{/skills}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- {{#if certifications}} -->
            <section class="resume-section side-card">
                <h3 class="section-title"><i class="fa-solid fa-certificate"></i> Certifications</h3>
                <div class="items-list">
                    <!-- {{#certifications}} -->
                    <div class="cert-item">
                        <div class="cert-title">{{certification_name}}</div>
                        <div class="cert-issuer">{{issuing_organization}} ({{issue_date}})</div>
                    </div>
                    <!-- {{/certifications}} -->
                </div>
            </section>
            <!-- {{/if}} -->
        </div>
    </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.resume.tpl-001 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f766e;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-001 .top-accent {
    height: 6px;
    background: linear-gradient(90deg, #0f766e, #0d9488, #2dd4bf);
    border-radius: 4px;
    margin-bottom: 16px;
}

.tpl-001 .resume-header { text-align: center; margin-bottom: 20px; }
.tpl-001 .resume-name { font-size: 30px; font-weight: 800; color: #0f766e; margin: 0; }
.tpl-001 .resume-title { font-size: 15px; font-weight: 600; color: #0d9488; text-transform: uppercase; letter-spacing: 0.08em; margin: 4px 0 12px 0; }
.tpl-001 .contact-pill-box { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; font-size: 12px; }
.tpl-001 .contact-pill-box span { background: #e6fffa; color: #115e59; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #99f6e4; }
.tpl-001 .contact-pill-box i { color: #0d9488; }
.tpl-001 .contact-pill-box a { color: inherit; text-decoration: none; }
.tpl-001 .section-title { font-size: 14px; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #99f6e4; padding-bottom: 6px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; }
.tpl-001 .summary-text { font-size: 12.5px; line-height: 1.6; color: #334155; background: #f0fdf4; padding: 10px 14px; border-left: 4px solid #0d9488; border-radius: 0 6px 6px 0; margin-bottom: 16px; }
.tpl-001 .two-col-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 18px; }
.tpl-001 .project-card { background: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; }
.tpl-001 .item-header { display: flex; justify-content: space-between; font-size: 13.5px; color: #0f766e; }
.tpl-001 .item-date { font-size: 11.5px; color: #64748b; }
.tpl-001 .role-badge { font-size: 11.5px; color: #0d9488; font-weight: 600; margin: 2px 0; }
.tpl-001 .item-details { font-size: 12px; color: #334155; margin: 6px 0 4px 0; }
.tpl-001 .links-row a { color: #0f766e; font-weight: 600; font-size: 11.5px; text-decoration: none; margin-right: 10px; }
.tpl-001 .side-card { background: #f0fdf4; border: 1px solid #ccfbf1; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
.tpl-001 .edu-card { margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed #99f6e4; }
.tpl-001 .edu-degree { font-size: 13px; font-weight: 700; color: #0f766e; }
.tpl-001 .edu-field { font-size: 12px; color: #0d9488; font-weight: 600; }
.tpl-001 .edu-inst, .tpl-001 .edu-meta { font-size: 11.5px; color: #475569; }
.tpl-001 .gpa-badge { display: inline-block; background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-top: 4px; }
.tpl-001 .skills-flex { display: flex; flex-direction: column; gap: 6px; }
.tpl-001 .skill-pill { display: flex; justify-content: space-between; background: #ffffff; padding: 5px 8px; border-radius: 6px; border: 1px solid #99f6e4; font-size: 12px; }
.tpl-001 .s-name { font-weight: 600; color: #0f766e; }
.tpl-001 .s-level { color: #0d9488; font-size: 11px; }
.tpl-001 .cert-item { margin-bottom: 6px; font-size: 12px; }
.tpl-001 .cert-title { font-weight: 700; color: #0f766e; }
.tpl-001 .cert-issuer { font-size: 11px; color: #64748b; }`
  },

  "Template-002": {
    name: "The Code & Craft",
    is_premium: true,
    html: `<div class="resume tpl-002">
    <header class="resume-header">
        <div class="terminal-bar">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
            <span class="term-title">fresher_portfolio.sh</span>
        </div>
        <div class="header-inner">
            <h1 class="resume-name">&lt;{{full_name}} /&gt;</h1>
            <h2 class="resume-title">$ {{designation}}</h2>
            <div class="contact-code">
                <!-- {{#if email}} --><span>email: "{{email}}"</span><!-- {{/if}} -->
                <!-- {{#if mobile}} --><span>phone: "{{mobile}}"</span><!-- {{/if}} -->
                <!-- {{#if location}} --><span>loc: "{{location}}"</span><!-- {{/if}} -->
                <!-- {{#if github_url}} --><span>github: "<a href="{{github_url}}" target="_blank">{{github_url}}</a>"</span><!-- {{/if}} -->
            </div>
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Dev Bio */</h3>
        <p class="summary-box">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Featured Repos */</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="repo-card">
                <div class="repo-header">
                    <span class="repo-name"><i class="fa-solid fa-folder-open"></i> {{project_name}}</span>
                    <span class="repo-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="repo-role">Role: {{role}} | Tech: <span class="tech-highlight">{{technologies_used}}</span></div>
                <p class="repo-desc">{{project_description}}</p>
                <div class="repo-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">[GitHub]</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">[Live Demo]</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Technical Skills */</h3>
        <div class="code-skills-grid">
            <!-- {{#skills}} -->
            <div class="code-skill-tag">
                <span class="k-key">{{skill_name}}</span>: <span class="k-val">"{{skill_level}}"</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Education */</h3>
        <!-- {{#education}} -->
        <div class="edu-line">
            <div class="edu-main"><strong>{{degree}}</strong> in {{field_of_study}} -- {{institution}}</div>
            <div class="edu-sub">Year: {{start_year}}-{{end_year}} <!-- {{#if cgpa_percentage}} -->| GPA: {{cgpa_percentage}}<!-- {{/if}} --></div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

.resume.tpl-002 { font-family: 'JetBrains Mono', monospace; background: #ffffff; color: #1e293b; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-002 .terminal-bar { background: #0f172a; padding: 6px 12px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 6px; }
.tpl-002 .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.tpl-002 .dot.red { background: #ef4444; } .tpl-002 .dot.yellow { background: #f59e0b; } .tpl-002 .dot.green { background: #10b981; }
.tpl-002 .term-title { color: #94a3b8; font-size: 11px; margin-left: 8px; }
.tpl-002 .header-inner { background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 0 0 8px 8px; margin-bottom: 18px; }
.tpl-002 .resume-name { font-size: 26px; color: #f59e0b; margin: 0; }
.tpl-002 .resume-title { font-size: 14px; color: #38bdf8; margin: 4px 0 10px 0; }
.tpl-002 .contact-code { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11.5px; color: #cbd5e1; }
.tpl-002 .contact-code a { color: #38bdf8; text-decoration: none; }
.tpl-002 .section-title { font-size: 13.5px; color: #f59e0b; margin: 0 0 10px 0; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px; }
.tpl-002 .summary-box { font-size: 12.5px; color: #334155; background: #fffbe6; border-left: 3px solid #f59e0b; padding: 8px 12px; margin-bottom: 16px; }
.tpl-002 .repo-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 10px; }
.tpl-002 .repo-header { display: flex; justify-content: space-between; font-size: 13px; color: #0f172a; }
.tpl-002 .repo-name { font-weight: 700; color: #d97706; }
.tpl-002 .repo-date { font-size: 11px; color: #64748b; }
.tpl-002 .repo-role { font-size: 11.5px; color: #475569; margin: 2px 0; }
.tpl-002 .tech-highlight { color: #f59e0b; font-weight: 600; }
.tpl-002 .repo-desc { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-002 .repo-links a { color: #d97706; text-decoration: none; font-weight: 600; margin-right: 10px; font-size: 11px; }
.tpl-002 .code-skills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.tpl-002 .code-skill-tag { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 4px; font-size: 11.5px; }
.tpl-002 .k-key { color: #0f172a; font-weight: 700; }
.tpl-002 .k-val { color: #d97706; }
.tpl-002 .edu-line { margin-bottom: 8px; font-size: 12px; }
.tpl-002 .edu-main { color: #0f172a; }
.tpl-002 .edu-sub { color: #64748b; font-size: 11px; }`
  },

  "Template-003": {
    name: "The Academic Pathfinder",
    is_premium: true,
    html: `<div class="resume tpl-003">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="gold-divider"></div>
        <div class="contact-row">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic & Career Profile</h3>
        <p class="summary-quote">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education & Academic Record</h3>
        <!-- {{#education}} -->
        <div class="edu-box">
            <div class="edu-header">
                <span class="edu-deg"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="edu-dates">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="edu-univ"><strong>{{institution}}</strong>, {{university}}</div>
            <!-- {{#if cgpa_percentage}} --><div class="honors-badge">Score / GPA: {{cgpa_percentage}}</div><!-- {{/if}} -->
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Projects & Research</h3>
        <!-- {{#projects}} -->
        <div class="project-entry">
            <div class="p-head">
                <span class="p-title">{{project_name}}</span>
                <span class="p-date">{{start_date}} - {{end_date}}</span>
            </div>
            <div class="p-role">Role: {{role}} | Tech: {{technologies_used}}</div>
            <p class="p-desc">{{project_description}}</p>
            <div class="p-links">
                <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Code Repository</a><!-- {{/if}} -->
                <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live Project</a><!-- {{/if}} -->
            </div>
        </div>
        <!-- {{/projects}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Core Skills</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="gold-skill">
                <span class="s-n">{{skill_name}}</span>
                <span class="s-l">({{skill_level}})</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

.resume.tpl-003 { font-family: 'Inter', sans-serif; color: #1e3a8a; background: #ffffff; padding: 18mm 16mm; box-sizing: border-box; }
.tpl-003 h1, .tpl-003 h2, .tpl-003 .section-title { font-family: 'Playfair Display', serif; }
.tpl-003 .resume-header { text-align: center; margin-bottom: 22px; }
.tpl-003 .resume-name { font-size: 32px; font-weight: 700; color: #1e3a8a; margin: 0; }
.tpl-003 .resume-title { font-size: 15px; font-weight: 600; color: #d97706; letter-spacing: 0.06em; text-transform: uppercase; margin: 4px 0 10px 0; }
.tpl-003 .gold-divider { height: 2px; width: 80px; background: #d97706; margin: 0 auto 12px auto; }
.tpl-003 .contact-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; font-size: 12px; color: #475569; }
.tpl-003 .contact-row i { color: #1e3a8a; }
.tpl-003 .contact-row a { color: inherit; text-decoration: none; }
.tpl-003 .section-title { font-size: 16px; color: #1e3a8a; border-bottom: 1px solid #fef08a; padding-bottom: 4px; margin: 0 0 12px 0; }
.tpl-003 .summary-quote { font-style: italic; font-size: 13px; color: #334155; background: #fffbe6; padding: 10px 16px; border-left: 3px solid #d97706; margin-bottom: 18px; }
.tpl-003 .edu-box { margin-bottom: 10px; background: #eff6ff; padding: 8px 12px; border-radius: 6px; border: 1px solid #bfdbfe; }
.tpl-003 .edu-header { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-003 .edu-deg { color: #1e3a8a; }
.tpl-003 .edu-dates { font-size: 11.5px; color: #64748b; }
.tpl-003 .edu-univ { font-size: 12px; color: #475569; }
.tpl-003 .honors-badge { display: inline-block; background: #fef3c7; color: #92400e; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 4px; margin-top: 4px; }
.tpl-003 .project-entry { margin-bottom: 12px; }
.tpl-003 .p-head { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-003 .p-title { font-weight: 700; color: #1e3a8a; }
.tpl-003 .p-date { font-size: 11.5px; color: #64748b; }
.tpl-003 .p-role { font-size: 12px; color: #d97706; font-weight: 600; }
.tpl-003 .p-desc { font-size: 12.5px; color: #334155; margin: 4px 0; }
.tpl-003 .p-links a { font-size: 11.5px; color: #1e3a8a; font-weight: 600; text-decoration: underline; margin-right: 10px; }
.tpl-003 .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.tpl-003 .gold-skill { border: 1px solid #d97706; background: #fffbe6; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
.tpl-003 .s-n { font-weight: 600; color: #1e3a8a; }
.tpl-003 .s-l { color: #b45309; font-size: 11px; }`
  },

  "Template-004": {
    name: "The Modern Scholar",
    is_premium: true,
    html: `<div class="resume tpl-004">
    <header class="header-card">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-grid">
            <!-- {{#if email}} --><div><i class="fa-solid fa-envelope"></i> {{email}}</div><!-- {{/if}} -->
            <!-- {{#if mobile}} --><div><i class="fa-solid fa-phone"></i> {{mobile}}</div><!-- {{/if}} -->
            <!-- {{#if location}} --><div><i class="fa-solid fa-location-dot"></i> {{location}}</div><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><div><a href="{{linkedin_url}}" target="_blank">LinkedIn</a></div><!-- {{/if}} -->
            <!-- {{#if github_url}} --><div><a href="{{github_url}}" target="_blank">GitHub</a></div><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <div class="grid-card">
        <h3 class="card-title">Career Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </div>
    <!-- {{/if}} -->

    <div class="cards-layout">
        <div class="col">
            <!-- {{#if projects}} -->
            <div class="grid-card">
                <h3 class="card-title">Projects</h3>
                <!-- {{#projects}} -->
                <div class="item-block">
                    <div class="b-head">
                        <span class="b-title">{{project_name}}</span>
                        <span class="b-date">{{start_date}} - {{end_date}}</span>
                    </div>
                    <div class="b-sub">Role: {{role}} | {{technologies_used}}</div>
                    <p class="b-desc">{{project_description}}</p>
                    <div class="b-links">
                        <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">GitHub</a><!-- {{/if}} -->
                        <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live Demo</a><!-- {{/if}} -->
                    </div>
                </div>
                <!-- {{/projects}} -->
            </div>
            <!-- {{/if}} -->
        </div>

        <div class="col">
            <!-- {{#if education}} -->
            <div class="grid-card">
                <h3 class="card-title">Education</h3>
                <!-- {{#education}} -->
                <div class="edu-item">
                    <div class="e-deg"><strong>{{degree}}</strong></div>
                    <div class="e-field">{{field_of_study}}</div>
                    <div class="e-inst">{{institution}}</div>
                    <div class="e-meta">{{start_year}} - {{end_year}}</div>
                    <!-- {{#if cgpa_percentage}} --><div class="e-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
                </div>
                <!-- {{/education}} -->
            </div>
            <!-- {{/if}} -->

            <!-- {{#if skills}} -->
            <div class="grid-card">
                <h3 class="card-title">Skills</h3>
                <div class="skills-box">
                    <!-- {{#skills}} -->
                    <span class="violet-badge">{{skill_name}} <small>({{skill_level}})</small></span>
                    <!-- {{/skills}} -->
                </div>
            </div>
            <!-- {{/if}} -->
        </div>
    </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.resume.tpl-004 { font-family: 'Outfit', sans-serif; background: #f8fafc; color: #1e293b; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-004 .header-card { background: linear-gradient(135deg, #581c87, #7e22ce); color: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 16px; }
.tpl-004 .resume-name { font-size: 28px; font-weight: 800; margin: 0; }
.tpl-004 .resume-title { font-size: 14px; font-weight: 500; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.08em; margin: 4px 0 14px 0; }
.tpl-004 .contact-grid { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #f3e8ff; }
.tpl-004 .contact-grid a { color: #ffffff; text-decoration: underline; }
.tpl-004 .cards-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 14px; }
.tpl-004 .grid-card { background: #ffffff; border-radius: 10px; padding: 14px; margin-bottom: 14px; border: 1px solid #e2e8f0; }
.tpl-004 .card-title { font-size: 14px; font-weight: 700; color: #581c87; text-transform: uppercase; margin: 0 0 10px 0; border-bottom: 2px solid #f3e8ff; padding-bottom: 4px; }
.tpl-004 .summary-text { font-size: 12.5px; color: #475569; line-height: 1.6; }
.tpl-004 .item-block { margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
.tpl-004 .b-head { display: flex; justify-content: space-between; font-size: 13px; }
.tpl-004 .b-title { font-weight: 700; color: #0f172a; }
.tpl-004 .b-date { font-size: 11px; color: #64748b; }
.tpl-004 .b-sub { font-size: 11.5px; color: #7e22ce; font-weight: 600; margin: 2px 0; }
.tpl-004 .b-desc { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-004 .b-links a { font-size: 11px; color: #581c87; font-weight: 600; margin-right: 10px; text-decoration: none; }
.tpl-004 .edu-item { margin-bottom: 8px; }
.tpl-004 .e-deg { font-size: 13px; color: #0f172a; }
.tpl-004 .e-field { font-size: 12px; color: #7e22ce; font-weight: 600; }
.tpl-004 .e-inst, .tpl-004 .e-meta { font-size: 11px; color: #64748b; }
.tpl-004 .e-gpa { display: inline-block; background: #f3e8ff; color: #6b21a8; font-weight: 700; font-size: 10.5px; padding: 2px 6px; border-radius: 4px; margin-top: 2px; }
.tpl-004 .skills-box { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-004 .violet-badge { background: #f3e8ff; color: #6b21a8; padding: 3px 8px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }`
  },

  "Template-005": {
    name: "The Technical Dynamo",
    is_premium: true,
    html: `<div class="resume tpl-005">
    <aside class="sidebar">
        <div class="profile-header">
            <h1 class="resume-name">{{full_name}}</h1>
            <h2 class="resume-title">{{designation}}</h2>
        </div>
        <div class="sidebar-section">
            <h3 class="side-title">Contact</h3>
            <div class="contact-list">
                <!-- {{#if email}} --><div class="c-item"><i class="fa-solid fa-envelope"></i> {{email}}</div><!-- {{/if}} -->
                <!-- {{#if mobile}} --><div class="c-item"><i class="fa-solid fa-phone"></i> {{mobile}}</div><!-- {{/if}} -->
                <!-- {{#if location}} --><div class="c-item"><i class="fa-solid fa-location-dot"></i> {{location}}</div><!-- {{/if}} -->
                <!-- {{#if linkedin_url}} --><div class="c-item"><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></div><!-- {{/if}} -->
                <!-- {{#if github_url}} --><div class="c-item"><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></div><!-- {{/if}} -->
            </div>
        </div>

        <!-- {{#if education}} -->
        <div class="sidebar-section">
            <h3 class="side-title">Education</h3>
            <!-- {{#education}} -->
            <div class="side-edu">
                <div class="s-degree"><strong>{{degree}}</strong></div>
                <div class="s-field">{{field_of_study}}</div>
                <div class="s-inst">{{institution}}</div>
                <div class="s-year">{{start_year}} - {{end_year}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="s-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
            <!-- {{/education}} -->
        </div>
        <!-- {{/if}} -->

        <!-- {{#if skills}} -->
        <div class="sidebar-section">
            <h3 class="side-title">Skills</h3>
            <div class="side-skills">
                <!-- {{#skills}} -->
                <div class="side-skill-tag">
                    <span>{{skill_name}}</span>
                    <small>{{skill_level}}</small>
                </div>
                <!-- {{/skills}} -->
            </div>
        </div>
        <!-- {{/if}} -->
    </aside>

    <main class="main-content">
        <!-- {{#if professional_summary}} -->
        <section class="main-section">
            <h3 class="main-title">Professional Summary</h3>
            <p class="summary-p">{{professional_summary}}</p>
        </section>
        <!-- {{/if}} -->

        <!-- {{#if projects}} -->
        <section class="main-section">
            <h3 class="main-title">Academic Projects</h3>
            <div class="items-group">
                <!-- {{#projects}} -->
                <div class="main-item">
                    <div class="item-head">
                        <span class="title-bold">{{project_name}}</span>
                        <span class="date-badge">{{start_date}} - {{end_date}}</span>
                    </div>
                    <div class="sub-role">Role: {{role}} | Tech: {{technologies_used}}</div>
                    <p class="desc-text">{{project_description}}</p>
                    <div class="proj-links">
                        <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">GitHub</a><!-- {{/if}} -->
                        <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Demo</a><!-- {{/if}} -->
                    </div>
                </div>
                <!-- {{/projects}} -->
            </div>
        </section>
        <!-- {{/if}} -->
    </main>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.resume.tpl-005 { font-family: 'Inter', sans-serif; display: flex; background: #ffffff; color: #1e293b; min-height: 100%; box-sizing: border-box; }
.tpl-005 .sidebar { width: 32%; background: #0f172a; color: #f8fafc; padding: 18mm 12mm; box-sizing: border-box; }
.tpl-005 .profile-header { margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 14px; }
.tpl-005 .resume-name { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; }
.tpl-005 .resume-title { font-size: 13px; font-weight: 600; color: #06b6d4; text-transform: uppercase; margin-top: 6px; }
.tpl-005 .sidebar-section { margin-bottom: 18px; }
.tpl-005 .side-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #06b6d4; border-bottom: 1px solid #334155; padding-bottom: 4px; margin: 0 0 10px 0; }
.tpl-005 .contact-list { font-size: 11.5px; display: flex; flex-direction: column; gap: 8px; color: #cbd5e1; }
.tpl-005 .c-item i { color: #06b6d4; width: 14px; }
.tpl-005 .c-item a { color: inherit; text-decoration: none; }
.tpl-005 .side-edu { margin-bottom: 10px; font-size: 11.5px; }
.tpl-005 .s-degree { color: #ffffff; font-size: 12px; }
.tpl-005 .s-field { color: #06b6d4; }
.tpl-005 .s-inst, .tpl-005 .s-year { color: #94a3b8; font-size: 11px; }
.tpl-005 .s-gpa { display: inline-block; background: #155e75; color: #67e8f9; font-weight: 700; padding: 1px 5px; border-radius: 3px; font-size: 10.5px; margin-top: 2px; }
.tpl-005 .side-skills { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-005 .side-skill-tag { background: #1e293b; border: 1px solid #334155; padding: 3px 7px; border-radius: 4px; font-size: 11px; color: #e2e8f0; display: flex; justify-content: space-between; width: 100%; }
.tpl-005 .side-skill-tag small { color: #06b6d4; }
.tpl-005 .main-content { width: 68%; padding: 18mm 14mm; box-sizing: border-box; }
.tpl-005 .main-section { margin-bottom: 20px; }
.tpl-005 .main-title { font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; border-bottom: 2px solid #06b6d4; padding-bottom: 4px; margin: 0 0 12px 0; }
.tpl-005 .summary-p { font-size: 12.5px; color: #334155; line-height: 1.6; }
.tpl-005 .items-group { display: flex; flex-direction: column; gap: 12px; }
.tpl-005 .main-item { background: #f8fafc; border-left: 3px solid #0f172a; padding: 8px 12px; border-radius: 0 6px 6px 0; }
.tpl-005 .item-head { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-005 .title-bold { font-weight: 700; color: #0f172a; }
.tpl-005 .date-badge { font-size: 11px; background: #e2e8f0; color: #475569; padding: 2px 6px; border-radius: 4px; }
.tpl-005 .sub-role { font-size: 11.5px; color: #06b6d4; font-weight: 600; margin-top: 2px; }
.tpl-005 .desc-text { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-005 .proj-links a { color: #0f172a; text-decoration: none; font-weight: 600; font-size: 11px; margin-right: 10px; }`
  },

  "Template-006": {
    name: "The Corporate Trainee",
    is_premium: true,
    html: `<div class="resume tpl-006">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-strip">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Career Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="metro-item">
                <div class="m-head">
                    <span class="m-title">{{project_name}} ({{role}})</span>
                    <span class="m-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="m-tech">Tech Stack: {{technologies_used}}</div>
                <p class="m-desc">{{project_description}}</p>
                <div class="m-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">GitHub</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="metro-item">
                <div class="m-head">
                    <span class="m-title">{{degree}} in {{field_of_study}}</span>
                    <span class="m-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="m-tech">{{institution}}, {{university}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="m-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Skills</h3>
        <div class="metro-skills">
            <!-- {{#skills}} -->
            <span class="m-skill-tag">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.resume.tpl-006 { font-family: 'Inter', sans-serif; color: #18181b; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-006 .resume-header { border-bottom: 2px solid #18181b; padding-bottom: 14px; margin-bottom: 18px; }
.tpl-006 .resume-name { font-size: 30px; font-weight: 800; color: #18181b; margin: 0; }
.tpl-006 .resume-title { font-size: 15px; font-weight: 600; color: #f43f5e; text-transform: uppercase; letter-spacing: 0.06em; margin: 4px 0 10px 0; }
.tpl-006 .contact-strip { display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; color: #64748b; }
.tpl-006 .contact-strip i { color: #f43f5e; }
.tpl-006 .contact-strip a { color: inherit; text-decoration: none; }
.tpl-006 .section-title { font-size: 14px; font-weight: 700; color: #18181b; text-transform: uppercase; border-left: 4px solid #f43f5e; padding-left: 8px; margin: 0 0 12px 0; }
.tpl-006 .summary-text { font-size: 12.5px; color: #334155; line-height: 1.6; margin-bottom: 16px; }
.tpl-006 .metro-item { margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
.tpl-006 .m-head { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-006 .m-title { font-weight: 700; color: #0f172a; }
.tpl-006 .m-date { font-size: 11.5px; color: #64748b; }
.tpl-006 .m-tech { font-size: 12px; color: #f43f5e; font-weight: 600; margin: 2px 0; }
.tpl-006 .m-desc { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-006 .m-links a { font-size: 11.5px; color: #18181b; font-weight: 600; margin-right: 12px; }
.tpl-006 .m-gpa { display: inline-block; background: #ffe4e6; color: #9f1239; font-weight: 700; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-top: 2px; }
.tpl-006 .metro-skills { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-006 .m-skill-tag { background: #f8fafc; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: #18181b; }`
  },

  "Template-007": {
    name: "The NextGen Coder",
    is_premium: true,
    html: `<div class="resume tpl-007">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="hero-badge"><i class="fa-solid fa-code"></i> Tech Enthusiast & Developer</div>
        <div class="contact-row">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Developer Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Key Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="hack-card">
                <div class="hc-head">
                    <span class="hc-title"><i class="fa-solid fa-folder"></i> {{project_name}}</span>
                    <span class="hc-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="hc-stack">Role: {{role}} | Tech: {{technologies_used}}</div>
                <p class="hc-desc">{{project_description}}</p>
                <div class="hc-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Repository</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Tech Stack</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="cyber-skill">
                <span class="cs-name">{{skill_name}}</span>
                <span class="cs-lvl">{{skill_level}}</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="hack-card">
            <div class="hc-head">
                <span class="hc-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="hc-date">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="hc-stack">{{institution}} <!-- {{#if cgpa_percentage}} -->| Result: {{cgpa_percentage}}<!-- {{/if}} --></div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.resume.tpl-007 { font-family: 'Inter', sans-serif; color: #1e1e2e; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-007 .resume-header { text-align: center; margin-bottom: 16px; }
.tpl-007 .resume-name { font-size: 30px; font-weight: 800; color: #6d28d9; margin: 0; }
.tpl-007 .resume-title { font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.06em; margin: 2px 0 8px 0; }
.tpl-007 .hero-badge { display: inline-block; background: #f3e8ff; color: #6d28d9; font-weight: 700; font-size: 11.5px; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px; border: 1px solid #ddd6fe; }
.tpl-007 .contact-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #4b5563; }
.tpl-007 .contact-row i { color: #6d28d9; }
.tpl-007 .contact-row a { color: inherit; text-decoration: none; }
.tpl-007 .section-title { font-size: 14px; font-weight: 700; color: #6d28d9; text-transform: uppercase; border-bottom: 2px solid #a78bfa; padding-bottom: 4px; margin: 0 0 10px 0; }
.tpl-007 .summary-text { font-size: 12.5px; color: #374151; line-height: 1.6; margin-bottom: 14px; }
.tpl-007 .hack-card { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; }
.tpl-007 .hc-head { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-007 .hc-title { font-weight: 700; color: #5b21b6; }
.tpl-007 .hc-date { font-size: 11.5px; color: #6b7280; }
.tpl-007 .hc-stack { font-size: 11.5px; color: #059669; font-weight: 600; margin: 2px 0; }
.tpl-007 .hc-desc { font-size: 12px; color: #374151; margin: 4px 0; }
.tpl-007 .hc-links a { font-size: 11px; color: #6d28d9; font-weight: 700; text-decoration: none; margin-right: 10px; }
.tpl-007 .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-007 .cyber-skill { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 4px; font-size: 11.5px; display: flex; gap: 6px; }
.tpl-007 .cs-name { font-weight: 700; color: #047857; }
.tpl-007 .cs-lvl { color: #059669; }`
  },

  "Template-008": {
    name: "The Portfolio Graduate",
    is_premium: true,
    html: `<div class="resume tpl-008">
    <header class="resume-header">
        <div class="h-left">
            <h1 class="resume-name">{{full_name}}</h1>
            <h2 class="resume-title">{{designation}}</h2>
        </div>
        <div class="h-right">
            <!-- {{#if email}} --><div>{{email}}</div><!-- {{/if}} -->
            <!-- {{#if mobile}} --><div>{{mobile}}</div><!-- {{/if}} -->
            <!-- {{#if location}} --><div>{{location}}</div><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><div><a href="{{linkedin_url}}" target="_blank">LinkedIn</a></div><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Creative Bio</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Projects</h3>
        <div class="projects-grid">
            <!-- {{#projects}} -->
            <div class="project-box">
                <div class="pb-head">
                    <span class="pb-title">{{project_name}}</span>
                    <span class="pb-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="pb-role">Role: {{role}} | Tech: {{technologies_used}}</div>
                <p class="pb-desc">{{project_description}}</p>
                <div class="pb-links">
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">View Project &rarr;</a><!-- {{/if}} -->
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Source &rarr;</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="edu-row">
            <div class="er-left">
                <div class="er-deg"><strong>{{degree}}</strong> in {{field_of_study}}</div>
                <div class="er-inst">{{institution}}</div>
            </div>
            <div class="er-right">
                <div>{{start_year}} - {{end_year}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="er-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Technical Stack</h3>
        <div class="creative-skills">
            <!-- {{#skills}} -->
            <span class="c-skill">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');

.resume.tpl-008 { font-family: 'Space Grotesk', sans-serif; color: #431407; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-008 .resume-header { display: flex; justify-content: space-between; align-items: flex-end; background: #ffedd5; padding: 18px; border-radius: 10px; margin-bottom: 18px; }
.tpl-008 .resume-name { font-size: 28px; font-weight: 700; color: #9a3412; margin: 0; }
.tpl-008 .resume-title { font-size: 14px; color: #ea580c; text-transform: uppercase; margin: 4px 0 0 0; }
.tpl-008 .h-right { font-size: 11.5px; text-align: right; color: #7c2d12; }
.tpl-008 .h-right a { color: #9a3412; font-weight: 600; }
.tpl-008 .section-title { font-size: 15px; font-weight: 700; color: #9a3412; text-transform: uppercase; border-bottom: 2px solid #fdba74; padding-bottom: 4px; margin: 0 0 12px 0; }
.tpl-008 .summary-text { font-family: 'Inter', sans-serif; font-size: 12.5px; color: #431407; line-height: 1.6; margin-bottom: 16px; }
.tpl-008 .projects-grid { display: flex; flex-direction: column; gap: 10px; }
.tpl-008 .project-box { background: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 10px 12px; }
.tpl-008 .pb-head { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-008 .pb-title { font-weight: 700; color: #9a3412; }
.tpl-008 .pb-date { font-size: 11.5px; color: #9a3412; }
.tpl-008 .pb-role { font-size: 11.5px; color: #ea580c; font-weight: 600; margin: 2px 0; }
.tpl-008 .pb-desc { font-family: 'Inter', sans-serif; font-size: 12px; color: #431407; margin: 4px 0; }
.tpl-008 .pb-links a { font-size: 11.5px; color: #9a3412; font-weight: 700; text-decoration: none; margin-right: 12px; }
.tpl-008 .edu-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
.tpl-008 .er-deg { color: #9a3412; }
.tpl-008 .er-inst { color: #7c2d12; font-size: 11.5px; }
.tpl-008 .er-right { text-align: right; font-size: 11px; color: #9a3412; }
.tpl-008 .er-gpa { font-weight: 700; color: #ea580c; }
.tpl-008 .creative-skills { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-008 .c-skill { background: #ffedd5; color: #9a3412; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }`
  },

  "Template-009": {
    name: "The Data Science Initiate",
    is_premium: true,
    html: `<div class="resume tpl-009">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-row">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
        </div>
    </header>

    <div class="metrics-banner">
        <div class="metric-item"><span class="m-label">Field</span><span class="m-val">Data Science / Analytics</span></div>
        <div class="metric-item"><span class="m-label">Stack</span><span class="m-val">Python | SQL | ML</span></div>
        <div class="metric-item"><span class="m-label">Level</span><span class="m-val">Fresh Graduate</span></div>
    </div>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Summary</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Data Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="data-project">
                <div class="dp-head">
                    <span class="dp-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="dp-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="dp-stack">Tools: {{technologies_used}}</div>
                <p class="dp-desc">{{project_description}}</p>
                <div class="dp-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Repository</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Dashboard</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Skill Matrix</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="data-skill">
                <span class="ds-name">{{skill_name}}</span>
                <span class="ds-lvl">{{skill_level}}</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="data-project">
            <div class="dp-head">
                <span class="dp-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="dp-date">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="dp-stack">{{institution}} <!-- {{#if cgpa_percentage}} -->| Result: {{cgpa_percentage}}<!-- {{/if}} --></div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.resume.tpl-009 { font-family: 'Inter', sans-serif; color: #1e293b; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-009 .resume-header { text-align: center; margin-bottom: 14px; }
.tpl-009 .resume-name { font-size: 30px; font-weight: 800; color: #1e3a8a; margin: 0; }
.tpl-009 .resume-title { font-size: 14px; font-weight: 600; color: #d97706; text-transform: uppercase; margin: 4px 0 10px 0; }
.tpl-009 .contact-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; font-size: 12px; color: #475569; }
.tpl-009 .contact-row i { color: #1e3a8a; }
.tpl-009 .contact-row a { color: inherit; text-decoration: none; }
.tpl-009 .metrics-banner { display: flex; justify-content: space-around; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 12px; margin-bottom: 16px; }
.tpl-009 .metric-item { text-align: center; }
.tpl-009 .m-label { display: block; font-size: 10px; text-transform: uppercase; color: #1e3a8a; font-weight: 700; }
.tpl-009 .m-val { font-size: 12px; font-weight: 700; color: #d97706; }
.tpl-009 .section-title { font-size: 14px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; border-bottom: 2px solid #bfdbfe; padding-bottom: 4px; margin: 0 0 10px 0; }
.tpl-009 .summary-text { font-size: 12.5px; color: #334155; line-height: 1.6; margin-bottom: 14px; }
.tpl-009 .data-project { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; }
.tpl-009 .dp-head { display: flex; justify-content: space-between; font-size: 13px; }
.tpl-009 .dp-title { color: #1e3a8a; }
.tpl-009 .dp-date { font-size: 11.5px; color: #64748b; }
.tpl-009 .dp-stack { font-size: 11.5px; color: #d97706; font-weight: 600; margin: 2px 0; }
.tpl-009 .dp-desc { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-009 .dp-links a { font-size: 11px; color: #1e3a8a; font-weight: 600; margin-right: 10px; }
.tpl-009 .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-009 .data-skill { background: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 8px; border-radius: 4px; font-size: 11.5px; display: flex; gap: 6px; }
.tpl-009 .ds-name { font-weight: 700; color: #1e3a8a; }
.tpl-009 .ds-lvl { color: #d97706; }`
  },

  "Template-010": {
    name: "The Management Apprentice",
    is_premium: true,
    html: `<div class="resume tpl-010">
    <div class="gold-frame">
        <header class="resume-header">
            <h1 class="resume-name">{{full_name}}</h1>
            <h2 class="resume-title">{{designation}}</h2>
            <div class="contact-row">
                <!-- {{#if email}} --><span>{{email}}</span><!-- {{/if}} -->
                <!-- {{#if mobile}} --><span>| {{mobile}}</span><!-- {{/if}} -->
                <!-- {{#if location}} --><span>| {{location}}</span><!-- {{/if}} -->
                <!-- {{#if linkedin_url}} --><span>| <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            </div>
        </header>

        <!-- {{#if professional_summary}} -->
        <section class="resume-section">
            <h3 class="section-title">Executive Profile</h3>
            <p class="summary-text">{{professional_summary}}</p>
        </section>
        <!-- {{/if}} -->

        <!-- {{#if education}} -->
        <section class="resume-section">
            <h3 class="section-title">Education</h3>
            <!-- {{#education}} -->
            <div class="exec-item">
                <div class="ex-head">
                    <span class="ex-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="ex-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="ex-sub">{{institution}}, {{university}} <!-- {{#if cgpa_percentage}} -->| GPA: {{cgpa_percentage}}<!-- {{/if}} --></div>
            </div>
            <!-- {{/education}} -->
        </section>
        <!-- {{/if}} -->

        <!-- {{#if projects}} -->
        <section class="resume-section">
            <h3 class="section-title">Business & Management Projects</h3>
            <!-- {{#projects}} -->
            <div class="exec-item">
                <div class="ex-head">
                    <span class="ex-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="ex-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="ex-sub">Focus: {{technologies_used}}</div>
                <p class="ex-desc">{{project_description}}</p>
            </div>
            <!-- {{/projects}} -->
        </section>
        <!-- {{/if}} -->

        <!-- {{#if skills}} -->
        <section class="resume-section">
            <h3 class="section-title">Skills & Competencies</h3>
            <div class="skills-row">
                <!-- {{#skills}} -->
                <span class="gold-chip">{{skill_name}} <small>({{skill_level}})</small></span>
                <!-- {{/skills}} -->
            </div>
        </section>
        <!-- {{/if}} -->
    </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600&display=swap');

.resume.tpl-010 { font-family: 'Inter', sans-serif; color: #09090b; background: #ffffff; padding: 14mm 12mm; box-sizing: border-box; }
.tpl-010 .gold-frame { border: 2px solid #ca8a04; padding: 16px; border-radius: 4px; }
.tpl-010 .resume-header { text-align: center; margin-bottom: 18px; }
.tpl-010 .resume-name { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: #09090b; margin: 0; }
.tpl-010 .resume-title { font-size: 14px; font-weight: 600; color: #ca8a04; text-transform: uppercase; letter-spacing: 0.08em; margin: 4px 0 10px 0; }
.tpl-010 .contact-row { font-size: 12px; color: #52525b; }
.tpl-010 .contact-row a { color: inherit; text-decoration: none; }
.tpl-010 .section-title { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 700; color: #09090b; border-bottom: 1px solid #ca8a04; padding-bottom: 2px; margin: 0 0 10px 0; }
.tpl-010 .summary-text { font-size: 12.5px; color: #27272a; line-height: 1.6; margin-bottom: 14px; }
.tpl-010 .exec-item { margin-bottom: 10px; }
.tpl-010 .ex-head { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-010 .ex-title { color: #09090b; }
.tpl-010 .ex-date { font-size: 11.5px; color: #71717a; }
.tpl-010 .ex-sub { font-size: 12px; color: #ca8a04; font-weight: 600; }
.tpl-010 .ex-desc { font-size: 12px; color: #27272a; margin: 3px 0; }
.tpl-010 .skills-row { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-010 .gold-chip { background: #fef08a; border: 1px solid #ca8a04; padding: 3px 8px; border-radius: 4px; font-size: 11.5px; color: #09090b; }`
  },

  "Template-011": {
    name: "The Hackathon Sprint",
    is_premium: true,
    html: `<div class="resume tpl-011">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="hero-badge"><i class="fa-solid fa-trophy"></i> Hackathon Competitor</div>
        <div class="contact-row">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Developer Pitch</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Hackathon Projects</h3>
        <!-- {{#projects}} -->
        <div class="hack-card">
            <div class="hc-head">
                <span class="hc-title"><i class="fa-solid fa-code-fork"></i> {{project_name}}</span>
                <span class="hc-date">{{start_date}} - {{end_date}}</span>
            </div>
            <div class="hc-stack">Role: {{role}} | Stack: {{technologies_used}}</div>
            <p class="hc-desc">{{project_description}}</p>
            <div class="hc-links">
                <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Repo</a><!-- {{/if}} -->
                <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Demo</a><!-- {{/if}} -->
            </div>
        </div>
        <!-- {{/projects}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="cyber-skill">
                <span class="cs-name">{{skill_name}}</span>
                <span class="cs-lvl">{{skill_level}}</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="hack-card">
            <div class="hc-head">
                <span class="hc-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="hc-date">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="hc-stack">{{institution}} <!-- {{#if cgpa_percentage}} -->| GPA: {{cgpa_percentage}}<!-- {{/if}} --></div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.resume.tpl-011 { font-family: 'Inter', sans-serif; color: #1e1e2e; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-011 .resume-header { text-align: center; margin-bottom: 16px; }
.tpl-011 .resume-name { font-size: 30px; font-weight: 800; color: #312e81; margin: 0; }
.tpl-011 .resume-title { font-size: 14px; font-weight: 600; color: #06b6d4; text-transform: uppercase; margin: 2px 0 8px 0; }
.tpl-011 .hero-badge { display: inline-block; background: #e0e7ff; color: #3730a3; font-weight: 700; font-size: 11.5px; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px; }
.tpl-011 .contact-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #4b5563; }
.tpl-011 .contact-row i { color: #312e81; }
.tpl-011 .contact-row a { color: inherit; text-decoration: none; }
.tpl-011 .section-title { font-size: 14px; font-weight: 700; color: #312e81; text-transform: uppercase; border-bottom: 2px solid #818cf8; padding-bottom: 4px; margin: 0 0 10px 0; }
.tpl-011 .summary-text { font-size: 12.5px; color: #374151; line-height: 1.6; margin-bottom: 14px; }
.tpl-011 .hack-card { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; }
.tpl-011 .hc-head { display: flex; justify-content: space-between; font-size: 13.5px; }
.tpl-011 .hc-title { font-weight: 700; color: #312e81; }
.tpl-011 .hc-date { font-size: 11.5px; color: #6b7280; }
.tpl-011 .hc-stack { font-size: 11.5px; color: #0891b2; font-weight: 600; margin: 2px 0; }
.tpl-011 .hc-desc { font-size: 12px; color: #374151; margin: 4px 0; }
.tpl-011 .hc-links a { font-size: 11px; color: #312e81; font-weight: 700; text-decoration: none; margin-right: 10px; }
.tpl-011 .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-011 .cyber-skill { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 4px; font-size: 11.5px; display: flex; gap: 6px; }
.tpl-011 .cs-name { font-weight: 700; color: #047857; }
.tpl-011 .cs-lvl { color: #0891b2; }`
  },

  "Template-012": {
    name: "The Bio-Lab Graduate",
    is_premium: true,
    html: `<div class="resume tpl-012">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-bar">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Research Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic Qualifications</h3>
        <!-- {{#education}} -->
        <div class="bio-item">
            <div class="bi-head">
                <span class="bi-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="bi-date">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="bi-sub">{{institution}}, {{university}}</div>
            <!-- {{#if cgpa_percentage}} --><div class="bi-gpa">GPA: {{cgpa_percentage}}</div><!-- {{/if}} -->
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Research Projects</h3>
        <!-- {{#projects}} -->
        <div class="bio-item">
            <div class="bi-head">
                <span class="bi-title"><strong>{{project_name}}</strong> ({{role}})</span>
                <span class="bi-date">{{start_date}} - {{end_date}}</span>
            </div>
            <div class="bi-sub">Techniques: {{technologies_used}}</div>
            <p class="bi-desc">{{project_description}}</p>
        </div>
        <!-- {{/projects}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Lab Skills</h3>
        <div class="bio-skills">
            <!-- {{#skills}} -->
            <span class="bio-tag">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.resume.tpl-012 { font-family: 'Inter', sans-serif; color: #134e4a; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-012 .resume-header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 16px; }
.tpl-012 .resume-name { font-size: 30px; font-weight: 800; color: #0f766e; margin: 0; }
.tpl-012 .resume-title { font-size: 14px; font-weight: 600; color: #0d9488; text-transform: uppercase; margin: 2px 0 8px 0; }
.tpl-012 .contact-bar { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #475569; }
.tpl-012 .contact-bar i { color: #0f766e; }
.tpl-012 .contact-bar a { color: inherit; text-decoration: none; }
.tpl-012 .section-title { font-size: 14px; font-weight: 700; color: #0f766e; text-transform: uppercase; border-bottom: 1.5px solid #99f6e4; padding-bottom: 4px; margin: 0 0 10px 0; }
.tpl-012 .summary-text { font-size: 12.5px; color: #334155; line-height: 1.6; margin-bottom: 14px; }
.tpl-012 .bio-item { margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #f0fdf4; }
.tpl-012 .bi-head { display: flex; justify-content: space-between; font-size: 13px; }
.tpl-012 .bi-title { color: #134e4a; }
.tpl-012 .bi-date { font-size: 11.5px; color: #64748b; }
.tpl-012 .bi-sub { font-size: 11.5px; color: #0f766e; font-weight: 600; margin: 2px 0; }
.tpl-012 .bi-desc { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-012 .bi-gpa { display: inline-block; background: #ccfbf1; color: #0f766e; font-weight: 700; font-size: 10.5px; padding: 2px 6px; border-radius: 4px; margin-top: 2px; }
.tpl-012 .bio-skills { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-012 .bio-tag { background: #f0fdf4; border: 1px solid #99f6e4; padding: 3px 8px; border-radius: 4px; font-size: 11.5px; color: #134e4a; }`
  },

  "Template-013": {
    name: "The Futuristic Titan",
    is_premium: true,
    html: `<div class="resume tpl-013">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-pills">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Summary</h3>
        <p class="summary-box">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Projects</h3>
        <!-- {{#projects}} -->
        <div class="titan-card">
            <div class="tc-head">
                <span class="tc-title"><strong>{{project_name}}</strong> ({{role}})</span>
                <span class="tc-date">{{start_date}} - {{end_date}}</span>
            </div>
            <div class="tc-sub">Tech: {{technologies_used}}</div>
            <p class="tc-desc">{{project_description}}</p>
            <div class="tc-links">
                <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">GitHub</a><!-- {{/if}} -->
                <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live Demo</a><!-- {{/if}} -->
            </div>
        </div>
        <!-- {{/projects}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="titan-card">
            <div class="tc-head">
                <span class="tc-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="tc-date">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="tc-sub">{{institution}} <!-- {{#if cgpa_percentage}} -->| GPA: {{cgpa_percentage}}<!-- {{/if}} --></div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <span class="titan-pill">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.resume.tpl-013 { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-013 .resume-header { background: linear-gradient(135deg, #0284c7, #6366f1); color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 18px; }
.tpl-013 .resume-name { font-size: 30px; font-weight: 800; color: #ffffff; margin: 0; }
.tpl-013 .resume-title { font-size: 14px; font-weight: 600; color: #bae6fd; text-transform: uppercase; margin: 4px 0 12px 0; }
.tpl-013 .contact-pills { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; font-size: 12px; }
.tpl-013 .contact-pills span { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; color: #ffffff; }
.tpl-013 .contact-pills a { color: #ffffff; text-decoration: underline; }
.tpl-013 .section-title { font-size: 14px; font-weight: 700; color: #0284c7; text-transform: uppercase; border-bottom: 2px solid #e0f2fe; padding-bottom: 4px; margin: 0 0 10px 0; }
.tpl-013 .summary-box { font-size: 12.5px; color: #334155; line-height: 1.6; background: #f0f9ff; padding: 10px 14px; border-left: 4px solid #0284c7; border-radius: 0 6px 6px 0; margin-bottom: 16px; }
.tpl-013 .titan-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; }
.tpl-013 .tc-head { display: flex; justify-content: space-between; font-size: 13px; }
.tpl-013 .tc-title { color: #0f172a; }
.tpl-013 .tc-date { font-size: 11.5px; color: #64748b; }
.tpl-013 .tc-sub { font-size: 11.5px; color: #6366f1; font-weight: 600; margin: 2px 0; }
.tpl-013 .tc-desc { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-013 .tc-links a { font-size: 11px; color: #0284c7; font-weight: 600; margin-right: 10px; text-decoration: none; }
.tpl-013 .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.tpl-013 .titan-pill { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }`
  },

  "Template-014": {
    name: "The Minimalist Graduate",
    is_premium: true,
    html: `<div class="resume tpl-014">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-line">
            <!-- {{#if email}} --><span>{{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span>• {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span>• {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span>• <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span>• <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Summary</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Key Projects</h3>
        <!-- {{#projects}} -->
        <div class="mini-item">
            <div class="i-head">
                <span class="i-title"><strong>{{project_name}}</strong> ({{role}})</span>
                <span class="i-date">{{start_date}} - {{end_date}}</span>
            </div>
            <div class="i-sub">Tech: {{technologies_used}}</div>
            <p class="i-desc">{{project_description}}</p>
            <div class="i-links">
                <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Code</a><!-- {{/if}} -->
                <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Demo</a><!-- {{/if}} -->
            </div>
        </div>
        <!-- {{/projects}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="mini-item">
            <div class="i-head">
                <span class="i-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="i-date">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="i-sub">{{institution}} <!-- {{#if cgpa_percentage}} -->| Result: {{cgpa_percentage}}<!-- {{/if}} --></div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-line">
            <!-- {{#skills}} -->
            <span class="sk-item">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.resume.tpl-014 { font-family: 'Plus Jakarta Sans', sans-serif; color: #18181b; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-014 .resume-header { margin-bottom: 16px; }
.tpl-014 .resume-name { font-size: 28px; font-weight: 800; color: #18181b; margin: 0; }
.tpl-014 .resume-title { font-size: 14px; font-weight: 600; color: #15803d; text-transform: uppercase; margin: 2px 0 6px 0; }
.tpl-014 .contact-line { font-size: 12px; color: #52525b; }
.tpl-014 .contact-line a { color: inherit; text-decoration: none; }
.tpl-014 .section-title { font-size: 13.5px; font-weight: 700; color: #18181b; text-transform: uppercase; border-bottom: 1px solid #15803d; padding-bottom: 2px; margin: 0 0 10px 0; }
.tpl-014 .summary-text { font-size: 12.5px; color: #3f3f46; line-height: 1.5; margin-bottom: 14px; }
.tpl-014 .mini-item { margin-bottom: 10px; }
.tpl-014 .i-head { display: flex; justify-content: space-between; font-size: 13px; }
.tpl-014 .i-title { color: #18181b; }
.tpl-014 .i-date { font-size: 11.5px; color: #71717a; }
.tpl-014 .i-sub { font-size: 11.5px; color: #15803d; font-weight: 600; }
.tpl-014 .i-desc { font-size: 12px; color: #3f3f46; margin: 2px 0; }
.tpl-014 .i-links a { font-size: 11px; color: #15803d; margin-right: 8px; }
.tpl-014 .skills-line { display: flex; flex-wrap: wrap; gap: 8px; }
.tpl-014 .sk-item { background: #f4f4f5; padding: 3px 8px; border-radius: 4px; font-size: 11.5px; color: #18181b; }`
  },

  "Template-015": {
    name: "The Campus Leader",
    is_premium: true,
    html: `<div class="resume tpl-015">
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="contact-box">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Objective Statement</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="edu-card">
            <div class="e-header">
                <span class="e-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                <span class="e-date">{{start_year}} - {{end_year}}</span>
            </div>
            <div class="e-inst">{{institution}}, {{university}}</div>
            <!-- {{#if cgpa_percentage}} --><div class="e-score">CGPA: {{cgpa_percentage}}</div><!-- {{/if}} -->
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic & Leadership Projects</h3>
        <!-- {{#projects}} -->
        <div class="proj-card">
            <div class="p-header">
                <span class="p-title"><strong>{{project_name}}</strong> ({{role}})</span>
                <span class="p-date">{{start_date}} - {{end_date}}</span>
            </div>
            <div class="p-tech">Technologies: {{technologies_used}}</div>
            <p class="p-desc">{{project_description}}</p>
        </div>
        <!-- {{/projects}} -->
    </section>
    <!-- {{/if}} -->

    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="skill-chip">
                <span class="sk-title">{{skill_name}}</span>
                <span class="sk-badge">{{skill_level}}</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

.resume.tpl-015 { font-family: 'Montserrat', sans-serif; color: #1e293b; background: #ffffff; padding: 16mm 14mm; box-sizing: border-box; }
.tpl-015 .resume-header { background: linear-gradient(135deg, #ffe4e6, #fff1f2); border: 1px solid #fecdd3; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 18px; }
.tpl-015 .resume-name { font-size: 28px; font-weight: 800; color: #9f1239; margin: 0; }
.tpl-015 .resume-title { font-size: 14px; font-weight: 600; color: #e11d48; text-transform: uppercase; margin: 4px 0 12px 0; }
.tpl-015 .contact-box { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #475569; }
.tpl-015 .contact-box i { color: #be123c; }
.tpl-015 .contact-box a { color: inherit; text-decoration: none; }
.tpl-015 .section-title { font-size: 14px; font-weight: 700; color: #9f1239; text-transform: uppercase; border-bottom: 2px solid #fecdd3; padding-bottom: 4px; margin: 0 0 12px 0; }
.tpl-015 .summary-text { font-size: 12.5px; color: #334155; line-height: 1.6; margin-bottom: 16px; }
.tpl-015 .edu-card, .tpl-015 .proj-card { background: #fff1f2; border: 1px solid #ffe4e6; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; }
.tpl-015 .e-header, .tpl-015 .p-header { display: flex; justify-content: space-between; font-size: 13.5px; color: #1e293b; }
.tpl-015 .e-date, .tpl-015 .p-date { font-size: 11.5px; color: #64748b; }
.tpl-015 .e-inst, .tpl-015 .p-tech { font-size: 12px; color: #be123c; font-weight: 600; margin: 2px 0; }
.tpl-015 .p-desc { font-size: 12px; color: #334155; margin: 4px 0; }
.tpl-015 .e-score { display: inline-block; background: #fecdd3; color: #881337; font-weight: 700; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-top: 2px; }
.tpl-015 .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.tpl-015 .skill-chip { background: #ffffff; border: 1px solid #fecdd3; padding: 4px 10px; border-radius: 20px; font-size: 12px; display: flex; align-items: center; gap: 6px; }
.tpl-015 .sk-title { font-weight: 600; color: #1e293b; }
.tpl-015 .sk-badge { background: #ffe4e6; color: #9f1239; font-size: 10.5px; padding: 1px 5px; border-radius: 10px; }`
  }
,
  "Template-016": {
    name: "The Fresher Launchpad",
    is_premium: true,
    html: `<div class="resume tpl-016">
    <!-- Top Accent Bar -->
    <div class="top-accent"></div>

    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-pill-box">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Professional Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title"><i class="fa-solid fa-rocket"></i> Career Objective & Summary</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <div class="two-col-grid">
        <!-- Main Column -->
        <div class="col-main">
            <!-- Projects -->
            <!-- {{#if projects}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-code"></i> Key Academic Projects</h3>
                <div class="items-list">
                    <!-- {{#projects}} -->
                    <div class="resume-item project-card">
                        <div class="item-header">
                            <span class="item-title"><strong>{{project_name}}</strong></span>
                            <span class="item-date">{{start_date}} - {{end_date}}</span>
                        </div>
                        <div class="role-badge"><i class="fa-solid fa-user-gear"></i> Role: {{role}}</div>
                        <div class="tech-stack-row">Tech: {{technologies_used}}</div>
                        <p class="item-details">{{project_description}}</p>
                        <div class="links-row">
                            <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank"><i class="fa-brands fa-github"></i> Source Code</a><!-- {{/if}} -->
                            <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank"><i class="fa-solid fa-globe"></i> Live Demo</a><!-- {{/if}} -->
                        </div>
                    </div>
                    <!-- {{/projects}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- Experience / Internships -->
            <!-- {{#if experience}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-briefcase"></i> Internships & Experience</h3>
                <div class="items-list">
                    <!-- {{#experience}} -->
                    <div class="resume-item">
                        <div class="item-header">
                            <span class="item-title"><strong>{{job_title}}</strong></span>
                            <span class="item-date">{{start_date}} - {{end_date_or_present}}</span>
                        </div>
                        <div class="item-sub"><strong>{{company_name}}</strong> | {{employment_type}} | {{location}}</div>
                        <p class="item-details">{{job_description}}</p>
                    </div>
                    <!-- {{/experience}} -->
                </div>
            </section>
            <!-- {{/if}} -->
        </div>

        <!-- Sidebar Column -->
        <div class="col-side">
            <!-- Education -->
            <!-- {{#if education}} -->
            <section class="resume-section side-card">
                <h3 class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</h3>
                <div class="items-list">
                    <!-- {{#education}} -->
                    <div class="edu-card">
                        <div class="edu-degree">{{degree}}</div>
                        <div class="edu-field">{{field_of_study}}</div>
                        <div class="edu-inst">{{institution}}</div>
                        <div class="edu-meta">{{start_year}} - {{end_year}}</div>
                        <!-- {{#if cgpa_percentage}} --><div class="gpa-badge">GPA/Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
                    </div>
                    <!-- {{/education}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- Technical Skills -->
            <!-- {{#if skills}} -->
            <section class="resume-section side-card">
                <h3 class="section-title"><i class="fa-solid fa-gears"></i> Technical Skills</h3>
                <div class="skills-flex">
                    <!-- {{#skills}} -->
                    <div class="skill-pill">
                        <span class="s-name">{{skill_name}}</span>
                        <span class="s-level">{{skill_level}}</span>
                    </div>
                    <!-- {{/skills}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- Certifications -->
            <!-- {{#if certifications}} -->
            <section class="resume-section side-card">
                <h3 class="section-title"><i class="fa-solid fa-award"></i> Certifications</h3>
                <div class="items-list">
                    <!-- {{#certifications}} -->
                    <div class="cert-item">
                        <div class="cert-title">{{certification_name}}</div>
                        <div class="cert-issuer">{{issuing_organization}} ({{issue_date}})</div>
                    </div>
                    <!-- {{/certifications}} -->
                </div>
            </section>
            <!-- {{/if}} -->
        </div>
    </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.resume.tpl-016 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1e293b;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
    position: relative;
}

.tpl-016 .top-accent {
    height: 6px;
    background: linear-gradient(90deg, #1e1b4b, #06b6d4, #3b82f6);
    border-radius: 4px;
    margin-bottom: 16px;
}

.tpl-016 .resume-header {
    text-align: center;
    margin-bottom: 20px;
}

.tpl-016 .resume-name {
    font-size: 30px;
    font-weight: 800;
    color: #1e1b4b;
    letter-spacing: -0.02em;
    margin: 0;
}

.tpl-016 .resume-title {
    font-size: 15px;
    font-weight: 600;
    color: #06b6d4;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 4px 0 12px 0;
}

.tpl-016 .contact-pill-box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12px;
}

.tpl-016 .contact-pill-box span {
    background: #f1f5f9;
    color: #334155;
    padding: 4px 10px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e2e8f0;
}

.tpl-016 .contact-pill-box i {
    color: #06b6d4;
}

.tpl-016 .contact-pill-box a {
    color: inherit;
    text-decoration: none;
}

.tpl-016 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1e1b4b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tpl-016 .section-title i {
    color: #06b6d4;
}

.tpl-016 .summary-text {
    font-size: 12.5px;
    line-height: 1.6;
    color: #475569;
    background: #f8fafc;
    padding: 10px 14px;
    border-left: 4px solid #06b6d4;
    border-radius: 0 6px 6px 0;
    margin-bottom: 16px;
}

.tpl-016 .two-col-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 18px;
}

.tpl-016 .project-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.tpl-016 .item-header {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
    color: #0f172a;
}

.tpl-016 .item-date {
    font-size: 11.5px;
    color: #64748b;
}

.tpl-016 .role-badge {
    font-size: 11.5px;
    color: #0284c7;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-016 .tech-stack-row {
    font-size: 11.5px;
    color: #475569;
    font-weight: 500;
}

.tpl-016 .item-details {
    font-size: 12px;
    color: #334155;
    line-height: 1.5;
    margin: 6px 0 4px 0;
}

.tpl-016 .links-row {
    display: flex;
    gap: 10px;
    font-size: 11.5px;
}

.tpl-016 .links-row a {
    color: #06b6d4;
    text-decoration: none;
    font-weight: 600;
}

.tpl-016 .side-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 14px;
}

.tpl-016 .edu-card {
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #cbd5e1;
}

.tpl-016 .edu-card:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.tpl-016 .edu-degree {
    font-size: 13px;
    font-weight: 700;
    color: #1e1b4b;
}

.tpl-016 .edu-field {
    font-size: 12px;
    color: #06b6d4;
    font-weight: 600;
}

.tpl-016 .edu-inst {
    font-size: 11.5px;
    color: #475569;
}

.tpl-016 .edu-meta {
    font-size: 11px;
    color: #64748b;
}

.tpl-016 .gpa-badge {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 4px;
}

.tpl-016 .skills-flex {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.tpl-016 .skill-pill {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    padding: 5px 8px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    font-size: 12px;
}

.tpl-016 .s-name {
    font-weight: 600;
    color: #1e293b;
}

.tpl-016 .s-level {
    color: #06b6d4;
    font-size: 11px;
}

.tpl-016 .cert-item {
    margin-bottom: 6px;
    font-size: 12px;
}

.tpl-016 .cert-title {
    font-weight: 700;
    color: #1e1b4b;
}

.tpl-016 .cert-issuer {
    font-size: 11px;
    color: #64748b;
}`
  },

  "Template-017": {
    name: "The Graduate Vanguard",
    is_premium: true,
    html: `<div class="resume tpl-017">
    <!-- Left Sidebar -->
    <aside class="sidebar">
        <div class="profile-header">
            <h1 class="resume-name">{{full_name}}</h1>
            <h2 class="resume-title">{{designation}}</h2>
        </div>

        <!-- Contact -->
        <div class="sidebar-section">
            <h3 class="side-title">Contact</h3>
            <div class="contact-list">
                <!-- {{#if email}} --><div class="c-item"><i class="fa-solid fa-envelope"></i> {{email}}</div><!-- {{/if}} -->
                <!-- {{#if mobile}} --><div class="c-item"><i class="fa-solid fa-phone"></i> {{mobile}}</div><!-- {{/if}} -->
                <!-- {{#if location}} --><div class="c-item"><i class="fa-solid fa-location-dot"></i> {{location}}</div><!-- {{/if}} -->
                <!-- {{#if linkedin_url}} --><div class="c-item"><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></div><!-- {{/if}} -->
                <!-- {{#if github_url}} --><div class="c-item"><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></div><!-- {{/if}} -->
            </div>
        </div>

        <!-- Education -->
        <!-- {{#if education}} -->
        <div class="sidebar-section">
            <h3 class="side-title">Education</h3>
            <!-- {{#education}} -->
            <div class="side-edu">
                <div class="s-degree"><strong>{{degree}}</strong></div>
                <div class="s-field">{{field_of_study}}</div>
                <div class="s-inst">{{institution}}</div>
                <div class="s-year">{{start_year}} - {{end_year}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="s-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
            <!-- {{/education}} -->
        </div>
        <!-- {{/if}} -->

        <!-- Skills -->
        <!-- {{#if skills}} -->
        <div class="sidebar-section">
            <h3 class="side-title">Core Skills</h3>
            <div class="side-skills">
                <!-- {{#skills}} -->
                <div class="side-skill-tag">
                    <span>{{skill_name}}</span>
                    <small>{{skill_level}}</small>
                </div>
                <!-- {{/skills}} -->
            </div>
        </div>
        <!-- {{/if}} -->

        <!-- Certifications -->
        <!-- {{#if certifications}} -->
        <div class="sidebar-section">
            <h3 class="side-title">Certifications</h3>
            <!-- {{#certifications}} -->
            <div class="side-cert">
                <div class="sc-name">{{certification_name}}</div>
                <div class="sc-org">{{issuing_organization}}</div>
            </div>
            <!-- {{/certifications}} -->
        </div>
        <!-- {{/if}} -->
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Summary -->
        <!-- {{#if professional_summary}} -->
        <section class="main-section">
            <h3 class="main-title">Professional Summary</h3>
            <p class="summary-p">{{professional_summary}}</p>
        </section>
        <!-- {{/if}} -->

        <!-- Projects -->
        <!-- {{#if projects}} -->
        <section class="main-section">
            <h3 class="main-title">Academic & Capstone Projects</h3>
            <div class="items-group">
                <!-- {{#projects}} -->
                <div class="main-item">
                    <div class="item-head">
                        <span class="title-bold">{{project_name}}</span>
                        <span class="date-badge">{{start_date}} - {{end_date}}</span>
                    </div>
                    <div class="sub-role">Role: {{role}} | Tech: {{technologies_used}}</div>
                    <p class="desc-text">{{project_description}}</p>
                    <div class="proj-links">
                        <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a><!-- {{/if}} -->
                        <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a><!-- {{/if}} -->
                    </div>
                </div>
                <!-- {{/projects}} -->
            </div>
        </section>
        <!-- {{/if}} -->

        <!-- Experience -->
        <!-- {{#if experience}} -->
        <section class="main-section">
            <h3 class="main-title">Internships & Work History</h3>
            <div class="items-group">
                <!-- {{#experience}} -->
                <div class="main-item">
                    <div class="item-head">
                        <span class="title-bold">{{job_title}}</span>
                        <span class="date-badge">{{start_date}} - {{end_date_or_present}}</span>
                    </div>
                    <div class="sub-role">{{company_name}} ({{employment_type}}) | {{location}}</div>
                    <p class="desc-text">{{job_description}}</p>
                </div>
                <!-- {{/experience}} -->
            </div>
        </section>
        <!-- {{/if}} -->
    </main>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.resume.tpl-017 {
    font-family: 'Inter', sans-serif;
    display: flex;
    background: #ffffff;
    color: #1e293b;
    min-height: 100%;
}

.tpl-017 .sidebar {
    width: 32%;
    background: #0f172a;
    color: #f8fafc;
    padding: 18mm 12mm;
    box-sizing: border-box;
}

.tpl-017 .profile-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #334155;
    padding-bottom: 14px;
}

.tpl-017 .resume-name {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    line-height: 1.2;
}

.tpl-017 .resume-title {
    font-size: 13px;
    font-weight: 600;
    color: #10b981;
    text-transform: uppercase;
    margin-top: 6px;
    letter-spacing: 0.05em;
}

.tpl-017 .sidebar-section {
    margin-bottom: 18px;
}

.tpl-017 .side-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #10b981;
    border-bottom: 1px solid #334155;
    padding-bottom: 4px;
    margin: 0 0 10px 0;
}

.tpl-017 .contact-list {
    font-size: 11.5px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #cbd5e1;
}

.tpl-017 .c-item i {
    color: #10b981;
    width: 14px;
}

.tpl-017 .c-item a {
    color: inherit;
    text-decoration: none;
}

.tpl-017 .side-edu {
    margin-bottom: 10px;
    font-size: 11.5px;
}

.tpl-017 .s-degree {
    color: #ffffff;
    font-size: 12px;
}

.tpl-017 .s-field {
    color: #10b981;
}

.tpl-017 .s-inst, .tpl-017 .s-year {
    color: #94a3b8;
    font-size: 11px;
}

.tpl-017 .s-gpa {
    display: inline-block;
    background: #064e3b;
    color: #6ee7b7;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 10.5px;
    margin-top: 2px;
}

.tpl-017 .side-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-017 .side-skill-tag {
    background: #1e293b;
    border: 1px solid #334155;
    padding: 3px 7px;
    border-radius: 4px;
    font-size: 11px;
    color: #e2e8f0;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.tpl-017 .side-skill-tag small {
    color: #10b981;
}

.tpl-017 .side-cert {
    font-size: 11px;
    margin-bottom: 6px;
}

.tpl-017 .sc-name {
    color: #ffffff;
    font-weight: 600;
}

.tpl-017 .sc-org {
    color: #94a3b8;
}

.tpl-017 .main-content {
    width: 68%;
    padding: 18mm 14mm;
    box-sizing: border-box;
}

.tpl-017 .main-section {
    margin-bottom: 20px;
}

.tpl-017 .main-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #10b981;
    padding-bottom: 4px;
    margin: 0 0 12px 0;
}

.tpl-017 .summary-p {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.6;
}

.tpl-017 .items-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tpl-017 .main-item {
    background: #f8fafc;
    border-left: 3px solid #0f172a;
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
}

.tpl-017 .item-head {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
}

.tpl-017 .title-bold {
    font-weight: 700;
    color: #0f172a;
}

.tpl-017 .date-badge {
    font-size: 11px;
    background: #e2e8f0;
    color: #475569;
    padding: 2px 6px;
    border-radius: 4px;
}

.tpl-017 .sub-role {
    font-size: 11.5px;
    color: #10b981;
    font-weight: 600;
    margin-top: 2px;
}

.tpl-017 .desc-text {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
    line-height: 1.5;
}

.tpl-017 .proj-links {
    display: flex;
    gap: 10px;
    font-size: 11px;
}

.tpl-017 .proj-links a {
    color: #0f172a;
    text-decoration: none;
    font-weight: 600;
}`
  },

  "Template-018": {
    name: "The Silicon Campus",
    is_premium: true,
    html: `<div class="resume tpl-018">
    <!-- Header -->
    <header class="resume-header">
        <div class="terminal-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="term-title">fresher_resume.sh</span>
        </div>
        <div class="header-inner">
            <h1 class="resume-name">&lt;{{full_name}} /&gt;</h1>
            <h2 class="resume-title">$ {{designation}} --fresher</h2>
            
            <div class="contact-code">
                <!-- {{#if email}} --><span>email: "{{email}}"</span><!-- {{/if}} -->
                <!-- {{#if mobile}} --><span>phone: "{{mobile}}"</span><!-- {{/if}} -->
                <!-- {{#if location}} --><span>loc: "{{location}}"</span><!-- {{/if}} -->
                <!-- {{#if github_url}} --><span>github: "<a href="{{github_url}}" target="_blank">{{github_url}}</a>"</span><!-- {{/if}} -->
                <!-- {{#if linkedin_url}} --><span>linkedin: "<a href="{{linkedin_url}}" target="_blank">{{linkedin_url}}</a>"</span><!-- {{/if}} -->
            </div>
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">/* About Developer */</h3>
        <p class="summary-box">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Featured Repos & Projects */</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="repo-card">
                <div class="repo-header">
                    <span class="repo-name"><i class="fa-solid fa-folder-open"></i> {{project_name}}</span>
                    <span class="repo-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="repo-role">Role: {{role}} | Tech: <span class="tech-highlight">{{technologies_used}}</span></div>
                <p class="repo-desc">{{project_description}}</p>
                <div class="repo-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">[GitHub]</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">[Live Demo]</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Tech Stack & Skills */</h3>
        <div class="code-skills-grid">
            <!-- {{#skills}} -->
            <div class="code-skill-tag">
                <span class="k-key">{{skill_name}}</span>: <span class="k-val">"{{skill_level}}"</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Education & Qualifications */</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="edu-line">
                <div class="edu-main"><strong>{{degree}}</strong> in {{field_of_study}} -- {{institution}}</div>
                <div class="edu-sub">Year: {{start_year}}-{{end_year}} <!-- {{#if cgpa_percentage}} -->| GPA: {{cgpa_percentage}}<!-- {{/if}} --></div>
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">/* Certifications */</h3>
        <div class="cert-grid">
            <!-- {{#certifications}} -->
            <div class="cert-card">
                <span class="cert-n">{{certification_name}}</span>
                <span class="cert-i">by {{issuing_organization}} ({{issue_date}})</span>
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

.resume.tpl-018 {
    font-family: 'JetBrains Mono', monospace;
    background: #ffffff;
    color: #1e293b;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-018 .terminal-bar {
    background: #0f172a;
    padding: 6px 12px;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    gap: 6px;
}

.tpl-018 .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.tpl-018 .dot.red { background: #ef4444; }
.tpl-018 .dot.yellow { background: #f59e0b; }
.tpl-018 .dot.green { background: #10b981; }

.tpl-018 .term-title {
    color: #94a3b8;
    font-size: 11px;
    margin-left: 8px;
}

.tpl-018 .header-inner {
    background: #1e293b;
    color: #f8fafc;
    padding: 16px;
    border-radius: 0 0 8px 8px;
    margin-bottom: 18px;
}

.tpl-018 .resume-name {
    font-size: 26px;
    color: #10b981;
    margin: 0;
}

.tpl-018 .resume-title {
    font-size: 14px;
    color: #38bdf8;
    margin: 4px 0 10px 0;
}

.tpl-018 .contact-code {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 11.5px;
    color: #cbd5e1;
}

.tpl-018 .contact-code a {
    color: #38bdf8;
    text-decoration: none;
}

.tpl-018 .section-title {
    font-size: 13.5px;
    color: #059669;
    margin: 0 0 10px 0;
    border-bottom: 1px dashed #cbd5e1;
    padding-bottom: 4px;
}

.tpl-018 .summary-box {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: #334155;
    background: #f8fafc;
    border-left: 3px solid #10b981;
    padding: 8px 12px;
    margin-bottom: 16px;
}

.tpl-018 .repo-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 10px;
}

.tpl-018 .repo-header {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #0f172a;
}

.tpl-018 .repo-name {
    font-weight: 700;
    color: #0369a1;
}

.tpl-018 .repo-date {
    font-size: 11px;
    color: #64748b;
}

.tpl-018 .repo-role {
    font-size: 11.5px;
    color: #475569;
    margin: 2px 0;
}

.tpl-018 .tech-highlight {
    color: #d97706;
    font-weight: 600;
}

.tpl-018 .repo-desc {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-018 .repo-links {
    font-size: 11px;
    display: flex;
    gap: 10px;
}

.tpl-018 .repo-links a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
}

.tpl-018 .code-skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.tpl-018 .code-skill-tag {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11.5px;
}

.tpl-018 .k-key {
    color: #0f172a;
    font-weight: 700;
}

.tpl-018 .k-val {
    color: #059669;
}

.tpl-018 .edu-line {
    margin-bottom: 8px;
    font-size: 12px;
}

.tpl-018 .edu-main {
    color: #0f172a;
}

.tpl-018 .edu-sub {
    color: #64748b;
    font-size: 11px;
}

.tpl-018 .cert-grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 11.5px;
}

.tpl-018 .cert-n {
    font-weight: 700;
    color: #0f172a;
}

.tpl-018 .cert-i {
    color: #64748b;
    margin-left: 6px;
}`
  },

  "Template-019": {
    name: "The Elite Scholar",
    is_premium: true,
    html: `<div class="resume tpl-019">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        <div class="gold-divider"></div>
        
        <div class="contact-row">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic & Professional Statement</h3>
        <p class="summary-quote">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education & Honors</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="edu-box">
                <div class="edu-header">
                    <span class="edu-deg"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="edu-dates">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="edu-univ"><strong>{{institution}}</strong>, {{university}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="honors-badge">Honors / Grade: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic Capstone & Research Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="project-entry">
                <div class="p-head">
                    <span class="p-title">{{project_name}}</span>
                    <span class="p-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="p-role">Role: {{role}} | Tech Stack: {{technologies_used}}</div>
                <p class="p-desc">{{project_description}}</p>
                <div class="p-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Repository</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Publication / Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Areas of Expertise & Skills</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="gold-skill">
                <span class="s-n">{{skill_name}}</span>
                <span class="s-l">({{skill_level}})</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications & Awards</h3>
        <div class="cert-list">
            <!-- {{#certifications}} -->
            <div class="cert-row">
                <span class="c-name"><strong>{{certification_name}}</strong></span> -- 
                <span class="c-org">{{issuing_organization}}</span>
                <span class="c-date">({{issue_date}})</span>
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

.resume.tpl-019 {
    font-family: 'Inter', sans-serif;
    color: #262626;
    background: #ffffff;
    padding: 18mm 16mm;
}

.tpl-019 h1, .tpl-019 h2, .tpl-019 .section-title {
    font-family: 'Playfair Display', serif;
}

.tpl-019 .resume-header {
    text-align: center;
    margin-bottom: 22px;
}

.tpl-019 .resume-name {
    font-size: 32px;
    font-weight: 700;
    color: #701a75;
    margin: 0;
}

.tpl-019 .resume-title {
    font-size: 15px;
    font-weight: 600;
    color: #d97706;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 4px 0 10px 0;
}

.tpl-019 .gold-divider {
    height: 2px;
    width: 80px;
    background: #d97706;
    margin: 0 auto 12px auto;
}

.tpl-019 .contact-row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 12px;
    color: #525252;
}

.tpl-019 .contact-row i {
    color: #701a75;
}

.tpl-019 .contact-row a {
    color: inherit;
    text-decoration: none;
}

.tpl-019 .section-title {
    font-size: 16px;
    color: #701a75;
    border-bottom: 1px solid #fef08a;
    padding-bottom: 4px;
    margin: 0 0 12px 0;
}

.tpl-019 .summary-quote {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 13.5px;
    color: #404040;
    background: #fffbe6;
    padding: 10px 16px;
    border-left: 3px solid #d97706;
    margin-bottom: 18px;
}

.tpl-019 .edu-box {
    margin-bottom: 10px;
    background: #fdf4ff;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #fae8ff;
}

.tpl-019 .edu-header {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
}

.tpl-019 .edu-deg {
    color: #701a75;
}

.tpl-019 .edu-dates {
    font-size: 11.5px;
    color: #737373;
}

.tpl-019 .edu-univ {
    font-size: 12px;
    color: #525252;
}

.tpl-019 .honors-badge {
    display: inline-block;
    background: #fef3c7;
    color: #92400e;
    font-weight: 700;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-top: 4px;
}

.tpl-019 .project-entry {
    margin-bottom: 12px;
}

.tpl-019 .p-head {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
}

.tpl-019 .p-title {
    font-weight: 700;
    color: #701a75;
}

.tpl-019 .p-date {
    font-size: 11.5px;
    color: #737373;
}

.tpl-019 .p-role {
    font-size: 12px;
    color: #d97706;
    font-weight: 600;
}

.tpl-019 .p-desc {
    font-size: 12.5px;
    color: #404040;
    margin: 4px 0;
}

.tpl-019 .p-links a {
    font-size: 11.5px;
    color: #701a75;
    text-decoration: underline;
    font-weight: 600;
}

.tpl-019 .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tpl-019 .gold-skill {
    border: 1px solid #d97706;
    background: #fffbe6;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
}

.tpl-019 .s-n {
    font-weight: 600;
    color: #701a75;
}

.tpl-019 .s-l {
    color: #b45309;
    font-size: 11px;
}

.tpl-019 .cert-row {
    font-size: 12px;
    margin-bottom: 6px;
}

.tpl-019 .c-name {
    color: #701a75;
}

.tpl-019 .c-org {
    color: #525252;
}`
  },

  "Template-020": {
    name: "The Neo-Grid Fresh",
    is_premium: true,
    html: `<div class="resume tpl-020">
    <!-- Header Box -->
    <header class="header-card">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-grid">
            <!-- {{#if email}} --><div><i class="fa-solid fa-envelope"></i> {{email}}</div><!-- {{/if}} -->
            <!-- {{#if mobile}} --><div><i class="fa-solid fa-phone"></i> {{mobile}}</div><!-- {{/if}} -->
            <!-- {{#if location}} --><div><i class="fa-solid fa-location-dot"></i> {{location}}</div><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><div><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></div><!-- {{/if}} -->
            <!-- {{#if github_url}} --><div><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></div><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <div class="grid-card">
        <h3 class="card-title">Career Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </div>
    <!-- {{/if}} -->

    <div class="cards-layout">
        <!-- Left Grid Column -->
        <div class="col">
            <!-- Projects -->
            <!-- {{#if projects}} -->
            <div class="grid-card">
                <h3 class="card-title">Projects & Portfolio</h3>
                <!-- {{#projects}} -->
                <div class="item-block">
                    <div class="b-head">
                        <span class="b-title">{{project_name}}</span>
                        <span class="b-date">{{start_date}} - {{end_date}}</span>
                    </div>
                    <div class="b-sub">Role: {{role}} | {{technologies_used}}</div>
                    <p class="b-desc">{{project_description}}</p>
                    <div class="b-links">
                        <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">GitHub</a><!-- {{/if}} -->
                        <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live App</a><!-- {{/if}} -->
                    </div>
                </div>
                <!-- {{/projects}} -->
            </div>
            <!-- {{/if}} -->

            <!-- Experience -->
            <!-- {{#if experience}} -->
            <div class="grid-card">
                <h3 class="card-title">Internship Experience</h3>
                <!-- {{#experience}} -->
                <div class="item-block">
                    <div class="b-head">
                        <span class="b-title">{{job_title}}</span>
                        <span class="b-date">{{start_date}} - {{end_date_or_present}}</span>
                    </div>
                    <div class="b-sub">{{company_name}} ({{employment_type}})</div>
                    <p class="b-desc">{{job_description}}</p>
                </div>
                <!-- {{/experience}} -->
            </div>
            <!-- {{/if}} -->
        </div>

        <!-- Right Grid Column -->
        <div class="col">
            <!-- Education -->
            <!-- {{#if education}} -->
            <div class="grid-card">
                <h3 class="card-title">Education</h3>
                <!-- {{#education}} -->
                <div class="edu-item">
                    <div class="e-deg"><strong>{{degree}}</strong></div>
                    <div class="e-field">{{field_of_study}}</div>
                    <div class="e-inst">{{institution}}</div>
                    <div class="e-meta">{{start_year}} - {{end_year}}</div>
                    <!-- {{#if cgpa_percentage}} --><div class="e-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
                </div>
                <!-- {{/education}} -->
            </div>
            <!-- {{/if}} -->

            <!-- Skills -->
            <!-- {{#if skills}} -->
            <div class="grid-card">
                <h3 class="card-title">Skill Matrix</h3>
                <div class="skills-box">
                    <!-- {{#skills}} -->
                    <span class="violet-badge">{{skill_name}} <small>({{skill_level}})</small></span>
                    <!-- {{/skills}} -->
                </div>
            </div>
            <!-- {{/if}} -->

            <!-- Certifications -->
            <!-- {{#if certifications}} -->
            <div class="grid-card">
                <h3 class="card-title">Certifications</h3>
                <!-- {{#certifications}} -->
                <div class="cert-block">
                    <div class="c-title">{{certification_name}}</div>
                    <div class="c-sub">{{issuing_organization}} ({{issue_date}})</div>
                </div>
                <!-- {{/certifications}} -->
            </div>
            <!-- {{/if}} -->
        </div>
    </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.resume.tpl-020 {
    font-family: 'Outfit', sans-serif;
    background: #f8fafc;
    color: #1e293b;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-020 .header-card {
    background: linear-gradient(135deg, #4c1d95, #6d28d9);
    color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 16px;
    box-shadow: 0 4px 12px rgba(76,29,149,0.15);
}

.tpl-020 .resume-name {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
}

.tpl-020 .resume-title {
    font-size: 14px;
    font-weight: 500;
    color: #ddd6fe;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 4px 0 14px 0;
}

.tpl-020 .contact-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: #f3e8ff;
}

.tpl-020 .contact-grid a {
    color: #ffffff;
    text-decoration: underline;
}

.tpl-020 .cards-layout {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 14px;
}

.tpl-020 .grid-card {
    background: #ffffff;
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 14px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    border: 1px solid #e2e8f0;
}

.tpl-020 .card-title {
    font-size: 14px;
    font-weight: 700;
    color: #4c1d95;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 10px 0;
    border-bottom: 2px solid #f3e8ff;
    padding-bottom: 4px;
}

.tpl-020 .summary-text {
    font-size: 12.5px;
    color: #475569;
    line-height: 1.6;
}

.tpl-020 .item-block {
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
}

.tpl-020 .item-block:last-child {
    border-bottom: none;
}

.tpl-020 .b-head {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.tpl-020 .b-title {
    font-weight: 700;
    color: #0f172a;
}

.tpl-020 .b-date {
    font-size: 11px;
    color: #64748b;
}

.tpl-020 .b-sub {
    font-size: 11.5px;
    color: #6d28d9;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-020 .b-desc {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-020 .b-links a {
    font-size: 11px;
    color: #4c1d95;
    font-weight: 600;
    margin-right: 10px;
    text-decoration: none;
}

.tpl-020 .edu-item {
    margin-bottom: 8px;
}

.tpl-020 .e-deg {
    font-size: 13px;
    color: #0f172a;
}

.tpl-020 .e-field {
    font-size: 12px;
    color: #6d28d9;
    font-weight: 600;
}

.tpl-020 .e-inst, .tpl-020 .e-meta {
    font-size: 11px;
    color: #64748b;
}

.tpl-020 .e-gpa {
    display: inline-block;
    background: #f3e8ff;
    color: #5b21b6;
    font-weight: 700;
    font-size: 10.5px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 2px;
}

.tpl-020 .skills-box {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-020 .violet-badge {
    background: #f3e8ff;
    color: #5b21b6;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 600;
}

.tpl-020 .violet-badge small {
    color: #7c3aed;
    font-weight: 400;
}

.tpl-020 .cert-block {
    margin-bottom: 6px;
    font-size: 11.5px;
}

.tpl-020 .c-title {
    font-weight: 700;
    color: #0f172a;
}

.tpl-020 .c-sub {
    color: #64748b;
}`
  },

  "Template-021": {
    name: "The STEM Innovator",
    is_premium: true,
    html: `<div class="resume tpl-021">
    <!-- Header Banner -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-bar">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title"><i class="fa-solid fa-atom"></i> STEM Profile & Career Focus</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <div class="content-split">
        <!-- Main Column -->
        <div class="col-left">
            <!-- Projects -->
            <!-- {{#if projects}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-microchip"></i> Engineering & Tech Projects</h3>
                <div class="items-list">
                    <!-- {{#projects}} -->
                    <div class="stem-project">
                        <div class="p-header">
                            <span class="p-name">{{project_name}}</span>
                            <span class="p-time">{{start_date}} - {{end_date}}</span>
                        </div>
                        <div class="p-stack"><i class="fa-solid fa-layer-group"></i> Stack: {{technologies_used}}</div>
                        <p class="p-details">{{project_description}}</p>
                        <div class="p-links">
                            <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank"><i class="fa-brands fa-github"></i> Source</a><!-- {{/if}} -->
                            <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank"><i class="fa-solid fa-play"></i> Demo</a><!-- {{/if}} -->
                        </div>
                    </div>
                    <!-- {{/projects}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- Experience -->
            <!-- {{#if experience}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-vial"></i> Lab & Industry Internships</h3>
                <div class="items-list">
                    <!-- {{#experience}} -->
                    <div class="stem-project">
                        <div class="p-header">
                            <span class="p-name">{{job_title}}</span>
                            <span class="p-time">{{start_date}} - {{end_date_or_present}}</span>
                        </div>
                        <div class="p-stack">{{company_name}} | {{location}}</div>
                        <p class="p-details">{{job_description}}</p>
                    </div>
                    <!-- {{/experience}} -->
                </div>
            </section>
            <!-- {{/if}} -->
        </div>

        <!-- Right Column -->
        <div class="col-right">
            <!-- Education -->
            <!-- {{#if education}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-graduation-cap"></i> Degree</h3>
                <!-- {{#education}} -->
                <div class="stem-edu">
                    <div class="se-deg">{{degree}}</div>
                    <div class="se-field">{{field_of_study}}</div>
                    <div class="se-inst">{{institution}}</div>
                    <div class="se-year">{{start_year}} - {{end_year}}</div>
                    <!-- {{#if cgpa_percentage}} --><div class="se-gpa">CGPA: {{cgpa_percentage}}</div><!-- {{/if}} -->
                </div>
                <!-- {{/education}} -->
            </section>
            <!-- {{/if}} -->

            <!-- Skills -->
            <!-- {{#if skills}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-code-branch"></i> Skills</h3>
                <div class="stem-skills">
                    <!-- {{#skills}} -->
                    <div class="stem-skill-item">
                        <span class="sk-name">{{skill_name}}</span>
                        <span class="sk-lvl">{{skill_level}}</span>
                    </div>
                    <!-- {{/skills}} -->
                </div>
            </section>
            <!-- {{/if}} -->

            <!-- Certifications -->
            <!-- {{#if certifications}} -->
            <section class="resume-section">
                <h3 class="section-title"><i class="fa-solid fa-certificate"></i> Certifications</h3>
                <!-- {{#certifications}} -->
                <div class="stem-cert">
                    <div class="sc-t">{{certification_name}}</div>
                    <div class="sc-i">{{issuing_organization}}</div>
                </div>
                <!-- {{/certifications}} -->
            </section>
            <!-- {{/if}} -->
        </div>
    </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.resume.tpl-021 {
    font-family: 'Inter', sans-serif;
    color: #0f172a;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-021 .resume-header {
    background: #0c4a6e;
    color: #ffffff;
    padding: 18px 20px;
    border-radius: 8px;
    margin-bottom: 18px;
}

.tpl-021 .resume-name {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    color: #ffffff;
}

.tpl-021 .resume-title {
    font-size: 14px;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 4px 0 12px 0;
}

.tpl-021 .contact-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 11.5px;
    color: #e0f2fe;
}

.tpl-021 .contact-bar i {
    color: #38bdf8;
}

.tpl-021 .contact-bar a {
    color: #ffffff;
    text-decoration: underline;
}

.tpl-021 .section-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #0c4a6e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #0d9488;
    padding-bottom: 4px;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    gap: 6px;
}

.tpl-021 .section-title i {
    color: #0d9488;
}

.tpl-021 .summary-text {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.6;
    background: #f0fdf4;
    padding: 8px 12px;
    border-left: 3px solid #0d9488;
    border-radius: 0 4px 4px 0;
    margin-bottom: 16px;
}

.tpl-021 .content-split {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 16px;
}

.tpl-021 .stem-project {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 10px;
}

.tpl-021 .p-header {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.tpl-021 .p-name {
    font-weight: 700;
    color: #0c4a6e;
}

.tpl-021 .p-time {
    font-size: 11px;
    color: #64748b;
}

.tpl-021 .p-stack {
    font-size: 11.5px;
    color: #0d9488;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-021 .p-details {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-021 .p-links a {
    font-size: 11px;
    color: #0c4a6e;
    font-weight: 600;
    margin-right: 10px;
    text-decoration: none;
}

.tpl-021 .stem-edu {
    margin-bottom: 10px;
    font-size: 12px;
}

.tpl-021 .se-deg {
    font-weight: 700;
    color: #0c4a6e;
}

.tpl-021 .se-field {
    color: #0d9488;
    font-weight: 600;
}

.tpl-021 .se-inst, .tpl-021 .se-year {
    color: #64748b;
    font-size: 11px;
}

.tpl-021 .se-gpa {
    display: inline-block;
    background: #ccfbf1;
    color: #0f766e;
    font-weight: 700;
    font-size: 10.5px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 2px;
}

.tpl-021 .stem-skills {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.tpl-021 .stem-skill-item {
    display: flex;
    justify-content: space-between;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11.5px;
}

.tpl-021 .sk-name {
    font-weight: 600;
    color: #0f172a;
}

.tpl-021 .sk-lvl {
    color: #0d9488;
}

.tpl-021 .stem-cert {
    margin-bottom: 6px;
    font-size: 11.5px;
}

.tpl-021 .sc-t {
    font-weight: 700;
    color: #0c4a6e;
}

.tpl-021 .sc-i {
    color: #64748b;
}`
  },

  "Template-022": {
    name: "The Metro Graduate",
    is_premium: true,
    html: `<div class="resume tpl-022">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-strip">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Objective Statement</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic Projects & Work</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="metro-item">
                <div class="m-head">
                    <span class="m-title">{{project_name}} ({{role}})</span>
                    <span class="m-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="m-tech">Tech Stack: {{technologies_used}}</div>
                <p class="m-desc">{{project_description}}</p>
                <div class="m-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">GitHub Repo</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="metro-item">
                <div class="m-head">
                    <span class="m-title">{{degree}} in {{field_of_study}}</span>
                    <span class="m-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="m-tech">{{institution}}, {{university}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="m-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Skills & Competencies</h3>
        <div class="metro-skills">
            <!-- {{#skills}} -->
            <span class="m-skill-tag">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications & Training</h3>
        <div class="items-list">
            <!-- {{#certifications}} -->
            <div class="metro-item">
                <div class="m-head">
                    <span class="m-title">{{certification_name}}</span>
                    <span class="m-date">{{issue_date}}</span>
                </div>
                <div class="m-tech">Issued by: {{issuing_organization}}</div>
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.resume.tpl-022 {
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-022 .resume-header {
    border-bottom: 2px solid #1e293b;
    padding-bottom: 14px;
    margin-bottom: 18px;
}

.tpl-022 .resume-name {
    font-size: 30px;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
}

.tpl-022 .resume-title {
    font-size: 15px;
    font-weight: 600;
    color: #f43f5e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 4px 0 10px 0;
}

.tpl-022 .contact-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 12px;
    color: #64748b;
}

.tpl-022 .contact-strip i {
    color: #f43f5e;
}

.tpl-022 .contact-strip a {
    color: inherit;
    text-decoration: none;
}

.tpl-022 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-left: 4px solid #f43f5e;
    padding-left: 8px;
    margin: 0 0 12px 0;
}

.tpl-022 .summary-text {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.6;
    margin-bottom: 16px;
}

.tpl-022 .metro-item {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
}

.tpl-022 .m-head {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
}

.tpl-022 .m-title {
    font-weight: 700;
    color: #0f172a;
}

.tpl-022 .m-date {
    font-size: 11.5px;
    color: #64748b;
}

.tpl-022 .m-tech {
    font-size: 12px;
    color: #f43f5e;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-022 .m-desc {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-022 .m-links a {
    font-size: 11.5px;
    color: #1e293b;
    font-weight: 600;
    margin-right: 12px;
}

.tpl-022 .m-gpa {
    display: inline-block;
    background: #ffe4e6;
    color: #9f1239;
    font-weight: 700;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 2px;
}

.tpl-022 .metro-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-022 .m-skill-tag {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #1e293b;
}

.tpl-022 .m-skill-tag small {
    color: #64748b;
}`
  },

  "Template-023": {
    name: "The Campus Prodigy",
    is_premium: true,
    html: `<div class="resume tpl-023">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-box">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Career Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education & Academic Record</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="edu-card">
                <div class="e-header">
                    <span class="e-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="e-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="e-inst">{{institution}}, {{university}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="e-score">Cumulative Score: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Projects & Practical Work</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="proj-card">
                <div class="p-header">
                    <span class="p-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="p-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="p-tech">Technologies: {{technologies_used}}</div>
                <p class="p-desc">{{project_description}}</p>
                <div class="p-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Source Code</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Core Skills</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="skill-chip">
                <span class="sk-title">{{skill_name}}</span>
                <span class="sk-badge">{{skill_level}}</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications & Achievements</h3>
        <div class="items-list">
            <!-- {{#certifications}} -->
            <div class="cert-card">
                <span class="c-title"><strong>{{certification_name}}</strong></span> - 
                <span class="c-issuer">{{issuing_organization}} ({{issue_date}})</span>
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

.resume.tpl-023 {
    font-family: 'Montserrat', sans-serif;
    color: #1e293b;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-023 .resume-header {
    background: linear-gradient(135deg, #ffe4e6, #fff1f2);
    border: 1px solid #fecdd3;
    border-radius: 10px;
    padding: 18px;
    text-align: center;
    margin-bottom: 18px;
}

.tpl-023 .resume-name {
    font-size: 28px;
    font-weight: 800;
    color: #9f1239;
    margin: 0;
}

.tpl-023 .resume-title {
    font-size: 14px;
    font-weight: 600;
    color: #e11d48;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 4px 0 12px 0;
}

.tpl-023 .contact-box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: #475569;
}

.tpl-023 .contact-box i {
    color: #be123c;
}

.tpl-023 .contact-box a {
    color: inherit;
    text-decoration: none;
}

.tpl-023 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #9f1239;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #fecdd3;
    padding-bottom: 4px;
    margin: 0 0 12px 0;
}

.tpl-023 .summary-text {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.6;
    margin-bottom: 16px;
}

.tpl-023 .edu-card, .tpl-023 .proj-card {
    background: #fff1f2;
    border: 1px solid #ffe4e6;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 10px;
}

.tpl-023 .e-header, .tpl-023 .p-header {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
    color: #1e293b;
}

.tpl-023 .e-date, .tpl-023 .p-date {
    font-size: 11.5px;
    color: #64748b;
}

.tpl-023 .e-inst, .tpl-023 .p-tech {
    font-size: 12px;
    color: #be123c;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-023 .p-desc {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-023 .e-score {
    display: inline-block;
    background: #fecdd3;
    color: #881337;
    font-weight: 700;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 2px;
}

.tpl-023 .p-links a {
    font-size: 11.5px;
    color: #9f1239;
    font-weight: 600;
    margin-right: 10px;
}

.tpl-023 .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tpl-023 .skill-chip {
    background: #ffffff;
    border: 1px solid #fecdd3;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.tpl-023 .sk-title {
    font-weight: 600;
    color: #1e293b;
}

.tpl-023 .sk-badge {
    background: #ffe4e6;
    color: #9f1239;
    font-size: 10.5px;
    padding: 1px 5px;
    border-radius: 10px;
}

.tpl-023 .cert-card {
    font-size: 12px;
    margin-bottom: 6px;
}`
  },

  "Template-024": {
    name: "The Minimalist Entry",
    is_premium: true,
    html: `<div class="resume tpl-024">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-line">
            <!-- {{#if email}} --><span>{{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span>• {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span>• {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span>• <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span>• <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Summary</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Key Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="mini-item">
                <div class="i-head">
                    <span class="i-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="i-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="i-sub">Tech: {{technologies_used}}</div>
                <p class="i-desc">{{project_description}}</p>
                <div class="i-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Code</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="mini-item">
                <div class="i-head">
                    <span class="i-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="i-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="i-sub">{{institution}}, {{university}} <!-- {{#if cgpa_percentage}} -->| Result: {{cgpa_percentage}}<!-- {{/if}} --></div>
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Technical Skills</h3>
        <div class="skills-line">
            <!-- {{#skills}} -->
            <span class="sk-item">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications</h3>
        <div class="items-list">
            <!-- {{#certifications}} -->
            <div class="mini-item">
                <span class="i-title"><strong>{{certification_name}}</strong></span> - {{issuing_organization}} ({{issue_date}})
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.resume.tpl-024 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #18181b;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-024 .resume-header {
    margin-bottom: 16px;
}

.tpl-024 .resume-name {
    font-size: 28px;
    font-weight: 800;
    color: #18181b;
    margin: 0;
}

.tpl-024 .resume-title {
    font-size: 14px;
    font-weight: 600;
    color: #15803d;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 2px 0 6px 0;
}

.tpl-024 .contact-line {
    font-size: 12px;
    color: #52525b;
}

.tpl-024 .contact-line a {
    color: inherit;
    text-decoration: none;
}

.tpl-024 .section-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #18181b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #15803d;
    padding-bottom: 2px;
    margin: 0 0 10px 0;
}

.tpl-024 .summary-text {
    font-size: 12.5px;
    color: #3f3f46;
    line-height: 1.5;
    margin-bottom: 14px;
}

.tpl-024 .mini-item {
    margin-bottom: 10px;
}

.tpl-024 .i-head {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.tpl-024 .i-title {
    color: #18181b;
}

.tpl-024 .i-date {
    font-size: 11.5px;
    color: #71717a;
}

.tpl-024 .i-sub {
    font-size: 11.5px;
    color: #15803d;
    font-weight: 600;
}

.tpl-024 .i-desc {
    font-size: 12px;
    color: #3f3f46;
    margin: 2px 0;
}

.tpl-024 .i-links a {
    font-size: 11px;
    color: #15803d;
    margin-right: 8px;
}

.tpl-024 .skills-line {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tpl-024 .sk-item {
    background: #f4f4f5;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    color: #18181b;
}

.tpl-024 .sk-item small {
    color: #71717a;
}`
  },

  "Template-025": {
    name: "The Creative Studio Fresher",
    is_premium: true,
    html: `<div class="resume tpl-025">
    <!-- Header -->
    <header class="resume-header">
        <div class="h-left">
            <h1 class="resume-name">{{full_name}}</h1>
            <h2 class="resume-title">{{designation}}</h2>
        </div>
        <div class="h-right">
            <!-- {{#if email}} --><div>{{email}}</div><!-- {{/if}} -->
            <!-- {{#if mobile}} --><div>{{mobile}}</div><!-- {{/if}} -->
            <!-- {{#if location}} --><div>{{location}}</div><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><div><a href="{{linkedin_url}}" target="_blank">LinkedIn</a></div><!-- {{/if}} -->
            <!-- {{#if github_url}} --><div><a href="{{github_url}}" target="_blank">Portfolio / GitHub</a></div><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Creative Bio</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Design & Creative Projects</h3>
        <div class="projects-grid">
            <!-- {{#projects}} -->
            <div class="project-box">
                <div class="pb-head">
                    <span class="pb-title">{{project_name}}</span>
                    <span class="pb-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="pb-role">Role: {{role}} | Tech: {{technologies_used}}</div>
                <p class="pb-desc">{{project_description}}</p>
                <div class="pb-links">
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">View Project &rarr;</a><!-- {{/if}} -->
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Source &rarr;</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <!-- {{#education}} -->
        <div class="edu-row">
            <div class="er-left">
                <div class="er-deg"><strong>{{degree}}</strong> in {{field_of_study}}</div>
                <div class="er-inst">{{institution}}</div>
            </div>
            <div class="er-right">
                <div>{{start_year}} - {{end_year}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="er-gpa">Result: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
        </div>
        <!-- {{/education}} -->
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Design & Technical Stack</h3>
        <div class="creative-skills">
            <!-- {{#skills}} -->
            <span class="c-skill">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications & Honors</h3>
        <!-- {{#certifications}} -->
        <div class="cert-line">
            <strong>{{certification_name}}</strong> - {{issuing_organization}} ({{issue_date}})
        </div>
        <!-- {{/certifications}} -->
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');

.resume.tpl-025 {
    font-family: 'Space Grotesk', sans-serif;
    color: #431407;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-025 .resume-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: #ffedd5;
    padding: 18px;
    border-radius: 10px;
    margin-bottom: 18px;
}

.tpl-025 .resume-name {
    font-size: 28px;
    font-weight: 700;
    color: #9a3412;
    margin: 0;
}

.tpl-025 .resume-title {
    font-size: 14px;
    color: #c2410c;
    text-transform: uppercase;
    margin: 4px 0 0 0;
}

.tpl-025 .h-right {
    font-size: 11.5px;
    text-align: right;
    color: #7c2d12;
}

.tpl-025 .h-right a {
    color: #9a3412;
    font-weight: 600;
}

.tpl-025 .section-title {
    font-size: 15px;
    font-weight: 700;
    color: #9a3412;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #fdba74;
    padding-bottom: 4px;
    margin: 0 0 12px 0;
}

.tpl-025 .summary-text {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: #431407;
    line-height: 1.6;
    margin-bottom: 16px;
}

.tpl-025 .projects-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tpl-025 .project-box {
    background: #fff7ed;
    border: 1px solid #ffedd5;
    border-radius: 8px;
    padding: 10px 12px;
}

.tpl-025 .pb-head {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
}

.tpl-025 .pb-title {
    font-weight: 700;
    color: #9a3412;
}

.tpl-025 .pb-date {
    font-size: 11.5px;
    color: #9a3412;
}

.tpl-025 .pb-role {
    font-size: 11.5px;
    color: #ea580c;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-025 .pb-desc {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #431407;
    margin: 4px 0;
}

.tpl-025 .pb-links a {
    font-size: 11.5px;
    color: #9a3412;
    font-weight: 700;
    text-decoration: none;
    margin-right: 12px;
}

.tpl-025 .edu-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
}

.tpl-025 .er-deg {
    color: #9a3412;
}

.tpl-025 .er-inst {
    color: #7c2d12;
    font-size: 11.5px;
}

.tpl-025 .er-right {
    text-align: right;
    font-size: 11px;
    color: #9a3412;
}

.tpl-025 .er-gpa {
    font-weight: 700;
    color: #c2410c;
}

.tpl-025 .creative-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-025 .c-skill {
    background: #ffedd5;
    color: #9a3412;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
}

.tpl-025 .cert-line {
    font-size: 12px;
    margin-bottom: 4px;
}`
  },

  "Template-026": {
    name: "The Data Analyst Graduate",
    is_premium: true,
    html: `<div class="resume tpl-026">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-row">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Metrics Callout Banner -->
    <div class="metrics-banner">
        <div class="metric-item">
            <span class="m-label">Target Role</span>
            <span class="m-val">Data Analyst / BI</span>
        </div>
        <div class="metric-item">
            <span class="m-label">Core Tech</span>
            <span class="m-val">SQL | Python | PowerBI</span>
        </div>
        <div class="metric-item">
            <span class="m-label">Status</span>
            <span class="m-val">Fresh Graduate</span>
        </div>
    </div>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Analytical Profile</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Data & Analytics Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="data-project">
                <div class="dp-head">
                    <span class="dp-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="dp-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="dp-stack">Tools & Libraries: {{technologies_used}}</div>
                <p class="dp-desc">{{project_description}}</p>
                <div class="dp-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Notebook / Code</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Interactive Dashboard</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills Matrix -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Technical Skill Matrix</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="data-skill">
                <span class="ds-name">{{skill_name}}</span>
                <span class="ds-lvl">{{skill_level}}</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="edu-item">
                <div class="dp-head">
                    <span class="dp-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="dp-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="dp-stack">{{institution}}, {{university}} <!-- {{#if cgpa_percentage}} -->| Result: {{cgpa_percentage}}<!-- {{/if}} --></div>
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications</h3>
        <div class="items-list">
            <!-- {{#certifications}} -->
            <div class="cert-item">
                <strong>{{certification_name}}</strong> - {{issuing_organization}} ({{issue_date}})
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.resume.tpl-026 {
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-026 .resume-header {
    text-align: center;
    margin-bottom: 14px;
}

.tpl-026 .resume-name {
    font-size: 30px;
    font-weight: 800;
    color: #1e3a8a;
    margin: 0;
}

.tpl-026 .resume-title {
    font-size: 14px;
    font-weight: 600;
    color: #d97706;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 4px 0 10px 0;
}

.tpl-026 .contact-row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 12px;
    color: #475569;
}

.tpl-026 .contact-row i {
    color: #1e3a8a;
}

.tpl-026 .contact-row a {
    color: inherit;
    text-decoration: none;
}

.tpl-026 .metrics-banner {
    display: flex;
    justify-content: space-around;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 8px 12px;
    margin-bottom: 16px;
}

.tpl-026 .metric-item {
    text-align: center;
}

.tpl-026 .m-label {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    color: #1e3a8a;
    font-weight: 700;
}

.tpl-026 .m-val {
    font-size: 12px;
    font-weight: 700;
    color: #d97706;
}

.tpl-026 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #bfdbfe;
    padding-bottom: 4px;
    margin: 0 0 10px 0;
}

.tpl-026 .summary-text {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.6;
    margin-bottom: 14px;
}

.tpl-026 .data-project {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 10px;
}

.tpl-026 .dp-head {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.tpl-026 .dp-title {
    color: #1e3a8a;
}

.tpl-026 .dp-date {
    font-size: 11.5px;
    color: #64748b;
}

.tpl-026 .dp-stack {
    font-size: 11.5px;
    color: #d97706;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-026 .dp-desc {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-026 .dp-links a {
    font-size: 11px;
    color: #1e3a8a;
    font-weight: 600;
    margin-right: 10px;
}

.tpl-026 .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-026 .data-skill {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    display: flex;
    gap: 6px;
}

.tpl-026 .ds-name {
    font-weight: 700;
    color: #1e3a8a;
}

.tpl-026 .ds-lvl {
    color: #d97706;
}

.tpl-026 .cert-item {
    font-size: 12px;
    margin-bottom: 4px;
}`
  },

  "Template-027": {
    name: "The Executive Apprentice",
    is_premium: true,
    html: `<div class="resume tpl-027">
    <div class="gold-frame">
        <!-- Header -->
        <header class="resume-header">
            <h1 class="resume-name">{{full_name}}</h1>
            <h2 class="resume-title">{{designation}}</h2>
            
            <div class="contact-row">
                <!-- {{#if email}} --><span>{{email}}</span><!-- {{/if}} -->
                <!-- {{#if mobile}} --><span>| {{mobile}}</span><!-- {{/if}} -->
                <!-- {{#if location}} --><span>| {{location}}</span><!-- {{/if}} -->
                <!-- {{#if linkedin_url}} --><span>| <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
                <!-- {{#if github_url}} --><span>| <a href="{{github_url}}" target="_blank">Portfolio</a></span><!-- {{/if}} -->
            </div>
        </header>

        <!-- Summary -->
        <!-- {{#if professional_summary}} -->
        <section class="resume-section">
            <h3 class="section-title">Executive Profile</h3>
            <p class="summary-text">{{professional_summary}}</p>
        </section>
        <!-- {{/if}} -->

        <!-- Education -->
        <!-- {{#if education}} -->
        <section class="resume-section">
            <h3 class="section-title">Education</h3>
            <!-- {{#education}} -->
            <div class="exec-item">
                <div class="ex-head">
                    <span class="ex-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="ex-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="ex-sub">{{institution}}, {{university}} <!-- {{#if cgpa_percentage}} -->| Result: {{cgpa_percentage}}<!-- {{/if}} --></div>
            </div>
            <!-- {{/education}} -->
        </section>
        <!-- {{/if}} -->

        <!-- Projects -->
        <!-- {{#if projects}} -->
        <section class="resume-section">
            <h3 class="section-title">Business & Management Projects</h3>
            <!-- {{#projects}} -->
            <div class="exec-item">
                <div class="ex-head">
                    <span class="ex-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="ex-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="ex-sub">Focus: {{technologies_used}}</div>
                <p class="ex-desc">{{project_description}}</p>
                <div class="ex-links">
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Project Link</a><!-- {{/if}} -->
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Repository</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </section>
        <!-- {{/if}} -->

        <!-- Experience -->
        <!-- {{#if experience}} -->
        <section class="resume-section">
            <h3 class="section-title">Management Trainee / Internship</h3>
            <!-- {{#experience}} -->
            <div class="exec-item">
                <div class="ex-head">
                    <span class="ex-title"><strong>{{job_title}}</strong></span>
                    <span class="ex-date">{{start_date}} - {{end_date_or_present}}</span>
                </div>
                <div class="ex-sub">{{company_name}} | {{location}}</div>
                <p class="ex-desc">{{job_description}}</p>
            </div>
            <!-- {{/experience}} -->
        </section>
        <!-- {{/if}} -->

        <!-- Skills -->
        <!-- {{#if skills}} -->
        <section class="resume-section">
            <h3 class="section-title">Core Competencies</h3>
            <div class="skills-row">
                <!-- {{#skills}} -->
                <span class="gold-chip">{{skill_name}} <small>({{skill_level}})</small></span>
                <!-- {{/skills}} -->
            </div>
        </section>
        <!-- {{/if}} -->

        <!-- Certifications -->
        <!-- {{#if certifications}} -->
        <section class="resume-section">
            <h3 class="section-title">Certifications</h3>
            <!-- {{#certifications}} -->
            <div class="cert-line">
                <strong>{{certification_name}}</strong> - {{issuing_organization}} ({{issue_date}})
            </div>
            <!-- {{/certifications}} -->
        </section>
        <!-- {{/if}} -->
    </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

.resume.tpl-027 {
    font-family: 'Inter', sans-serif;
    color: #09090b;
    background: #ffffff;
    padding: 14mm 12mm;
    box-sizing: border-box;
}

.tpl-027 .gold-frame {
    border: 2px solid #ca8a04;
    padding: 16px;
    border-radius: 4px;
}

.tpl-027 .resume-header {
    text-align: center;
    margin-bottom: 18px;
}

.tpl-027 .resume-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 700;
    color: #09090b;
    margin: 0;
}

.tpl-027 .resume-title {
    font-size: 14px;
    font-weight: 600;
    color: #ca8a04;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 4px 0 10px 0;
}

.tpl-027 .contact-row {
    font-size: 12px;
    color: #52525b;
}

.tpl-027 .contact-row a {
    color: inherit;
    text-decoration: none;
}

.tpl-027 .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 700;
    color: #09090b;
    border-bottom: 1px solid #ca8a04;
    padding-bottom: 2px;
    margin: 0 0 10px 0;
}

.tpl-027 .summary-text {
    font-size: 12.5px;
    color: #27272a;
    line-height: 1.6;
    margin-bottom: 14px;
}

.tpl-027 .exec-item {
    margin-bottom: 10px;
}

.tpl-027 .ex-head {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
}

.tpl-027 .ex-title {
    color: #09090b;
}

.tpl-027 .ex-date {
    font-size: 11.5px;
    color: #71717a;
}

.tpl-027 .ex-sub {
    font-size: 12px;
    color: #ca8a04;
    font-weight: 600;
}

.tpl-027 .ex-desc {
    font-size: 12px;
    color: #27272a;
    margin: 3px 0;
}

.tpl-027 .ex-links a {
    font-size: 11px;
    color: #09090b;
    font-weight: 600;
    margin-right: 10px;
}

.tpl-027 .skills-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-027 .gold-chip {
    background: #fef08a;
    border: 1px solid #ca8a04;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    color: #09090b;
}

.tpl-027 .cert-line {
    font-size: 12px;
    margin-bottom: 4px;
}`
  },

  "Template-028": {
    name: "The Hackathon Hero",
    is_premium: true,
    html: `<div class="resume tpl-028">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="hero-badge"><i class="fa-solid fa-trophy"></i> Hackathon Winner & Open Source Contributor</div>

        <div class="contact-row">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Developer Pitch</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Hackathon Projects & Apps</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="hack-card">
                <div class="hc-head">
                    <span class="hc-title"><i class="fa-solid fa-code-fork"></i> {{project_name}}</span>
                    <span class="hc-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="hc-stack">Role: {{role}} | Stack: {{technologies_used}}</div>
                <p class="hc-desc">{{project_description}}</p>
                <div class="hc-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank"><i class="fa-brands fa-github"></i> Repository</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank"><i class="fa-solid fa-rocket"></i> Live Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Tech Stack</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <div class="cyber-skill">
                <span class="cs-name">{{skill_name}}</span>
                <span class="cs-lvl">{{skill_level}}</span>
            </div>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="hack-card">
                <div class="hc-head">
                    <span class="hc-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="hc-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="hc-stack">{{institution}}, {{university}} <!-- {{#if cgpa_percentage}} -->| Result: {{cgpa_percentage}}<!-- {{/if}} --></div>
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications & Competitions</h3>
        <div class="items-list">
            <!-- {{#certifications}} -->
            <div class="cert-line">
                <i class="fa-solid fa-award"></i> <strong>{{certification_name}}</strong> - {{issuing_organization}} ({{issue_date}})
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.resume.tpl-028 {
    font-family: 'Inter', sans-serif;
    color: #1e1e2e;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-028 .resume-header {
    text-align: center;
    margin-bottom: 16px;
}

.tpl-028 .resume-name {
    font-size: 30px;
    font-weight: 800;
    color: #8b5cf6;
    margin: 0;
}

.tpl-028 .resume-title {
    font-size: 14px;
    font-weight: 600;
    color: #06b6d4;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 2px 0 8px 0;
}

.tpl-028 .hero-badge {
    display: inline-block;
    background: #f3e8ff;
    color: #6b21a8;
    font-weight: 700;
    font-size: 11.5px;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 10px;
    border: 1px solid #d8b4fe;
}

.tpl-028 .contact-row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: #4b5563;
}

.tpl-028 .contact-row i {
    color: #8b5cf6;
}

.tpl-028 .contact-row a {
    color: inherit;
    text-decoration: none;
}

.tpl-028 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #8b5cf6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #a78bfa;
    padding-bottom: 4px;
    margin: 0 0 10px 0;
}

.tpl-028 .summary-text {
    font-size: 12.5px;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 14px;
}

.tpl-028 .hack-card {
    background: #faf5ff;
    border: 1px solid #e9d5ff;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 10px;
}

.tpl-028 .hc-head {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
}

.tpl-028 .hc-title {
    font-weight: 700;
    color: #6b21a8;
}

.tpl-028 .hc-date {
    font-size: 11.5px;
    color: #6b7280;
}

.tpl-028 .hc-stack {
    font-size: 11.5px;
    color: #0891b2;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-028 .hc-desc {
    font-size: 12px;
    color: #374151;
    margin: 4px 0;
}

.tpl-028 .hc-links a {
    font-size: 11px;
    color: #8b5cf6;
    font-weight: 700;
    text-decoration: none;
    margin-right: 10px;
}

.tpl-028 .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-028 .cyber-skill {
    background: #f0fdf4;
    border: 1px solid #86efac;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    display: flex;
    gap: 6px;
}

.tpl-028 .cs-name {
    font-weight: 700;
    color: #166534;
}

.tpl-028 .cs-lvl {
    color: #0891b2;
}

.tpl-028 .cert-line {
    font-size: 12px;
    margin-bottom: 4px;
    color: #374151;
}

.tpl-028 .cert-line i {
    color: #8b5cf6;
}`
  },

  "Template-029": {
    name: "The Bio-Engineering & Science Scholar",
    is_premium: true,
    html: `<div class="resume tpl-029">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-bar">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Research Objective</h3>
        <p class="summary-text">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic Qualifications</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="bio-item">
                <div class="bi-head">
                    <span class="bi-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="bi-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="bi-sub">{{institution}}, {{university}}</div>
                <!-- {{#if cgpa_percentage}} --><div class="bi-gpa">Grade / GPA: {{cgpa_percentage}}</div><!-- {{/if}} -->
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Research & Lab Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="bio-item">
                <div class="bi-head">
                    <span class="bi-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="bi-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="bi-sub">Techniques & Tools: {{technologies_used}}</div>
                <p class="bi-desc">{{project_description}}</p>
                <div class="bi-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">Publication / Code</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Project Link</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Laboratory & Technical Skills</h3>
        <div class="bio-skills">
            <!-- {{#skills}} -->
            <span class="bio-tag">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications & Honors</h3>
        <div class="items-list">
            <!-- {{#certifications}} -->
            <div class="bio-item">
                <strong>{{certification_name}}</strong> - {{issuing_organization}} ({{issue_date}})
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.resume.tpl-029 {
    font-family: 'Inter', sans-serif;
    color: #134e4a;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-029 .resume-header {
    border-bottom: 2px solid #0f766e;
    padding-bottom: 12px;
    margin-bottom: 16px;
}

.tpl-029 .resume-name {
    font-size: 30px;
    font-weight: 800;
    color: #0f766e;
    margin: 0;
}

.tpl-029 .resume-title {
    font-size: 14px;
    font-weight: 600;
    color: #0d9488;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 2px 0 8px 0;
}

.tpl-029 .contact-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: #475569;
}

.tpl-029 .contact-bar i {
    color: #0f766e;
}

.tpl-029 .contact-bar a {
    color: inherit;
    text-decoration: none;
}

.tpl-029 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f766e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1.5px solid #99f6e4;
    padding-bottom: 4px;
    margin: 0 0 10px 0;
}

.tpl-029 .summary-text {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.6;
    margin-bottom: 14px;
}

.tpl-029 .bio-item {
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f0fdf4;
}

.tpl-029 .bi-head {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.tpl-029 .bi-title {
    color: #134e4a;
}

.tpl-029 .bi-date {
    font-size: 11.5px;
    color: #64748b;
}

.tpl-029 .bi-sub {
    font-size: 11.5px;
    color: #0f766e;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-029 .bi-desc {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-029 .bi-gpa {
    display: inline-block;
    background: #ccfbf1;
    color: #0f766e;
    font-weight: 700;
    font-size: 10.5px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 2px;
}

.tpl-029 .bi-links a {
    font-size: 11px;
    color: #0f766e;
    font-weight: 600;
    margin-right: 10px;
}

.tpl-029 .bio-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-029 .bio-tag {
    background: #f0fdf4;
    border: 1px solid #99f6e4;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    color: #134e4a;
}

.tpl-029 .bio-tag small {
    color: #0d9488;
}`
  },

  "Template-030": {
    name: "The NextGen Titan",
    is_premium: true,
    html: `<div class="resume tpl-030">
    <!-- Header -->
    <header class="resume-header">
        <h1 class="resume-name">{{full_name}}</h1>
        <h2 class="resume-title">{{designation}}</h2>
        
        <div class="contact-pills">
            <!-- {{#if email}} --><span><i class="fa-solid fa-envelope"></i> {{email}}</span><!-- {{/if}} -->
            <!-- {{#if mobile}} --><span><i class="fa-solid fa-phone"></i> {{mobile}}</span><!-- {{/if}} -->
            <!-- {{#if location}} --><span><i class="fa-solid fa-location-dot"></i> {{location}}</span><!-- {{/if}} -->
            <!-- {{#if linkedin_url}} --><span><i class="fa-brands fa-linkedin"></i> <a href="{{linkedin_url}}" target="_blank">LinkedIn</a></span><!-- {{/if}} -->
            <!-- {{#if github_url}} --><span><i class="fa-brands fa-github"></i> <a href="{{github_url}}" target="_blank">GitHub</a></span><!-- {{/if}} -->
        </div>
    </header>

    <!-- Summary -->
    <!-- {{#if professional_summary}} -->
    <section class="resume-section">
        <h3 class="section-title">Career Summary</h3>
        <p class="summary-box">{{professional_summary}}</p>
    </section>
    <!-- {{/if}} -->

    <!-- Projects -->
    <!-- {{#if projects}} -->
    <section class="resume-section">
        <h3 class="section-title">Academic & Software Projects</h3>
        <div class="items-list">
            <!-- {{#projects}} -->
            <div class="titan-card">
                <div class="tc-head">
                    <span class="tc-title"><strong>{{project_name}}</strong> ({{role}})</span>
                    <span class="tc-date">{{start_date}} - {{end_date}}</span>
                </div>
                <div class="tc-sub">Tech: {{technologies_used}}</div>
                <p class="tc-desc">{{project_description}}</p>
                <div class="tc-links">
                    <!-- {{#if github_url}} --><a href="{{github_url}}" target="_blank">GitHub</a><!-- {{/if}} -->
                    <!-- {{#if live_project_url}} --><a href="{{live_project_url}}" target="_blank">Live Demo</a><!-- {{/if}} -->
                </div>
            </div>
            <!-- {{/projects}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Education -->
    <!-- {{#if education}} -->
    <section class="resume-section">
        <h3 class="section-title">Education</h3>
        <div class="items-list">
            <!-- {{#education}} -->
            <div class="titan-card">
                <div class="tc-head">
                    <span class="tc-title"><strong>{{degree}}</strong> in {{field_of_study}}</span>
                    <span class="tc-date">{{start_year}} - {{end_year}}</span>
                </div>
                <div class="tc-sub">{{institution}}, {{university}} <!-- {{#if cgpa_percentage}} -->| GPA: {{cgpa_percentage}}<!-- {{/if}} --></div>
            </div>
            <!-- {{/education}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Skills -->
    <!-- {{#if skills}} -->
    <section class="resume-section">
        <h3 class="section-title">Technical Competencies</h3>
        <div class="skills-grid">
            <!-- {{#skills}} -->
            <span class="titan-pill">{{skill_name}} <small>({{skill_level}})</small></span>
            <!-- {{/skills}} -->
        </div>
    </section>
    <!-- {{/if}} -->

    <!-- Certifications -->
    <!-- {{#if certifications}} -->
    <section class="resume-section">
        <h3 class="section-title">Certifications</h3>
        <div class="items-list">
            <!-- {{#certifications}} -->
            <div class="cert-item">
                <strong>{{certification_name}}</strong> - {{issuing_organization}} ({{issue_date}})
            </div>
            <!-- {{/certifications}} -->
        </div>
    </section>
    <!-- {{/if}} -->
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.resume.tpl-030 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a;
    background: #ffffff;
    padding: 16mm 14mm;
    box-sizing: border-box;
}

.tpl-030 .resume-header {
    background: linear-gradient(135deg, #0284c7, #6366f1);
    color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 18px;
}

.tpl-030 .resume-name {
    font-size: 30px;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
}

.tpl-030 .resume-title {
    font-size: 14px;
    font-weight: 600;
    color: #bae6fd;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 4px 0 12px 0;
}

.tpl-030 .contact-pills {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12px;
}

.tpl-030 .contact-pills span {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(4px);
    padding: 4px 10px;
    border-radius: 20px;
    color: #ffffff;
}

.tpl-030 .contact-pills a {
    color: #ffffff;
    text-decoration: underline;
}

.tpl-030 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #0284c7;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e0f2fe;
    padding-bottom: 4px;
    margin: 0 0 10px 0;
}

.tpl-030 .summary-box {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.6;
    background: #f0f9ff;
    padding: 10px 14px;
    border-left: 4px solid #0284c7;
    border-radius: 0 6px 6px 0;
    margin-bottom: 16px;
}

.tpl-030 .titan-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 10px;
}

.tpl-030 .tc-head {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.tpl-030 .tc-title {
    color: #0f172a;
}

.tpl-030 .tc-date {
    font-size: 11.5px;
    color: #64748b;
}

.tpl-030 .tc-sub {
    font-size: 11.5px;
    color: #6366f1;
    font-weight: 600;
    margin: 2px 0;
}

.tpl-030 .tc-desc {
    font-size: 12px;
    color: #334155;
    margin: 4px 0;
}

.tpl-030 .tc-links a {
    font-size: 11px;
    color: #0284c7;
    font-weight: 600;
    margin-right: 10px;
    text-decoration: none;
}

.tpl-030 .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tpl-030 .titan-pill {
    background: #e0f2fe;
    color: #0369a1;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 600;
}

.tpl-030 .titan-pill small {
    color: #4f46e5;
}

.tpl-030 .cert-item {
    font-size: 12px;
    margin-bottom: 4px;
}`
  }

};

async function main() {
  console.log("Writing premium template definitions...");

  for (const [folderName, data] of Object.entries(templates)) {
    const folderPath = path.join(TEMPLATES_DIR, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Creating directory: ${folderPath}`);
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const htmlPath = path.join(folderPath, "template.html");
    const cssPath = path.join(folderPath, "template.css");

    fs.writeFileSync(htmlPath, data.html, "utf8");
    fs.writeFileSync(cssPath, data.css, "utf8");

    console.log(`[Success] Written HTML & CSS for ${folderName}: ${data.name}`);
  }

  console.log("All 30 premium templates generated successfully.");
}

main().catch(err => {
  console.error("Error generating templates:", err);
  process.exit(1);
});
