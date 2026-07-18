import React, { useState, useEffect } from 'react';
import { PejabatKeuangan } from '../types';
import { Plus, Search, Edit3, Trash2, Download, Upload, FileSpreadsheet, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PejabatKeuanganFormProps {
  pejabatKeuanganList: PejabatKeuangan[];
  onSave: (items: PejabatKeuangan[]) => void;
}

export default function PejabatKeuanganForm({ pejabatKeuanganList, onSave }: PejabatKeuanganFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Custom delete confirmation states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Pending import items for upload confirmation modal
  const [pendingImportItems, setPendingImportItems] = useState<PejabatKeuangan[] | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PejabatKeuangan | null>(null);

  // Form fields state
  const [jabatan, setJabatan] = useState('');
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');

  // Reset page when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // Handle open modal for adding
  const handleOpenAdd = () => {
    setEditingItem(null);
    setJabatan('');
    setNama('');
    setNip('');
    setIsModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEdit = (item: PejabatKeuangan) => {
    setEditingItem(item);
    setJabatan(item.jabatan);
    setNama(item.nama);
    setNip(item.nip);
    setIsModalOpen(true);
  };

  // Save / Update logic
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jabatan || !nama || !nip) {
      alert('Jabatan, Nama, dan NIP wajib diisi.');
      return;
    }

    const newItem: PejabatKeuangan = {
      id: editingItem ? editingItem.id : String(Date.now() + Math.random()),
      jabatan: jabatan.trim(),
      nama: nama.trim(),
      nip: nip.trim()
    };

    let updatedList: PejabatKeuangan[];
    if (editingItem) {
      // Editing
      updatedList = pejabatKeuanganList.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      // Adding: check if already exists by NIP (to prevent accidental duplicate)
      if (pejabatKeuanganList.some(item => item.nip === newItem.nip && item.jabatan === newItem.jabatan)) {
        if (!confirm('Pejabat dengan Jabatan dan NIP tersebut sudah terdaftar. Tetap simpan?')) {
          return;
        }
      }
      updatedList = [...pejabatKeuanganList, newItem];
    }

    onSave(updatedList);
    setIsModalOpen(false);
  };

  // Delete item logic
  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = (id: string) => {
    const updated = pejabatKeuanganList.filter(item => item.id !== id);
    onSave(updated);
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    setDeleteConfirmId(null);
  };

  // Bulk delete logic
  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const executeBulkDelete = () => {
    const updated = pejabatKeuanganList.filter(item => !selectedIds.includes(item.id));
    onSave(updated);
    setSelectedIds([]);
    setShowBulkDeleteConfirm(false);
  };

  // Filter list by search query
  const filteredList = pejabatKeuanganList.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.jabatan.toLowerCase().includes(query) ||
      item.nama.toLowerCase().includes(query) ||
      item.nip.toLowerCase().includes(query)
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
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
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
    if (pejabatKeuanganList.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }
    const headers = ['Jabatan', 'Nama', 'NIP'];
    const rows = pejabatKeuanganList.map(item => [
      `"${item.jabatan.replace(/"/g, '""')}"`,
      `"${item.nama.replace(/"/g, '""')}"`,
      `"${item.nip.replace(/"/g, '""')}"`
    ]);
    const csvContent = "sep=;\n" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    
    // Add UTF-8 BOM for Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `data_master_pejabat_keuangan_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download template CSV
  const handleDownloadTemplate = () => {
    const headers = ['Jabatan', 'Nama', 'NIP'];
    const sampleRow = [
      '"PPTK"',
      '"SAMSI MANDAR, SE"',
      '"19790525 200112 1 004"'
    ];
    const csvContent = "sep=;\n" + [headers.join(';'), sampleRow.join(';')].join('\n');
    
    // Add UTF-8 BOM for Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_pejabat_keuangan.csv");
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

        const newItems: PejabatKeuangan[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i], delimiter);

          if (cols.length >= 3) {
            newItems.push({
              id: String(Date.now() + Math.random() + i),
              jabatan: cols[0],
              nama: cols[1],
              nip: cols[2]
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
      alert(`Berhasil mengunggah ${pendingImportItems.length} data pejabat keuangan (Menggantikan seluruh data lama).`);
    } else {
      const existingMap = new Map(pejabatKeuanganList.map(item => [item.jabatan + '_' + item.nip, item]));
      pendingImportItems.forEach(item => {
        existingMap.set(item.jabatan + '_' + item.nip, item);
      });
      onSave(Array.from(existingMap.values()));
      alert(`Berhasil menggabungkan ${pendingImportItems.length} data pejabat keuangan baru.`);
    }
    setPendingImportItems(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tambah Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-md">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-5 bg-indigo-500 rounded-full"></span>
            Data Master Pejabat Keuangan
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen nama, jabatan (PPTK, PA/KPA, Bendahara), dan Nomor Induk Pegawai (NIP) pejabat keuangan.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <Plus size={15} />
          + Tambah Pejabat Keuangan
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl shadow-lg overflow-hidden">
        
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-slate-700/80 bg-slate-900/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Daftar Pejabat Keuangan
            </span>
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500 pointer-events-none">
                <Search size={13} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Jabatan, Nama atau NIP..."
                className="w-full pl-8 pr-2.5 py-1 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs rounded border border-slate-700 transition"
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
                <th className="px-4 py-3.5 w-44">Jabatan</th>
                <th className="px-4 py-3.5 min-w-[200px]">Nama</th>
                <th className="px-4 py-3.5 w-60">NIP</th>
                <th className="px-4 py-3.5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500 italic">
                    {searchQuery ? 'Tidak ada pejabat yang cocok dengan kata kunci pencarian.' : 'Belum ada data pejabat keuangan master.'}
                  </td>
                </tr>
              ) : (
                paginatedList.map((item, idx) => {
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
                      <td className="px-4 py-3.5 font-bold text-slate-200">
                        {item.jabatan}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-white">
                        {item.nama}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {item.nip}
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
            Menampilkan {filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} sampai {Math.min(currentPage * pageSize, filteredList.length)} dari {filteredList.length} data disaring (Total master: {pejabatKeuanganList.length})
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                {editingItem ? 'Edit Pejabat Keuangan' : 'Tambah Pejabat Keuangan'}
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
              <div className="space-y-4">
                
                {/* 1. Jabatan */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Jabatan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Contoh: PPTK, PA_KPA, Bendahara"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* 2. Nama */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Nama <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: SAMSI MANDAR, SE"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* 3. NIP */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    NIP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 19790525 200112 1 004"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    required
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
                  Apakah Anda yakin ingin menghapus Pejabat Keuangan ini? Tindakan ini tidak dapat dibatalkan.
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
                  Apakah Anda yakin ingin menghapus <strong className="text-white">{selectedIds.length}</strong> data Pejabat Keuangan yang dicentang? Tindakan ini tidak dapat dibatalkan.
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
                  Ditemukan <span className="text-indigo-400 font-bold font-mono">{pendingImportItems.length}</span> data pejabat keuangan dari file. Bagaimana Anda ingin memproses data ini?
                </p>
                <div className="text-[11px] text-slate-400 text-left bg-slate-900/60 p-3 rounded-lg space-y-1.5 border border-slate-800">
                  <p>&bull; <strong className="text-emerald-400">Gabungkan (Rekomendasi):</strong> Menambahkan data baru dan memperbarui data lama jika Jabatan &amp; NIP sama. Data lama lainnya tetap utuh.</p>
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
