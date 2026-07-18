import { useState, useEffect } from 'react';
import { Pesanan, BAST, INDONESIAN_MONTHS, Rekanan, PejabatKeuangan } from '../types';
import { Save, X, RefreshCw, Printer, AlertTriangle, FileCheck, Calendar } from 'lucide-react';
import DatePicker from './DatePicker';

interface BASTFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentPesanan: Pesanan | undefined;
  bastList: BAST[];
  rekananList: Rekanan[];
  pejabatKeuanganList: PejabatKeuangan[];
  onSaveBAST: (bast: BAST) => void;
  onTriggerPrint?: (docType: 'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa') => void;
}

export default function BASTForm({
  isOpen,
  onClose,
  currentPesanan,
  bastList,
  rekananList,
  pejabatKeuanganList,
  onSaveBAST,
  onTriggerPrint
}: BASTFormProps) {
  // Core BAST fields
  const [noBast, setNoBast] = useState('');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [namaPemilik, setNamaPemilik] = useState('');
  const [jabatanPemilik, setJabatanPemilik] = useState('Pemilik Usaha');
  const [alamatPemilik, setAlamatPemilik] = useState('');

  // Penerima (Goods Receiver)
  const [namaPenerima, setNamaPenerima] = useState('Indra Kusuma, A.Md.');
  const [nipPenerima, setNipPenerima] = useState('19891104 201212 1 003');
  const [jabatanPenerima, setJabatanPenerima] = useState('Penyimpan/Pengurus Barang BKPPD');

  // Mengetahui (Approver)
  const [namaMengetahui, setNamaMengetahui] = useState('');
  const [nipMengetahui, setNipMengetahui] = useState('');
  const [jabatanMengetahui, setJabatanMengetahui] = useState('Kepala BKPPD / PPK');

  // Description & Date
  const [keterangan, setKeterangan] = useState('');
  const [dikeluarkanDi, setDikeluarkanDi] = useState('Labuha');
  const [tglPenetapan, setTglPenetapan] = useState(() => String(new Date().getDate()));
  const [bulanPenetapan, setBulanPenetapan] = useState(() => INDONESIAN_MONTHS[new Date().getMonth()]);
  const [tahunPenetapan, setTahunPenetapan] = useState(() => String(new Date().getFullYear()));

  // Sync with current pesanan selection
  useEffect(() => {
    if (currentPesanan && isOpen) {
      const existing = bastList.find(b => b.id_pesanan === currentPesanan.id_pesanan);

      if (existing) {
        setNoBast(existing.no_bast);
        setNamaUsaha(existing.nama_usaha);
        setNamaPemilik(existing.nama_pemilik);
        setJabatanPemilik(existing.jabatan_pemilik);
        setAlamatPemilik(existing.alamat_pemilik);
        setNamaPenerima(existing.nama_penerima);
        setNipPenerima(existing.nip_penerima);
        setJabatanPenerima(existing.jabatan_penerima);
        setNamaMengetahui(existing.nama_mengetahui);
        setNipMengetahui(existing.nip_mengetahui);
        setJabatanMengetahui(existing.jabatan_mengetahui);
        setKeterangan(existing.keterangan);
        setDikeluarkanDi(existing.dikeluarkan_di);
        setTglPenetapan(existing.tgl_penetapan);
        setBulanPenetapan(existing.bulan_penetapan);
        setTahunPenetapan(existing.tahun_penetapan);
      } else {
        // Defaults from active PO
        setNoBast(`900/BAST/${currentPesanan.id_pesanan}/BKPPD-HS/${tahunPenetapan}`);
        setNamaUsaha(currentPesanan.kepada);
        setNamaPemilik(currentPesanan.nama_pemilik);
        setAlamatPemilik(currentPesanan.alamat_pemilik);
        setNamaMengetahui(currentPesanan.kepala_kantor);
        setNipMengetahui(currentPesanan.nip_kepala_kantor);

        // Auto generate handover clauses (Replicates Cari_Keterangan_Click)
        const clauses = `PIHAK KESATU menyerahkan belanja barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dalam keadaan baik, lengkap, dan baru sesuai dengan Nota Pesanan Nomor ${currentPesanan.no_nota || '_____'} Tanggal ${currentPesanan.tgl_penetapan} ${currentPesanan.bulan_penetapan} ${currentPesanan.tahun_penetapan} berupa ${currentPesanan.uraian_belanja}.`;
        setKeterangan(clauses);
      }
    }
  }, [currentPesanan, bastList, isOpen]);

  const handleGenerateClause = () => {
    if (currentPesanan) {
      const clauses = `PIHAK KESATU menyerahkan belanja barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dalam keadaan baik, lengkap, dan baru sesuai dengan Nota Pesanan Nomor ${currentPesanan.no_nota || '_____'} Tanggal ${currentPesanan.tgl_penetapan} ${currentPesanan.bulan_penetapan} ${currentPesanan.tahun_penetapan} berupa ${currentPesanan.uraian_belanja}.`;
      setKeterangan(clauses);
    }
  };

  const getDateString = () => {
    const day = String(tglPenetapan || '').padStart(2, '0');
    const monthIdx = INDONESIAN_MONTHS.indexOf(bulanPenetapan);
    const month = monthIdx !== -1 ? String(monthIdx + 1).padStart(2, '0') : '01';
    const year = tahunPenetapan || String(new Date().getFullYear());
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (val: string) => {
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthInt = parseInt(parts[1], 10);
      const dayInt = parseInt(parts[2], 10);
      
      setTahunPenetapan(year);
      if (monthInt >= 1 && monthInt <= 12) {
        setBulanPenetapan(INDONESIAN_MONTHS[monthInt - 1]);
      }
      setTglPenetapan(String(dayInt));
    }
  };

  const handleSaveAndPrint = (shouldPrint: boolean) => {
    if (!currentPesanan) {
      alert('Pilih/Simpan data Pesanan terlebih dahulu.');
      return;
    }

    const payload: BAST = {
      id_bast: `bast_${currentPesanan.id_pesanan}`,
      id_pesanan: currentPesanan.id_pesanan,
      no_bast: noBast,
      nama_usaha: namaUsaha,
      nama_pemilik: namaPemilik,
      jabatan_pemilik: jabatanPemilik,
      alamat_pemilik: alamatPemilik,
      nama_penerima: namaPenerima,
      nip_penerima: nipPenerima,
      jabatan_penerima: jabatanPenerima,
      nama_mengetahui: namaMengetahui,
      nip_mengetahui: nipMengetahui,
      jabatan_mengetahui: jabatanMengetahui,
      keterangan,
      dikeluarkan_di: dikeluarkanDi,
      tgl_penetapan: tglPenetapan,
      bulan_penetapan: bulanPenetapan,
      tahun_penetapan: tahunPenetapan
    };

    onSaveBAST(payload);
    
    if (shouldPrint && onTriggerPrint) {
      setTimeout(() => {
        onTriggerPrint('bast');
      }, 150);
    } else {
      alert(`Data BAST Serah Terima untuk No. Urut ${currentPesanan.id_pesanan} Berhasil Disimpan!`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Berita Acara Serah Terima (BAST)
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs Form */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">No. BAST (Surat)</label>
                  <input
                    type="text"
                    value={noBast}
                    onChange={(e) => setNoBast(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
                  />
                </div>
      
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex justify-between">
                    <span>Nama Toko / Usaha</span>
                  </label>
                  <select
                    value={namaUsaha}
                    onChange={(e) => {
                      setNamaUsaha(e.target.value);
                      const r = rekananList.find(rek => rek.perusahaan === e.target.value);
                      if (r) {
                        setNamaPemilik(r.nama);
                        setAlamatPemilik(r.alamat);
                        setJabatanPemilik('Pimpinan');
                      }
                    }}
                    className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="">-- Pilih Toko / Rekanan --</option>
                    {!rekananList.some(r => r.perusahaan === namaUsaha) && namaUsaha && (
                      <option value={namaUsaha}>{namaUsaha}</option>
                    )}
                    {rekananList.map(r => (
                      <option key={r.id} value={r.perusahaan}>{r.perusahaan}</option>
                    ))}
                  </select>
                </div>
              </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Pemilik Toko</label>
            <input
              type="text"
              value={namaPemilik}
              onChange={(e) => setNamaPemilik(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jabatan Pemilik</label>
            <input
              type="text"
              value={jabatanPemilik}
              onChange={(e) => setJabatanPemilik(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat Pemilik</label>
            <input
              type="text"
              value={alamatPemilik}
              onChange={(e) => setAlamatPemilik(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>
        </div>

        {/* Goods Receiver (Pihak Kedua) */}
        <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-3">
          <p className="text-xs font-bold text-teal-400 border-b border-slate-700 pb-1 uppercase tracking-wide font-mono">Penerima Barang (Pihak Kedua / Pegawai)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nama Pegawai</label>
              <select
                value={namaPenerima}
                onChange={(e) => {
                  setNamaPenerima(e.target.value);
                  const p = pejabatKeuanganList.find(x => x.nama === e.target.value);
                  if (p) {
                    setNipPenerima(p.nip);
                    setJabatanPenerima(p.jabatan);
                  }
                }}
                className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
              >
                <option value="">-- Pilih Pegawai --</option>
                {!pejabatKeuanganList.some(p => p.nama === namaPenerima) && namaPenerima && (
                  <option value={namaPenerima}>{namaPenerima}</option>
                )}
                {pejabatKeuanganList.filter(p => p.jabatan.toLowerCase().includes('bendahara') || p.jabatan.toLowerCase().includes('pengurus barang')).map(p => (
                  <option key={p.id} value={p.nama}>{p.nama} - {p.jabatan}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">NIP</label>
              <input
                type="text"
                value={nipPenerima}
                onChange={(e) => setNipPenerima(e.target.value)}
                className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Jabatan Penerima</label>
              <input
                type="text"
                value={jabatanPenerima}
                onChange={(e) => setJabatanPenerima(e.target.value)}
                className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Wording Clause */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pernyataan Serah Terima (Klausul)</label>
            <button
              type="button"
              onClick={handleGenerateClause}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <RefreshCw size={11} /> Regenerate
            </button>
          </div>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            rows={4}
            className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 transition resize-none leading-relaxed"
          ></textarea>
        </div>

        {/* Location / Dates */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tempat Pengeluaran</label>
            <input
              type="text"
              value={dikeluarkanDi}
              onChange={(e) => setDikeluarkanDi(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal BAST</label>
            <DatePicker
              value={getDateString()}
              onChange={handleDateChange}
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={() => handleSaveAndPrint(false)}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md border border-indigo-500"
          >
            <Save size={14} /> Simpan Saja
          </button>
          
          <button
            type="button"
            onClick={() => handleSaveAndPrint(true)}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md border border-emerald-500"
          >
            <Printer size={14} /> Simpan & Cetak
          </button>
        </div>
      </div>

      {/* Mengetahui Block */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-3">
          <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
            <span className="w-1 h-3 bg-amber-500 rounded-full"></span>
            Mengetahui / Penanggung Jawab
          </h3>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Nama Pejabat</label>
              <select
                value={namaMengetahui}
                onChange={(e) => {
                  setNamaMengetahui(e.target.value);
                  const p = pejabatKeuanganList.find(x => x.nama === e.target.value);
                  if (p) {
                    setNipMengetahui(p.nip);
                    setJabatanMengetahui(p.jabatan);
                  }
                }}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs font-bold"
              >
                <option value="">-- Pilih Pejabat --</option>
                {!pejabatKeuanganList.some(p => p.nama === namaMengetahui) && namaMengetahui && (
                  <option value={namaMengetahui}>{namaMengetahui}</option>
                )}
                {pejabatKeuanganList.filter(p => p.jabatan === 'PA_KPA' || p.jabatan === 'KPA').map(p => (
                  <option key={p.id} value={p.nama}>{p.nama} - {p.jabatan}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">NIP Pejabat</label>
              <input
                type="text"
                value={nipMengetahui}
                onChange={(e) => setNipMengetahui(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Jabatan Atasan</label>
              <input
                type="text"
                value={jabatanMengetahui}
                onChange={(e) => setJabatanMengetahui(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-[#0F172A] border border-indigo-950 p-4 rounded-xl text-indigo-300 space-y-2">
          <h4 className="font-bold text-xs text-indigo-400 font-mono uppercase tracking-wider">Serah Terima Terikat</h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            BAST ini bertindak sebagai berkas verifikasi fisik bahwa kuantitas barang yang tertera di nota pesanan telah diterima sepenuhnya oleh pengurus aset BKPPD.
          </p>
        </div>
      </div>
        </div>
      </div>
    </div>
  </div>
  );
}
