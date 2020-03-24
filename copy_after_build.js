var copyDir = require("copy-dir");
var fs = require('fs');

const distDir = `${__dirname}\\dist\\memory-game\\`;
const targetDir = `${__dirname}\\..\\memory-game-dist\\`;
console.log(`copy from: ${distDir}  to: ${targetDir}`);

// update html filer
var data = fs.readFileSync(`${distDir}\\index.html`, 'utf-8');

// Replace type="module"  type="text/javascript"
var newValue = data.replace(/"module"/g, '"text/javascript"');
// Replace src="filenmae"  src=".//memory-dame-dist//"
newValue = newValue.replace(/src="/g, 'src="./memory-game-dist/');
// Manifest
newValue = newValue.replace("manifest.webmanifest", "./memory-game-dist/manifest.webmanifest");



fs.writeFileSync(`${distDir}\\index.html`, newValue, 'utf-8');  
console.log('readFileSync complete');
console.log(newValue);  
copyDir.sync(distDir, targetDir);
console.log('done');





