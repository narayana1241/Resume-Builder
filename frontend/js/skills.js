var API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

const btnAddSkill = document.getElementById("btnAddSkill");
const btnNext = document.getElementById("btnNext");

// =============================
// Add Skill
// =============================

btnAddSkill.addEventListener("click", saveSkill);

async function saveSkill() {

    const response = await fetch(

        `${API_BASE_URL}/api/skills/save`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                resume_id: localStorage.getItem("resume_id"),

                skill_name: document.getElementById("skill_name").value,

                skill_category: document.getElementById("skill_category").value,

                skill_level: document.getElementById("skill_level").value,

                experience_years: document.getElementById("experience_years").value

            })

        }

    );

    const result = await response.json();

    console.log(result);

    alert(result.message);

    if(result.error_cd=="0" || result.error_cd=="00000"){

        localStorage.setItem(

            "skill_id",

            result.ref_id

        );

        // Clear Form

        document.getElementById("skill_name").value="";

        document.getElementById("skill_category").selectedIndex=0;

        document.getElementById("skill_level").selectedIndex=0;

        document.getElementById("experience_years").value="";

        // Load Skills Again
        // loadSkills();
        // Refresh Skills Table

            loadSkills();

    }

}

// =============================
// Save & Next
// =============================
// =============================
// Load Added Skills
// =============================

async function loadSkills() {

    const resume_id = localStorage.getItem("resume_id");

    const response = await fetch(

        `${API_BASE_URL}/api/skills/list/${resume_id}`

    );

    const skills = await response.json();

    const tbody = document.getElementById("skillBody");

    tbody.innerHTML = "";

    skills.forEach((skill) => {

        tbody.innerHTML += `

            <tr>

                <td>${skill.sl_no}</td>

                <td>${skill.skill_name}</td>

                <td>${skill.skill_category}</td>

                <td>${skill.skill_level}</td>

                <td>${skill.experience_years}</td>

                <td>

                    <button class="edit-btn">

                        Edit

                    </button>

                    <button class="delete-btn">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}
// =============================
// Page Load
// =============================

window.addEventListener("DOMContentLoaded", () => {
    loadSkills();
});

btnNext.addEventListener("click",function(){

    window.location.href="projects.html";

});