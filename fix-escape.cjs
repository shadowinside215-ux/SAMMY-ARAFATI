const fs = require('fs');
let content = fs.readFileSync('src/data/translations.ts', 'utf8');

content = content.replace(/d'entreprise/g, "d\\'entreprise");
content = content.replace(/l'Entreprise/g, "l\\'Entreprise");

fs.writeFileSync('src/data/translations.ts', content);
