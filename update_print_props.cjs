const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `            balasan={activeBalasan}
            bastRekapan={bastRekapanList.find(b => b.id_rekap === activeRekapId)}
            kwitansiBesar={kwitansiBesarList.find(k => k.id_rekap === activeRekapId)}
            documentType={printDocTypes}`;

appContent = appContent.replace(
  "balasan={activeBalasan}\\n            documentType={printDocTypes}",
  replacement
);

appContent = appContent.replace(
  /balasan=\{activeBalasan\}\s*documentType=\{printDocTypes\}/,
  replacement
);

fs.writeFileSync('src/App.tsx', appContent);
