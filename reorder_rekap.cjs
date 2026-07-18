const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

// We will reconstruct the return block.
// Let's first extract the "Form Content" and "Table Content".

const returnRegex = /return \(\s*<div className="space-y-6">([\s\S]*?){\/\* Print Modal \*\/}/;
const match = code.match(returnRegex);
if (!match) {
    console.log("Could not find return block");
    process.exit(1);
}

const innerContent = match[1];
// The current structure:
// 1. {/* List Rekap Table */} ... 
// 2. {showForm && ( ... {/* Header Info */} ... <div className="grid ..."> ... </div></div> )}

const tableStart = innerContent.indexOf('{/* List Rekap Table */}');
const formStart = innerContent.indexOf('{showForm && (');

const tableContentRaw = innerContent.substring(tableStart, formStart);
const formContentRaw = innerContent.substring(formStart);

// We need to extract the Header Info from formContentRaw
const headerStart = formContentRaw.indexOf('{/* Header Info */}');
const gridStart = formContentRaw.indexOf('<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">');

const headerContent = formContentRaw.substring(headerStart, gridStart);
const formGridContent = formContentRaw.substring(gridStart, formContentRaw.lastIndexOf('</div>\n      )}'));

// In table content, we should remove the button section that toggles showForm
// It's inside:
// <div className="flex flex-col sm:flex-row items-center gap-3">
//   <div className="relative w-full sm:w-64"> ... </div>
//   <button ...> {showForm ? ...} </button>
// </div>

let newTableContent = tableContentRaw.replace(/<button[\s\S]*?Tutup Form' : 'Buat Data Rekap'}[\s\S]*?<\/button>/, '');
// Clean up the empty space where the button was
newTableContent = newTableContent.replace(/DAFTAR REKAP BELANJA/, 'DAFTAR REKAP BELANJA');

// Now we build the new Header Info
const newHeader = `      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
            <List size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Form Data Rekap Belanja</h4>
            <p className="text-xs text-slate-400">Pilih Pesanan yang akan direkapitulasi</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-400">
            ID Rekap Aktif:
          </span>
          <span className="px-3 py-1 bg-[#0F172A] border border-slate-700 rounded-lg font-bold text-indigo-400 text-xs font-mono">
            {activeRekapId || 'KOSONG'}
          </span>
          <span className={\`text-xs px-2.5 py-1 rounded-full font-medium \${isSaved ? 'bg-green-950 text-green-300 border border-green-900/50' : 'bg-amber-950 text-amber-300 border border-amber-900/50'}\`}>
            {isSaved ? 'Terdaftar di DB' : 'Draf Baru'}
          </span>

          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              title="Tampilkan Form Isian"
            >
              Tampilkan Form
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              title="Sembunyikan Form Isian"
            >
              Sembunyikan Form
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onSelectRekap('');
              setShowForm(true);
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
            title="Buat Draft Baru"
          >
            <Plus size={14} />
            Buat Data Rekap
          </button>
        </div>
      </div>`;

const newInnerContent = `
${newHeader}

      {showForm && (
${formGridContent}
      )}

${newTableContent}
`;

code = code.replace(innerContent, newInnerContent);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Restructured layout successfully");
