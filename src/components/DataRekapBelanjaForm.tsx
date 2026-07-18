import React, { useState, useMemo, useEffect } from 'react';
import { 
  Save, Trash2, Printer, Search, Plus, 
  X, Database, ChevronDown, Edit3, RotateCcw
} from 'lucide-react';
import { Pesanan, RekapBelanja, SubKegiatan, Rekanan } from '../App';

export const formatNumberWithSeparator = (value: number | string | undefined | null) => {
  if (value === undefined || value === null) return '0';
  const numStr = value.toString().replace(/[^0-9]/g, '');
  if (!numStr) return '0';
  return parseInt(numStr, 10).toLocaleString('id-ID');
};

interface DataRekapBelanjaFormProps {
  rekapBelanjaList: RekapBelanja[];
  pesananList: Pesanan[];
  subKegiatanList?: SubKegiatan[];
  rekananList?: Rekanan[];
  activeRekapId: string;
  onSelectRekap: (id: string) => void;
  onSaveRekap: (rekap: RekapBelanja) => void;
  onDeleteRekap: (id: string) => void;
  onDeletePesanan?: (id: string) => void;
  onBulkDeletePesanan?: (ids: string[]) => void;
  onTriggerPrint?: (tipe: 'kwitansi_besar' | 'bast_rekapan' | Array<'kwitansi_besar' | 'bast_rekapan'>) => void;
  onChangeTab?: (tab: string) => void;
}

