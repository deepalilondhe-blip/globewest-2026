const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// Unwanted directories to delete
const dirsToDelete = [
  path.join(baseDir, 'comparison'),
  path.join(baseDir, 'screenshots', 'defects'),
  path.join(baseDir, 'screenshots', 'defects_clean'),
  path.join(baseDir, 'screenshots', 'customer_admin'),
  path.join(baseDir, 'screenshots', 'customer_check'),
  path.join(baseDir, 'screenshots', 'customer_registration'),
  path.join(baseDir, 'screenshots', 'au_comparison'),
  path.join(baseDir, 'screenshots', 'au_comparison_loggedin'),
  path.join(baseDir, 'screenshots', 'desktop'),
  path.join(baseDir, 'screenshots', 'desktop_loggedin'),
  path.join(baseDir, 'screenshots', 'mobile'),
  path.join(baseDir, 'with_login')
];

dirsToDelete.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Deleted unwanted folder: ${path.relative(baseDir, dir)}`);
  }
});

// Also remove loose scratch pngs in screenshots
const screenshotsDir = path.join(baseDir, 'screenshots');
if (fs.existsSync(screenshotsDir)) {
  const looseFiles = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
  looseFiles.forEach(f => {
    fs.unlinkSync(path.join(screenshotsDir, f));
    console.log(`Deleted loose screenshot: screenshots/${f}`);
  });
}

console.log('Cleanup finished.');
