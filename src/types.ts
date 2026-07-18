export interface ItemBarang {
  id: string;
  id_pesanan: string;
  no_urut_nota: number;
  nama_barang: string;
  volume: number;
  ket_volume: string;
  harga_satuan: number;
  jumlah: number;
}

export interface Pesanan {
  id_pesanan: string; // matches TXTNOMORURUT
  sub_kegiatan: string;
  uraian_belanja: string;
  mata_anggaran: string;
  bendahara: string;
  nip_bendahara: string;
  kepala_kantor: string;
  nip_kepala_kantor: string;
  no_nota: string;
  keterangan: string;
  kepada: string; // Nama Toko
  nama_pemilik: string;
  alamat_pemilik: string;
  dikeluarkan_di: string;
  tgl_penetapan: string; // DD
  bulan_penetapan: string; // MMMM (e.g. Juli)
  tahun_penetapan: string; // YYYY
  total_bruto: number;
  ppn_resto_type: string;
  persen_ppn: number;
  harga_ppn: number;
  pph_type: string;
  persen_pph: number;
  harga_pph: number;
  jumlah_bersih: number;
}

export interface Kwitansi {
  id_kwitansi: string;
  id_pesanan: string;
  no_bukti: string;
  npwp: string;
  kode_org: string;
  lokasi_dana: 'GU' | 'TU' | 'LS'; // GU, TU, LS
  tahun: string;
  terima_dari: string;
  uang_sejumlah: number;
  terbilang: string;
  untuk_pembayaran: string;
  dikeluarkan_di: string;
  pada_tanggal: string; // full formatted date
  bendahara: string;
  nip_bendahara: string;
  kepala_kantor: string;
  nip_kepala_kantor: string;
  pengurus: string;
  nip_pengurus: string;
  yang_menerima: string;
  alamat_penerima: string;
}

export interface BAST {
  id_bast: string;
  id_pesanan: string;
  no_bast: string;
  nama_usaha: string;
  nama_pemilik: string;
  jabatan_pemilik: string;
  alamat_pemilik: string;
  nama_penerima: string;
  nip_penerima: string;
  jabatan_penerima: string;
  nama_mengetahui: string;
  nip_mengetahui: string;
  jabatan_mengetahui: string;
  keterangan: string;
  dikeluarkan_di: string;
  tgl_penetapan: string;
  bulan_penetapan: string;
  tahun_penetapan: string;
}

export interface Sewa {
  id_sewa: string;
  id_pesanan: string;
  no_surat: string;
  nama_pihak_pertama: string;
  nip_pihak_pertama: string;
  jabatan_pihak_pertama: string;
  alamat_pihak_pertama: string;
  nama_pihak_kedua: string;
  alamat_pihak_kedua: string;
  untuk_kegiatan: string;
  harga_sewa: number;
  jumlah_unit: number;
  tgl_dari: string; // DD
  bulan_dari: string; // MMMM
  tahun_dari: string; // YYYY
  tgl_sampai: string; // DD
  bulan_sampai: string; // MMMM
  tahun_sampai: string; // YYYY
  uraian_selama: string; // X Hari Terhitung Mulai Tanggal ...
  dikeluarkan_di: string;
  tgl_penetapan: string;
  bulan_penetapan: string;
  tahun_penetapan: string;
  lokasi: string;
  nama_kegiatan_sewa?: string;
  dalam_rangka?: string;
  pada_sub_kegiatan?: string;
  pekerjaan?: string;
  durasi_hari?: string;
  rentang_tanggal?: string;
  harga_sewa_terbilang?: string;
}

export interface KopSurat {
  pemerintahDaerah: string;
  namaDinas: string;
  alamatJalan: string;
  teleponFaksimile: string;
  website: string;
  email: string;
  logoUrl?: string;
}

