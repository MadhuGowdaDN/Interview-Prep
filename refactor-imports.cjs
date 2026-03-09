const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            // Exclude common/mui to avoid circular imports
            if (!file.includes(path.join('src', 'common', 'mui')) && !file.includes(path.join('src', 'common', 'icons'))) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Replace @mui/material with @common/mui
    content = content.replace(/from\s+['"]@mui\/material['"]/g, "from '@common/mui'");

    // 2. Replace @mui/icons-material with @icons and fix the 'as' aliasing
    // E.g., import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
    // -> import { AddIcon, EditIcon } from '@icons';

    // First, find lines matching import { ... } from '@mui/icons-material'
    const iconImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@mui\/icons-material['"]/g;
    content = content.replace(iconImportRegex, (match, p1) => {
        // p1 is "Add as AddIcon, Edit as EditIcon"
        const parts = p1.split(',').map(p => p.trim()).filter(Boolean);
        const newParts = parts.map(part => {
            const matchAs = part.match(/(\w+)\s+as\s+(\w+)/);
            if (matchAs) {
                return matchAs[2]; // keep the alias (e.g., AddIcon)
            }
            // If there's no 'as', does it end with Icon? If not, maybe append Icon?
            // Actually, in our centralized index we exported them all with 'Icon' suffix.
            if (!part.endsWith('Icon')) {
                return part + 'Icon'; // e.g. Search -> SearchIcon
            }
            return part;
        });
        return `import { ${newParts.join(', ')} } from '@icons'`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${path.relative(__dirname, file)}`);
    }
});

console.log("Refactoring complete.");
