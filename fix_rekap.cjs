const fs = require('fs');

let rekapContent = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf8');

rekapContent = rekapContent.replace(
  "onTriggerPrint?: (tipe: 'kwitansi_besar' | 'bast_rekapan' | Array<'kwitansi_besar' | 'bast_rekapan'>) => void;\n}",
  "onTriggerPrint?: (tipe: 'kwitansi_besar' | 'bast_rekapan' | Array<'kwitansi_besar' | 'bast_rekapan'>) => void;\n  onChangeTab?: (tab: string) => void;\n}"
);

rekapContent = rekapContent.replace(
  "onTriggerPrint\n}: DataRekapBelanjaFormProps) {",
  "onTriggerPrint,\n  onChangeTab\n}: DataRekapBelanjaFormProps) {"
);

rekapContent = rekapContent.replace(
  "// Placeholder for BAST Rekapan form or print action",
  "if (onChangeTab) onChangeTab('bast_rekapan');"
);

rekapContent = rekapContent.replace(
  "// Placeholder for Kwitansi Besar form or print action",
  "if (onChangeTab) onChangeTab('kwitansi_besar');"
);

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', rekapContent);
