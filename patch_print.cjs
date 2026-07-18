const fs = require('fs');

let printContent = fs.readFileSync('src/components/PrintTemplates.tsx', 'utf8');

printContent = printContent.replace(
  "import { Pesanan, ItemBarang, Kwitansi, BAST, Sewa, NotaBalasan, KopSurat, RekapBelanja, terbilang } from '../types';",
  "import { Pesanan, ItemBarang, Kwitansi, BAST, Sewa, NotaBalasan, KopSurat, RekapBelanja, terbilang, BASTRekapan, KwitansiBesar } from '../types';"
);

printContent = printContent.replace(
  "interface PrintProps {",
  "interface PrintProps {\n  bastRekapan?: BASTRekapan;\n  kwitansiBesar?: KwitansiBesar;"
);

printContent = printContent.replace(
  "export default function PrintTemplates({",
  "export default function PrintTemplates({\n  bastRekapan,\n  kwitansiBesar,"
);

// We need to find the `type === 'bast_rekapan'` block and use `bastRekapan`
const oldBastRekapan = `      {type === 'bast_rekapan' && rekapBelanja && rekapItems && rekapItems.length > 0 && (() => {
        const firstP = rekapItems[0];
        
        return (`;

const newBastRekapan = `      {type === 'bast_rekapan' && (bastRekapan || (rekapBelanja && rekapItems && rekapItems.length > 0)) && (() => {
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
          nip_penerima: fallbackP.nip_penerima || '19891104 201212 1 003',
          jabatan_penerima: fallbackP.jabatan_penerima || 'Penyimpan/Pengurus Barang BKPPD',
          nama_mengetahui: fallbackP.kepala_kantor || '',
          nip_mengetahui: fallbackP.nip_kepala_kantor || '',
          jabatan_mengetahui: fallbackP.jabatan_mengetahui || 'Kepala BKPPD / PPK',
          keterangan: \`PIHAK KESATU menyerahkan belanja barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dalam keadaan baik, lengkap, dan baru berupa \${rekapBelanja?.uraian_belanja_gabungan}.\`,
          dikeluarkan_di: fallbackP.dikeluarkan_di || 'Labuha'
        };
        
        return (`;

printContent = printContent.replace(oldBastRekapan, newBastRekapan);

printContent = printContent.replace(
  /Nomor: \.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\./g,
  "Nomor: {b.no_bast}"
);
printContent = printContent.replace(
  /getNamaHari\(firstP.tgl_penetapan, firstP.bulan_penetapan, firstP.tahun_penetapan\)/g,
  "getNamaHari(b.tgl_penetapan, b.bulan_penetapan, b.tahun_penetapan)"
);
printContent = printContent.replace(
  /ejaTanggal\(firstP.tgl_penetapan, firstP.bulan_penetapan, firstP.tahun_penetapan\)/g,
  "ejaTanggal(b.tgl_penetapan, b.bulan_penetapan, b.tahun_penetapan)"
);
printContent = printContent.replace(
  /firstP.bulan_penetapan/g,
  "b.bulan_penetapan"
);
printContent = printContent.replace(
  /firstP.tahun_penetapan/g,
  "b.tahun_penetapan"
);
printContent = printContent.replace(
  /firstP.nama_pemilik \|\| rekapBelanja.pemilik_toko/g,
  "b.nama_pemilik"
);
printContent = printContent.replace(
  /firstP.alamat_pemilik/g,
  "b.alamat_pemilik"
);
printContent = printContent.replace(
  /firstP.kepala_kantor/g,
  "b.nama_mengetahui" // I used nama_mengetahui for PIHAK KEDUA
);
printContent = printContent.replace(
  /firstP.nip_kepala_kantor/g,
  "b.nip_mengetahui"
);
printContent = printContent.replace(
  /PIHAK KESATU menyerahkan belanja barang.*?PIHAK KEDUA.*?\{rekapBelanja\.uraian_belanja_gabungan\}\./,
  "{b.keterangan}"
);


