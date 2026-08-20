const fs = require("fs");
const path = require("path");
const { createCanvas } = require("@napi-rs/canvas");
const pool = require("./config/db");

const TEMPLATES_DIR = path.join(__dirname, "..", "frontend", "templates");

const newFirst15Templates = {
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
};

// Canvas Preview Generator
function generatePreviewPNG(folderName, tplData) {
  const canvas = createCanvas(400, 520);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 400, 520);

  let primaryColor = "#0f766e";
  let accentColor = "#0d9488";
  let isDarkSidebar = false;

  if (folderName === "Template-001") { primaryColor = "#0f766e"; accentColor = "#0d9488"; }
  else if (folderName === "Template-002") { primaryColor = "#1e293b"; accentColor = "#f59e0b"; }
  else if (folderName === "Template-003") { primaryColor = "#1e3a8a"; accentColor = "#d97706"; }
  else if (folderName === "Template-004") { primaryColor = "#581c87"; accentColor = "#7e22ce"; }
  else if (folderName === "Template-005") { primaryColor = "#0f172a"; accentColor = "#06b6d4"; isDarkSidebar = true; }
  else if (folderName === "Template-006") { primaryColor = "#18181b"; accentColor = "#f43f5e"; }
  else if (folderName === "Template-007") { primaryColor = "#6d28d9"; accentColor = "#10b981"; }
  else if (folderName === "Template-008") { primaryColor = "#9a3412"; accentColor = "#ea580c"; }
  else if (folderName === "Template-009") { primaryColor = "#1e3a8a"; accentColor = "#d97706"; }
  else if (folderName === "Template-010") { primaryColor = "#09090b"; accentColor = "#ca8a04"; }
  else if (folderName === "Template-011") { primaryColor = "#312e81"; accentColor = "#06b6d4"; }
  else if (folderName === "Template-012") { primaryColor = "#0f766e"; accentColor = "#0d9488"; }
  else if (folderName === "Template-013") { primaryColor = "#0284c7"; accentColor = "#6366f1"; }
  else if (folderName === "Template-014") { primaryColor = "#18181b"; accentColor = "#15803d"; }
  else if (folderName === "Template-015") { primaryColor = "#9f1239"; accentColor = "#be123c"; }

  if (isDarkSidebar) {
    ctx.fillStyle = primaryColor; ctx.fillRect(0, 0, 130, 520);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 14px sans-serif"; ctx.fillText("ALEX R.", 15, 35);
    ctx.font = "10px sans-serif"; ctx.fillStyle = accentColor; ctx.fillText("FRESH GRADUATE", 15, 50);
    ctx.strokeStyle = "#334155"; ctx.beginPath(); ctx.moveTo(15, 60); ctx.lineTo(115, 60); ctx.stroke();
    ctx.fillStyle = "#94a3b8"; ctx.font = "9px sans-serif";
    ctx.fillText("alex@univ.edu", 15, 80); ctx.fillText("+1 555-0192", 15, 95); ctx.fillText("github/alex-dev", 15, 110);
    ctx.fillStyle = accentColor; ctx.font = "bold 10px sans-serif"; ctx.fillText("CORE SKILLS", 15, 140);
    ctx.fillStyle = "#ffffff"; ctx.font = "9px sans-serif";
    ["Java / Python", "React / Node.js", "SQL / Databases", "Data Structures"].forEach((s, idx) => { ctx.fillText(`• ${s}`, 15, 160 + (idx * 16)); });
    ctx.fillStyle = primaryColor; ctx.font = "bold 12px sans-serif"; ctx.fillText("OBJECTIVE", 150, 35);
    ctx.fillStyle = "#475569"; ctx.font = "10px sans-serif"; ctx.fillText("Passionate graduate seeking software engineering role.", 150, 52);
    ctx.fillStyle = primaryColor; ctx.font = "bold 12px sans-serif"; ctx.fillText("KEY PROJECTS", 150, 85);
    ctx.strokeStyle = accentColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(380, 90); ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.font = "bold 11px sans-serif"; ctx.fillText("Full Stack Student Portal", 150, 110);
    ctx.fillStyle = accentColor; ctx.font = "bold 9px sans-serif"; ctx.fillText("Tech: React, Node, SQL", 150, 124);
    ctx.fillStyle = "#334155"; ctx.font = "9px sans-serif"; ctx.fillText("Built portal serving 1500+ active campus students.", 150, 138);
    ctx.fillStyle = primaryColor; ctx.font = "bold 12px sans-serif"; ctx.fillText("EDUCATION", 150, 180);
    ctx.strokeStyle = accentColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, 185); ctx.lineTo(380, 185); ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.font = "bold 11px sans-serif"; ctx.fillText("B.Tech Computer Science", 150, 205);
    ctx.fillStyle = "#64748b"; ctx.font = "9px sans-serif"; ctx.fillText("State Tech University (2022-2026)", 150, 220);
  } else {
    ctx.fillStyle = primaryColor; ctx.fillRect(0, 0, 400, 70);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 18px sans-serif"; ctx.fillText("ALEX RIVERS", 20, 32);
    ctx.fillStyle = accentColor; ctx.font = "bold 11px sans-serif"; ctx.fillText(tplData.name.toUpperCase(), 20, 52);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 70, 400, 24);
    ctx.fillStyle = "#475569"; ctx.font = "9px sans-serif"; ctx.fillText("alex@univ.edu  |  +1 555-0192  |  github.com/alex-dev", 20, 86);
    ctx.fillStyle = primaryColor; ctx.font = "bold 11px sans-serif"; ctx.fillText("CAREER OBJECTIVE", 20, 115);
    ctx.strokeStyle = accentColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 120); ctx.lineTo(380, 120); ctx.stroke();
    ctx.fillStyle = "#334155"; ctx.font = "9.5px sans-serif"; ctx.fillText("Enthusiastic graduate with strong technical foundation seeking entry-level software role.", 20, 136);
    ctx.fillStyle = primaryColor; ctx.font = "bold 11px sans-serif"; ctx.fillText("PROJECTS", 20, 168);
    ctx.strokeStyle = accentColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 173); ctx.lineTo(380, 173); ctx.stroke();
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(20, 182, 360, 58); ctx.strokeStyle = "#e2e8f0"; ctx.strokeRect(20, 182, 360, 58);
    ctx.fillStyle = primaryColor; ctx.font = "bold 11px sans-serif"; ctx.fillText("Smart Campus System (Full Stack)", 30, 198);
    ctx.fillStyle = accentColor; ctx.font = "bold 9px sans-serif"; ctx.fillText("Tech: React.js, Node.js, Express, PostgreSQL", 30, 212);
    ctx.fillStyle = "#475569"; ctx.font = "9px sans-serif"; ctx.fillText("Built student management portal serving 2000+ users.", 30, 226);
    ctx.fillStyle = primaryColor; ctx.font = "bold 11px sans-serif"; ctx.fillText("EDUCATION & SKILLS", 20, 260);
    ctx.strokeStyle = accentColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 265); ctx.lineTo(380, 265); ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.font = "bold 10px sans-serif"; ctx.fillText("B.Tech Computer Science (2022-2026)", 20, 282);
    ctx.fillStyle = accentColor; ctx.font = "bold 9px sans-serif"; ctx.fillText("GPA / Result: 3.9 / 4.0", 20, 296);
  }

  ctx.fillStyle = primaryColor; ctx.fillRect(0, 495, 400, 25);
  ctx.fillStyle = "#ffffff"; ctx.font = "bold 10px sans-serif"; ctx.fillText(`PREMIUM FRESHER TEMPLATE  |  ${folderName}`, 80, 512);

  return canvas.toBuffer("image/png");
}

