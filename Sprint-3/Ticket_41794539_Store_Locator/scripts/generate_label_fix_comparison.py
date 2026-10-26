import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794539_Store_Locator"
OUT_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(OUT_DIR, exist_ok=True)

BEFORE_IMG = os.path.join(BASE_DIR, "screenshots/map_retest/02_US_FULL_PAGE_DESKTOP.png")
AFTER_IMG = os.path.join(BASE_DIR, "screenshots/developer_fix_zipcode_label/02_SEARCH_BY_NAME_LOS_ANGELES.png")

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

def create_verification_comparison():
    im_before = Image.open(BEFORE_IMG).convert("RGBA")
    im_after = Image.open(AFTER_IMG).convert("RGBA")

    # Focus on the search form and map area
    # Before: y=50 to y=650
    # After: y=50 to y=650
    crop_before = (30, 80, 1410, 720)
    crop_after = (30, 80, 1410, 720)

    im_b_c = im_before.crop(crop_before)
    im_a_c = im_after.crop(crop_after)

    target_w = 720
    h_b = int(im_b_c.height * (target_w / im_b_c.width))
    h_a = int(im_a_c.height * (target_w / im_a_c.width))
    target_h = max(h_b, h_a)

    im_b_res = im_b_c.resize((target_w, target_h), Image.Resampling.LANCZOS)
    im_a_res = im_a_c.resize((target_w, target_h), Image.Resampling.LANCZOS)

    header_h = 100
    banner_h = 45
    pad = 30
    total_w = (target_w * 2) + (pad * 3)
    total_h = header_h + banner_h + target_h + pad + 20

    canvas = Image.new("RGBA", (total_w, total_h), (245, 246, 248, 255))
    draw = ImageDraw.Draw(canvas)

    # Header Bar
    draw.rectangle([(0, 0), (total_w, header_h)], fill=(20, 24, 33, 255))
    f_title = get_font(24, bold=True)
    f_sub = get_font(14, bold=False)
    draw.text((pad, 22), "DEVELOPER FIX VERIFICATION: SEARCH BY ZIP CODE LABEL & NAME SEARCH", font=f_title, fill=(255, 255, 255, 255))
    draw.text((pad, 62), "GlobeWest Senior QA Verification | Task #41794539 Store Locator Retest", font=f_sub, fill=(180, 190, 205, 255))

    # Before Column (Red)
    x1 = pad
    y1 = header_h + 15
    col1_color = (210, 40, 40, 255)
    draw.rectangle([(x1, y1), (x1 + target_w, y1 + banner_h)], fill=col1_color)
    f_label = get_font(14, bold=True)
    draw.text((x1 + 15, y1 + 12), "🔴 PREVIOUS DEFECT: Labeled 'SEARCH BY POSTCODE' (Australian Terminology)", font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im_b_res, (x1, y1 + banner_h))
    draw.rectangle([(x1, y1 + banner_h), (x1 + target_w, y1 + banner_h + target_h)], outline=col1_color, width=4)

    # After Column (Green)
    x2 = x1 + target_w + pad
    col2_color = (0, 150, 70, 255)
    draw.rectangle([(x2, y1), (x2 + target_w, y1 + banner_h)], fill=col2_color)
    draw.text((x2 + 15, y1 + 12), "🟢 VERIFIED FIXED: 'SEARCH BY ZIP CODE' + Search by Name 'Los Angeles' Works", font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im_a_res, (x2, y1 + banner_h))
    draw.rectangle([(x2, y1 + banner_h), (x2 + target_w, y1 + banner_h + target_h)], outline=col2_color, width=4)

    out_file = os.path.join(OUT_DIR, "VERIFIED_ZIPCODE_LABEL_AND_NAME_SEARCH.png")
    canvas.convert("RGB").save(out_file, quality=95)
    print(f"✅ Generated: {out_file}")

create_verification_comparison()
