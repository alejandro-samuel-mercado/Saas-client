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

            // 1. Remove all bg-white
            content = content.replace(/bg-white\/\d+/g, "bg-[#D4B896]/50 backdrop-blur-xl");
            content = content.replace(/bg-white/g, "bg-[#D4B896]/40 backdrop-blur-xl");
            content = content.replace(/bg-orange-50/g, "bg-[#EDE0CF]");
            content = content.replace(/bg-orange-100/g, "bg-[#D4B896]/60");
            
            // 2. Remove any text-white? Wait, text-white is fine on dark backgrounds!
            // The user said "fondos blancos" -> bg-white
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, 'src', 'components'));
console.log('No more white backgrounds.');
