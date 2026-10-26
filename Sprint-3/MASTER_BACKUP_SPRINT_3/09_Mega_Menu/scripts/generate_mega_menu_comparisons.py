import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794534_Mega_Menu'
US_DIR = os.path.join(BASE_DIR, 'screenshots', 'desktop')
AU_DIR = os.path.join(BASE_DIR, 'screenshots', 'au_comparison')
OUT_DIR = os.path.join(BASE_DIR, 'comparison')

os.makedirs(OUT_DIR, exist_ok=True)

RED = (239, 68, 68)      # US Defect (#EF4444)
GREEN = (34, 197, 94)    # AU Baseline (#22C55E)
BG_COLOR = (15, 23, 42)  # Dark slate background (#0F172A)
WHITE = (255, 255, 255)
GRAY = (148, 163, 184)

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_comparison_card(us_img_path, au_img_path, output_filename, title, defect_note=None):
    if not os.path.exists(us_img_path) or not os.path.exists(au_img_path):
        print(f"Missing image file for {output_filename}. Skipping.")
        return

    img_us = Image.open(us_img_path).convert('RGB')
    img_au = Image.open(au_img_path).convert('RGB')

    # Target width per pane
    pane_w = 900
    crop_h = min(img_us.height, img_au.height, 650)

    # Resize keeping aspect ratio
    scale_us = pane_w / img_us.width
    scale_au = pane_w / img_au.width

    h_us = int(img_us.height * scale_us)
    h_au = int(img_au.height * scale_au)

    img_us_resized = img_us.resize((pane_w, h_us), Image.Resampling.LANCZOS)
    img_au_resized = img_au.resize((pane_w, h_au), Image.Resampling.LANCZOS)

    final_h = min(crop_h, h_us, h_au)
    img_us_cropped = img_us_resized.crop((0, 0, pane_w, final_h))
    img_au_cropped = img_au_resized.crop((0, 0, pane_w, final_h))

    # Add colored border
    border_w = 6
    draw_us = ImageDraw.Draw(img_us_cropped)
    draw_au = ImageDraw.Draw(img_au_cropped)

    for i in range(border_w):
        draw_us.rectangle([i, i, pane_w - 1 - i, final_h - 1 - i], outline=RED)
        draw_au.rectangle([i, i, pane_w - 1 - i, final_h - 1 - i], outline=GREEN)

    # Canvas
    header_h = 130
    footer_h = 70 if defect_note else 30
    total_w = (pane_w * 2) + 60
    total_h = header_h + final_h + footer_h + 30

    canvas = Image.new('RGB', (total_w, total_h), BG_COLOR)
    draw = ImageDraw.Draw(canvas)

    # Title
    f_title = get_font(24, bold=True)
    f_sub = get_font(14, bold=False)
    f_badge = get_font(15, bold=True)
    f_note = get_font(14, bold=True)

    draw.text((30, 20), f"TICKET #41794534: {title.upper()}", fill=WHITE, font=f_title)
    draw.text((30, 56), "Target: US Staging (mcstaging2.globewest.com) vs. Baseline: AU Staging (mcstaging2.globewest.com.au)", fill=GRAY, font=f_sub)

    # Pane Labels
    y_badge = 92
    # US Badge
    draw.rectangle([30, y_badge, 30 + 380, y_badge + 30], fill=RED)
    draw.text((45, y_badge + 6), "🔴 US STAGING (mcstaging2.globewest.com)", fill=WHITE, font=f_badge)

    # AU Badge
    x_au_badge = 30 + pane_w + 30
    draw.rectangle([x_au_badge, y_badge, x_au_badge + 420, y_badge + 30], fill=GREEN)
    draw.text((x_au_badge + 15, y_badge + 6), "🟢 AU STAGING BASELINE (mcstaging2.globewest.com.au)", fill=WHITE, font=f_badge)

    # Paste images
    y_img = header_h
    canvas.paste(img_us_cropped, (30, y_img))
    canvas.paste(img_au_cropped, (30 + pane_w + 30, y_img))

    # Defect Note
    if defect_note:
        y_note = y_img + final_h + 15
        draw.rectangle([30, y_note, total_w - 30, y_note + 44], fill=(30, 41, 59))
        draw.rectangle([30, y_note, 38, y_note + 44], fill=RED)
        draw.text((50, y_note + 12), f"⚠️ DEFECT AUDIT NOTE: {defect_note}", fill=(254, 202, 202), font=f_note)

    out_file = os.path.join(OUT_DIR, output_filename)
    canvas.save(out_file, quality=95)
    print(f"✅ Generated: {out_file}")

