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

def create_show_filters_spotlight():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)'
    figma_crop_path = os.path.join(base_dir, 'scratch/figma_filter_bar_crop_clean.png')
    live_crop_path = os.path.join(base_dir, 'scratch/live_filter_bar_crop.png')
    out_path = os.path.join(base_dir, 'PLP page/screenshots/regression_run/SHOW_FILTERS_FIGMA_VS_LIVE_EXACT_LOCATION.png')

    figma_im = Image.open(figma_crop_path).convert('RGB')
    live_im = Image.open(live_crop_path).convert('RGB')

    target_w = 1350
    fh = int(figma_im.size[1] * (target_w / float(figma_im.size[0])))
    lh = int(live_im.size[1] * (target_w / float(live_im.size[0])))

    f_resized = figma_im.resize((target_w, fh), Image.Resampling.LANCZOS)
    l_resized = live_im.resize((target_w, lh), Image.Resampling.LANCZOS)

    canvas_w = target_w + 100
    canvas_h = fh + lh + 260

    canvas = Image.new('RGB', (canvas_w, canvas_h), (20, 20, 22))
    draw = ImageDraw.Draw(canvas)

    title_font = get_font(20, bold=True)
    label_font = get_font(15, bold=True)
    body_font = get_font(13, bold=False)

    draw.text((50, 20), "FIGMA VS. LIVE: EXACT LOCATION OF 'SHOW FILTERS' TOGGLE", fill=(255, 255, 255), font=title_font)

    # 1. FIGMA SPEC (TOP)
    draw.text((50, 60), "1. FIGMA APPROVED DESIGN (EXPECTED): 'Show Filters' is pinned before the filter pills", fill=(16, 185, 129), font=label_font)
    canvas.paste(f_resized, (50, 85))
    draw.rectangle([46, 81, 50 + target_w + 4, 85 + fh + 4], outline=(16, 185, 129), width=3)

    # Highlight "Show Filters" in Figma with green box
    # Scaled x bounds: in clean crop x was 0 to 145 out of 1238 -> in 1350, 0 to 160
    draw.rectangle([60, 115, 220, 85 + fh - 20], outline=(16, 185, 129), width=3)
    draw.text((60, 85 + fh + 8), "^ 'Show Filters' button present here in Figma (pinned to left)", fill=(16, 185, 129), font=body_font)

    # 2. LIVE STAGING (BOTTOM)
    y_live = 85 + fh + 45
    draw.text((50, y_live), "2. LIVE US STAGING STOREFRONT (ACTUAL): Missing 'Show Filters'; starts directly with 'Brand'", fill=(239, 68, 68), font=label_font)
    canvas.paste(l_resized, (50, y_live + 25))
    draw.rectangle([46, y_live + 21, 50 + target_w + 4, y_live + 25 + lh + 4], outline=(239, 68, 68), width=3)

    # Highlight the missing spot before 'Brand' with red box
    # In live crop, brand starts at x=202 out of 1778 -> in 1350, x=155. So x=50 to 195
    draw.rectangle([60, y_live + 33, 195, y_live + 25 + lh - 12], outline=(239, 68, 68), width=3)
    draw.text((60, y_live + 25 + lh + 8), "^ MISSING ON LIVE: Empty space before 'Brand'; no 'Show Filters' button", fill=(239, 68, 68), font=body_font)

    # Summary Note
    note = "Visual Difference: Figma Mock (Node 2316-12739) shows 'Show Filters' on the left edge. Live Staging begins directly with the filter pills."
    draw.text((50, canvas_h - 35), note, fill=(180, 180, 180), font=body_font)

    canvas.save(out_path, quality=95)
    print(f"✅ Created spotlight image: {out_path}")

if __name__ == '__main__':
    create_show_filters_spotlight()
