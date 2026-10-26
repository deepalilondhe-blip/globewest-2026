import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
REAL_COMP_DIR = os.path.join(BASE_DIR, 'REAL_COMPARISONS')
DEFECT_DIR = os.path.join(BASE_DIR, 'DEFECT_SCREENSHOTS')

os.makedirs(REAL_COMP_DIR, exist_ok=True)
os.makedirs(DEFECT_DIR, exist_ok=True)

# Helper font loader
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

def create_side_by_side_comparison(page_id, page_title, mode='desktop', use_viewport=True):
    subfolder = 'desktop' if mode == 'desktop' else 'mobile'
    suffix = 'viewport' if use_viewport else 'full'
    
    au_path = os.path.join(SCREENSHOTS_DIR, subfolder, f"AU_{page_id}_{mode}_{suffix}.png")
    us_path = os.path.join(SCREENSHOTS_DIR, subfolder, f"US_{page_id}_{mode}_{suffix}.png")
    
    if not os.path.exists(au_path) or not os.path.exists(us_path):
        print(f"Skipping {page_id} ({mode}): files not found")
        return None
        
    img_au = Image.open(au_path)
    img_us = Image.open(us_path)
    
    # Target height & width
    w_au, h_au = img_au.size
    w_us, h_us = img_us.size
    
    # Cap height if full page is insanely long (e.g. 18000px)
    max_h = 3000 if not use_viewport else max(h_au, h_us)
    if h_au > max_h:
        img_au = img_au.crop((0, 0, w_au, max_h))
        h_au = max_h
    if h_us > max_h:
        img_us = img_us.crop((0, 0, w_us, max_h))
        h_us = max_h
        
    common_h = min(h_au, h_us)
    img_au = img_au.crop((0, 0, w_au, common_h))
    img_us = img_us.crop((0, 0, w_us, common_h))
    
    header_h = 90
    canvas_w = w_au + w_us + 40
    canvas_h = common_h + header_h + 30
    
    comp = Image.new('RGB', (canvas_w, canvas_h), (245, 246, 248))
    draw = ImageDraw.Draw(comp)
    
    # Header background
    draw.rectangle([0, 0, canvas_w, header_h], fill=(26, 26, 26))
    
    title_font = get_font(26, bold=True)
    badge_font = get_font(18, bold=True)
    sub_font = get_font(14, bold=False)
    
    # Header Title
    title_text = f"GlobeWest - {page_title} ({mode.upper()})"
    draw.text((25, 20), title_text, fill=(255, 255, 255), font=title_font)
    draw.text((25, 55), "Live Storefront Authenticated Comparison (Logged-in Mode)", fill=(180, 180, 180), font=sub_font)
    
    # Side 1: AU Baseline Header
    x_au = 15
    y_img = header_h + 15
    draw.rectangle([x_au, y_img - 30, x_au + w_au, y_img - 4], fill=(225, 240, 225))
    draw.text((x_au + 15, y_img - 26), "🟢 AU BASELINE STAGING (Live Approved Reference)", fill=(20, 110, 40), font=badge_font)
    comp.paste(img_au, (x_au, y_img))
    
    # Side 2: US Staging Header
    x_us = w_au + 25
    draw.rectangle([x_us, y_img - 30, x_us + w_us, y_img - 4], fill=(235, 240, 255))
    draw.text((x_us + 15, y_img - 26), "🔵 US STAGING (mcstaging2.globewest.com)", fill=(30, 70, 160), font=badge_font)
    comp.paste(img_us, (x_us, y_img))
    
    out_filename = f"{page_title.replace(' ', '_').replace('/', '_')}_{mode.capitalize()}_Comparison.png"
    out_path = os.path.join(REAL_COMP_DIR, out_filename)
    comp.save(out_path, quality=92)
    print(f"Saved: {out_filename} ({canvas_w}x{canvas_h})")
    return out_path

pages = [
    ('terms', 'Terms_and_Conditions'),
    ('privacy', 'Privacy_Policy'),
    ('contact', 'Contact_Us'),
    ('faq', 'Help_Centre_FAQ'),
    ('404', '404_Page_Not_Found')
]

print("=== GENERATING REAL VIEW SIDE-BY-SIDE COMPARISONS ===")
for pid, title in pages:
    create_side_by_side_comparison(pid, title, mode='desktop', use_viewport=True)
    create_side_by_side_comparison(pid, title, mode='mobile', use_viewport=True)

print("Done generating comparisons!")
