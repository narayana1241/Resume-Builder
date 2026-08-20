var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");


// =============================
// Session Check
// =============================

function checkLogin() {
    const page = window.location.pathname.split("/").pop().toLowerCase();
    if (page === "login.html" || page === "register.html" || page === "" || page === "index.html") {
        return;
    }

    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
    }
}

// =============================
// Load Sidebar
// =============================

async function loadSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    try {

        const response = await fetch("sidebar.html");

        if (!response.ok) {

            throw new Error("Unable to load sidebar.");

        }

        sidebar.innerHTML = await response.text();

        setActiveMenu();

        await loadUser();

    }
    catch (err) {

        console.error(err);

    }

}

// =============================
// Active Menu
// =============================

function setActiveMenu() {

    const page = document.body.dataset.page;

    document.querySelectorAll("#sidebar li").forEach(li => {

        li.classList.remove("active");

    });

    const active = document.querySelector(
        `#sidebar li[data-page="${page}"]`
    );

    if (active) {

        active.classList.add("active");

    }

}

// =============================
// Logged-in User
// =============================

async function loadUser() {

    // 1. Initial render from cache to prevent blank flickering
    const cachedName = localStorage.getItem("full_name");

    const profile = document.querySelector(".profile strong");

    if (profile && cachedName) {

        profile.textContent = cachedName + " 👋";

    }

    const sidebarProfileName = document.querySelector(".profile-section strong");

    if (sidebarProfileName && cachedName) {

        sidebarProfileName.textContent = cachedName;

    }

    // 2. Fetch fresh details using database function API
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    try {

        const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`);

        const result = await response.json();

        if (result.success && result.data) {

            const user = result.data;

            if (profile && user.name) {

                profile.textContent = user.name + " 👋";

            }

            if (sidebarProfileName && user.name) {

                sidebarProfileName.textContent = user.name;

            }

            const sidebarProfileEmail = document.querySelector(".profile-section span");

            if (sidebarProfileEmail && user.email) {

                sidebarProfileEmail.textContent = user.email;

            }

            // Sync cache
            localStorage.setItem("full_name", user.name);

        }

    }

    catch (err) {

        console.error("Error fetching user profile:", err);

    }

}

// =============================
// Navigation
// =============================

function goDashboard() {

    window.location.href = "dashboard.html";

}

function goCreateResume() {

    window.location.href = "create_resume.html";

}

function goMyResumes() {

    window.location.href = "my_resumes.html";

}

function goProfile() {

    window.location.href = "profile.html";

}

// =============================
// Logout
// =============================

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.clear();

        window.location.href = "login.html";

    }

}

// =============================
// Resume Helpers
// =============================

function getResumeId() {

    return localStorage.getItem("resume_id");

}

function getUserId() {

    return localStorage.getItem("user_id");

}

// =============================
// Page Load
// =============================

window.addEventListener("DOMContentLoaded", async () => {

    checkLogin();

    await loadSidebar();

});