export interface NotaBalasan {
  id_balasan: string;
  id_pesanan: string;
  no_rujukan: string;
  tgl_penetapan: string;
  bulan_penetapan: string;
  tahun_penetapan: string;
  dikeluarkan_di: string;
  kepada: string;
  nama_pemilik: string;
  alamat_toko?: string;
  keterangan_nota?: string;
}

export interface Rekanan {
  id: string;
  nama: string;
  nik: string;
  kategori: string;
  jenis: string;
  perusahaan: string;
  telepon: string;
  npwp: string;
  alamat: string;
  no_rekening: string;
  pemilik_rekening: string;
  bank: string;
}

export const REKANAN_MASTER_SAMPLES: Rekanan[] = [
  {
    id: 'rek1',
    nama: 'ABDILLAH KAMARULLAH',
    nik: '8204081102760004',
    kategori: 'PNS',
    jenis: 'Perorangan',
    perusahaan: 'ABDILLAH KAMARULLAH',
    telepon: '082291681186',
    npwp: '788089159942000',
    alamat: 'Desa Tomori',
    no_rekening: '7022105625',
    pemilik_rekening: 'ABDILLAH KAMARULLAH, SE, MM',
    bank: 'Bank SYARIAH INDONESIA'
  },
  {
    id: 'rek2',
    nama: 'ABDUL CHAIR',
    nik: '8204080106820002',
    kategori: 'NON PNS',
    jenis: 'Perorangan',
    perusahaan: 'ABDUL CHAIR',
    telepon: '0825456212',
    npwp: '727180580942000',
    alamat: 'LABUHA',
    no_rekening: '7189213322',
    pemilik_rekening: 'ABDUL CHAIR',
    bank: 'Bank SYARIAH INDONESIA'
  },
  {
    id: 'rek3',
    nama: 'Abdullah Hi Taher',
    nik: '8273039710710001',
    kategori: 'NON PNS',
    jenis: 'Perorangan',
    perusahaan: 'RM. Gal-Gil',
    telepon: '082195106772',
    npwp: '846629293942000',
    alamat: 'Akehuda',
    no_rekening: '0342269679',
    pemilik_rekening: 'Abdullah Hi Taher',
    bank: 'Bank BNI'
  },
  {
    id: 'rek4',
    nama: 'ABDURRAHMAN AHMAD',
    nik: '8204172411790001',
    kategori: 'NON PNS',
    jenis: 'Perorangan',
    perusahaan: 'Malut POS',
    telepon: '08219105887',
    npwp: '242368587942000',
    alamat: 'Desa mandoang',
    no_rekening: '865051620',
    pemilik_rekening: 'ABDURRAHMAN AHMAD',
    bank: 'Bank SYARIAH INDONESIA'
  }
];

// Spelled-out helpers in Indonesian (Terbilang)
export function terbilang(nominal: number): string {
  if (nominal === 0) return 'Nol';
  
  const angka = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  let hasil = '';

  const formatTerbilang = (n: number): string => {
    let temp = '';
    if (n < 12) {
      temp = ' ' + angka[n];
    } else if (n < 20) {
      temp = formatTerbilang(n - 10) + ' Belas';
    } else if (n < 100) {
      temp = formatTerbilang(Math.floor(n / 10)) + ' Puluh' + formatTerbilang(n % 10);
    } else if (n < 200) {
      temp = ' Seratus' + formatTerbilang(n - 100);
    } else if (n < 1000) {
      temp = formatTerbilang(Math.floor(n / 100)) + ' Ratus' + formatTerbilang(n % 100);
    } else if (n < 2000) {
      temp = ' Seribu' + formatTerbilang(n - 1000);
    } else if (n < 1000000) {
      temp = formatTerbilang(Math.floor(n / 1000)) + ' Ribu' + formatTerbilang(n % 1000);
    } else if (n < 1000000000) {
      temp = formatTerbilang(Math.floor(n / 1000000)) + ' Juta' + formatTerbilang(n % 1000000);
    } else if (n < 1000000000000) {
      temp = formatTerbilang(Math.floor(n / 1000000000)) + ' Milyar' + formatTerbilang(n % 1000000000);
    }
    return temp;
  };

  hasil = formatTerbilang(nominal).trim();
  // Clean up double spaces
  return hasil.replace(/\s+/g, ' ');
}

