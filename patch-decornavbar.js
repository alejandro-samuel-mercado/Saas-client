const fs = require('fs');
const file = 'src/components/nav/DecorNavbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add categoriesTree state
content = content.replace(
  'const isHomePage = pathname === "/";',
  'const isHomePage = pathname === "/";\n    const [categoriesTree, setCategoriesTree] = useState<any[]>([]);\n    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);\n'
);

// Add useEffect to fetch categories
content = content.replace(
  'useEffect(() => {',
  'import { productService } from "@/services/products";\n\n    useEffect(() => {\n        productService.getCategoriesTree().then(setCategoriesTree);\n    }, []);\n\n    useEffect(() => {'
);

// Add imports
content = content.replace(
  'import { usePathname } from "next/navigation";',
  'import { usePathname } from "next/navigation";\nimport { AnimatePresence, motion } from "framer-motion";'
);

fs.writeFileSync(file, content);
