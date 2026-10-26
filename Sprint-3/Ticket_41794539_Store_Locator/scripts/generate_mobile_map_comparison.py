import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794539_Store_Locator"
OUT_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(OUT_DIR, exist_ok=True)

AU_IMG = os.path.join(BASE_DIR, "screenshots/mobile_map_comparison/AU_MOBILE_MAP_VIEWPORT.png")
US_IMG = os.path.join(BASE_DIR, "screenshots/mobile_pure_comparison/04_US_MOBILE_MAP_VIEWPORT.png")

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

def render_comparison(im_au, im_us, out_file, title, subtitle, label_au, label_us, is_pass_au=True, is_pass_us=True):
    target_h = 1050
    w_au = int(im_au.width * (target_h / im_au.height))
    w_us = int(im_us.width * (target_h / im_us.height))
    im_au_res = im_au.resize((w_au, target_h), Image.Resampling.LANCZOS)
    im_us_res = im_us.resize((w_us, target_h), Image.Resampling.LANCZOS)

    header_h = 100
    banner_h = 45
    pad = 30
    total_w = w_au + w_us + (pad * 3)
    total_h = header_h + banner_h + target_h + pad + 20

    canvas = Image.new("RGBA", (total_w, total_h), (245, 246, 248, 255))
    draw = ImageDraw.Draw(canvas)

    # Header Bar
    draw.rectangle([(0, 0), (total_w, header_h)], fill=(20, 24, 33, 255))
    f_title = get_font(24, bold=True)
    f_sub = get_font(14, bold=False)
    draw.text((pad, 22), title, font=f_title, fill=(255, 255, 255, 255))
    draw.text((pad, 62), subtitle, font=f_sub, fill=(180, 190, 205, 255))

    # Column 1: AU Baseline
    x1 = pad
    y1 = header_h + 15
    col1_color = (0, 150, 70, 255) if is_pass_au else (210, 40, 40, 255)
    draw.rectangle([(x1, y1), (x1 + w_au, y1 + banner_h)], fill=col1_color)
    f_label = get_font(15, bold=True)
    draw.text((x1 + 15, y1 + 12), label_au, font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im_au_res, (x1, y1 + banner_h))
    draw.rectangle([(x1, y1 + banner_h), (x1 + w_au, y1 + banner_h + target_h)], outline=col1_color, width=4)

    # Column 2: US Staging
    x2 = x1 + w_au + pad
    col2_color = (0, 150, 70, 255) if is_pass_us else (210, 40, 40, 255)
    draw.rectangle([(x2, y1), (x2 + w_us, y1 + banner_h)], fill=col2_color)
    draw.text((x2 + 15, y1 + 12), label_us, font=f_label, fill=(255, 255, 255, 255))
    canvas.paste(im_us_res, (x2, y1 + banner_h))
    draw.rectangle([(x2, y1 + banner_h), (x2 + w_us, y1 + banner_h + target_h)], outline=col2_color, width=4)

    canvas.convert("RGB").save(out_file, quality=95)
    print(f"✅ Generated: {out_file}")

# 1. Focused Map & Search Inputs (Aligned from y=420)
im_au_raw = Image.open(AU_IMG).convert("RGBA")
im_us_raw = Image.open(US_IMG).convert("RGBA")

crop_box = (0, 420, 780, 1688)
im_au_crop = im_au_raw.crop(crop_box)
im_us_crop = im_us_raw.crop(crop_box)

render_comparison(
    im_au=im_au_crop,
    im_us=im_us_crop,
    out_file=os.path.join(OUT_DIR, "COMPARISON_04_MOBILE_MAP_AU_VS_US.png"),
    title="GOOGLE MAP INITIALIZATION & CENTER: AU VS US (MOBILE VIEW)",
    subtitle="GlobeWest Senior QA Audit | iPhone Mobile Viewport (390×844) Visual Fidelity",
    label_au="🟢 AU BASELINE: Centered on Australia (Postcode: Eg. 3000)",
    label_us="🟢 US STAGING: Centered on USA (ZIP Code: Eg. 90210)",
    is_pass_au=True,
    is_pass_us=True
)

# 2. Full Device Viewport (From y=0 to y=1688)
render_comparison(
    im_au=im_au_raw,
    im_us=im_us_raw,
    out_file=os.path.join(OUT_DIR, "COMPARISON_05_MOBILE_VIEWPORT_AU_VS_US.png"),
    title="STORE LOCATOR MOBILE VIEWPORT: AU BASELINE VS US STAGING",
    subtitle="GlobeWest Senior QA Audit | Complete iPhone 390×844 Screen Comparison",
    label_au="🟢 AU BASELINE: Australia Map & Postcode Search",
    label_us="🟢 US STAGING: USA Map Centering Verified",
    is_pass_au=True,
    is_pass_us=True
)
