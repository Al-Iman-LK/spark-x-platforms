// Create placeholder PNG icons for Spark-X Platforms PWA
// This creates simple colored squares as placeholders

// Base64 encoded 1x1 blue pixel
const bluePixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHWPq6xGQAAAABJRU5ErkJggg==';

function createIconCanvas(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#f59e0b');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add rounded corners
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    const radius = size * 0.15;
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Lightning bolt
    ctx.fillStyle = 'white';
    ctx.beginPath();
    const centerX = size / 2;
    const centerY = size / 2;
    const boltSize = size * 0.3;
    
    ctx.moveTo(centerX - boltSize * 0.3, centerY - boltSize * 0.5);
    ctx.lineTo(centerX + boltSize * 0.2, centerY - boltSize * 0.1);
    ctx.lineTo(centerX - boltSize * 0.1, centerY - boltSize * 0.1);
    ctx.lineTo(centerX + boltSize * 0.3, centerY + boltSize * 0.5);
    ctx.lineTo(centerX - boltSize * 0.2, centerY + boltSize * 0.1);
    ctx.lineTo(centerX + boltSize * 0.1, centerY + boltSize * 0.1);
    ctx.closePath();
    ctx.fill();
    
    // X mark
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = size * 0.06;
    ctx.lineCap = 'round';
    const xSize = size * 0.08;
    const xPos = centerX + size * 0.25;
    const yPos = centerY + size * 0.25;
    
    ctx.beginPath();
    ctx.moveTo(xPos - xSize, yPos - xSize);
    ctx.lineTo(xPos + xSize, yPos + xSize);
    ctx.moveTo(xPos + xSize, yPos - xSize);
    ctx.lineTo(xPos - xSize, yPos + xSize);
    ctx.stroke();
    
    return canvas;
}

// Create and download icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    const canvas = createIconCanvas(size);
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `icon-${size}x${size}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
});

console.log('Icon generation complete!');
