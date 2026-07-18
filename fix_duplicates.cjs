const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

// Remove duplicate selectedPesananItems definition at line 72
code = code.replace(/const selectedPesananItems = pesananList\.filter\(p => selectedPesananIds\.includes\(p\.id_pesanan\)\);\n/, "");

// Comment out handleSelectAll
code = code.replace(/const handleSelectAll = \(\) => \{[\s\S]*?\};\n/, "");

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Fixed duplicates");
