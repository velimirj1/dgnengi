import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixImportsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Regex to match import statements with relative paths missing .js
    const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:\*\s+as\s+\w+)|(?:\w+))\s+from\s+['"](\.[^'"]+)(?<!\.js)['"]/g;
    const importDefaultRegex = /import\s+['"](\.[^'"]+)(?<!\.js)['"]/g;
    
    // Fix regular imports
    content = content.replace(importRegex, (match, importPath) => {
        modified = true;
        return match.replace(importPath, importPath + '.js');
    });
    
    // Fix side-effect imports (import './file')
    content = content.replace(importDefaultRegex, (match, importPath) => {
        modified = true;
        return match.replace(importPath, importPath + '.js');
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed imports in: ${filePath}`);
        return true;
    }
    return false;
}

function processDirectory(dirPath) {
    let totalFixed = 0;
    
    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                walkDir(fullPath);
            } else if (stat.isFile() && file.endsWith('.js')) {
                if (fixImportsInFile(fullPath)) {
                    totalFixed++;
                }
            }
        }
    }
    
    walkDir(dirPath);
    return totalFixed;
}

// Process nengi library
console.log('Fixing imports in nengi library...');
const nengiFixed = processDirectory(path.join(__dirname, 'nengi'));
console.log(`\nFixed ${nengiFixed} files in nengi library`);

// Process nengi-2d-csp (in case we missed any)
console.log('\nFixing imports in nengi-2d-csp...');
const cspFixed = processDirectory(path.join(__dirname, 'nengi-2d-csp'));
console.log(`\nFixed ${cspFixed} files in nengi-2d-csp`);

console.log('\nTotal files fixed:', nengiFixed + cspFixed);