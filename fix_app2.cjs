const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const anchor = `onDeleteRekap={handleDeleteRekapBelanja}
              onTriggerPrint={triggerPrint}
            />`;
            
const toInsert = `onDeleteRekap={handleDeleteRekapBelanja}
              onDeletePesanan={handleDeletePesanan}
              onBulkDeletePesanan={handleBulkDeletePesanan}
              onTriggerPrint={triggerPrint}
            />`;

code = code.replace(anchor, toInsert);
fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log("Updated App.tsx");
