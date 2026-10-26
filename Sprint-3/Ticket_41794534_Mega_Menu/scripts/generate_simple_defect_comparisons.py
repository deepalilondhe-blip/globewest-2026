import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794534_Mega_Menu'
DESKTOP_PROOFS_DIR = os.path.join(BASE_DIR, 'screenshots', 'defects_clean', 'desktop')
MOBILE_PROOFS_DIR = os.path.join(BASE_DIR, 'screenshots', 'defects_clean', 'mobile')
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

def create_simple_desktop_comparison(us_img_path, au_img_path, output_filename, defect_title, defect_url, link_name):
    if not os.path.exists(us_img_path) or not os.path.exists(au_img_path):
        print(f"Missing file for {output_filename}. Skipping.")
        return

    img_us = Image.open(us_img_path).convert('RGB')
    img_au = Image.open(au_img_path).convert('RGB')

    # Fixed width per pane
    pane_w = 960
    scale_us = pane_w / img_us.width
    scale_au = pane_w / img_au.width

    h_us = int(img_us.height * scale_us)
    h_au = int(img_au.height * scale_au)
    final_h = min(h_us, h_au, 680)

    img_us_resized = img_us.resize((pane_w, h_us), Image.Resampling.LANCZOS).crop((0, 0, pane_w, final_h))
    img_au_resized = img_au.resize((pane_w, h_au), Image.Resampling.LANCZOS).crop((0, 0, pane_w, final_h))

    # Borders
    border_w = 4
    draw_us = ImageDraw.Draw(img_us_resized)
    draw_au = ImageDraw.Draw(img_au_resized)

    for i in range(border_w):
        draw_us.rectangle([i, i, pane_w - 1 - i, final_h - 1 - i], outline=RED)
        draw_au.rectangle([i, i, pane_w - 1 - i, final_h - 1 - i], outline=GREEN)

    header_h = 120
    footer_h = 60
    total_w = (pane_w * 2) + 60
    total_h = header_h + final_h + footer_h + 30

    canvas = Image.new('RGB', (total_w, total_h), BG_COLOR)
    draw = ImageDraw.Draw(canvas)

    f_title = get_font(22, bold=True)
    f_sub = get_font(13, bold=False)
    f_badge = get_font(14, bold=True)
    f_note = get_font(13, bold=True)

    # Header
    draw.text((30, 20), f"DEFECT COMPARISON: {defect_title.upper()}", fill=WHITE, font=f_title)
    draw.text((30, 52), f"Target: mcstaging2.globewest.com (Live Defect) vs Reference: mcstaging2.globewest.com.au (AU Baseline)", fill=GRAY, font=f_sub)

    # Badges
    y_badge = 82
    draw.rectangle([30, y_badge, 30 + 420, y_badge + 28], fill=RED)
    draw.text((45, y_badge + 5), f"🔴 US STAGING: \"{link_name}\" LINKS TO AU OUTLET", fill=WHITE, font=f_badge)

    x_au = 30 + pane_w + 30
    draw.rectangle([x_au, y_badge, x_au + 420, y_badge + 28], fill=GREEN)
    draw.text((x_au + 15, y_badge + 5), f"🟢 AU STAGING BASELINE (Reference)", fill=WHITE, font=f_badge)

    # Paste
    y_img = header_h
    canvas.paste(img_us_resized, (30, y_img))
    canvas.paste(img_au_resized, (x_au, y_img))

    # Footer Defect Note
    y_note = y_img + final_h + 15
    draw.rectangle([30, y_note, total_w - 30, y_note + 40], fill=(30, 41, 59))
    draw.rectangle([30, y_note, 38, y_note + 40], fill=RED)
    draw.text((50, y_note + 11), f"🚨 DEFECT PROOF: Link \"{link_name}\" leaks to Australian store: {defect_url}", fill=(254, 202, 202), font=f_note)

    out_file = os.path.join(OUT_DIR, output_filename)
    canvas.save(out_file, quality=95)
    print(f"✅ Generated: {out_file}")

def create_mobile_proof_card(mobile_img_path, output_filename, title, defect_url, link_name):
    if not os.path.exists(mobile_img_path):
        print(f"Missing mobile file for {output_filename}. Skipping.")
        return

    img_mob = Image.open(mobile_img_path).convert('RGB')
    target_w = 420
    scale = target_w / img_mob.width
    target_h = int(img_mob.height * scale)

    img_resized = img_mob.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Red border
    border_w = 4
    draw_mob = ImageDraw.Draw(img_resized)
    for i in range(border_w):
        draw_mob.rectangle([i, i, target_w - 1 - i, target_h - 1 - i], outline=RED)

    header_h = 100
    footer_h = 60
    total_w = target_w + 60
    total_h = header_h + target_h + footer_h + 30

    canvas = Image.new('RGB', (total_w, total_h), BG_COLOR)
    draw = ImageDraw.Draw(canvas)

    f_title = get_font(18, bold=True)
    f_badge = get_font(13, bold=True)
    f_note = get_font(12, bold=True)

    draw.text((30, 18), f"📱 MOBILE VIEW DEFECT PROOF", fill=WHITE, font=f_title)
    draw.text((30, 46), f"{title}", fill=GRAY, font=get_font(13))

    # Badge
    y_badge = 72
    draw.rectangle([30, y_badge, 30 + 360, y_badge + 24], fill=RED)
    draw.text((40, y_badge + 4), f"🔴 MOBILE DRAWER (390×844): AU LEAK", fill=WHITE, font=f_badge)

    canvas.paste(img_resized, (30, header_h))

    y_note = header_h + target_h + 15
    draw.rectangle([30, y_note, total_w - 30, y_note + 40], fill=(30, 41, 59))
    draw.rectangle([30, y_note, 36, y_note + 40], fill=RED)
    draw.text((45, y_note + 12), f"🚨 {link_name} -> {defect_url}", fill=(254, 202, 202), font=f_note)

    out_file = os.path.join(OUT_DIR, output_filename)
    canvas.save(out_file, quality=95)
    print(f"✅ Generated: {out_file}")

