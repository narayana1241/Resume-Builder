const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

const form = document.getElementById("experienceForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const response = await fetch(

        `${API_BASE_URL}/api/experience/save`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                resume_id: localStorage.getItem("resume_id"),

                company_name: document.getElementById("company_name").value,

                job_title: document.getElementById("job_title").value,

                employment_type: document.getElementById("employment_type").value,

                location: document.getElementById("location").value || null,
                start_date: document.getElementById("start_date").value || null,
                end_date: document.getElementById("end_date").value || null,
                currently_working: document.getElementById("currently_working").checked,
                job_description: document.getElementById("job_description").value || null,

            })

        }

    );

    const result = await response.json();

    console.log(result);

    alert(result.message);

    if (result.error_cd === "00000") {

        localStorage.setItem(
            "resume_experience_id",
            result.ref_id
        );

        // Next page
         window.location.href = "skills.html";

    }

});