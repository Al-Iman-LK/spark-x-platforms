const fs = require('fs');
const path = require('path');

// Simple base64 encoded minimal PNG icons
// These are 1x1 pixel PNGs that will work as valid icons

const createBase64Icon = (color) => {
    // This creates a minimal 1x1 PNG - browsers will scale it
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`;
};

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Create minimal PNG files
iconSizes.forEach(size => {
    const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    // Create a simple colored square PNG
    const canvas = require('canvas').createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#f59e0b');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add simple "X" logo
    ctx.strokeStyle = 'white';
    ctx.lineWidth = size / 10;
    ctx.lineCap = 'round';
    
    const center = size / 2;
    const offset = size / 4;
    
    ctx.beginPath();
    ctx.moveTo(center - offset, center - offset);
    ctx.lineTo(center + offset, center + offset);
    ctx.moveTo(center + offset, center - offset);
    ctx.lineTo(center - offset, center + offset);
    ctx.stroke();
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    
    console.log(`Created ${filename}`);
});

console.log('All icon files created successfully!');
