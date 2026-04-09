const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components'];
const dictionary = {};

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (filePath.includes('layout.tsx')) return; // skip layouts or we inject into them? wait, we can't inject client hooks into RootLayout easily. Only page.tsx.

  if (!code.includes('export default function')) return;

  let hasChanges = false;
  
  // Extract text nodes
  code = code.replace(/>([^<{}]+)</g, (match, textContent) => {
    let cleanText = textContent.replace(/\s+/g, ' ').trim();
    if (cleanText && /[a-zA-Z]/.test(cleanText)) { // Valid text containing letters
      hasChanges = true;
      dictionary[cleanText] = cleanText;
      
      // Preserve newlines and spacing around the dynamic block
      const startSpace = textContent.match(/^\s*/)[0];
      const endSpace = textContent.match(/\s*$/)[0];
      
      return `>${startSpace}{t("${cleanText}")}${endSpace}<`;
    }
    return match;
  });

  if (hasChanges) {
    // Add "use client" if missing
    if (!code.includes('"use client"')) {
      code = `"use client";\n` + code;
    }
    
    // Inject import
    if (!code.includes('useLanguage')) {
      code = code.replace(/import React(.*?)\n/, `import React$1\nimport { useLanguage } from "@/contexts/LanguageContext";\n`);
      // Fallback if no React import
      if (!code.includes('useLanguage')) {
          code = `import { useLanguage } from "@/contexts/LanguageContext";\n` + code;
      }
    }
    
    // Inject hook inside component
    if (!code.includes('const { t } = useLanguage();')) {
      code = code.replace(/export default function ([A-Za-z0-9_]+)\([^)]*\) {\n/g, (match) => {
        return `${match}  const { t } = useLanguage();\n`;
      });
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Transformed: ${filePath}`);
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

// Generate Dictionaries
const localesDir = path.join('public', 'locales');
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(dictionary, null, 2));

// Generate placeholders for other languages
const otherLangs = ['de', 'es', 'fr', 'it', 'hi'];

otherLangs.forEach(lang => {
    const dictObj = {};
    for (const key in dictionary) {
        dictObj[key] = `[${lang.toUpperCase()}] ${key}`; // Placeholder translation
    }
    fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify(dictObj, null, 2));
});

console.log('Dictionaries generated!');
