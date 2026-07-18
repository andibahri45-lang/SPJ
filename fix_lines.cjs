const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const regex = /<div className="bg-\[#1E293B\] border border-slate-700\/80 rounded-xl p-4 shadow-md space-y-4">\s*<\/div>\s*\{\/\* Toolbar Buttons \*\/\}\s*<div className="flex flex-wrap gap-2 border-t border-slate-700\/50 pt-3">\s*<button onClick=\{handleClear\} className="px-3 py-1\.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold shadow transition flex items-center gap-1">\s*<RotateCcw size=\{14\} \/> Clear Form\s*<\/button>\s*<\/div>\s*<\/div>/;

code = code.replace(regex, "");

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Fixed lines 185-195");