export function toRoman(num: number): string {
  const roman: { [key: string]: number } = {
    M: 1000, CM: 900, D: 500, CD: 400,
    C: 100, XC: 90, L: 50, XL: 40,
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let str = '';
  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str;
}

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const SUB_KEGIATAN_SAMPLES = [
  'Penyediaan Peralatan dan Perlengkapan Kantor',
  'Penyediaan Jasa Komunikasi, Sumber Daya Air dan Listrik',
  'Pemeliharaan Rutin/Berkala Gedung Kantor',
  'Penyediaan Jasa Peralatan dan Perlengkapan Kantor',
  'Administrasi Kepegawaian Perangkat Daerah'
];

export const URAIAN_BELANJA_SAMPLES = [
  'Belanja Alat Tulis Kantor (ATK)',
  'Belanja Bahan Cetak dan Penggandaan',
  'Belanja Sewa Peralatan Kantor',
  'Belanja Makanan dan Minuman Rapat/Kegiatan',
  'Belanja Suku Cadang Alat Kantor'
];

export const NAMA_BARANG_SAMPLES = [
  'Kertas HVS A4 80gr Sinar Dunia',
  'Kertas HVS F4 80gr Sinar Dunia',
  'Pena Ballliner Pentel Hitam',
  'Spidol Whiteboard Snowman Hitam',
  'Sewa Printer Laserjet Bulanan',
  'Sewa Proyektor & Layar LCD',
  'Nasi Kotak Premium Ayam Bakar',
  'Snack Box Rapat (3 Kue + Air Mineral)',
  'Tinta Printer Epson L3110 Black'
];

export const KEPADA_SAMPLES = [
  { nama: 'Toko Halmahera ATK', pemilik: 'H. Ahmad Fauzi', alamat: 'Jl. Pemuda No. 12, Labuha' },
  { nama: 'CV. Maluku Jaya Abadi', pemilik: 'Andi Setiadi', alamat: 'Jl. Merdeka No. 45, Labuha' },
  { nama: 'Catering Seribu Pulau', pemilik: 'Siti Rahma', alamat: 'Jl. Pantai Indah No. 8, Labuha' },
  { nama: 'PT. Halmahera Rental Solusindo', pemilik: 'Budi Santoso', alamat: 'Jl. Trans Halmahera, Labuha' }
];

export const KET_VOLUME_SAMPLES = ['Rim', 'Pcs', 'Box', 'Pak', 'Unit/Hari', 'Unit/Bulan', 'Porsi', 'Kotak', 'Set'];

export interface SubKegiatan {
  norek_sub_kegiatan: string;
  nama_kegiatan: string;
  norek_perjadin_biasa: string;
  norek_perjadin_dalam_kota: string;
  nama_pptk: string;
  pagu_anggaran: number;
}

export const SUB_KEGIATAN_MASTER_SAMPLES: SubKegiatan[] = [
  {
    norek_sub_kegiatan: '5.03.01.2.05.10',
    nama_kegiatan: 'Sosialisasi Peraturan Perundang-Undangan',
    norek_perjadin_biasa: '5.1.02.04.01.0001',
    norek_perjadin_dalam_kota: '5.1.02.04.01.0003',
    nama_pptk: 'SUMAHDI ISMAIL, SE',
    pagu_anggaran: 200000000
  },
  {
    norek_sub_kegiatan: '5.03.01.2.06.09',
    nama_kegiatan: 'Penyelenggaraan Rapat Koordinasi dan Konsultasi SKPD',
    norek_perjadin_biasa: '5.1.02.04.01.0001',
    norek_perjadin_dalam_kota: '5.1.02.04.01.0003',
    nama_pptk: 'SUMAHDI ISMAIL, SE',
    pagu_anggaran: 250000000
  },
  {
    norek_sub_kegiatan: '5.03.02.2.01.03',
    nama_kegiatan: 'Koordinasi dan Fasilitasi Pengadaan PNS dan PPPK',
    norek_perjadin_biasa: '5.1.02.04.01.0001',
    norek_perjadin_dalam_kota: '5.1.02.04.01.0003',
    nama_pptk: 'SUMAHDI ISMAIL, SE',
    pagu_anggaran: 300000000
  },
  {
    norek_sub_kegiatan: '5.03.02.2.01.06',
    nama_kegiatan: 'Koordinasi Pelaksanaan Administrasi Pemberhentian',
    norek_perjadin_biasa: '5.1.02.04.01.0001',
    norek_perjadin_dalam_kota: '5.1.02.04.01.0003',
    nama_pptk: 'SUMAHDI ISMAIL, SE',
    pagu_anggaran: 350000000
  },
  {
    norek_sub_kegiatan: '5.03.02.2.01.11',
    nama_kegiatan: 'Pengelolaan Data Kepegawaian',
    norek_perjadin_biasa: '5.1.02.04.01.0001',
    norek_perjadin_dalam_kota: '5.1.02.04.01.0003',
    nama_pptk: 'SUMAHDI ISMAIL, SE',
    pagu_anggaran: 400000000
  }
];

export interface UraianBelanja {
  kode_rekening: string;
  nama_rekening: string;
}

export const URAIAN_BELANJA_MASTER_SAMPLES: UraianBelanja[] = [
  { kode_rekening: '4.1.01.01.01.0001', nama_rekening: 'PKB-Mobil Penumpang-Sedan-Pribadi' },
  { kode_rekening: '4.1.01.01.01.0002', nama_rekening: 'PKB-Mobil Penumpang-Sedan-Umum' },
  { kode_rekening: '4.1.01.01.01.0003', nama_rekening: 'PKB-Mobil Penumpang-Sedan-Pemerintah Pusat' },
  { kode_rekening: '4.1.01.01.01.0004', nama_rekening: 'PKB-Mobil Penumpang-Sedan-Pemerintah Daerah' },
  { kode_rekening: '4.1.01.01.02.0001', nama_rekening: 'PKB-Mobil Penumpang-Jeep-Pribadi' },
  { kode_rekening: '4.1.01.01.02.0002', nama_rekening: 'PKB-Mobil Penumpang-Jeep-Umum' },
  { kode_rekening: '4.1.01.01.02.0003', nama_rekening: 'PKB-Mobil Penumpang-Jeep-Pemerintah Pusat' },
  { kode_rekening: '4.1.01.01.02.0004', nama_rekening: 'PKB-Mobil Penumpang-Jeep-Pemerintah Daerah' },
  { kode_rekening: '4.1.01.01.03.0001', nama_rekening: 'PKB-Mobil Penumpang-Minibus-Pribadi' },
  { kode_rekening: '4.1.01.01.03.0002', nama_rekening: 'PKB-Mobil Penumpang-Minibus-Umum' },
  { kode_rekening: '4.1.01.01.03.0003', nama_rekening: 'PKB-Mobil Penumpang-Minibus-Pemerintah Pusat' },
  { kode_rekening: '4.1.01.01.03.0004', nama_rekening: 'PKB-Mobil Penumpang-Minibus-Pemerintah Daerah' }
];

export interface PejabatKeuangan {
  id: string;
  jabatan: string;
  nama: string;
  nip: string;
}

export const PEJABAT_KEUANGAN_MASTER_SAMPLES: PejabatKeuangan[] = [
  { id: '1', jabatan: 'PPTK', nama: 'SAMSI MANDAR, SE', nip: '19790525 200112 1 004' },
  { id: '2', jabatan: 'PPTK', nama: 'NURAINY, S. Sos', nip: '19730828 200604 2 005' },
  { id: '3', jabatan: 'PPTK', nama: 'SUMAHDI ISMAIL, SE', nip: '19820608 200701 1 007' },
  { id: '4', jabatan: 'PA_KPA', nama: 'Dr. ABDILLAH KAMARULLAH, SE.,MM', nip: '19760211 200808 1 001' },
  { id: '5', jabatan: 'Bendahara', nama: 'ARSADI LAHABIRU, SE', nip: '19821210 200904 1 008' }
];

export interface RekapBelanja {
  id_rekap: string;
  sub_kegiatan: string;
  pemilik_toko: string;
  uraian_belanja_gabungan: string;
  jumlah_total: number;
  ppn: number;
  resto: number;
  pph22: number;
  pph23: number;
  jumlah_bersih: number;
  pesanan_ids: string[];
}


export interface DaftarHarga {
  id: string;
  nama_barang: string;
  satuan: string;
  harga_satuan: number;
}

export const DAFTAR_HARGA_MASTER_SAMPLES: DaftarHarga[] = [
  { id: 'h1', nama_barang: 'Amplop (Executiv) Bergaris Pakai tali', satuan: 'buah', harga_satuan: 2000 },
  { id: 'h2', nama_barang: 'Amplop Coklat', satuan: 'Buah', harga_satuan: 5000 },
  { id: 'h3', nama_barang: 'Amplop Jaya Biru Panjang', satuan: 'Dos', harga_satuan: 35000 },
  { id: 'h4', nama_barang: 'Balpoint Baliner', satuan: 'Buah', harga_satuan: 20000 },
  { id: 'h5', nama_barang: 'Balpoint Biasa', satuan: 'Buah', harga_satuan: 10000 },
  { id: 'h6', nama_barang: 'binder clip 105', satuan: 'Dos', harga_satuan: 6000 },
  { id: 'h7', nama_barang: 'Binder Clip 107', satuan: 'dos', harga_satuan: 8000 },
  { id: 'h8', nama_barang: 'Binder Clip 155', satuan: 'Dos', harga_satuan: 15000 },
  { id: 'h9', nama_barang: 'Binder Clip Besar 280', satuan: 'Dos', harga_satuan: 50000 },
  { id: 'h10', nama_barang: 'Buku Agenda Surat Masuk/Surat Keluar', satuan: 'Buah', harga_satuan: 25000 },
  { id: 'h11', nama_barang: 'Buku Expedisi', satuan: 'Buah', harga_satuan: 15000 },
  { id: 'h12', nama_barang: 'Buku Kwitansi', satuan: 'Buah', harga_satuan: 8000 },
  { id: 'h13', nama_barang: 'Cartridge canon Pixma', satuan: 'Buah', harga_satuan: 310000 },
  { id: 'h14', nama_barang: 'Isi Staples Kecil No 10', satuan: 'Dos', harga_satuan: 50000 },
  { id: 'h15', nama_barang: 'Isi Staples No 3', satuan: 'Dos', harga_satuan: 70000 },
  { id: 'h16', nama_barang: 'Isi ulang Tinta Canon Botol Besar', satuan: 'Botol', harga_satuan: 80000 },
  { id: 'h17', nama_barang: 'isi Ulang Tinta Canon botol Kecil', satuan: 'Botol', harga_satuan: 60000 },
  { id: 'h18', nama_barang: 'Isi Ulang Tinta Epson', satuan: 'Buah', harga_satuan: 125000 },
  { id: 'h19', nama_barang: 'Kertas HVS', satuan: 'Rim', harga_satuan: 70000 },
  { id: 'h20', nama_barang: 'Kertas Kwarto', satuan: 'Rim', harga_satuan: 65000 },
  { id: 'h21', nama_barang: 'Lak Ban', satuan: 'Buah', harga_satuan: 23000 },
  { id: 'h22', nama_barang: 'Lem', satuan: 'Buah', harga_satuan: 5000 },
  { id: 'h23', nama_barang: 'Lem glue', satuan: 'buah', harga_satuan: 10000 },
  { id: 'h24', nama_barang: 'Map Batik Kain', satuan: 'Buah', harga_satuan: 10000 },
  { id: 'h25', nama_barang: 'Map Batik Kertas', satuan: 'Buah', harga_satuan: 5000 },
  { id: 'h26', nama_barang: 'Map Biasa', satuan: 'Buah', harga_satuan: 2000 },
  { id: 'h27', nama_barang: 'Map Duduk Besar', satuan: 'Buah', harga_satuan: 32000 },
  { id: 'h28', nama_barang: 'Map Duduk Kecil', satuan: 'Buah', harga_satuan: 17000 },
  { id: 'h29', nama_barang: 'Map Plastik Jepit/snelhecter', satuan: 'Buah', harga_satuan: 15000 },
  { id: 'h30', nama_barang: 'Map Plastik Pakai Tali', satuan: 'Buah', harga_satuan: 5000 },
  { id: 'h31', nama_barang: 'Paper Clips', satuan: 'pak', harga_satuan: 10000 },
  { id: 'h32', nama_barang: 'staples Sedang Max HD 50', satuan: 'Buah', harga_satuan: 50000 },
  { id: 'h33', nama_barang: 'Staples Sedang Max No 10', satuan: 'Buah', harga_satuan: 35000 },
  { id: 'h34', nama_barang: 'Tinta Canon Suntik Hitam', satuan: 'Pak', harga_satuan: 45000 },
  { id: 'h35', nama_barang: 'Tinta Canon Suntik Warna', satuan: 'Pak', harga_satuan: 45000 }
];

/**
 * Formats a number with dots as thousands separators (Indonesian locale)
 */
export function formatNumberWithSeparator(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  // Convert to string and keep only digits
  const numStr = String(value).replace(/\D/g, '');
  if (!numStr) return '';
  const num = parseInt(numStr, 10);
  return num.toLocaleString('id-ID');
}

/**
 * Parses a thousands-separated string (with dots) back to a clean number
 */
export function parseSeparatorToNumber(value: string): number {
  if (!value) return 0;
  const cleanStr = value.replace(/\./g, '');
  const num = parseInt(cleanStr, 10);
  return isNaN(num) ? 0 : num;
}




export interface BASTRekapan {
  id_bast_rekapan: string;
  id_rekap: string;
  no_bast: string;
  nama_usaha: string;
  nama_pemilik: string;
  jabatan_pemilik: string;
  alamat_pemilik: string;
  nama_penerima: string;
  nip_penerima: string;
  jabatan_penerima: string;
  nama_mengetahui: string;
  nip_mengetahui: string;
  jabatan_mengetahui: string;
  keterangan: string;
  dikeluarkan_di: string;
  tgl_penetapan: string;
  bulan_penetapan: string;
  tahun_penetapan: string;
}

export interface KwitansiBesar {
  id_kwitansi_besar: string;
  id_rekap: string;
  no_bukti: string;
  npwp: string;
  kode_org: string;
  lokasi_dana: 'GU' | 'TU' | 'LS';
  tahun: string;
  terima_dari: string;
  uang_sejumlah: number;
  terbilang: string;
  untuk_pembayaran: string;
  dikeluarkan_di: string;
  pada_tanggal: string; // full formatted date
  bendahara: string;
  nip_bendahara: string;
  kepala_kantor: string;
  nip_kepala_kantor: string;
  pengurus: string;
  nip_pengurus: string;
  yang_menerima: string;
  alamat_penerima: string;
}
