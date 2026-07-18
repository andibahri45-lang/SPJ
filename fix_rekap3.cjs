const fs = require('fs');
let code = fs.readFileSync('src/components/DataRekapBelanjaForm.tsx', 'utf-8');

const regexImport = /import \{ Plus, Edit3, Trash2, Printer, Search, Save, X, Database, List, CheckCircle2, RotateCcw, AlertTriangle, CheckSquare, Square \} from 'lucide-react';/;
code = code.replace(regexImport, "import { Plus, Edit3, Trash2, Printer, Search, Save, X, Database, List, CheckCircle2, RotateCcw, AlertTriangle, CheckSquare, Square, ChevronDown, ChevronUp, Download, FileSpreadsheet } from 'lucide-react';");

fs.writeFileSync('src/components/DataRekapBelanjaForm.tsx', code, 'utf-8');
console.log("Imports updated");
