const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

const btnAddCertification = document.getElementById("btnAddCertification");
const btnNext = document.getElementById("btnNext");

// =============================
// Add Certification
// =============================

btnAddCertification.addEventListener("click", saveCertification);

async function saveCertification() {

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/certifications/save`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    resume_id: localStorage.getItem("resume_id"),

                    certification_name: document.getElementById("certification_name").value,

                    issuing_organization: document.getElementById("issuing_organization").value,

                    issue_date: document.getElementById("issue_date").value,

                    expiry_date: document.getElementById("expiry_date").value,

                    credential_id: document.getElementById("credential_id").value,

                    credential_url: document.getElementById("credential_url").value,

                    description: document.getElementById("description").value

                })

            }

        );

        const result = await response.json();

        console.log(result);

        alert(result.message);

        if (result.error_cd == "0" || result.error_cd == "00000") {

            localStorage.setItem(

                "certification_id",

                result.ref_id

            );

            // Clear Form

            document.getElementById("certification_name").value = "";

            document.getElementById("issuing_organization").value = "";

            document.getElementById("issue_date").value = "";

            document.getElementById("expiry_date").value = "";

            document.getElementById("credential_id").value = "";

            document.getElementById("credential_url").value = "";

            document.getElementById("description").value = "";

            // Refresh Table

            loadCertifications();

        }

    }
    catch (err) {

        console.log(err);

        alert("Unable to save certification.");

    }

}

// =============================
// Load Certifications
// =============================

async function loadCertifications() {

    try {

        const resume_id = localStorage.getItem("resume_id");

        const response = await fetch(

            `${API_BASE_URL}/api/certifications/list/${resume_id}`

        );

        const certifications = await response.json();

        const tbody = document.getElementById("certificationBody");

        tbody.innerHTML = "";

        certifications.forEach((certification) => {

            tbody.innerHTML += `

                <tr>

                    <td>${certification.sl_no}</td>

                    <td>${certification.certification_name}</td>

                    <td>${certification.issuing_organization}</td>

                    <td>${certification.issue_date ?? ""}</td>

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

    window.location.href = "preview.html";

});

// =============================
// Page Load
// =============================

window.addEventListener("DOMContentLoaded", () => {
    loadCertifications();
});