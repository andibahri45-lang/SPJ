const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const importRegex = /const \[pemilikToko, setPemilikToko\] = useState\(''\);/;
code = code.replace(importRegex, `const [pemilikToko, setPemilikToko] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTableQuery, setSearchTableQuery] = useState('');`);

const returnRegex = /return \(\s*<div className="space-y-6">/;

const wrapper = `return (
    <div className="space-y-6">
      {/* List Rekap Table */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-slate-700/80 bg-slate-800/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
              DAFTAR REKAP BELANJA
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Total: {rekapBelanjaList.length} data tersimpan</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
             <div className="relative w-full sm:w-64">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                 type="text"
                 value={searchTableQuery}
                 onChange={e => setSearchTableQuery(e.target.value)}
                 placeholder="Cari ID, Uraian, Rekanan..."
                 className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-white focus:outline-none focus:border-indigo-500 w-full"
               />
             </div>
             
             <button
               onClick={() => {
                 if (showForm) {
                   setShowForm(false);
                 } else {
                   setShowForm(true);
                   onSelectRekap('');
                 }
               }}
               className={\`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition shadow-md whitespace-nowrap flex items-center gap-1 \${showForm ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}\`}
             >
               {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Tutup Form' : 'Buat Data Rekap'}
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
            <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-mono">
              <tr>
                <th className="px-4 py-3">NO. REKAP</th>
                <th className="px-4 py-3">URAIAN GABUNGAN</th>
                <th className="px-4 py-3">SUB KEGIATAN</th>
                <th className="px-4 py-3">REKANAN</th>
                <th className="px-4 py-3 text-right">JUMLAH BERSIH</th>
                <th className="px-4 py-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {rekapBelanjaList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Belum ada data Rekap Belanja tersimpan.
                  </td>
                </tr>
              ) : (
                rekapBelanjaList.filter(r => 
                  r.id_rekap.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
                  (r.uraian_gabungan || '').toLowerCase().includes(searchTableQuery.toLowerCase()) ||
                  (r.pemilik_toko || '').toLowerCase().includes(searchTableQuery.toLowerCase()) ||
                  (r.sub_kegiatan || '').toLowerCase().includes(searchTableQuery.toLowerCase())
                ).map(rekap => (
                  <tr key={rekap.id_rekap} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-400">{rekap.id_rekap}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-slate-200" title={rekap.uraian_gabungan}>{rekap.uraian_gabungan || '-'}</td>
                    <td className="px-4 py-3 max-w-[150px] truncate text-slate-400">{rekap.sub_kegiatan || '-'}</td>
                    <td className="px-4 py-3 text-slate-300">{rekap.pemilik_toko || '-'}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">{formatNumberWithSeparator(rekap.jumlah_bersih)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            onSelectRekap(rekap.id_rekap);
                            setShowForm(true);
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <Edit3 size={12} /> EDIT
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(\`Hapus data rekap \${rekap.id_rekap}?\`)) {
                              onDeleteRekap(rekap.id_rekap);
                              if (activeRekapId === rekap.id_rekap) {
                                onSelectRekap('');
                                setShowForm(false);
                              }
                            }
                          }}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <Trash2 size={12} /> HAPUS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="space-y-6 border-t-2 border-indigo-500/30 pt-6">`;

code = code.replace(returnRegex, wrapper);

// Add the closing div for showForm at the end
// Let's replace the last </div>
const closingDivRegex = /      \{\/\* Print Modal \*\/\}/;
const closingForm = `      </div>
      )}
      
      {/* Print Modal */}`;
code = code.replace(closingDivRegex, closingForm);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Wrapper and table added.");
