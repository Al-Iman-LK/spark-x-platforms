# Simple Python script to generate basic PWA icons
# This creates simple colored squares as placeholders

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple Spark-X icon"""
    # Create image with gradient-like background
    img = Image.new('RGB', (size, size), color='#2563eb')
    draw = ImageDraw.Draw(img)
    
    # Create gradient effect
    for i in range(size):
        # Create a simple gradient from blue to orange
        ratio = i / size
        r = int(37 + (245 - 37) * ratio)
        g = int(99 + (158 - 99) * ratio)
        b = int(235 + (11 - 235) * ratio)
        color = (r, g, b)
        draw.line([(0, i), (size, i)], fill=color)
    
    # Add lightning bolt shape (simplified)
    bolt_points = [
        (size * 0.3, size * 0.2),
        (size * 0.6, size * 0.45),
        (size * 0.4, size * 0.45),
        (size * 0.7, size * 0.8),
        (size * 0.4, size * 0.55),
        (size * 0.6, size * 0.55),
    ]
    draw.polygon(bolt_points, fill='white')
    
    # Add 'X' mark
    line_width = max(2, size // 30)
    x_size = size * 0.1
    x_center = (size * 0.75, size * 0.75)
    
    # Draw X
    draw.line([
        (x_center[0] - x_size, x_center[1] - x_size),
        (x_center[0] + x_size, x_center[1] + x_size)
    ], fill='#f59e0b', width=line_width)
    
    draw.line([
        (x_center[0] + x_size, x_center[1] - x_size),
        (x_center[0] - x_size, x_center[1] + x_size)
    ], fill='#f59e0b', width=line_width)
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename}")

def main():
    """Generate all required icon sizes"""
    icons_dir = 'icons'
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
    
    # Standard PWA icon sizes
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    for size in sizes:
        filename = os.path.join(icons_dir, f'icon-{size}x{size}.png')
        create_icon(size, filename)
    
    print("All icons generated successfully!")

if __name__ == "__main__":
    main()
