var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_BASE_URL}/api/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })

    });

    const result = await response.json();
    console.log(result);

    console.log(result);

   if (result.success) {

    // Save logged-in user details
    localStorage.setItem("user_id", result.data.user_id);
    localStorage.setItem("full_name", result.data.full_name);
    localStorage.setItem("email", result.data.email);

    alert(result.message);

    window.location.href = "dashboard.html";

} else {

    alert(result.message);

}

});