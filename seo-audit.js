// seo-audit.js
// Usage: node seo-audit.js
// Requirements: node (14+). Installs: npm i glob chalk

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app'); // adjust if your app dir different
const ENV_FILE = path.join(ROOT, '.env.local');

const files = glob.sync('**/app/**/page.*(ts|tsx|js|jsx)', { nocase: true, nodir: true });
const report = [];

function readFileSafe(fp){
  try { return fs.readFileSync(fp, 'utf8'); } catch(e){ return null; }
}

function checkMeta(content, filePath){
  const checks = {
    titleTag: /<title>|title:\s*['"`]/i.test(content),
    metaDescription: /name=["']description["']|description:\s*['"`]/i.test(content),
    canonicalLink: /rel=["']canonical["']|canonical:\s*['"`]/i.test(content),
    ogTitle: /property=["']og:title["']|openGraph:\s*{[^}]*title:/is.test(content),
    ogImage: /property=["']og:image["']|openGraph:\s*{[^}]*image:/is.test(content),
    twitterCard: /name=["']twitter:card["']|twitter:\s*{[^}]*card:/is.test(content),
    jsonLD: /<script[^>]*type=["']application\/ld\+json["']|application\/ld\+json/i.test(content),
    generateMetadata: /export\s+function\s+generateMetadata\s*\(/i.test(content),
  };
  return checks;
}

for(const f of files){
  const content = readFileSafe(f);
  if(!content) continue;
  const c = checkMeta(content, f);
  report.push({ file: f, checks: c });
}

// .env check
let envStatus = { exists: false, origin: null, ok: false };
const envContent = readFileSafe(ENV_FILE);
if(envContent){
  envStatus.exists = true;
  const m = envContent.match(/NEXT_PUBLIC_SITE_ORIGIN\s*=\s*(.*)/);
  if(m) {
    envStatus.origin = m[1].replace(/['"]/g,'').trim();
    envStatus.ok = envStatus.origin === 'https://bookyourtravell.com';
  }
}

// print report
console.log(chalk.bold('\nSEO Audit Report — project:'), ROOT, '\n');
for(const r of report){
  const miss = Object.entries(r.checks).filter(([,v]) => !v).map(([k])=>k);
  if(miss.length === 0){
    console.log(chalk.green('✓'), r.file);
  } else {
    console.log(chalk.yellow('!'), r.file);
    miss.forEach(m => console.log('   - missing:', m));
  }
}
console.log('\n.env.local check:', envStatus);
console.log('\nSummary:');
const total = report.length;
const ok = report.filter(r => Object.values(r.checks).every(Boolean)).length;
console.log(`  Pages scanned: ${total}`);
console.log(chalk.green(`  Fully OK: ${ok}`), chalk.yellow(`  Need fixes: ${total - ok}`));
console.log('\nNext steps: send me the report output (or paste here) and मैं specific fixes/PR-ready code दूँगा/दूंगी।\n');
