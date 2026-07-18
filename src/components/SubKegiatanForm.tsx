import React, { useState, useEffect } from 'react';
import { SubKegiatan, formatNumberWithSeparator, parseSeparatorToNumber } from '../types';
import { Plus, Search, Edit3, Trash2, Download, Upload, FileSpreadsheet, X, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatRupiah } from './PrintTemplates';

interface SubKegiatanFormProps {
  subKegiatanList: SubKegiatan[];
  onSave: (items: SubKegiatan[]) => void;
}

export default function SubKegiatanForm({ subKegiatanList, onSave }: SubKegiatanFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Custom delete confirmation states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Pending import items for upload confirmation modal
  const [pendingImportItems, setPendingImportItems] = useState<SubKegiatan[] | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubKegiatan | null>(null);

  // Form fields state
  const [norekSubKegiatan, setNorekSubKegiatan] = useState('');
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [norekPerjadinBiasa, setNorekPerjadinBiasa] = useState('');
  const [norekPerjadinDalamKota, setNorekPerjadinDalamKota] = useState('');
  const [namaPPTK, setNamaPPTK] = useState('');
  const [paguAnggaran, setPaguAnggaran] = useState<number>(0);

  // Reset page when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // Handle open modal for adding
  const handleOpenAdd = () => {
    setEditingItem(null);
    setNorekSubKegiatan('');
    setNamaKegiatan('');
    setNorekPerjadinBiasa('5.1.02.04.01.0001');
    setNorekPerjadinDalamKota('5.1.02.04.01.0003');
    setNamaPPTK('');
    setPaguAnggaran(0);
    setIsModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEdit = (item: SubKegiatan) => {
    setEditingItem(item);
    setNorekSubKegiatan(item.norek_sub_kegiatan);
    setNamaKegiatan(item.nama_kegiatan);
    setNorekPerjadinBiasa(item.norek_perjadin_biasa);
    setNorekPerjadinDalamKota(item.norek_perjadin_dalam_kota);
    setNamaPPTK(item.nama_pptk);
    setPaguAnggaran(item.pagu_anggaran);
    setIsModalOpen(true);
  };

  // Save / Update logic
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!norekSubKegiatan || !namaKegiatan) {
      alert('Norek Sub Kegiatan dan Nama Kegiatan wajib diisi.');
      return;
    }

    const newItem: SubKegiatan = {
      norek_sub_kegiatan: norekSubKegiatan.trim(),
      nama_kegiatan: namaKegiatan.trim(),
      norek_perjadin_biasa: norekPerjadinBiasa.trim(),
      norek_perjadin_dalam_kota: norekPerjadinDalamKota.trim(),
      nama_pptk: namaPPTK.trim(),
      pagu_anggaran: Number(paguAnggaran) || 0
    };

    let updatedList: SubKegiatan[];
    if (editingItem) {
      // Editing: replace the old key or update
      updatedList = subKegiatanList.map(item => 
        item.norek_sub_kegiatan === editingItem.norek_sub_kegiatan ? newItem : item
      );
    } else {
      // Adding: check if already exists
      if (subKegiatanList.some(item => item.norek_sub_kegiatan === newItem.norek_sub_kegiatan)) {
        alert('Norek Sub Kegiatan sudah terdaftar.');
        return;
      }
      updatedList = [...subKegiatanList, newItem];
    }

    onSave(updatedList);
    setIsModalOpen(false);
  };

  // Delete item logic
  const handleDelete = (norek: string) => {
    setDeleteConfirmId(norek);
  };

  const executeDelete = (norek: string) => {
    const updated = subKegiatanList.filter(item => item.norek_sub_kegiatan !== norek);
    onSave(updated);
    setSelectedIds(selectedIds.filter(id => id !== norek));
    setDeleteConfirmId(null);
  };

  // Bulk delete logic
  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const executeBulkDelete = () => {
    const updated = subKegiatanList.filter(item => !selectedIds.includes(item.norek_sub_kegiatan));
    onSave(updated);
    setSelectedIds([]);
    setShowBulkDeleteConfirm(false);
  };

  // Filter list by search query
  const filteredList = subKegiatanList.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.norek_sub_kegiatan.toLowerCase().includes(query) ||
      item.nama_kegiatan.toLowerCase().includes(query) ||
      item.nama_pptk.toLowerCase().includes(query)
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
      const pageIds = paginatedList.map(item => item.norek_sub_kegiatan);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedList.map(item => item.norek_sub_kegiatan);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (norek: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, norek]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== norek));
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
    if (subKegiatanList.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }
    const headers = ['No. Rek Sub Kegiatan', 'Nama Kegiatan', 'Nama PPTK', 'Pagu Anggaran'];
    const rows = subKegiatanList.map(item => [
      `"${item.norek_sub_kegiatan.replace(/"/g, '""')}"`,
      `"${item.nama_kegiatan.replace(/"/g, '""')}"`,
      `"${item.nama_pptk.replace(/"/g, '""')}"`,
      item.pagu_anggaran
    ]);
    const csvContent = "sep=;\n" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    
    // Add UTF-8 BOM for Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `data_master_sub_kegiatan_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download template CSV
  const handleDownloadTemplate = () => {
    const headers = ['No. Rek Sub Kegiatan', 'Nama Kegiatan', 'Nama PPTK', 'Pagu Anggaran'];
    const sampleRow = [
      '"5.03.01.2.05.10"',
      '"Sosialisasi Peraturan Perundang-Undangan Baru"',
      '"SUMAHDI ISMAIL, SE"',
      '"200000000"'
    ];
    const csvContent = "sep=;\n" + [headers.join(';'), sampleRow.join(';')].join('\n');
    
    // Add UTF-8 BOM for Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_sub_kegiatan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to parse CSV line respecting quotes and delimiter
  const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
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

        // Detect delimiter (comma or semicolon)
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
          // Count commas vs semicolons in the first line
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

        const newItems: SubKegiatan[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i], delimiter);

          if (cols.length >= 2) {
            newItems.push({
              norek_sub_kegiatan: cols[0],
              nama_kegiatan: cols[1],
              norek_perjadin_biasa: '5.1.02.04.01.0001',
              norek_perjadin_dalam_kota: '5.1.02.04.01.0003',
              nama_pptk: cols[2] || '',
              pagu_anggaran: Number(cols[3]) || 0
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
    // Clear the input selection
    e.target.value = '';
  };

  const handleConfirmImport = (mode: 'merge' | 'overwrite') => {
    if (!pendingImportItems) return;
    
    if (mode === 'overwrite') {
      onSave(pendingImportItems);
      alert(`Berhasil mengunggah ${pendingImportItems.length} data sub kegiatan (Menggantikan seluruh data lama).`);
    } else {
      const existingMap = new Map(subKegiatanList.map(item => [item.norek_sub_kegiatan, item]));
      pendingImportItems.forEach(item => {
        existingMap.set(item.norek_sub_kegiatan, item);
      });
      onSave(Array.from(existingMap.values()));
      alert(`Berhasil menggabungkan ${pendingImportItems.length} data sub kegiatan baru.`);
    }
    setPendingImportItems(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tambah Sub Kegiatan Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-md">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-5 bg-indigo-500 rounded-full"></span>
            Data Master Sub Kegiatan
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen sub kegiatan, pagu anggaran, nomor rekening belanja, dan PPTK penanggung jawab.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <Plus size={15} />
          + Tambah Sub Kegiatan
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl shadow-lg overflow-hidden">
        
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-slate-700/80 bg-slate-900/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Daftar Sub Kegiatan
            </span>
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500 pointer-events-none">
                <Search size={13} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama Sub Kegiatan..."
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

          {/* Action buttons (Mockup matched: Export Excel, Download Template, Upload Excel) */}
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
                    checked={paginatedList.length > 0 && paginatedList.every(item => selectedIds.includes(item.norek_sub_kegiatan))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-3.5 w-44">Norek Sub Kegiatan</th>
                <th className="px-4 py-3.5 min-w-[240px]">Sub Kegiatan</th>
                <th className="px-4 py-3.5 w-44">Pagu Anggaran</th>
                <th className="px-4 py-3.5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500 italic">
                    {searchQuery ? 'Tidak ada sub kegiatan yang cocok dengan kata kunci pencarian.' : 'Belum ada data sub kegiatan master.'}
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => {
                  const isChecked = selectedIds.includes(item.norek_sub_kegiatan);
                  return (
                    <tr
                      key={item.norek_sub_kegiatan}
                      className={`hover:bg-slate-800/40 transition-colors ${isChecked ? 'bg-indigo-600/5' : ''}`}
                    >
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(item.norek_sub_kegiatan, e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-200 font-medium">
                        {item.norek_sub_kegiatan}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white leading-normal">
                          {item.nama_kegiatan}
                        </div>
                        {item.nama_pptk && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            PPTK: <span className="font-medium text-slate-300">{item.nama_pptk}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-200">
                        {formatRupiah(item.pagu_anggaran)}
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
                            onClick={() => handleDelete(item.norek_sub_kegiatan)}
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
            Menampilkan {filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} sampai {Math.min(currentPage * pageSize, filteredList.length)} dari {filteredList.length} data disaring (Total master: {subKegiatanList.length})
          </div>
          <div>
            Total Pagu Terdaftar: {formatRupiah(subKegiatanList.reduce((sum, item) => sum + item.pagu_anggaran, 0))}
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL (Clean popup matching mockup) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                {editingItem ? 'Edit Sub Kegiatan' : 'Tambah Sub Kegiatan'}
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
                
                {/* 1. No. Rek Sub Kegiatan */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    No. Rek Sub Kegiatan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={norekSubKegiatan}
                    onChange={(e) => setNorekSubKegiatan(e.target.value)}
                    placeholder="Contoh: 5.03.01.2.05.10"
                    disabled={!!editingItem} // disable key change when editing to prevent duplicate key bugs
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    required
                  />
                </div>

                 {/* 2. Nama kegiatan */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nama kegiatan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaKegiatan}
                    onChange={(e) => setNamaKegiatan(e.target.value)}
                    placeholder="Contoh: Sosialisasi Peraturan Perundang-Undangan"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* 5. Nama PPTK */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nama PPTK
                  </label>
                  <input
                    type="text"
                    value={namaPPTK}
                    onChange={(e) => setNamaPPTK(e.target.value)}
                    placeholder="Contoh: SUMAHDI ISMAIL, SE"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* 6. Pagu Anggaran (Rp) */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Pagu Anggaran (Rp)
                  </label>
                  <input
                    type="text"
                    value={formatNumberWithSeparator(paguAnggaran)}
                    onChange={(e) => setPaguAnggaran(parseSeparatorToNumber(e.target.value))}
                    placeholder="Contoh: 200.000.000"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-right"
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
                  Apakah Anda yakin ingin menghapus Sub Kegiatan dengan Norek <span className="text-indigo-400 font-mono">{deleteConfirmId}</span>? Tindakan ini tidak dapat dibatalkan.
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
                  Apakah Anda yakin ingin menghapus <strong className="text-white">{selectedIds.length}</strong> data Sub Kegiatan yang dicentang? Tindakan ini tidak dapat dibatalkan.
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
                  Ditemukan <span className="text-indigo-400 font-bold font-mono">{pendingImportItems.length}</span> data sub kegiatan dari file. Bagaimana Anda ingin memproses data ini?
                </p>
                <div className="text-[11px] text-slate-400 text-left bg-slate-900/60 p-3 rounded-lg space-y-1.5 border border-slate-800">
                  <p>&bull; <strong className="text-emerald-400">Gabungkan (Rekomendasi):</strong> Menambahkan data baru dan memperbarui data lama jika kode rekening sama. Data lama lainnya tetap utuh.</p>
                  <p>&bull; <strong className="text-amber-400">Ganti Semua (Sangat Berguna jika data sebelumnya rusak):</strong> Menghapus seluruh data master lama dan menggantinya sepenuhnya dengan data baru dari file ini.</p>
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
