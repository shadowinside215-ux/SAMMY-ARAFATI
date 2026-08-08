const fs = require('fs');
let content = fs.readFileSync('src/data/translations.ts', 'utf8');

// I will just use regex to replace everything from `services: [` up to `whyMe: [` with the correct string.
// Because it's corrupted, the current regex might fail.
