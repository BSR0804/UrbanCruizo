
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find vehicle objects in backend format
const vehicleRegex = /\{[^}]*title: '[^']*'[^}]*\}/g;

content = content.replace(vehicleRegex, (match) => {
    if (match.includes('mileage:')) return match;

    let mileage = 15.0;
    if (match.includes('hatchback')) mileage = 20.5;
    if (match.includes('suv')) mileage = 14.8;
    if (match.includes('sedan')) mileage = 18.2;
    if (match.includes('luxury')) mileage = 10.5;
    if (match.includes('bike')) mileage = 45.0;
    if (match.includes('caravan')) mileage = 8.5;
    if (match.includes('Electric')) mileage = 180.0;

    return match.replace(/title: '([^']*)'/, `title: '$1',\n        mileage: ${mileage}`);
});

fs.writeFileSync(filePath, content);
console.log('Update complete');
