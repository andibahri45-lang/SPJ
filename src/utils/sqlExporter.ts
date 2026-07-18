import { Pesanan, ItemBarang, Kwitansi, BAST, Sewa } from '../types';

export function generateSQLDump(
  pesananList: Pesanan[],
  itemList: ItemBarang[],
  kwitansiList: Kwitansi[],
  bastList: BAST[],
  sewaList: Sewa[]
): string {
  let sql = `-- ========================================================\n`;
  sql += `-- SQL DUMP FOR NOTA PESANAN DATABASE (XAMPP MySQL)\n`;
  sql += `-- Generated on: ${new Date().toLocaleString('id-ID')}\n`;
  sql += `-- ========================================================\n\n`;

  sql += `CREATE DATABASE IF NOT EXISTS \`db_nota_pesanan\`;\n`;
  sql += `USE \`db_nota_pesanan\`;\n\n`;

  // 1. Pesanan Table
  sql += `-- Table structure for \`pesanan\`\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`pesanan\` (\n`;
  sql += `  \`id_pesanan\` varchar(50) NOT NULL,\n`;
  sql += `  \`sub_kegiatan\` text,\n`;
  sql += `  \`uraian_belanja\` text,\n`;
  sql += `  \`mata_anggaran\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`bendahara\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_bendahara\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`kepala_kantor\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_kepala_kantor\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`no_nota\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`keterangan\` text,\n`;
  sql += `  \`kepada\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nama_pemilik\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`alamat_pemilik\` text,\n`;
  sql += `  \`dikeluarkan_di\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`tgl_penetapan\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`bulan_penetapan\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`tahun_penetapan\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`total_bruto\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  \`ppn_resto_type\` varchar(50) DEFAULT 'None',\n`;
  sql += `  \`persen_ppn\` decimal(5,2) DEFAULT 0.00,\n`;
  sql += `  \`harga_ppn\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  \`pph_type\` varchar(50) DEFAULT 'None',\n`;
  sql += `  \`persen_pph\` decimal(5,2) DEFAULT 0.00,\n`;
  sql += `  \`harga_pph\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  \`jumlah_bersih\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  PRIMARY KEY (\`id_pesanan\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  // 2. Item Barang Table
  sql += `-- Table structure for \`item_barang\`\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`item_barang\` (\n`;
  sql += `  \`id\` varchar(50) NOT NULL,\n`;
  sql += `  \`id_pesanan\` varchar(50) NOT NULL,\n`;
  sql += `  \`no_urut_nota\` int(11) NOT NULL,\n`;
  sql += `  \`nama_barang\` varchar(255) DEFAULT NULL,\n`;
  sql += `  \`volume\` decimal(10,2) DEFAULT 1.00,\n`;
  sql += `  \`ket_volume\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`harga_satuan\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  \`jumlah\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  PRIMARY KEY (\`id\`),\n`;
  sql += `  KEY \`fk_item_pesanan\` (\`id_pesanan\`),\n`;
  sql += `  CONSTRAINT \`fk_item_pesanan\` FOREIGN KEY (\`id_pesanan\`) REFERENCES \`pesanan\` (\`id_pesanan\`) ON DELETE CASCADE\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  // 3. Kwitansi Table
  sql += `-- Table structure for \`kwitansi\`\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`kwitansi\` (\n`;
  sql += `  \`id_kwitansi\` varchar(50) NOT NULL,\n`;
  sql += `  \`id_pesanan\` varchar(50) NOT NULL,\n`;
  sql += `  \`no_bukti\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`npwp\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`kode_org\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`lokasi_dana\` varchar(10) DEFAULT 'GU',\n`;
  sql += `  \`tahun\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`terima_dari\` text,\n`;
  sql += `  \`uang_sejumlah\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  \`terbilang\` text,\n`;
  sql += `  \`untuk_pembayaran\` text,\n`;
  sql += `  \`dikeluarkan_di\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`pada_tanggal\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`bendahara\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_bendahara\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`kepala_kantor\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_kepala_kantor\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`pengurus\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_pengurus\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`yang_menerima\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`alamat_penerima\` text,\n`;
  sql += `  PRIMARY KEY (\`id_kwitansi\`),\n`;
  sql += `  KEY \`fk_kwitansi_pesanan\` (\`id_pesanan\`),\n`;
  sql += `  CONSTRAINT \`fk_kwitansi_pesanan\` FOREIGN KEY (\`id_pesanan\`) REFERENCES \`pesanan\` (\`id_pesanan\`) ON DELETE CASCADE\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  // 4. BAST Table
  sql += `-- Table structure for \`bast\`\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`bast\` (\n`;
  sql += `  \`id_bast\` varchar(50) NOT NULL,\n`;
  sql += `  \`id_pesanan\` varchar(50) NOT NULL,\n`;
  sql += `  \`no_bast\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nama_usaha\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nama_pemilik\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`jabatan_pemilik\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`alamat_pemilik\` text,\n`;
  sql += `  \`nama_penerima\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_penerima\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`jabatan_penerima\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nama_mengetahui\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_mengetahui\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`jabatan_mengetahui\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`keterangan\` text,\n`;
  sql += `  \`dikeluarkan_di\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`tgl_penetapan\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`bulan_penetapan\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`tahun_penetapan\` varchar(10) DEFAULT NULL,\n`;
  sql += `  PRIMARY KEY (\`id_bast\`),\n`;
  sql += `  KEY \`fk_bast_pesanan\` (\`id_pesanan\`),\n`;
  sql += `  CONSTRAINT \`fk_bast_pesanan\` FOREIGN KEY (\`id_pesanan\`) REFERENCES \`pesanan\` (\`id_pesanan\`) ON DELETE CASCADE\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  // 5. Sewa Table
  sql += `-- Table structure for \`sewa\`\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`sewa\` (\n`;
  sql += `  \`id_sewa\` varchar(50) NOT NULL,\n`;
  sql += `  \`id_pesanan\` varchar(50) NOT NULL,\n`;
  sql += `  \`no_surat\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nama_pihak_pertama\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`nip_pihak_pertama\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`jabatan_pihak_pertama\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`alamat_pihak_pertama\` text,\n`;
  sql += `  \`nama_pihak_kedua\` varchar(150) DEFAULT NULL,\n`;
  sql += `  \`alamat_pihak_kedua\` text,\n`;
  sql += `  \`untuk_kegiatan\` text,\n`;
  sql += `  \`harga_sewa\` decimal(15,2) DEFAULT 0.00,\n`;
  sql += `  \`jumlah_unit\` int(11) DEFAULT 1,\n`;
  sql += `  \`tgl_dari\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`bulan_dari\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`tahun_dari\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`tgl_sampai\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`bulan_sampai\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`tahun_sampai\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`uraian_selama\` text,\n`;
  sql += `  \`dikeluarkan_di\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`tgl_penetapan\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`bulan_penetapan\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`tahun_penetapan\` varchar(10) DEFAULT NULL,\n`;
  sql += `  \`lokasi\` varchar(150) DEFAULT NULL,\n`;
  sql += `  PRIMARY KEY (\`id_sewa\`),\n`;
  sql += `  KEY \`fk_sewa_pesanan\` (\`id_pesanan\`),\n`;
  sql += `  CONSTRAINT \`fk_sewa_pesanan\` FOREIGN KEY (\`id_pesanan\`) REFERENCES \`pesanan\` (\`id_pesanan\`) ON DELETE CASCADE\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  // --- POPULATE INSERTS ---

  const escapeStr = (val: string): string => {
    if (!val) return 'NULL';
    return `'${val.replace(/'/g, "''")}'`;
  };

  sql += `-- ========================================================\n`;
  sql += `-- INSERTING CURRENT ACTIVE DATASET\n`;
  sql += `-- ========================================================\n\n`;

  // Inserts for Pesanan
  if (pesananList.length > 0) {
    sql += `-- Dumping data for table \`pesanan\`\n`;
    sql += `INSERT INTO \`pesanan\` (\`id_pesanan\`, \`sub_kegiatan\`, \`uraian_belanja\`, \`mata_anggaran\`, \`bendahara\`, \`nip_bendahara\`, \`kepala_kantor\`, \`nip_kepala_kantor\`, \`no_nota\`, \`keterangan\`, \`kepada\`, \`nama_pemilik\`, \`alamat_pemilik\`, \`dikeluarkan_di\`, \`tgl_penetapan\`, \`bulan_penetapan\`, \`tahun_penetapan\`, \`total_bruto\`, \`ppn_resto_type\`, \`persen_ppn\`, \`harga_ppn\`, \`pph_type\`, \`persen_pph\`, \`harga_pph\`, \`jumlah_bersih\`) VALUES\n`;
    
    const rows = pesananList.map(p => {
      return `(${escapeStr(p.id_pesanan)}, ${escapeStr(p.sub_kegiatan)}, ${escapeStr(p.uraian_belanja)}, ${escapeStr(p.mata_anggaran)}, ${escapeStr(p.bendahara)}, ${escapeStr(p.nip_bendahara)}, ${escapeStr(p.kepala_kantor)}, ${escapeStr(p.nip_kepala_kantor)}, ${escapeStr(p.no_nota)}, ${escapeStr(p.keterangan)}, ${escapeStr(p.kepada)}, ${escapeStr(p.nama_pemilik)}, ${escapeStr(p.alamat_pemilik)}, ${escapeStr(p.dikeluarkan_di)}, ${escapeStr(p.tgl_penetapan)}, ${escapeStr(p.bulan_penetapan)}, ${escapeStr(p.tahun_penetapan)}, ${p.total_bruto}, ${escapeStr(p.ppn_resto_type)}, ${p.persen_ppn}, ${p.harga_ppn}, ${escapeStr(p.pph_type)}, ${p.persen_pph}, ${p.harga_pph}, ${p.jumlah_bersih})`;
    }).join(',\n');
    
    sql += rows + ';\n\n';
  }

  // Inserts for Item Barang
  if (itemList.length > 0) {
    sql += `-- Dumping data for table \`item_barang\`\n`;
    sql += `INSERT INTO \`item_barang\` (\`id\`, \`id_pesanan\`, \`no_urut_nota\`, \`nama_barang\`, \`volume\`, \`ket_volume\`, \`harga_satuan\`, \`jumlah\`) VALUES\n`;
    
    const rows = itemList.map(it => {
      return `(${escapeStr(it.id)}, ${escapeStr(it.id_pesanan)}, ${it.no_urut_nota}, ${escapeStr(it.nama_barang)}, ${it.volume}, ${escapeStr(it.ket_volume)}, ${it.harga_satuan}, ${it.jumlah})`;
    }).join(',\n');
    
    sql += rows + ';\n\n';
  }

  // Inserts for Kwitansi
  if (kwitansiList.length > 0) {
    sql += `-- Dumping data for table \`kwitansi\`\n`;
    sql += `INSERT INTO \`kwitansi\` (\`id_kwitansi\`, \`id_pesanan\`, \`no_bukti\`, \`npwp\`, \`kode_org\`, \`lokasi_dana\`, \`tahun\`, \`terima_dari\`, \`uang_sejumlah\`, \`terbilang\`, \`untuk_pembayaran\`, \`dikeluarkan_di\`, \`pada_tanggal\`, \`bendahara\`, \`nip_bendahara\`, \`kepala_kantor\`, \`nip_kepala_kantor\`, \`pengurus\`, \`nip_pengurus\`, \`yang_menerima\`, \`alamat_penerima\`) VALUES\n`;
    
    const rows = kwitansiList.map(k => {
      return `(${escapeStr(k.id_kwitansi)}, ${escapeStr(k.id_pesanan)}, ${escapeStr(k.no_bukti)}, ${escapeStr(k.npwp)}, ${escapeStr(k.kode_org)}, ${escapeStr(k.lokasi_dana)}, ${escapeStr(k.tahun)}, ${escapeStr(k.terima_dari)}, ${k.uang_sejumlah}, ${escapeStr(k.terbilang)}, ${escapeStr(k.untuk_pembayaran)}, ${escapeStr(k.dikeluarkan_di)}, ${escapeStr(k.pada_tanggal)}, ${escapeStr(k.bendahara)}, ${escapeStr(k.nip_bendahara)}, ${escapeStr(k.kepala_kantor)}, ${escapeStr(k.nip_kepala_kantor)}, ${escapeStr(k.pengurus)}, ${escapeStr(k.nip_pengurus)}, ${escapeStr(k.yang_menerima)}, ${escapeStr(k.alamat_penerima)})`;
    }).join(',\n');
    
    sql += rows + ';\n\n';
  }

  // Inserts for BAST
  if (bastList.length > 0) {
    sql += `-- Dumping data for table \`bast\`\n`;
    sql += `INSERT INTO \`bast\` (\`id_bast\`, \`id_pesanan\`, \`no_bast\`, \`nama_usaha\`, \`nama_pemilik\`, \`jabatan_pemilik\`, \`alamat_pemilik\`, \`nama_penerima\`, \`nip_penerima\`, \`jabatan_penerima\`, \`nama_mengetahui\`, \`nip_mengetahui\`, \`jabatan_mengetahui\`, \`keterangan\`, \`dikeluarkan_di\`, \`tgl_penetapan\`, \`bulan_penetapan\`, \`tahun_penetapan\`) VALUES\n`;
    
    const rows = bastList.map(b => {
      return `(${escapeStr(b.id_bast)}, ${escapeStr(b.id_pesanan)}, ${escapeStr(b.no_bast)}, ${escapeStr(b.nama_usaha)}, ${escapeStr(b.nama_pemilik)}, ${escapeStr(b.jabatan_pemilik)}, ${escapeStr(b.alamat_pemilik)}, ${escapeStr(b.nama_penerima)}, ${escapeStr(b.nip_penerima)}, ${escapeStr(b.jabatan_penerima)}, ${escapeStr(b.nama_mengetahui)}, ${escapeStr(b.nip_mengetahui)}, ${escapeStr(b.jabatan_mengetahui)}, ${escapeStr(b.keterangan)}, ${escapeStr(b.dikeluarkan_di)}, ${escapeStr(b.tgl_penetapan)}, ${escapeStr(b.bulan_penetapan)}, ${escapeStr(b.tahun_penetapan)})`;
    }).join(',\n');
    
    sql += rows + ';\n\n';
  }

  // Inserts for Sewa
  if (sewaList.length > 0) {
    sql += `-- Dumping data for table \`sewa\`\n`;
    sql += `INSERT INTO \`sewa\` (\`id_sewa\`, \`id_pesanan\`, \`no_surat\`, \`nama_pihak_pertama\`, \`nip_pihak_pertama\`, \`jabatan_pihak_pertama\`, \`alamat_pihak_pertama\`, \`nama_pihak_kedua\`, \`alamat_pihak_kedua\`, \`untuk_kegiatan\`, \`harga_sewa\`, \`jumlah_unit\`, \`tgl_dari\`, \`bulan_dari\`, \`tahun_dari\`, \`tgl_sampai\`, \`bulan_sampai\`, \`tahun_sampai\`, \`uraian_selama\`, \`dikeluarkan_di\`, \`tgl_penetapan\`, \`bulan_penetapan\`, \`tahun_penetapan\`, \`lokasi\`) VALUES\n`;
    
    const rows = sewaList.map(s => {
      return `(${escapeStr(s.id_sewa)}, ${escapeStr(s.id_pesanan)}, ${escapeStr(s.no_surat)}, ${escapeStr(s.nama_pihak_pertama)}, ${escapeStr(s.nip_pihak_pertama)}, ${escapeStr(s.jabatan_pihak_pertama)}, ${escapeStr(s.alamat_pihak_pertama)}, ${escapeStr(s.nama_pihak_kedua)}, ${escapeStr(s.alamat_pihak_kedua)}, ${escapeStr(s.untuk_kegiatan)}, ${s.harga_sewa}, ${s.jumlah_unit}, ${escapeStr(s.tgl_dari)}, ${escapeStr(s.bulan_dari)}, ${escapeStr(s.tahun_dari)}, ${escapeStr(s.tgl_sampai)}, ${escapeStr(s.bulan_sampai)}, ${escapeStr(s.tahun_sampai)}, ${escapeStr(s.uraian_selama)}, ${escapeStr(s.dikeluarkan_di)}, ${escapeStr(s.tgl_penetapan)}, ${escapeStr(s.bulan_penetapan)}, ${escapeStr(s.tahun_penetapan)}, ${escapeStr(s.lokasi)})`;
    }).join(',\n');
    
    sql += rows + ';\n\n';
  }

  sql += `-- ========================================================\n`;
  sql += `-- END OF SQL DUMP\n`;
  sql += `-- ========================================================\n`;

  return sql;
}
