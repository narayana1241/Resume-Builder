const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

const resumeForm = document.getElementById("resumeForm");

// ==========================================
// Page Load
// ==========================================
window.addEventListener("DOMContentLoaded", async () => {
    await fetchAndRenderTemplates();
});

// ==========================================
// Fetch and Render Templates dynamically
// ==========================================
async function fetchAndRenderTemplates() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/templates`);
        const result = await response.json();
        
        if (!result.success || !result.data || !result.data.data) {
            console.error("Failed to retrieve templates:", result);
            return;
        }

        const templates = result.data.data;
        const container = document.getElementById("templatesContainer");
        container.innerHTML = "";

        templates.forEach((tpl, index) => {
            const isChecked = index === 0 ? "checked" : "";
            const badgeHtml = tpl.is_premium 
                ? `<div class="template-badge info">Premium</div>` 
                : `<div class="template-badge">ATS Friendly</div>`;
            
            // Build card dynamically
            container.innerHTML += `
                <div class="template">
                    <input
                        type="radio"
                        name="template"
                        value="${tpl.template_id}"
                        ${isChecked}>
                    <div class="template-card">
                        <div class="template-image-box">
                            <img src="templates/${tpl.template_folder}/preview.png" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" 
                                 alt="${tpl.template_name} Preview" 
                                 class="template-preview-img"
                                 style="width: 100%; height: 100%; object-fit: contain;">
                            <i class="fa-regular fa-file-pdf placeholder-img-icon" style="display: none;"></i>
                            ${badgeHtml}
                            <div class="template-hover-overlay">
                                <div class="choose-template-btn">Choose template</div>
                            </div>
                        </div>
                        <div class="template-info">
                            <h4>${tpl.template_name}</h4>
                            <p style="margin-bottom: 16px;">Designed for professional resumes.</p>
                        </div>
                    </div>
                </div>
            `;
        });

        // Bind card click triggers to submit form
        document.querySelectorAll(".template-card").forEach(card => {
            card.addEventListener("click", (e) => {
                const templateDiv = card.closest(".template");
                const radio = templateDiv.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                }
                
                // Submit form immediately
                const resumeForm = document.getElementById("resumeForm");
                if (resumeForm) {
                    resumeForm.requestSubmit();
                }
            });
        });
    } catch (err) {
        console.error("Error loading templates dynamically:", err);
    }
}

// ==========================================
// Populate Uploaded Resume Mock Data
// ==========================================
async function populateUploadedResumeData(resumeId) {
    try {
        const parsedDataStr = localStorage.getItem("uploaded_resume_parsed_data");
        if (!parsedDataStr) {
            console.warn("No parsed resume data found in local storage. Using mock defaults.");
        }

        const data = parsedDataStr ? JSON.parse(parsedDataStr) : null;
        
        // 1. Personal Details
        const personal = data ? data.personal : {
            first_name: "Diya",
            last_name: "Agarwal",
            email: "diya.agarwal@example.com",
            mobile: "+91 9999999999",
            date_of_birth: "2002-08-15",
            address: "123, Sector 5",
            city: "Noida",
            state: "Uttar Pradesh",
            country: "India",
            pincode: "201301",
            linkedin_url: "https://linkedin.com/in/diya-agarwal",
            github_url: "https://github.com/diya-agarwal",
            portfolio_url: "https://diya-agarwal.dev",
            professional_summary: "Motivated and detail-oriented Computer Science fresher with a strong foundation in frontend technologies like React, Javascript, and responsive CSS. Passionate about building premium, user-friendly SaaS products and optimizing user experiences."
        };
        
        await fetch(`${API_BASE_URL}/api/personal/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resume_id: resumeId,
                ...personal
            })
        });

        // 2. Education
        const education = data ? data.education : [
            {
                degree: "B.Tech",
                institution: "Vignan University",
                university: "JNTU",
                field_of_study: "Computer Science & Engineering",
                start_year: "2020",
                end_year: "2024",
                cgpa_percentage: "85.5",
                currently_studying: false
            }
        ];
        
        for (const edu of education) {
            await fetch(`${API_BASE_URL}/api/education/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resumeId,
                    ...edu
                })
            });
        }

        // 3. Experience
        const experience = data ? data.experience : [
            {
                company_name: "Tech Corp",
                job_title: "Software Developer Intern",
                employment_type: "Internship",
                location: "Noida, India",
                start_date: "2023-06-01",
                end_date: "2023-12-31",
                currently_working: false,
                job_description: "Collaborated with the core product engineering team to build and design responsive dashboard components. Optimised frontend load times by 20% by refactoring CSS files and implementing CSS variables."
            }
        ];
        
        for (const exp of experience) {
            await fetch(`${API_BASE_URL}/api/experience/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resumeId,
                    ...exp
                })
            });
        }

        // 4. Skills
        const skills = data ? data.skills : [
            { skill_name: "JavaScript", skill_category: "Programming Language", skill_level: "Advanced", experience_years: 2 },
            { skill_name: "React.js", skill_category: "Frontend Framework", skill_level: "Intermediate", experience_years: 1.5 },
            { skill_name: "CSS Grid & Flexbox", skill_category: "UI Design", skill_level: "Advanced", experience_years: 2 }
        ];
        
        for (const skill of skills) {
            await fetch(`${API_BASE_URL}/api/skills/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resumeId,
                    ...skill
                })
            });
        }

        // 5. Projects
        const projects = data ? data.projects : [
            {
                project_name: "Premium SaaS Dashboard Layout",
                technologies_used: "React, CSS Variables, Chart.js",
                role: "Lead Frontend Developer",
                start_date: "2023-09-01",
                end_date: "2023-11-30",
                github_url: "https://github.com/diya-agarwal/saas-dashboard",
                live_project_url: "https://saas-dashboard-demo.dev",
                project_description: "Designed and implemented a premium glassmorphic SaaS dashboard interface. Highly responsive layouts optimized for all viewport screens."
            }
        ];
        
        for (const proj of projects) {
            await fetch(`${API_BASE_URL}/api/projects/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resumeId,
                    ...proj
                })
            });
        }

        // 6. Certifications
        const certifications = data ? data.certifications : [
            {
                certification_name: "AWS Certified Cloud Practitioner",
                issuing_organization: "Amazon Web Services",
                issue_date: "2024-01-15",
                expiry_date: "2027-01-15",
                credential_id: "AWS-CLF-8921",
                description: "Validation of overall understanding of the AWS Cloud platform, covering basic cloud services and security."
            }
        ];
        
        for (const cert of certifications) {
            await fetch(`${API_BASE_URL}/api/certifications/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_id: resumeId,
                    ...cert
                })
            });
        }

    } catch (err) {
        console.error("Error populating upload data:", err);
    }
}

// ==========================================
// Submit Resume Form
// ==========================================
resumeForm.addEventListener("submit", async function(e){
    e.preventDefault();

    const resume_title = document.getElementById("resume_title").value;
    const checkedRadio = document.querySelector('input[name="template"]:checked');
    
    if (!checkedRadio) {
        alert("Please select a template.");
        return;
    }
    
    const template_id = checkedRadio.value;
    const user_id = localStorage.getItem("user_id");

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

    if(result.error_cd == "0" || result.error_cd == "00000"){
        const resumeId = result.ref_id;
        localStorage.setItem("resume_id", resumeId);
        localStorage.setItem(`resume_template_id_${resumeId}`, template_id); // Sync active template override
        
        // Check if coming from upload resume source
        const urlParams = new URLSearchParams(window.location.search);
        const isUploadSource = urlParams.get("source") === "upload";

        // Show loading spinner inside the chosen template's button
        if (checkedRadio) {
            const card = checkedRadio.closest(".template");
            const btn = card.querySelector(".choose-template-btn");
            if (btn) {
                btn.innerHTML = isUploadSource 
                    ? '<i class="fa-solid fa-spinner fa-spin"></i> Parsing...' 
                    : '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
                btn.style.background = "#e2e8f0";
                btn.style.color = "#64748b";
            }
        }
        
        if (isUploadSource) {
            // Populate database with details parsed from uploaded resume
            await populateUploadedResumeData(resumeId);
            window.location.href = "editor.html?source=upload";
        } else {
            window.location.href = "editor.html";
        }
    } else {
        alert(result.message);
    }
});