export default function DataRekapBelanjaForm({
  rekapBelanjaList,
  pesananList,
  subKegiatanList = [],
  rekananList = [],
  activeRekapId,
  onSelectRekap,
  onSaveRekap,
  onDeleteRekap,
  onBulkDeletePesanan,
  onTriggerPrint,
  onChangeTab
}: DataRekapBelanjaFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [openInputDropdownId, setOpenInputDropdownId] = useState<string | null>(null);
  const [selectedPesananIds, setSelectedPesananIds] = useState<string[]>([]);
  const [uraianGabungan, setUraianGabungan] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPesananToAdd, setSelectedPesananToAdd] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printSelection, setPrintSelection] = useState<Array<'kwitansi_besar' | 'bast_rekapan'>>([]);

  const selectedPesananItems = useMemo(() => {
    return pesananList.filter(p => selectedPesananIds.includes(p.id_pesanan));
  }, [pesananList, selectedPesananIds]);

  const derivedSubKegiatan = selectedPesananItems.length > 0 ? selectedPesananItems[0].sub_kegiatan : '';
  const derivedPemilik = selectedPesananItems.length > 0 ? (selectedPesananItems[0].nama_pemilik || selectedPesananItems[0].kepada) : '';

  const unselectedAvailablePesanan = useMemo(() => {
    return pesananList.filter(p => {
      if (selectedPesananIds.includes(p.id_pesanan)) return false;
      if (selectedPesananIds.length > 0) {
        if (p.sub_kegiatan !== derivedSubKegiatan) return false;
        const pPemilik = p.nama_pemilik || p.kepada;
        if (pPemilik !== derivedPemilik) return false;
      }
      return true;
    });
  }, [pesananList, selectedPesananIds, derivedSubKegiatan, derivedPemilik]);

  const autoJumlahTotal = useMemo(() => selectedPesananItems.reduce((acc, p) => acc + (p.total_bruto || 0), 0), [selectedPesananItems]);
  const autoPpn = useMemo(() => selectedPesananItems.reduce((acc, p) => acc + (p.ppn_resto_type === 'PPN' ? (p.harga_ppn || 0) : 0), 0), [selectedPesananItems]);
  const autoResto = useMemo(() => selectedPesananItems.reduce((acc, p) => acc + (p.ppn_resto_type === 'Pajak Resto' ? (p.harga_ppn || 0) : 0), 0), [selectedPesananItems]);
  const autoPph22 = useMemo(() => selectedPesananItems.reduce((acc, p) => acc + (p.pph_type?.includes('22') ? (p.harga_pph || 0) : 0), 0), [selectedPesananItems]);
  const autoPph23 = useMemo(() => selectedPesananItems.reduce((acc, p) => acc + (p.pph_type?.includes('23') ? (p.harga_pph || 0) : 0), 0), [selectedPesananItems]);

  const finalBersih = autoJumlahTotal - autoPpn - autoResto - autoPph22 - autoPph23;

  useEffect(() => {
    if (selectedPesananItems.length > 0) {
      const baseUraian = selectedPesananItems.map(p => p.uraian_belanja).filter(Boolean).join(', ');
      setUraianGabungan(`${baseUraian} Pada Sub Kegiatan ${derivedSubKegiatan}`);
    } else {
      setUraianGabungan('');
    }
  }, [selectedPesananItems.length, derivedSubKegiatan]);

  useEffect(() => {
    if (activeRekapId) {
      const active = rekapBelanjaList.find(r => r.id_rekap === activeRekapId);
      if (active) {
        setSelectedPesananIds(active.pesanan_ids || []);
        setUraianGabungan(active.uraian_belanja_gabungan || '');
        setShowForm(true);
      }
    } else {
      setSelectedPesananIds([]);
      setUraianGabungan('');
    }
  }, [activeRekapId, rekapBelanjaList]);

  const handleClear = () => {
    onSelectRekap('');
    setSelectedPesananIds([]);
    setUraianGabungan('');
  };

  const handleSave = () => {
    if (selectedPesananIds.length === 0) {
      alert("Pilih minimal 1 pesanan untuk direkap!");
      return;
    }
    const id = activeRekapId || `RKP-${Date.now()}`;
    onSaveRekap({
      id_rekap: id,
      sub_kegiatan: derivedSubKegiatan,
      pemilik_toko: derivedPemilik,
      uraian_belanja_gabungan: uraianGabungan,
      jumlah_total: autoJumlahTotal,
      ppn: autoPpn,
      resto: autoResto,
      pph22: autoPph22,
      pph23: autoPph23,
      jumlah_bersih: finalBersih,
      pesanan_ids: selectedPesananIds
    });
    if (!activeRekapId) {
      onSelectRekap(id);
    }
    alert("Data Rekap berhasil disimpan!");
  };

  const isSaved = !!rekapBelanjaList.find(r => r.id_rekap === activeRekapId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database size={16} className="text-indigo-400" />
            Rekap Belanja (Kwitansi Besar)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gabungkan beberapa nota pesanan ke dalam satu cetakan kwitansi besar.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-400">ID Rekap Aktif:</span>
          <span className="px-3 py-1 bg-[#0F172A] border border-slate-700 rounded-lg font-bold text-indigo-400 text-xs font-mono">
            {activeRekapId || 'KOSONG'}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isSaved ? 'bg-green-950 text-green-300 border border-green-900/50' : 'bg-amber-950 text-amber-300 border border-amber-900/50'}`}>
            {isSaved ? 'Terdaftar di DB' : 'Draf Baru'}
          </span>
          <button
            type="button"
            onClick={() => {
              if (showForm) setShowForm(false);
              else { onSelectRekap(''); setShowForm(true); }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ${showForm ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Tutup Form' : 'Buat Data Rekap'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDE: Table Selection */}
          <div className="lg:col-span-8 space-y-4">
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
                      {p.id_pesanan} - {p.uraian_belanja} (Rp {formatNumberWithSeparator(p.total_bruto)})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedPesananToAdd) return;
                    if (!selectedPesananIds.includes(selectedPesananToAdd)) {
                      setSelectedPesananIds([...selectedPesananIds, selectedPesananToAdd]);
                    }
                    setSelectedPesananToAdd('');
                  }}
                  disabled={!selectedPesananToAdd}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow transition flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Plus size={14} /> Tambah Data Pesanan
                </button>
              </div>
            </div>

            {/* List Pesanan Terpilih */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="p-3 border-b border-slate-700/80 bg-slate-800/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Database size={14} className="text-indigo-400" />
                  Daftar Pesanan Terdaftar
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded">
                    Jumlah Data: {selectedPesananItems.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-10 text-center">Hapus</th>
                      <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700">Uraian Belanja</th>
                      <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 text-center">Pemilik Toko</th>
                      <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 text-center">Jumlah Bruto</th>
                      <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 text-center">Pajak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedPesananItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 text-xs">
                          Belum ada nota pesanan yang ditambahkan ke rekap ini.
                        </td>
                      </tr>
                    ) : (
                      selectedPesananItems.map(p => (
                        <tr key={p.id_pesanan} className="hover:bg-slate-800/50 transition">
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedPesananIds(prev => prev.filter(id => id !== p.id_pesanan))}
                              className="p-1.5 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white rounded border border-red-900/50 transition-colors mx-auto block"
                            >
                              <X size={12} />
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="text-xs font-bold text-slate-200 line-clamp-1">{p.uraian_belanja}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{p.id_pesanan}</div>
                          </td>
                          <td className="p-3 text-center text-[10px] text-slate-400">{p.nama_pemilik || p.kepada}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-400 text-xs">
                            {formatNumberWithSeparator(p.total_bruto)}
                          </td>
                          <td className="p-3 text-center text-[10px] text-slate-400">
                            <div>PPN: {formatNumberWithSeparator(p.harga_ppn)}</div>
                            <div>PPh: {formatNumberWithSeparator(p.harga_pph)}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
               <button
                 onClick={() => setShowPrintModal(true)}
                 disabled={!isSaved}
                 className="flex-1 py-2 bg-[#7f1d1d] hover:bg-red-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-2 shadow-md border border-red-900"
               >
                 <Printer size={14} /> Kwitansi Besar & BAST Rekapan
               </button>
            </div>
          </div>

          {/* RIGHT SIDE: Summary Form */}
          <div className="lg:col-span-4 space-y-4">
             <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md sticky top-24">
               <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono mb-4">
                 <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                 Rincian Rekap
               </h3>
                  
               <div className="space-y-4">
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                   <p className="text-[10px] text-slate-400 uppercase tracking-wider">Sub Kegiatan</p>
                   <p className="text-xs font-medium text-slate-200 mt-1 min-h-[1rem]">{derivedSubKegiatan || '-'}</p>
                 </div>
                 
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                   <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pemilik Toko</p>
                   <p className="text-xs font-medium text-slate-200 mt-1 min-h-[1rem]">{derivedPemilik || '-'}</p>
                 </div>

                 <div>
                   <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Uraian Gabungan</label>
                   <textarea 
                     rows={3}
                     value={uraianGabungan}
                     onChange={e => setUraianGabungan(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                   />
                 </div>

                 <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-3">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-900">JUMLAH BRUTO</label>
                     <span className="text-sm font-mono font-bold text-emerald-400">{formatNumberWithSeparator(autoJumlahTotal)}</span>
                   </div>
                      
                   <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-1">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">PPN</p>
                        <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                          {formatNumberWithSeparator(autoPpn)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Resto</p>
                        <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                          {formatNumberWithSeparator(autoResto)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">PPh 22</p>
                        <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                          {formatNumberWithSeparator(autoPph22)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">PPh 23</p>
                        <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                          {formatNumberWithSeparator(autoPph23)}
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 mt-3">
                     <label className="text-[10px] font-bold text-white">JUMLAH BERSIH</label>
                     <span className="text-sm font-mono font-bold text-white">{formatNumberWithSeparator(finalBersih)}</span>
                   </div>
                 </div>

                 <div className="pt-2 flex gap-2">
                   <button 
                     type="button"
                     onClick={handleClear}
                     className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase transition shadow-md"
                   >
                     Reset
                   </button>
                   <button 
                     type="button"
                     onClick={handleSave}
                     className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-2 shadow-md"
                   >
                     <Save size={14} /> Simpan Rekap
                   </button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* List Rekap Table */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl shadow-md overflow-hidden flex flex-col mt-6">
        <div className="p-4 border-b border-slate-700/80 bg-slate-800/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database size={16} className="text-indigo-400" />
            Database Rekap Belanja
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-[25%]">Uraian Rekap</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-[15%]">Sub Kegiatan</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-[15%]">Pemilik Toko</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-[12%] text-center">Jumlah Bruto</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-[12%] text-center">Pajak</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-[12%] text-center">Jumlah Bersih</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-[9%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {rekapBelanjaList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                    Belum ada data rekap belanja.
                  </td>
                </tr>
              ) : (
                rekapBelanjaList.map(rekap => {
                  const rekanan = rekananList.find(r => r.nama === rekap.pemilik_toko);
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
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{rekap.pemilik_toko || '-'}</div>
                      <div className="text-[10px] text-indigo-400 mt-0.5">Nama: {rekanan?.nama || '-'}</div>
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
                        <div className="relative">
                          <button
                            onClick={() => {
                              setOpenInputDropdownId(openInputDropdownId === rekap.id_rekap ? null : rekap.id_rekap);
                            }}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded text-[10px] font-bold uppercase transition flex items-center gap-1 shadow-sm font-mono"
                            title="Navigasi ke Form Isian Dokumen"
                          >
                            <Database size={12} />
                            INPUT
                            <ChevronDown size={11} className={`transition-transform duration-200 ${openInputDropdownId === rekap.id_rekap ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {openInputDropdownId === rekap.id_rekap && (
                            <div className="absolute right-0 mt-1 w-48 bg-[#1E293B] border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 text-left">
                              <button
                                onClick={() => {
                                  onSelectRekap(rekap.id_rekap);
                                  if (onChangeTab) onChangeTab('bast_rekapan');
                                  if (onTriggerPrint) onTriggerPrint('bast_rekapan');
                                  setOpenInputDropdownId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-800 text-white font-medium flex items-center gap-2 transition"
                              >
                                <span className="text-slate-400 font-mono">1.</span> BAST Rekapan
                              </button>
                              <button
                                onClick={() => {
                                  onSelectRekap(rekap.id_rekap);
                                  if (onChangeTab) onChangeTab('kwitansi_besar');
                                  if (onTriggerPrint) onTriggerPrint('kwitansi_besar');
                                  setOpenInputDropdownId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-800 text-white font-medium flex items-center gap-2 transition"
                              >
                                <span className="text-slate-400 font-mono">2.</span> Kwitansi Besar
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            onSelectRekap(rekap.id_rekap);
                            if (onTriggerPrint) {
                               onTriggerPrint(['kwitansi_besar', 'bast_rekapan']);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <Printer size={12} /> CETAK
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
                            if (confirm(`Hapus data rekap ${rekap.id_rekap}?`)) {
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPrintModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-5 shadow-2xl relative max-w-sm w-full">
             <button onClick={() => setShowPrintModal(false)} className="absolute right-3 top-3 text-slate-400 hover:text-white"><X size={16} /></button>
             <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Cetak Dokumen Rekap</h3>
             
             <div className="space-y-3 mb-5">
               <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition border border-slate-700">
                 <input 
                   type="checkbox"
                   checked={printSelection.includes('kwitansi_besar')}
                   onChange={e => {
                     if (e.target.checked) setPrintSelection(prev => [...prev, 'kwitansi_besar']);
                     else setPrintSelection(prev => prev.filter(x => x !== 'kwitansi_besar'));
                   }}
                   className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                 />
                 <span className="text-xs font-bold text-slate-300">Kwitansi Besar</span>
               </label>
               
               <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition border border-slate-700">
                 <input 
                   type="checkbox"
                   checked={printSelection.includes('bast_rekapan')}
                   onChange={e => {
                     if (e.target.checked) setPrintSelection(prev => [...prev, 'bast_rekapan']);
                     else setPrintSelection(prev => prev.filter(x => x !== 'bast_rekapan'));
                   }}
                   className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                 />
                 <span className="text-xs font-bold text-slate-300">BAST Rekapan</span>
               </label>
             </div>
             
             <button 
               onClick={() => {
                 if (printSelection.length === 0) {
                   alert('Pilih minimal 1 dokumen untuk dicetak.');
                   return;
                 }
                 if (onTriggerPrint) {
                   onTriggerPrint(printSelection.length > 1 ? ['kwitansi_besar', 'bast_rekapan'] : printSelection[0] as any);
                 }
                 setShowPrintModal(false);
               }}
               className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-2 shadow-lg"
             >
               <Printer size={14} /> Proses Cetak
             </button>
           </div>
         </div>
      )}
    </div>
  );
}
