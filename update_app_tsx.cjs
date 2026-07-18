const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
appContent = appContent.replace(
  "import { Pesanan, RekapBelanja, ItemBarang, Kwitansi, BAST, Sewa, NotaBalasan, KopSurat, INDONESIAN_MONTHS, toRoman, SubKegiatan, Rekanan, UraianBelanja, PejabatKeuangan, DaftarHarga } from './types';",
  "import { Pesanan, RekapBelanja, ItemBarang, Kwitansi, BAST, Sewa, NotaBalasan, KopSurat, INDONESIAN_MONTHS, toRoman, SubKegiatan, Rekanan, UraianBelanja, PejabatKeuangan, DaftarHarga, BASTRekapan, KwitansiBesar } from './types';"
);

appContent = appContent.replace(
  "import KwitansiForm from './components/KwitansiForm';",
  "import KwitansiForm from './components/KwitansiForm';\nimport BASTRekapanForm from './components/BASTRekapanForm';\nimport KwitansiBesarForm from './components/KwitansiBesarForm';"
);

// State declarations
appContent = appContent.replace(
  "const [bastList, setBastList] = useState<BAST[]>([]);",
  "const [bastList, setBastList] = useState<BAST[]>([]);\n  const [bastRekapanList, setBastRekapanList] = useState<BASTRekapan[]>([]);"
);

appContent = appContent.replace(
  "const [kwitansiList, setKwitansiList] = useState<Kwitansi[]>([]);",
  "const [kwitansiList, setKwitansiList] = useState<Kwitansi[]>([]);\n  const [kwitansiBesarList, setKwitansiBesarList] = useState<KwitansiBesar[]>([]);"
);

appContent = appContent.replace(
  "const [isKwitansiModalOpen, setIsKwitansiModalOpen] = useState(false);",
  "const [isKwitansiModalOpen, setIsKwitansiModalOpen] = useState(false);\n  const [isBastRekapanModalOpen, setIsBastRekapanModalOpen] = useState(false);\n  const [isKwitansiBesarModalOpen, setIsKwitansiBesarModalOpen] = useState(false);"
);

// Handlers
const handleSaveBASTRekapan = `
  const handleSaveBASTRekapan = (bastRekapan: BASTRekapan) => {
    const newList = [...bastRekapanList.filter(b => b.id_bast_rekapan !== bastRekapan.id_bast_rekapan), bastRekapan];
    setBastRekapanList(newList);
    localStorage.setItem('nota_bast_rekapan_list', JSON.stringify(newList));
    // setIsBastRekapanModalOpen(false); // don't close, let user view it
  };
`;

const handleSaveKwitansiBesar = `
  const handleSaveKwitansiBesar = (kwitansiBesar: KwitansiBesar) => {
    const newList = [...kwitansiBesarList.filter(k => k.id_kwitansi_besar !== kwitansiBesar.id_kwitansi_besar), kwitansiBesar];
    setKwitansiBesarList(newList);
    localStorage.setItem('nota_kwitansi_besar_list', JSON.stringify(newList));
  };
`;

appContent = appContent.replace(
  "const handleSaveKwitansi = (kwitansi: Kwitansi) => {",
  `${handleSaveBASTRekapan}\n${handleSaveKwitansiBesar}\n\n  const handleSaveKwitansi = (kwitansi: Kwitansi) => {`
);

// Load from local storage
appContent = appContent.replace(
  "const cachedBast = localStorage.getItem('nota_bast_list');",
  "const cachedBast = localStorage.getItem('nota_bast_list');\n    const cachedBastRekapan = localStorage.getItem('nota_bast_rekapan_list');\n    const cachedKwitansiBesar = localStorage.getItem('nota_kwitansi_besar_list');"
);

appContent = appContent.replace(
  "if (cachedBast) setBastList(JSON.parse(cachedBast));",
  "if (cachedBast) setBastList(JSON.parse(cachedBast));\n    if (cachedBastRekapan) setBastRekapanList(JSON.parse(cachedBastRekapan));\n    if (cachedKwitansiBesar) setKwitansiBesarList(JSON.parse(cachedKwitansiBesar));"
);

// Render modals
const modals = `
      {/* Modal - BAST Rekapan */}
      <BASTRekapanForm
        isOpen={isBastRekapanModalOpen}
        onClose={() => setIsBastRekapanModalOpen(false)}
        currentRekap={activeRekap}
        bastRekapanList={bastRekapanList}
        rekananList={rekananList}
        pesananList={pesananList}
        pejabatKeuanganList={pejabatKeuanganList}
        onSaveBASTRekapan={handleSaveBASTRekapan}
        onTriggerPrint={triggerPrint}
      />

      {/* Modal - Kwitansi Besar */}
      <KwitansiBesarForm
        isOpen={isKwitansiBesarModalOpen}
        onClose={() => setIsKwitansiBesarModalOpen(false)}
        currentRekap={activeRekap}
        kwitansiBesarList={kwitansiBesarList}
        pesananList={pesananList}
        onSaveKwitansiBesar={handleSaveKwitansiBesar}
        onTriggerPrint={triggerPrint}
      />
`;

appContent = appContent.replace(
  "{/* Modal - Kwitansi (Payment Receipt) */}",
  `${modals}\n\n      {/* Modal - Kwitansi (Payment Receipt) */}`
);

// Active Rekap lookup
appContent = appContent.replace(
  "const activePesanan = pesananList.find(p => p.id_pesanan === activePesananId);",
  "const activePesanan = pesananList.find(p => p.id_pesanan === activePesananId);\n  const activeRekap = rekapBelanjaList.find(r => r.id_rekap === activeRekapId);"
);


fs.writeFileSync('src/App.tsx', appContent);
