const fs = require('fs');

const html = fs.readFileSync('c:/Users/USER/Downloads/stitch_event_ticketing_platform (1)/combined_ui/404_page_not_found_eventpulse.html', 'utf8');
const match = html.match(/tailwind\.config\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);

if (match) {
    let configStr = match[1];
    // Evaluate it safely
    let config = eval(`(${configStr})`);
    
    let css = `@import "tailwindcss";\n\n@theme {\n`;
    
    if (config.theme && config.theme.extend) {
        let extend = config.theme.extend;
        
        if (extend.colors) {
            for (let [k, v] of Object.entries(extend.colors)) {
                css += `  --color-${k}: ${v};\n`;
            }
        }
        
        if (extend.spacing) {
            for (let [k, v] of Object.entries(extend.spacing)) {
                css += `  --spacing-${k}: ${v};\n`;
            }
        }
        
        if (extend.fontFamily) {
            for (let [k, v] of Object.entries(extend.fontFamily)) {
                css += `  --font-${k}: "${v[0]}", sans-serif;\n`;
            }
        }
        
        if (extend.fontSize) {
            for (let [k, v] of Object.entries(extend.fontSize)) {
                css += `  --text-${k}: ${v[0]};\n`;
                if (v[1] && v[1].lineHeight) {
                    css += `  --text-${k}--line-height: ${v[1].lineHeight};\n`;
                }
                if (v[1] && v[1].fontWeight) {
                    css += `  --text-${k}--font-weight: ${v[1].fontWeight};\n`;
                }
                if (v[1] && v[1].letterSpacing) {
                    css += `  --text-${k}--letter-spacing: ${v[1].letterSpacing};\n`;
                }
            }
        }
        
        if (extend.borderRadius) {
            for (let [k, v] of Object.entries(extend.borderRadius)) {
                if (k === 'DEFAULT') {
                    css += `  --radius: ${v};\n`;
                } else {
                    css += `  --radius-${k}: ${v};\n`;
                }
            }
        }
    }
    
    css += `}\n\n`;
    css += `body { font-family: 'Inter', sans-serif; }\n`;
    css += `.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }\n`;
    
    fs.writeFileSync('c:/Users/USER/Downloads/stitch_event_ticketing_platform (1)/frontend/src/index.css', css);
    console.log("index.css generated successfully.");
} else {
    console.log("Could not find tailwind config");
}
