var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const full_name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name,
                email,
                mobile,
                password
            })
        });

        const result = await response.json();
        console.log("Register result:", result);

        if (result.success || result.error_cd === "00000") {
            alert(result.message || "Registration Successful! Please login.");
            window.location.href = "login.html";
        } else {
            alert(result.message || "Registration Failed. Please try again.");
        }
    } catch (err) {
        console.error("Register request error:", err);
        alert("An error occurred during registration. Please try again.");
    }
});