def main():
    print("🎨 Generating Ticket #41794534 Mega Menu Comparison Images...")

    comparisons = [
        {
            'us': 'us_staging_mega_menu_indoor.png',
            'au': 'au_staging_mega_menu_indoor.png',
            'out': 'DEFECT_1_MEGA_MENU_INDOOR_OUTLET_LEAK.png',
            'title': 'Mega Menu Indoor Category & Australian Outlet Leak',
            'note': 'US Mega Menu Indoor contains "Outlet" linking to https://globewestoutlet.com.au/collections/indoor (AU Leak)'
        },
        {
            'us': 'us_staging_mega_menu_outdoor.png',
            'au': 'au_staging_mega_menu_outdoor.png',
            'out': 'DEFECT_2_MEGA_MENU_OUTDOOR_OUTLET_LEAK.png',
            'title': 'Mega Menu Outdoor Category & Australian Outlet Leak',
            'note': 'US Mega Menu Outdoor contains link to https://globewestoutlet.com.au/collections/outdoor (AU Leak)'
        },
        {
            'us': 'us_staging_mega_menu_homewares.png',
            'au': 'au_staging_mega_menu_homewares.png',
            'out': 'DEFECT_3_MEGA_MENU_HOMEWARES_OUTLET_LEAK.png',
            'title': 'Mega Menu Homewares Category & Australian Outlet Leak',
            'note': 'US Mega Menu Homewares contains "Outlet" linking to https://globewestoutlet.com.au/collections/homewares (AU Leak)'
        },
        {
            'us': 'us_staging_mega_menu_in_stock.png',
            'au': 'au_staging_mega_menu_in_stock.png',
            'out': 'COMPARISON_IN_STOCK_CATEGORY.png',
            'title': 'Mega Menu In Stock Category Parity',
            'note': 'Category column grouping and filter links match AU staging layout.'
        },
        {
            'us': 'us_staging_mega_menu_customisation.png',
            'au': 'au_staging_mega_menu_customisation.png',
            'out': 'COMPARISON_CUSTOMISATION_CATEGORY.png',
            'title': 'Mega Menu Customisation Category Parity',
            'note': 'Customisation submenu layout and link count matches AU staging.'
        },
        {
            'us': 'us_staging_mega_menu_projects.png',
            'au': 'au_staging_mega_menu_projects.png',
            'out': 'COMPARISON_PROJECTS_CATEGORY.png',
            'title': 'Mega Menu Projects Category Parity',
            'note': 'Projects category portfolio links match AU staging structure.'
        },
        {
            'us': 'us_staging_mega_menu_inspiration.png',
            'au': 'au_staging_mega_menu_inspiration.png',
            'out': 'COMPARISON_INSPIRATION_CATEGORY.png',
            'title': 'Mega Menu Inspiration Category Parity',
            'note': 'Inspiration lookbooks and editorial link counts match AU staging.'
        },
        {
            'us': '../individual_desktop/desktop_megamenu_support.png',
            'au': 'au_staging_mega_menu_indoor.png',
            'out': 'DEFECT_4_MEGA_MENU_SUPPORT_AU_LEAK.png',
            'title': 'Mega Menu Support Category & Australian Outlet Leak',
            'note': 'Support menu contains links to https://globewestoutlet.com.au/ and Melbourne Outlet Store'
        }
    ]

    for item in comparisons:
        us_path = os.path.join(US_DIR, item['us'])
        au_path = os.path.join(AU_DIR, item['au'])
        create_comparison_card(us_path, au_path, item['out'], item['title'], item['note'])

if __name__ == '__main__':
    main()
