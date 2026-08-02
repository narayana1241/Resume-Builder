class TemplateLoader {
    static async load(templateFolder, containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Determine base path for the template
        const basePath = `templates/${templateFolder}`;

        // 1. Fetch template HTML
        const htmlResponse = await fetch(`${basePath}/template.html`);
        if (!htmlResponse.ok) {
            throw new Error(`Failed to load template HTML from ${basePath}/template.html`);
        }
        const htmlText = await htmlResponse.text();

        // 2. Manage stylesheet injection (remove old template-css and inject new link)
        const oldLink = document.getElementById("template-css");
        if (oldLink) {
            oldLink.remove();
        }

        const cssLink = document.createElement("link");
        cssLink.id = "template-css";
        cssLink.rel = "stylesheet";
        cssLink.href = `${basePath}/template.css`;
        document.head.appendChild(cssLink);

        // Wait briefly for CSS to apply (prevents flash of unstyled content)
        await new Promise((resolve) => {
            cssLink.onload = resolve;
            cssLink.onerror = resolve;
        });

        // 3. Render HTML using the data-driven TemplateEngine
        const renderedHtml = TemplateEngine.render(htmlText, data);
        container.innerHTML = renderedHtml;
    }
}

// Export for browser / modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateLoader;
} else {
    window.TemplateLoader = TemplateLoader;
}
