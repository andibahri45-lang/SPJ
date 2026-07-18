import { useState, useEffect } from 'react';
import { Pesanan, ItemBarang, Kwitansi, BAST, Sewa } from '../types';
import { generateSQLDump } from '../utils/sqlExporter';
import { Database, Download, Copy, Check, Server, HelpCircle, Code, List } from 'lucide-react';

interface MySQLExporterPanelProps {
  pesananList: Pesanan[];
  itemList: ItemBarang[];
  kwitansiList: Kwitansi[];
  bastList: BAST[];
  sewaList: Sewa[];
}

export default function MySQLExporterPanel({
  pesananList,
  itemList,
  kwitansiList,
  bastList,
  sewaList
}: MySQLExporterPanelProps) {
  const [copied, setCopied] = useState(false);
  const [sqlDump, setSqlDump] = useState('');

  useEffect(() => {
    const dump = generateSQLDump(pesananList, itemList, kwitansiList, bastList, sewaList);
    setSqlDump(dump);
  }, [pesananList, itemList, kwitansiList, bastList, sewaList]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlDump], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'db_nota_pesanan_dump.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 text-white grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-md">
        <div className="md:col-span-8 space-y-2">
          <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-mono font-bold uppercase tracking-wider border border-indigo-500/30">
            XAMPP MySQL Integration
          </span>
          <h2 className="text-base font-extrabold tracking-tight font-mono text-white">Migrasi Database & Sinkronisasi Lokal</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Aplikasi web ini sepenuhnya kompatibel dengan database relasional MySQL. Seluruh draf, nota, dan formulir kwitansi yang Anda simpan di browser terenkapsulasi ke dalam skrip SQL siap pakai. Anda bisa langsung mengimpor data ini ke phpMyAdmin di komputer lokal Anda.
          </p>
        </div>

        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2">
          <button
            onClick={handleCopy}
            className="w-full py-1.5 bg-[#0F172A] hover:bg-slate-800 active:scale-95 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? 'Berhasil Disalin!' : 'Salin Script SQL'}
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-md border border-indigo-500"
          >
            <Download size={13} />
            Unduh Berkas .SQL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step-by-Step Guide */}
        <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
            <Server size={14} className="text-indigo-400" />
            Panduan Impor MySQL XAMPP
          </h3>

          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="flex gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0F172A] border border-slate-700 text-indigo-400 font-bold text-xs shrink-0 font-mono">1</span>
              <div>
                <h4 className="font-bold text-slate-200 mb-0.5">Aktifkan XAMPP</h4>
                <p className="leading-relaxed text-slate-400 text-[11px]">Buka XAMPP Control Panel di komputer Anda, lalu klik tombol <strong>Start</strong> pada modul <strong>Apache</strong> dan <strong>MySQL</strong>.</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0F172A] border border-slate-700 text-indigo-400 font-bold text-xs shrink-0 font-mono">2</span>
              <div>
                <h4 className="font-bold text-slate-200 mb-0.5">Buka phpMyAdmin</h4>
                <p className="leading-relaxed text-slate-400 text-[11px]">Buka browser internet Anda dan kunjungi halaman <a href="http://localhost/phpmyadmin" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-semibold font-mono">http://localhost/phpmyadmin</a>.</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0F172A] border border-slate-700 text-indigo-400 font-bold text-xs shrink-0 font-mono">3</span>
              <div>
                <h4 className="font-bold text-slate-200 mb-0.5">Buat Database Baru</h4>
                <p className="leading-relaxed text-slate-400 text-[11px]">Klik menu <strong>New</strong> di kolom kiri, beri nama database <code>db_nota_pesanan</code>, lalu tekan tombol <strong>Create</strong>.</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0F172A] border border-slate-700 text-indigo-400 font-bold text-xs shrink-0 font-mono">4</span>
              <div>
                <h4 className="font-bold text-slate-200 mb-0.5">Impor Berkas SQL</h4>
                <p className="leading-relaxed text-slate-400 text-[11px]">Klik tab <strong>Import</strong> di bagian atas menu, pilih berkas <code>db_nota_pesanan_dump.sql</code> yang Anda unduh dari aplikasi ini, lalu klik tombol <strong>Go / Kirim</strong> di bagian bawah.</p>
              </div>
            </div>

            <div className="p-2.5 bg-[#0F172A]/50 border border-slate-700 rounded-lg space-y-1">
              <p className="font-bold text-slate-200 flex items-center gap-1 text-[11px] uppercase tracking-wider font-mono">
                <List size={11} className="text-indigo-400" /> Skema Relasional Tabel:
              </p>
              <ul className="list-disc list-inside space-y-0.5 font-mono text-[10px] text-slate-400 pl-1">
                <li><code>pesanan</code> (Data induk Nota Pesanan)</li>
                <li><code>item_barang</code> (Daftar rincian per barang)</li>
                <li><code>kwitansi</code> (Data kuitansi pembayaran)</li>
                <li><code>bast</code> (Data Berita Acara Serah Terima)</li>
                <li><code>sewa</code> (Data surat kontrak sewa harian)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live SQL Output Code Editor */}
        <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md flex flex-col h-[400px]">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2 shrink-0">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono">
              <Code size={13} className="text-indigo-400" />
              Live SQL Preview (db_nota_pesanan_dump.sql)
            </span>
            <span className="text-[9px] font-mono text-slate-400 bg-[#0F172A] px-2 py-0.5 rounded border border-slate-700">
              INSERTs: {pesananList.length}
            </span>
          </div>

          <div className="flex-1 overflow-auto rounded-lg bg-[#0F172A] p-3 font-mono text-[11px] text-indigo-300 leading-relaxed scrollbar-thin select-all">
            <pre className="whitespace-pre-wrap">{sqlDump}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
