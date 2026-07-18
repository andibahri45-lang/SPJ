const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

code = code.replace(/e: React\.ChangeEvent<HTMLInputElement>/, "e: any");
code = code.replace(/Pemilik: \{rekanan\?\.pimpinan \|\| '-'\}/, "Nama: {rekanan?.nama || '-'}");

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Fixed lint errors");
