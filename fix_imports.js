const fs = require('fs');
const filesToFix = [
  'app/(main)/dashboard/page.tsx',
  'app/(main)/diagnostic-lab/page.tsx',
  'app/(main)/medicines/page.tsx',
  'app/(main)/shop/page.tsx',
  'app/(main)/weather-shops/page.tsx'
];

filesToFix.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('<ProfileDropdown />') && !content.includes('import ProfileDropdown')) {
      content = `import ProfileDropdown from "@/components/ProfileDropdown";\n` + content;
      fs.writeFileSync(f, content);
      console.log(`Fixed import in ${f}`);
    }
  }
});
