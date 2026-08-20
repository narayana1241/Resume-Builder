class TemplateEngine {
    static render(html, data) {
        if (!html || typeof html !== 'string') return "";
        if (!data || typeof data !== 'object') data = {};

        const safeData = {
            personal_details: Array.isArray(data.personal_details) && data.personal_details.length > 0 ? data.personal_details : [(data.personal || {})],
            education: Array.isArray(data.education) ? data.education : [],
            experience: Array.isArray(data.experience) ? data.experience : [],
            skills: Array.isArray(data.skills) ? data.skills : [],
            projects: Array.isArray(data.projects) ? data.projects : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            languages: Array.isArray(data.languages) ? data.languages : [],
            custom_sections: Array.isArray(data.custom_sections) ? data.custom_sections : [],
            ...data
        };

        // 1. Flatten personal details and helper fields
        const flatData = { ...safeData };
        
        if (safeData.personal_details && safeData.personal_details.length > 0) {
            Object.assign(flatData, safeData.personal_details[0]);
        }
        
        // Setup helper fields
        flatData.full_name = `${flatData.first_name || ""} ${flatData.last_name || ""}`.trim();
        flatData.designation = safeData.experience && safeData.experience.length > 0 ? safeData.experience[0].job_title : "";
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

        // 5. Render custom sections dynamically
        if (flatData.custom_sections && Array.isArray(flatData.custom_sections) && flatData.custom_sections.length > 0) {
            const customSectionsHtml = flatData.custom_sections.map(cs => {
                const title = cs.section_title || "Additional Section";
                const items = Array.isArray(cs.section_data) ? cs.section_data : [cs.section_data];
                const itemsHtml = items.map(it => `<div>• ${typeof it === 'object' ? (it.title || it.name || JSON.stringify(it)) : it}</div>`).join("");
                return `
                    <section class="resume-sec custom-sec" style="margin-top:12px;">
                        <h3 class="sec-title" style="font-weight:700;"><i class="fa-solid fa-folder-open"></i> ${title}</h3>
                        <div class="cards-list" style="margin-top:6px;">
                            <div class="item-card">
                                <div class="desc-p" style="font-size:13px; line-height:1.5;">${itemsHtml}</div>
                            </div>
                        </div>
                    </section>
                `;
            }).join("\n");

            // Inject custom sections cleanly inside the root container before final closing </div>
            html = html.replace(/(\s*<\/div>\s*)$/, `\n${customSectionsHtml}\n$1`);
        }

        // 6. Clean up any remaining unreplaced {{...}} tags
        html = html.replace(/\{\{[^}]+\}\}/g, "");

        return html;
    }
}

// Export for ES modules / browser global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
} else {
    window.TemplateEngine = TemplateEngine;
}
