const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  "onBulkDeletePesanan={handleBulkDeletePesanan}\\n              onTriggerPrint={triggerPrint}",
  "onBulkDeletePesanan={handleBulkDeletePesanan}\\n              onTriggerPrint={triggerPrint}\\n              onChangeTab={(tab) => {\\n                if (tab === 'bast_rekapan') {\\n                  setIsBastRekapanModalOpen(true);\\n                } else if (tab === 'kwitansi_besar') {\\n                  setIsKwitansiBesarModalOpen(true);\\n                }\\n              }}"
);

fs.writeFileSync('src/App.tsx', appContent);
