const fs = require('fs');

// BASTRekapanForm.tsx
let bastRekapanContent = fs.readFileSync('src/components/BASTRekapanForm.tsx', 'utf8');

bastRekapanContent = bastRekapanContent.replace(/currentPesanan\s*:\s*Pesanan/g, 'currentRekap: RekapBelanja');
bastRekapanContent = bastRekapanContent.replace(/import\s*\{\s*Pesanan,/g, "import { Pesanan, RekapBelanja,");
bastRekapanContent = bastRekapanContent.replace(/currentPesanan/g, 'currentRekap');
bastRekapanContent = bastRekapanContent.replace(/id_pesanan/g, 'id_rekap');
bastRekapanContent = bastRekapanContent.replace(/bastList/g, 'bastRekapanList');
bastRekapanContent = bastRekapanContent.replace(/BASTRekapanList/g, 'BASTRekapan[]'); // wait, sed replaced BAST with BASTRekapan, so bastList -> bastRekapanList, BAST[] -> BASTRekapan[]

bastRekapanContent = bastRekapanContent.replace("setNoBast(`900/BASTRekapan/${currentRekap.id_rekap}/BKPPD-HS/${tahunPenetapan}`);", "setNoBast(`900/BAST/${currentRekap.id_rekap}/BKPPD-HS/${tahunPenetapan}`);");

// For defaults, replace the section that uses currentRekap (which was currentPesanan) fields that don't exist
// with looking up the first pesanan or leaving blank/using rekap fields.
bastRekapanContent = bastRekapanContent.replace("setNamaUsaha(currentRekap.kepada);", `
        // try to find related pesanan
        const relatedPesanan = pesananList?.find(p => currentRekap.pesanan_ids?.includes(p.id_rekap));
        setNamaUsaha(relatedPesanan?.kepada || '');
`);
bastRekapanContent = bastRekapanContent.replace("setNamaPemilik(currentRekap.nama_pemilik);", `setNamaPemilik(currentRekap.pemilik_toko || relatedPesanan?.nama_pemilik || '');`);
bastRekapanContent = bastRekapanContent.replace("setAlamatPemilik(currentRekap.alamat_pemilik);", `setAlamatPemilik(relatedPesanan?.alamat_pemilik || '');`);
bastRekapanContent = bastRekapanContent.replace("setNamaMengetahui(currentRekap.kepala_kantor);", `setNamaMengetahui(relatedPesanan?.kepala_kantor || '');`);
bastRekapanContent = bastRekapanContent.replace("setNipMengetahui(currentRekap.nip_kepala_kantor);", `setNipMengetahui(relatedPesanan?.nip_kepala_kantor || '');`);

const clauseRegex = /const clauses = `PIHAK KESATU.*?`;/g;
const newClause = 'const clauses = `PIHAK KESATU menyerahkan belanja barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dalam keadaan baik, lengkap, dan baru berupa ${currentRekap.uraian_belanja_gabungan}.`;';
bastRekapanContent = bastRekapanContent.replace(clauseRegex, newClause);

bastRekapanContent = bastRekapanContent.replace(/interface BASTRekapanFormProps \{/g, `interface BASTRekapanFormProps {\n  pesananList?: Pesanan[];`);

fs.writeFileSync('src/components/BASTRekapanForm.tsx', bastRekapanContent);

// KwitansiBesarForm.tsx
let kwitansiContent = fs.readFileSync('src/components/KwitansiBesarForm.tsx', 'utf8');

kwitansiContent = kwitansiContent.replace(/Kwitansi/g, 'KwitansiBesar');
kwitansiContent = kwitansiContent.replace(/kwitansiBesarList/g, 'kwitansiBesarList'); // was kwitansiList

// lowercase
kwitansiContent = kwitansiContent.replace(/kwitansi/g, 'kwitansiBesar'); 

kwitansiContent = kwitansiContent.replace(/currentPesanan\s*:\s*Pesanan/g, 'currentRekap: RekapBelanja');
kwitansiContent = kwitansiContent.replace(/import\s*\{\s*Pesanan,/g, "import { Pesanan, RekapBelanja,");
kwitansiContent = kwitansiContent.replace(/currentPesanan/g, 'currentRekap');
kwitansiContent = kwitansiContent.replace(/id_pesanan/g, 'id_rekap');

kwitansiContent = kwitansiContent.replace(/interface KwitansiBesarFormProps \{/g, `interface KwitansiBesarFormProps {\n  pesananList?: Pesanan[];`);

kwitansiContent = kwitansiContent.replace("setTerimaDari(currentRekap.kepada);", `
        const relatedPesanan = pesananList?.find(p => currentRekap.pesanan_ids?.includes(p.id_rekap));
        setTerimaDari(relatedPesanan?.kepada || '');
`);
kwitansiContent = kwitansiContent.replace("setYangMenerima(currentRekap.nama_pemilik);", `setYangMenerima(currentRekap.pemilik_toko || relatedPesanan?.nama_pemilik || '');`);
kwitansiContent = kwitansiContent.replace("setAlamatPenerima(currentRekap.alamat_pemilik);", `setAlamatPenerima(relatedPesanan?.alamat_pemilik || '');`);

kwitansiContent = kwitansiContent.replace("setUangSejumlah(currentRekap.total_harga || 0);", `setUangSejumlah(currentRekap.jumlah_bersih || 0);`);
kwitansiContent = kwitansiContent.replace("setUntukPembayaran(`Biaya Belanja ${currentRekap.uraian_belanja}`);", `setUntukPembayaran(\`Biaya Belanja \$\{currentRekap.uraian_belanja_gabungan\}\`);`);

kwitansiContent = kwitansiContent.replace("setKepalaKantor(currentRekap.kepala_kantor);", `setKepalaKantor(relatedPesanan?.kepala_kantor || '');`);
kwitansiContent = kwitansiContent.replace("setNipKepalaKantor(currentRekap.nip_kepala_kantor);", `setNipKepalaKantor(relatedPesanan?.nip_kepala_kantor || '');`);

// fix small bug that could happen with KwitansiBesarBesar
kwitansiContent = kwitansiContent.replace(/KwitansiBesarBesar/g, 'KwitansiBesar');
kwitansiContent = kwitansiContent.replace(/kwitansiBesarBesar/g, 'kwitansiBesar');

fs.writeFileSync('src/components/KwitansiBesarForm.tsx', kwitansiContent);

