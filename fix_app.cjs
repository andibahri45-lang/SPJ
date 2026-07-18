const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const anchor = `{activeTab === 'rekap_belanja' && (
            <DataRekapBelanjaForm
              rekapBelanjaList={rekapBelanjaList}
              pesananList={pesananList}
              currentRekapId={activeRekapId}
              onSelectRekap={setActiveRekapId}
              onSaveRekap={handleSaveRekapBelanja}
              onDeleteRekap={handleDeleteRekapBelanja}
              onNextId={() => {
                const maxId = rekapBelanjaList.length > 0 ? Math.max(...rekapBelanjaList.map(r => r.id_rekap)) : 0;
                return maxId + 1;
              }}
              onTriggerPrint={triggerPrint}
            />
          )}`;

const toInsert = `{activeTab === 'rekap_belanja' && (
            <DataRekapBelanjaForm
              rekapBelanjaList={rekapBelanjaList}
              pesananList={pesananList}
              subKegiatanList={subKegiatanList}
              rekananList={rekananList}
              activeRekapId={activeRekapId}
              onSelectRekap={setActiveRekapId}
              onSaveRekap={handleSaveRekapBelanja}
              onDeleteRekap={handleDeleteRekapBelanja}
              onTriggerPrint={triggerPrint}
            />
          )}`;

if (code.includes(anchor)) {
  code = code.replace(anchor, toInsert);
  fs.writeFileSync('src/App.tsx', code, 'utf-8');
  console.log("Fixed src/App.tsx");
} else {
  console.log("Anchor not found.");
}
