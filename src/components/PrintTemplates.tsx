import { Pesanan, ItemBarang, Kwitansi, BAST, Sewa, NotaBalasan, KopSurat, RekapBelanja, terbilang, BASTRekapan, KwitansiBesar } from '../types';

interface PrintProps {
  bastRekapan?: BASTRekapan;
  kwitansiBesar?: KwitansiBesar;
  rekapBelanja?: RekapBelanja;
  rekapItems?: Pesanan[];
  pesanan?: Pesanan;
  items?: ItemBarang[];
  kwitansi?: Kwitansi;
  bast?: BAST;
  sewa?: Sewa;
  balasan?: NotaBalasan;
  documentType: ('nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | 'kwitansi_besar' | 'bast_rekapan') | Array<'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | 'kwitansi_besar' | 'bast_rekapan'>;
  kopSurat?: KopSurat;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function HeaderKop({ kopSurat }: { kopSurat?: KopSurat }) {
  return (
    <div className="border-b-4 border-double border-black pb-2 flex items-center gap-4">
      {kopSurat?.logoUrl ? (
        <img
          src={kopSurat.logoUrl}
          alt="Logo Instansi"
          className="w-20 h-20 object-contain shrink-0"
          referrerPolicy="no-referrer"
        />
      ) : (
        null
      )}
      <div className="flex-1 text-center font-serif">
        <h1 className="text-lg font-bold uppercase tracking-wide leading-tight text-black">
          {kopSurat?.pemerintahDaerah || 'PEMERINTAH KABUPATEN HALMAHERA SELATAN'}
        </h1>
        <h2 className="text-md font-bold uppercase tracking-wide mt-0.5 leading-tight text-black whitespace-pre-line">
          {kopSurat?.namaDinas || 'BADAN KEPEGAWAIAN PENDIDIKAN DAN\nPELATIHAN DAERAH'}
        </h2>
        <p className="text-xs font-serif mt-1 text-gray-800 leading-normal italic">
          {kopSurat?.alamatJalan || 'Jl. Kebun Karet No.1 Tlpn. Tomori'}
          {kopSurat?.teleponFaksimile ? ` Tlpn. ${kopSurat.teleponFaksimile}` : ''}
          {kopSurat?.website ? ` | ${kopSurat.website}` : ''}
          {kopSurat?.email ? ` | ${kopSurat.email}` : ''}
        </p>
          </div>
      {kopSurat?.logoUrl && (
        <div className="w-20 shrink-0" aria-hidden="true" />
      )}
        </div>
  );
}

// Spelled out helpers for dates
function getNamaHari(tglStr: string, blnStr: string, thnStr: string): string {
  try {
    const months: Record<string, number> = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
      'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    const day = parseInt(tglStr, 10);
    const year = parseInt(thnStr, 10);
    const month = months[blnStr] !== undefined ? months[blnStr] : 0;
    if (isNaN(day) || isNaN(year)) return '________________';
    const dateObj = new Date(year, month, day);
    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return daysIndo[dateObj.getDay()];
  } catch (e) {
    return '________________';
  }
}

function ejaTanggal(tglStr: string, blnStr: string, thnStr: string): string {
  const hari = getNamaHari(tglStr, blnStr, thnStr);
  const tglAngka = parseInt(tglStr, 10);
  const thnAngka = parseInt(thnStr, 10);
  const tglEja = isNaN(tglAngka) ? '__________' : terbilang(tglAngka);
  const thnEja = isNaN(thnAngka) ? '__________' : terbilang(thnAngka);
  return `Hari ini ${hari} Tanggal ${tglEja} Bulan ${blnStr} Tahun ${thnEja}`;
}

function titleCase(str: string): string {
  if (!str) return '';
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function PrintTemplates({ rekapBelanja, rekapItems, pesanan, items, kwitansi, bast, sewa, balasan, documentType, kopSurat }: PrintProps) {
  const currentYear = new Date().getFullYear();
  const docTypes = Array.isArray(documentType) ? documentType : [documentType];

  return (
    <>
      {docTypes.map((type, index) => (
        <div key={`${type}-${index}`} className={`bg-white text-black p-8 font-serif leading-relaxed max-w-[800px] mx-auto print:p-0 print:m-0 print:max-w-full text-sm ${index < docTypes.length - 1 ? 'break-after-page print:break-after-page [page-break-after:always]' : ''}`}>
          {/* ==================== NOTA PESANAN ==================== */}
      {type === 'nota' && pesanan && items && (
        <div id="print-nota" className="space-y-6">
          {/* Header */}
          <HeaderKop kopSurat={kopSurat} />

          {/* Title block */}
          <div className="text-center">
            <h3 className="text-[15px] font-bold underline uppercase tracking-wider leading-none">NOTA PESANAN</h3>
            <p className="text-sm mt-1">Nomor : {pesanan.no_nota || `900/        /BKPPD-HS/II/${currentYear}`}</p>
              </div>

          {/* Address */}
          <div className="my-5 space-y-1 text-center font-serif text-[13px] leading-relaxed">
            <p>Kepada</p>
            <p className="font-semibold">Yth. Pemilik {pesanan.kepada || '________________'}</p>
            <p>di &ndash; Tempat</p>
              </div>

          {/* Intro clause */}
          <div className="my-5">
            <p className="text-justify font-serif leading-relaxed text-[13px]">
              Terlampir Bersama Ini Kami Sampaikan Nota Pesanan Untuk Kebutuhan Kantor Berupa <span className="font-semibold">{pesanan.uraian_belanja || 'Belanja Alat/Bahan untuk Kegiatan Kantor- Kertas dan Cover'}</span> Pada BKPPD Kabupaten Halmahera Selatan di Mohon Kepada Pemilik Toko Dapat Melayani Permintaan Kami Sebagai Berikut:
            </p>
              </div>

          {/* Items Table - No prices, exactly like screenshot */}
          <table className="w-full border-collapse border border-black text-[13px] font-serif mt-4">
            <thead>
              <tr className="uppercase font-bold text-center">
                <th className="border border-black p-2 w-14">NO</th>
                <th className="border border-black p-2 text-center">NAMA BARANG</th>
                <th className="border border-black p-2 w-36 text-center">JUMLAH</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border border-black p-4 text-center text-gray-400 italic">Belum ada item pesanan</td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="text-center h-8">
                    <td className="border border-black p-2 text-center">{index + 1}</td>
                    <td className="border border-black p-2 text-left px-3">{item.nama_barang}</td>
                    <td className="border border-black p-2 text-center">{item.volume} {item.ket_volume}</td>
                  </tr>
                ))
              )}
              {/* Optional Empty rows for layout parity */}
              <tr className="h-8">
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>

          {/* Signatures block exactly like screenshot */}
          <div className="grid grid-cols-2 gap-4 mt-12 text-[13px] font-serif leading-normal">
            <div className="text-center space-y-20">
              <div className="leading-normal">
                <p>Mengetahui</p>
                <p className="font-medium max-w-[280px] mx-auto">
                  {kopSurat?.namaDinas?.includes('BADAN KEPEGAWAIAN') ? (
                    <>
                      Kepala Badan Kepegawaian Pendidikan<br />dan Pelatihan Daerah
                    </>
                  ) : (
                    `Kepala ${kopSurat?.namaDinas || 'Badan Kepegawaian, Pendidikan dan Pelatihan Daerah'}`
                  )}
                </p>
              </div>
              <div className="leading-tight">
                <p className="underline font-bold uppercase">{pesanan.kepala_kantor || 'Dr. ABDILLAH KAMARULLAH, SE.,MM'}</p>
                <p className="mt-0.5">NIP {pesanan.nip_kepala_kantor || '19760211 200808 1 001'}</p>
                  </div>
                </div>

            <div className="text-center space-y-20">
              <div className="leading-normal">
                <p>{pesanan.dikeluarkan_di || 'Labuha'}, {pesanan.tgl_penetapan} {pesanan.bulan_penetapan} {pesanan.tahun_penetapan || '2026'}</p>
                <p className="font-medium">Bendahara Pengeluaran</p>
                  </div>
              <div className="leading-tight">
                <p className="underline font-bold uppercase">{pesanan.bendahara || 'ARSADI LAHABIRU'}</p>
                <p className="mt-0.5">NIP {pesanan.nip_bendahara || '{k.nip_bendahara}'}</p>
                  </div>
                </div>
              </div>
            </div>
      )}

      {/* ==================== NOTA BALASAN ==================== */}
      {type === 'balasan' && pesanan && items && (
        <div id="print-balasan" className="space-y-6 font-serif">
          {/* Title block */}
          <div className="text-center pt-6">
            <h3 className="text-base font-bold underline uppercase tracking-wide">NOTA BALASAN</h3>
              </div>

          {/* Address */}
          <div className="my-6 space-y-1">
            <p className="font-serif">Kepada</p>
            <p className="font-serif font-semibold">
              Yth. Kepala {kopSurat?.namaDinas || 'BADAN KEPEGAWAIAN, PENDIDIKAN DAN PELATIHAN DAERAH'}
            </p>
            <p className="font-serif">Kabupaten Halmahera Selatan</p>
            <p className="font-serif pl-8">di - Tempat</p>
              </div>

          {/* Opening paragraph */}
          <div className="my-6">
            <p className="text-justify leading-relaxed text-xs">
              {balasan?.keterangan_nota ? (
                balasan.keterangan_nota
              ) : (
                <>
                  Merujuk Surat Nomor <span className="font-semibold">{balasan?.no_rujukan || pesanan.no_nota || '900/_____/BKPPD-HS/II/2026'}</span> Tanggal <span className="font-semibold">{balasan?.tgl_penetapan || pesanan.tgl_penetapan} {balasan?.bulan_penetapan || pesanan.bulan_penetapan} {balasan?.tahun_penetapan || pesanan.tahun_penetapan || '2026'}</span> Tentang Pesanan Maka Kami Dapat Sampaikan Sesuai Dengan Rincian Sebagai Berikut :
                </>
              )}
            </p>
          </div>

          {/* Items Table with Prices */}
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="uppercase font-bold text-center">
                <th className="border border-black p-2 w-10">NO</th>
                <th className="border border-black p-2 text-left">NAMA BARANG</th>
                <th className="border border-black p-2 w-24">VOLUME</th>
                <th className="border border-black p-2 w-32">HARGA SATUAN (Rp)</th>
                <th className="border border-black p-2 w-32">JUMLAH (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border border-black p-4 text-center text-gray-400 italic">Belum ada item pesanan</td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="text-center">
                    <td className="border border-black p-2">{index + 1}</td>
                    <td className="border border-black p-2 text-left">{item.nama_barang}</td>
                    <td className="border border-black p-2">{item.volume} {item.ket_volume}</td>
                    <td className="border border-black p-2 text-right">{formatRupiah(item.harga_satuan).replace('Rp', '').trim()}</td>
                    <td className="border border-black p-2 text-right">{formatRupiah(item.jumlah).replace('Rp', '').trim()}</td>
                  </tr>
                ))
              )}
              {/* Calculations Block as in Screenshot */}
              <tr className="font-bold text-right">
                <td colSpan={4} className="border border-black p-2 text-right uppercase tracking-wider">TOTAL</td>
                <td className="border border-black p-2">{formatRupiah(pesanan.total_bruto).replace('Rp', '').trim()}</td>
              </tr>
              <tr className="text-right italic">
                <td colSpan={4} className="border border-black p-2 text-right uppercase tracking-wider">PPN</td>
                <td className="border border-black p-2">
                  {pesanan.harga_ppn > 0 ? formatRupiah(pesanan.harga_ppn).replace('Rp', '').trim() : '-'}
                </td>
              </tr>
              <tr className="text-right italic">
                <td colSpan={4} className="border border-black p-2 text-right uppercase tracking-wider">{pesanan.pph_type || 'PPh 22'}</td>
                <td className="border border-black p-2">
                  {pesanan.harga_pph > 0 ? formatRupiah(pesanan.harga_pph).replace('Rp', '').trim() : '-'}
                </td>
              </tr>
              <tr className="font-bold text-right bg-gray-50 text-sm">
                <td colSpan={4} className="border border-black p-2 text-right uppercase tracking-wider text-green-900">JUMLAH BERSIH</td>
                <td className="border border-black p-2 text-green-900">{formatRupiah(pesanan.jumlah_bersih).replace('Rp', '').trim()}</td>
              </tr>
            </tbody>
          </table>

          {/* Supplier Signature Bottom Right */}
          <div className="flex justify-end mt-16 text-xs">
            <div className="text-center space-y-16 w-64">
              <div>
                <p>{balasan?.dikeluarkan_di || pesanan.dikeluarkan_di || 'Labuha'}, {balasan?.tgl_penetapan || pesanan.tgl_penetapan} {balasan?.bulan_penetapan || pesanan.bulan_penetapan} {balasan?.tahun_penetapan || pesanan.tahun_penetapan || '2026'}</p>
                <p className="font-semibold uppercase">Pemilik {balasan?.kepada || pesanan.kepada || '________________'}</p>
                  </div>
              <div>
                <p className="underline font-bold uppercase">{balasan?.nama_pemilik || pesanan.nama_pemilik || 'FAIS SULEMAN'}</p>
                  </div>
                </div>
              </div>
            </div>
      )}

