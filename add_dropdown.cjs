const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

// 1. Add states
code = code.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
  "const [searchQuery, setSearchQuery] = useState('');\n  const [selectedPesananToAdd, setSelectedPesananToAdd] = useState('');"
);

// 2. Add derived variables
const newVariables = `
  const unselectedAvailablePesanan = filteredAvailablePesanan.filter(p => !selectedPesananIds.includes(p.id_pesanan));
  const selectedPesananItems = pesananList.filter(p => selectedPesananIds.includes(p.id_pesanan));
`;
code = code.replace(
  /const togglePesananSelection = \(id: string\) => \{/,
  newVariables + '\n  const togglePesananSelection = (id: string) => {'
);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Added state and variables");
