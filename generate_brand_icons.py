import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def bezier_point(p0, p1, p2, p3, t):
    return (
        (1-t)**3 * p0[0] + 3*(1-t)**2 * t * p1[0] + 3*(1-t) * t**2 * p2[0] + t**3 * p3[0],
        (1-t)**3 * p0[1] + 3*(1-t)**2 * t * p1[1] + 3*(1-t) * t**2 * p2[1] + t**3 * p3[1]
    )

def eval_curve(p0, p1, p2, p3, n=40):
    return [bezier_point(p0, p1, p2, p3, i/n) for i in range(1, n+1)]

def build_master_badge():
    # Outer path commands
    outer_pts = [(50, 4)]
    outer_pts += eval_curve((50, 4), (24.6, 4), (4, 24.6), (4, 50))
    outer_pts += eval_curve((4, 50), (4, 64.5), (10.5, 77.5), (13, 82))
    outer_pts += eval_curve((13, 82), (13.5, 83), (14.8, 82.5), (15.2, 81.5))
    outer_pts += eval_curve((15.2, 81.5), (18.5, 69), (22, 52.5), (22, 41))
    outer_pts += eval_curve((22, 41), (22, 40), (23.2, 39.5), (23.9, 40.2))
    outer_pts += [(35.5, 50.5)]
    outer_pts += eval_curve((35.5, 50.5), (31, 54), (28, 59.5), (28, 66))
    outer_pts += eval_curve((28, 66), (28, 75.4), (35.6, 83), (45, 83))
    outer_pts += eval_curve((45, 83), (47.5, 83), (49, 81.5), (50, 78.5))
    outer_pts += eval_curve((50, 78.5), (51, 81.5), (52.5, 83), (55, 83))
    outer_pts += eval_curve((55, 83), (64.4, 83), (72, 75.4), (72, 66))
    outer_pts += eval_curve((72, 66), (72, 59.5), (69, 54), (64.5, 50.5))
    outer_pts += [(76.1, 40.2)]
    outer_pts += eval_curve((76.1, 40.2), (76.8, 39.5), (78, 40), (78, 41))
    outer_pts += eval_curve((78, 41), (78, 52.5), (81.5, 69), (84.8, 81.5))
    outer_pts += eval_curve((84.8, 81.5), (85.2, 82.5), (86.5, 83), (87, 82))
    outer_pts += eval_curve((87, 82), (89.5, 77.5), (96, 64.5), (96, 50))
    outer_pts += eval_curve((96, 50), (96, 24.6), (75.4, 4), (50, 4))

    # Inner path commands (cutout hole)
    inner_pts = [(50, 17)]
    inner_pts += eval_curve((50, 17), (65, 17), (77.5, 26.5), (81.5, 36.5))
    inner_pts += eval_curve((81.5, 36.5), (77, 34), (71, 34), (66, 38))
    inner_pts += [(50, 51.5), (34, 38)]
    inner_pts += eval_curve((34, 38), (29, 34), (23, 34), (18.5, 36.5))
    inner_pts += eval_curve((18.5, 36.5), (22.5, 26.5), (35, 17), (50, 17))

    # Supersample at 2048x2048 for retina ultra-crisp scaling
    S = 2048
    scale = (S * 0.65) / 100.0
    ox = (S - 100 * scale) / 2.0
    oy = (S - 86 * scale) / 2.0

    def transform_pts(pts):
        return [(ox + x * scale, oy + y * scale) for x, y in pts]

    t_outer = transform_pts(outer_pts)
    t_inner = transform_pts(inner_pts)

    img = Image.new('RGBA', (S, S), (7, 9, 8, 255))
    draw = ImageDraw.Draw(img)

    # Radial ambient background gradient
    cx, cy = S / 2, S / 2
    for r in range(int(S * 0.72), 0, -8):
        factor = r / (S * 0.72)
        red = int(7 + (18 - 7) * (1 - factor))
        green = int(9 + (31 - 9) * (1 - factor))
        blue = int(8 + (20 - 8) * (1 - factor))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue, 255))

    # Elegant squircle border ring with gold/lime sheen
    draw.rounded_rectangle([36, 36, S - 36, S - 36], radius=440, outline=(198, 245, 84, 55), width=12)

    # Create vector mask
    mask = Image.new('L', (S, S), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.polygon(t_outer, fill=255)
    mask_draw.polygon(t_inner, fill=0)

    # Create gold & lime luxury gradient for the owl emblem
    gold_grad = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    gold_draw = ImageDraw.Draw(gold_grad)
    for y in range(S):
        ratio = y / S
        if ratio < 0.65:
            sub_r = ratio / 0.65
            gr = int(255 + (247 - 255) * sub_r)
            gg = int(244 + (204 - 244) * sub_r)
            gb = int(144 + (70 - 144) * sub_r)
        else:
            sub_r = (ratio - 0.65) / 0.35
            gr = int(247 + (198 - 247) * sub_r)
            gg = int(204 + (245 - 204) * sub_r)
            gb = int(70 + (84 - 70) * sub_r)
        gold_draw.line([(0, y), (S, y)], fill=(gr, gg, gb, 255))

    # Composite owl onto background
    img.paste(gold_grad, (0, 0), mask)

    # Return 512x512 master image
    return img.resize((512, 512), Image.Resampling.LANCZOS)

def create_master_svg():
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1811" />
      <stop offset="50%" stop-color="#070908" />
      <stop offset="100%" stop-color="#040605" />
    </linearGradient>
    <linearGradient id="owlGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff4a8" />
      <stop offset="35%" stop-color="#f7cc46" />
      <stop offset="75%" stop-color="#e8a817" />
      <stop offset="100%" stop-color="#c6f554" />
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7cc46" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#c6f554" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f7cc46" stop-opacity="0.15" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Subtle Outer Border Squircle -->
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="url(#ringGrad)" stroke-width="4" />

  <!-- Centered Scaled Owl Emblem (Safe Zone: 330x284 within 512x512) -->
  <g transform="translate(91, 114) scale(3.3)">
    <path
      fill="url(#owlGold)"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M 50 4 
         C 24.6 4 4 24.6 4 50 
         C 4 64.5 10.5 77.5 13 82 
         C 13.5 83 14.8 82.5 15.2 81.5 
         C 18.5 69 22 52.5 22 41 
         C 22 40 23.2 39.5 23.9 40.2 
         L 35.5 50.5 
         C 31 54 28 59.5 28 66 
         C 28 75.4 35.6 83 45 83 
         C 47.5 83 49 81.5 50 78.5 
         C 51 81.5 52.5 83 55 83 
         C 64.4 83 72 75.4 72 66 
         C 72 59.5 69 54 64.5 50.5 
         L 76.1 40.2 
         C 76.8 39.5 78 40 78 41 
         C 78 52.5 81.5 69 84.8 81.5 
         C 85.2 82.5 86.5 83 87 82 
         C 89.5 77.5 96 64.5 96 50 
         C 96 24.6 75.4 4 50 4 Z 
         M 50 17 
         C 65 17 77.5 26.5 81.5 36.5 
         C 77 34 71 34 66 38 
         L 50 51.5 
         L 34 38 
         C 29 34 23 34 18.5 36.5 
         C 22.5 26.5 35 17 50 17 Z"
    />
  </g>
</svg>'''
    for d in ['public', 'dist']:
        with open(os.path.join(d, 'favicon.svg'), 'w', encoding='utf-8') as f:
            f.write(svg_content)
    with open('favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Created favicon.svg in public, dist, and root")

def generate_all_icons():
    create_master_svg()
    master_512 = build_master_badge()
    
    dirs = ['public', 'dist']
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    sizes = {
        'icon-512x512.png': (512, 512),
        'genowl-mail-logo.png': (512, 512),
        'icon-192x192.png': (192, 192),
        'apple-touch-icon.png': (180, 180),
        'favicon-48x48.png': (48, 48),
        'favicon-32x32.png': (32, 32),
        'favicon-16x16.png': (16, 16),
    }
    
    for filename, (w, h) in sizes.items():
        resized = master_512.resize((w, h), Image.Resampling.LANCZOS)
        for d in dirs:
            resized.save(os.path.join(d, filename), format='PNG', optimize=True)
        resized.save(filename, format='PNG', optimize=True)
        print(f"Generated {filename} ({w}x{h})")
        
    # Multi-layer favicon.ico containing 16x16, 32x32, 48x48
    ico_img_16 = master_512.resize((16, 16), Image.Resampling.LANCZOS)
    ico_img_32 = master_512.resize((32, 32), Image.Resampling.LANCZOS)
    ico_img_48 = master_512.resize((48, 48), Image.Resampling.LANCZOS)
    
    for d in dirs:
        ico_img_48.save(
            os.path.join(d, 'favicon.ico'),
            format='ICO',
            sizes=[(16, 16), (32, 32), (48, 48)],
            append_images=[ico_img_16, ico_img_32]
        )
    ico_img_48.save(
        'favicon.ico',
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[ico_img_16, ico_img_32]
    )
    print("Generated multi-layer favicon.ico (16, 32, 48)")
    
    # Generate 1200x630 OpenGraph Banner
    generate_og_image(master_512)
    generate_webmanifest()

def generate_og_image(master_512):
    width, height = 1200, 630
    og = Image.new("RGBA", (width, height), (7, 9, 8, 255))
    draw = ImageDraw.Draw(og)
    
    # Background subtle gradient
    for y in range(height):
        ratio = y / height
        r = int(12 * (1 - ratio) + 4 * ratio)
        g = int(22 * (1 - ratio) + 6 * ratio)
        b = int(15 * (1 - ratio) + 5 * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        
    # Ambient glow orbs
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([80, 80, 560, 560], fill=(247, 204, 70, 26))
    glow_draw.ellipse([700, 220, 1180, 680], fill=(198, 245, 84, 20))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    og = Image.alpha_composite(og, glow)
    draw = ImageDraw.Draw(og)
    
    # Border
    draw.rounded_rectangle([20, 20, width - 20, height - 20], radius=32, outline=(198, 245, 84, 45), width=2)
    
    # Paste logo badge
    logo_badge = master_512.resize((320, 320), Image.Resampling.LANCZOS)
    og.paste(logo_badge, (80, 155), logo_badge)
    
    try:
        font_brand = ImageFont.truetype("arial.ttf", 64)
        font_title = ImageFont.truetype("arial.ttf", 34)
        font_sub = ImageFont.truetype("arial.ttf", 22)
        font_badge = ImageFont.truetype("arial.ttf", 18)
    except:
        font_brand = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_badge = ImageFont.load_default()
        
    # Category badge
    draw.rounded_rectangle([448, 148, 750, 192], radius=22, fill=(16, 28, 18, 240), outline=(198, 245, 84, 160), width=1)
    draw.text((472, 160), "3D & AI WEB ARCHITECTURE", fill=(198, 245, 84, 255), font=font_badge)
    
    # Brand
    draw.text((448, 215), "GENOWL STUDIO", fill=(255, 255, 255, 255), font=font_brand)
    
    # Slogan
    draw.text((450, 305), "Intelligence that grows with you.", fill=(247, 204, 70, 255), font=font_title)
    
    # Services
    draw.text((450, 365), "Cinema-Grade 3D WebGL  •  High-Converting 2D Sites  •  AI Video", fill=(200, 215, 205, 255), font=font_sub)
    
    # URL & Hotline
    draw.text((450, 435), "https://genowl.tech   |   24/7 YZER AI Live Hotline: +1 (628) 245-9578", fill=(198, 245, 84, 220), font=font_sub)
    
    for d in ['public', 'dist']:
        og.save(os.path.join(d, 'og-image.png'), format='PNG', optimize=True)
    og.save('og-image.png', format='PNG', optimize=True)
    print("Generated og-image.png (1200x630)")

def generate_webmanifest():
    manifest_content = '''{
  "name": "Genowl Studio",
  "short_name": "Genowl",
  "description": "High-converting 2D websites, cinema-grade 3D WebGL experiences, and custom AI production.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#070908",
  "theme_color": "#070908",
  "icons": [
    {
      "src": "/favicon-48x48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}'''
    for d in ['public', 'dist']:
        with open(os.path.join(d, 'site.webmanifest'), 'w', encoding='utf-8') as f:
            f.write(manifest_content)
    with open('site.webmanifest', 'w', encoding='utf-8') as f:
        f.write(manifest_content)
    print("Generated site.webmanifest")

if __name__ == '__main__':
    generate_all_icons()
    print("ALL PC, MOBILE, AND GOOGLE SEARCH ASSETS COMPLETE!")
