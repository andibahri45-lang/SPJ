import { useState, useEffect } from 'react';
import { Pesanan, NotaBalasan, INDONESIAN_MONTHS } from '../types';
import { Save, X, RefreshCw, Printer, AlertTriangle, Calendar } from 'lucide-react';
import DatePicker from './DatePicker';

interface NotaBalasanFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentPesanan: Pesanan | undefined;
  balasanList: NotaBalasan[];
  onSaveBalasan: (balasan: NotaBalasan) => void;
  onTriggerPrint?: (docType: 'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa') => void;
}

export default function NotaBalasanForm({
  isOpen,
  onClose,
  currentPesanan,
  balasanList,
  onSaveBalasan,
  onTriggerPrint
}: NotaBalasanFormProps) {
  // Core Nota Balasan fields
  const [noRujukan, setNoRujukan] = useState('');
  const [kepada, setKepada] = useState('');
  const [namaPemilik, setNamaPemilik] = useState('');
  const [alamatToko, setAlamatToko] = useState('');
  const [dikeluarkanDi, setDikeluarkanDi] = useState('Labuha');
  const [tglPenetapan, setTglPenetapan] = useState(() => String(new Date().getDate()));
  const [bulanPenetapan, setBulanPenetapan] = useState(() => INDONESIAN_MONTHS[new Date().getMonth()]);
  const [tahunPenetapan, setTahunPenetapan] = useState(() => String(new Date().getFullYear()));
  const [keteranganNota, setKeteranganNota] = useState('');

  // Sync with current pesanan selection
  useEffect(() => {
    if (currentPesanan && isOpen) {
      const existing = balasanList.find(b => b.id_pesanan === currentPesanan.id_pesanan);

      if (existing) {
        setNoRujukan(existing.no_rujukan);
        setKepada(existing.kepada);
        setNamaPemilik(existing.nama_pemilik);
        setAlamatToko(existing.alamat_toko || currentPesanan.alamat_pemilik || '');
        setDikeluarkanDi(existing.dikeluarkan_di);
        setTglPenetapan(existing.tgl_penetapan);
        setBulanPenetapan(existing.bulan_penetapan);
        setTahunPenetapan(existing.tahun_penetapan);
        setKeteranganNota(existing.keterangan_nota || '');
      } else {
        // Defaults from active PO
        setNoRujukan(currentPesanan.no_nota || '');
        setKepada(currentPesanan.kepada || '');
        setNamaPemilik(currentPesanan.nama_pemilik || '');
        setAlamatToko(currentPesanan.alamat_pemilik || '');
        setDikeluarkanDi(currentPesanan.dikeluarkan_di || 'Labuha');
        setTglPenetapan(currentPesanan.tgl_penetapan || String(new Date().getDate()));
        setBulanPenetapan(currentPesanan.bulan_penetapan || INDONESIAN_MONTHS[new Date().getMonth()]);
        setTahunPenetapan(currentPesanan.tahun_penetapan || String(new Date().getFullYear()));
        
        // Auto-generate default statement on first load
        const autoText = `Merujuk Surat Nomor ${currentPesanan.no_nota || '900/         /BKPPD-HS/II/2026'} Tanggal ${currentPesanan.tgl_penetapan || '25'} ${currentPesanan.bulan_penetapan || 'Februari'} ${currentPesanan.tahun_penetapan || '2026'} Tentang Pesanan Maka Kami Dapat Sampaikan Sesuai Dengan Rincian Sebagai Berikut :`;
        setKeteranganNota(autoText);
      }
    }
  }, [currentPesanan, balasanList, isOpen]);

  const handleAutoGenerate = () => {
    if (currentPesanan) {
      const autoText = `Merujuk Surat Nomor ${currentPesanan.no_nota || '900/         /BKPPD-HS/II/2026'} Tanggal ${currentPesanan.tgl_penetapan || '25'} ${currentPesanan.bulan_penetapan || 'Februari'} ${currentPesanan.tahun_penetapan || '2026'} Tentang Pesanan Maka Kami Dapat Sampaikan Sesuai Dengan Rincian Sebagai Berikut :`;
      setKeteranganNota(autoText);
    }
  };

  const handleResetDefaults = () => {
    if (currentPesanan) {
      setNoRujukan(currentPesanan.no_nota || '');
      setKepada(currentPesanan.kepada || '');
      setNamaPemilik(currentPesanan.nama_pemilik || '');
      setAlamatToko(currentPesanan.alamat_pemilik || '');
      setDikeluarkanDi(currentPesanan.dikeluarkan_di || 'Labuha');
      setTglPenetapan(currentPesanan.tgl_penetapan || String(new Date().getDate()));
      setBulanPenetapan(currentPesanan.bulan_penetapan || INDONESIAN_MONTHS[new Date().getMonth()]);
      setTahunPenetapan(currentPesanan.tahun_penetapan || String(new Date().getFullYear()));
      
      const autoText = `Merujuk Surat Nomor ${currentPesanan.no_nota || '900/         /BKPPD-HS/II/2026'} Tanggal ${currentPesanan.tgl_penetapan || '25'} ${currentPesanan.bulan_penetapan || 'Februari'} ${currentPesanan.tahun_penetapan || '2026'} Tentang Pesanan Maka Kami Dapat Sampaikan Sesuai Dengan Rincian Sebagai Berikut :`;
      setKeteranganNota(autoText);
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

    const payload: NotaBalasan = {
      id_balasan: `bal_${currentPesanan.id_pesanan}`,
      id_pesanan: currentPesanan.id_pesanan,
      no_rujukan: noRujukan,
      kepada,
      nama_pemilik: namaPemilik,
      alamat_toko: alamatToko,
      dikeluarkan_di: dikeluarkanDi,
      tgl_penetapan: tglPenetapan,
      bulan_penetapan: bulanPenetapan,
      tahun_penetapan: tahunPenetapan,
      keterangan_nota: keteranganNota
    };

    onSaveBalasan(payload);
    
    if (shouldPrint && onTriggerPrint) {
      setTimeout(() => {
        onTriggerPrint('balasan');
      }, 150);
    } else {
      alert('Data Nota Balasan Berhasil Disimpan!');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Nota Balasan Supplier
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
          
          {!currentPesanan ? (
            <div className="py-8 text-center text-slate-400">
              <AlertTriangle className="mx-auto text-amber-500 mb-2" size={32} />
              <p className="text-xs">Silakan pilih pesanan aktif terlebih dahulu untuk membuat nota balasan.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* SECTION: PIHAK KEDUA / SUPPLIER (TOKO) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="w-1 h-3.5 bg-cyan-400 rounded-full"></span>
                  <h4 className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest font-mono">
                    PIHAK KEDUA / SUPPLIER (TOKO)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Toko */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Nama Toko / Usaha
                    </label>
                    <input
                      type="text"
                      value={kepada}
                      onChange={(e) => setKepada(e.target.value)}
                      placeholder="Masukkan nama toko..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Nama Pemilik */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Nama Pemilik
                    </label>
                    <input
                      type="text"
                      value={namaPemilik}
                      onChange={(e) => setNamaPemilik(e.target.value)}
                      placeholder="Nama pemilik toko..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Alamat Lengkap Toko */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Alamat Lengkap Toko
                  </label>
                  <input
                    type="text"
                    value={alamatToko}
                    onChange={(e) => setAlamatToko(e.target.value)}
                    placeholder="Jl. Raya No. 123, Labuha"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dikeluarkan Di */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Dikeluarkan Di
                    </label>
                    <input
                      type="text"
                      value={dikeluarkanDi}
                      onChange={(e) => setDikeluarkanDi(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Tanggal Penetapan */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tanggal Penetapan
                    </label>
                    <DatePicker
                      value={getDateString()}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>

                {/* Nomor Rujukan SPPD */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Nomor Rujukan Nota Pesanan
                  </label>
                  <input
                    type="text"
                    value={noRujukan}
                    onChange={(e) => setNoRujukan(e.target.value)}
                    placeholder="Misal: 900/012/BKPPD-HS/II/2026"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500">Nomor Nota Pesanan dari BKPPD yang dibalas</p>
                </div>

                {/* Keterangan Nota */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Keterangan Nota (Paragraf Pembuka)
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerate}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition active:scale-95"
                    >
                      <RefreshCw size={10} /> Auto-Generate
                    </button>
                  </div>
                  <textarea
                    value={keteranganNota}
                    onChange={(e) => setKeteranganNota(e.target.value)}
                    rows={4}
                    placeholder="Deskripsi pengantar nota pesanan..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
          >
            <RefreshCw size={12} /> Sync Ulang PO
          </button>
          
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => handleSaveAndPrint(false)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-lg"
            >
              <Save size={12} /> Simpan Balasan
            </button>
            <button
              type="button"
              onClick={() => handleSaveAndPrint(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-lg"
            >
              <Printer size={12} /> Simpan &amp; Cetak
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
