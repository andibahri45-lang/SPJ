import React, { useState, useEffect } from 'react';
import {
  Pesanan,
  ItemBarang,
  SUB_KEGIATAN_SAMPLES,
  URAIAN_BELANJA_SAMPLES,
  NAMA_BARANG_SAMPLES,
  KEPADA_SAMPLES,
  KET_VOLUME_SAMPLES,
  INDONESIAN_MONTHS,
  toRoman,
  SubKegiatan,
  UraianBelanja,
  PejabatKeuangan,
  DaftarHarga,
  DAFTAR_HARGA_MASTER_SAMPLES,
  formatNumberWithSeparator,
  parseSeparatorToNumber,
  Rekanan
} from '../types';
import { formatRupiah } from './PrintTemplates';
import DatePicker from './DatePicker';
import { Plus, Trash2, RotateCcw, AlertCircle, Edit3, ChevronLeft, ChevronRight, HelpCircle, FileText, Settings, Database, Search, Printer, ChevronDown, Check, Download, Upload, FileSpreadsheet, Sparkles } from 'lucide-react';

interface DataPesananFormProps {
  pesananList: Pesanan[];
  itemList: ItemBarang[];
  currentPesananId: string;
  onSelectPesanan: (id: string) => void;
  onSavePesanan: (pesanan: Pesanan, items: ItemBarang[]) => void;
  onDeletePesanan: (id: string) => void;
  onBulkDeletePesanan?: (ids: string[]) => void;
  onSavePesananList?: (list: Pesanan[]) => void;
  onNextId: () => string;
  onChangeTab?: (tab: 'pesanan' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | 'sub_kegiatan' | 'rekanan' | 'uraian_belanja' | 'pejabat' | 'daftar_harga' | 'mysql' | 'pengaturan') => void;
  onTriggerPrint?: (docType: 'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa' | Array<'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa'>) => void;
  subKegiatanList?: SubKegiatan[];
  rekananList?: Rekanan[];
  uraianBelanjaList?: UraianBelanja[];
  pejabatKeuanganList?: PejabatKeuangan[];
  daftarHargaList?: DaftarHarga[];
}

