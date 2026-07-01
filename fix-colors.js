const fs = require('fs');
const path = require('path');

const colorMap = {
    'bg-\\[#1A1A1A\\]': 'bg-background',
    'bg-\\[#0a0d11\\]': 'bg-background',
    'bg-\\[#080b0f\\]': 'bg-background',
    'bg-\\[#242424\\]': 'bg-card',
    'text-\\[#E6D2B5\\]': 'text-foreground',
    'text-\\[#c0cfe0\\]': 'text-foreground',
    'text-\\[#C8A97E\\]': 'text-primary',
    'text-\\[#8a9ab5\\]': 'text-primary',
    'border-\\[#C8A97E\\]': 'border-primary',
    'border-\\[#8a9ab5\\]': 'border-primary',
    'bg-\\[#C8A97E\\]': 'bg-primary',
    'bg-\\[#8a9ab5\\]': 'bg-primary'
};

const files = [
    'src/app/products/WatchCatalog.tsx',
    'src/components/features/home/rubro/WatchHome.tsx',
    'src/components/shared/rubro/WatchAbout.tsx',
    'src/components/footer/WatchFooter.tsx',
    'src/components/nav/WatchNavbar.tsx',
    'src/components/shared/rubro/WatchContact.tsx'
];

files.forEach(file => {
    const fullPath = path.join('/home/ale/Documentos/PROYECTOS/ECOMMERCE- L/Saas-client', file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    Object.entries(colorMap).forEach(([hardcoded, variable]) => {
        const regex = new RegExp(hardcoded + '(\\/\\d+)?', 'g');
        content = content.replace(regex, (match, opacity) => {
            return opacity ? variable + opacity : variable;
        });
    });

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
});
