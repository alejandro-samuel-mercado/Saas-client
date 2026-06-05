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

            content = content.replace(/#FAF6F0/gi, "#EDE0CF");
            content = content.replace(/to-white/g, "to-[#D4B896]/40");
            content = content.replace(/from-white/g, "from-[#D4B896]/40");
            content = content.replace(/via-white/g, "via-[#D4B896]/40");
            
            // Fix double backdrops
            content = content.replace(/backdrop-blur-xl backdrop-blur-xl/g, "backdrop-blur-xl");
            content = content.replace(/backdrop-blur-xl backdrop-blur-2xl/g, "backdrop-blur-2xl");

            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, 'src', 'components'));
console.log('Whites purged.');
