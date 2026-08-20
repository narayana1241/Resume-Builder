var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

window.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    // Set page headers
    const cachedName = localStorage.getItem("full_name");
    const usernameEl = document.getElementById("username");
    if (cachedName && usernameEl) {
        usernameEl.textContent = cachedName;
    }
    
    const profNameInput = document.getElementById("prof_name");
    const profEmailInput = document.getElementById("prof_email");
    const profMobileInput = document.getElementById("prof_mobile");

    if (cachedName && profNameInput) {
        profNameInput.value = cachedName;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`);
        const result = await response.json();

        if (result.success && result.data) {
            const user = result.data;
            if (profNameInput && user.name) profNameInput.value = user.name;
            if (profEmailInput && user.email) profEmailInput.value = user.email;
            if (profMobileInput && user.mobile) profMobileInput.value = user.mobile;
            
            if (usernameEl && user.name) usernameEl.textContent = user.name;
            
            // Sync cache
            localStorage.setItem("full_name", user.name);
        }
    } catch (err) {
        console.error("Error loading user profile details:", err);
    }
});
