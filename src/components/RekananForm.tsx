import React, { useState, useEffect } from 'react';
import { Rekanan } from '../types';
import { Plus, Search, Edit3, Trash2, Download, Upload, FileSpreadsheet, X, RefreshCw, ChevronLeft, ChevronRight, User, Briefcase, Phone, CreditCard } from 'lucide-react';

interface RekananFormProps {
  rekananList: Rekanan[];
  onSave: (items: Rekanan[]) => void;
}

export default function RekananForm({ rekananList, onSave }: RekananFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Custom delete confirmation states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Pending import items for upload confirmation modal
  const [pendingImportItems, setPendingImportItems] = useState<Rekanan[] | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Rekanan | null>(null);

  // Form fields state
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [kategori, setKategori] = useState('NON PNS');
  const [jenis, setJenis] = useState('Perorangan');
  const [perusahaan, setPerusahaan] = useState('');
  const [telepon, setTelepon] = useState('');
  const [npwp, setNpwp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noRekening, setNoRekening] = useState('');
  const [pemilikRekening, setPemilikRekening] = useState('');
  const [bank, setBank] = useState('');

  // Reset page when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // Handle open modal for adding
  const handleOpenAdd = () => {
    setEditingItem(null);
    setNama('');
    setNik('');
    setKategori('NON PNS');
    setJenis('Perorangan');
    setPerusahaan('');
    setTelepon('');
    setNpwp('');
    setAlamat('');
    setNoRekening('');
    setPemilikRekening('');
    setBank('');
    setIsModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEdit = (item: Rekanan) => {
    setEditingItem(item);
    setNama(item.nama);
    setNik(item.nik);
    setKategori(item.kategori || 'NON PNS');
    setJenis(item.jenis || 'Perorangan');
    setPerusahaan(item.perusahaan || '');
    setTelepon(item.telepon || '');
    setNpwp(item.npwp || '');
    setAlamat(item.alamat || '');
    setNoRekening(item.no_rekening || '');
    setPemilikRekening(item.pemilik_rekening || '');
    setBank(item.bank || '');
    setIsModalOpen(true);
  };

  // Save / Update logic
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama Rekanan wajib diisi.');
      return;
    }

    const newItem: Rekanan = {
      id: editingItem ? editingItem.id : `rek_${Date.now()}`,
      nama: nama.trim(),
      nik: nik.trim(),
      kategori: kategori.trim(),
      jenis: jenis.trim(),
      perusahaan: perusahaan.trim() || nama.trim(), // default to owner's name if empty
      telepon: telepon.trim(),
      npwp: npwp.trim(),
      alamat: alamat.trim(),
      no_rekening: noRekening.trim(),
      pemilik_rekening: pemilikRekening.trim() || nama.trim(),
      bank: bank.trim()
    };

    let updatedList: Rekanan[];
    if (editingItem) {
      updatedList = rekananList.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedList = [...rekananList, newItem];
    }

    onSave(updatedList);
    setIsModalOpen(false);
  };

  // Delete item logic
  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = (id: string) => {
    const updated = rekananList.filter(item => item.id !== id);
    onSave(updated);
    setSelectedIds(selectedIds.filter(selId => selId !== id));
    setDeleteConfirmId(null);
  };

  // Bulk delete logic
  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const executeBulkDelete = () => {
    const updated = rekananList.filter(item => !selectedIds.includes(item.id));
    onSave(updated);
    setSelectedIds([]);
    setShowBulkDeleteConfirm(false);
  };

  // Filter list by search query
  const filteredList = rekananList.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.nama.toLowerCase().includes(query) ||
      item.nik.toLowerCase().includes(query) ||
      item.perusahaan.toLowerCase().includes(query) ||
      item.bank.toLowerCase().includes(query) ||
      item.no_rekening.toLowerCase().includes(query)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / pageSize);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Checkbox Selection for current page
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedList.map(item => item.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedList.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selId => selId !== id));
    }
  };

  // Helper to get range of visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Export to Excel / CSV format
  const handleExportCSV = () => {
    if (rekananList.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }
    const headers = [
      'NAMA', 'NIK', 'KATEGORI', 'JENIS', 'PERUSAHAAN / USAHA / JASA / LAINNYA', 
      'NOMOR TELEPON', 'NPWP', 'ALAMAT', 'NOMOR REKENING', 'PEMILIK REKENING', 'BANK'
    ];
    const rows = rekananList.map(item => [
      `"${item.nama.replace(/"/g, '""')}"`,
      `"${item.nik.replace(/"/g, '""')}"`,
      `"${item.kategori.replace(/"/g, '""')}"`,
      `"${item.jenis.replace(/"/g, '""')}"`,
      `"${item.perusahaan.replace(/"/g, '""')}"`,
      `"${item.telepon.replace(/"/g, '""')}"`,
      `"${item.npwp.replace(/"/g, '""')}"`,
      `"${item.alamat.replace(/"/g, '""')}"`,
      `"${item.no_rekening.replace(/"/g, '""')}"`,
      `"${item.pemilik_rekening.replace(/"/g, '""')}"`,
      `"${item.bank.replace(/"/g, '""')}"`
    ]);
    const csvContent = "sep=;\n" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `data_master_rekanan_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download template CSV
  const handleDownloadTemplate = () => {
    const headers = [
      'NAMA', 'NIK', 'KATEGORI', 'JENIS', 'PERUSAHAAN / USAHA / JASA / LAINNYA', 
      'NOMOR TELEPON', 'NPWP', 'ALAMAT', 'NOMOR REKENING', 'PEMILIK REKENING', 'BANK'
    ];
    const sampleRow = [
      '"ABDILLAH KAMARULLAH"',
      '"8204081102760004"',
      '"PNS"',
      '"Perorangan"',
      '"ABDILLAH KAMARULLAH"',
      '"082291681186"',
      '"788089159942000"',
      '"Desa Tomori"',
      '"7022105625"',
      '"ABDILLAH KAMARULLAH, SE, MM"',
      '"Bank SYARIAH INDONESIA"'
    ];
    const csvContent = "sep=;\n" + [headers.join(';'), sampleRow.join(';')].join('\n');
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_rekanan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to parse CSV line
  const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
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

        let delimiter = ',';
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
          if (semicolonCount > commaCount) {
            delimiter = ';';
          }
        }

        if (lines.length < 2) {
          alert('Format CSV tidak memiliki baris data.');
          return;
        }

        const newItems: Rekanan[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i], delimiter);

          if (cols.length >= 1) {
            newItems.push({
              id: `rek_${Date.now()}_${i}`,
              nama: cols[0] || '',
              nik: cols[1] || '',
              kategori: cols[2] || 'NON PNS',
              jenis: cols[3] || 'Perorangan',
              perusahaan: cols[4] || cols[0] || '',
              telepon: cols[5] || '',
              npwp: cols[6] || '',
              alamat: cols[7] || '',
              no_rekening: cols[8] || '',
              pemilik_rekening: cols[9] || cols[0] || '',
              bank: cols[10] || ''
            });
          }
        }

        if (newItems.length > 0) {
          setPendingImportItems(newItems);
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

  const handleConfirmImport = (mode: 'merge' | 'overwrite') => {
    if (!pendingImportItems) return;
    
    if (mode === 'overwrite') {
      onSave(pendingImportItems);
      alert(`Berhasil mengunggah ${pendingImportItems.length} data rekanan (Menggantikan seluruh data lama).`);
    } else {
      const existingMap = new Map(rekananList.map(item => [item.nama.toLowerCase() + '_' + item.nik, item]));
      pendingImportItems.forEach(item => {
        existingMap.set(item.nama.toLowerCase() + '_' + item.nik, item);
      });
      onSave(Array.from(existingMap.values()));
      alert(`Berhasil menggabungkan ${pendingImportItems.length} data rekanan baru.`);
    }
    setPendingImportItems(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tambah Rekanan Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-md">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-5 bg-indigo-500 rounded-full"></span>
            Data Master Rekanan
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen Pihak Kedua / Supplier (Toko), data rekening bank, NPWP, dan NIK pemilik toko.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <Plus size={15} />
          + Tambah Rekanan
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl shadow-lg overflow-hidden">
        
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-slate-700/80 bg-slate-900/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Daftar Rekanan
            </span>
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500 pointer-events-none">
                <Search size={13} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama / Toko / Rekening..."
                className="w-full pl-8 pr-2.5 py-1 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 transition"
              >
                Reset
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
                title="Hapus data yang dicentang"
              >
                <Trash2 size={13} />
                Hapus Terpilih ({selectedIds.length})
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-[#475569] hover:bg-[#334155] text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
              title="Ekspor data saat ini ke Excel/CSV"
            >
              <FileSpreadsheet size={13} />
              &darr; Export Data Excel
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
              title="Unduh template Excel kosong untuk pengisian"
            >
              <Download size={13} />
              &darr; Download Template
            </button>

            <label className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer active:scale-95">
              <Upload size={13} />
              &uarr; Upload Excel
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleUploadCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5 text-center w-12">
                  <input
                    type="checkbox"
                    checked={paginatedList.length > 0 && paginatedList.every(item => selectedIds.includes(item.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-3.5 min-w-[150px]">Nama Pemilik</th>
                <th className="px-4 py-3.5 min-w-[160px]">Perusahaan / Toko</th>
                <th className="px-4 py-3.5 min-w-[140px]">Kontak &amp; Alamat</th>
                <th className="px-4 py-3.5 min-w-[150px]">Rekening &amp; Bank</th>
                <th className="px-4 py-3.5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 italic">
                    {searchQuery ? 'Tidak ada rekanan yang cocok dengan kata kunci pencarian.' : 'Belum ada data rekanan master.'}
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${isChecked ? 'bg-indigo-600/5' : ''}`}
                    >
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                          <User size={12} className="text-slate-400 shrink-0" />
                          {item.nama}
                        </div>
                        {item.nik && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            NIK: {item.nik}
                          </div>
                        )}
                        <div className="flex gap-1.5 mt-1">
                          {item.kategori && (
                            <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[9px] font-bold rounded-md">
                              {item.kategori}
                            </span>
                          )}
                          {item.jenis && (
                            <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 text-[9px] font-bold rounded-md">
                              {item.jenis}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                          <Briefcase size={12} className="text-indigo-400 shrink-0" />
                          {item.perusahaan}
                        </div>
                        {item.npwp && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            NPWP: {item.npwp}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {item.telepon && (
                          <div className="text-slate-200 font-mono text-[11px] flex items-center gap-1">
                            <Phone size={10} className="text-slate-500 shrink-0" />
                            {item.telepon}
                          </div>
                        )}
                        {item.alamat && (
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-2" title={item.alamat}>
                            {item.alamat}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {item.no_rekening ? (
                          <div className="space-y-0.5">
                            <div className="font-bold text-emerald-400 text-xs font-mono flex items-center gap-1">
                              <CreditCard size={11} className="text-slate-500 shrink-0" />
                              {item.no_rekening}
                            </div>
                            <div className="text-[10px] text-slate-300 font-medium">
                              An: {item.pemilik_rekening || item.nama}
                            </div>
                            {item.bank && (
                              <div className="text-[9px] text-indigo-400 font-bold uppercase">
                                {item.bank}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Belum diset</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="px-2 py-1 w-full bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold transition flex items-center justify-center gap-0.5"
                          >
                            <Edit3 size={10} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2 py-1 w-full bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition flex items-center justify-center gap-0.5"
                          >
                            <Trash2 size={10} />
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

        {/* Pagination Controls */}
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Tampilkan</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
            >
              {[5, 10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>baris per halaman</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1.5 rounded font-bold text-xs transition ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95"
              title="Halaman Berikutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Table Footer Stats */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-400 font-mono">
          <div>
            Menampilkan {filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} sampai {Math.min(currentPage * pageSize, filteredList.length)} dari {filteredList.length} data disaring (Total master: {rekananList.length})
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                {editingItem ? 'Edit Rekanan' : 'Tambah Rekanan'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-5 space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nama Pemilik */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nama Pemilik / Personal <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: ABDILLAH KAMARULLAH"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase font-semibold"
                    required
                  />
                </div>

                {/* NIK */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    NIK Pemilik
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Contoh: 8204081102760004"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Kategori Kepegawaian
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="NON PNS">NON PNS</option>
                    <option value="PNS">PNS</option>
                  </select>
                </div>

                {/* Jenis */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Jenis Rekanan
                  </label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Perorangan">Perorangan</option>
                    <option value="Perusahaan/CV/PT">Perusahaan/CV/PT</option>
                  </select>
                </div>

                {/* Nama Perusahaan / Usaha / Toko */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nama Toko / Perusahaan / Usaha / Jasa / Lainnya
                  </label>
                  <input
                    type="text"
                    value={perusahaan}
                    onChange={(e) => setPerusahaan(e.target.value)}
                    placeholder="Contoh: Toko Halmahera ATK (kosongkan jika sama dengan nama pemilik)"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Telepon */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="Contoh: 082291681186"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* NPWP */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    NPWP
                  </label>
                  <input
                    type="text"
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                    placeholder="Contoh: 78.808.915.9-942.000"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Alamat Lengkap */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Alamat Perusahaan / Usaha / Jasa / Lainnya
                  </label>
                  <textarea
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Contoh: Desa Tomori, Labuha"
                    rows={2}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                  />
                </div>

                {/* NO REKENING */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nomor Rekening Bank
                  </label>
                  <input
                    type="text"
                    value={noRekening}
                    onChange={(e) => setNoRekening(e.target.value)}
                    placeholder="Contoh: 7022105625"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* NAMA PEMILIK REKENING */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nama Pemilik Rekening (A/N)
                  </label>
                  <input
                    type="text"
                    value={pemilikRekening}
                    onChange={(e) => setPemilikRekening(e.target.value)}
                    placeholder="Contoh: ABDILLAH KAMARULLAH, SE, MM"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase font-semibold"
                  />
                </div>

                {/* NAMA BANK */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    placeholder="Contoh: Bank BNI / Bank SYARIAH INDONESIA / Bank Maluku"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase font-bold"
                  />
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex justify-end items-center gap-2 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Single Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-sm">Konfirmasi Hapus</h4>
                <p className="text-xs text-slate-400">
                  Apakah Anda yakin ingin menghapus Rekanan ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => executeDelete(deleteConfirmId)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-sm">Konfirmasi Hapus Massal</h4>
                <p className="text-xs text-slate-400">
                  Apakah Anda yakin ingin menghapus <strong className="text-white">{selectedIds.length}</strong> data Rekanan yang dicentang? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteConfirm(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={executeBulkDelete}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Hapus Semua ({selectedIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Confirmation Modal */}
      {pendingImportItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                <Upload size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-bold text-base">Metode Pengunggahan Data</h4>
                <p className="text-xs text-slate-300">
                  Ditemukan <span className="text-indigo-400 font-bold font-mono">{pendingImportItems.length}</span> data rekanan dari file. Bagaimana Anda ingin memproses data ini?
                </p>
                <div className="text-[11px] text-slate-400 text-left bg-slate-900/60 p-3 rounded-lg space-y-1.5 border border-slate-800">
                  <p>&bull; <strong className="text-emerald-400">Gabungkan (Rekomendasi):</strong> Menambahkan data baru dan memperbarui data lama jika nama dan NIK sama. Data lama lainnya tetap utuh.</p>
                  <p>&bull; <strong className="text-amber-400">Ganti Semua:</strong> Menghapus seluruh data master lama dan menggantinya sepenuhnya dengan data baru dari file ini.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingImportItems(null)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmImport('merge')}
                  className="py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg text-xs transition active:scale-95"
                >
                  Gabungkan
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmImport('overwrite')}
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
