import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DESKTOP = os.path.join(BASE_DIR, 'screenshots', 'desktop')
SCREENSHOTS_MOBILE = os.path.join(BASE_DIR, 'screenshots', 'mobile')
REAL_DIR = os.path.join(BASE_DIR, 'REAL_COMPARISONS')
os.makedirs(REAL_DIR, exist_ok=True)

# Load neutral font for clean header text only (no colored badges/highlights)
try:
    FONT_LABEL = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
except Exception:
    FONT_LABEL = ImageFont.load_default()

def create_real_side_by_side(
    im_left,
    im_right,
    left_label,
    right_label,
    out_filename,
    scale_width=None
):
    if scale_width:
        w_l, h_l = im_left.size
        h_l_new = int(h_l * (scale_width / w_l))
        im_left = im_left.resize((scale_width, h_l_new), Image.Resampling.LANCZOS)

        w_r, h_r = im_right.size
        h_r_new = int(h_r * (scale_width / w_r))
        im_right = im_right.resize((scale_width, h_r_new), Image.Resampling.LANCZOS)

    w_l, h_l = im_left.size
    w_r, h_r = im_right.size

    content_h = max(h_l, h_r)
    header_h = 45
    gap = 24
    pad = 20

    total_w = pad + w_l + gap + w_r + pad
    total_h = pad + header_h + content_h + pad

    # Clean natural light canvas - NO COLOR HIGHLIGHTS
    canvas = Image.new('RGB', (total_w, total_h), (252, 252, 252))
    draw = ImageDraw.Draw(canvas)

    # Clean neutral labels
    draw.text((pad + 10, pad + 10), left_label, fill=(15, 23, 42), font=FONT_LABEL)
    draw.text((pad + w_l + gap + 10, pad + 10), right_label, fill=(15, 23, 42), font=FONT_LABEL)

    # Subtle 1px neutral separator
    draw.line([(pad, pad + header_h - 10), (pad + w_l, pad + header_h - 10)], fill=(226, 232, 240), width=1)
    draw.line([(pad + w_l + gap, pad + header_h - 10), (total_w - pad, pad + header_h - 10)], fill=(226, 232, 240), width=1)

    # Pure raw browser screenshots
    img_y = pad + header_h
    canvas.paste(im_left, (pad, img_y))
    canvas.paste(im_right, (pad + w_l + gap, img_y))

    # Subtle 1px neutral border (no red, no green)
    draw.rectangle([pad, img_y, pad + w_l, img_y + h_l], outline=(203, 213, 225), width=1)
    draw.rectangle([pad + w_l + gap, img_y, pad + w_l + gap + w_r, img_y + h_r], outline=(203, 213, 225), width=1)

    out_path = os.path.join(REAL_DIR, out_filename)
    canvas.save(out_path, quality=95)
    print(f"Generated: {out_filename}")
    return out_path

