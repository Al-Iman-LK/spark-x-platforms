const fs = require('fs');
const path = require('path');

// Simple PNG generator using Canvas API in Node.js
// This creates real PNG files instead of text placeholders

function createIconPNG(size, filename) {
    // Create a minimal PNG header for a solid color icon
    const canvas = createCanvas(size);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background matching PWA theme
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#f59e0b');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add "SX" text for Spark-X
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size/3}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('SX', size/2, size/2 + size/8);
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, 'icons', filename), buffer);
    console.log(`✅ Generated ${filename} (${size}x${size})`);
}

function createCanvas(size) {
    // For environments without node-canvas, create a simple alternative
    if (typeof require === 'undefined') {
        throw new Error('This script requires Node.js environment');
    }
    
    try {
        const { createCanvas } = require('canvas');
        return createCanvas(size, size);
    } catch (e) {
        console.log('⚠️  canvas package not found. Installing...');
        console.log('Please run: npm install canvas');
        process.exit(1);
    }
}

// Generate all required icon sizes
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Generating Spark-X PWA Icons...');

// Ensure icons directory exists
if (!fs.existsSync('./icons')) {
    fs.mkdirSync('./icons');
}

iconSizes.forEach(size => {
    const filename = `icon-${size}x${size}.png`;
    try {
        createIconPNG(size, filename);
    } catch (error) {
        console.error(`❌ Failed to generate ${filename}:`, error.message);
    }
});

console.log('🚀 Icon generation complete!');
