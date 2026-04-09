const fs = require('fs');
const path = require('path');

const targetDirs = ['app'];

const imgPattern = /<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary\/20">\s*<img alt="Botanist Profile"[^>]+>\s*<\/div>/g;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  if (filePath.endsWith('layout.tsx')) return;

  // 1. Inject ProfileDropdown Replacement
  if (content.match(imgPattern)) {
    content = content.replace(imgPattern, `<ProfileDropdown />`);
    // Ensure ProfileDropdown is imported
    if (!content.includes('ProfileDropdown')) {
      content = `import ProfileDropdown from "@/components/ProfileDropdown";\n` + content;
    }
  }

  // 2. Inject React Hot Toast for all dead buttons
  // Look for <button ...>Text</button>
  // Exclude buttons that already have onClick, type="submit", or are inside ProfileDropdown.tsx 
  if (!filePath.includes('ProfileDropdown.tsx') && !filePath.includes('Sidebar.tsx')) {
    // Inject import toast
    if (!content.includes('import toast from "react-hot-toast"')) {
        // Find if we need it
        if (content.match(/<button(?![^>]*onClick)[^>]*>/g)) {
             content = `import toast from "react-hot-toast";\n` + content;
        }
    }

    content = content.replace(/<button(?![^>]*onClick)(?![^>]*type="submit")([^>]*)>(.*?)<\/button>/gs, (match, attrs, innerText) => {
        // Don't modify if it's already got onClick
        if (attrs.includes('onClick')) return match;
        
        let cleanText = innerText;
        const matchT = innerText.match(/t\("([^"]+)"\)/);
        if (matchT) {
            cleanText = matchT[1];
        } else {
            cleanText = cleanText.replace(/<[^>]+>/g, '').trim() || "Action Executed"; 
            cleanText = cleanText.replace(/"/g, '\\"').replace(/\n/, ' ');
        }
        return `<button onClick={() => toast.success("${cleanText}")}${attrs}>${innerText}</button>`;
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated interactions: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(walkDir);
console.log("Interaction Injection Pass Complete!");
