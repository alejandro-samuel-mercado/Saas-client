const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.startsWith('Pet') && file.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // 1. bg-white in cards/containers to glassmorphism
            content = content.replace(/bg-white border border-\[\#EDE0CF\]/g, "bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg");
            
            // 2. Simple shadows to premium colored shadows
            content = content.replace(/shadow-sm/g, "shadow-md");
            content = content.replace(/shadow-md/g, "shadow-lg");
            content = content.replace(/hover:shadow-lg/g, "hover:shadow-[0_20px_50px_rgba(139,94,60,0.15)] hover:-translate-y-1 transition-all duration-300");

            // 3. Make the main backgrounds consistent if they use bg-[#FAF6F0] instead of min-h-screen
            content = content.replace(/bg-\[\#FAF6F0\]/g, "bg-[#EDE0CF]");

            // 4. Update specific solid bg-[#EDE0CF] inside the body to white/60
            // Be careful not to replace the main background we just set.
            // content = content.replace(/bg-\[\#EDE0CF\]/g, "bg-white/60 backdrop-blur-sm"); // Too dangerous globally

            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, 'src', 'components'));
console.log('Premium styles applied.');
