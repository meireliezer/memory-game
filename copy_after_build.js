var copyDir = require("copy-dir");
var fs = require('fs');

const distDir = `${__dirname}\\dist\\memory-game\\`;
const targetDir = `${__dirname}\\..\\memory-game-dist\\`;
console.log(`copy from: ${distDir}  to: ${targetDir}`);

// update html filer
var data = fs.readFileSync(`${distDir}\\index.html`, 'utf-8');
// Replace type="module"  type="text/javascript"
var newValue = data.replace(/"module"/g, '"text/javascript"');
console.log(newValue);  
// Replace src="filenmae"  src=".//memory-dame-dist//"
var newValue = newValue.replace(/src="/g, 'src="./memory-game-dist/');
fs.writeFileSync(`${distDir}\\index.html`, newValue, 'utf-8');  
console.log('readFileSync complete');
copyDir.sync(distDir, targetDir);
console.log('done');





