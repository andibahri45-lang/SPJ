import { useState, useEffect } from 'react';
import { Pesanan, Sewa, INDONESIAN_MONTHS, terbilang, formatNumberWithSeparator, parseSeparatorToNumber, Rekanan, PejabatKeuangan } from '../types';
import { Save, Calendar, CheckSquare, Sparkles, FileText, X, Printer } from 'lucide-react';
import { formatRupiah } from './PrintTemplates';
import DatePicker from './DatePicker';

interface SewaFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentPesanan: Pesanan | undefined;
  sewaList: Sewa[];
  rekananList: Rekanan[];
  pejabatKeuanganList: PejabatKeuangan[];
  onSaveSewa: (sewa: Sewa) => void;
  onTriggerPrint?: (docType: 'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa') => void;
}

export default function SewaForm({
  isOpen,
  onClose,
  currentPesanan,
  sewaList,
  rekananList,
  pejabatKeuanganList,
  onSaveSewa,
  onTriggerPrint
}: SewaFormProps) {
  // Core Sewa fields
  const [noSurat, setNoSurat] = useState('');
  const [pihakPertama, setPihakPertama] = useState('');
  const [nipPihakPertama, setNipPihakPertama] = useState('');
  const [jabatanPihakPertama, setJabatanPihakPertama] = useState('Pejabat Pembuat Komitmen (PPK) BKPPD');
  const [alamatPihakPertama, setAlamatPihakPertama] = useState('Kompleks Perkantoran Pemda Kab. Halmahera Selatan, Labuha');

  const [pihakKedua, setPihakKedua] = useState('');
  const [alamatPihakKedua, setAlamatPihakKedua] = useState('');
  const [untukKegiatan, setUntukKegiatan] = useState('');
  
  // Rent Specs
  const [hargaSewa, setHargaSewa] = useState<number>(0);
  const [jumlahUnit, setJumlahUnit] = useState<number>(1);
  const [lokasi, setLokasi] = useState('Kab. Halmahera Selatan');

  // Rent Dates
  const [tglDari, setTglDari] = useState('1');
  const [bulanDari, setBulanDari] = useState('Juli');
  const [tahunDari, setTahunDari] = useState(() => String(new Date().getFullYear()));

  const [tglSampai, setTglSampai] = useState('5');
  const [bulanSampai, setBulanSampai] = useState('Juli');
  const [tahunSampai, setTahunSampai] = useState(() => String(new Date().getFullYear()));

  // Output duration description
  const [uraianSelama, setUraianSelama] = useState('');

  // Sign date & place
  const [dikeluarkanDi, setDikeluarkanDi] = useState('Labuha');
  const [tglPenetapan, setTglPenetapan] = useState(() => String(new Date().getDate()));
  const [bulanPenetapan, setBulanPenetapan] = useState(() => INDONESIAN_MONTHS[new Date().getMonth()]);
  const [tahunPenetapan, setTahunPenetapan] = useState(() => String(new Date().getFullYear()));

  // Custom header and detail lines for layout faithfulness
  const [namaKegiatanSewa, setNamaKegiatanSewa] = useState('PENYEDIAAN ALAT ANGKUTAN DARAT');
  const [dalamRangka, setDalamRangka] = useState('DALAM RANGKA KEGIATAN PENERIMAAN CPNS');
  const [padaSubKegiatan, setPadaSubKegiatan] = useState('PADA SUB KEGIATAN...');

  const [kegiatanOptions, setKegiatanOptions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sistem_antigravity_kegiatan_options');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showKegiatanDropdown, setShowKegiatanDropdown] = useState(false);

  const saveKegiatanOption = (val: string) => {
    if (val && !kegiatanOptions.includes(val)) {
      const newOpts = [...kegiatanOptions, val];
      setKegiatanOptions(newOpts);
      localStorage.setItem('sistem_antigravity_kegiatan_options', JSON.stringify(newOpts));
    }
  };

  const removeKegiatanOption = (e: any, val: string) => {
    e.stopPropagation();
    const newOpts = kegiatanOptions.filter(o => o !== val);
    setKegiatanOptions(newOpts);
    localStorage.setItem('sistem_antigravity_kegiatan_options', JSON.stringify(newOpts));
  };

  const [pekerjaan, setPekerjaan] = useState('Penyediaan Alat Angkutan Darat Roda Empat');
  const [durasiHari, setDurasiHari] = useState('3 (Tiga)');
  const [rentangTanggal, setRentangTanggal] = useState('25 s.d. 27 Februari 2026');
  const [hargaSewaTerbilang, setHargaSewaTerbilang] = useState('Tujuh Puluh Enam Ribu');

  const getDariDateString = () => {
    const monthStr = (INDONESIAN_MONTHS.indexOf(bulanDari) + 1).toString().padStart(2, '0');
    return `${tahunDari}-${monthStr}-${tglDari.padStart(2, '0')}`;
  };

  const handleDariDateChange = (dateStr: string) => {
    if (!dateStr) return;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      setTahunDari(parts[0]);
      setBulanDari(INDONESIAN_MONTHS[parseInt(parts[1], 10) - 1]);
      setTglDari(parseInt(parts[2], 10).toString());
    }
  };

  const getSampaiDateString = () => {
    const monthStr = (INDONESIAN_MONTHS.indexOf(bulanSampai) + 1).toString().padStart(2, '0');
    return `${tahunSampai}-${monthStr}-${tglSampai.padStart(2, '0')}`;
  };

  const handleSampaiDateChange = (dateStr: string) => {
    if (!dateStr) return;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      setTahunSampai(parts[0]);
      setBulanSampai(INDONESIAN_MONTHS[parseInt(parts[1], 10) - 1]);
      setTglSampai(parseInt(parts[2], 10).toString());
    }
  };

  const getPenetapanDateString = () => {
    const monthStr = (INDONESIAN_MONTHS.indexOf(bulanPenetapan) + 1).toString().padStart(2, '0');
    return `${tahunPenetapan}-${monthStr}-${tglPenetapan.padStart(2, '0')}`;
  };

  const handlePenetapanDateChange = (dateStr: string) => {
    if (!dateStr) return;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      setTahunPenetapan(parts[0]);
      setBulanPenetapan(INDONESIAN_MONTHS[parseInt(parts[1], 10) - 1]);
      setTglPenetapan(parseInt(parts[2], 10).toString());
    }
  };

  // Parse Month Name to JS index
  const getMonthIndex = (monthName: string): number => {
    const idx = INDONESIAN_MONTHS.indexOf(monthName);
    return idx === -1 ? 0 : idx;
  };

  // Perform date difference calculation (matching VBA HitungTanggal)
  useEffect(() => {
    try {
      const d1 = new Date(parseInt(tahunDari, 10), getMonthIndex(bulanDari), parseInt(tglDari, 10));
      const d2 = new Date(parseInt(tahunSampai, 10), getMonthIndex(bulanSampai), parseInt(tglSampai, 10));

      if (d1.getTime() && d2.getTime()) {
        const diffTime = d2.getTime() - d1.getTime();
        // date2 - date1 + 1 (inclusive)
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 0) {
          const daysText = terbilang(diffDays);
          const fullUraian = `${diffDays} (${daysText}) Hari Terhitung Mulai Tanggal ${tglDari} ${bulanDari} ${tahunDari} s/d ${tglSampai} ${bulanSampai} ${tahunSampai}.`;
          setUraianSelama(fullUraian);
          setDurasiHari(`${diffDays} (${daysText})`);
          setRentangTanggal(`${tglDari} s.d. ${tglSampai} ${bulanSampai} ${tahunSampai}`);
        } else {
          setUraianSelama('Tanggal Sampai harus setelah Tanggal Dari.');
        }
      }
    } catch (err) {
      setUraianSelama('Format tanggal belum lengkap.');
    }
  }, [tglDari, bulanDari, tahunDari, tglSampai, bulanSampai, tahunSampai]);

  // Update terbilang when hargaSewa changes
  useEffect(() => {
    if (hargaSewa) {
      setHargaSewaTerbilang(terbilang(hargaSewa));
    }
  }, [hargaSewa]);

  // Sync state with active Pesanan
  useEffect(() => {
    if (currentPesanan) {
      const paKpaMatch = pejabatKeuanganList.find(pj => pj.nama === currentPesanan.kepala_kantor);
      const calculatedJabatan = paKpaMatch ? paKpaMatch.jabatan : 'Kepala BKPPD';

      const existing = sewaList.find(s => s.id_pesanan === currentPesanan.id_pesanan);
      if (existing) {
        setNoSurat(existing.no_surat);
        setPihakPertama(currentPesanan.kepala_kantor || existing.nama_pihak_pertama);
        setNipPihakPertama(currentPesanan.nip_kepala_kantor || existing.nip_pihak_pertama);
        setJabatanPihakPertama(calculatedJabatan || existing.jabatan_pihak_pertama);
        setAlamatPihakPertama(existing.alamat_pihak_pertama);
        
        setPihakKedua(currentPesanan.nama_pemilik || currentPesanan.kepada || existing.nama_pihak_kedua);
        setAlamatPihakKedua(currentPesanan.alamat_pemilik || existing.alamat_pihak_kedua);

        setUntukKegiatan(existing.untuk_kegiatan);
        setHargaSewa(existing.harga_sewa);
        setJumlahUnit(existing.jumlah_unit);
        setTglDari(existing.tgl_dari);
        setBulanDari(existing.bulan_dari);
        setTahunDari(existing.tahun_dari);
        setTglSampai(existing.tgl_sampai);
        setBulanSampai(existing.bulan_sampai);
        setTahunSampai(existing.tahun_sampai);
        setUraianSelama(existing.uraian_selama);
        setDikeluarkanDi(existing.dikeluarkan_di);
        setTglPenetapan(existing.tgl_penetapan);
        setBulanPenetapan(existing.bulan_penetapan);
        setTahunPenetapan(existing.tahun_penetapan);
        setLokasi(existing.lokasi);
        setNamaKegiatanSewa(existing.nama_kegiatan_sewa || 'PENYEDIAAN ALAT ANGKUTAN DARAT');
        setDalamRangka(existing.dalam_rangka || 'DALAM RANGKA KEGIATAN PENERIMAAN CPNS');
        setPadaSubKegiatan(existing.pada_sub_kegiatan || currentPesanan.sub_kegiatan || 'PADA SUB KEGIATAN PENYEDIAAN BAHAN LOGISTIK KANTOR');
        setPekerjaan(existing.pekerjaan || 'Penyediaan Alat Angkutan Darat Roda Empat');
        setDurasiHari(existing.durasi_hari || '3 (Tiga)');
        setRentangTanggal(existing.rentang_tanggal || '25 s.d. 27 Februari 2026');
        setHargaSewaTerbilang(existing.harga_sewa_terbilang || terbilang(existing.harga_sewa));
      } else {
        // Defaults from active PO
        setNoSurat(`900/     /II/${tahunPenetapan}`);
        setPihakPertama(currentPesanan.kepala_kantor);
        setNipPihakPertama(currentPesanan.nip_kepala_kantor);
        setJabatanPihakPertama(calculatedJabatan);
        setAlamatPihakPertama('Jl. Karet Putih - Labuha');
        setPihakKedua(currentPesanan.nama_pemilik || currentPesanan.kepada);
        setAlamatPihakKedua(currentPesanan.alamat_pemilik || 'Desa Tomori');
        setUntukKegiatan(currentPesanan.sub_kegiatan);
        setHargaSewa(currentPesanan.total_bruto);
        setJumlahUnit(1);
        setNamaKegiatanSewa('PENYEDIAAN ALAT ANGKUTAN DARAT');
        setDalamRangka('DALAM RANGKA KEGIATAN PENERIMAAN CPNS');
        setPadaSubKegiatan(currentPesanan.sub_kegiatan || 'PADA SUB KEGIATAN PENYEDIAAN BAHAN LOGISTIK KANTOR');
        setPekerjaan('Penyediaan Alat Angkutan Darat Roda Empat');
        setDurasiHari('3 (Tiga)');
        setRentangTanggal('25 s.d. 27 Februari 2026');
        setHargaSewaTerbilang(terbilang(currentPesanan.total_bruto));
      }
    }
  }, [currentPesanan, sewaList, pejabatKeuanganList]);

  const handleSaveSewa = () => {
    if (!currentPesanan) {
      alert('Pilih/Simpan data Pesanan terlebih dahulu.');
      return;
    }

    const payload: Sewa = {
      id_sewa: `sewa_${currentPesanan.id_pesanan}`,
      id_pesanan: currentPesanan.id_pesanan,
      no_surat: noSurat,
      nama_pihak_pertama: pihakPertama,
      nip_pihak_pertama: nipPihakPertama,
      jabatan_pihak_pertama: jabatanPihakPertama,
      alamat_pihak_pertama: alamatPihakPertama,
      nama_pihak_kedua: pihakKedua,
      alamat_pihak_kedua: alamatPihakKedua,
      untuk_kegiatan: untukKegiatan,
      harga_sewa: hargaSewa,
      jumlah_unit: jumlahUnit,
      tgl_dari: tglDari,
      bulan_dari: bulanDari,
      tahun_dari: tahunDari,
      tgl_sampai: tglSampai,
      bulan_sampai: bulanSampai,
      tahun_sampai: tahunSampai,
      uraian_selama: uraianSelama,
      dikeluarkan_di: dikeluarkanDi,
      tgl_penetapan: tglPenetapan,
      bulan_penetapan: bulanPenetapan,
      tahun_penetapan: tahunPenetapan,
      lokasi,
      nama_kegiatan_sewa: namaKegiatanSewa,
      dalam_rangka: dalamRangka,
      pada_sub_kegiatan: padaSubKegiatan,
      pekerjaan,
      durasi_hari: durasiHari,
      rentang_tanggal: rentangTanggal,
      harga_sewa_terbilang: hargaSewaTerbilang
    };
    onSaveSewa(payload);
    return payload;
  };

  const handleSaveAndPrint = (print: boolean) => {
    handleSaveSewa();
    if (print && onTriggerPrint) {
      setTimeout(() => {
        onTriggerPrint('sewa');
      }, 300);
    }
  };

  if (!isOpen) return null;

  if (!currentPesanan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-[#1E293B] border border-amber-500/30 text-amber-200 rounded-xl p-5 flex items-center gap-3 shadow-lg relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-white"><X size={16} /></button>
          <FileText className="shrink-0 text-amber-500 animate-pulse" size={20} />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 font-mono">Pilih Nota Pesanan Terlebih Dahulu</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Surat Perjanjian Sewa bergantung pada data relasi Pesanan.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Perjanjian Sewa Harian
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
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">No. Surat Perjanjian</label>
            <input
              type="text"
              value={noSurat}
              onChange={(e) => setNoSurat(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Harga Sewa Sepakat (Rp)</label>
            <input
              type="text"
              value={formatNumberWithSeparator(hargaSewa)}
              onChange={(e) => setHargaSewa(parseSeparatorToNumber(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 font-bold text-xs font-mono text-right"
            />
          </div>
        </div>

        {/* Pihak Pertama & Kedua Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-2">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide font-mono">Pihak Pertama (Penyewa)</span>
            <input
              type="text"
              value={pihakPertama}
              onChange={(e) => setPihakPertama(e.target.value)}
              placeholder="Nama PPK..."
              className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-semibold"
            />
            <input
              type="text"
              value={nipPihakPertama}
              onChange={(e) => setNipPihakPertama(e.target.value)}
              placeholder="NIP..."
              className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-mono"
            />
          </div>

          <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-2">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide font-mono">Pihak Kedua (Penyedia)</span>
            <input
              type="text"
              value={pihakKedua}
              onChange={(e) => setPihakKedua(e.target.value)}
              placeholder="Nama Pihak Kedua..."
              className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-semibold"
            />
            <input
              type="text"
              value={alamatPihakKedua}
              onChange={(e) => setAlamatPihakKedua(e.target.value)}
              placeholder="Alamat..."
              className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Date Ranges selectors */}
        <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-3">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-mono">
            <Calendar size={13} className="text-indigo-400" />
            Rentang Waktu Kontrak Sewa (Volume Hari)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Dari Tanggal */}
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Dari Tanggal</label>
              <DatePicker
                value={getDariDateString()}
                onChange={handleDariDateChange}
              />
            </div>

            {/* Sampai Tanggal */}
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Sampai Tanggal</label>
              <DatePicker
                value={getSampaiDateString()}
                onChange={handleSampaiDateChange}
              />
            </div>
          </div>

          {/* Spell out Calculated Output */}
          <div className="bg-[#0F172A] border border-slate-700/50 p-2.5 rounded-lg flex items-start gap-2">
            <Sparkles size={14} className="text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Kalkulasi Durasi Sewa (Sistem)</span>
              <p className="text-xs font-semibold text-slate-200 leading-relaxed mt-0.5">
                {uraianSelama}
              </p>
            </div>
          </div>
        </div>

        {/* Custom Layout Customizer matching the user's template image */}
        <div className="p-3 bg-[#131E35] border border-violet-500/30 rounded-lg space-y-3">
          <p className="text-xs font-bold text-violet-300 uppercase tracking-wide flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></span>
            Format Kop & Detail Perjanjian (Sesuai Gambar Format)
          </p>
          <div className="space-y-3">
            <div className="flex flex-col gap-3">
              <div className="w-full">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Judul Baris 1</label>
                <input
                  type="text"
                  value={namaKegiatanSewa}
                  onChange={(e) => setNamaKegiatanSewa(e.target.value)}
                  placeholder="E.g. PENYEDIAAN ALAT ANGKUTAN DARAT"
                  className="w-full mt-1 px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
                />
              </div>
              <div className="w-full">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Judul Baris 2</label>
                <input
                  type="text"
                  value={dalamRangka}
                  onChange={(e) => setDalamRangka(e.target.value)}
                  placeholder="E.g. DALAM RANGKA KEGIATAN PENERIMAAN CPNS"
                  className="w-full mt-1 px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
                />
              </div>
              <div className="w-full">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Judul Baris 3</label>
                <input
                  type="text"
                  value={padaSubKegiatan}
                  onChange={(e) => setPadaSubKegiatan(e.target.value)}
                  placeholder="E.g. PADA SUB KEGIATAN..."
                  className="w-full mt-1 px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Pekerjaan (Pasal 1)</label>
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Terbilang Harga (E.g. Tujuh Puluh Enam Ribu)</label>
                <input
                  type="text"
                  value={hargaSewaTerbilang}
                  onChange={(e) => setHargaSewaTerbilang(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Durasi Hari (E.g. 3 (Tiga))</label>
                <input
                  type="text"
                  value={durasiHari}
                  onChange={(e) => setDurasiHari(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Rentang Tanggal (E.g. 25 s.d. 27 Februari 2026)</label>
                <input
                  type="text"
                  value={rentangTanggal}
                  onChange={(e) => setRentangTanggal(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Untuk Kegiatan</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={untukKegiatan}
              onFocus={() => setShowKegiatanDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowKegiatanDropdown(false), 200);
              }}
              onChange={(e) => setUntukKegiatan(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
              placeholder="Ketik untuk menambah opsi baru..."
            />
            <button
              type="button"
              onClick={() => saveKegiatanOption(untukKegiatan)}
              className="shrink-0 p-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 rounded-lg transition"
              title="Simpan sebagai opsi"
            >
              <Save size={14} />
            </button>
          </div>
          {showKegiatanDropdown && kegiatanOptions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
              {kegiatanOptions.map((opt, idx) => (
                <div key={idx} className="flex justify-between items-center px-3 py-2 hover:bg-slate-700 cursor-pointer text-xs text-slate-200" onClick={() => setUntukKegiatan(opt)}>
                  <span>{opt}</span>
                  <button
                    type="button"
                    onClick={(e) => removeKegiatanOption(e, opt)}
                    className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location / Dates */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lokasi Sewa / Fasilitas</label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Penetapan Kontrak</label>
            <DatePicker
              value={getPenetapanDateString()}
              onChange={handlePenetapanDateChange}
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

      {/* Side info specs */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-3">
          <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
            <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
            Unit Peralatan Sewa
          </h3>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Jumlah Unit Sewaan</label>
            <select
              value={jumlahUnit}
              onChange={(e) => setJumlahUnit(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs"
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map(u => (
                <option key={u} value={u} className="bg-[#1E293B]">{u} Unit</option>
              ))}
            </select>
          </div>
          <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-1.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Pihak Pertama Alamat Kantor</p>
            <textarea
              value={alamatPihakPertama}
              onChange={(e) => setAlamatPihakPertama(e.target.value)}
              rows={3}
              className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Relation badge */}
        <div className="bg-[#0F172A] border border-indigo-950 p-4 rounded-xl text-indigo-300 space-y-2">
          <h4 className="font-bold text-xs text-indigo-400 font-mono uppercase tracking-wider">Ikatan Hukum Sewa</h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Perjanjian Sewa ini mengikat nilai anggaran bruto Rp {hargaSewa.toLocaleString('id-ID')} dengan rincian durasi harian yang dihitung secara dinamis demi kepatuhan audit.
          </p>
        </div>
      </div>

          </div>
        </div>
      </div>
    </div>
  );
}
