const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const regex = /uraian_gabungan: uraianGabungan,/;
code = code.replace(regex, "uraian_belanja_gabungan: uraianGabungan,");

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Fixed save");
