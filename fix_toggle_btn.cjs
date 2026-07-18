const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const regex = /\{!showForm \? \([\s\S]*?Buat Data Rekap\s*<\/button>/;

const newButton = `          <button
            type="button"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
              } else {
                onSelectRekap('');
                setShowForm(true);
              }
            }}
            className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm \${showForm ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}\`}
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Tutup Form' : 'Buat Data Rekap'}
          </button>`;

code = code.replace(regex, newButton);
fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Button fixed");
