#!/bin/bash
sed -i -e '/{docTypes.map((type, index) => (/a \
        <div key={`${type}-${index}`} className={`bg-white text-black p-8 font-serif leading-relaxed max-w-[800px] mx-auto print:p-0 print:m-0 print:max-w-full text-sm ${index < docTypes.length - 1 ? "break-after-page print:break-after-page [page-break-after:always]" : ""}`}>\
        {type === "kwitansi_besar" && rekapBelanja && (\
            <div className="w-full relative">\
              <div className="absolute right-0 top-0 font-serif font-bold text-sm">\
                Lembar : 1\
              </div>\
              <div className="text-center mb-8 pt-6">\
                <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1 mb-2">K W I T A N S I</h3>\
                <p className="font-serif">No. Rekap : {rekapBelanja.id_rekap}</p>\
              </div>\
              <table className="w-full text-sm font-serif mb-8 leading-loose">\
                <tbody>\
                  <tr className="align-top">\
                    <td className="w-48 py-1 font-semibold">Sudah Terima Dari</td>\
                    <td className="w-4 py-1">:</td>\
                    <td className="py-1">BENDAHARA PENGELUARAN SKPD BADAN KEPEGAWAIAN PENDIDIKAN DAN PELATIHAN DAERAH KABUPATEN HALMAHERA SELATAN</td>\
                  </tr>\
                  <tr className="align-top">\
                    <td className="w-48 py-1 font-semibold">Uang Sebesar</td>\
                    <td className="w-4 py-1">:</td>\
                    <td className="py-1 font-bold italic bg-gray-100 px-3 border border-gray-300">== {terbilang(rekapBelanja.jumlah_total)} Rupiah ==</td>\
                  </tr>\
                  <tr className="align-top">\
                    <td className="w-48 py-1 font-semibold">Untuk Pembayaran</td>\
                    <td className="w-4 py-1">:</td>\
                    <td className="py-1 text-justify">{rekapBelanja.uraian_belanja_gabungan}</td>\
                  </tr>\
                </tbody>\
              </table>\
              \
              <div className="flex justify-between items-end mt-12">\
                <div className="border-4 border-black p-4 inline-block font-bold text-2xl">\
                  Terbilang : Rp {rekapBelanja.jumlah_total.toLocaleString("id-ID")}\
                </div>\
                \
                <div className="text-center w-64 space-y-20">\
                  <p className="font-serif text-sm">Labuha, ................................ 20...</p>\
                  <div>\
                    <p className="font-bold underline uppercase">{rekapBelanja.pemilik_toko}</p>\
                    <p className="text-xs">Pemilik Toko</p>\
                  </div>\
                </div>\
              </div>\
              \
              <div className="mt-16 flex justify-between text-sm font-serif text-center">\
                 <div className="space-y-16 w-64">\
                   <div>\
                     <p>Mengetahui,</p>\
                     <p className="font-bold">Pengguna Anggaran (PA)</p>\
                   </div>\
                   <div>\
                     <p className="font-bold underline uppercase">Dr. ABDILLAH KAMARULLAH, SE.,MM</p>\
                     <p>NIP: 19760211 200808 1 001</p>\
                   </div>\
                 </div>\
                 <div className="space-y-16 w-64">\
                   <div>\
                     <p>Lunas Dibayar Tgl,</p>\
                     <p className="font-bold">Bendahara Pengeluaran</p>\
                   </div>\
                   <div>\
                     <p className="font-bold underline uppercase">ARSADI LAHABIRU</p>\
                     <p>NIP: 19821210 200904 1 008</p>\
                   </div>\
                 </div>\
              </div>\
            </div>\
        )}\
        \
        {type === "bast_rekapan" && rekapBelanja && (\
            <div className="w-full relative">\
              <HeaderKop kopSurat={kopSurat} />\
              <div className="text-center my-6">\
                <h3 className="text-md font-bold uppercase underline">BERITA ACARA SERAH TERIMA BARANG</h3>\
                <p className="text-sm mt-1">Nomor : ___________ / BAST / 20...</p>\
              </div>\
              <div className="text-sm font-serif text-justify leading-relaxed mb-6 space-y-4">\
                 <p>Pada hari ini ................ tanggal ................ bulan ................ tahun ......................, yang bertanda tangan di bawah ini:</p>\
                 <table className="w-full ml-4">\
                   <tbody>\
                     <tr><td className="w-4 font-bold">1.</td><td className="w-32">Nama</td><td className="w-4">:</td><td className="font-bold uppercase">{rekapBelanja.pemilik_toko}</td></tr>\
                     <tr><td></td><td>Pekerjaan</td><td>:</td><td>Pemilik Toko / Rekanan</td></tr>\
                     <tr><td></td><td>Alamat</td><td>:</td><td>Labuha</td></tr>\
                     <tr><td colSpan={4} className="py-2 italic">Selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.</td></tr>\
                     \
                     <tr><td className="font-bold pt-2">2.</td><td className="pt-2">Nama</td><td className="pt-2">:</td><td className="pt-2 font-bold uppercase">SUMAHDI ISMAIL, SE</td></tr>\
                     <tr><td></td><td>NIP</td><td>:</td><td>19820608 200701 1 007</td></tr>\
                     <tr><td></td><td>Jabatan</td><td>:</td><td>Pejabat Pelaksana Teknis Kegiatan (PPTK)</td></tr>\
                     <tr><td colSpan={4} className="py-2 italic">Selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.</td></tr>\
                   </tbody>\
                 </table>\
                 <p>PIHAK PERTAMA menyerahkan barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dalam keadaan baik, lengkap, dan baru berupa {rekapBelanja.uraian_belanja_gabungan}.</p>\
                 <p>Demikian Berita Acara Serah Terima ini dibuat dalam rangkap yang cukup untuk dipergunakan sebagaimana mestinya.</p>\
              </div>\
              <div className="mt-12 flex justify-between text-sm font-serif text-center">\
                 <div className="space-y-20 w-64">\
                   <div>\
                     <p className="font-bold">PIHAK KEDUA</p>\
                     <p>Yang Menerima,</p>\
                   </div>\
                   <div>\
                     <p className="font-bold underline uppercase">SUMAHDI ISMAIL, SE</p>\
                     <p>NIP: 19820608 200701 1 007</p>\
                   </div>\
                 </div>\
                 <div className="space-y-20 w-64">\
                   <div>\
                     <p className="font-bold">PIHAK PERTAMA</p>\
                     <p>Yang Menyerahkan,</p>\
                   </div>\
                   <div>\
                     <p className="font-bold underline uppercase">{rekapBelanja.pemilik_toko}</p>\
                     <p>Pemilik Toko</p>\
                   </div>\
                 </div>\
              </div>\
            </div>\
        )}' src/components/PrintTemplates.tsx

bash update_print_templates_2.sh
