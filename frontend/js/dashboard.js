var API_BASE_URL = window.location.port === "5000"
    ? ""
    : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Setup Card Navigation Listeners
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            const h2 = card.querySelector("h2");
            if (!h2) return;
            const title = h2.innerText.trim();

            if (title === "Create Resume") {
                window.location.href = "create_resume.html";
            } else if (title === "Update Resume") {
                window.location.href = "upload_resume.html";
            } else if (title === "My Resumes") {
                window.location.href = "my_resumes.html";
            } else if (title === "Logout") {
                if (typeof logout === "function") {
                    logout();
                } else if (confirm("Are you sure you want to logout?")) {
                    localStorage.clear();
                    window.location.href = "login.html";
                }
            }
        });
    });

    // 2. Fetch Dynamic Stats
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
        // Fetch Resumes Count
        const resResponse = await fetch(`${API_BASE_URL}/api/resume/list/${userId}`);
        const resResult = await resResponse.json();
        if (resResult.success && Array.isArray(resResult.data)) {
            const totalResumesEl = document.querySelector(".stat-card:nth-child(1) .stat-val");
            if (totalResumesEl) {
                totalResumesEl.textContent = resResult.data.length;
            }
        }

        // Fetch Templates Count
        const tplResponse = await fetch(`${API_BASE_URL}/api/templates`);
        const tplResult = await tplResponse.json();
        if (tplResult.success && Array.isArray(tplResult.data)) {
            const totalTemplatesEl = document.querySelector(".stat-card:nth-child(3) .stat-val");
            if (totalTemplatesEl) {
                totalTemplatesEl.textContent = tplResult.data.length;
            }
        }
    } catch (err) {
        console.error("Dashboard Stats Fetch Error:", err);
    }
});