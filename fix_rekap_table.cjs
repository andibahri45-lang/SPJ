const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const tableHeaderRegex = /<thead[\s\S]*?<\/thead>/;
const newHeader = `<thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-mono">
              <tr>
                <th className="px-4 py-3">URAIAN BELANJA</th>
                <th className="px-4 py-3">SUB KEGIATAN</th>
                <th className="px-4 py-3">REKANAN</th>
                <th className="px-4 py-3 text-center">NILAI BRUTO</th>
                <th className="px-4 py-3 text-center">POTONGAN PAJAK</th>
                <th className="px-4 py-3 text-center">JUMLAH BERSIH</th>
                <th className="px-4 py-3 text-center">AKSI</th>
              </tr>
            </thead>`;
            
code = code.replace(tableHeaderRegex, newHeader);

const tbodyRegex = /rekapBelanjaList\.filter\([\s\S]*?\)\.map\(rekap => \([\s\S]*?<\/tr>\n\s*\)\)/;
const newTbody = `rekapBelanjaList.filter(r => 
                  r.id_rekap.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
                  (r.uraian_belanja_gabungan || '').toLowerCase().includes(searchTableQuery.toLowerCase()) ||
                  (r.pemilik_toko || '').toLowerCase().includes(searchTableQuery.toLowerCase()) ||
                  (r.sub_kegiatan || '').toLowerCase().includes(searchTableQuery.toLowerCase())
                ).map(rekap => {
                  const rekanan = rekananList.find(rk => rk.nama === rekap.pemilik_toko);
                  const subKegiatanData = subKegiatanList.find(sk => sk.nama_kegiatan === rekap.sub_kegiatan);
                  const potonganPajak = rekap.ppn + rekap.pph22 + rekap.pph23 + rekap.resto;
                  
                  return (
                  <tr key={rekap.id_rekap} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-200 max-w-[200px] truncate" title={rekap.uraian_belanja_gabungan}>
                        {rekap.uraian_belanja_gabungan || '-'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{rekap.id_rekap}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-300 max-w-[200px] truncate" title={rekap.sub_kegiatan}>
                        {rekap.sub_kegiatan || '-'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{subKegiatanData?.norek_sub_kegiatan || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{rekap.pemilik_toko || '-'}</div>
                      <div className="text-[10px] text-indigo-400 mt-0.5">Pemilik: {rekanan?.pimpinan || '-'}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 max-w-[150px] truncate" title={rekanan?.alamat}>{rekanan?.alamat || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-200">
                      Rp {formatNumberWithSeparator(rekap.jumlah_total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-mono font-bold text-amber-400">Rp {formatNumberWithSeparator(potonganPajak)}</div>
                      {rekap.ppn > 0 && <div className="text-[10px] text-slate-500 font-mono mt-0.5">PPN: Rp {formatNumberWithSeparator(rekap.ppn)}</div>}
                      {rekap.resto > 0 && <div className="text-[10px] text-slate-500 font-mono mt-0.5">Resto: Rp {formatNumberWithSeparator(rekap.resto)}</div>}
                      {rekap.pph22 > 0 && <div className="text-[10px] text-slate-500 font-mono mt-0.5">PPh 22: Rp {formatNumberWithSeparator(rekap.pph22)}</div>}
                      {rekap.pph23 > 0 && <div className="text-[10px] text-slate-500 font-mono mt-0.5">PPh 23: Rp {formatNumberWithSeparator(rekap.pph23)}</div>}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-emerald-400 text-sm">
                      Rp {formatNumberWithSeparator(rekap.jumlah_bersih)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <button
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold shadow-sm transition flex items-center gap-1"
                        >
                           <Database size={12} /> INPUT <ChevronDown size={12} />
                        </button>
                        <button
                          onClick={() => {
                            onSelectRekap(rekap.id_rekap);
                            if (onTriggerPrint) {
                               onTriggerPrint(['kwitansi_besar', 'bast_rekapan']);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <Printer size={12} /> CETAK <ChevronDown size={12} />
                        </button>
                        <button
                          onClick={() => {
                            onSelectRekap(rekap.id_rekap);
                            setShowForm(true);
                          }}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded text-[10px] font-bold shadow-sm transition flex items-center gap-1"
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
                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <Trash2 size={12} /> HAPUS
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                )`;
                
code = code.replace(tbodyRegex, newTbody);
code = code.replace(/colSpan=\{6\}/, 'colSpan={7}');

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Updated table styling");
