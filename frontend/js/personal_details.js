var API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

const form = document.getElementById("personalForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const response = await fetch(

        `${API_BASE_URL}/api/personal/save`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                resume_id: localStorage.getItem("resume_id"),

                first_name: document.getElementById("first_name").value,

                last_name: document.getElementById("last_name").value,

                email: document.getElementById("email").value,

                mobile: document.getElementById("mobile").value,

                date_of_birth: document.getElementById("date_of_birth").value || null,
                address: document.getElementById("address").value || null,
                city: document.getElementById("city").value || null,
                state: document.getElementById("state").value || null,
                country: document.getElementById("country").value || null,
                pincode: document.getElementById("pincode").value || null,
                linkedin_url: document.getElementById("linkedin_url").value || null,
                github_url: document.getElementById("github_url").value || null,
                portfolio_url: document.getElementById("portfolio_url").value || null,

                professional_summary:
                    document.getElementById("professional_summary").value,

                profile_photo: null

            })

        }

    );

    const result = await response.json();

    console.log(result);

    alert(result.message);

    if (result.error_cd === "00000") {

        localStorage.setItem(
            "resume_personal_id",
            result.ref_id
        );

        // Next page
         window.location.href = "education.html";

    }

});