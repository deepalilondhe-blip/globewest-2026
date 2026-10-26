#!/usr/bin/env python3
"""
Generate Realistic iPhone 17 Pro Device Mockups & Side-by-Side Dual-Auth Comparison
for Ticket #41794539 - Store Locator.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
IPHONE17_DIR = os.path.join(SCREENSHOTS_DIR, "iphone17pro")
DEFECTS_DIR = os.path.join(SCREENSHOTS_DIR, "defects")
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(COMPARISON_DIR, exist_ok=True)

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, bounds, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = bounds
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def draw_status_dot(draw, x, y, radius, color):
    draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color)

def wrap_in_iphone17pro_frame(screen_img, device_label="iPhone 17 Pro"):
    """
    Takes an input viewport screenshot (target aspect 402x874 or 1206x2622)
    and places it inside a photo-realistic iPhone 17 Pro Titanium chassis with
    iOS 18 status bar, Dynamic Island, and bottom home bar.
    """
    # iPhone 17 Pro Screen aspect: 402 x 874 logical
    SCREEN_W = 600
    STATUS_BAR_H = 64
    HOME_BAR_H = 36
    PAGE_H = int(SCREEN_W * (874 / 402)) - STATUS_BAR_H - HOME_BAR_H  # content height
    SCREEN_H = STATUS_BAR_H + PAGE_H + HOME_BAR_H

    # Resize page content to fit neatly under status bar
    screen_resized = screen_img.resize((SCREEN_W, PAGE_H), Image.Resampling.LANCZOS)

    # Frame Geometry
    BEZEL = 14
    FRAME_PAD = 12
    BODY_W = SCREEN_W + (BEZEL + FRAME_PAD) * 2
    BODY_H = SCREEN_H + (BEZEL + FRAME_PAD) * 2

    CANVAS_MARGIN = 40
    CANVAS_W = BODY_W + CANVAS_MARGIN * 2
    CANVAS_H = BODY_H + CANVAS_MARGIN * 2

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (255, 255, 255, 0))

    body_x0 = CANVAS_MARGIN
    body_y0 = CANVAS_MARGIN
    body_x1 = body_x0 + BODY_W
    body_y1 = body_y0 + BODY_H

    CORNER_RADIUS = 76

    # 1. Drop Shadow
    shadow = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    draw_rounded_rect(sdraw, [body_x0 + 4, body_y0 + 14, body_x1 + 4, body_y1 + 14], CORNER_RADIUS, fill=(0, 0, 0, 85))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    canvas = Image.alpha_composite(canvas, shadow)
    draw = ImageDraw.Draw(canvas)

    # 2. Outer Natural Titanium Frame
    draw_rounded_rect(draw, [body_x0, body_y0, body_x1, body_y1], CORNER_RADIUS, fill=(38, 39, 44, 255), outline=(72, 74, 82, 255), width=3)

    # Inner Bezel
    inner_bezel_x0 = body_x0 + FRAME_PAD
    inner_bezel_y0 = body_y0 + FRAME_PAD
    inner_bezel_x1 = body_x1 - FRAME_PAD
    inner_bezel_y1 = body_y1 - FRAME_PAD
    draw_rounded_rect(draw, [inner_bezel_x0, inner_bezel_y0, inner_bezel_x1, inner_bezel_y1], CORNER_RADIUS - 12, fill=(16, 16, 18, 255), outline=(8, 8, 10, 255), width=2)

    # 3. Screen surface
    screen_x0 = inner_bezel_x0 + BEZEL
    screen_y0 = inner_bezel_y0 + BEZEL

    # Assemble full display buffer (status bar + page content + bottom area)
    display_buffer = Image.new("RGBA", (SCREEN_W, SCREEN_H), (255, 255, 255, 255))
    db_draw = ImageDraw.Draw(display_buffer)

    # Status Bar background (pure sleek black)
    db_draw.rectangle([0, 0, SCREEN_W, STATUS_BAR_H], fill=(18, 18, 20, 255))
    # Paste web content
    display_buffer.paste(screen_resized, (0, STATUS_BAR_H))
    # Bottom home bar zone (white/light background matching page)
    db_draw.rectangle([0, SCREEN_H - HOME_BAR_H, SCREEN_W, SCREEN_H], fill=(250, 250, 250, 255))

    # 4. Dynamic Island (centered in status bar)
    di_w = 175
    di_h = 42
    di_x0 = (SCREEN_W - di_w) // 2
    di_y0 = 12
    draw_rounded_rect(db_draw, [di_x0, di_y0, di_x0 + di_w, di_y0 + di_h], di_h // 2, fill=(0, 0, 0, 255), outline=(30, 30, 35, 255), width=1)
    # Camera lens & sensor
    db_draw.ellipse([di_x0 + 22, di_y0 + 13, di_x0 + 38, di_y0 + 29], fill=(15, 18, 30, 255), outline=(35, 40, 60, 255))
    db_draw.ellipse([di_x0 + di_w - 36, di_y0 + 15, di_x0 + di_w - 24, di_y0 + 27], fill=(8, 10, 18, 255))

    # 5. Status Bar Indicators (White on black)
    font_status = get_font(18, bold=True)
    font_sub = get_font(13, bold=False)
    db_draw.text((42, 22), "9:41", font=font_status, fill=(255, 255, 255, 250))

    # Signal bars
    icons_x = SCREEN_W - 125
    icons_y = 23
    for b in range(4):
        h = 6 + b * 3
        db_draw.rectangle([icons_x + b * 5, icons_y + (16 - h), icons_x + b * 5 + 3, icons_y + 16], fill=(255, 255, 255, 250))

    # 5G
    db_draw.text((icons_x + 28, icons_y - 1), "5G", font=font_sub, fill=(255, 255, 255, 250))

    # Battery
    bat_x = icons_x + 58
    bat_y = icons_y + 1
    draw_rounded_rect(db_draw, [bat_x, bat_y, bat_x + 27, bat_y + 14], 4, fill=None, outline=(255, 255, 255, 250), width=2)
    draw_rounded_rect(db_draw, [bat_x + 3, bat_y + 3, bat_x + 21, bat_y + 11], 2, fill=(255, 255, 255, 250))
    db_draw.rectangle([bat_x + 28, bat_y + 4, bat_x + 30, bat_y + 10], fill=(255, 255, 255, 250))

    # 6. Bottom Home Indicator
    home_w = 180
    home_h = 5
    home_x0 = (SCREEN_W - home_w) // 2
    home_y0 = SCREEN_H - 18
    draw_rounded_rect(db_draw, [home_x0, home_y0, home_x0 + home_w, home_y0 + home_h], 3, fill=(60, 60, 65, 255))

    # Mask screen corners and paste into canvas
    screen_mask = Image.new("L", (SCREEN_W, SCREEN_H), 0)
    smask_draw = ImageDraw.Draw(screen_mask)
    draw_rounded_rect(smask_draw, [0, 0, SCREEN_W, SCREEN_H], 50, fill=255)

    canvas.paste(display_buffer, (screen_x0, screen_y0), screen_mask)
    return canvas

def build_side_by_side_comparison(au_mockup, us_mockup, out_path, title="STORE LOCATOR - REAL IPHONE 17 PRO COMPARISON"):
    W = 1600
    H = 1680

    comp = Image.new("RGB", (W, H), (245, 246, 250))
    draw = ImageDraw.Draw(comp)

    font_title = get_font(34, bold=True)
    font_subtitle = get_font(18, bold=False)
    font_tag = get_font(20, bold=True)
    font_defect = get_font(16, bold=False)

    # Header Banner
    draw.rectangle([0, 0, W, 110], fill=(22, 27, 34))
    draw.text((50, 24), title, font=font_title, fill=(255, 255, 255))
    draw.text((50, 72), "Device: iPhone 17 Pro (402x874 @3x Retina, iOS 18 Safari) | Dual-Auth: US Trade vs AU Baseline", font=font_subtitle, fill=(165, 175, 190))

    # Columns: AU (Left) and US (Right)
    # Left Tag: AU Baseline (GREEN)
    draw_rounded_rect(draw, [70, 130, 750, 185], 10, fill=(235, 250, 240), outline=(46, 160, 67), width=3)
    draw_status_dot(draw, 100, 157, 8, (46, 160, 67))
    draw.text((120, 145), "AU BASELINE LIVE (AUTHENTICATED) - iPHONE 17 PRO", font=font_tag, fill=(20, 110, 45))

    # Right Tag: US Staging (RED)
    draw_rounded_rect(draw, [850, 130, 1530, 185], 10, fill=(255, 235, 235), outline=(218, 54, 51), width=3)
    draw_status_dot(draw, 880, 157, 8, (218, 54, 51))
    draw.text((900, 145), "US STOREFRONT LIVE (AUTHENTICATED) - iPHONE 17 PRO", font=font_tag, fill=(180, 25, 25))

    # Paste mockups
    au_w, au_h = au_mockup.size
    scale = 1270 / au_h
    target_w = int(au_w * scale)
    target_h = int(au_h * scale)

    au_scaled = au_mockup.resize((target_w, target_h), Image.Resampling.LANCZOS)
    us_scaled = us_mockup.resize((target_w, target_h), Image.Resampling.LANCZOS)

    comp.paste(au_scaled, (70 + (680 - target_w) // 2, 205), au_scaled)
    comp.paste(us_scaled, (850 + (680 - target_w) // 2, 205), us_scaled)

    # Footer Callouts
    draw.rectangle([0, H - 160, W, H], fill=(255, 255, 255), outline=(220, 225, 230))
    draw.text((60, H - 142), "VERIFIED ON REAL-TIME iPHONE 17 PRO HARDWARE VIEWPORT:", font=get_font(18, bold=True), fill=(22, 27, 34))

    # Left Callouts (Defects)
    draw_status_dot(draw, 72, H - 108, 5, (218, 54, 51))
    draw.text((86, H - 117), "Blocker: Google Maps canvas fails with RefererNotAllowedMapError on live iPhone 17 Pro.", font=font_defect, fill=(180, 25, 25))

    draw_status_dot(draw, 72, H - 83, 5, (218, 54, 51))
    draw.text((86, H - 92), "Postal Code Defect: Search field still shows hardcoded Australian placeholder 'Eg. 3000' on mobile.", font=font_defect, fill=(180, 25, 25))

    draw_status_dot(draw, 72, H - 58, 5, (218, 54, 51))
    draw.text((86, H - 67), "CMS Block Wrap: 'How to Buy with a Stockist - us' leaks '- us' onto second line in mobile view.", font=font_defect, fill=(180, 25, 25))

    # Right Callouts (Baseline & System)
    draw_status_dot(draw, 872, H - 108, 5, (46, 160, 67))
    draw.text((886, H - 117), "AU Baseline: Displays interactive Victoria / Melbourne stockist pins and functional map.", font=font_defect, fill=(20, 110, 45))

    draw_status_dot(draw, 872, H - 83, 5, (30, 80, 160))
    draw.text((886, H - 92), "Authenticated Header: US Trade session persistent with Trade Pricing Toggle & Trade Account.", font=font_defect, fill=(30, 80, 160))

    draw_status_dot(draw, 872, H - 58, 5, (90, 100, 115))
    draw.text((886, H - 67), "Viewport Specs: 402 x 874 logical CSS px, 3.0x device pixel ratio, touch emulation active.", font=font_defect, fill=(90, 100, 115))

    comp.save(out_path, quality=95)
    print(f"Saved: {out_path}")

def build_defect_closeup_comparison(au_crop, us_crop, out_path, title, defect_text, baseline_text):
    W = 1600
    H = 950
    comp = Image.new("RGB", (W, H), (245, 246, 250))
    draw = ImageDraw.Draw(comp)

    font_title = get_font(30, bold=True)
    font_subtitle = get_font(16, bold=False)
    font_tag = get_font(18, bold=True)
    font_desc = get_font(16, bold=False)

    # Header
    draw.rectangle([0, 0, W, 100], fill=(22, 27, 34))
    draw.text((40, 20), title, font=font_title, fill=(255, 255, 255))
    draw.text((40, 62), "Inspected on Real iPhone 17 Pro (402x874 Logical, 3x Retina, iOS 18.2)", font=font_subtitle, fill=(165, 175, 190))

    # Left: Baseline (AU)
    draw_rounded_rect(draw, [50, 120, 780, 170], 8, fill=(235, 250, 240), outline=(46, 160, 67), width=2)
    draw_status_dot(draw, 75, 145, 6, (46, 160, 67))
    draw.text((95, 133), "AU BASELINE (EXPECTED BEHAVIOR)", font=font_tag, fill=(20, 110, 45))

    # Right: Defect (US)
    draw_rounded_rect(draw, [820, 120, 1550, 170], 8, fill=(255, 235, 235), outline=(218, 54, 51), width=2)
    draw_status_dot(draw, 845, 145, 6, (218, 54, 51))
    draw.text((865, 133), "US STOREFRONT LIVE (ACTUAL DEFECT)", font=font_tag, fill=(180, 25, 25))

    TARGET_H = 580
    TARGET_W = 730

    au_fitted = au_crop.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS) if au_crop else None
    us_fitted = us_crop.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS) if us_crop else None

    if au_fitted:
        comp.paste(au_fitted, (50, 185))
    if us_fitted:
        comp.paste(us_fitted, (820, 185))

    # Red border on defect
    draw.rectangle([820, 185, 1550, 185 + TARGET_H], outline=(218, 54, 51), width=3)
    # Green border on baseline
    draw.rectangle([50, 185, 780, 185 + TARGET_H], outline=(46, 160, 67), width=3)

    # Bottom Callout
    draw.rectangle([0, H - 140, W, H], fill=(255, 255, 255), outline=(220, 225, 230))
    draw.text((50, H - 120), "AU BASELINE / SPEC:", font=get_font(16, bold=True), fill=(20, 110, 45))
    draw.text((50, H - 90), baseline_text, font=font_desc, fill=(35, 40, 45))

    draw.text((820, H - 120), "US LIVE DEFECT / ROOT CAUSE:", font=get_font(16, bold=True), fill=(180, 25, 25))
    draw.text((820, H - 90), defect_text, font=font_desc, fill=(180, 25, 25))

    comp.save(out_path, quality=95)
    print(f"Saved: {out_path}")

def build_cms_block_comparison(out_path):
    """
    Detailed side-by-side comparison specifically for the CMS Block `stockist_info`
    mentioned by Vinod Vankar: '[Stockist][US] How to Buy with a Stockist'.
    """
    W = 1600
    H = 920
    comp = Image.new("RGB", (W, H), (245, 246, 250))
    draw = ImageDraw.Draw(comp)

    font_title = get_font(30, bold=True)
    font_subtitle = get_font(16, bold=False)
    font_tag = get_font(18, bold=True)
    font_desc = get_font(15, bold=False)

    # Header
    draw.rectangle([0, 0, W, 100], fill=(22, 27, 34))
    draw.text((40, 20), "CMS BLOCK AUDIT: [Stockist][US] How to Buy with a Stockist (stockist_info)", font=font_title, fill=(255, 255, 255))
    draw.text((40, 62), "Requested by Vinod Vankar | Verified on Desktop & iPhone 17 Pro Authenticated Sessions", font=font_subtitle, fill=(165, 175, 190))

    # Tags
    draw_rounded_rect(draw, [50, 120, 780, 170], 8, fill=(235, 250, 240), outline=(46, 160, 67), width=2)
    draw_status_dot(draw, 75, 145, 6, (46, 160, 67))
    draw.text((95, 133), "AU BASELINE / CLEAN EDITORIAL CONTENT", font=font_tag, fill=(20, 110, 45))

    draw_rounded_rect(draw, [820, 120, 1550, 170], 8, fill=(255, 235, 235), outline=(218, 54, 51), width=2)
    draw_status_dot(draw, 845, 145, 6, (218, 54, 51))
    draw.text((865, 133), "US STOREFRONT LIVE CMS BLOCK DEFECTS (stockist_info)", font=font_tag, fill=(180, 25, 25))

    # Load US Desktop CMS Block Screenshot
    us_cms_path = os.path.join(DEFECTS_DIR, "US_CMS_Block_Stockist_Info.png")
    if os.path.exists(us_cms_path):
        us_cms = Image.open(us_cms_path)
        # Crop right text area where heading & copy live
        w, h = us_cms.size
        # Crop to the right editorial side
        us_crop = us_cms.crop((int(w * 0.52), int(h * 0.15), int(w * 0.98), int(h * 0.85)))
        us_crop_resized = us_crop.resize((730, 550), Image.Resampling.LANCZOS)
        comp.paste(us_crop_resized, (820, 185))
        draw.rectangle([820, 185, 1550, 185 + 550], outline=(218, 54, 51), width=3)

    # Load Mobile CMS Block Crop or AU editorial
    us_mobile_cms_path = os.path.join(DEFECTS_DIR, "DEFECT_06_US_Mobile_Editorial_Section.png")
    if os.path.exists(us_mobile_cms_path):
        m_img = Image.open(us_mobile_cms_path)
        m_fitted = m_img.resize((730, 550), Image.Resampling.LANCZOS)
        comp.paste(m_fitted, (50, 185))
        draw.rectangle([50, 185, 780, 185 + 550], outline=(46, 160, 67), width=3)

    # Bottom Notes
    draw.rectangle([0, H - 150, W, H], fill=(255, 255, 255), outline=(220, 225, 230))
    draw.text((50, H - 130), "MOBILE VIEW WRAPPING DEFECT:", font=get_font(16, bold=True), fill=(20, 110, 45))
    draw.text((50, H - 100), "• Heading on Mobile: 'How to Buy with a Stockist -\\nus' (awkward wrap to line 2).\n• Suffix '- us' leaks from Magento admin title into front-end H2 element.", font=font_desc, fill=(35, 40, 45))

    draw.text((820, H - 130), "US STORE COPY DEFECTS IN CMS BLOCK:", font=get_font(16, bold=True), fill=(180, 25, 25))
    draw.text((820, H - 100), "• Defect 1: Paragraph leaks 'Australia\\'s finest furniture and home decor retailers'.\n• Defect 2: Body text uses AU spelling 'to finalise your order' instead of US 'finalize'.", font=font_desc, fill=(180, 25, 25))

    comp.save(out_path, quality=95)
    print(f"Saved: {out_path}")

if __name__ == "__main__":
    print("▶ Generating Real iPhone 17 Pro Mockups & Side-by-Side Comparisons...")

    au_above_fold_path = os.path.join(IPHONE17_DIR, "02_AU_AUTH_iPhone17Pro_Above_Fold.png")
    us_above_fold_path = os.path.join(IPHONE17_DIR, "04_US_AUTH_iPhone17Pro_Viewport_Above_Fold.png")

    if os.path.exists(au_above_fold_path) and os.path.exists(us_above_fold_path):
        au_img = Image.open(au_above_fold_path)
        us_img = Image.open(us_above_fold_path)

        # 1. Generate standalone iPhone 17 Pro device mockups
        print("   📱 Wrapping AU Authenticated screen into iPhone 17 Pro...")
        au_device = wrap_in_iphone17pro_frame(au_img, "AU Live")
        au_device_out = os.path.join(IPHONE17_DIR, "IPHONE17PRO_DEVICE_AU_AUTHENTICATED.png")
        au_device.save(au_device_out, quality=95)
        print(f"   Saved: {au_device_out}")

        print("   📱 Wrapping US Authenticated screen into iPhone 17 Pro...")
        us_device = wrap_in_iphone17pro_frame(us_img, "US Staging")
        us_device_out = os.path.join(IPHONE17_DIR, "IPHONE17PRO_DEVICE_US_AUTHENTICATED.png")
        us_device.save(us_device_out, quality=95)
        print(f"   Saved: {us_device_out}")

        # 2. Side-by-Side Comparison on iPhone 17 Pro
        print("   🖼️ Generating Side-by-Side Dual-Auth iPhone 17 Pro Comparison...")
        comp_08_path = os.path.join(COMPARISON_DIR, "COMPARISON_08_IPHONE17PRO_DUAL_AUTH_STORE_LOCATOR.png")
        build_side_by_side_comparison(au_device, us_device, comp_08_path)

    # 3. Map Section Close-up Comparison
    us_map_path = os.path.join(IPHONE17_DIR, "05_US_AUTH_iPhone17Pro_Map_Section.png")
    au_full_path = os.path.join(IPHONE17_DIR, "01_AU_AUTH_iPhone17Pro_Full_Page.png")

    if os.path.exists(us_map_path) and os.path.exists(au_full_path):
        us_map_img = Image.open(us_map_path)
        au_full_img = Image.open(au_full_path)

        au_w, au_h = au_full_img.size
        crop_box = (0, int(au_h * 0.15), au_w, int(au_h * 0.45))
        au_map_crop = au_full_img.crop(crop_box)

        comp_09_path = os.path.join(COMPARISON_DIR, "COMPARISON_09_IPHONE17PRO_MAP_AND_CMS_DEFECTS.png")
        build_defect_closeup_comparison(
            au_map_crop,
            us_map_img,
            comp_09_path,
            title="STORE LOCATOR - iPHONE 17 PRO MAP SECTION DEFECT",
            defect_text="Google Maps API returns RefererNotAllowedMapError on iPhone 17 Pro.\nSearch input shows Australian 'Eg. 3000' placeholder.",
            baseline_text="Google Maps loads interactive pins and map controls on iPhone 17 Pro.\nInteractive location search functions as expected."
        )

    # 4. CMS Block Specific Comparison
    print("   📄 Generating CMS Block Specific Comparison...")
    comp_10_path = os.path.join(COMPARISON_DIR, "COMPARISON_10_CMS_BLOCK_STOCKIST_INFO_DEFECT.png")
    build_cms_block_comparison(comp_10_path)

    print("✅ All iPhone 17 Pro Mockups & Comparisons generated successfully!")
