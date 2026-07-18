import { useState, useEffect } from 'react';
import { Pesanan, Kwitansi, terbilang, formatNumberWithSeparator, parseSeparatorToNumber } from '../types';
import { formatRupiah } from './PrintTemplates';
import { FileText, Plus, HelpCircle, Save, CheckCircle, ChevronLeft, ChevronRight, X, Printer } from 'lucide-react';

interface KwitansiFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentPesanan: Pesanan | undefined;
  kwitansiList: Kwitansi[];
  onSaveKwitansi: (kwitansi: Kwitansi) => void;
  onTriggerPrint?: (type: 'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa') => void;
}

export default function KwitansiForm({
  isOpen,
  onClose,
  currentPesanan,
  kwitansiList,
  onSaveKwitansi,
  onTriggerPrint
}: KwitansiFormProps) {
  // Local states
  const [noBukti, setNoBukti] = useState('');
  const [npwp, setNpwp] = useState('00.123.456.7-942.000');
  const [kodeOrg, setKodeOrg] = useState('8.01.0.00.0.00.01.0000');
  const [lokasiDana, setLokasiDana] = useState<'GU' | 'TU' | 'LS'>('GU');
  const [tahun, setTahun] = useState(() => String(new Date().getFullYear()));
  const [terimaDari, setTerimaDari] = useState('Bendahara Pengeluaran BKPPD Kab. Halmahera Selatan');
  
  const [uangSejumlah, setUangSejumlah] = useState<number>(0);
  const [untukPembayaran, setUntukPembayaran] = useState('');
  const [dikeluarkanDi, setDikeluarkanDi] = useState('Labuha');
  const [padaTanggal, setPadaTanggal] = useState(() => {
    const today = new Date();
    return `${today.getDate()} ${['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][today.getMonth()]} ${today.getFullYear()}`;
  });

  // Signatories
  const [pengurus, setPengurus] = useState('Samsul Bahri, A.Md.');
  const [nipPengurus, setNipPengurus] = useState('19880502 201101 1 002');
  const [yangMenerima, setYangMenerima] = useState('');
  const [alamatPenerima, setAlamatPenerima] = useState('');

  // Sync with current pesanan selection
  useEffect(() => {
    if (currentPesanan) {
      // Look if there's already a saved kwitansi for this PO
      const existing = kwitansiList.find(k => k.id_pesanan === currentPesanan.id_pesanan);
      
      if (existing) {
        setNoBukti(existing.no_bukti);
        setNpwp(existing.npwp);
        setKodeOrg(existing.kode_org);
        setLokasiDana(existing.lokasi_dana);
        setTahun(existing.tahun);
        setTerimaDari(existing.terima_dari);
        setUangSejumlah(existing.uang_sejumlah);
        setUntukPembayaran(existing.untuk_pembayaran);
        setDikeluarkanDi(existing.dikeluarkan_di);
        setPadaTanggal(existing.pada_tanggal);
        setPengurus(existing.pengurus);
        setNipPengurus(existing.nip_pengurus);
        setYangMenerima(existing.yang_menerima);
        setAlamatPenerima(existing.alamat_penerima);
      } else {
        // Prep defaults from Pesanan metadata
        setNoBukti(`KW/${currentPesanan.id_pesanan}/BKPPD-HS/${tahun}`);
        setUangSejumlah(currentPesanan.total_bruto);
        setYangMenerima(currentPesanan.nama_pemilik || currentPesanan.kepada);
        setAlamatPenerima(currentPesanan.alamat_pemilik);
        
        // Auto-generate Untuk Pembayaran text as default
        setUntukPembayaran(`Pembayaran Belanja ${currentPesanan.uraian_belanja} Guna Kebutuhan Kantor BKPPD Kabupaten Halmahera Selatan.`);
      }
    }
  }, [currentPesanan, kwitansiList]);

  // Append button handlers matching the VBA TambahKata_Click hooks
  const appendBelanja = () => {
    if (currentPesanan) {
      setUntukPembayaran(prev => `${prev} ${currentPesanan.uraian_belanja}.`);
    }
  };

  const appendKebutuhan = () => {
    setUntukPembayaran(prev => `${prev} Kebutuhan Kantor.`);
  };

  const appendSubKeg = () => {
    if (currentPesanan) {
      setUntukPembayaran(prev => `${prev} Pada Sub Kegiatan: ${currentPesanan.sub_kegiatan}.`);
    }
  };

  const handleSaveAndPrint = (shouldPrint: boolean) => {
    if (!currentPesanan) {
      alert('Pilih/Simpan data Pesanan terlebih dahulu sebelum menyimpan kwitansi.');
      return;
    }

    const payload: Kwitansi = {
      id_kwitansi: `kw_${currentPesanan.id_pesanan}`,
      id_pesanan: currentPesanan.id_pesanan,
      no_bukti: noBukti,
      npwp,
      kode_org: kodeOrg,
      lokasi_dana: lokasiDana,
      tahun,
      terima_dari: terimaDari,
      uang_sejumlah: uangSejumlah,
      terbilang: terbilang(uangSejumlah) + ' Rupiah',
      untuk_pembayaran: untukPembayaran,
      dikeluarkan_di: dikeluarkanDi,
      pada_tanggal: padaTanggal,
      bendahara: currentPesanan.bendahara,
      nip_bendahara: currentPesanan.nip_bendahara,
      kepala_kantor: currentPesanan.kepala_kantor,
      nip_kepala_kantor: currentPesanan.nip_kepala_kantor,
      pengurus,
      nip_pengurus: nipPengurus,
      yang_menerima: yangMenerima,
      alamat_penerima: alamatPenerima
    };

    onSaveKwitansi(payload);
    
    if (shouldPrint && onTriggerPrint) {
      setTimeout(() => {
        onTriggerPrint('kwitansi');
      }, 150);
    } else {
      alert(`Data Kwitansi/Tanda Bukti untuk No. Urut ${currentPesanan.id_pesanan} Berhasil Disimpan!`);
    }
  };

  if (!isOpen) return null;

  if (!currentPesanan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-[#1E293B] border border-amber-500/30 text-amber-200 rounded-xl p-5 flex items-center gap-3 shadow-lg relative max-w-lg w-full">
          <button onClick={onClose} className="absolute right-3 top-3 text-slate-400 hover:text-white"><X size={16} /></button>
          <FileText className="shrink-0 text-amber-500 animate-pulse" size={20} />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 font-mono">Pilih Nota Pesanan Terlebih Dahulu</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Kwitansi bergantung pada relasi data Pesanan. Silakan isi dan simpan Data Pesanan pada tab pertama terlebih dahulu.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-violet-500 rounded-full"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Input Kwitansi / Tanda Bukti Kas
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
            {/* Input Controls */}
            <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-4">
              <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
                <span className="w-1 h-3 bg-violet-500 rounded-full"></span>
          Formulir Isian Kwitansi / Tanda Bukti
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">No. Bukti Kwitansi</label>
            <input
              type="text"
              value={noBukti}
              onChange={(e) => setNoBukti(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">NPWP Toko / Usaha</label>
            <input
              type="text"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kode Organisasi (Kop)</label>
            <input
              type="text"
              value={kodeOrg}
              onChange={(e) => setKodeOrg(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sumber Dana / Lokasi</label>
            <select
              value={lokasiDana}
              onChange={(e) => setLokasiDana(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none font-medium"
            >
              <option value="GU" className="bg-[#1E293B]">GU (Ganti Uang)</option>
              <option value="TU" className="bg-[#1E293B]">TU (Tambahan Uang)</option>
              <option value="LS" className="bg-[#1E293B]">LS (Langsung)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahun Anggaran</label>
            <input
              type="text"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sudah Diterima Dari</label>
          <input
            type="text"
            value={terimaDari}
            onChange={(e) => setTerimaDari(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
          />
        </div>

        {/* Dynamic Uang Sejumlah and Spelled-Out (Terbilang) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Uang Sejumlah (Rp)</label>
            <input
              type="text"
              value={formatNumberWithSeparator(uangSejumlah)}
              onChange={(e) => setUangSejumlah(parseSeparatorToNumber(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 font-bold text-xs focus:outline-none focus:border-indigo-500/80 font-mono text-right"
            />
          </div>
          <div className="bg-[#0F172A]/40 border border-slate-700/50 p-2.5 rounded-lg">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Pelafalan Terbilang (Sistem)</span>
            <span className="text-[11px] italic text-indigo-400 font-bold leading-tight block mt-0.5">
              &ldquo;{terbilang(uangSejumlah)} Rupiah&rdquo;
            </span>
          </div>
        </div>

        {/* Untuk Pembayaran with VBA-like quick append shortcuts */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Untuk Pembayaran</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={appendBelanja}
                className="px-1.5 py-0.5 bg-indigo-950/40 text-indigo-400 hover:bg-indigo-900/40 rounded text-[9px] font-bold border border-indigo-900/40"
                title="Tambahkan kata Belanja dari PO"
              >
                + Belanja
              </button>
              <button
                type="button"
                onClick={appendKebutuhan}
                className="px-1.5 py-0.5 bg-indigo-950/40 text-indigo-400 hover:bg-indigo-900/40 rounded text-[9px] font-bold border border-indigo-900/40"
                title="Tambahkan kata Kebutuhan"
              >
                + Kebutuhan
              </button>
              <button
                type="button"
                onClick={appendSubKeg}
                className="px-1.5 py-0.5 bg-indigo-950/40 text-indigo-400 hover:bg-indigo-900/40 rounded text-[9px] font-bold border border-indigo-900/40"
                title="Tambahkan kata Sub Kegiatan"
              >
                + Sub-Keg
              </button>
            </div>
          </div>
          <textarea
            value={untukPembayaran}
            onChange={(e) => setUntukPembayaran(e.target.value)}
            rows={3}
            className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 transition resize-none leading-relaxed"
          ></textarea>
        </div>

        {/* Issue Date & Place */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tempat Pengeluaran</label>
            <input
              type="text"
              value={dikeluarkanDi}
              onChange={(e) => setDikeluarkanDi(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pada Tanggal</label>
            <input
              type="text"
              value={padaTanggal}
              onChange={(e) => setPadaTanggal(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80"
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
            <Save size={13} /> Simpan Saja
          </button>
          
          <button
            type="button"
            onClick={() => handleSaveAndPrint(true)}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md border border-emerald-500"
          >
            <Printer size={13} /> Simpan & Cetak
          </button>
        </div>
      </div>

      {/* Side preview & relational info */}
      <div className="lg:col-span-5 space-y-6">
        {/* Recipient Details & PPTK */}
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-3">
          <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
            <span className="w-1 h-3 bg-teal-500 rounded-full"></span>
            Penerima & Pemeriksa (PPTK)
          </h3>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Nama Penerima / Supplier</label>
            <input
              type="text"
              value={yangMenerima}
              onChange={(e) => setYangMenerima(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Alamat Penerima</label>
            <input
              type="text"
              value={alamatPenerima}
              onChange={(e) => setAlamatPenerima(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>

          <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-2.5">
            <p className="text-xs font-bold text-teal-400 border-b border-slate-700 pb-1 uppercase tracking-wide font-mono">Pemeriksa / PPTK / Pengurus</p>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 mb-0.5 uppercase">Nama Pengurus Barang</label>
              <input
                type="text"
                value={pengurus}
                onChange={(e) => setPengurus(e.target.value)}
                className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 mb-0.5 uppercase">NIP</label>
              <input
                type="text"
                value={nipPengurus}
                onChange={(e) => setNipPengurus(e.target.value)}
                className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Information card */}
        <div className="bg-[#0F172A] border border-indigo-950 p-4 rounded-xl text-indigo-300 space-y-2.5">
          <h4 className="font-bold text-xs text-indigo-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <CheckCircle size={14} /> Relasi Pembayaran Aktif
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Kwitansi ini dibuat otomatis berdasarkan data transaksi dari <strong className="text-indigo-300 font-mono">Nota No. Urut {currentPesanan.id_pesanan}</strong>.
          </p>
          <ul className="text-[10px] font-mono space-y-1 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-900/30 text-indigo-300">
            <li className="truncate">Sub Keg: {currentPesanan.sub_kegiatan}</li>
            <li className="truncate">Belanja: {currentPesanan.uraian_belanja}</li>
            <li>Total Bruto: {formatRupiah(currentPesanan.total_bruto)}</li>
            <li>Netto Bayar: {formatRupiah(currentPesanan.jumlah_bersih)}</li>
          </ul>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}
