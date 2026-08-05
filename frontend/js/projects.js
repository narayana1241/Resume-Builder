var API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

const btnAddProject = document.getElementById("btnAddProject");
const btnNext = document.getElementById("btnNext");

// =============================
// Add Project
// =============================

btnAddProject.addEventListener("click", saveProject);

async function saveProject() {

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/projects/save`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    resume_id: localStorage.getItem("resume_id"),

                    project_name: document.getElementById("project_name").value,

                    technologies_used: document.getElementById("technologies_used").value,

                    role: document.getElementById("role").value,

                    start_date: document.getElementById("start_date").value,

                    end_date: document.getElementById("end_date").value,

                    github_url: document.getElementById("github_url").value,

                    live_project_url: document.getElementById("live_project_url").value,

                    project_description: document.getElementById("project_description").value

                })

            }

        );

        const result = await response.json();

        console.log(result);

        alert(result.message);

        if (result.error_cd == "0" || result.error_cd == "00000") {

            localStorage.setItem(

                "project_id",

                result.ref_id

            );

            // Clear Form

            document.getElementById("project_name").value = "";

            document.getElementById("technologies_used").value = "";

            document.getElementById("role").value = "";

            document.getElementById("start_date").value = "";

            document.getElementById("end_date").value = "";

            document.getElementById("github_url").value = "";

            document.getElementById("live_project_url").value = "";

            document.getElementById("project_description").value = "";

            // Refresh Project List

            loadProjects();

        }

    }
    catch (err) {

        console.log(err);

        alert("Unable to save project.");

    }

}

// =============================
// Load Added Projects
// =============================

async function loadProjects() {

    try {

        const resume_id = localStorage.getItem("resume_id");

        const response = await fetch(

            `${API_BASE_URL}/api/projects/list/${resume_id}`

        );

        const projects = await response.json();

        const tbody = document.getElementById("projectBody");

        tbody.innerHTML = "";

        projects.forEach((project) => {

            tbody.innerHTML += `

                <tr>

                    <td>${project.sl_no}</td>

                    <td>${project.project_name}</td>

                    <td>${project.role}</td>

                    <td>${project.technologies_used}</td>

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
    catch (err) {

        console.log(err);

    }

}

// =============================
// Save & Next
// =============================

btnNext.addEventListener("click", function () {

    window.location.href = "certifications.html";

});

// =============================
// Page Load
// =============================

window.addEventListener("DOMContentLoaded", () => {
    loadProjects();
});