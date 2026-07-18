const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const regex = /<div className="flex items-center gap-2">\s*<div className="flex items-center gap-2">/;
code = code.replace(regex, '<div className="flex items-center gap-2">');

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Fixed DataRekapBelanjaForm");
