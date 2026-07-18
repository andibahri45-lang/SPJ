const fs = require('fs');

const path = 'src/components/PrintTemplates.tsx';
let content = fs.readFileSync(path, 'utf8');

const injection = `
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
                <p>Tahun Anggaran : {firstP.tahun_penetapan}</p>
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
                  <p className="capitalize">{firstP.dikeluarkan_di || 'Labuha'}, {firstP.tgl_penetapan} {firstP.bulan_penetapan} {firstP.tahun_penetapan}</p>
                  <p className="font-semibold uppercase">Yang Menerima</p>
                </div>
                <div>
                  <p className="underline font-bold uppercase">({firstP.nama_pemilik || rekapBelanja.pemilik_toko})</p>
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
                  <p className="underline font-bold uppercase">{firstP.kepala_kantor}</p>
                  <p>NIP. {firstP.nip_kepala_kantor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {type === 'bast_rekapan' && rekapBelanja && rekapItems && rekapItems.length > 0 && (() => {
        const firstP = rekapItems[0];
        
        return (
        <div id="print-bast-rekapan" className="space-y-6 font-serif text-[12px] leading-relaxed">
          <HeaderKop kopSurat={kopSurat} />
          
          <div className="text-center mt-4 mb-8">
            <h3 className="text-base font-bold underline uppercase tracking-wide">BERITA ACARA SERAH TERIMA BARANG</h3>
            <p className="mt-1">Nomor: ................................</p>
          </div>
          
          <p className="text-justify indent-8">
            Pada hari ini {getNamaHari(firstP.tgl_penetapan, firstP.bulan_penetapan, firstP.tahun_penetapan)}, tanggal {ejaTanggal(firstP.tgl_penetapan, firstP.bulan_penetapan, firstP.tahun_penetapan).replace(/Hari ini.*?Tanggal/i, '').replace(/Bulan.*/i,'').trim()} bulan {titleCase(firstP.bulan_penetapan)} tahun {terbilang(parseInt(firstP.tahun_penetapan, 10) || 0)} kami yang bertanda tangan di bawah ini :
          </p>
          
          <table className="w-full ml-4 my-4">
            <tbody>
              <tr>
                <td className="w-6 align-top">I.</td>
                <td className="w-32 align-top">NAMA</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top font-bold uppercase">{firstP.nama_pemilik || rekapBelanja.pemilik_toko}</td>
              </tr>
              <tr>
                <td className="w-6 align-top"></td>
                <td className="w-32 align-top">ALAMAT PERUSAHAAN</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top">{firstP.alamat_pemilik}</td>
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
                <td className="align-top font-bold uppercase">{firstP.kepala_kantor}</td>
              </tr>
              <tr>
                <td className="w-6 align-top"></td>
                <td className="w-32 align-top">NIP</td>
                <td className="w-4 align-top">:</td>
                <td className="align-top">{firstP.nip_kepala_kantor}</td>
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
            <span className="font-bold">PIHAK KESATU</span> menyerahkan kepada <span className="font-bold">PIHAK KEDUA</span> barang sesuai dengan Nota Pesanan tanggal {firstP.tgl_penetapan} {firstP.bulan_penetapan} {firstP.tahun_penetapan} dengan jenis barang sebagai berikut:
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
                <p className="font-bold uppercase">{firstP.nama_pemilik || rekapBelanja.pemilik_toko}</p>
              </div>
            </div>
            
            <div className="text-center w-64 space-y-24">
              <p className="uppercase font-semibold">Yang Menerima<br/>PIHAK KEDUA</p>
              <div className="border-b border-black inline-block px-4">
                <p className="font-bold uppercase">{firstP.kepala_kantor}</p>
                <p className="font-normal mt-0.5">NIP {firstP.nip_kepala_kantor}</p>
              </div>
            </div>
          </div>
          
        </div>
        );
      })()}
`;

const endTag = '        </div>\n      ))}\n    </>\n  );\n}';
content = content.replace(endTag, injection + '\n' + endTag);
fs.writeFileSync(path, content, 'utf8');
