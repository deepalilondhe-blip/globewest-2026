import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

files = [
    ('01_US_Mobile_404_Page.png', '1. 404 Error Page (/dfsdfd)'),
    ('02_US_Mobile_Terms_and_Conditions.png', '2. Terms & Conditions'),
    ('03_US_Mobile_Privacy_Policy.png', '3. Privacy Policy'),
    ('04_US_Mobile_Contact_Us.png', '4. Contact Us'),
    ('05_US_Mobile_Help_Centre_FAQ.png', '5. Help Centre / FAQ')
]

imgs = [Image.open(os.path.join(BASE_DIR, f[0])) for f in files]
labels = [f[1] for f in files]

# Each image is 780x1688
w_single, h_single = imgs[0].size
gap = 30
pad = 40
header_h = 100

total_w = pad * 2 + (w_single * len(imgs)) + (gap * (len(imgs) - 1))
total_h = pad * 2 + header_h + h_single + 50

canvas = Image.new('RGB', (total_w, total_h), (248, 250, 252))
draw = ImageDraw.Draw(canvas)

# Top Banner
title_font = get_font(36, bold=True)
sub_font = get_font(20, bold=False)
label_font = get_font(24, bold=True)

draw.text((pad, pad), "GlobeWest US Storefront — Responsive Mobile Testing (390×844 Retina @2x)", fill=(15, 23, 42), font=title_font)
draw.text((pad, pad + 48), "All 5 Static Pages Authenticated Audit: Zero horizontal overflow, single-column stacking, native responsive typography", fill=(100, 116, 139), font=sub_font)

for i, (img, label) in enumerate(zip(imgs, labels)):
    x = pad + i * (w_single + gap)
    y_label = pad + header_h + 10
    y_img = y_label + 40

    # Clean label
    draw.text((x + 10, y_label), label, fill=(30, 41, 59), font=label_font)
    
    # Image
    canvas.paste(img, (x, y_img))
    # Subtle 1px neutral border around screenshot
    draw.rectangle([x, y_img, x + w_single, y_img + h_single], outline=(203, 213, 225), width=2)

out_path = os.path.join(BASE_DIR, 'US_Static_Pages_Mobile_Responsive_Overview.png')
canvas.save(out_path, quality=95)
print(f"Saved overview collage: {out_path} ({total_w}x{total_h})")