const oldKwitansi = `      {type === 'kwitansi_besar' && rekapBelanja && rekapItems && rekapItems.length > 0 && (() => {
        const firstP = rekapItems[0];
        
        return (`;

const newKwitansi = `      {type === 'kwitansi_besar' && (kwitansiBesar || (rekapBelanja && rekapItems && rekapItems.length > 0)) && (() => {
        const fallbackP = rekapItems && rekapItems.length > 0 ? rekapItems[0] : {} as any;
        const k = kwitansiBesar || {
          no_bukti: '',
          terima_dari: fallbackP.kepada || '',
          uang_sejumlah: rekapBelanja?.jumlah_bersih || 0,
          untuk_pembayaran: \`Biaya Belanja \${rekapBelanja?.uraian_belanja_gabungan}\`,
          pada_tanggal: \`\${fallbackP.tgl_penetapan || ''} \${fallbackP.bulan_penetapan || ''} \${fallbackP.tahun_penetapan || ''}\`.trim(),
          kepala_kantor: fallbackP.kepala_kantor || '',
          nip_kepala_kantor: fallbackP.nip_kepala_kantor || '',
          bendahara: fallbackP.bendahara || 'ARSADI LAHABIRU, SE',
          nip_bendahara: fallbackP.nip_bendahara || '19821210 200904 1 008',
          pengurus: fallbackP.pengurus || 'INDRA KUSUMA, A.Md',
          nip_pengurus: fallbackP.nip_pengurus || '19891104 201212 1 003',
          yang_menerima: rekapBelanja?.pemilik_toko || fallbackP.nama_pemilik || ''
        };
        
        return (`;

printContent = printContent.replace(oldKwitansi, newKwitansi);
printContent = printContent.replace(
  /NO BUKTI\s*<\/td>\s*<td className="w-4 font-bold border-r border-black p-1">:\s*<\/td>/,
  'NO BUKTI</td><td className="w-4 font-bold border-r border-black p-1">: {k.no_bukti}</td>'
);
printContent = printContent.replace(
  /firstP.kepada/g,
  "k.terima_dari"
);
printContent = printContent.replace(
  /rekapBelanja.jumlah_bersih/g,
  "k.uang_sejumlah"
);
printContent = printContent.replace(
  /terbilang\(rekapBelanja\.jumlah_bersih\)/g,
  "terbilang(k.uang_sejumlah)"
);
printContent = printContent.replace(
  /Biaya Belanja \{rekapBelanja.uraian_belanja_gabungan\}/g,
  "{k.untuk_pembayaran}"
);
printContent = printContent.replace(
  /firstP.tgl_penetapan\} \{firstP.bulan_penetapan\} \{firstP.tahun_penetapan\}/g,
  "k.pada_tanggal}" // already handles the brackets properly? wait, {k.pada_tanggal}
);
printContent = printContent.replace(
  /\{firstP.tgl_penetapan\}\s*\{firstP.bulan_penetapan\}\s*\{firstP.tahun_penetapan\}/g,
  "{k.pada_tanggal}"
);

printContent = printContent.replace(
  />\{firstP.kepala_kantor\}</g,
  ">{k.kepala_kantor}<"
);
printContent = printContent.replace(
  /firstP.nip_kepala_kantor/g,
  "k.nip_kepala_kantor"
);
printContent = printContent.replace(
  /ARSADI LAHABIRU, SE/g,
  "{k.bendahara}"
);
printContent = printContent.replace(
  /19821210 200904 1 008/g,
  "{k.nip_bendahara}"
);
printContent = printContent.replace(
  /INDRA KUSUMA, A\.Md/g,
  "{k.pengurus}"
);
printContent = printContent.replace(
  /19891104 201212 1 003/g,
  "{k.nip_pengurus}"
);
printContent = printContent.replace(
  /rekapBelanja.pemilik_toko \|\| firstP.nama_pemilik/g,
  "k.yang_menerima"
);


fs.writeFileSync('src/components/PrintTemplates.tsx', printContent);
