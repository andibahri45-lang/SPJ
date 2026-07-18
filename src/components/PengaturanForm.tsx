import { useState, FormEvent, DragEvent, ChangeEvent } from 'react';
import { KopSurat } from '../types';
import { Save, Settings, Landmark, MapPin, Phone, Globe, Mail, RotateCcw, Upload, Image, Trash2 } from 'lucide-react';

interface PengaturanFormProps {
  kopSurat: KopSurat;
  onSaveKopSurat: (kop: KopSurat) => void;
}

export default function PengaturanForm({ kopSurat, onSaveKopSurat }: PengaturanFormProps) {
  const [pemerintahDaerah, setPemerintahDaerah] = useState(kopSurat.pemerintahDaerah);
  const [namaDinas, setNamaDinas] = useState(kopSurat.namaDinas);
  const [alamatJalan, setAlamatJalan] = useState(kopSurat.alamatJalan);
  const [teleponFaksimile, setTeleponFaksimile] = useState(kopSurat.teleponFaksimile);
  const [website, setWebsite] = useState(kopSurat.website);
  const [email, setEmail] = useState(kopSurat.email);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(kopSurat.logoUrl);
  
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon unggah file gambar saja (PNG, JPG, JPEG, SVG, dll).');
      return;
    }
    // Limit to 2MB to keep localStorage reasonable
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 2MB untuk menjaga performa penyimpanan lokal.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(undefined);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveKopSurat({
      pemerintahDaerah,
      namaDinas,
      alamatJalan,
      teleponFaksimile,
      website,
      email,
      logoUrl,
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleResetDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan Kop Surat ke pengaturan bawaan?')) {
      setPemerintahDaerah('PEMERINTAH KABUPATEN HALMAHERA SELATAN');
      setNamaDinas('BADAN KEPEGAWAIAN, PENDIDIKAN DAN PELATIHAN DAERAH (BKPPD)');
      setAlamatJalan('Kompleks Perkantoran Pemerintah Daerah Kab. Halmahera Selatan, Labuha');
      setTeleponFaksimile('');
      setWebsite('');
      setEmail('');
      setLogoUrl(undefined);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings Form */}
      <div className="lg:col-span-8 bg-[#1E293B] border border-slate-700/80 rounded-xl p-6 shadow-md space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wider font-mono">
          <Settings className="text-indigo-400" size={16} />
          Pengaturan Kop Surat Global
        </h3>

        {successMsg && (
          <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Kop Surat berhasil diperbarui dan disimpan secara permanen di cache lokal!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Logo Upload Section */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Image size={12} className="text-indigo-400" />
                Logo Kop Surat (Instansi)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* File Upload Target */}
                <div className="md:col-span-8">
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-4 transition text-center flex flex-col items-center justify-center cursor-pointer min-h-[120px] ${
                      dragActive
                        ? 'border-indigo-400 bg-indigo-950/20'
                        : 'border-slate-700 hover:border-slate-600 bg-[#0F172A]'
                    }`}
                  >
                    <input
                      id="logo-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <p className="text-xs text-slate-200 font-semibold">
                      Tarik & Letakkan berkas logo atau <span className="text-indigo-400 underline">Pilih berkas</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      PNG, JPG, JPEG, SVG (Maks. 2MB)
                    </p>
                  </div>
                </div>

                {/* Preview / Action of uploaded logo */}
                <div className="md:col-span-4 flex items-center justify-center border border-slate-700/60 bg-[#0F172A]/50 rounded-lg p-4 min-h-[120px]">
                  {logoUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center border border-slate-700 shadow-inner">
                        <img
                          src={logoUrl}
                          alt="Logo Terunggah"
                          className="max-w-full max-h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="py-1 px-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[10px] font-bold rounded border border-red-500/20 transition flex items-center gap-1"
                      >
                        <Trash2 size={11} />
                        Hapus Logo
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs flex flex-col items-center gap-1">
                      <Image size={18} className="text-slate-600 mb-1" />
                      <span>Belum ada logo</span>
                      <span className="text-[9px] text-slate-600">(Menggunakan default tanpa logo)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pemda */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Landmark size={12} className="text-slate-500" />
                Kop Pemerintah Daerah
              </label>
              <input
                type="text"
                value={pemerintahDaerah}
                onChange={(e) => setPemerintahDaerah(e.target.value)}
                placeholder="PEMERINTAH KABUPATEN HALMAHERA SELATAN"
                required
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500/80 transition"
              />
            </div>

            {/* Nama Dinas */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Landmark size={12} className="text-indigo-400" />
                Kop Nama Dinas/Badan
              </label>
              <textarea
                value={namaDinas}
                onChange={(e) => setNamaDinas(e.target.value)}
                placeholder="BADAN KEPEGAWAIAN, PENDIDIKAN DAN PELATIHAN DAERAH (BKPPD)"
                required
                rows={2}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500/80 transition resize-none leading-relaxed"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin size={12} className="text-emerald-400" />
                Alamat Jalan
              </label>
              <input
                type="text"
                value={alamatJalan}
                onChange={(e) => setAlamatJalan(e.target.value)}
                placeholder="Jl. Raya Tomori Pohon Karet (0927) 21001 - 21331"
                required
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 transition"
              />
            </div>

            {/* Grid 3-col untuk Opsional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Telepon & Fax */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone size={11} className="text-amber-400" />
                  Telepon & Faksimile (Opsional)
                </label>
                <input
                  type="text"
                  value={teleponFaksimile}
                  onChange={(e) => setTeleponFaksimile(e.target.value)}
                  placeholder="Contoh: Telp: 081xxx | Fax: 081xxx"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 transition"
                />
              </div>

              {/* Laman Website */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Globe size={11} className="text-cyan-400" />
                  Laman Website (Opsional)
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Contoh: bkpsdm.halselkab.go.id"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail size={11} className="text-violet-400" />
                  Email (Opsional)
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: info@bkpsdm.halselkab.go.id"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 transition"
                />
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              Default / Reset
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md border border-indigo-500"
            >
              <Save size={13} />
              Simpan Kop Surat
            </button>
          </div>
        </form>
      </div>

      {/* Info Panel / Preview */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-4">
          <h4 className="text-xs font-bold text-white border-b border-slate-700 pb-2 uppercase tracking-wider font-mono">
            Pratinjau Kop Terkini
          </h4>

          {/* Visual letterhead simulator */}
          <div className="bg-white text-black p-4 rounded-lg border border-slate-300 font-serif text-[10px] leading-relaxed shadow-inner select-none flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Instansi"
                className="w-10 h-10 object-contain shrink-0 animate-fade-in"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className="flex-1 text-center">
              <h5 className="font-bold uppercase tracking-wide text-[9px] leading-tight">
                {pemerintahDaerah || 'PEMERINTAH KABUPATEN HALMAHERA SELATAN'}
              </h5>
              <h6 className="font-semibold uppercase text-[9px] leading-tight text-gray-800 mt-0.5">
                {namaDinas || 'BADAN KEPEGAWAIAN, PENDIDIKAN DAN PELATIHAN DAERAH'}
              </h6>
              <div className="w-full h-[1px] bg-black my-1"></div>
              <p className="text-[7px] italic text-gray-600 leading-normal">
                Alamat: {alamatJalan || 'Kompleks Perkantoran Pemerintah Daerah Kab. Halmahera Selatan, Labuha'}
                {teleponFaksimile ? ` | ${teleponFaksimile}` : ''}
                {website ? ` | ${website}` : ''}
                {email ? ` | ${email}` : ''}
              </p>
            </div>
            {logoUrl && <div className="w-10 shrink-0" />}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Perubahan kop surat di atas akan langsung diaplikasikan ke seluruh pratinjau dokumen cetak resmi, mencakup:
          </p>
          <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 font-mono pl-1">
            <li>Nota Pesanan (PO)</li>
            <li>Kwitansi Pembayaran</li>
            <li>Berita Acara Serah Terima (BAST)</li>
            <li>Perjanjian Sewa Barang/Jasa</li>
          </ul>
        </div>

        {/* Integration Note */}
        <div className="bg-[#0F172A] border border-indigo-950 p-4 rounded-xl text-indigo-300 space-y-2">
          <h4 className="font-bold text-xs text-indigo-400 font-mono uppercase tracking-wider">Identitas Instansi</h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Kop surat ini bertindak sebagai representasi hukum entitas instansi asal dalam seluruh administrasi dokumen anggaran di wilayah Kabupaten Halmahera Selatan.
          </p>
        </div>
      </div>
    </div>
  );
}
