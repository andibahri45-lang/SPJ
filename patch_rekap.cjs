const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

// 1. Remove unnecessary state variables
code = code.replace(/const \[idRekap, setIdRekap\] = useState\(''\);\n/, "");
code = code.replace(/const \[subKegiatan, setSubKegiatan\] = useState\(''\);\n/, "");
code = code.replace(/const \[pemilikToko, setPemilikToko\] = useState\(''\);\n/, "");
code = code.replace(/const \[manualPpn, setManualPpn\] = useState\(''\);\n/, "");
code = code.replace(/const \[manualResto, setManualResto\] = useState\(''\);\n/, "");
code = code.replace(/const \[manualPph22, setManualPph22\] = useState\(''\);\n/, "");
code = code.replace(/const \[manualPph23, setManualPph23\] = useState\(''\);\n/, "");

// 2. Replace derived calculations
const derivedVars = `
  const derivedSubKegiatan = selectedPesananItems.length > 0 ? selectedPesananItems[0].sub_kegiatan : '';
  const derivedPemilik = selectedPesananItems.length > 0 ? (selectedPesananItems[0].nama_pemilik || selectedPesananItems[0].kepada) : '';

  const unselectedAvailablePesanan = pesananList.filter(p => {
    if (selectedPesananIds.includes(p.id_pesanan)) return false;
    if (selectedPesananIds.length > 0) {
      if (p.sub_kegiatan !== derivedSubKegiatan) return false;
      const pPemilik = p.nama_pemilik || p.kepada;
      if (pPemilik !== derivedPemilik) return false;
    }
    return true;
  });

  const autoJumlahTotal = selectedPesananItems.reduce((acc, p) => acc + (p.total_bruto || 0), 0);
  const autoPpn = selectedPesananItems.reduce((acc, p) => acc + (p.ppn_resto_type === 'PPN' ? (p.harga_ppn || 0) : 0), 0);
  const autoResto = selectedPesananItems.reduce((acc, p) => acc + (p.ppn_resto_type === 'Pajak Resto' ? (p.harga_ppn || 0) : 0), 0);
  const autoPph22 = selectedPesananItems.reduce((acc, p) => acc + (p.pph_type?.includes('22') ? (p.harga_pph || 0) : 0), 0);
  const autoPph23 = selectedPesananItems.reduce((acc, p) => acc + (p.pph_type?.includes('23') ? (p.harga_pph || 0) : 0), 0);
  
  const finalPpn = autoPpn;
  const finalResto = autoResto;
  const finalPph22 = autoPph22;
  const finalPph23 = autoPph23;
  const finalBersih = autoJumlahTotal - finalPpn - finalResto - finalPph22 - finalPph23;
`;

// Find the section to replace: from "const filteredAvailablePesanan" to "const finalBersih"
code = code.replace(/const filteredAvailablePesanan[\s\S]*?const finalBersih = autoJumlahTotal - finalPpn - finalResto - finalPph22 - finalPph23;/, derivedVars);

// 3. Update useEffect for uraian
const oldUseEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[selectedPesananItems\]\);/;
const newUseEffect = `
  useEffect(() => {
    if (selectedPesananItems.length > 0) {
      const baseUraian = selectedPesananItems.map(p => p.uraian_belanja).filter(Boolean).join(', ');
      const combined = \`\${baseUraian} (Pada Sub Kegiatan "\${derivedSubKegiatan}")\`;
      setUraianGabungan(combined);
    } else {
      setUraianGabungan('');
    }
  }, [selectedPesananItems, derivedSubKegiatan]);
`;
code = code.replace(oldUseEffect, newUseEffect);

// 4. Update loadRekap, handleClear, handleSave
code = code.replace(/setIdRekap\(rekap.id_rekap\);\n/g, "");
code = code.replace(/setSubKegiatan\(rekap.sub_kegiatan\);\n/g, "");
code = code.replace(/setPemilikToko\(rekap.pemilik_toko\);\n/g, "");
code = code.replace(/setManualPpn\([\s\S]*?\);\n/g, "");
code = code.replace(/setManualResto\([\s\S]*?\);\n/g, "");
code = code.replace(/setManualPph22\([\s\S]*?\);\n/g, "");
code = code.replace(/setManualPph23\([\s\S]*?\);\n/g, "");
code = code.replace(/setIdRekap\(''\);\n/g, "");
code = code.replace(/setSubKegiatan\(''\);\n/g, "");
code = code.replace(/setPemilikToko\(''\);\n/g, "");

// In handleSave, idRekap -> id_rekap, and subKegiatan -> derivedSubKegiatan
code = code.replace(/if \(!idRekap\) \{[\s\S]*?return;[\s\S]*?\}/, "");
code = code.replace(/id_rekap: idRekap,/, "id_rekap: activeRekapId || `RKP-${Date.now()}`,");
code = code.replace(/sub_kegiatan: subKegiatan,/, "sub_kegiatan: derivedSubKegiatan,");
code = code.replace(/pemilik_toko: pemilikToko,/, "pemilik_toko: derivedPemilik,");

// 5. Update JSX: Remove No. Rekap, Sub Kegiatan, Pemilik Toko fields in the top left
const filtersHtml = /<div className="grid grid-cols-2 md:grid-cols-4 gap-4">[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(filtersHtml, "");

// 6. Update JSX: Update Right Side (Rincian Rekap) to use auto variables
const oldRincian = /<div className="space-y-4">[\s\S]*?<div className="bg-slate-900\/50 p-3 rounded-lg border border-slate-800">/;
const newRincian = `<div className="space-y-4">
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                 <p className="text-[10px] text-slate-400 uppercase tracking-wider">Sub Kegiatan</p>
                 <p className="text-xs font-medium text-slate-200 mt-1 min-h-[1rem]">{derivedSubKegiatan || '-'}</p>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                 <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pemilik Toko (Rekanan)</p>
                 <p className="text-xs font-medium text-slate-200 mt-1 min-h-[1rem]">{derivedPemilik || '-'}</p>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">`;
code = code.replace(oldRincian, newRincian);

// Remove manual PPN inputs and replace with read-only
const oldPpnSection = /<div className="col-span-1">[\s\S]*?<\/div>[\s\S]*?<div className="col-span-1">[\s\S]*?<\/div>[\s\S]*?<div className="col-span-1">[\s\S]*?<\/div>[\s\S]*?<div className="col-span-1">[\s\S]*?<\/div>/;

const newPpnSection = `<div className="col-span-1">
                     <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">PPN</p>
                     <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                        {finalPpn ? formatNumberWithSeparator(finalPpn) : '0'}
                     </div>
                   </div>
                   <div className="col-span-1">
                     <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Resto</p>
                     <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                        {finalResto ? formatNumberWithSeparator(finalResto) : '0'}
                     </div>
                   </div>
                   <div className="col-span-1">
                     <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">PPh 22</p>
                     <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                        {finalPph22 ? formatNumberWithSeparator(finalPph22) : '0'}
                     </div>
                   </div>
                   <div className="col-span-1">
                     <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">PPh 23</p>
                     <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                        {finalPph23 ? formatNumberWithSeparator(finalPph23) : '0'}
                     </div>
                   </div>`;

code = code.replace(oldPpnSection, newPpnSection);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Patched Rekap");
