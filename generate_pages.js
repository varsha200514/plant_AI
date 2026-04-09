const fs = require('fs');
const path = require('path');

const files = [
  { file: 'Dashboard.html', route: '(main)/dashboard', name: 'Dashboard' },
  { file: 'Diagnostic_Lab.html', route: '(main)/diagnostic-lab', name: 'DiagnosticLab' },
  { file: 'Login_Page.html', route: '', name: 'Login', exact: true },
  { file: 'Product_Settings.html', route: '(main)/settings', name: 'Settings' },
  { file: 'Weather_and_Shops.html', route: '(main)/weather-shops', name: 'WeatherShops' },
  { file: 'Plant_Library.html', route: '(main)/plant-library', name: 'PlantLibrary' },
  { file: 'Medicines.html', route: '(main)/medicines', name: 'Medicines' }
];

function htmlToJsx(html) {
  // basic replacements
  let jsx = html.replace(/class="/g, 'className="');
  jsx = jsx.replace(/for="/g, 'htmlFor="');
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
  
  // self close img and input
  jsx = jsx.replace(/<img(.*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<img${p1}/>`;
  });
  jsx = jsx.replace(/<input(.*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<input${p1}/>`;
  });
  jsx = jsx.replace(/<hr(.*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<hr${p1}/>`;
  });
  jsx = jsx.replace(/<br(.*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<br${p1}/>`;
  });
  jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
    let styles = {};
    styleString.split(';').forEach(style => {
      if (!style.trim()) return;
      let [key, value] = style.split(':');
      if (key && value) {
        key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styles[key] = value.trim();
      }
    });
    return `style={${JSON.stringify(styles)}}`;
  });

  return jsx;
}

files.forEach(({ file, route, name, exact }) => {
  const filePath = path.join('.docs', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract main or body content
  let bodyContent = '';
  if (exact) {
      // For login, we will extract the whole main container or anything inside body.
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
          bodyContent = bodyMatch[1];
      }
  } else {
      // extract only <main ...> ... </main> to strip sidebars
      const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
      if (mainMatch) {
          // ensure the <main> tag itself is included 
          const fullMain = content.match(/<main[^>]*>[\s\S]*?<\/main>/i);
          bodyContent = fullMain[0];
          
          // remove lg:ml-64 because it's defined in (main)/layout.tsx already!
          bodyContent = bodyContent.replace('lg:ml-64', '');
      } else {
          bodyContent = content; // fallback
      }
  }
  
  let jsx = htmlToJsx(bodyContent);
  
  let routePath = path.join('app', route);
  if (!fs.existsSync(routePath)) {
      fs.mkdirSync(routePath, { recursive: true });
  }

  const componentTemplate = `
import React from 'react';

export default function ${name}() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;

  fs.writeFileSync(path.join(routePath, 'page.tsx'), componentTemplate);
  console.log(`Generated ${routePath}/page.tsx`);
});