      {/* ==================== KWITANSI ==================== */}
      {type === 'kwitansi' && kwitansi && (
        <div id="print-kwitansi" className="space-y-4 font-serif text-xs">
          
          {/* Main receipt border box */}
          <div className="border border-black p-4 space-y-4">
            
            {/* Top info and Title */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4" />
              <div className="col-span-4 text-center">
                <h3 className="text-sm font-bold underline uppercase tracking-wide">KWITANSI / BUKTI PEMBAYARAN ({kwitansi.lokasi_dana || 'GU'})</h3>
                  </div>
              <div className="col-span-4 text-right text-[10px] leading-tight space-y-0.5">
                <p>Tahun Anggaran : {kwitansi.tahun || currentYear}</p>
                <p>Nomor Bukti : {kwitansi.no_bukti || '______'}</p>
                <p>Kode Rekening : {kwitansi.kode_org || '5.1.02.01.01.0025'}</p>
                  </div>
                </div>

            {/* Fields table */}
            <table className="w-full mt-2 leading-relaxed">
              <tbody>
                <tr className="align-top">
                  <td className="w-40 font-semibold py-1">Sudah Terima Dari</td>
                  <td className="w-4 py-1">:</td>
                  <td className="py-1 uppercase font-medium">{kwitansi.terima_dari || 'Bendahara Pengeluaran BKPPD Kab. Halmahera Selatan'}</td>
                </tr>
                <tr className="align-top">
                  <td className="font-semibold py-1">Jumlah Uang</td>
                  <td className="py-1">:</td>
                  <td className="py-1 text-sm font-bold">
                    <span className="border border-black px-2 py-0.5 bg-gray-50">
                      Rp. {formatRupiah(kwitansi.uang_sejumlah).replace('Rp', '').trim()},-
                    </span>
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="font-semibold py-1">Terbilang</td>
                  <td className="py-1">:</td>
                  <td className="py-1 italic font-medium bg-gray-50 px-2 border border-dashed border-gray-300">
                    # {terbilang(kwitansi.uang_sejumlah)} Rupiah #
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="font-semibold py-1">Untuk Pembayaran</td>
                  <td className="py-1">:</td>
                  <td className="py-1 whitespace-pre-wrap">{kwitansi.untuk_pembayaran}</td>
                </tr>
              </tbody>
            </table>

            {/* Date & Receiver Signature on Right */}
            <div className="flex justify-end mt-4 text-xs">
              <div className="text-center space-y-14 w-64">
                <div>
                  <p className="capitalize">{kwitansi.dikeluarkan_di || 'Labuha'}, {kwitansi.pada_tanggal || '__________'}</p>
                  <p className="font-semibold uppercase">Yang Menerima</p>
                    </div>
                <div>
                  <p className="underline font-bold uppercase">({kwitansi.yang_menerima || 'FAIS SULEMAN'})</p>
                    </div>
                  </div>
                </div>

              </div>

          {/* Double row signature box below receipt */}
          <div className="border border-black p-4 grid grid-cols-2 gap-y-10 gap-x-8 text-[11px] leading-snug">
            
            {/* Left Column top signature (PPTK) */}
            <div className="text-center space-y-12">
              <div>
                <p className="font-semibold uppercase text-gray-900">Pejabat Pelaksana Teknis Kegiatan (PPTK)</p>
                  </div>
              <div>
                <p className="underline font-bold uppercase">{kwitansi.pengurus || '________________'}</p>
                <p>NIP. {kwitansi.nip_pengurus || '________________'}</p>
                  </div>
                </div>

            {/* Right Column top signature (Bendahara) */}
            <div className="text-center space-y-12">
              <div>
                <p className="font-semibold uppercase text-gray-900">Setujui dan Lunas dibayar Tgl, ................</p>
                <p className="font-bold uppercase text-gray-900">Bendahara Pengeluaran</p>
                  </div>
              <div>
                <p className="underline font-bold uppercase">{kwitansi.bendahara || '________________'}</p>
                <p>NIP. {kwitansi.nip_bendahara || '________________'}</p>
                  </div>
                </div>

            {/* Centered Bottom signature (PA/KPA) */}
            <div className="col-span-2 flex justify-center pt-2">
              <div className="text-center space-y-12 w-80">
                <div>
                  <p className="font-semibold uppercase">Mengetahui,</p>
                  <p className="font-bold uppercase">Pengguna Anggaran / KPA</p>
                    </div>
                <div>
                  <p className="underline font-bold uppercase">{kwitansi.kepala_kantor || '________________'}</p>
                  <p>NIP. {kwitansi.nip_kepala_kantor || '________________'}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
      )}

      {/* ==================== BAST ==================== */}
      {type === 'bast' && bast && (
        <div id="print-bast" className="space-y-6 font-serif">
          {/* Header */}
          <HeaderKop kopSurat={kopSurat} />

          {/* Title */}
          <div className="text-center">
            <h3 className="text-base font-bold underline uppercase tracking-wide">BERITA ACARA SERAH TERIMA BARANG</h3>
            <p className="text-xs mt-1">No : {bast.no_bast || '900/_____/BKPPD-HS/______'}</p>
              </div>

          {/* Spelled-out Indonesian Date header */}
          <div className="text-xs leading-relaxed text-justify">
            <p className="indent-8 text-black">
              {ejaTanggal(bast.tgl_penetapan, bast.bulan_penetapan, bast.tahun_penetapan)}, kami yang bertanda tangan di bawah ini:
            </p>
              </div>

          {/* Two parties details block */}
          <div className="space-y-4 text-xs ml-4">
            
            {/* PARTY 1 */}
            <div className="space-y-1">
              <table className="w-full">
                <tbody>
                  <tr className="align-top">
                    <td className="w-20 font-semibold">Nama</td>
                    <td className="w-4">:</td>
                    <td><strong>{bast.nama_pemilik || 'FAIS SULEMAN'}</strong></td>
                  </tr>
                  <tr className="align-top">
                    <td className="font-semibold">Jabatan</td>
                    <td>:</td>
                    <td>{bast.jabatan_pemilik || 'Pemilik Usaha'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="font-semibold">Alamat</td>
                    <td>:</td>
                    <td>{bast.alamat_pemilik || 'Desa Tomori'}</td>
                  </tr>
                </tbody>
              </table>
              <p className="italic text-gray-700 mt-1 pl-4">Selanjutnya disebut sebagai <strong>PIHAK KESATU / PENYERAH</strong>.</p>
                </div>

            {/* PARTY 2 */}
            <div className="space-y-1 pt-2">
              <table className="w-full">
                <tbody>
                  <tr className="align-top">
                    <td className="w-20 font-semibold">Nama</td>
                    <td className="w-4">:</td>
                    <td><strong>{bast.nama_penerima || 'YUDY REINER BOBOR, S.AP'}</strong></td>
                  </tr>
                  <tr className="align-top">
                    <td className="font-semibold">NIP</td>
                    <td>:</td>
                    <td>{bast.nip_penerima || '19780609 200801 1 016'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="font-semibold">Jabatan</td>
                    <td>:</td>
                    <td>{bast.jabatan_penerima || 'Bendahara Barang BKPPD Kab. Halmahera Selatan'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="font-semibold">Instansi</td>
                    <td>:</td>
                    <td>{kopSurat?.namaDinas || 'BADAN KEPEGAWAIAN, PENDIDIKAN DAN PELATIHAN DAERAH'}</td>
                  </tr>
                </tbody>
              </table>
              <p className="italic text-gray-700 mt-1 pl-4">Selanjutnya disebut sebagai <strong>PIHAK KEDUA / PENERIMA</strong>.</p>
                </div>

              </div>

          {/* Statement clauses */}
          <div className="text-xs text-justify leading-relaxed mt-4">
            <p className="indent-8 text-black">
              {bast.keterangan || `PIHAK KESATU menyerahkan belanja barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dalam keadaan baik, lengkap, dan baru sesuai dengan Nota Pesanan Nomor ${pesanan.no_nota || '_____'} Tanggal ${pesanan.tgl_penetapan} ${pesanan.bulan_penetapan} ${pesanan.tahun_penetapan} berupa ${pesanan.uraian_belanja}.`}
            </p>
              </div>

          {/* Centered quoted supplier name */}
          <div className="text-center text-xs py-2">
            <p className="font-semibold italic">&ldquo;{bast.nama_usaha || 'Foto Copy Mandiri'}&rdquo;</p>
            <p className="text-[11px] text-gray-800 capitalize mt-0.5">{bast.dikeluarkan_di || 'Labuha'}, {bast.tgl_penetapan} {bast.bulan_penetapan} {bast.tahun_penetapan}</p>
              </div>

          {/* Tripartite Signatures layout */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 text-[11px] leading-tight text-center mt-6">
            
            <div className="space-y-14">
              <p className="uppercase font-semibold">Yang Menyerahkan<br/>PIHAK KESATU</p>
              <div>
                <p className="underline font-bold uppercase">{bast.nama_pemilik || 'FAIS SULEMAN'}</p>
                <p className="text-gray-500">{bast.jabatan_pemilik || 'Pemilik Usaha'}</p>
                  </div>
                </div>

            <div className="space-y-14">
              <p className="uppercase font-semibold">Yang Menerima<br/>PIHAK KEDUA</p>
              <div>
                <p className="underline font-bold uppercase">{bast.nama_penerima || 'YUDY REINER BOBOR, S.AP'}</p>
                <p>NIP. {bast.nip_penerima || '19780609 200801 1 016'}</p>
                  </div>
                </div>

            {/* Mengetahui Block */}
            <div className="col-span-2 flex justify-center pt-2">
              <div className="space-y-14 w-80 text-center">
                <p className="uppercase font-semibold">MENGETAHUI,<br/>Kepala Badan Kepegawaian, Pendidikan dan Pelatihan Daerah</p>
                <div>
                  <p className="underline font-bold uppercase">{bast.nama_mengetahui || 'Dr. ABDILLAH KAMARULLAH, SE.,MM'}</p>
                  <p>NIP. {bast.nip_mengetahui || '19760211 200808 1 001'}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
      )}

      {/* ==================== SURAT PERJANJIAN SEWA ==================== */}
      {type === 'sewa' && sewa && (() => {
        const dayName = getNamaHari(sewa.tgl_penetapan, sewa.bulan_penetapan, sewa.tahun_penetapan);
        const tglWord = isNaN(parseInt(sewa.tgl_penetapan, 10)) ? '__________' : terbilang(parseInt(sewa.tgl_penetapan, 10));
        const thnWord = isNaN(parseInt(sewa.tahun_penetapan, 10)) ? '__________' : terbilang(parseInt(sewa.tahun_penetapan, 10));

        return (
          <div id="print-sewa" className="font-serif text-black p-2 max-w-2xl mx-auto space-y-4 text-xs leading-normal" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            
            {/* Header / Title block as seen in the uploaded image */}
            <div className="text-center space-y-0.5">
              <h2 className="text-[13px] font-bold tracking-wide uppercase">SURAT PERJANJIAN SEWA</h2>
              <h2 className="text-[13px] font-bold tracking-wide uppercase">{sewa.nama_kegiatan_sewa || 'PENYEDIAAN ALAT ANGKUTAN DARAT'}</h2>
              <h2 className="text-[13px] font-bold tracking-wide uppercase">{sewa.dalam_rangka || 'DALAM RANGKA KEGIATAN PENERIMAAN CPNS'}</h2>
              <h2 className="text-[13px] font-bold tracking-wide uppercase">{sewa.pada_sub_kegiatan || 'PADA SUB KEGIATAN PENYEDIAAN BAHAN LOGISTIK KANTOR'}</h2>
                </div>

            {/* Nomor & Tanggal */}
            <div className="flex justify-center text-[11px] py-1">
              <table>
                <tbody>
                  <tr>
                    <td className="w-16">Nomor</td>
                    <td className="w-4">:</td>
                    <td>{sewa.no_surat || '900/      /II/ 2026'}</td>
                  </tr>
                  <tr>
                    <td>Tanggal</td>
                    <td>:</td>
                    <td>{sewa.tgl_penetapan} {sewa.bulan_penetapan} {sewa.tahun_penetapan}</td>
                  </tr>
                </tbody>
              </table>
                </div>

            {/* Opening Paragraph */}
            <div className="text-[11px] text-justify leading-relaxed mt-3">
              <p>
                Pada Hari ini <span className="font-semibold">{dayName}</span> Tanggal <span className="font-semibold">{titleCase(tglWord)}</span> Bulan <span className="font-semibold">{sewa.bulan_penetapan}</span> Tahun <span className="font-semibold">{titleCase(thnWord)}</span> Bertempat di Kantor Badan Kepegawaian Pendidikan dan Pelatihan Daerah Kabupaten Halmahera Selatan di Labuha, kami yang bertandatangan dibawah ini setuju mengadakan perjanjian antara pihak-pihak:
              </p>
                </div>

            {/* Parties Block */}
            <div className="space-y-2 text-[11px] leading-relaxed pl-2">
              <table className="w-full">
                <tbody>
                  <tr className="align-top">
                    <td className="w-16">Nama</td>
                    <td className="w-4">:</td>
                    <td><strong>{sewa.nama_pihak_pertama}</strong></td>
                  </tr>
                  <tr className="align-top">
                    <td>Jabatan</td>
                    <td>:</td>
                    <td>{sewa.jabatan_pihak_pertama || 'Kepala BKPPD'}</td>
                  </tr>
                  <tr className="align-top">
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{sewa.alamat_pihak_pertama || 'Jl. Karet Putih - Labuha'}</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-1">Yang selanjutnya dalam perjanjian ini di sebut <strong className="uppercase">Pihak Pertama</strong></p>

              <table className="w-full mt-3">
                <tbody>
                  <tr className="align-top">
                    <td className="w-16">Nama</td>
                    <td className="w-4">:</td>
                    <td><strong>{sewa.nama_pihak_kedua}</strong></td>
                  </tr>
                  <tr className="align-top">
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{sewa.alamat_pihak_kedua || 'Desa Tomori'}</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-1">Yang selanjutnya dalam perjanjian ini disebut <strong className="uppercase">Pihak Kedua</strong></p>
                </div>

            {/* Transition Sentence */}
            <div className="text-[11px] text-justify leading-relaxed mt-3">
              <p>
                Dengan ini kedua belah pihak sepakat untuk mengadakan perjanjian kerjasama untuk menangani penyediaan {sewa.pekerjaan || 'Angkutan Darat Roda Empat'} Sebanyak {sewa.jumlah_unit} ({titleCase(terbilang(sewa.jumlah_unit))}) Unit Selama {sewa.durasi_hari || '3 (Tiga)'} Hari Terhitung Mulai Tanggal {sewa.rentang_tanggal || '25 s.d. 27 Februari 2026'}
              </p>
                </div>

            {/* Pasal 1 */}
            <div className="space-y-1 text-[11px] text-justify leading-relaxed mt-4">
              <div className="text-center font-bold">Pasal 1</div>
              <div className="text-center font-bold uppercase"><strong className="uppercase">Pihak Pertama</strong> memberikan tugas kepada <strong className="uppercase">Pihak Kedua</strong> dan diterima <strong className="uppercase">Pihak Kedua</strong></div>
              <table className="w-full mt-1">
                <tbody>
                  <tr className="align-top">
                    <td className="w-20">Pekerjaan</td>
                    <td className="w-4">:</td>
                    <td>{sewa.pekerjaan || 'Penyediaan Alat Angkutan Darat Roda Empat'} sebanyak {sewa.jumlah_unit} ({titleCase(terbilang(sewa.jumlah_unit))}) Unit</td>
                  </tr>
                  <tr className="align-top">
                    <td>Tahun</td>
                    <td>:</td>
                    <td>{sewa.tahun_penetapan || '2026'}</td>
                  </tr>
                  <tr className="align-top">
                    <td>Lokasi</td>
                    <td>:</td>
                    <td>{sewa.lokasi || 'Kab. Halmahera Selatan'}</td>
                  </tr>
                </tbody>
              </table>
                </div>

            {/* Pasal 2 */}
            <div className="space-y-1 text-[11px] text-justify leading-relaxed mt-4">
              <div className="text-center font-bold">Pasal 2</div>
              <div className="text-center font-bold"><strong className="uppercase">Pihak Pertama</strong> membayar secara sekaligus kepada <strong className="uppercase">Pihak Kedua</strong> dengan uraian sebagai berikut:</div>
              <p className="mt-1">
                Jumlah Biaya Penyediaan {sewa.jumlah_unit} ({titleCase(terbilang(sewa.jumlah_unit))}) Unit Mobil Sebesar Rp. {sewa.harga_sewa.toLocaleString('id-ID')},- ({sewa.harga_sewa_terbilang || titleCase(terbilang(sewa.harga_sewa))} Rupiah).
              </p>
                </div>

            {/* Pasal 3 */}
            <div className="space-y-1 text-[11px] text-justify leading-relaxed mt-4">
              <div className="text-center font-bold">Pasal 3</div>
              <p>
                <strong className="uppercase">Pihak Pertama</strong> bertanggungjawab penuh terhadap keamanan serta kerusakan yang ditimbulkan akibat penggunaan.
              </p>
                </div>

            {/* Signatures Title */}
            <div className="text-center text-[11px] font-bold uppercase mt-8 tracking-wide">
              PIHAK-PIHAK YANG MENGADAKAN PERJANJIAN KERJASAMA
                </div>

            {/* Signatures Columns */}
            <div className="grid grid-cols-2 text-[11px] text-center leading-tight pt-4">
              <div className="space-y-20">
                <div className="font-bold uppercase">PIHAK KEDUA</div>
                <div>
                  <p className="font-bold uppercase underline">{sewa.nama_pihak_kedua}</p>
                    </div>
                  </div>

              <div className="space-y-16">
                <div className="font-bold uppercase">
                  PIHAK PERTAMA
                  <br />
                  {sewa.jabatan_pihak_pertama || 'Kepala BKPPD'}
                    </div>
                <div>
                  <p className="font-bold uppercase underline">{sewa.nama_pihak_pertama}</p>
                  <p className="text-[10px] mt-0.5">NIP {sewa.nip_pihak_pertama}</p>
                    </div>
                  </div>
                </div>

              </div>
        );
      })()}

      {type === 'kwitansi_besar' && rekapBelanja && rekapItems && rekapItems.length > 0 && (() => {
        const firstP = rekapItems[0];
        const uangSejumlah = rekapBelanja.jumlah_total;
        
        return (
        <div id="print-kwitansi-besar" className="space-y-4 font-serif text-xs">
          {/* Main receipt border box */}
          <div className="border border-black p-4 space-y-4">
            {/* Top info and Title */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4" />
              <div className="col-span-4 text-center">
                <h3 className="text-sm font-bold underline uppercase tracking-wide">KWITANSI / BUKTI PEMBAYARAN (GU)</h3>
              </div>
              <div className="col-span-4 text-right text-[10px] leading-tight space-y-0.5">
                <p>Tahun Anggaran : {b.tahun_penetapan}</p>
                <p>Nomor Bukti : ______</p>
                <p>Kode Rekening : {firstP.mata_anggaran || '____'}</p>
              </div>
            </div>
            {/* Fields table */}
            <table className="w-full mt-2 leading-relaxed">
              <tbody>
                <tr className="align-top">
                  <td className="w-40 font-semibold py-1">Sudah Terima Dari</td>
                  <td className="w-4 py-1">:</td>
                  <td className="py-1 uppercase font-medium">Bendahara Pengeluaran BKPPD Kab. Halmahera Selatan</td>
                </tr>
                <tr className="align-top">
                  <td className="font-semibold py-1">Jumlah Uang</td>
                  <td className="py-1">:</td>
                  <td className="py-1 text-sm font-bold">
                    <span className="border border-black px-2 py-0.5 bg-gray-50">
                      Rp. {formatRupiah(uangSejumlah).replace('Rp', '').trim()},-
                    </span>
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="font-semibold py-1">Terbilang</td>
                  <td className="py-1">:</td>
                  <td className="py-1 italic font-medium bg-gray-50 px-2 border border-dashed border-gray-300">
                    # {terbilang(uangSejumlah)} Rupiah #
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="font-semibold py-1">Untuk Pembayaran</td>
                  <td className="py-1">:</td>
                  <td className="py-1 whitespace-pre-wrap">{rekapBelanja.uraian_belanja_gabungan}</td>
                </tr>
              </tbody>
            </table>
            {/* Date & Receiver Signature on Right */}
            <div className="flex justify-end mt-4 text-xs">
              <div className="text-center space-y-14 w-64">
                <div>
                  <p className="capitalize">{firstP.dikeluarkan_di || 'Labuha'}, {firstP.tgl_penetapan} {b.bulan_penetapan} {b.tahun_penetapan}</p>
                  <p className="font-semibold uppercase">Yang Menerima</p>
                </div>
                <div>
                  <p className="underline font-bold uppercase">({b.nama_pemilik})</p>
                </div>
              </div>
            </div>
          </div>
          {/* Double row signature box below receipt */}
          <div className="border border-black p-4 grid grid-cols-2 gap-y-10 gap-x-8 text-[11px] leading-snug">
            {/* Left Column top signature (PPTK) */}
            <div className="text-center space-y-12">
              <div>
                <p className="font-semibold uppercase text-gray-900">Pejabat Pelaksana Teknis Kegiatan (PPTK)</p>
              </div>
              <div>
                <p className="underline font-bold uppercase">{firstP.bendahara}</p>
                <p>NIP. {firstP.nip_bendahara}</p>
              </div>
            </div>
            {/* Right Column top signature (Bendahara) */}
            <div className="text-center space-y-12">
              <div>
                <p className="font-semibold uppercase text-gray-900">Setujui dan Lunas dibayar Tgl, ................</p>
                <p className="font-bold uppercase text-gray-900">Bendahara Pengeluaran</p>
              </div>
              <div>
                <p className="underline font-bold uppercase">{firstP.bendahara}</p>
                <p>NIP. {firstP.nip_bendahara}</p>
              </div>
            </div>
            {/* Centered Bottom signature (PA/KPA) */}
            <div className="col-span-2 flex justify-center pt-2">
              <div className="text-center space-y-12 w-80">
                <div>
                  <p className="font-semibold uppercase">Mengetahui,</p>
                  <p className="font-bold uppercase">Pengguna Anggaran / KPA</p>
                </div>
                <div>
                  <p className="underline font-bold uppercase">{b.nama_mengetahui}</p>
                  <p>NIP. {b.nip_mengetahui}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {type === 'bast_rekapan' && (bastRekapan || (rekapBelanja && rekapItems && rekapItems.length > 0)) && (() => {
        const fallbackP = rekapItems && rekapItems.length > 0 ? rekapItems[0] : {} as any;
        const b = bastRekapan || {
          no_bast: '................................',
          nama_pemilik: fallbackP.nama_pemilik || rekapBelanja?.pemilik_toko || '',
          alamat_pemilik: fallbackP.alamat_pemilik || '',
          kepala_kantor: fallbackP.kepala_kantor || '',
          nip_kepala_kantor: fallbackP.nip_kepala_kantor || '',
          tgl_penetapan: fallbackP.tgl_penetapan || '',
          bulan_penetapan: fallbackP.bulan_penetapan || '',
          tahun_penetapan: fallbackP.tahun_penetapan || '',
          nama_usaha: fallbackP.kepada || '',
          jabatan_pemilik: fallbackP.jabatan_pemilik || 'Pemilik Usaha',
          nama_penerima: fallbackP.nama_penerima || 'Indra Kusuma, A.Md.',
          nip_penerima: fallbackP.nip_penerima || '{k.nip_pengurus}',
          jabatan_penerima: fallbackP.jabatan_penerima || 'Penyimpan/Pengurus Barang BKPPD',
          nama_mengetahui: fallbackP.kepala_kantor || '',
          nip_mengetahui: fallbackP.nip_kepala_kantor || '',
          jabatan_mengetahui: fallbackP.jabatan_mengetahui || 'Kepala BKPPD / PPK',
          keterangan: `PIHAK KESATU menyerahkan belanja barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dalam keadaan baik, lengkap, dan baru berupa ${rekapBelanja?.uraian_belanja_gabungan}.`,
          dikeluarkan_di: fallbackP.dikeluarkan_di || 'Labuha'
        };
        
        return (
        <div id="print-bast-rekapan" className="space-y-6 font-serif text-[12px] leading-relaxed">
          <HeaderKop kopSurat={kopSurat} />
          
          <div className="text-center mt-4 mb-8">
            <h3 className="text-base font-bold underline uppercase tracking-wide">BERITA ACARA SERAH TERIMA BARANG</h3>
            <p className="mt-1">Nomor: {b.no_bast}</p>
          </div>
          
          <p className="text-justify indent-8">
            Pada hari ini {getNamaHari(b.tgl_penetapan, b.bulan_penetapan, b.tahun_penetapan)}, tanggal {ejaTanggal(b.tgl_penetapan, b.bulan_penetapan, b.tahun_penetapan).replace(/Hari ini.*?Tanggal/i, '').replace(/Bulan.*/i,'').trim()} bulan {titleCase(b.bulan_penetapan)} tahun {terbilang(parseInt(b.tahun_penetapan, 10) || 0)} kami yang bertanda tangan di bawah ini :
          </p>
          
          <table className="w-full ml-4 my-4">
            <tbody>
              <tr>
                <td className="w-6 align-top">I.</td>
                <td className="w-32 align-top">NAMA</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top font-bold uppercase">{b.nama_pemilik}</td>
              </tr>
              <tr>
                <td className="w-6 align-top"></td>
                <td className="w-32 align-top">ALAMAT PERUSAHAAN</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top">{b.alamat_pemilik}</td>
              </tr>
              <tr>
                <td colSpan={4} className="py-2">Selanjutnya disebut <span className="font-bold">PIHAK KESATU</span></td>
              </tr>
            </tbody>
          </table>
          
          <table className="w-full ml-4 my-4">
            <tbody>
              <tr>
                <td className="w-6 align-top">II.</td>
                <td className="w-32 align-top">NAMA</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top font-bold uppercase">{b.nama_mengetahui}</td>
              </tr>
              <tr>
                <td className="w-6 align-top"></td>
                <td className="w-32 align-top">NIP</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top">{b.nip_mengetahui}</td>
              </tr>
              <tr>
                <td className="w-6 align-top"></td>
                <td className="w-32 align-top">JABATAN</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top">Kepala Badan Kepegawaian, Pendidikan dan Pelatihan Daerah</td>
              </tr>
              <tr>
                <td colSpan={4} className="py-2">Selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span></td>
              </tr>
            </tbody>
          </table>
          
          <p className="text-justify indent-8">
            <span className="font-bold">PIHAK KESATU</span> menyerahkan kepada <span className="font-bold">PIHAK KEDUA</span> barang sesuai dengan Nota Pesanan tanggal {firstP.tgl_penetapan} {b.bulan_penetapan} {b.tahun_penetapan} dengan jenis barang sebagai berikut:
          </p>
          
          <div className="my-4">
             <div className="border border-black p-3 text-center italic">
                {rekapBelanja.uraian_belanja_gabungan}
             </div>
             <p className="mt-2 text-right">
                Jumlah : <span className="font-bold ml-2">Rp. {formatRupiah(rekapBelanja.jumlah_total).replace('Rp','').trim()},-</span>
             </p>
          </div>
          
          <p className="text-justify indent-8">
            <span className="font-bold">PIHAK KEDUA</span> menerima dengan baik penyerahan dari <span className="font-bold">PIHAK KESATU</span>, barang dalam keadaan baik, cukup dan lengkap. Demikian Berita Acara ini kami buat untuk dapat dipergunakan seperlunya.
          </p>
          
          <div className="mt-8 flex justify-between">
            <div className="text-center w-64 space-y-24">
              <p className="uppercase font-semibold">Yang Menyerahkan<br/>PIHAK KESATU</p>
              <div className="border-b border-black inline-block px-4">
                <p className="font-bold uppercase">{b.nama_pemilik}</p>
              </div>
            </div>
            
            <div className="text-center w-64 space-y-24">
              <p className="uppercase font-semibold">Yang Menerima<br/>PIHAK KEDUA</p>
              <div className="border-b border-black inline-block px-4">
                <p className="font-bold uppercase">{b.nama_mengetahui}</p>
                <p className="font-normal mt-0.5">NIP {b.nip_mengetahui}</p>
              </div>
            </div>
          </div>
          
        </div>
        );
      })()}

        </div>
      ))}
    </>
  );
}

export default PrintTemplates;
