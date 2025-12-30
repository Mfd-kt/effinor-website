const fs = require('fs');
const path = require('path');

// Mapping des classes personnalisées vers les valeurs hex
const replacements = [
  // Couleurs emerald
  { from: /bg-effinor-emerald/g, to: 'bg-[#10B981]' },
  { from: /text-effinor-emerald/g, to: 'text-[#10B981]' },
  { from: /border-effinor-emerald/g, to: 'border-[#10B981]' },
  { from: /ring-effinor-emerald/g, to: 'ring-[#10B981]' },
  { from: /bg-effinor-emerald-hover/g, to: 'bg-[#059669]' },
  { from: /hover:bg-effinor-emerald-hover/g, to: 'hover:bg-[#059669]' },
  
  // Couleurs gray
  { from: /bg-effinor-gray-light/g, to: 'bg-[#F9FAFB]' },
  { from: /bg-effinor-gray-medium/g, to: 'bg-[#F3F4F6]' },
  { from: /bg-effinor-gray-text/g, to: 'bg-[#4B5563]' },
  { from: /bg-effinor-gray-dark/g, to: 'bg-[#111827]' },
  { from: /text-effinor-gray-light/g, to: 'text-[#F9FAFB]' },
  { from: /text-effinor-gray-medium/g, to: 'text-[#F3F4F6]' },
  { from: /text-effinor-gray-text/g, to: 'text-[#4B5563]' },
  { from: /text-effinor-gray-dark/g, to: 'text-[#111827]' },
  { from: /border-effinor-gray-light/g, to: 'border-[#F9FAFB]' },
  { from: /border-effinor-gray-medium/g, to: 'border-[#F3F4F6]' },
  { from: /border-effinor-gray-text/g, to: 'border-[#4B5563]' },
  { from: /border-effinor-gray-dark/g, to: 'border-[#111827]' },
  
  // Couleurs blue
  { from: /bg-effinor-blue-dark/g, to: 'bg-[#0F172A]' },
  { from: /bg-effinor-blue-slate/g, to: 'bg-[#1E293B]' },
  { from: /bg-effinor-blue-steel/g, to: 'bg-[#334155]' },
  { from: /text-effinor-blue-dark/g, to: 'text-[#0F172A]' },
  { from: /text-effinor-blue-slate/g, to: 'text-[#1E293B]' },
  { from: /text-effinor-blue-steel/g, to: 'text-[#334155]' },
  { from: /border-effinor-blue-dark/g, to: 'border-[#0F172A]' },
  { from: /border-effinor-blue-slate/g, to: 'border-[#1E293B]' },
  { from: /border-effinor-blue-steel/g, to: 'border-[#334155]' },
  
  // Couleurs amber
  { from: /bg-effinor-amber/g, to: 'bg-[#F59E0B]' },
  { from: /bg-effinor-amber-light/g, to: 'bg-[#FBBF24]' },
  { from: /text-effinor-amber/g, to: 'text-[#F59E0B]' },
  { from: /text-effinor-amber-light/g, to: 'text-[#FBBF24]' },
  
  // Effinor shadow
  { from: /effinor-shadow/g, to: 'shadow-[0_10px_40px_rgba(15,23,42,0.1)]' },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      count += processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (processFile(filePath)) {
        count++;
      }
    }
  });
  
  return count;
}

// Traiter les dossiers spécifiques
const directories = [
  'components/admin',
  'app/admin',
  'components/ui',
];

let totalFixed = 0;
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`\nProcessing ${dir}...`);
    totalFixed += processDirectory(dir);
  }
});

console.log(`\n✅ Total files fixed: ${totalFixed}`);

