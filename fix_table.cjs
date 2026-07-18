const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

// Replace "Jumlah Data: {filteredAvailablePesanan.length}"
code = code.replace(/Jumlah Data: \{filteredAvailablePesanan\.length\}/, "Jumlah Data: {selectedPesananItems.length}");

// In the thead, we can remove the "Pilih Semua" checkbox, or just replace the whole header.
const oldThead = `<thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-mono">
                    <tr>
                      <th className="px-4 py-3 w-10 text-center">
                        Aksi
                      </th>
                      <th className="px-4 py-3 w-10 text-center">
                        <button onClick={handleSelectAll} className="hover:text-white" title="Pilih Semua">
                          {selectedPesananIds.length === filteredAvailablePesanan.length && filteredAvailablePesanan.length > 0 ? (
                            <CheckSquare size={14} className="text-indigo-400" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3">Uraian Belanja</th>
                      <th className="px-4 py-3">Pemilik Toko</th>
                      <th className="px-4 py-3 text-right">Jumlah Bruto</th>
                      <th className="px-4 py-3 text-center">PPN/Resto</th>
                      <th className="px-4 py-3 text-right">Harga Pajak</th>
                    </tr>
                  </thead>`;

const newThead = `<thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-mono">
                    <tr>
                      <th className="px-4 py-3 w-10 text-center">
                        Hapus
                      </th>
                      <th className="px-4 py-3">Uraian Belanja</th>
                      <th className="px-4 py-3">Pemilik Toko</th>
                      <th className="px-4 py-3 text-right">Jumlah Bruto</th>
                      <th className="px-4 py-3 text-center">PPN/Resto</th>
                      <th className="px-4 py-3 text-right">Harga Pajak</th>
                    </tr>
                  </thead>`;

code = code.replace(oldThead, newThead);

// Also replace the tbody
const oldTbody = /<tbody className="divide-y divide-slate-700\/50">([\s\S]*?)<\/tbody>/;

const newTbody = `<tbody className="divide-y divide-slate-700/50">
                    {selectedPesananItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-mono">
                          Belum ada nota pesanan yang ditambahkan ke rekap ini.
                        </td>
                      </tr>
                    ) : (
                      selectedPesananItems.map(p => {
                        return (
                          <tr 
                            key={p.id_pesanan} 
                            className="hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => togglePesananSelection(p.id_pesanan)}
                                className="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded shadow-sm transition"
                                title="Hapus dari Rekap"
                              >
                                <X size={12} />
                              </button>
                            </td>
                            <td className="px-4 py-2 font-medium text-slate-200 max-w-[200px] truncate" title={p.uraian_belanja}>{p.uraian_belanja || p.keterangan || '-'}</td>
                            <td className="px-4 py-2 text-slate-400">{p.nama_pemilik || p.kepada}</td>
                            <td className="px-4 py-2 text-right font-mono text-emerald-400">{formatNumberWithSeparator(p.total_bruto)}</td>
                            <td className="px-4 py-2 text-center text-slate-400">{p.ppn_resto_type !== 'Tanpa PPN/Resto' ? p.ppn_resto_type : '-'}</td>
                            <td className="px-4 py-2 text-right font-mono text-amber-400">{formatNumberWithSeparator(p.harga_ppn)}</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>`;

code = code.replace(oldTbody, newTbody);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Updated Table");