def run():
    print("🚀 Generating Pure Real Browser Formats (Zero Highlights / Colors)...")

    # Load Full Page captures
    au_mob_full = Image.open(os.path.join(SCREENSHOTS_MOBILE, '01_AU_AUTH_mobile_about_us_full.png'))
    us_mob_full = Image.open(os.path.join(SCREENSHOTS_MOBILE, '03_US_AUTH_mobile_about_us_full.png'))

    au_desk_full = Image.open(os.path.join(SCREENSHOTS_DESKTOP, '01_AU_AUTH_desktop_about_us_full.png'))
    us_desk_full = Image.open(os.path.join(SCREENSHOTS_DESKTOP, '03_US_AUTH_desktop_about_us_full.png'))

    # Load Viewport captures
    au_mob_vp = Image.open(os.path.join(SCREENSHOTS_MOBILE, '02_AU_AUTH_mobile_about_us_viewport.png'))
    us_mob_vp = Image.open(os.path.join(SCREENSHOTS_MOBILE, '04_US_AUTH_mobile_about_us_viewport.png'))

    au_desk_vp = Image.open(os.path.join(SCREENSHOTS_DESKTOP, '02_AU_AUTH_desktop_about_us_viewport.png'))
    us_desk_vp = Image.open(os.path.join(SCREENSHOTS_DESKTOP, '04_US_AUTH_desktop_about_us_viewport.png'))

    # =========================================================================
    # MOBILE VIEW REAL COMPARISONS (390px)
    # =========================================================================

    # 1. Real Mobile Viewport (Initial View)
    create_real_side_by_side(
        au_mob_vp,
        us_mob_vp,
        "AU Baseline - Mobile Viewport (390x844)",
        "US Staging - Mobile Viewport (390x844)",
        "01_REAL_MOBILE_VIEWPORT.png"
    )

    # 2. Real Mobile Hero & Vision (y=100 to 897)
    create_real_side_by_side(
        au_mob_full.crop((0, 100, 390, 897)),
        us_mob_full.crop((0, 100, 390, 897)),
        "AU Baseline - Hero & Vision (Mobile)",
        "US Staging - Hero & Vision (Mobile)",
        "02_REAL_MOBILE_HERO_AND_VISION.png"
    )

    # 3. Real Mobile Founders & Our Business (y=897 to 1775)
    create_real_side_by_side(
        au_mob_full.crop((0, 897, 390, 1775)),
        us_mob_full.crop((0, 897, 390, 1775)),
        "AU Baseline - Founders & Story (Mobile)",
        "US Staging - Founders & Story (Mobile)",
        "03_REAL_MOBILE_FOUNDERS_AND_BUSINESS.png"
    )

    # 4. Real Mobile Design Diversity (y=1775 to 2515)
    create_real_side_by_side(
        au_mob_full.crop((0, 1775, 390, 2515)),
        us_mob_full.crop((0, 1775, 390, 2515)),
        "AU Baseline - Design Diversity (Mobile)",
        "US Staging - Design Diversity (Mobile)",
        "04_REAL_MOBILE_DESIGN_DIVERSITY.png"
    )

    # 5. Real Mobile Quote & Video (y=2515 to 3169)
    create_real_side_by_side(
        au_mob_full.crop((0, 2515, 390, 3169)),
        us_mob_full.crop((0, 2515, 390, 3169)),
        "AU Baseline - Quote & Brand Video (Mobile)",
        "US Staging - Quote & Brand Video (Mobile)",
        "05_REAL_MOBILE_QUOTE_AND_VIDEO.png"
    )

    # 6. Real Mobile Approach & Team (y=3169 to 4197)
    create_real_side_by_side(
        au_mob_full.crop((0, 3169, 390, 4197)),
        us_mob_full.crop((0, 3169, 390, 4197)),
        "AU Baseline - Approach & Team (Mobile)",
        "US Staging - Approach & Team (Mobile)",
        "06_REAL_MOBILE_APPROACH_AND_TEAM.png"
    )

    # 7. Real Mobile Careers & CTA Buttons (y=4197 to 4525)
    create_real_side_by_side(
        au_mob_full.crop((0, 4197, 390, 4525)),
        us_mob_full.crop((0, 4197, 390, 4525)),
        "AU Baseline - Careers & Buttons (Mobile)",
        "US Staging - Careers & Buttons (Mobile)",
        "07_REAL_MOBILE_CAREERS_AND_BUTTONS.png"
    )

    # =========================================================================
    # DESKTOP VIEW REAL COMPARISONS (1440px)
    # =========================================================================

    # 8. Real Desktop Viewport (1440x900)
    create_real_side_by_side(
        au_desk_vp,
        us_desk_vp,
        "AU Baseline - Desktop Viewport (1440px)",
        "US Staging - Desktop Viewport (1440px)",
        "08_REAL_DESKTOP_VIEWPORT.png",
        scale_width=700
    )

    # 9. Real Desktop Founders & Business (y=765 to 2176)
    create_real_side_by_side(
        au_desk_full.crop((0, 765, 1425, 2176)),
        us_desk_full.crop((0, 766, 1425, 2177)),
        "AU Baseline - Founders & Story (Desktop)",
        "US Staging - Founders & Story (Desktop)",
        "09_REAL_DESKTOP_FOUNDERS_AND_BUSINESS.png",
        scale_width=700
    )

    # 10. Real Desktop Design Diversity (y=2176 to 2871)
    create_real_side_by_side(
        au_desk_full.crop((0, 2176, 1425, 2871)),
        us_desk_full.crop((0, 2177, 1425, 2871)),
        "AU Baseline - Design Diversity (Desktop)",
        "US Staging - Design Diversity (Desktop)",
        "10_REAL_DESKTOP_DESIGN_DIVERSITY.png",
        scale_width=700
    )

    # 11. Real Desktop Quote, Video & Approach (y=2871 to 4500)
    create_real_side_by_side(
        au_desk_full.crop((0, 2871, 1425, 4500)),
        us_desk_full.crop((0, 2871, 1425, 4525)),
        "AU Baseline - Video & Approach (Desktop)",
        "US Staging - Video & Approach (Desktop)",
        "11_REAL_DESKTOP_VIDEO_AND_APPROACH.png",
        scale_width=700
    )

    # 12. Real Desktop Careers & Buttons (y=5187 to 5600)
    create_real_side_by_side(
        au_desk_full.crop((0, 5187, 1425, 5600)),
        us_desk_full.crop((0, 5253, 1425, 5670)),
        "AU Baseline - Careers & Buttons (Desktop)",
        "US Staging - Careers & Buttons (Desktop)",
        "12_REAL_DESKTOP_CAREERS_AND_BUTTONS.png",
        scale_width=700
    )

if __name__ == '__main__':
    run()
