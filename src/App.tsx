import { useState, useEffect } from 'react';
import { Pesanan, RekapBelanja, ItemBarang, Kwitansi, BAST, Sewa, NotaBalasan, KopSurat, INDONESIAN_MONTHS, toRoman, SubKegiatan, SUB_KEGIATAN_MASTER_SAMPLES, UraianBelanja, URAIAN_BELANJA_MASTER_SAMPLES, PejabatKeuangan, PEJABAT_KEUANGAN_MASTER_SAMPLES, DaftarHarga, DAFTAR_HARGA_MASTER_SAMPLES, Rekanan, REKANAN_MASTER_SAMPLES } from './types';
import DataPesananForm from './components/DataPesananForm';
import DataRekapBelanjaForm from './components/DataRekapBelanjaForm';

import KwitansiForm from './components/KwitansiForm';
import BASTRekapanForm from './components/BASTRekapanForm';
import KwitansiBesarForm from './components/KwitansiBesarForm';
import BASTForm from './components/BASTForm';
import SewaForm from './components/SewaForm';
import NotaBalasanForm from './components/NotaBalasanForm';
import SubKegiatanForm from './components/SubKegiatanForm';
import RekananForm from './components/RekananForm';
import UraianBelanjaForm from './components/UraianBelanjaForm';
import PejabatKeuanganForm from './components/PejabatKeuanganForm';
import DaftarHargaForm from './components/DaftarHargaForm';
import MySQLExporterPanel from './components/MySQLExporterPanel';
import PengaturanForm from './components/PengaturanForm';
import { PrintTemplates, formatRupiah } from './components/PrintTemplates';
import { List, FileText, Receipt, ClipboardCheck, ScrollText, Database, ShieldAlert, Check, RefreshCw, Printer, Sparkles, BookOpen, Settings, Folders, ListOrdered, Users, Tag, Store } from 'lucide-react';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'pesanan' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | 'sub_kegiatan' | 'rekanan' | 'uraian_belanja' | 'pejabat' | 'daftar_harga' | 'mysql' | 'pengaturan'>('pesanan');

  // Main Database state
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [rekapBelanjaList, setRekapBelanjaList] = useState<RekapBelanja[]>([]);

  const [itemList, setItemList] = useState<ItemBarang[]>([]);
  const [kwitansiList, setKwitansiList] = useState<Kwitansi[]>([]);
  const [kwitansiBesarList, setKwitansiBesarList] = useState<KwitansiBesar[]>([]);
  const [bastList, setBastList] = useState<BAST[]>([]);
  const [bastRekapanList, setBastRekapanList] = useState<BASTRekapan[]>([]);
  const [sewaList, setSewaList] = useState<Sewa[]>([]);
  const [balasanList, setBalasanList] = useState<NotaBalasan[]>([]);
  const [subKegiatanList, setSubKegiatanList] = useState<SubKegiatan[]>([]);
  const [rekananList, setRekananList] = useState<Rekanan[]>([]);
  const [uraianBelanjaList, setUraianBelanjaList] = useState<UraianBelanja[]>([]);
  const [pejabatKeuanganList, setPejabatKeuanganList] = useState<PejabatKeuangan[]>([]);
  const [daftarHargaList, setDaftarHargaList] = useState<DaftarHarga[]>([]);

  // Active document selection state (TXTNOMORURUT equivalent)
  const [activePesananId, setActivePesananId] = useState<string>('1');
  const [activeRekapId, setActiveRekapId] = useState<string>('');


  // Print Preview triggers
  const [printDocTypes, setPrintDocTypes] = useState<Array<'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | 'kwitansi_besar' | 'bast_rekapan'>>(['nota']);
  const [isBalasanModalOpen, setIsBalasanModalOpen] = useState(false);
  const [isBastModalOpen, setIsBastModalOpen] = useState(false);
  const [isSewaModalOpen, setIsSewaModalOpen] = useState(false);
  const [isKwitansiModalOpen, setIsKwitansiModalOpen] = useState(false);
  const [isBastRekapanModalOpen, setIsBastRekapanModalOpen] = useState(false);
  const [isKwitansiBesarModalOpen, setIsKwitansiBesarModalOpen] = useState(false);

  // Kop Surat state
  const [kopSurat, setKopSurat] = useState<KopSurat>({
    pemerintahDaerah: 'PEMERINTAH KABUPATEN HALMAHERA SELATAN',
    namaDinas: 'BADAN KEPEGAWAIAN PENDIDIKAN DAN\nPELATIHAN DAERAH',
    alamatJalan: 'Jl. Kebun Karet No.1 Tlpn. Tomori',
    teleponFaksimile: '',
    website: '',
    email: '',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Lambang_Kabupaten_Halmahera_Selatan.png'
  });

  // Load database from localStorage on mount
  useEffect(() => {
    const cachedPesanan = localStorage.getItem('nota_pesanan_list');
    const cachedItems = localStorage.getItem('nota_item_list');
    const cachedKwitansi = localStorage.getItem('nota_kwitansi_list');
    const cachedBast = localStorage.getItem('nota_bast_list');
    const cachedBastRekapan = localStorage.getItem('nota_bast_rekapan_list');
    const cachedKwitansiBesar = localStorage.getItem('nota_kwitansi_besar_list');
    const cachedSewa = localStorage.getItem('nota_sewa_list');
    const cachedKop = localStorage.getItem('nota_kop_surat');
    const cachedSubKegiatan = localStorage.getItem('nota_sub_kegiatan_list');
    const cachedRekanan = localStorage.getItem('nota_rekanan_list');
    const cachedUraianBelanja = localStorage.getItem('nota_uraian_belanja_list');
    const cachedPejabatKeuangan = localStorage.getItem('nota_pejabat_keuangan_list');
    const cachedRekapBelanja = localStorage.getItem('nota_rekap_belanja_list');

    const cachedDaftarHarga = localStorage.getItem('nota_daftar_harga_list');

    if (cachedKop) {
      const parsed = JSON.parse(cachedKop);
      setKopSurat(prev => ({
        ...prev,
        ...parsed,
        logoUrl: parsed.logoUrl || prev.logoUrl
      }));
    }

    if (cachedSubKegiatan) {
      setSubKegiatanList(JSON.parse(cachedSubKegiatan));
    } else {
      setSubKegiatanList(SUB_KEGIATAN_MASTER_SAMPLES);
      localStorage.setItem('nota_sub_kegiatan_list', JSON.stringify(SUB_KEGIATAN_MASTER_SAMPLES));
    }

    if (cachedRekanan) {
      setRekananList(JSON.parse(cachedRekanan));
    } else {
      setRekananList(REKANAN_MASTER_SAMPLES);
      localStorage.setItem('nota_rekanan_list', JSON.stringify(REKANAN_MASTER_SAMPLES));
    }

    if (cachedUraianBelanja) {
      setUraianBelanjaList(JSON.parse(cachedUraianBelanja));
    } else {
      setUraianBelanjaList(URAIAN_BELANJA_MASTER_SAMPLES);
      localStorage.setItem('nota_uraian_belanja_list', JSON.stringify(URAIAN_BELANJA_MASTER_SAMPLES));
    }

    if (cachedPejabatKeuangan) {
      setPejabatKeuanganList(JSON.parse(cachedPejabatKeuangan));
    } else {
      setPejabatKeuanganList(PEJABAT_KEUANGAN_MASTER_SAMPLES);
      localStorage.setItem('nota_pejabat_keuangan_list', JSON.stringify(PEJABAT_KEUANGAN_MASTER_SAMPLES));
    }

    if (cachedDaftarHarga) {
      setDaftarHargaList(JSON.parse(cachedDaftarHarga));
    } else {
      setDaftarHargaList(DAFTAR_HARGA_MASTER_SAMPLES);
      localStorage.setItem('nota_daftar_harga_list', JSON.stringify(DAFTAR_HARGA_MASTER_SAMPLES));
    }

    if (cachedPesanan && cachedItems) {
      setPesananList(JSON.parse(cachedPesanan));
      setItemList(JSON.parse(cachedItems));
      if (cachedKwitansi) setKwitansiList(JSON.parse(cachedKwitansi));
      if (cachedBast) setBastList(JSON.parse(cachedBast));
    if (cachedBastRekapan) setBastRekapanList(JSON.parse(cachedBastRekapan));
    if (cachedKwitansiBesar) setKwitansiBesarList(JSON.parse(cachedKwitansiBesar));
      if (cachedSewa) setSewaList(JSON.parse(cachedSewa));
      const cachedBalasan = localStorage.getItem('nota_balasan_list');
      if (cachedBalasan) setBalasanList(JSON.parse(cachedBalasan));
    } else {
      // Boot with premium, realistic sample datasets representing standard administrative orders
      const samplePesanan: Pesanan = {
        id_pesanan: '1',
        sub_kegiatan: 'Penyediaan Peralatan dan Perlengkapan Kantor',
        uraian_belanja: 'Belanja Alat Tulis Kantor (ATK)',
        mata_anggaran: '5.1.02.01.01.0024',
        bendahara: 'Hj. Nurhayati, S.E.',
        nip_bendahara: '19760412 200212 2 003',
        kepala_kantor: 'Dr. Andi Setiadi, M.Si',
        nip_kepala_kantor: '19690815 199403 1 004',
        no_nota: `900/012/BKPPD-HS/${toRoman(new Date().getMonth() + 1)}/${new Date().getFullYear()}`,
        keterangan: 'Terlampir Bersama Ini Kami Sampaikan Nota Pesanan Untuk Kebutuhan Kantor Berupa Belanja Alat Tulis Kantor (ATK) Pada BKPPD Kabupaten Halmahera Selatan di Mohon Kepada Pemilik Toko Dapat Melayani Permintaan Kami.',
        kepada: 'Toko Halmahera ATK',
        nama_pemilik: 'H. Ahmad Fauzi',
        alamat_pemilik: 'Jl. Pemuda No. 12, Labuha',
        dikeluarkan_di: 'Labuha',
        tgl_penetapan: '12',
        bulan_penetapan: INDONESIAN_MONTHS[new Date().getMonth()],
        tahun_penetapan: String(new Date().getFullYear()),
        total_bruto: 1450000,
        ppn_resto_type: 'PPN',
        persen_ppn: 11,
        harga_ppn: 143694, // inclusive Indonesian tax math: 1450000 - (1450000 / 1.11)
        pph_type: 'None',
        persen_pph: 0,
        harga_pph: 0,
        jumlah_bersih: 1306306 // 1450000 - 143694
      };

      const sampleItems: ItemBarang[] = [
        {
          id: 'item_sample_1',
          id_pesanan: '1',
          no_urut_nota: 1,
          nama_barang: 'Kertas HVS Sinar Dunia F4 80gr',
          volume: 10,
          ket_volume: 'Rim',
          harga_satuan: 65000,
          jumlah: 650000
        },
        {
          id: 'item_sample_2',
          id_pesanan: '1',
          no_urut_nota: 2,
          nama_barang: 'Pena Ballliner Pentel Hitam',
          volume: 20,
          ket_volume: 'Pcs',
          harga_satuan: 40000,
          jumlah: 800000
        }
      ];

      const sampleKwitansi: Kwitansi = {
        id_kwitansi: 'kw_1',
        id_pesanan: '1',
        no_bukti: `KW/1/BKPPD-HS/${new Date().getFullYear()}`,
        npwp: '00.123.456.7-942.000',
        kode_org: '8.01.0.00.0.00.01.0000',
        lokasi_dana: 'GU',
        tahun: String(new Date().getFullYear()),
        terima_dari: 'Bendahara Pengeluaran BKPPD Kab. Halmahera Selatan',
        uang_sejumlah: 1450000,
        terbilang: 'Satu Juta Empat Ratus Lima Puluh Ribu Rupiah',
        untuk_pembayaran: 'Pembayaran Belanja Alat Tulis Kantor (ATK) Guna Kebutuhan Kantor BKPPD Kabupaten Halmahera Selatan.',
        dikeluarkan_di: 'Labuha',
        pada_tanggal: `12 ${INDONESIAN_MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
        bendahara: 'Hj. Nurhayati, S.E.',
        nip_bendahara: '19760412 200212 2 003',
        kepala_kantor: 'Dr. Andi Setiadi, M.Si',
        nip_kepala_kantor: '19690815 199403 1 004',
        pengurus: 'Samsul Bahri, A.Md.',
        nip_pengurus: '19880502 201101 1 002',
        yang_menerima: 'H. Ahmad Fauzi',
        alamat_penerima: 'Jl. Pemuda No. 12, Labuha'
      };

      setPesananList([samplePesanan]);
      setItemList(sampleItems);
      setKwitansiList([sampleKwitansi]);

      localStorage.setItem('nota_pesanan_list', JSON.stringify([samplePesanan]));
      localStorage.setItem('nota_item_list', JSON.stringify(sampleItems));
      localStorage.setItem('nota_kwitansi_list', JSON.stringify([sampleKwitansi]));
    }
  }, []);

  // Save changes callback
  const handleSavePesanan = (pesanan: Pesanan, items: ItemBarang[]) => {
    // 1. Update Pesanan list (insert or replace)
    const updatedPesanan = pesananList.some(p => p.id_pesanan === pesanan.id_pesanan)
      ? pesananList.map(p => p.id_pesanan === pesanan.id_pesanan ? pesanan : p)
      : [...pesananList, pesanan];

    // 2. Remove old items for this ID, and append new ones
    const updatedItems = [
      ...itemList.filter(it => it.id_pesanan !== pesanan.id_pesanan),
      ...items
    ];

    setPesananList(updatedPesanan);
    setItemList(updatedItems);

    localStorage.setItem('nota_pesanan_list', JSON.stringify(updatedPesanan));
    localStorage.setItem('nota_item_list', JSON.stringify(updatedItems));

    // 3. Update or Insert items into Daftar Harga if new or if price changes
    let updatedDaftarHarga = [...daftarHargaList];
    let changed = false;

    items.forEach(item => {
      const itemNama = (item.nama_barang || '').trim();
      const itemSatuan = (item.ket_volume || '').trim();
      const itemHarga = item.harga_satuan || 0;

      if (!itemNama) return;

      // Find by matching BOTH name and unit (case-insensitive and trimmed)
      const existingIdx = updatedDaftarHarga.findIndex(
        dh => (dh.nama_barang || '').trim().toLowerCase() === itemNama.toLowerCase() &&
              (dh.satuan || '').trim().toLowerCase() === itemSatuan.toLowerCase()
      );

      if (existingIdx !== -1) {
        // Exists. Check if price changed
        if (updatedDaftarHarga[existingIdx].harga_satuan !== itemHarga) {
          updatedDaftarHarga[existingIdx] = {
            ...updatedDaftarHarga[existingIdx],
            harga_satuan: itemHarga
          };
          changed = true;
        }
      } else {
        // Does not exist. Create new entry
        const newId = 'h_gen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const newEntry = {
          id: newId,
          nama_barang: itemNama,
          satuan: itemSatuan || 'Pcs',
          harga_satuan: itemHarga
        };
        updatedDaftarHarga.push(newEntry);
        changed = true;
      }
    });

    if (changed) {
      setDaftarHargaList(updatedDaftarHarga);
      localStorage.setItem('nota_daftar_harga_list', JSON.stringify(updatedDaftarHarga));
    }
  };

  const handleDeletePesanan = (id: string) => {
    const updatedPesanan = pesananList.filter(p => p.id_pesanan !== id);
    const updatedItems = itemList.filter(it => it.id_pesanan !== id);
    const updatedKwitansi = kwitansiList.filter(k => k.id_pesanan !== id);
    const updatedBast = bastList.filter(b => b.id_pesanan !== id);
    const updatedSewa = sewaList.filter(s => s.id_pesanan !== id);
    const updatedBalasan = balasanList.filter(b => b.id_pesanan !== id);

    setPesananList(updatedPesanan);
    setItemList(updatedItems);
    setKwitansiList(updatedKwitansi);
    setBastList(updatedBast);
    setSewaList(updatedSewa);
    setBalasanList(updatedBalasan);

    localStorage.setItem('nota_pesanan_list', JSON.stringify(updatedPesanan));
    localStorage.setItem('nota_item_list', JSON.stringify(updatedItems));
    localStorage.setItem('nota_kwitansi_list', JSON.stringify(updatedKwitansi));
    localStorage.setItem('nota_bast_list', JSON.stringify(updatedBast));
    localStorage.setItem('nota_sewa_list', JSON.stringify(updatedSewa));
    localStorage.setItem('nota_balasan_list', JSON.stringify(updatedBalasan));

    setActivePesananId('1');
    alert(`Data pesanan nomor urut ${id} beserta lampiran kwitansi/BAST/Sewa/Balasan berhasil dihapus.`);
  };

  const handleBulkDeletePesanan = (ids: string[]) => {
    const updatedPesanan = pesananList.filter(p => !ids.includes(p.id_pesanan));
    const updatedItems = itemList.filter(it => !ids.includes(it.id_pesanan));
    const updatedKwitansi = kwitansiList.filter(k => !ids.includes(k.id_pesanan));
    const updatedBast = bastList.filter(b => !ids.includes(b.id_pesanan));
    const updatedSewa = sewaList.filter(s => !ids.includes(s.id_pesanan));
    const updatedBalasan = balasanList.filter(b => !ids.includes(b.id_pesanan));

    setPesananList(updatedPesanan);
    setItemList(updatedItems);
    setKwitansiList(updatedKwitansi);
    setBastList(updatedBast);
    setSewaList(updatedSewa);
    setBalasanList(updatedBalasan);

    localStorage.setItem('nota_pesanan_list', JSON.stringify(updatedPesanan));
    localStorage.setItem('nota_item_list', JSON.stringify(updatedItems));
    localStorage.setItem('nota_kwitansi_list', JSON.stringify(updatedKwitansi));
    localStorage.setItem('nota_bast_list', JSON.stringify(updatedBast));
    localStorage.setItem('nota_sewa_list', JSON.stringify(updatedSewa));
    localStorage.setItem('nota_balasan_list', JSON.stringify(updatedBalasan));

    if (ids.includes(activePesananId)) {
      setActivePesananId('1');
    }
    alert(`Berhasil menghapus ${ids.length} data pesanan terpilih.`);
  };

  const handleSaveRekapBelanja = (rekap: RekapBelanja) => {
    const updated = rekapBelanjaList.some(r => r.id_rekap === rekap.id_rekap)
      ? rekapBelanjaList.map(r => r.id_rekap === rekap.id_rekap ? rekap : r)
      : [...rekapBelanjaList, rekap];
    setRekapBelanjaList(updated);
    localStorage.setItem('nota_rekap_belanja_list', JSON.stringify(updated));
  };

  const handleDeleteRekapBelanja = (id: string) => {
    const updated = rekapBelanjaList.filter(r => r.id_rekap !== id);
    setRekapBelanjaList(updated);
    localStorage.setItem('nota_rekap_belanja_list', JSON.stringify(updated));
  };


  const handleSavePesananList = (updated: Pesanan[]) => {
    setPesananList(updated);
    localStorage.setItem('nota_pesanan_list', JSON.stringify(updated));
  };

  
  const handleSaveBASTRekapan = (bastRekapan: BASTRekapan) => {
    const newList = [...bastRekapanList.filter(b => b.id_bast_rekapan !== bastRekapan.id_bast_rekapan), bastRekapan];
    setBastRekapanList(newList);
    localStorage.setItem('nota_bast_rekapan_list', JSON.stringify(newList));
    // setIsBastRekapanModalOpen(false); // don't close, let user view it
  };


  const handleSaveKwitansiBesar = (kwitansiBesar: KwitansiBesar) => {
    const newList = [...kwitansiBesarList.filter(k => k.id_kwitansi_besar !== kwitansiBesar.id_kwitansi_besar), kwitansiBesar];
    setKwitansiBesarList(newList);
    localStorage.setItem('nota_kwitansi_besar_list', JSON.stringify(newList));
  };


  const handleSaveKwitansi = (kwitansi: Kwitansi) => {
    const updated = kwitansiList.some(k => k.id_pesanan === kwitansi.id_pesanan)
      ? kwitansiList.map(k => k.id_pesanan === kwitansi.id_pesanan ? kwitansi : k)
      : [...kwitansiList, kwitansi];

    setKwitansiList(updated);
    localStorage.setItem('nota_kwitansi_list', JSON.stringify(updated));
  };

  const handleSaveBAST = (bast: BAST) => {
    const updated = bastList.some(b => b.id_pesanan === bast.id_pesanan)
      ? bastList.map(b => b.id_pesanan === bast.id_pesanan ? bast : b)
      : [...bastList, bast];

    setBastList(updated);
    localStorage.setItem('nota_bast_list', JSON.stringify(updated));
  };

  const handleSaveSewa = (sewa: Sewa) => {
    const updated = sewaList.some(s => s.id_pesanan === sewa.id_pesanan)
      ? sewaList.map(s => s.id_pesanan === sewa.id_pesanan ? sewa : s)
      : [...sewaList, sewa];

    setSewaList(updated);
    localStorage.setItem('nota_sewa_list', JSON.stringify(updated));
  };

  const handleSaveBalasan = (balasan: NotaBalasan) => {
    const updated = balasanList.some(b => b.id_pesanan === balasan.id_pesanan)
      ? balasanList.map(b => b.id_pesanan === balasan.id_pesanan ? balasan : b)
      : [...balasanList, balasan];

    setBalasanList(updated);
    localStorage.setItem('nota_balasan_list', JSON.stringify(updated));
  };

  const handleSaveKopSurat = (kop: KopSurat) => {
    setKopSurat(kop);
    localStorage.setItem('nota_kop_surat', JSON.stringify(kop));
  };

  const handleSaveSubKegiatan = (updated: SubKegiatan[]) => {
    setSubKegiatanList(updated);
    localStorage.setItem('nota_sub_kegiatan_list', JSON.stringify(updated));
  };

  const handleSaveRekanan = (updated: Rekanan[]) => {
    setRekananList(updated);
    localStorage.setItem('nota_rekanan_list', JSON.stringify(updated));
  };

  const handleSaveUraianBelanja = (updated: UraianBelanja[]) => {
    setUraianBelanjaList(updated);
    localStorage.setItem('nota_uraian_belanja_list', JSON.stringify(updated));
  };

  const handleSavePejabatKeuangan = (updated: PejabatKeuangan[]) => {
    setPejabatKeuanganList(updated);
    localStorage.setItem('nota_pejabat_keuangan_list', JSON.stringify(updated));
  };

  const handleSaveDaftarHarga = (updated: DaftarHarga[]) => {
    setDaftarHargaList(updated);
    localStorage.setItem('nota_daftar_harga_list', JSON.stringify(updated));
  };

  // Find relational entities
  const activePesanan = pesananList.find(p => p.id_pesanan === activePesananId);
  const activeRekap = rekapBelanjaList.find(r => r.id_rekap === activeRekapId);
  const activeItems = itemList.filter(it => it.id_pesanan === activePesananId);
  const activeKwitansi = kwitansiList.find(k => k.id_pesanan === activePesananId);
  const activeBast = bastList.find(b => b.id_pesanan === activePesananId);
  const activeSewa = sewaList.find(s => s.id_pesanan === activePesananId);
  const activeBalasan = balasanList.find(b => b.id_pesanan === activePesananId);

  // Trigger browser print dialog for document
  const triggerPrint = (docType: 'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | 'kwitansi_besar' | 'bast_rekapan' | Array<'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | 'kwitansi_besar' | 'bast_rekapan'>) => {
    setPrintDocTypes(Array.isArray(docType) ? docType : [docType]);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 antialiased flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION: No-print */}
      <aside className="w-full md:w-64 bg-[#1E293B] border-b md:border-b-0 md:border-r border-slate-800/80 no-print flex flex-col shrink-0">
        {/* Brand Header inside Sidebar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow-md shrink-0">
            NP
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">NOTA PESANAN <span className="text-indigo-400 font-mono text-xs font-normal">v1.2</span></h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 font-mono">BKPPD HALMAHERA SELATAN</p>
          </div>
        </div>

        {/* Navigation Tabs Selector - Horizontal on mobile, Vertical on Desktop */}
        <nav className="p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto gap-1.5 md:space-y-1 scrollbar-none flex-1">
          <button
            onClick={() => setActiveTab('pesanan')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'pesanan' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <FileText size={14} className="shrink-0" />
            <span>Data Pesanan &amp; Item</span>
          </button>

          <button
            onClick={() => setActiveTab('rekap_belanja')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'rekap_belanja' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <List size={14} className="shrink-0 text-cyan-400" />
            <span>Data Rekap Belanja</span>
          </button>
          <button
            onClick={() => setActiveTab('sub_kegiatan')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'sub_kegiatan' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <Folders size={14} className="shrink-0 text-amber-400" />
            <span>Data Sub Kegiatan</span>
          </button>

          <button
            onClick={() => setActiveTab('rekanan')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'rekanan' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <Store size={14} className="shrink-0 text-emerald-400" />
            <span>Data Rekanan</span>
          </button>

          <button
            onClick={() => setActiveTab('pejabat')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'pejabat' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <Users size={14} className="shrink-0" />
            <span>Data Pejabat Keuangan</span>
          </button>

          <button
            onClick={() => setActiveTab('uraian_belanja')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'uraian_belanja' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <ListOrdered size={14} className="shrink-0" />
            <span>Uraian Belanja</span>
          </button>

          <button
            onClick={() => setActiveTab('daftar_harga')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'daftar_harga' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <Tag size={14} className="shrink-0" />
            <span>Daftar Harga</span>
          </button>

          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'mysql' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <Database size={14} className="shrink-0" />
            <span>Database Export (MySQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-2 md:gap-2.5 shrink-0 w-auto md:w-full ${activeTab === 'pengaturan' ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' : 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'}`}
          >
            <Settings size={14} className="shrink-0" />
            <span>Pengaturan Kop</span>
          </button>
        </nav>

        {/* Sidebar Telemetry Stats at Bottom */}
        <div className="p-4 border-t border-slate-800/80 bg-[#141C2F]/50 hidden md:block">
          <span className="text-[9px] uppercase text-slate-500 font-extrabold leading-none block mb-2">TELEMETRY SUITE</span>
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Orders:</span>
              <span className="text-emerald-400 font-bold">{pesananList.length} Saved</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">Total Budget:</span>
              <span className="text-indigo-300 font-bold break-all">
                {formatRupiah(pesananList.reduce((sum, p) => sum + (p.total_bruto || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP BAR / HEADER (Contains Quick Print buttons) */}
        <header className="bg-[#1E293B] border-b border-slate-800/80 py-3 px-6 no-print shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {activeTab === 'pesanan' && 'Data Pesanan & Item'}
                {activeTab === 'rekap_belanja' && 'Data Rekap Belanja'}
                {activeTab === 'sub_kegiatan' && 'Data Master Sub Kegiatan'}
                {activeTab === 'pejabat' && 'Data Master Pejabat Keuangan'}
                {activeTab === 'uraian_belanja' && 'Data Master Uraian Belanja'}
                {activeTab === 'daftar_harga' && 'Data Master Daftar Harga'}
                {activeTab === 'mysql' && 'Database Export (MySQL)'}
                {activeTab === 'pengaturan' && 'Pengaturan Kop Surat'}
              </h2>
              <p className="text-[10px] text-slate-400">
                {activePesanan ? `Aktif: No. Urut ${activePesananId} - ${activePesanan.kepada || 'Tanpa Nama'}` : 'Tidak ada pesanan aktif'}
              </p>
            </div>
          </div>
        </header>

        {/* CORE WORKSPACE CONTENT: No-print */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 no-print">
          {/* Dynamic Warning if PO is unsaved on child tabs */}
          {activeTab !== 'pesanan' && activeTab !== 'pengaturan' && !activePesanan && (
            <div className="bg-amber-950/40 border border-amber-900/60 rounded-xl p-3 text-amber-300 text-xs font-medium flex items-center gap-2 mb-6">
              <ShieldAlert size={15} className="text-amber-500 shrink-0" />
              <span>
                Peringatan: Tidak ada data Nota Pesanan tersimpan untuk <strong className="text-white">No. Urut {activePesananId}</strong>. Data isian tab ini tidak akan terhubung ke Nota Pesanan sebelum Anda menyimpannya pada tab <strong className="text-white">Data Pesanan</strong>.
              </span>
            </div>
          )}

          {/* Tab Components render */}
          {activeTab === 'pesanan' && (
            <DataPesananForm
              pesananList={pesananList}
              itemList={itemList}
              currentPesananId={activePesananId}
              onSelectPesanan={setActivePesananId}
              onSavePesanan={handleSavePesanan}
              onDeletePesanan={handleDeletePesanan}
              onBulkDeletePesanan={handleBulkDeletePesanan}
              onSavePesananList={handleSavePesananList}
              onNextId={onNextId}
              onChangeTab={(tab) => {
                if (tab === 'balasan') {
                  setIsBalasanModalOpen(true);
                } else if (tab === 'bast') {
                  setIsBastModalOpen(true);
                } else if (tab === 'sewa') {
                  setIsSewaModalOpen(true);
                } else if (tab === 'kwitansi') {
                  setIsKwitansiModalOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              onTriggerPrint={triggerPrint}
              subKegiatanList={subKegiatanList}
              rekananList={rekananList}
              uraianBelanjaList={uraianBelanjaList}
              pejabatKeuanganList={pejabatKeuanganList}
              daftarHargaList={daftarHargaList}
            />
          )}



          
          {activeTab === 'rekap_belanja' && (
            <DataRekapBelanjaForm
              rekapBelanjaList={rekapBelanjaList}
              pesananList={pesananList}
              subKegiatanList={subKegiatanList}
              rekananList={rekananList}
              activeRekapId={activeRekapId}
              onSelectRekap={setActiveRekapId}
              onSaveRekap={handleSaveRekapBelanja}
              onDeleteRekap={handleDeleteRekapBelanja}
              onDeletePesanan={handleDeletePesanan}
              onBulkDeletePesanan={handleBulkDeletePesanan}
              onTriggerPrint={triggerPrint}
              onChangeTab={(tab) => {
                if (tab === 'bast_rekapan') {
                  setIsBastRekapanModalOpen(true);
                } else if (tab === 'kwitansi_besar') {
                  setIsKwitansiBesarModalOpen(true);
                }
              }}
            />
          )}
          {activeTab === 'sub_kegiatan' && (
            <SubKegiatanForm
              subKegiatanList={subKegiatanList}
              onSave={handleSaveSubKegiatan}
            />
          )}

          {activeTab === 'rekanan' && (
            <RekananForm
              rekananList={rekananList}
              onSave={handleSaveRekanan}
            />
          )}

          {activeTab === 'pejabat' && (
            <PejabatKeuanganForm
              pejabatKeuanganList={pejabatKeuanganList}
              onSave={handleSavePejabatKeuangan}
            />
          )}

          {activeTab === 'uraian_belanja' && (
            <UraianBelanjaForm
              uraianBelanjaList={uraianBelanjaList}
              onSave={handleSaveUraianBelanja}
            />
          )}

          {activeTab === 'daftar_harga' && (
            <DaftarHargaForm
              daftarHargaList={daftarHargaList}
              onSave={handleSaveDaftarHarga}
            />
          )}

          {activeTab === 'mysql' && (
            <MySQLExporterPanel
              pesananList={pesananList}
              itemList={itemList}
              kwitansiList={kwitansiList}
              bastList={bastList}
              sewaList={sewaList}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanForm
              kopSurat={kopSurat}
              onSaveKopSurat={handleSaveKopSurat}
            />
          )}
        </main>

        {/* FOOTER: No-print */}
        <footer className="bg-[#1E293B] border-t border-slate-800/80 py-3 px-6 no-print text-slate-400 mt-auto text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <BookOpen size={14} className="text-slate-500" />
              <span className="font-mono text-[11px] uppercase tracking-wide">VBA SUITE &bull; HIGH DENSITY CONTROL PANEL &bull; BKPPD KAB. HALMAHERA SELATAN</span>
            </div>
            <p className="font-mono text-[10px] text-slate-500">SYNC STATE: OK &bull; LOCAL STORAGE CACHE &bull; PORT: 3000</p>
          </div>
        </footer>

      </div>

      {/* Modal - Nota Balasan Supplier */}
      <NotaBalasanForm
        isOpen={isBalasanModalOpen}
        onClose={() => setIsBalasanModalOpen(false)}
        currentPesanan={activePesanan}
        balasanList={balasanList}
        onSaveBalasan={handleSaveBalasan}
        onTriggerPrint={triggerPrint}
      />

      {/* Modal - Kwitansi */}
      <KwitansiForm
        isOpen={isKwitansiModalOpen}
        onClose={() => setIsKwitansiModalOpen(false)}
        currentPesanan={activePesanan}
        kwitansiList={kwitansiList}
        onSaveKwitansi={handleSaveKwitansi}
        onTriggerPrint={triggerPrint}
      />

      {/* Modal - Berita Acara Serah Terima (BAST) */}
      <BASTForm
        isOpen={isBastModalOpen}
        onClose={() => setIsBastModalOpen(false)}
        currentPesanan={activePesanan}
        bastList={bastList}
        rekananList={rekananList}
        pejabatKeuanganList={pejabatKeuanganList}
        onSaveBAST={handleSaveBAST}
        onTriggerPrint={triggerPrint}
      />

      {/* Modal - Perjanjian Sewa */}
      <SewaForm
        isOpen={isSewaModalOpen}
        onClose={() => setIsSewaModalOpen(false)}
        currentPesanan={activePesanan}
        sewaList={sewaList}
        rekananList={rekananList}
        pejabatKeuanganList={pejabatKeuanganList}
        onSaveSewa={handleSaveSewa}
        onTriggerPrint={triggerPrint}
      />

      {/* PRINT AREA ONLY: Visible during browser page print, completely hidden on screen */}
      <div className="hidden print:block print:bg-white print:text-black">
        {true && (
          <PrintTemplates
            pesanan={activePesanan}
            items={activeItems}
            kwitansi={activeKwitansi}
            bast={activeBast}
            sewa={activeSewa}
                        balasan={activeBalasan}
            bastRekapan={bastRekapanList.find(b => b.id_rekap === activeRekapId)}
            kwitansiBesar={kwitansiBesarList.find(k => k.id_rekap === activeRekapId)}
            documentType={printDocTypes}
            kopSurat={kopSurat}
            rekapBelanja={rekapBelanjaList.find(r => r.id_rekap === activeRekapId)}
            rekapItems={pesananList.filter(p => rekapBelanjaList.find(r => r.id_rekap === activeRekapId)?.pesanan_ids.includes(p.id_pesanan))}
          />
        )}
      </div>

    </div>
  );

  // Helper to generate next numerical PO ID
  function onNextId(): string {
    const ids = pesananList.map(p => parseInt(p.id_pesanan, 10)).filter(num => !isNaN(num));
    if (ids.length === 0) return '1';
    return String(Math.max(...ids) + 1);
  }
}
