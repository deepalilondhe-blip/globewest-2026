const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const desktopDir = path.join(baseDir, 'screenshots', 'defects', 'desktop');
const mobileDir = path.join(baseDir, 'screenshots', 'defects', 'mobile');
const targetDir = path.join(baseDir, 'DEFECT_SCREENSHOTS');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const desktopFiles = fs.readdirSync(desktopDir).filter(f => f.endsWith('.png'));
desktopFiles.forEach(f => {
  fs.copyFileSync(path.join(desktopDir, f), path.join(targetDir, f));
  console.log(`Copied ${f} to DEFECT_SCREENSHOTS`);
});

const mobileFiles = fs.readdirSync(mobileDir).filter(f => f.endsWith('.png'));
mobileFiles.forEach(f => {
  fs.copyFileSync(path.join(mobileDir, f), path.join(targetDir, f));
  console.log(`Copied ${f} to DEFECT_SCREENSHOTS`);
});

console.log('\nAll 8 defect screenshots consolidated in:', targetDir);
