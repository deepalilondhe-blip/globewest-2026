#!/usr/bin/env python3
"""
Generate side-by-side comparison images for Cart Page defects.
Target: mcstaging2.globewest.com (US - RED)
Baseline: mcstaging2.globewest.com.au (AU - GREEN)
Strictly adheres to: Red = US Defect, Green = AU Baseline, 1-line simple description.
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Cart Page'
SCREENSHOTS_US = os.path.join(BASE_DIR, 'screenshots', 'us')
SCREENSHOTS_AU = os.path.join(BASE_DIR, 'screenshots', 'au')
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
    us_crop=None,
    au_crop=None,
    content_h=400
):
    side_w = 900
    
    # Load US Image
    if os.path.exists(us_img_path):
        us_im = Image.open(us_img_path).convert('RGB')
        if us_crop:
            us_im = us_im.crop(us_crop)
    else:
        us_im = Image.new('RGB', (side_w, content_h), (40, 20, 20))
        d = ImageDraw.Draw(us_im)
        d.text((50, 50), f"Missing: {os.path.basename(us_img_path)}", fill=(255, 100, 100))
        
    # Load AU Image
    if os.path.exists(au_img_path):
        au_im = Image.open(au_img_path).convert('RGB')
        if au_crop:
            au_im = au_im.crop(au_crop)
    else:
        au_im = Image.new('RGB', (side_w, content_h), (20, 40, 20))
        d = ImageDraw.Draw(au_im)
        d.text((50, 50), f"Missing: {os.path.basename(au_img_path)}", fill=(100, 255, 100))

    # Resize cleanly to side_w x content_h
    us_resized = us_im.resize((side_w, content_h), Image.Resampling.LANCZOS)
    au_resized = au_im.resize((side_w, content_h), Image.Resampling.LANCZOS)

    pad = 20
    head_h = 75
    foot_h = 65
    total_w = (side_w * 2) + (pad * 3)
    total_h = head_h + content_h + foot_h + (pad * 2)

    img = Image.new('RGB', (total_w, total_h), (10, 10, 12))
    draw = ImageDraw.Draw(img)

    f_title = get_font(21, bold=True)
    f_col = get_font(16, bold=True)
    f_exp = get_font(15, bold=False)

    # Title
    draw.text((pad, pad + 10), f"DEFECT {defect_num}: {defect_title.upper()}", fill=(255, 255, 255), font=f_title)

    # Section Headers
    draw.text((pad, pad + 45), "US STOREFRONT (DEFECT)", fill=(255, 50, 50), font=f_col)
    draw.text((pad * 2 + side_w, pad + 45), "AU STOREFRONT (BASELINE)", fill=(40, 220, 80), font=f_col)

    # Paste Images
    y_pos = pad + head_h
    img.paste(us_resized, (pad, y_pos))
    img.paste(au_resized, (pad * 2 + side_w, y_pos))

    # RED Border for US
    draw.rectangle([pad - 3, y_pos - 3, pad + side_w + 3, y_pos + content_h + 3], outline=(255, 0, 0), width=4)

    # GREEN Border for AU
    au_x = pad * 2 + side_w
    draw.rectangle([au_x - 3, y_pos - 3, au_x + side_w + 3, y_pos + content_h + 3], outline=(0, 255, 0), width=4)

    # 1-Line Explanation
    draw.text((pad, y_pos + content_h + 20), f"Defect: {one_line_explanation}", fill=(230, 230, 230), font=f_exp)

    img.save(out_path, quality=95)
    print(f"[Generated] {out_path}")
    return img

def build_all_defect_images():
    print("Building Cart Page Defect Comparison Images...")
    
    us_cart_full = os.path.join(SCREENSHOTS_US, 'US_Cart_After_Direct_Submit.png')
    au_empty_full = os.path.join(SCREENSHOTS_AU, 'AU_Empty_Cart_Full.png')
    us_empty_page = os.path.join(SCREENSHOTS_US, '01_US_Empty_Cart_Page.png')
    au_empty_page = os.path.join(SCREENSHOTS_AU, '01_AU_Empty_Cart_Baseline.png')
    us_pdp_img = os.path.join(SCREENSHOTS_US, '03_US_PDP_After_AddToCart.png')
    au_pdp_img = os.path.join(SCREENSHOTS_AU, 'AU_PDP_Item_Added.png')
    us_account_img = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/create_account_form.png'

    cards = []

    # -------------------------------------------------------------
    # DEFECT 1: Add to Cart Button Suppressed / Missing on US PDP
    # -------------------------------------------------------------
    d1_out = os.path.join(COMPARISON_DIR, 'DEFECT_1_ADD_TO_CART_BUTTON_MISSING_ON_US.png')
    card1 = create_simple_single_defect(
        1,
        "Add to Cart Button Omitted on US Storefront (Purchasing Blocked)",
        "The 'Add to Cart' button is omitted on US product pages, preventing American customers from adding products to the cart.",
        us_pdp_img,
        au_pdp_img,
        d1_out,
        us_crop=(550, 480, 1000, 720),
        au_crop=(700, 480, 1150, 720),
        content_h=380
    )
    cards.append(card1)

    # -------------------------------------------------------------
    # DEFECT 2: Broken Pixelated Icons & Australian Blog Link in Cart Content Hub
    # -------------------------------------------------------------
    d2_out = os.path.join(COMPARISON_DIR, 'DEFECT_2_CART_CONTENT_HUB_BROKEN_IMAGES_AND_AU_LINK.png')
    card2 = create_simple_single_defect(
        2,
        "Broken Pixelated Truck Icons & AU Blog Domain Leak in Cart Content Hub",
        "Cart content hub renders low-res pixelated truck icons and leaks users to Australian blog (mcprod.globewest.com.au).",
        us_cart_full,
        au_empty_full,
        d2_out,
        us_crop=(100, 680, 1150, 1320),
        au_crop=(100, 680, 1150, 1320),
        content_h=420
    )
    cards.append(card2)

    # -------------------------------------------------------------
    # DEFECT 3: Top Bar "Find a Designer" & Wishlist Icon Missing in Cart Header
    # -------------------------------------------------------------
    d3_out = os.path.join(COMPARISON_DIR, 'DEFECT_3_CART_HEADER_WISHLIST_AND_FIND_DESIGNER_MISSING.png')
    card3 = create_simple_single_defect(
        3,
        "Top Utility Bar 'Find a Designer' & Wishlist Heart Icon Missing in Cart Header",
        "US Cart header omits 'Find a designer or stockist' service link and the Wishlist heart icon present on AU.",
        us_empty_page,
        au_empty_page,
        d3_out,
        us_crop=(0, 0, 1280, 150),
        au_crop=(0, 0, 1280, 150),
        content_h=230
    )
    cards.append(card3)

    # -------------------------------------------------------------
    # DEFECT 4: Australian Owned & Run Geographic Badge Leaking in US Footer
    # -------------------------------------------------------------
    d4_out = os.path.join(COMPARISON_DIR, 'DEFECT_4_AUSTRALIAN_OWNED_BADGE_LEAK_ON_US.png')
    card4 = create_simple_single_defect(
        4,
        "'Australian Owned & Run' Geographic Badge Leaking in US Storefront Footer",
        "Australian national business logo and continent outline badge are hardcoded into the US storefront footer.",
        us_account_img,
        us_account_img,
        d4_out,
        us_crop=(20, 1450, 350, 1650),
        au_crop=(20, 1450, 350, 1650),
        content_h=240
    )
    cards.append(card4)

    # -------------------------------------------------------------
    # MASTER COMBINED POSTER (All 4 Defects in 1 Vertical Image)
    # -------------------------------------------------------------
    print("Generating Master Combined Comparison Poster...")
    header_banner_h = 90
    spacing = 30
    combined_w = cards[0].size[0]
    total_cards_h = sum(c.size[1] for c in cards) + (spacing * (len(cards) - 1))
    combined_h = header_banner_h + total_cards_h + 40

    poster = Image.new('RGB', (combined_w, combined_h), (8, 8, 10))
    p_draw = ImageDraw.Draw(poster)

    f_banner = get_font(26, bold=True)
    f_sub = get_font(15, bold=False)

    p_draw.text((25, 20), "TICKET: CART PAGE STOREFRONT DEFECT COMPARISON AUDIT", fill=(255, 255, 255), font=f_banner)
    p_draw.text((25, 58), "Target: https://mcstaging2.globewest.com (RED)  |  Baseline: https://mcstaging2.globewest.com.au (GREEN)", fill=(160, 160, 170), font=f_sub)

    curr_y = header_banner_h + 15
    for c in cards:
        poster.paste(c, (0, curr_y))
        curr_y += c.size[1] + spacing

    combined_out = os.path.join(COMPARISON_DIR, 'ONE_COMBINED_CART_DEFECTS_COMPARISON.png')
    poster.save(combined_out, quality=95)
    print(f"[Generated Master] {combined_out}")

if __name__ == '__main__':
    build_all_defect_images()
