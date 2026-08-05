var API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

const educationForm = document.getElementById("educationForm");

educationForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const resume_id = localStorage.getItem("resume_id");

    if (!resume_id) {

        alert("Invalid Resume ID");

        return;

    }

    const response = await fetch(

        `${API_BASE_URL}/api/education/save`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                resume_id: resume_id,

                degree: document.getElementById("degree").value,

                institution: document.getElementById("institution").value,

                university: document.getElementById("university").value,

                field_of_study: document.getElementById("field_of_study").value,

                start_year: document.getElementById("start_year").value,

                end_year: document.getElementById("end_year").value,

                cgpa_percentage: document.getElementById("cgpa").value,

                currently_studying: document.getElementById("currently_studying").checked

            })

        }

    );

    const result = await response.json();

    console.log(result);

    alert(result.message);

    if (result.error_cd == "0" || result.error_cd == "00000") {

        localStorage.setItem(

            "resume_education_id",

            result.ref_id

        );

        window.location.href = "experience.html";

    }

});