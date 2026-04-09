const fs = require('fs');
const path = require('path');

function replaceLinks(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceLinks(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Change all dead hrefs to point to dashboard, preventing jumps to #
            let newContent = content.replace(/href="#"/g, 'href="/dashboard"');
            if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Replaced links in ${fullPath}`);
            }
        }
    }
}

replaceLinks('app');
console.log('Link pass complete!');
