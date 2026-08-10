const fs = require('fs');
let content = fs.readFileSync('src/data/translations.ts', 'utf8');

// Name replacements
content = content.replace(/name:\s*'Sammy Arafati'/g, "name: 'Sami Digital Solutions'");

// Web Apps title replacements
content = content.replace(/title:\s*"Web Apps"/g, 'title: "Web, Play Store & App Store Apps"');
content = content.replace(/title:\s*"Applications Web"/g, 'title: "Applications Web, Play Store & App Store"');
content = content.replace(/title:\s*"تطبيقات الويب"/g, 'title: "تطبيقات الويب وبلاي ستور وآب ستور"');

fs.writeFileSync('src/data/translations.ts', content);
