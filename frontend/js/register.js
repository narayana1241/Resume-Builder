var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const full_name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;

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

   if(result.error_cd === "00000"){

    alert(result.message);

    window.location.href = "login.html";

}
else{

    alert(result.message);

}

});