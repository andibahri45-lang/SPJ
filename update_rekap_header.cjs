const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

// Update lucide-react imports to add FileSpreadsheet, Download, Upload if not there
if (!code.includes('Upload')) {
  code = code.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, "import { $1, Upload } from 'lucide-react';");
}
if (!code.includes('FileSpreadsheet')) {
  code = code.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, "import { $1, FileSpreadsheet } from 'lucide-react';");
}
if (!code.includes('Download')) {
  code = code.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, "import { $1, Download } from 'lucide-react';");
}

// Add the dummy handlers
const handlers = `
  const handleExportExcel = () => {
    alert('Fitur Export Excel untuk Rekap Belanja akan segera hadir.');
  };
  const handleDownloadTemplate = () => {
    alert('Fitur Download Template untuk Rekap Belanja akan segera hadir.');
  };
  const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    alert('Fitur Upload Excel untuk Rekap Belanja akan segera hadir.');
    if (e.target) e.target.value = '';
  };
`;

// Insert handlers before 'return ('
code = code.replace(/return \(/, handlers + '\n  return (');

const oldTableHeader = /<div className="p-4 border-b border-slate-700\/80 bg-slate-800\/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">([\s\S]*?)<\/div>\s*<\/div>\s*<div className="overflow-x-auto">/;

const newTableHeader = `<div className="p-4 border-b border-slate-700/80 bg-slate-900/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                DAFTAR REKAP BELANJA TERDAFTAR
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Total: {rekapBelanjaList.length} data tersimpan dalam database local storage</p>
            </div>
            
            {/* Search box */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchTableQuery}
                onChange={e => setSearchTableQuery(e.target.value)}
                placeholder="Cari ID, Uraian, Rekanan..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-[11px] text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-[#475569] hover:bg-[#334155] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Ekspor data saat ini ke Excel/CSV"
            >
              <FileSpreadsheet size={13} />
              Export Data Excel
            </button>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Unduh template Excel kosong untuk pengisian"
            >
              <Download size={13} />
              Download Template
            </button>

            <label className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95">
              <Upload size={13} />
              Upload Excel
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleUploadCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="overflow-x-auto">`;

code = code.replace(oldTableHeader, newTableHeader);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Updated table header for consistency");
