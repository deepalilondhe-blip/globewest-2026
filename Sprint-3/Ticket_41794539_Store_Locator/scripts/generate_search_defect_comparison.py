import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794539_Store_Locator"
OUT_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(OUT_DIR, exist_ok=True)

AU_IMG = os.path.join(BASE_DIR, "screenshots/zipcode_search_verification/01_AU_SEARCH_3000_RESULT.png")
US_IMG = os.path.join(BASE_DIR, "screenshots/zipcode_search_verification/02_US_SEARCH_90210_RESULT.png")

def get_font(size=18, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def create_search_defect_comparison():
    im_au = Image.open(AU_IMG).convert("RGBA")
    im_us = Image.open(US_IMG).convert("RGBA")

    # Focus on the search form, map and results area:
    # Desktop view width: 1440, height: ~2000
    # Search & map container is between y=50 and y=750
    crop_au = (30, 50, 1410, 780)
    crop_us = (30, 50, 1410, 780)

    im_au_c = im_au.crop(crop_au)
    im_us_c = im_us.crop(crop_us)

    # Standardize width
    target_w = 720
    h_au = int(im_au_c.height * (target_w / im_au_c.width))
    h_us = int(im_us_c.height * (target_w / im_us_c.width))
    target_h = max(h_au, h_us)

    im_au_res = im_au_c.resize((target_w, target_h), Image.Resampling.LANCZOS)
    im_us_res = im_us_c.resize((target_w, target_h), Image.Resampling.LANCZOS)

    header_h = 100
    banner_h = 45
    pad = 30
    total_w = (target_w * 2) + (pad * 3)
    total_h = header_h + banner_h + target_h + pad + 20

    canvas = Image.new("RGBA", (total_w, total_h), (245, 246, 248, 255))
    draw = ImageDraw.Draw(canvas)

    # Header
    draw.rectangle([(0, 0), (total_w, header_h)], fill=(20, 24, 33, 255))
    f_title = get_font(24, bold=True)
    f_sub = get_font(14, bold=False)
    draw.text((pad, 22), "POSTCODE / ZIP CODE SEARCH FUNCTIONALITY AUDIT: AU VS US", font=f_title, fill=(255, 255, 255, 255))
    draw.text((pad, 62), "GlobeWest Senior QA Verification | Interactive City Navigation & Store Results Lookup", font=f_sub, fill=(180, 190, 205, 255))

    # AU Column (Green)
    x1 = pad
    y1 = header_h + 15
    col1_color = (0, 150, 70, 255)
    draw.rectangle([(x1, y1), (x1 + target_w, y1 + banner_h)], fill=col1_color)
    f_label = get_font(14, bold=True)
    draw.text((x1 + 15, y1 + 12), "🟢 AU BASELINE: Search '3000' Pans & Zooms into Melbourne + Renders Store Card", font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im_au_res, (x1, y1 + banner_h))
    draw.rectangle([(x1, y1 + banner_h), (x1 + target_w, y1 + banner_h + target_h)], outline=col1_color, width=4)

    # US Column (Red)
    x2 = x1 + target_w + pad
    col2_color = (210, 40, 40, 255)
    draw.rectangle([(x2, y1), (x2 + target_w, y1 + banner_h)], fill=col2_color)
    draw.text((x2 + 15, y1 + 12), "🔴 US STOREFRONT DEFECT: Search '90210' Fails — Map Remains Static, 0 Stores", font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im_us_res, (x2, y1 + banner_h))
    draw.rectangle([(x2, y1 + banner_h), (x2 + target_w, y1 + banner_h + target_h)], outline=col2_color, width=4)

    out_file = os.path.join(OUT_DIR, "COMPARISON_06_ZIPCODE_SEARCH_FAILURE.png")
    canvas.convert("RGB").save(out_file, quality=95)
    print(f"✅ Generated: {out_file}")

create_search_defect_comparison()
