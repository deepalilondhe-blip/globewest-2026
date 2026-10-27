import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=True):
    try:
        font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
        if not os.path.exists(font_path):
            font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def create_comparison():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page'
    live_img_path = os.path.join(base_dir, 'screenshots/regression_run/03_LOGGED_IN_TRADE_MODE_PLP.png')
    figma_img_path = os.path.join(base_dir, 'screenshots/figma_comparison/FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png')
    out_path = os.path.join(base_dir, 'screenshots/regression_run/COMPARISON_PLP_AUTHENTICATED_FIGMA_VS_LIVE.png')

    if not os.path.exists(live_img_path) or not os.path.exists(figma_img_path):
        print(f"Missing images: live={os.path.exists(live_img_path)}, figma={os.path.exists(figma_img_path)}")
        return

    live_im = Image.open(live_img_path).convert('RGB')
    figma_im = Image.open(figma_img_path).convert('RGB')

    # Crop to focus on the toolbar and product card top area
    # Live is 1440x900 or similar
    lw, lh = live_im.size
    fw, fh = figma_im.size

    card_live_h = min(lh, 780)
    card_figma_h = min(fh, 780)

    target_w = 900
    target_h = 580

    live_cropped = live_im.crop((0, 0, lw, card_live_h)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    figma_cropped = figma_im.crop((0, 0, fw, card_figma_h)).resize((target_w, target_h), Image.Resampling.LANCZOS)

    canvas_w = (target_w * 2) + 80
    canvas_h = target_h + 170

    canvas = Image.new('RGB', (canvas_w, canvas_h), (18, 18, 18))
    draw = ImageDraw.Draw(canvas)

    title_font = get_font(22, bold=True)
    header_font = get_font(16, bold=True)
    sub_font = get_font(13, bold=False)

    draw.text((40, 24), "GLOBEWEST PLP REGRESSION: AUTHENTICATED TRADE SESSION VS. FIGMA SPECIFICATION", fill=(255, 255, 255), font=title_font)

    # Left: US Live (Red Border)
    draw.text((40, 70), "US STAGING STOREFRONT — AUTHENTICATED TRADE MODE (LIVE ACTUAL)", fill=(239, 68, 68), font=header_font)
    canvas.paste(live_cropped, (40, 100))
    draw.rectangle([36, 96, 40 + target_w + 4, 100 + target_h + 4], outline=(239, 68, 68), width=4)

    # Right: Figma Spec (Green Border)
    right_x = 40 + target_w + 40
    draw.text((right_x, 70), "FIGMA APPROVED DESIGN — NODE 2316-12739 (EXPECTED SPEC)", fill=(16, 185, 129), font=header_font)
    canvas.paste(figma_cropped, (right_x, 100))
    draw.rectangle([right_x - 4, 96, right_x + target_w + 4, 100 + target_h + 4], outline=(16, 185, 129), width=4)

    # Bottom notes
    summary_text = "Verified: Header Pricing Toggle (Trade/MSRP) works • Badges placed below photo • Dual pricing & stock ETA render • Defects: Missing 'Show Filters' button, missing Wishlist Heart (♡) on cards, & NetSuite placeholder imagery."
    draw.text((40, canvas_h - 45), summary_text, fill=(200, 200, 200), font=sub_font)

    canvas.save(out_path, quality=95)
    print(f"✅ Generated: {out_path}")

if __name__ == '__main__':
    create_comparison()
