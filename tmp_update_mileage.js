
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
let content = fs.readFileSync(filePath, 'utf8');

// Simple regex to find vehicle objects and add mileage if not present
// This is a bit fragile but since it's a known format it should work
const vehicleRegex = /\{[^}]*_id: '(\d+)'[^}]*\}/g;

content = content.replace(vehicleRegex, (match) => {
    if (match.includes('mileage:')) return match;

    // Default mileage based on category if possible findable in match
    let mileage = 15.0;
    if (match.includes('hatchback')) mileage = 20.5;
    if (match.includes('suv')) mileage = 14.8;
    if (match.includes('sedan')) mileage = 18.2;
    if (match.includes('luxury')) mileage = 10.5;
    if (match.includes('bike')) mileage = 45.0;
    if (match.includes('caravan')) mileage = 8.5;
    if (match.includes('Electric')) mileage = 180.0; // range in km

    return match.replace(/_id: '(\d+)'/, `_id: '$1',\n        mileage: ${mileage}`);
});

fs.writeFileSync(filePath, content);
console.log('Update complete');