async function main() {
  console.log("Replacing Template-001 through Template-015 with Premium Fresher Templates...");

  // 1. Write HTML, CSS, PNG for 001-015
  for (const [folderName, data] of Object.entries(newFirst15Templates)) {
    const folderPath = path.join(TEMPLATES_DIR, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(path.join(folderPath, "template.html"), data.html, "utf8");
    fs.writeFileSync(path.join(folderPath, "template.css"), data.css, "utf8");
    fs.writeFileSync(path.join(folderPath, "preview.png"), generatePreviewPNG(folderName, data));

    console.log(`[Success] Replaced files for ${folderName}: ${data.name}`);
  }

  // 2. Database Upsert for 001-015
  const client = await pool.connect();
  try {
    console.log("Updating database records for Template-001 to Template-015...");
    let displayOrder = 1;
    for (const [folderName, data] of Object.entries(newFirst15Templates)) {
      const templateId = parseInt(folderName.replace("Template-0", "").replace("Template-", ""), 10);
      
      await client.query(`
        INSERT INTO resume_templates (template_id, template_name, template_folder, thumbnail_file, is_premium, is_active, display_order)
        VALUES ($1, $2, $3, 'preview.png', true, true, $4)
        ON CONFLICT (template_id) DO UPDATE SET
          template_name = EXCLUDED.template_name,
          template_folder = EXCLUDED.template_folder,
          thumbnail_file = EXCLUDED.thumbnail_file,
          is_premium = true,
          is_active = true,
          display_order = EXCLUDED.display_order;
      `, [templateId, data.name, folderName, displayOrder]);

      displayOrder++;
    }

    const res = await client.query("SELECT template_id, template_name, template_folder, is_premium FROM resume_templates ORDER BY template_id;");
    console.log(`[DB Success] Total templates in DB: ${res.rows.length}`);
  } catch (err) {
    console.error("DB error:", err);
  } finally {
    client.release();
  }

  console.log("Finished replacing first 15 templates!");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