export default function DataPesananForm({
  pesananList,
  itemList,
  currentPesananId,
  onSelectPesanan,
  onSavePesanan,
  onDeletePesanan,
  onBulkDeletePesanan,
  onSavePesananList,
  onNextId,
  onChangeTab,
  onTriggerPrint,
  subKegiatanList = [],
  rekananList = [],
  uraianBelanjaList = [],
  pejabatKeuanganList = [],
  daftarHargaList = []
}: DataPesananFormProps) {
  // Navigation State
  const [activeId, setActiveId] = useState<string>(currentPesananId);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Checkbox selection state for pesanan table
  const [selectedPesananIds, setSelectedPesananIds] = useState<string[]>([]);

  // Pending import items for upload confirmation modal
  const [pendingImportPesanan, setPendingImportPesanan] = useState<Pesanan[] | null>(null);

  // Core Form fields
  const [subKegiatan, setSubKegiatan] = useState('');
  const [uraianBelanja, setUraianBelanja] = useState('');
  const [mataAnggaran, setMataAnggaran] = useState('');
  const [bendahara, setBendahara] = useState('Hj. Nurhayati, S.E.');
  const [nipBendahara, setNipBendahara] = useState('19760412 200212 2 003');
  const [kepalaKantor, setKepalaKantor] = useState('Dr. Andi Setiadi, M.Si');
  const [nipKepalaKantor, setNipKepalaKantor] = useState('19690815 199403 1 004');
  const [noNota, setNoNota] = useState('');
  const [keterangan, setKeterangan] = useState('');
  
  // Supplier State
  const [kepada, setKepada] = useState('');
  const [namaPemilik, setNamaPemilik] = useState('');
  const [alamatPemilik, setAlamatPemilik] = useState('');

  // Location/Dates
  const [dikeluarkanDi, setDikeluarkanDi] = useState('Labuha');
  const [tglPenetapan, setTglPenetapan] = useState(() => String(new Date().getDate()));
  const [bulanPenetapan, setBulanPenetapan] = useState(() => INDONESIAN_MONTHS[new Date().getMonth()]);
  const [tahunPenetapan, setTahunPenetapan] = useState(() => String(new Date().getFullYear()));

  // Active Item Entry State
  const [itemNama, setItemNama] = useState('');
  const [itemVolume, setItemVolume] = useState<number | "">(1);
  const [itemSatuan, setItemSatuan] = useState('Rim');
  const [itemHarga, setItemHarga] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<ItemBarang[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Taxes
  const [ppnType, setPpnType] = useState<string>('PPN');
  const [pphType, setPphType] = useState<string>('PPh 22');
  const [manualPersenPpn, setManualPersenPpn] = useState<number | "">(11);
  const [manualPersenPph, setManualPersenPph] = useState<number | "">(1.5);
  const [customHargaPpn, setCustomHargaPpn] = useState<number | "">("");
  const [customHargaPph, setCustomHargaPph] = useState<number | "">("");

  const [batasPpn, setBatasPpn] = useState<number>(() => {
    const val = localStorage.getItem('nota_batas_ppn');
    return val !== null ? Number(val) : 1000000;
  });
  const [batasPph, setBatasPph] = useState<number>(() => {
    const val = localStorage.getItem('nota_batas_pph');
    return val !== null ? Number(val) : 2000000;
  });

  // Save thresholds to localStorage on change
  useEffect(() => {
    localStorage.setItem('nota_batas_ppn', String(batasPpn));
  }, [batasPpn]);

  useEffect(() => {
    localStorage.setItem('nota_batas_pph', String(batasPph));
  }, [batasPph]);

  const [showThresholdSettings, setShowThresholdSettings] = useState(false);

  const [catatanPpn, setCatatanPpn] = useState<string>(() => {
    return localStorage.getItem('nota_catatan_ppn') || "Transaksi di bawah {nilai} dibebaskan dari PPN.";
  });
  const [catatanPph, setCatatanPph] = useState<string>(() => {
    return localStorage.getItem('nota_catatan_pph') || "Transaksi di bawah {nilai} dibebaskan dari PPh.";
  });

  useEffect(() => {
    localStorage.setItem('nota_catatan_ppn', catatanPpn);
  }, [catatanPpn]);

  useEffect(() => {
    localStorage.setItem('nota_catatan_pph', catatanPph);
  }, [catatanPph]);

  // Search filter lists
  const [showSubKegiatanList, setShowSubKegiatanList] = useState(false);
  const [showUraianList, setShowUraianList] = useState(false);
  const [showBarangList, setShowBarangList] = useState(false);
  const [subKegiatanIndex, setSubKegiatanIndex] = useState(-1);
  const [uraianIndex, setUraianIndex] = useState(-1);
  const [barangIndex, setBarangIndex] = useState(-1);

  // Table search & action states
  const [searchQuery, setSearchQuery] = useState('');
  const [openInputDropdownId, setOpenInputDropdownId] = useState<string | null>(null);
  const [openPrintDropdownId, setOpenPrintDropdownId] = useState<string | null>(null);
  const [printSelection, setPrintSelection] = useState<Array<'nota' | 'balasan' | 'kwitansi' | 'bast' | 'sewa'>>([]);

  // Pejabat Keuangan selection states
  const [showPAKPADropdown, setShowPAKPADropdown] = useState(false);
  const [showBendaharaDropdown, setShowBendaharaDropdown] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.pa-kpa-trigger-container')) {
        setShowPAKPADropdown(false);
      }
      if (!target.closest('.bendahara-trigger-container')) {
        setShowBendaharaDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Sync with Active ID (Prev / Next transitions)
  useEffect(() => {
    const existing = pesananList.find(p => p.id_pesanan === activeId);
    if (existing) {
      setSubKegiatan(existing.sub_kegiatan);
      setUraianBelanja(existing.uraian_belanja);
      setMataAnggaran(existing.mata_anggaran);
      setBendahara(existing.bendahara);
      setNipBendahara(existing.nip_bendahara);
      setKepalaKantor(existing.kepala_kantor);
      setNipKepalaKantor(existing.nip_kepala_kantor);
      setNoNota(existing.no_nota);
      setKeterangan(existing.keterangan);
      setKepada(existing.kepada);
      setNamaPemilik(existing.nama_pemilik);
      setAlamatPemilik(existing.alamat_pemilik);
      setDikeluarkanDi(existing.dikeluarkan_di);
      setTglPenetapan(existing.tgl_penetapan);
      setBulanPenetapan(existing.bulan_penetapan);
      setTahunPenetapan(existing.tahun_penetapan);
      setPpnType(existing.ppn_resto_type);
      setPphType(existing.pph_type);
      setManualPersenPpn(existing.persen_ppn !== undefined ? existing.persen_ppn : (existing.ppn_resto_type === 'PPN' ? 11 : (existing.ppn_resto_type === 'Pajak Resto' ? 10 : 0)));
      setManualPersenPph(existing.persen_pph !== undefined ? existing.persen_pph : (existing.pph_type === 'PPh 22 (1.5%)' ? 1.5 : (existing.pph_type === 'PPh 23 (2.0%)' ? 2.0 : (existing.pph_type === 'PPh Pasal (4) ayat 2' ? 1.0 : ""))));
      setCustomHargaPpn(existing.harga_ppn !== undefined ? existing.harga_ppn : "");
      setCustomHargaPph(existing.harga_pph !== undefined ? existing.harga_pph : "");

      // Load items for this order
      const related = itemList.filter(it => it.id_pesanan === activeId);
      setCurrentItems(related);
    } else {
      // Clear or set default for a new unsaved ID
      setSubKegiatan('');
      setUraianBelanja('');
      setMataAnggaran('');
      setNoNota(`900/     /BKPPD-HS/${toRoman(new Date().getMonth() + 1)}/${new Date().getFullYear()}`);
      setKeterangan('');
      setKepada('');
      setNamaPemilik('');
      setAlamatPemilik('');
      setCurrentItems([]);
      setEditingItemId(null);
      setPpnType('PPN');
      setManualPersenPpn(11);
      setCustomHargaPpn("");
      setPphType('PPh 22');
      setManualPersenPph(1.5);
      setCustomHargaPph("");
    }
    onSelectPesanan(activeId);
  }, [activeId, pesananList]);

  // Get combined suppliers list
  const getSuppliers = () => {
    if (rekananList && rekananList.length > 0) {
      return rekananList.map(r => ({
        nama: r.perusahaan,
        pemilik: r.nama,
        alamat: r.alamat
      }));
    }
    return KEPADA_SAMPLES;
  };

  // Handle supplier lookup
  const handleSupplierChange = (storeName: string) => {
    setKepada(storeName);
    const suppliers = getSuppliers();
    const found = suppliers.find(s => s.nama === storeName);
    if (found) {
      setNamaPemilik(found.pemilik);
      setAlamatPemilik(found.alamat);
    }
  };

  // Auto generate Nota reference description (Replicates CariKet_ATK_Click)
  const generateKeteranganHelper = () => {
    if (!uraianBelanja) {
      alert('Isi Uraian Belanja terlebih dahulu.');
      return;
    }
    const template = `Terlampir Bersama Ini Kami Sampaikan Nota Pesanan Untuk Kebutuhan Kantor Berupa ${uraianBelanja} Pada BKPPD Kabupaten Halmahera Selatan di Mohon Kepada Pemilik Toko Dapat Melayani Permintaan Kami Sebagai Berikut:`;
    setKeterangan(template);
  };

  // Add Item to current lists
  const handleAddItem = () => {
    if (!itemNama || itemHarga <= 0) {
      alert('Nama barang dan Harga Satuan harus diisi dengan benar.');
      return;
    }

    const numericVolume = typeof itemVolume === 'number' ? itemVolume : 1;

    if (editingItemId) {
      // Update existing item
      setCurrentItems(prev =>
        prev.map(it =>
          it.id === editingItemId
            ? {
                ...it,
                nama_barang: itemNama,
                volume: numericVolume,
                ket_volume: itemSatuan,
                harga_satuan: itemHarga,
                jumlah: numericVolume * itemHarga
              }
            : it
        )
      );
      setEditingItemId(null);
    } else {
      // Add new item
      const newItem: ItemBarang = {
        id: `it_${Date.now()}`,
        id_pesanan: activeId,
        no_urut_nota: currentItems.length + 1,
        nama_barang: itemNama,
        volume: numericVolume,
        ket_volume: itemSatuan,
        harga_satuan: itemHarga,
        jumlah: numericVolume * itemHarga
      };
      setCurrentItems(prev => [...prev, newItem]);
    }

    // Reset item input
    setItemNama('');
    setItemVolume(1);
    setItemHarga(0);
  };

  // Edit item inside table
  const handleEditItemInTable = (item: ItemBarang) => {
    setEditingItemId(item.id);
    setItemNama(item.nama_barang);
    setItemVolume(item.volume);
    setItemSatuan(item.ket_volume);
    setItemHarga(item.harga_satuan);
  };

  // Delete item from table
  const handleDeleteItemInTable = (id: string) => {
    setCurrentItems(prev => prev.filter(it => it.id !== id));
  };

  // Clear item form
  const handleClearItemForm = () => {
    setItemNama('');
    setItemVolume(1);
    setItemHarga(0);
    setEditingItemId(null);
  };

  // Calculations Panel (Hitung Total)
  const totalBruto = currentItems.reduce((acc, curr) => acc + curr.jumlah, 0);

  // Inclusive/exclusive Indonesian Tax logic (From Excel VBA)
  let hargaPpn = 0;
  let persenPpn = 0;
  if (ppnType !== 'None' && totalBruto >= batasPpn) {
    if (manualPersenPpn !== "" && manualPersenPpn > 0) {
      persenPpn = manualPersenPpn;
      hargaPpn = Math.round((totalBruto * manualPersenPpn) / 100);
    } else {
      persenPpn = 0;
      hargaPpn = customHargaPpn !== "" ? Number(customHargaPpn) : 0;
    }
  }

  let hargaPph = 0;
  let persenPph = 0;
  if (pphType !== 'None' && totalBruto >= batasPph) {
    if (manualPersenPph !== "" && manualPersenPph > 0) {
      persenPph = manualPersenPph;
      // Formula: (TOTAL - PPN) * Persen_PPh / 100
      hargaPph = Math.round(((totalBruto - hargaPpn) * manualPersenPph) / 100);
    } else {
      persenPph = 0;
      hargaPph = customHargaPph !== "" ? Number(customHargaPph) : 0;
    }
  }

  const jumlahBersih = totalBruto - hargaPpn - hargaPph;

  // Save the entire PO document
  const handleSaveDocument = () => {
    if (!subKegiatan || !kepada) {
      alert('Mohon lengkapi Sub Kegiatan dan Supplier (Kepada) terlebih dahulu.');
      return;
    }

    const payloadPesanan: Pesanan = {
      id_pesanan: activeId,
      sub_kegiatan: subKegiatan,
      uraian_belanja: uraianBelanja,
      mata_anggaran: mataAnggaran,
      bendahara,
      nip_bendahara: nipBendahara,
      kepala_kantor: kepalaKantor,
      nip_kepala_kantor: nipKepalaKantor,
      no_nota: noNota,
      keterangan: keterangan || `Kebutuhan ${uraianBelanja} BKPPD Kab. Halmahera Selatan`,
      kepada,
      nama_pemilik: namaPemilik,
      alamat_pemilik: alamatPemilik,
      dikeluarkan_di: dikeluarkanDi,
      tgl_penetapan: tglPenetapan,
      bulan_penetapan: bulanPenetapan,
      tahun_penetapan: tahunPenetapan,
      total_bruto: totalBruto,
      ppn_resto_type: ppnType,
      persen_ppn: persenPpn,
      harga_ppn: hargaPpn,
      pph_type: pphType,
      persen_pph: persenPph,
      harga_pph: hargaPph,
      jumlah_bersih: jumlahBersih
    };

    onSavePesanan(payloadPesanan, currentItems);
    setIsFormVisible(false);
    alert(`Data Nota Pesanan No. Urut ${activeId} Berhasil Disimpan!`);
  };

  // Print current PO document directly from form
  const handlePrintDocument = () => {
    if (!subKegiatan || !kepada) {
      alert('Mohon lengkapi Sub Kegiatan dan Supplier (Kepada) terlebih dahulu.');
      return;
    }

    const payloadPesanan: Pesanan = {
      id_pesanan: activeId,
      sub_kegiatan: subKegiatan,
      uraian_belanja: uraianBelanja,
      mata_anggaran: mataAnggaran,
      bendahara,
      nip_bendahara: nipBendahara,
      kepala_kantor: kepalaKantor,
      nip_kepala_kantor: nipKepalaKantor,
      no_nota: noNota,
      keterangan: keterangan || `Kebutuhan ${uraianBelanja} BKPPD Kab. Halmahera Selatan`,
      kepada,
      nama_pemilik: namaPemilik,
      alamat_pemilik: alamatPemilik,
      dikeluarkan_di: dikeluarkanDi,
      tgl_penetapan: tglPenetapan,
      bulan_penetapan: bulanPenetapan,
      tahun_penetapan: tahunPenetapan,
      total_bruto: totalBruto,
      ppn_resto_type: ppnType,
      persen_ppn: persenPpn,
      harga_ppn: hargaPpn,
      pph_type: pphType,
      persen_pph: persenPph,
      harga_pph: hargaPph,
      jumlah_bersih: jumlahBersih
    };

    onSavePesanan(payloadPesanan, currentItems);
    if (onTriggerPrint) {
      onTriggerPrint('nota');
    }
  };

  // Navigation handlers
  const handlePrev = () => {
    const num = parseInt(activeId, 10);
    if (num > 1) {
      setActiveId(String(num - 1));
    }
  };

  const handleNext = () => {
    const num = parseInt(activeId, 10);
    setActiveId(String(num + 1));
  };

  const isSaved = pesananList.some(p => p.id_pesanan === activeId);

  // Checkbox helpers
  const handleSelectOne = (id: string) => {
    setSelectedPesananIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (filteredIds: string[]) => {
    if (selectedPesananIds.length === filteredIds.length) {
      setSelectedPesananIds([]);
    } else {
      setSelectedPesananIds(filteredIds);
    }
  };

  const handleBulkDelete = () => {
    if (selectedPesananIds.length === 0) return;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedPesananIds.length} data pesanan yang terpilih beserta lampirannya?`)) {
      if (onBulkDeletePesanan) {
        onBulkDeletePesanan(selectedPesananIds);
      } else {
        selectedPesananIds.forEach(id => onDeletePesanan(id));
      }
      setSelectedPesananIds([]);
    }
  };

  // CSV parsing helper
  const parseCSVLine = (line: string, delimiter: string = ';'): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Export Data Excel
  const handleExportExcel = () => {
    if (pesananList.length === 0) {
      alert('Tidak ada data pesanan untuk diexport.');
      return;
    }

    const headers = [
      'No. Urut',
      'Nomor SPPD/Nota',
      'Tanggal',
      'Bulan',
      'Tahun',
      'Pelaksana/Toko',
      'Nama Pemilik',
      'Alamat Pemilik',
      'Dikeluarkan Di',
      'Sub Kegiatan',
      'Uraian Belanja',
      'Mata Anggaran',
      'Keterangan',
      'Total Bruto',
      'Tipe PPN',
      'Persen PPN',
      'Harga PPN',
      'Tipe PPh',
      'Persen PPh',
      'Harga PPh',
      'Jumlah Bersih (Netto)',
      'Bendahara',
      'NIP Bendahara',
      'Kepala Kantor',
      'NIP Kepala Kantor'
    ];

    const rows = pesananList.map(p => [
      `"${(p.id_pesanan || '').replace(/"/g, '""')}"`,
      `"${(p.no_nota || '').replace(/"/g, '""')}"`,
      `"${(p.tgl_penetapan || '').replace(/"/g, '""')}"`,
      `"${(p.bulan_penetapan || '').replace(/"/g, '""')}"`,
      `"${(p.tahun_penetapan || '').replace(/"/g, '""')}"`,
      `"${(p.kepada || '').replace(/"/g, '""')}"`,
      `"${(p.nama_pemilik || '').replace(/"/g, '""')}"`,
      `"${(p.alamat_pemilik || '').replace(/"/g, '""')}"`,
      `"${(p.dikeluarkan_di || '').replace(/"/g, '""')}"`,
      `"${(p.sub_kegiatan || '').replace(/"/g, '""')}"`,
      `"${(p.uraian_belanja || '').replace(/"/g, '""')}"`,
      `"${(p.mata_anggaran || '').replace(/"/g, '""')}"`,
      `"${(p.keterangan || '').replace(/"/g, '""')}"`,
      p.total_bruto,
      `"${(p.ppn_resto_type || '').replace(/"/g, '""')}"`,
      p.persen_ppn || 0,
      p.harga_ppn || 0,
      `"${(p.pph_type || '').replace(/"/g, '""')}"`,
      p.persen_pph || 0,
      p.harga_pph || 0,
      p.jumlah_bersih || 0,
      `"${(p.bendahara || '').replace(/"/g, '""')}"`,
      `"${(p.nip_bendahara || '').replace(/"/g, '""')}"`,
      `"${(p.kepala_kantor || '').replace(/"/g, '""')}"`,
      `"${(p.nip_kepala_kantor || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "sep=;\n" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "daftar_nota_pesanan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Template Excel
  const handleDownloadTemplate = () => {
    const headers = [
      'No. Urut',
      'Nomor SPPD/Nota',
      'Tanggal',
      'Bulan',
      'Tahun',
      'Pelaksana/Toko',
      'Nama Pemilik',
      'Alamat Pemilik',
      'Dikeluarkan Di',
      'Sub Kegiatan',
      'Uraian Belanja',
      'Mata Anggaran',
      'Keterangan',
      'Total Bruto',
      'Tipe PPN',
      'Tipe PPh',
      'Bendahara',
      'NIP Bendahara',
      'Kepala Kantor',
      'NIP Kepala Kantor'
    ];

    const sampleRow = [
      '2',
      '"900/015/BKPPD-HS/VII/2026"',
      '"15"',
      '"Juli"',
      '"2026"',
      '"Toko Halmahera ATK"',
      '"H. Ahmad Fauzi"',
      '"Jl. Pemuda No. 12, Labuha"',
      '"Labuha"',
      '"Penyediaan Peralatan dan Perlengkapan Kantor"',
      '"Belanja Alat Tulis Kantor (ATK)"',
      '"5.1.02.01.01.0024"',
      '"Terlampir bersama ini kami sampaikan nota pesanan untuk kebutuhan ATK..."',
      '1450000',
      '"PPN"',
      '"None"',
      '"Hj. Nurhayati, S.E."',
      '"19760412 200212 2 003"',
      '"Dr. Andi Setiadi, M.Si"',
      '"19690815 199403 1 004"'
    ];

    const csvContent = "sep=;\n" + [headers.join(';'), sampleRow.join(';')].join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_nota_pesanan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle upload of CSV file
  const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) {
          alert('Format CSV tidak valid atau kosong.');
          return;
        }

        let delimiter = ';';
        let firstLine = lines[0];
        
        if (firstLine.toLowerCase().startsWith('sep=')) {
          const sepMatch = firstLine.match(/sep=(.)/i);
          if (sepMatch) {
            delimiter = sepMatch[1];
          }
          lines = lines.slice(1);
          firstLine = lines[0] || '';
        } else {
          const commaCount = (firstLine.match(/,/g) || []).length;
          const semicolonCount = (firstLine.match(/;/g) || []).length;
          if (commaCount > semicolonCount) {
            delimiter = ',';
          }
        }

        if (lines.length < 2) {
          alert('Format CSV tidak memiliki baris data.');
          return;
        }

        const newItems: Pesanan[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i], delimiter);

          if (cols.length >= 6) {
            const idVal = cols[0] || String(Date.now() + i);
            const brutoVal = Number(cols[13]) || 0;
            const ppnTypeVal: string = (cols[14] === 'PPN' || cols[14] === 'Pajak Resto' || cols[14] === 'None') ? cols[14] : 'None';
            const pphTypeVal: string = (cols[15] === 'PPh 22' || cols[15] === 'PPh 23' || cols[15] === 'None') ? cols[15] : 'None';

            // Tax calculations
            let calcPpn = 0;
            let percentPpnVal = 0;
            if (brutoVal >= 1000000) {
              if (ppnTypeVal === 'PPN') {
                percentPpnVal = 11;
                calcPpn = Math.round(brutoVal - brutoVal / 1.11);
              } else if (ppnTypeVal === 'Pajak Resto') {
                percentPpnVal = 10;
                calcPpn = Math.round((brutoVal * 10) / 100);
              }
            }

            let calcPph = 0;
            let percentPphVal = 0;
            if (brutoVal >= 2000000) {
              if (pphTypeVal === 'PPh 22') {
                percentPphVal = 1.5;
              } else if (pphTypeVal === 'PPh 23') {
                percentPphVal = 2;
              }
              calcPph = Math.round(((brutoVal - calcPpn) * percentPphVal) / 100);
            }

            const nettoVal = brutoVal - calcPpn - calcPph;

            newItems.push({
              id_pesanan: idVal,
              no_nota: cols[1] || '',
              tgl_penetapan: cols[2] || '',
              bulan_penetapan: cols[3] || '',
              tahun_penetapan: cols[4] || '',
              kepada: cols[5] || '',
              nama_pemilik: cols[6] || '',
              alamat_pemilik: cols[7] || '',
              dikeluarkan_di: cols[8] || 'Labuha',
              sub_kegiatan: cols[9] || '',
              uraian_belanja: cols[10] || '',
              mata_anggaran: cols[11] || '',
              keterangan: cols[12] || '',
              total_bruto: brutoVal,
              ppn_resto_type: ppnTypeVal,
              persen_ppn: percentPpnVal,
              harga_ppn: calcPpn,
              pph_type: pphTypeVal,
              persen_pph: percentPphVal,
              harga_pph: calcPph,
              jumlah_bersih: nettoVal,
              bendahara: cols[16] || 'Hj. Nurhayati, S.E.',
              nip_bendahara: cols[17] || '19760412 200212 2 003',
              kepala_kantor: cols[18] || 'Dr. Andi Setiadi, M.Si',
              nip_kepala_kantor: cols[19] || '19690815 199403 1 004'
            });
          }
        }

        if (newItems.length > 0) {
          setPendingImportPesanan(newItems);
        } else {
          alert('Tidak ada data baru yang valid ditemukan.');
        }
      } catch (err) {
        alert('Terjadi kesalahan saat membaca file: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImportPesanan = (mode: 'merge' | 'overwrite') => {
    if (!pendingImportPesanan || !onSavePesananList) return;

    if (mode === 'overwrite') {
      onSavePesananList(pendingImportPesanan);
      alert(`Berhasil mengunggah ${pendingImportPesanan.length} data pesanan (Menggantikan seluruh data lama).`);
    } else {
      const existingMap = new Map(pesananList.map(item => [item.id_pesanan, item]));
      pendingImportPesanan.forEach(item => {
        existingMap.set(item.id_pesanan, item);
      });
      onSavePesananList(Array.from(existingMap.values()));
      alert(`Berhasil menggabungkan ${pendingImportPesanan.length} data pesanan baru.`);
    }
    setPendingImportPesanan(null);
    setSelectedPesananIds([]);
  };

  const filteredSubKegiatanOptions = (subKegiatanList && subKegiatanList.length > 0
    ? subKegiatanList.map(item => item.nama_kegiatan)
    : SUB_KEGIATAN_SAMPLES
  ).filter(sk => sk.toLowerCase().includes(subKegiatan.toLowerCase()));

  const filteredUraianBelanjaOptions = (uraianBelanjaList && uraianBelanjaList.length > 0)
    ? uraianBelanjaList.filter(ub => 
        ub.nama_rekening.toLowerCase().includes(uraianBelanja.toLowerCase()) ||
        ub.kode_rekening.toLowerCase().includes(uraianBelanja.toLowerCase())
      )
    : URAIAN_BELANJA_SAMPLES.filter(ub => ub.toLowerCase().includes(uraianBelanja.toLowerCase()));

  const filteredBarangOptions = (daftarHargaList && daftarHargaList.length > 0
    ? daftarHargaList
    : DAFTAR_HARGA_MASTER_SAMPLES
  ).filter(dh => dh.nama_barang.toLowerCase().includes(itemNama.toLowerCase()));

  const handleBarangKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showBarangList) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setShowBarangList(true);
        setBarangIndex(0);
        e.preventDefault();
      }
      return;
    }

    const maxLen = filteredBarangOptions.length;
    if (maxLen === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setBarangIndex((prev) => (prev + 1 >= maxLen ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setBarangIndex((prev) => (prev - 1 < 0 ? maxLen - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (barangIndex >= 0 && barangIndex < maxLen) {
        e.preventDefault();
        const selected = filteredBarangOptions[barangIndex];
        setItemNama(selected.nama_barang);
        setItemSatuan(selected.satuan || 'Pcs');
        setItemHarga(selected.harga_satuan || 0);
        setShowBarangList(false);
        setBarangIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowBarangList(false);
      setBarangIndex(-1);
    }
  };

  const getDateString = () => {
    const day = String(tglPenetapan || '').padStart(2, '0');
    const monthIdx = INDONESIAN_MONTHS.indexOf(bulanPenetapan);
    const month = monthIdx !== -1 ? String(monthIdx + 1).padStart(2, '0') : '01';
    const year = tahunPenetapan || '2026';
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (val: string) => {
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthInt = parseInt(parts[1], 10);
      const day = String(parseInt(parts[2], 10));
      
      setTglPenetapan(day);
      if (monthInt >= 1 && monthInt <= 12) {
        setBulanPenetapan(INDONESIAN_MONTHS[monthInt - 1]);
      }
      setTahunPenetapan(year);
    }
  };

  const handleSubKegiatanKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSubKegiatanList) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setShowSubKegiatanList(true);
        setSubKegiatanIndex(0);
        e.preventDefault();
      }
      return;
    }

    const maxLen = filteredSubKegiatanOptions.length;
    if (maxLen === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSubKegiatanIndex((prev) => (prev + 1 >= maxLen ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSubKegiatanIndex((prev) => (prev - 1 < 0 ? maxLen - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (subKegiatanIndex >= 0 && subKegiatanIndex < maxLen) {
        e.preventDefault();
        const selected = filteredSubKegiatanOptions[subKegiatanIndex];
        setSubKegiatan(selected);
        setShowSubKegiatanList(false);
        setSubKegiatanIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowSubKegiatanList(false);
      setSubKegiatanIndex(-1);
    }
  };

  const handleUraianKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showUraianList) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setShowUraianList(true);
        setUraianIndex(0);
        e.preventDefault();
      }
      return;
    }

    const maxLen = filteredUraianBelanjaOptions.length;
    if (maxLen === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setUraianIndex((prev) => (prev + 1 >= maxLen ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setUraianIndex((prev) => (prev - 1 < 0 ? maxLen - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (uraianIndex >= 0 && uraianIndex < maxLen) {
        e.preventDefault();
        const selectedOption = filteredUraianBelanjaOptions[uraianIndex];
        const isObject = typeof selectedOption !== 'string';
        const name = isObject ? (selectedOption as UraianBelanja).nama_rekening : (selectedOption as string);
        const code = isObject ? (selectedOption as UraianBelanja).kode_rekening : '';

        if (isObject) {
          setUraianBelanja(name);
          setMataAnggaran(code);
        } else {
          setUraianBelanja(name);
          // Auto generate Mata Anggaran prefix mapping like Excel
          if (name.includes('ATK')) setMataAnggaran('5.1.02.01.01.0024');
          else if (name.includes('Cetak')) setMataAnggaran('5.1.02.01.01.0026');
          else if (name.includes('Sewa')) setMataAnggaran('5.1.02.02.01.0012');
          else if (name.includes('Makanan')) setMataAnggaran('5.1.02.01.01.0052');
          else setMataAnggaran('5.1.02.01.01.XXXX');
        }
        setShowUraianList(false);
        setUraianIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowUraianList(false);
      setUraianIndex(-1);
    }
  };

  const filteredPesananList = pesananList.filter(p => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      p.id_pesanan.toLowerCase().includes(query) ||
      (p.no_nota || '').toLowerCase().includes(query) ||
      (p.kepada || '').toLowerCase().includes(query) ||
      (p.nama_pemilik || '').toLowerCase().includes(query) ||
      (p.sub_kegiatan || '').toLowerCase().includes(query) ||
      (p.uraian_belanja || '').toLowerCase().includes(query) ||
      (p.dikeluarkan_di || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Active Document Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
            <Database size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Form Input Data Pesanan</h4>
            <p className="text-xs text-slate-400">Lengkapi formulir di bawah ini untuk disimpan ke database</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-400">
            ID Aktif:
          </span>
          <span className="px-3 py-1 bg-[#0F172A] border border-slate-700 rounded-lg font-bold text-indigo-400 text-xs font-mono">
            {activeId}
          </span>

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isSaved ? 'bg-green-950 text-green-300 border border-green-900/50' : 'bg-amber-950 text-amber-300 border border-amber-900/50'}`}>
            {isSaved ? 'Terdaftar di DB' : 'Draf Baru'}
          </span>

          {!isFormVisible ? (
            <button
              type="button"
              onClick={() => setIsFormVisible(true)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-650 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              title="Tampilkan Form Isian"
            >
              Tampilkan Form
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-650 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              title="Sembunyikan Form Isian"
            >
              Sembunyikan Form
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const nextId = onNextId();
              setActiveId(nextId);
              setIsFormVisible(true);
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
            title="Buat Draft Baru"
          >
            <Plus size={14} />
            Buat Baru
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: PO Metadata, Supplier, and Sign-offs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
              <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
              Informasi Anggaran &amp; Kegiatan
            </h3>

            {/* Sub Kegiatan Dropdown Helper */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sub Kegiatan</label>
              <div className="relative">
                <input
                  type="text"
                  value={subKegiatan}
                  onChange={(e) => {
                    setSubKegiatan(e.target.value);
                    setShowSubKegiatanList(true);
                    setSubKegiatanIndex(-1);
                  }}
                  onKeyDown={handleSubKegiatanKeyDown}
                  onFocus={() => {
                    setShowSubKegiatanList(true);
                    setSubKegiatanIndex(-1);
                  }}
                  onBlur={() => setTimeout(() => {
                    setShowSubKegiatanList(false);
                    setSubKegiatanIndex(-1);
                  }, 200)}
                  placeholder="Ketik untuk mencari atau membuat sub kegiatan..."
                  className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 font-medium"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Search size={12} />
                </div>
              </div>
              {showSubKegiatanList && (
                <div className="absolute z-30 w-full mt-1 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto text-xs text-slate-200 divide-y divide-slate-800">
                  {filteredSubKegiatanOptions.length > 0 ? (
                    filteredSubKegiatanOptions.map((sk, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => {
                          setSubKegiatan(sk);
                          setShowSubKegiatanList(false);
                        }}
                        className={`w-full text-left px-3 py-2 transition ${
                          i === subKegiatanIndex ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-800'
                        }`}
                      >
                        {sk}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-slate-500 italic">Tidak ada hasil cocok. Ketik kustom...</div>
                  )}
                </div>
              )}
            </div>

            {/* Uraian Belanja & Mata Anggaran */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Uraian Belanja</label>
                <div className="relative">
                  <input
                    type="text"
                    value={uraianBelanja}
                    onChange={(e) => {
                      setUraianBelanja(e.target.value);
                      setShowUraianList(true);
                      setUraianIndex(-1);
                    }}
                    onKeyDown={handleUraianKeyDown}
                    onFocus={() => {
                      setShowUraianList(true);
                      setUraianIndex(-1);
                    }}
                    onBlur={() => setTimeout(() => {
                      setShowUraianList(false);
                      setUraianIndex(-1);
                    }, 200)}
                    placeholder="Ketik untuk mencari belanja..."
                    className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 font-medium"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Search size={12} />
                  </div>
                </div>
                {showUraianList && (
                  <div className="absolute z-30 w-full mt-1 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto text-xs text-slate-200 divide-y divide-slate-800">
                    {filteredUraianBelanjaOptions.length > 0 ? (
                      filteredUraianBelanjaOptions.map((ub, i) => {
                        const isObject = typeof ub !== 'string';
                        const name = isObject ? (ub as UraianBelanja).nama_rekening : (ub as string);
                        const code = isObject ? (ub as UraianBelanja).kode_rekening : '';

                        return (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={() => {
                              if (isObject) {
                                setUraianBelanja(name);
                                setMataAnggaran(code);
                              } else {
                                setUraianBelanja(name);
                                // Auto generate Mata Anggaran prefix mapping like Excel
                                if (name.includes('ATK')) setMataAnggaran('5.1.02.01.01.0024');
                                else if (name.includes('Cetak')) setMataAnggaran('5.1.02.01.01.0026');
                                else if (name.includes('Sewa')) setMataAnggaran('5.1.02.02.01.0012');
                                else if (name.includes('Makanan')) setMataAnggaran('5.1.02.01.01.0052');
                                else setMataAnggaran('5.1.02.01.01.XXXX');
                              }
                              setShowUraianList(false);
                            }}
                            className={`w-full text-left px-3 py-2 transition flex flex-col gap-0.5 ${
                              i === uraianIndex ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-800'
                            }`}
                          >
                            {code && <span className={`font-mono text-[10px] ${i === uraianIndex ? 'text-indigo-200' : 'text-indigo-400'} font-semibold`}>{code}</span>}
                            <span className={`font-medium ${i === uraianIndex ? 'text-white' : 'text-slate-200'}`}>{name}</span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-slate-500 italic">Tidak ada hasil cocok. Ketik kustom...</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mata Anggaran</label>
                <input
                  type="text"
                  value={mataAnggaran}
                  onChange={(e) => setMataAnggaran(e.target.value)}
                  placeholder="e.g. 5.1.02.01.01.0024"
                  className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 font-mono text-xs font-semibold focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Document details: No Nota, Lokasi & Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Nota</label>
                <input
                  type="text"
                  value={noNota}
                  onChange={(e) => setNoNota(e.target.value)}
                  placeholder="Nomor surat/nota..."
                  className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dikeluarkan Di</label>
                <input
                  type="text"
                  value={dikeluarkanDi}
                  onChange={(e) => setDikeluarkanDi(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Penetapan</label>
                <DatePicker
                  value={getDateString()}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            {/* Keterangan TextArea with Quick Auto-Generate trigger */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keterangan Nota</label>
                <button
                  type="button"
                  onClick={generateKeteranganHelper}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <RotateCcw size={11} /> Auto-Generate
                </button>
              </div>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={4}
                placeholder="Deskripsi pengantar nota pesanan..."
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2 resize-y leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* PO Items Form */}
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
              <span className="w-1 h-3 bg-violet-500 rounded-full"></span>
              Manajemen Barang / Layanan
            </h3>

            {/* Item Input fields */}
            <div className="space-y-2.5 p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Nama Barang / Deskripsi</label>
                <div className="relative">
                  <input
                    type="text"
                    value={itemNama}
                    onChange={(e) => {
                      setItemNama(e.target.value);
                      setShowBarangList(true);
                      setBarangIndex(-1);
                    }}
                    onKeyDown={handleBarangKeyDown}
                    onFocus={() => {
                      setShowBarangList(true);
                      setBarangIndex(-1);
                    }}
                    onBlur={() => setTimeout(() => {
                      setShowBarangList(false);
                      setBarangIndex(-1);
                    }, 200)}
                    placeholder="Ketik untuk mencari atau membuat nama barang/layanan..."
                    className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 font-medium"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Search size={12} />
                  </div>
                </div>
                {showBarangList && (
                  <div className="absolute z-30 w-full mt-1 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl max-h-56 overflow-y-auto text-[11px] text-slate-200 divide-y divide-slate-800">
                    {filteredBarangOptions.length > 0 ? (
                      filteredBarangOptions.map((dh, i) => (
                        <button
                          key={dh.id}
                          type="button"
                          onMouseDown={() => {
                            setItemNama(dh.nama_barang);
                            setItemSatuan(dh.satuan || 'Pcs');
                            setItemHarga(dh.harga_satuan || 0);
                            setShowBarangList(false);
                            setBarangIndex(-1);
                          }}
                          className={`w-full text-left px-3 py-2 transition flex justify-between items-center gap-2 ${
                            i === barangIndex ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-800'
                          }`}
                        >
                          <span className={`font-medium truncate ${i === barangIndex ? 'text-white' : 'text-slate-200'}`}>{dh.nama_barang}</span>
                          <span className={`text-[10px] font-mono shrink-0 ${i === barangIndex ? 'text-indigo-100' : 'text-indigo-300'}`}>
                            {dh.satuan ? `${dh.satuan} • ` : ''}{formatRupiah(dh.harga_satuan)}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-slate-500 italic">Tidak ada hasil cocok. Ketik kustom...</div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Volume</label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    value={itemVolume}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItemVolume(val === "" ? "" : parseFloat(val) || 0);
                    }}
                    placeholder="Volume"
                    className="w-full px-2 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Satuan</label>
                  <input
                    type="text"
                    list="satuan-list"
                    value={itemSatuan}
                    onChange={(e) => setItemSatuan(e.target.value)}
                    placeholder="Contoh: Rim, Buah, Pcs"
                    className="w-full px-2 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <datalist id="satuan-list">
                    {KET_VOLUME_SAMPLES.map((sat, i) => (
                      <option key={i} value={sat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Harga Satuan</label>
                  <input
                    type="text"
                    value={formatNumberWithSeparator(itemHarga)}
                    onChange={(e) => setItemHarga(parseSeparatorToNumber(e.target.value))}
                    placeholder="Rp"
                    className="w-full px-2 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-right font-semibold font-mono text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide text-indigo-400">Jumlah Harga</label>
                  <div className="w-full px-2 py-1.5 bg-[#0F172A]/70 border border-indigo-900/40 rounded-lg text-xs text-right font-bold text-indigo-300 font-mono">
                    {formatRupiah((typeof itemVolume === 'number' ? itemVolume : 0) * itemHarga)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-700/60 justify-end">
                <button
                  type="button"
                  onClick={handleClearItemForm}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition border border-slate-700"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md border border-indigo-500"
                >
                  <Plus size={13} /> {editingItemId ? 'Ubah Item' : 'Tambah Item'}
                </button>
              </div>
            </div>

            {/* Table of items added */}
            <div className="border border-slate-700/80 rounded-lg overflow-hidden max-h-48 overflow-y-auto bg-[#0F172A]/20">
              <table className="w-full text-xs text-slate-300">
                <thead className="bg-slate-800/40 text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700/60">
                  <tr>
                    <th className="px-2.5 py-1.5 text-center w-8">No</th>
                    <th className="px-2.5 py-1.5 text-left">Nama</th>
                    <th className="px-2.5 py-1.5 text-center">Vol</th>
                    <th className="px-2.5 py-1.5 text-right">Harga</th>
                    <th className="px-2.5 py-1.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-slate-500 italic font-mono text-[11px]">Belum ada item ditambahkan.</td>
                    </tr>
                  ) : (
                    currentItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-800/20">
                        <td className="px-2.5 py-1.5 text-center font-mono font-bold text-slate-500">{index + 1}</td>
                        <td className="px-2.5 py-1.5 text-left font-medium text-slate-200 max-w-[120px] truncate" title={item.nama_barang}>
                          {item.nama_barang}
                        </td>
                        <td className="px-2.5 py-1.5 text-center text-slate-400">
                          {item.volume} {item.ket_volume}
                        </td>
                        <td className="px-2.5 py-1.5 text-right font-semibold text-slate-200 font-mono">
                          {formatRupiah(item.jumlah)}
                        </td>
                        <td className="px-2.5 py-1.5 text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => handleEditItemInTable(item)}
                              className="p-1 bg-amber-950/50 text-amber-400 hover:bg-amber-900/50 border border-amber-900/40 rounded transition"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItemInTable(item.id)}
                              className="p-1 bg-red-950/50 text-red-400 hover:bg-red-900/50 border border-red-900/40 rounded transition"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {currentItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus semua item pesanan ini?')) {
                    setCurrentItems([]);
                  }
                }}
                className="w-full py-1 bg-red-950/20 border border-dashed border-red-900/50 text-red-400 hover:bg-red-950/40 rounded-lg text-xs font-bold transition"
              >
                Hapus Semua Data Item
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Supplier, Signatories, and Tax Computation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Supplier Section */}
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
              <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
              Pihak Kedua / Supplier (Toko)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Toko / Usaha</label>
                <select
                  value={kepada}
                  onChange={(e) => handleSupplierChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2 font-medium"
                >
                  <option value="" className="bg-[#1E293B]">-- Pilih Toko / Supplier --</option>
                  {getSuppliers().map((s, idx) => (
                    <option key={idx} value={s.nama} className="bg-[#1E293B]">{s.nama}</option>
                  ))}
                  <option value="Custom" className="bg-[#1E293B]">Tulis Kustom...</option>
                </select>
                {kepada === 'Custom' && (
                  <input
                    type="text"
                    onChange={(e) => setKepada(e.target.value)}
                    placeholder="Nama toko kustom..."
                    className="mt-1.5 w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-slate-200"
                  />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Pemilik</label>
                <input
                  type="text"
                  value={namaPemilik}
                  onChange={(e) => setNamaPemilik(e.target.value)}
                  placeholder="Pemilik toko..."
                  className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat Lengkap Toko</label>
              <input
                type="text"
                value={alamatPemilik}
                onChange={(e) => setAlamatPemilik(e.target.value)}
                placeholder="Alamat toko..."
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2"
              />
            </div>
          </div>

          {/* PA/KPA & Bendahara Signatories */}
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
              <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
              Pejabat Tanda Tangan (BKPPD)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* PA / KPA / PPK Signatory */}
              <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide font-mono">PA / KPA / PPK</p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        const match = pejabatKeuanganList.find(pj => 
                          pj.jabatan.toLowerCase().includes('pa') || 
                          pj.jabatan.toLowerCase().includes('kpa')
                        );
                        if (match) {
                          setKepalaKantor(match.nama);
                          setNipKepalaKantor(match.nip);
                        } else {
                          alert('Data Pejabat Keuangan dengan jabatan PA / KPA tidak ditemukan.');
                        }
                      }}
                      className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-[10px] text-white font-black rounded tracking-wider flex items-center gap-1 transition active:scale-95 shadow-sm"
                      title="Isi otomatis PA / KPA dari Data Pejabat Keuangan"
                    >
                      <span>Pilih</span>
                      <span className="font-extrabold text-indigo-200">&gt;&gt;</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nama Pejabat</label>
                  <input
                    type="text"
                    value={kepalaKantor}
                    onChange={(e) => setKepalaKantor(e.target.value)}
                    className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">NIP</label>
                  <input
                    type="text"
                    value={nipKepalaKantor}
                    onChange={(e) => setNipKepalaKantor(e.target.value)}
                    className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Bendahara Pengeluaran Signatory */}
              <div className="p-3 bg-[#0F172A]/40 border border-slate-700/50 rounded-lg space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide font-mono">Bendahara Pengeluaran</p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        const match = pejabatKeuanganList.find(pj => 
                          pj.jabatan.toLowerCase().includes('bendahara')
                        );
                        if (match) {
                          setBendahara(match.nama);
                          setNipBendahara(match.nip);
                        } else {
                          alert('Data Pejabat Keuangan dengan jabatan Bendahara tidak ditemukan.');
                        }
                      }}
                      className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-[10px] text-white font-black rounded tracking-wider flex items-center gap-1 transition active:scale-95 shadow-sm"
                      title="Isi otomatis Bendahara dari Data Pejabat Keuangan"
                    >
                      <span>Pilih</span>
                      <span className="font-extrabold text-indigo-200">&gt;&gt;</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nama Bendahara</label>
                  <input
                    type="text"
                    value={bendahara}
                    onChange={(e) => setBendahara(e.target.value)}
                    className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">NIP</label>
                  <input
                    type="text"
                    value={nipBendahara}
                    onChange={(e) => setNipBendahara(e.target.value)}
                    className="w-full px-2 py-1 bg-[#0F172A] border border-slate-700 rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inclusive Indonesian Taxes Logic Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm text-white space-y-4">
            <h3 className="text-sm font-bold border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                Kalkulasi Pajak & Netto (IDR)
              </span>
              <button
                type="button"
                onClick={() => setShowThresholdSettings(!showThresholdSettings)}
                className="p-1 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800 transition flex items-center gap-1 text-[10px] font-bold font-mono"
                title="Atur Batas Bebas Pajak"
              >
                <Settings size={12} className={showThresholdSettings ? "animate-spin text-indigo-400" : ""} />
                <span>ATUR BATAS</span>
              </button>
            </h3>

            {/* Threshold Settings Panel (Collapsible) */}
            {showThresholdSettings && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
                <p className="font-bold text-[10px] text-indigo-400 uppercase tracking-wide">Konfigurasi Batas & Catatan Bebas Pajak</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold mb-1 uppercase">Batas Bebas PPN (Rp)</label>
                    <input
                      type="number"
                      value={batasPpn}
                      onChange={(e) => setBatasPpn(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold mb-1 uppercase">Batas Bebas PPh (Rp)</label>
                    <input
                      type="number"
                      value={batasPph}
                      onChange={(e) => setBatasPph(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold mb-1 uppercase">Template Catatan Bebas PPN (Gunakan {"{nilai}"} untuk batas)</label>
                    <input
                      type="text"
                      value={catatanPpn}
                      onChange={(e) => setCatatanPpn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold mb-1 uppercase">Template Catatan Bebas PPh (Gunakan {"{nilai}"} untuk batas)</label>
                    <input
                      type="text"
                      value={catatanPph}
                      onChange={(e) => setCatatanPph(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <p className="text-[9px] text-slate-500 leading-tight">Pengaturan ini akan disimpan secara lokal dan mempengaruhi batas kalkulasi otomatis.</p>
              </div>
            )}

            {/* Bruto Total */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 uppercase tracking-wide">Total Bruto</span>
              <span className="font-bold text-slate-200 text-sm font-mono">{formatRupiah(totalBruto)}</span>
            </div>

            <div className="space-y-4 pt-2">
              {/* Row 1: PPN / Pajak Resto */}
              <div className="grid grid-cols-12 gap-3 items-end">
                {/* Column 1: Dropdown Select */}
                <div className="col-span-5">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                    PPN / Pajak Resto
                  </label>
                  <select
                    value={ppnType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setPpnType(newType);
                      if (newType === 'PPN') setManualPersenPpn(11);
                      else if (newType === 'Pajak Resto') setManualPersenPpn(10);
                      else setManualPersenPpn(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 outline-none transition"
                  >
                    <option value="PPN">PPN</option>
                    <option value="Pajak Resto">Pajak Resto</option>
                    <option value="None">Tanpa PPN (None)</option>
                  </select>
                </div>

                {/* Column 2: Tarif (%) */}
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide text-center">
                    Tarif (%):
                  </label>
                  {ppnType !== 'None' ? (
                    <input
                      type="number"
                      step="0.1"
                      value={manualPersenPpn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualPersenPpn(val === "" ? "" : parseFloat(val) || 0);
                      }}
                      placeholder="0"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2 py-1.5 rounded-lg text-xs font-semibold font-mono text-slate-200 text-center outline-none transition"
                    />
                  ) : (
                    <div className="w-full bg-slate-950/40 border border-slate-900 px-2 py-1.5 rounded-lg text-xs text-center text-slate-600 font-mono select-none">
                      -
                    </div>
                  )}
                </div>

                {/* Column 3: Potongan PPN */}
                <div className="col-span-4">
                  <label className="block text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide text-right">
                    Potongan PPN:
                  </label>
                  {ppnType === 'None' ? (
                    <div className="py-1.5 text-xs text-slate-500 font-bold font-mono text-right">
                      Rp 0
                    </div>
                  ) : (manualPersenPpn === "" || manualPersenPpn <= 0) ? (
                    <input
                      type="number"
                      value={customHargaPpn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomHargaPpn(val === "" ? "" : parseInt(val, 10) || 0);
                      }}
                      placeholder="Ketik nominal..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-mono text-slate-200 outline-none text-right transition"
                    />
                  ) : (
                    <div className="py-1.5 text-xs font-bold font-mono text-slate-200 text-right pr-1">
                      {formatRupiah(hargaPpn)}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: PPh 22 / 23 / (4) Ayat 2 */}
              <div className="grid grid-cols-12 gap-3 items-end">
                {/* Column 1: Dropdown Select */}
                <div className="col-span-5">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                    PPh 22 / 23 / (4) ayat 2
                  </label>
                  <select
                    value={pphType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setPphType(newType);
                      if (newType === 'PPh 22 (1.5%)') setManualPersenPph(1.5);
                      else if (newType === 'PPh 23 (2.0%)') setManualPersenPph(2.0);
                      else if (newType === 'PPh 22') setManualPersenPph("");
                      else if (newType === 'PPh 23') setManualPersenPph("");
                      else if (newType === 'PPh Pasal (4) ayat 2') setManualPersenPph(1.0);
                      else setManualPersenPph(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 outline-none transition"
                  >
                    <option value="PPh 22 (1.5%)">PPh 22 (1.5%)</option>
                    <option value="PPh 23 (2.0%)">PPh 23 (2.0%)</option>
                    <option value="PPh 22">PPh 22</option>
                    <option value="PPh 23">PPh 23</option>
                    <option value="PPh Pasal (4) ayat 2">PPh Pasal (4) ayat 2</option>
                    <option value="None">Tanpa PPh (None)</option>
                  </select>
                </div>

                {/* Column 2: Tarif (%) */}
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide text-center">
                    Tarif (%):
                  </label>
                  {pphType !== 'None' ? (
                    <input
                      type="number"
                      step="0.05"
                      value={manualPersenPph}
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualPersenPph(val === "" ? "" : parseFloat(val) || 0);
                      }}
                      placeholder="0"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2 py-1.5 rounded-lg text-xs font-semibold font-mono text-slate-200 text-center outline-none transition"
                    />
                  ) : (
                    <div className="w-full bg-slate-950/40 border border-slate-900 px-2 py-1.5 rounded-lg text-xs text-center text-slate-600 font-mono select-none">
                      -
                    </div>
                  )}
                </div>

                {/* Column 3: Potongan PPh */}
                <div className="col-span-4">
                  <label className="block text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide text-right">
                    Potongan PPh:
                  </label>
                  {pphType === 'None' ? (
                    <div className="py-1.5 text-xs text-slate-500 font-bold font-mono text-right">
                      Rp 0
                    </div>
                  ) : (manualPersenPph === "" || manualPersenPph <= 0) ? (
                    <input
                      type="number"
                      value={customHargaPph}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomHargaPph(val === "" ? "" : parseInt(val, 10) || 0);
                      }}
                      placeholder="Ketik nominal..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-mono text-slate-200 outline-none text-right transition"
                    />
                  ) : (
                    <div className="py-1.5 text-xs font-bold font-mono text-slate-200 text-right pr-1">
                      {formatRupiah(hargaPph)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Threshold warning alerts if applicable */}
            {totalBruto > 0 && totalBruto < batasPpn && (
              <div className="p-2 bg-indigo-950/40 text-indigo-300 rounded-lg text-[10px] flex items-center gap-1.5 border border-indigo-900/40">
                <AlertCircle size={12} className="shrink-0" />
                <span>{catatanPpn.replace('{nilai}', formatRupiah(batasPpn))}</span>
              </div>
            )}
            {totalBruto > 0 && totalBruto < batasPph && (
              <div className="p-2 bg-amber-950/40 text-amber-300 rounded-lg text-[10px] flex items-center gap-1.5 border border-amber-900/40">
                <AlertCircle size={12} className="shrink-0" />
                <span>{catatanPph.replace('{nilai}', formatRupiah(batasPph))}</span>
              </div>
            )}

            {/* Netto Total */}
            <div className="border-t border-slate-800 pt-3.5 flex justify-between items-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Jumlah Bersih (Netto)
              </span>
              <span className="font-black text-xl text-emerald-300 font-mono tracking-wide">
                {formatRupiah(jumlahBersih)}
              </span>
            </div>

            {/* Main CTA Save to local DB & Direct Print */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSaveDocument}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <FileText size={14} /> Simpan
              </button>
              <button
                type="button"
                onClick={handlePrintDocument}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Cetak Nota
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* SECTION: DATABASE LISTING TABLE */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl shadow-lg mt-6 overflow-hidden">
        {/* Search header area and action buttons */}
        <div className="p-4 border-b border-slate-700/80 bg-slate-900/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                Daftar Input &amp; Nota Pesanan Terdaftar
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Total: {pesananList.length} data tersimpan dalam database local storage</p>
            </div>
            
            {/* Search box */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan Nomor SPPD, Nama, atau Maksud..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Table Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedPesananIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Hapus data yang dicentang"
              >
                <Trash2 size={13} />
                Hapus Terpilih ({selectedPesananIds.length})
              </button>
            )}

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-[#475569] hover:bg-[#334155] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Ekspor data saat ini ke Excel/CSV"
            >
              <FileSpreadsheet size={13} />
              Export Data Excel
            </button>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Unduh template Excel kosong untuk pengisian"
            >
              <Download size={13} />
              Download Template
            </button>

            <label className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95">
              <Upload size={13} />
              Upload Excel
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleUploadCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Table itself */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredPesananList.length > 0 &&
                      filteredPesananList.every(p => selectedPesananIds.includes(p.id_pesanan))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked ? filteredPesananList.map(p => p.id_pesanan) : [])}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                </th>
                <th className="px-4 py-3 min-w-[200px]">Uraian Belanja</th>
                <th className="px-4 py-3 min-w-[200px]">Sub Kegiatan</th>
                <th className="px-4 py-3 min-w-[150px]">Rekanan</th>
                <th className="px-4 py-3 text-right w-28">Nilai Bruto</th>
                <th className="px-4 py-3 text-right w-32">Potongan Pajak</th>
                <th className="px-4 py-3 text-right w-32">Jumlah Bersih</th>
                <th className="px-4 py-3 text-right pr-6 w-[280px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPesananList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 italic">
                    {pesananList.length === 0 
                      ? 'Belum ada data Nota Pesanan tersimpan. Silakan isi form di atas dan simpan.'
                      : 'Tidak ada data yang cocok dengan pencarian Anda.'}
                  </td>
                </tr>
              ) : (
                filteredPesananList.map((p, idx) => {
                  const isCurrentActive = p.id_pesanan === activeId;
                  
                  return (
                    <tr 
                      key={p.id_pesanan} 
                      className={`hover:bg-slate-850 transition-colors ${isCurrentActive ? 'bg-indigo-600/10 hover:bg-indigo-600/15' : ''}`}
                    >
                      {/* 0. Checkbox */}
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedPesananIds.includes(p.id_pesanan)}
                          onChange={() => handleSelectOne(p.id_pesanan)}
                          className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                      </td>

                      {/* 3. Uraian Belanja */}
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-200 leading-normal line-clamp-2 text-xs" title={p.uraian_belanja}>
                          {p.uraian_belanja || '-'}
                        </div>
                        {p.mata_anggaran && (
                          <div className="text-[9px] text-slate-500 font-mono mt-1">
                            MA: {p.mata_anggaran}
                          </div>
                        )}
                      </td>

                      {/* 4. Sub Kegiatan */}
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-300 leading-normal line-clamp-2 text-xs" title={p.sub_kegiatan}>
                          {p.sub_kegiatan || '-'}
                        </div>
                      </td>

                      {/* 5. Rekanan */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-white text-xs">
                          {p.kepada || '-'}
                        </div>
                        {p.nama_pemilik && (
                          <div className="text-[10px] text-indigo-400 font-semibold mt-0.5">
                            Pemilik: {p.nama_pemilik}
                          </div>
                        )}
                        {p.alamat_pemilik && (
                          <div className="text-[9px] text-slate-500 truncate max-w-[150px]" title={p.alamat_pemilik}>
                            {p.alamat_pemilik}
                          </div>
                        )}
                      </td>

                      {/* 6. Nilai Bruto */}
                      <td className="px-4 py-4 text-right font-mono text-slate-200 font-semibold">
                        {formatRupiah(p.total_bruto)}
                      </td>

                      {/* 7. Potongan Pajak */}
                      <td className="px-4 py-4 text-right font-mono">
                        <div className="text-amber-400 font-semibold">
                          {formatRupiah((p.harga_ppn || 0) + (p.harga_pph || 0))}
                        </div>
                        {((p.harga_ppn || 0) > 0 || (p.harga_pph || 0) > 0) && (
                          <div className="text-[9px] text-slate-500 flex flex-col items-end mt-0.5 leading-none space-y-0.5">
                            {(p.harga_ppn || 0) > 0 && <span>PPN: {formatRupiah(p.harga_ppn)}</span>}
                            {(p.harga_pph || 0) > 0 && <span>PPh: {formatRupiah(p.harga_pph)}</span>}
                          </div>
                        )}
                      </td>

                      {/* 8. Jumlah Bersih */}
                      <td className="px-4 py-4 text-right font-mono text-emerald-400 font-bold text-sm">
                        {formatRupiah(p.jumlah_bersih !== undefined ? p.jumlah_bersih : (p.total_bruto - (p.harga_ppn || 0) - (p.harga_pph || 0)))}
                      </td>

                      {/* 9. Aksi (Exactly as mockup) */}
                      <td className="px-4 py-4 text-right pr-6">
                        <div className="flex gap-1.5 justify-end items-center">
                          
                          {/* INPUT DROPDOWN BUTTON */}
                          <div className="relative">
                            <button
                              onClick={() => {
                                setOpenInputDropdownId(openInputDropdownId === p.id_pesanan ? null : p.id_pesanan);
                                setOpenPrintDropdownId(null);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1 shadow-md font-mono"
                              title="Navigasi ke Form Isian Dokumen"
                            >
                              <Database size={12} />
                              Input
                              <ChevronDown size={11} className={`transition-transform duration-200 ${openInputDropdownId === p.id_pesanan ? 'rotate-180' : ''}`} />
                            </button>

                            {openInputDropdownId === p.id_pesanan && (
                              <div className="absolute right-0 mt-1 w-48 bg-[#1E293B] border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 text-left">
                                <button
                                  onClick={() => {
                                    setActiveId(p.id_pesanan);
                                    onSelectPesanan(p.id_pesanan);
                                    if (onChangeTab) onChangeTab('balasan');
                                    setOpenInputDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-800 text-white font-medium flex items-center gap-2 transition"
                                >
                                  <FileText size={12} className="text-cyan-400" />
                                  <span>1. Nota Balasan</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveId(p.id_pesanan);
                                    onSelectPesanan(p.id_pesanan);
                                    if (onChangeTab) onChangeTab('bast');
                                    setOpenInputDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-800 text-white font-medium flex items-center gap-2 transition"
                                >
                                  <Database size={12} className="text-emerald-400" />
                                  <span>2. BAST</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveId(p.id_pesanan);
                                    onSelectPesanan(p.id_pesanan);
                                    if (onChangeTab) onChangeTab('sewa');
                                    setOpenInputDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-800 text-white font-medium flex items-center gap-2 transition"
                                >
                                  <Database size={12} className="text-amber-400" />
                                  <span>3. Perjanjian Sewa</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveId(p.id_pesanan);
                                    onSelectPesanan(p.id_pesanan);
                                    if (onChangeTab) onChangeTab('kwitansi');
                                    setOpenInputDropdownId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-800 text-white font-medium flex items-center gap-2 transition"
                                >
                                  <Database size={12} className="text-violet-400" />
                                  <span>4. Kwitansi</span>
                                </button>
                              </div>
                            )}
                          </div>                          {/* CETAK DOKUMEN BUTTON */}
                          <div className="relative">
                            <button
                              onClick={() => {
                                setOpenPrintDropdownId(openPrintDropdownId === p.id_pesanan ? null : p.id_pesanan);
                                setOpenInputDropdownId(null);
                                setPrintSelection(['nota', 'balasan', 'kwitansi', 'bast', 'sewa']);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1.5 shadow-md font-mono"
                              title="Menu Cetak Dokumen"
                            >
                              <Printer size={12} />
                              Cetak
                              <ChevronDown size={11} className={`transition-transform duration-200 ${openPrintDropdownId === p.id_pesanan ? 'rotate-180' : ''}`} />
                            </button>
                            {openPrintDropdownId === p.id_pesanan && (
                              <div className="absolute right-0 mt-1 w-56 bg-[#1E293B] border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden text-left flex flex-col">
                                <div className="p-2 border-b border-slate-700 bg-slate-800/50">
                                  <h4 className="text-[10px] font-bold text-slate-300 uppercase">Pilih Dokumen</h4>
                                </div>
                                <div className="p-2 space-y-2">
                                  {[
                                    { id: 'nota', label: 'Nota Pesanan' },
                                    { id: 'balasan', label: 'Balasan' },
                                    { id: 'kwitansi', label: 'Kwitansi' },
                                    { id: 'bast', label: 'BAST' },
                                    { id: 'sewa', label: 'Surat Sewa' }
                                  ].map((doc) => (
                                    <label key={doc.id} className="flex items-center gap-2 cursor-pointer group">
                                      <input
                                        type="checkbox"
                                        checked={printSelection.includes(doc.id as any)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setPrintSelection(prev => [...prev, doc.id as any]);
                                          } else {
                                            setPrintSelection(prev => prev.filter(id => id !== doc.id));
                                          }
                                        }}
                                        className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
                                      />
                                      <span className="text-[11px] text-slate-300 group-hover:text-white transition-colors">{doc.label}</span>
                                    </label>
                                  ))}
                                </div>
                                <div className="p-2 border-t border-slate-700 bg-slate-800/50">
                                  <button
                                    onClick={() => {
                                      if (printSelection.length === 0) {
                                        alert('Pilih minimal satu dokumen untuk dicetak.');
                                        return;
                                      }
                                      setActiveId(p.id_pesanan);
                                      setTimeout(() => {
                                        if (onTriggerPrint) onTriggerPrint(printSelection);
                                      }, 100);
                                      setOpenPrintDropdownId(null);
                                    }}
                                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold uppercase transition flex items-center justify-center gap-1.5"
                                  >
                                    <Printer size={12} /> Proses Cetak
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => {
                              setActiveId(p.id_pesanan);
                              setIsFormVisible(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1 shadow-md font-mono"
                            title="Edit Data Pesanan"
                          >
                            <Edit3 size={12} />
                            Edit
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus Data Pesanan Nomor Urut ${p.id_pesanan}?`)) {
                                onDeletePesanan(p.id_pesanan);
                              }
                            }}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1 shadow-md font-mono"
                            title="Hapus Data Pesanan"
                          >
                            <Trash2 size={12} />
                            Hapus
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Confirmation Modal */}
      {pendingImportPesanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                <Upload size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-bold text-base">Metode Pengunggahan Data Pesanan</h4>
                <p className="text-xs text-slate-300">
                  Ditemukan <span className="text-indigo-400 font-bold font-mono">{pendingImportPesanan.length}</span> data pesanan dari file. Bagaimana Anda ingin memproses data ini?
                </p>
                <div className="text-[11px] text-slate-400 text-left bg-slate-900/60 p-3 rounded-lg space-y-1.5 border border-slate-800">
                  <p>&bull; <strong className="text-emerald-400">Gabungkan (Rekomendasi):</strong> Menambahkan data baru dan memperbarui data lama jika No. Urut sama. Data lama lainnya tetap utuh.</p>
                  <p>&bull; <strong className="text-amber-400">Ganti Semua (Sangat Berguna jika data sebelumnya rusak):</strong> Menghapus seluruh data pesanan lama dan menggantinya sepenuhnya dengan data baru dari file ini.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingImportPesanan(null)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmImportPesanan('merge')}
                  className="py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Gabungkan
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmImportPesanan('overwrite')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Ganti Semua
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
