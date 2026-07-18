const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  /onBulkDeletePesanan=\{handleBulkDeletePesanan\}\s*onTriggerPrint=\{triggerPrint\}/,
  `onBulkDeletePesanan={handleBulkDeletePesanan}
              onTriggerPrint={triggerPrint}
              onChangeTab={(tab) => {
                if (tab === 'bast_rekapan') {
                  setIsBastRekapanModalOpen(true);
                } else if (tab === 'kwitansi_besar') {
                  setIsKwitansiBesarModalOpen(true);
                }
              }}`
);

fs.writeFileSync('src/App.tsx', appContent);
