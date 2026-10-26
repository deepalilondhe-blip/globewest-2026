import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794539_Store_Locator"
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots/map_retest")
OUT_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(OUT_DIR, exist_ok=True)

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

def create_comparison(img1_path, img2_path, out_path, title, label1, label2, is_pass1=True, is_pass2=False, crop_box1=None, crop_box2=None):
    im1 = Image.open(img1_path).convert("RGBA")
    im2 = Image.open(img2_path).convert("RGBA")

    if crop_box1:
        im1 = im1.crop(crop_box1)
    if crop_box2:
        im2 = im2.crop(crop_box2)

    # Standardize heights
    target_h = 750
    w1 = int(im1.width * (target_h / im1.height))
    w2 = int(im2.width * (target_h / im2.height))
    im1 = im1.resize((w1, target_h), Image.Resampling.LANCZOS)
    im2 = im2.resize((w2, target_h), Image.Resampling.LANCZOS)

    header_h = 100
    banner_h = 45
    pad = 30
    total_w = w1 + w2 + (pad * 3)
    total_h = header_h + banner_h + target_h + pad + 20

    canvas = Image.new("RGBA", (total_w, total_h), (245, 246, 248, 255))
    draw = ImageDraw.Draw(canvas)

    # Main Header
    draw.rectangle([(0, 0), (total_w, header_h)], fill=(20, 24, 33, 255))
    f_title = get_font(26, bold=True)
    f_sub = get_font(15, bold=False)
    draw.text((pad, 22), title, font=f_title, fill=(255, 255, 255, 255))
    draw.text((pad, 62), "GlobeWest Senior QA Audit | Dual-Storefront & Map Precision Verification", font=f_sub, fill=(180, 190, 205, 255))

    # Column 1
    x1 = pad
    y1 = header_h + 15
    col1_color = (0, 150, 70, 255) if is_pass1 else (210, 40, 40, 255)
    draw.rectangle([(x1, y1), (x1 + w1, y1 + banner_h)], fill=col1_color)
    f_label = get_font(16, bold=True)
    draw.text((x1 + 15, y1 + 12), label1, font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im1, (x1, y1 + banner_h))
    draw.rectangle([(x1, y1 + banner_h), (x1 + w1, y1 + banner_h + target_h)], outline=col1_color, width=3)

    # Column 2
    x2 = x1 + w1 + pad
    col2_color = (0, 150, 70, 255) if is_pass2 else (210, 40, 40, 255)
    draw.rectangle([(x2, y1), (x2 + w2, y1 + banner_h)], fill=col2_color)
    draw.text((x2 + 15, y1 + 12), label2, font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im2, (x2, y1 + banner_h))
    draw.rectangle([(x2, y1 + banner_h), (x2 + w2, y1 + banner_h + target_h)], outline=col2_color, width=3)

    canvas.convert("RGB").save(out_path, quality=95)
    print(f"✅ Generated: {out_path}")

# 1. Map Comparison: AU Map Center (Australia) vs US Map Center (USA Applied)
create_comparison(
    img1_path=os.path.join(SCREENSHOTS_DIR, "05_AU_BASELINE_DESKTOP.png"),
    img2_path=os.path.join(SCREENSHOTS_DIR, "02_US_FULL_PAGE_DESKTOP.png"),
    out_path=os.path.join(OUT_DIR, "COMPARISON_01_MAP_CENTER_AU_VS_US.png"),
    title="GOOGLE MAP INITIALIZATION & CENTER: AU BASELINE VS US STAGING",
    label1="🟢 AU BASELINE: Centered on Australia (-24.23, 133.63)",
    label2="🟢 US APPLIED FIX: Centered on USA (39.8, -98.6) with LA Pin",
    is_pass1=True,
    is_pass2=True,
    crop_box1=(640, 60, 1440, 780),
    crop_box2=(640, 60, 1440, 780)
)

# 2. Search Field & Terminology Defect: AU Postcode vs US Search
create_comparison(
    img1_path=os.path.join(SCREENSHOTS_DIR, "05_AU_BASELINE_DESKTOP.png"),
    img2_path=os.path.join(SCREENSHOTS_DIR, "02_US_FULL_PAGE_DESKTOP.png"),
    out_path=os.path.join(OUT_DIR, "COMPARISON_02_SEARCH_TERMINOLOGY_DEFECT.png"),
    title="SEARCH FORM: POSTCODE TERMINOLOGY & US ZIP CODE HANDLING",
    label1="🟢 AU BASELINE: Functional AU Postcode (Eg. 3000)",
    label2="🔴 US STOREFRONT DEFECT: 'SEARCH BY POSTCODE' & 0 Results for US ZIPs",
    is_pass1=True,
    is_pass2=False,
    crop_box1=(40, 60, 600, 380),
    crop_box2=(40, 60, 600, 380)
)

# 3. Mobile View Comparison
create_comparison(
    img1_path=os.path.join(SCREENSHOTS_DIR, "05_AU_BASELINE_DESKTOP.png"),
    img2_path=os.path.join(SCREENSHOTS_DIR, "04_US_FULL_PAGE_MOBILE.png"),
    out_path=os.path.join(OUT_DIR, "COMPARISON_03_MOBILE_VIEW_RETEST.png"),
    title="STORE LOCATOR MOBILE VIEW: MAP RENDERING & DUPLICATE TEXT",
    label1="🟢 AU BASELINE (Desktop Layout Reference)",
    label2="🔴 US MOBILE STOREFRONT: USA Map Loads, but Duplicate Text & AU Copy Persists",
    is_pass1=True,
    is_pass2=False,
    crop_box1=(40, 60, 1400, 800),
    crop_box2=(0, 0, 390, 844)
)
