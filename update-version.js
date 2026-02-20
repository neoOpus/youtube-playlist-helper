const fs = require('fs');
const path = require('path');

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const dateString = `${year}${month}${day}`;

const version = `3.1.${dateString}`;
const author = "Anoir Ben Tanfous aka neoOpus";

const filesToUpdate = [
    'package.json',
    'projects/core/package.json',
    'projects/ui-kit/package.json',
    'projects/dashboard/package.json',
    'projects/extension/package.json',
    'projects/extension/manifest.json'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        content.version = version;
        if (file.endsWith('package.json')) {
            content.author = author;
        }
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
        console.log(`Updated ${file} to version ${version}`);
    }
});