def main():
    print("🎨 Generating Simple Clean Defect Comparisons & Mobile Proof Cards...")

    desktop_defects = [
        {
            'us': os.path.join(DESKTOP_PROOFS_DIR, 'REAL_DESKTOP_DEFECT_1_INDOOR_PROOF.png'),
            'au': os.path.join(AU_DIR, 'au_staging_mega_menu_indoor.png'),
            'out': 'SIMPLE_DEFECT_1_INDOOR_OUTLET_LEAK.png',
            'title': 'Indoor Mega Menu — Outlet Link Australian Leak',
            'url': 'https://globewestoutlet.com.au/collections/indoor',
            'link': 'Outlet'
        },
        {
            'us': os.path.join(DESKTOP_PROOFS_DIR, 'REAL_DESKTOP_DEFECT_2_OUTDOOR_PROOF.png'),
            'au': os.path.join(AU_DIR, 'au_staging_mega_menu_outdoor.png'),
            'out': 'SIMPLE_DEFECT_2_OUTDOOR_OUTLET_LEAK.png',
            'title': 'Outdoor Mega Menu — Outlet Link Australian Leak',
            'url': 'https://globewestoutlet.com.au/collections/outdoor',
            'link': 'Outlet'
        },
        {
            'us': os.path.join(DESKTOP_PROOFS_DIR, 'REAL_DESKTOP_DEFECT_3_HOMEWARES_PROOF.png'),
            'au': os.path.join(AU_DIR, 'au_staging_mega_menu_homewares.png'),
            'out': 'SIMPLE_DEFECT_3_HOMEWARES_OUTLET_LEAK.png',
            'title': 'Homewares Mega Menu — Outlet Link Australian Leak',
            'url': 'https://globewestoutlet.com.au/collections/homewares',
            'link': 'Outlet'
        },
        {
            'us': os.path.join(DESKTOP_PROOFS_DIR, 'REAL_DESKTOP_DEFECT_4_SUPPORT_PROOF.png'),
            'au': os.path.join(AU_DIR, 'au_staging_mega_menu_indoor.png'),
            'out': 'SIMPLE_DEFECT_4_SUPPORT_OUTLET_LEAK.png',
            'title': 'Support Mega Menu — Melbourne Outlet Showroom Leak',
            'url': 'https://globewestoutlet.com.au/pages/melbourne-outlet-store',
            'link': 'Visit Melbourne Outlet'
        }
    ]

    for d in desktop_defects:
        create_simple_desktop_comparison(d['us'], d['au'], d['out'], d['title'], d['url'], d['link'])

    mobile_defects = [
        {
            'mob': os.path.join(MOBILE_PROOFS_DIR, 'REAL_MOBILE_DEFECT_1_INDOOR_PROOF.png'),
            'out': 'MOBILE_PROOF_DEFECT_1_INDOOR.png',
            'title': 'Indoor Accordion — Outlet Link AU Leak',
            'url': 'https://globewestoutlet.com.au/collections/indoor',
            'link': 'Outlet'
        },
        {
            'mob': os.path.join(MOBILE_PROOFS_DIR, 'REAL_MOBILE_DEFECT_2_OUTDOOR_PROOF.png'),
            'out': 'MOBILE_PROOF_DEFECT_2_OUTDOOR.png',
            'title': 'Outdoor Accordion — Outlet Link AU Leak',
            'url': 'https://globewestoutlet.com.au/collections/outdoor',
            'link': 'Outlet'
        },
        {
            'mob': os.path.join(MOBILE_PROOFS_DIR, 'REAL_MOBILE_DEFECT_3_HOMEWARES_PROOF.png'),
            'out': 'MOBILE_PROOF_DEFECT_3_HOMEWARES.png',
            'title': 'Homewares Accordion — Outlet Link AU Leak',
            'url': 'https://globewestoutlet.com.au/collections/homewares',
            'link': 'Outlet'
        },
        {
            'mob': os.path.join(MOBILE_PROOFS_DIR, 'REAL_MOBILE_DEFECT_4_SUPPORT_PROOF.png'),
            'out': 'MOBILE_PROOF_DEFECT_4_SUPPORT.png',
            'title': 'Support Accordion — Melbourne Outlet Link AU Leak',
            'url': 'https://globewestoutlet.com.au/pages/melbourne-outlet-store',
            'link': 'Melbourne Outlet'
        }
    ]

    for m in mobile_defects:
        create_mobile_proof_card(m['mob'], m['out'], m['title'], m['url'], m['link'])

if __name__ == '__main__':
    main()
