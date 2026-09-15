#!/usr/bin/env python3
"""
Generate side-by-side comparison images for Mini Cart defects.
Target: mcstaging2.globewest.com (US - RED)
Baseline: mcstaging2.globewest.com.au (AU - GREEN)
Strictly adheres to: Red = US Defect, Green = AU Baseline, 1-line simple description.
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Mini Cart'
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
    bg_fill = (247, 245, 242) # Neutral card background
    
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
    print("Building Mini Cart Defect Comparison Images...")

    cards = []

    # -------------------------------------------------------------
    # DEFECT 1: Purchasing Blocked - "Add to Cart" Suppressed
    # -------------------------------------------------------------
    d1_out = os.path.join(COMPARISON_DIR, 'DEFECT_1_PURCHASING_BLOCKED_MINICART_POPULATION.png')
    card1 = create_simple_single_defect(
        1,
        "Purchasing Blocked: 'Add to Cart' Button Suppressed on US Product Pages",
        "'Add to Cart' button is completely suppressed on US product detail pages, preventing customers from adding products and populating the Mini Cart drawer.",
        os.path.join(US_SECTIONS, 'd1_add_to_cart_form.png'),
        os.path.join(AU_SECTIONS, 'd1_add_to_cart_form.png'),
        d1_out,
        content_h=260,
        side_w=750
    )
    cards.append(card1)

    # -------------------------------------------------------------
    # DEFECT 2: Australian "GST" Tax Line Leaking in US Mini Cart Subtotal
    # -------------------------------------------------------------
    d2_out = os.path.join(COMPARISON_DIR, 'DEFECT_2_AUSTRALIAN_GST_TAX_LEAK_IN_MINICART.png')
    card2 = create_simple_single_defect(
        2,
        "Australian Tax 'GST' Hardcoded in US Mini Cart Subtotal Template",
        "US Mini Cart subtotal template hardcodes Australian 'GST' tax line (<div class=\"gst\"><span data-bind=\"i18n: 'GST'\">), violating US tax compliance requirements.",
        os.path.join(US_SECTIONS, 'd2_minicart_totals.png'),
        os.path.join(AU_SECTIONS, 'd2_minicart_totals.png'),
        d2_out,
        content_h=260,
        side_w=750
    )
    cards.append(card2)

    # -------------------------------------------------------------
    # DEFECT 3: Mini Cart Cross-Sell Links Route to Australian Domain
    # -------------------------------------------------------------
    d3_out = os.path.join(COMPARISON_DIR, 'DEFECT_3_CROSS_SELL_AU_DOMAIN_LEAK.png')
    card3 = create_simple_single_defect(
        3,
        "Mini Cart Cross-Sell Recommendations Route to Australian Domain",
        "Cross-sell recommendation cards inside the Mini Cart drawer link to Australian domain (https://mcstaging.globewest.com.au), leaking US buyers to the AU catalog.",
        os.path.join(US_SECTIONS, 'd3_cross_sell.png'),
        os.path.join(AU_SECTIONS, 'd3_cross_sell.png'),
        d3_out,
        content_h=240,
        side_w=750
    )
    cards.append(card3)

    # -------------------------------------------------------------
    # DEFECT 4: Wishlist Heart Icon Missing from Header Next to Cart
    # -------------------------------------------------------------
    d4_out = os.path.join(COMPARISON_DIR, 'DEFECT_4_MISSING_CART_UTILITY_IN_HEADER.png')
    card4 = create_simple_single_defect(
        4,
        "Wishlist Heart Icon Missing from Header Next to Mini Cart Trigger",
        "Wishlist heart icon is absent from the US header utility area next to the Mini Cart trigger icon, creating a feature parity gap with AU.",
        os.path.join(US_SECTIONS, 'd4_header_utility.png'),
        os.path.join(AU_SECTIONS, 'd4_header_utility.png'),
        d4_out,
        content_h=160,
        side_w=750
    )
    cards.append(card4)

    # -------------------------------------------------------------
    # MASTER COMBINED POSTER (All Defects in 1 Vertical Image)
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

    p_draw.text((25, 20), "TICKET: MINI CART SECTION DEFECT COMPARISON AUDIT", fill=(255, 255, 255), font=f_banner)
    p_draw.text((25, 54), "Target: https://mcstaging2.globewest.com (RED)  |  Baseline: https://mcstaging2.globewest.com.au (GREEN)", fill=(160, 160, 170), font=f_sub)

    curr_y = header_banner_h + 10
    for c in cards:
        poster.paste(c, (0, curr_y))
        curr_y += c.size[1] + spacing

    combined_out = os.path.join(COMPARISON_DIR, 'ONE_COMBINED_MINI_CART_DEFECTS_COMPARISON.png')
    poster.save(combined_out, quality=95)
    print(f"[Generated Master] {combined_out}")

if __name__ == '__main__':
    build_all_defect_images()
