#!/usr/bin/env python3
"""
Generate side-by-side comparison images for Footer defects.
Target: mcstaging2.globewest.com (US - RED)
Baseline: mcstaging2.globewest.com.au (AU - GREEN)
Strictly adheres to: Red = US Defect, Green = AU Baseline, 1-line simple description.
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer'
US_SECTIONS = os.path.join(BASE_DIR, 'screenshots', 'us_sections')
AU_SECTIONS = os.path.join(BASE_DIR, 'screenshots', 'au_sections')
COMPARISON_DIR = os.path.join(BASE_DIR, 'comparison')
os.makedirs(COMPARISON_DIR, exist_ok=True)

def get_font(size, bold=True):
    try:
        font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
        if not os.path.exists(font_path):
            font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def create_simple_single_defect(
    defect_num,
    defect_title,
    one_line_explanation,
    us_img_path,
    au_img_path,
    out_path,
    content_h=260,
    side_w=750
):
    bg_fill = (247, 245, 242) # Footer card tone
    
    # Load US Image
    if os.path.exists(us_img_path):
        us_im = Image.open(us_img_path).convert('RGB')
    else:
        us_im = Image.new('RGB', (side_w, content_h), (40, 20, 20))
        d = ImageDraw.Draw(us_im)
        d.text((50, 50), f"Missing: {os.path.basename(us_img_path)}", fill=(255, 100, 100))
        
    # Load AU Image
    if os.path.exists(au_img_path):
        au_im = Image.open(au_img_path).convert('RGB')
    else:
        au_im = Image.new('RGB', (side_w, content_h), (20, 40, 20))
        d = ImageDraw.Draw(au_im)
        d.text((50, 50), f"Missing: {os.path.basename(au_img_path)}", fill=(100, 255, 100))

    # Resize preserving aspect ratio to fit side_w x content_h
    scale_us = min(side_w / float(us_im.size[0]), content_h / float(us_im.size[1]))
    scale_au = min(side_w / float(au_im.size[0]), content_h / float(au_im.size[1]))

    new_us_w = max(1, int(us_im.size[0] * scale_us))
    new_us_h = max(1, int(us_im.size[1] * scale_us))
    new_au_w = max(1, int(au_im.size[0] * scale_au))
    new_au_h = max(1, int(au_im.size[1] * scale_au))

    us_scaled = us_im.resize((new_us_w, new_us_h), Image.Resampling.LANCZOS)
    au_scaled = au_im.resize((new_au_w, new_au_h), Image.Resampling.LANCZOS)

    # Place on canvas with neutral background
    us_canvas = Image.new('RGB', (side_w, content_h), bg_fill)
    us_canvas.paste(us_scaled, ((side_w - new_us_w) // 2, (content_h - new_us_h) // 2))

    au_canvas = Image.new('RGB', (side_w, content_h), bg_fill)
    au_canvas.paste(au_scaled, ((side_w - new_au_w) // 2, (content_h - new_au_h) // 2))

    pad = 20
    head_h = 75
    foot_h = 60
    total_w = (side_w * 2) + (pad * 3)
    total_h = head_h + content_h + foot_h + (pad * 2)

    img = Image.new('RGB', (total_w, total_h), (12, 12, 15))
    draw = ImageDraw.Draw(img)

    f_title = get_font(20, bold=True)
    f_col = get_font(15, bold=True)
    f_exp = get_font(14, bold=False)

    # Title
    draw.text((pad, pad + 8), f"DEFECT {defect_num}: {defect_title.upper()}", fill=(255, 255, 255), font=f_title)

    # Section Headers
    draw.text((pad, pad + 45), "US STOREFRONT (DEFECT)", fill=(255, 50, 50), font=f_col)
    draw.text((pad * 2 + side_w, pad + 45), "AU STOREFRONT (BASELINE)", fill=(40, 220, 80), font=f_col)

    # Paste Images
    y_pos = pad + head_h
    img.paste(us_canvas, (pad, y_pos))
    img.paste(au_canvas, (pad * 2 + side_w, y_pos))

    # RED Border for US
    draw.rectangle([pad - 3, y_pos - 3, pad + side_w + 3, y_pos + content_h + 3], outline=(255, 0, 0), width=4)

    # GREEN Border for AU
    au_x = pad * 2 + side_w
    draw.rectangle([au_x - 3, y_pos - 3, au_x + side_w + 3, y_pos + content_h + 3], outline=(0, 255, 0), width=4)

    # 1-Line Explanation
    draw.text((pad, y_pos + content_h + 18), f"Defect: {one_line_explanation}", fill=(230, 230, 230), font=f_exp)

    img.save(out_path, quality=95)
    print(f"[Generated] {out_path}")
    return img

def build_all_defect_images():
    print("Building Footer Defect Comparison Images...")

    cards = []

    # -------------------------------------------------------------
    # DEFECT 1: "Shop Outlet" Link Leaking to globewestoutlet.com.au
    # -------------------------------------------------------------
    d1_out = os.path.join(COMPARISON_DIR, 'DEFECT_1_SHOP_OUTLET_AU_LEAK.png')
    card1 = create_simple_single_defect(
        1,
        "Customer Support 'Shop Outlet' Link Leaking to Australian Outlet Store",
        "'Shop Outlet' link hardcodes Australian outlet URL (https://globewestoutlet.com.au), redirecting US customers to the domestic AU store.",
        os.path.join(US_SECTIONS, 'd1_shop_outlet.png'),
        os.path.join(AU_SECTIONS, 'd1_shop_outlet.png'),
        d1_out,
        content_h=340,
        side_w=750
    )
    cards.append(card1)

    # -------------------------------------------------------------
    # DEFECT 2: Newsletter "Subscribe Now." Link Leaking to globewest.com.au
    # -------------------------------------------------------------
    d2_out = os.path.join(COMPARISON_DIR, 'DEFECT_2_NEWSLETTER_SUBSCRIBE_AU_LEAK.png')
    card2 = create_simple_single_defect(
        2,
        "Newsletter 'Subscribe Now.' Link Leaking to Australian Database",
        "Newsletter 'Subscribe Now.' link routes to Australian database (https://www.globewest.com.au/subscribe-to-our-database) instead of US registration.",
        os.path.join(US_SECTIONS, 'd2_newsletter.png'),
        os.path.join(AU_SECTIONS, 'd2_newsletter.png'),
        d2_out,
        content_h=200,
        side_w=750
    )
    cards.append(card2)

    # -------------------------------------------------------------
    # DEFECT 3: "Australian Owned & Run" National Emblem in US Footer
    # -------------------------------------------------------------
    d3_out = os.path.join(COMPARISON_DIR, 'DEFECT_3_AUSTRALIAN_OWNED_BADGE_LEAK.png')
    card3 = create_simple_single_defect(
        3,
        "'Australian Owned & Run' Geographic Badge Leaking in US Storefront Footer",
        "Australian continent outline and 'AUSTRALIAN OWNED & RUN' national trademark badge are displayed on the US storefront footer.",
        os.path.join(US_SECTIONS, 'd3_australian_badge.png'),
        os.path.join(AU_SECTIONS, 'd3_australian_badge.png'),
        d3_out,
        content_h=160,
        side_w=750
    )
    cards.append(card3)

    # -------------------------------------------------------------
    # DEFECT 4: Pinterest Regional Australian Domain (pinterest.com.au)
    # -------------------------------------------------------------
    d4_out = os.path.join(COMPARISON_DIR, 'DEFECT_4_PINTEREST_AU_LOCALE_LEAK.png')
    card4 = create_simple_single_defect(
        4,
        "Pinterest Social Icon Routes to Regional Australian Locale (pinterest.com.au)",
        "Pinterest social icon links to regional Australian domain (https://www.pinterest.com.au/globewest/) rather than global/US profile.",
        os.path.join(US_SECTIONS, 'd4_social_links.png'),
        os.path.join(AU_SECTIONS, 'd4_social_links.png'),
        d4_out,
        content_h=160,
        side_w=750
    )
    cards.append(card4)

    # -------------------------------------------------------------
    # DEFECT 5: Outdated Copyright Year "© 2023 GlobeWest" in Legal Bar
    # -------------------------------------------------------------
    d5_out = os.path.join(COMPARISON_DIR, 'DEFECT_5_OUTDATED_COPYRIGHT_2023.png')
    card5 = create_simple_single_defect(
        5,
        "Outdated Copyright Year '© 2023 GlobeWest' & Missing US Privacy/CCPA Compliance",
        "Bottom legal bar displays outdated copyright year '© 2023 GlobeWest' and lacks US-required CCPA privacy notice link.",
        os.path.join(US_SECTIONS, 'd5_copyright.png'),
        os.path.join(AU_SECTIONS, 'd5_copyright.png'),
        d5_out,
        content_h=150,
        side_w=750
    )
    cards.append(card5)

    # -------------------------------------------------------------
    # MASTER COMBINED POSTER (All 5 Defects in 1 Vertical Image)
    # -------------------------------------------------------------
    print("Generating Master Combined Comparison Poster...")
    header_banner_h = 85
    spacing = 24
    combined_w = cards[0].size[0]
    total_cards_h = sum(c.size[1] for c in cards) + (spacing * (len(cards) - 1))
    combined_h = header_banner_h + total_cards_h + 35

    poster = Image.new('RGB', (combined_w, combined_h), (8, 8, 10))
    p_draw = ImageDraw.Draw(poster)

    f_banner = get_font(24, bold=True)
    f_sub = get_font(14, bold=False)

    p_draw.text((25, 20), "TICKET: FOOTER STOREFRONT DEFECT COMPARISON AUDIT", fill=(255, 255, 255), font=f_banner)
    p_draw.text((25, 54), "Target: https://mcstaging2.globewest.com (RED)  |  Baseline: https://mcstaging2.globewest.com.au (GREEN)", fill=(160, 160, 170), font=f_sub)

    curr_y = header_banner_h + 10
    for c in cards:
        poster.paste(c, (0, curr_y))
        curr_y += c.size[1] + spacing

    combined_out = os.path.join(COMPARISON_DIR, 'ONE_COMBINED_FOOTER_DEFECTS_COMPARISON.png')
    poster.save(combined_out, quality=95)
    print(f"[Generated Master] {combined_out}")

if __name__ == '__main__':
    build_all_defect_images()
