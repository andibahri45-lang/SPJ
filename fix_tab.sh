#!/bin/bash
sed -i -e '/{activeTab === '"'"'pesanan'"'"' && (/i \
          {activeTab === '"'"'rekap_belanja'"'"' && (\
            <DataRekapBelanjaForm\
              activeRekapId={activeRekapId}\
              onSelectRekap={setActiveRekapId}\
              rekapBelanjaList={rekapBelanjaList}\
              pesananList={pesananList}\
              subKegiatanList={subKegiatanList}\
              rekananList={rekananList}\
              onSaveRekap={handleSaveRekapBelanja}\
              onDeleteRekap={handleDeleteRekapBelanja}\
              onTriggerPrint={triggerPrint}\
            />\
          )}\
' src/App.tsx
bash fix_tab.sh
