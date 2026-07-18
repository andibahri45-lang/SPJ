const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const dropdownSection = `
          {/* Tambah Daftar Nota Pesanan */}
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/80 pb-2">
              <Plus size={14} className="text-indigo-400" />
              Daftar Nota Pesanan
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedPesananToAdd}
                onChange={e => setSelectedPesananToAdd(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 appearance-none"
              >
                <option value="">-- Pilih Nota Pesanan --</option>
                {unselectedAvailablePesanan.map(p => (
                  <option key={p.id_pesanan} value={p.id_pesanan}>
                    {p.no_nota || p.id_pesanan} - {p.uraian_belanja} (Rp {formatNumberWithSeparator(p.total_bruto)})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!selectedPesananToAdd) return;
                  if (!selectedPesananIds.includes(selectedPesananToAdd)) {
                    togglePesananSelection(selectedPesananToAdd);
                  }
                  setSelectedPesananToAdd('');
                }}
                disabled={!selectedPesananToAdd}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Plus size={14} /> Tambah Data Pesanan
              </button>
            </div>
          </div>
`;

code = code.replace(
  /\{\/\* Table Daftar Input & Nota Pesanan Terdaftar \*\/\}/,
  dropdownSection + '\n          {/* Table Daftar Input & Nota Pesanan Terdaftar */}'
);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Added UI");
