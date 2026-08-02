class TemplateEngine {
    static render(html, data) {
        // 1. Flatten personal details and helper fields
        const flatData = { ...data };
        
        if (data.personal_details && data.personal_details.length > 0) {
            Object.assign(flatData, data.personal_details[0]);
        }
        
        // Setup helper fields
        flatData.full_name = `${flatData.first_name || ""} ${flatData.last_name || ""}`.trim();
        flatData.designation = data.experience && data.experience.length > 0 ? data.experience[0].job_title : "";
        flatData.location = [flatData.city, flatData.state, flatData.country].filter(Boolean).join(", ");
        
        // 2. Process conditional blocks: <!-- {{#if key}} --> ... <!-- {{/if}} -->
        const conditionalRegex = /<!--\s*\{\{#if\s+(\w+)\}\}\s*-->([\s\S]*?)<!--\s*\{\{\/if\}\}\s*-->/g;
        html = html.replace(conditionalRegex, (match, key, content) => {
            const val = flatData[key];
            if (!val || (Array.isArray(val) && val.length === 0)) {
                return "";
            }
            return content;
        });

        // 3. Process loop blocks: <!-- {{#arrayKey}} --> ... <!-- {{/arrayKey}} -->
        const loopRegex = /<!--\s*\{\{#(\w+)\}\}\s*-->([\s\S]*?)<!--\s*\{\{\/\1\}\}\s*-->/g;
        html = html.replace(loopRegex, (match, arrayKey, innerTemplate) => {
            const arrayData = flatData[arrayKey];
            if (!arrayData || !Array.isArray(arrayData) || arrayData.length === 0) {
                return ""; // Hides section if empty
            }
            
            return arrayData.map(item => {
                let itemHtml = innerTemplate;
                
                // Add helper conditionals inside loops
                // e.g., experience "Present" check
                const itemKeys = Object.keys(item);
                
                // Replace placeholders
                itemKeys.forEach(key => {
                    const val = item[key] !== null && item[key] !== undefined ? item[key] : "";
                    itemHtml = itemHtml.replaceAll(`{{${key}}}`, val);
                });
                
                // Custom check for experience currently_working
                if (item.currently_working !== undefined) {
                    const presentStr = item.currently_working ? "Present" : (item.end_date || "");
                    itemHtml = itemHtml.replaceAll("{{end_date_or_present}}", presentStr);
                }
                
                return itemHtml;
            }).join("\n");
        });

        // 4. Process flat placeholders: {{placeholder}}
        Object.keys(flatData).forEach(key => {
            const val = flatData[key] !== null && flatData[key] !== undefined ? flatData[key] : "";
            html = html.replaceAll(`{{${key}}}`, val);
        });

        return html;
    }
}

// Export for ES modules / browser global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
} else {
    window.TemplateEngine = TemplateEngine;
}
