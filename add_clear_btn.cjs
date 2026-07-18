const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const regex = /\{\/\* Toolbar Buttons \*\/}\s*<div className="flex flex-wrap gap-2 border-t border-slate-700\/50 pt-3">\s*<\/div>/;

const toInsert = `{/* Toolbar Buttons */}
            <div className="flex flex-wrap gap-2 border-t border-slate-700/50 pt-3">
              <button onClick={handleClear} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold shadow transition flex items-center gap-1">
                <RotateCcw size={14} /> Clear Form
              </button>
            </div>`;

code = code.replace(regex, toInsert);
fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Added Clear Form button back");
