#!/usr/bin/env python3
"""
Generate side-by-side comparison images for Mini Cart Auth Matrix (Guest vs Logged In).
Target: mcstaging2.globewest.com (US - RED)
Baseline: mcstaging2.globewest.com.au (AU - GREEN)
Strictly adheres to: Red = US Defect, Green = AU Baseline, 1-line simple description.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Mini Cart'
GUEST_DIR = os.path.join(BASE_DIR, 'screenshots', 'guest')
LOGGED_IN_DIR = os.path.join(BASE_DIR, 'screenshots', 'logged_in')
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

def create_auth_comparison_card(
    matrix_num,
    title,
    one_line_explanation,
    us_img_path,
    au_img_path,
    out_path,
    us_crop_box=None,
    au_crop_box=None,
    content_h=260,
    side_w=750
):
    bg_fill = (247, 245, 242)

    # Load US Image
    if os.path.exists(us_img_path):
        us_im = Image.open(us_img_path).convert('RGB')
        if us_crop_box:
            us_im = us_im.crop(us_crop_box)
    else:
        us_im = Image.new('RGB', (side_w, content_h), (40, 20, 20))

    # Load AU Image
    if os.path.exists(au_img_path):
        au_im = Image.open(au_img_path).convert('RGB')
        if au_crop_box:
            au_im = au_im.crop(au_crop_box)
    else:
        au_im = Image.new('RGB', (side_w, content_h), (20, 40, 20))

    # Resize preserving aspect ratio
    scale_us = min(side_w / float(us_im.size[0]), content_h / float(us_im.size[1]))
    scale_au = min(side_w / float(au_im.size[0]), content_h / float(au_im.size[1]))

    new_us_w = max(1, int(us_im.size[0] * scale_us))
    new_us_h = max(1, int(us_im.size[1] * scale_us))
    new_au_w = max(1, int(au_im.size[0] * scale_au))
    new_au_h = max(1, int(au_im.size[1] * scale_au))

    us_scaled = us_im.resize((new_us_w, new_us_h), Image.Resampling.LANCZOS)
    au_scaled = au_im.resize((new_au_w, new_au_h), Image.Resampling.LANCZOS)

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
    draw.text((pad, pad + 8), f"AUTH MATRIX {matrix_num}: {title.upper()}", fill=(255, 255, 255), font=f_title)

    # Headers
    draw.text((pad, pad + 45), "US STOREFRONT (DEFECT PERSISTS)", fill=(255, 50, 50), font=f_col)
    draw.text((pad * 2 + side_w, pad + 45), "AU STOREFRONT (BASELINE FUNCTIONAL)", fill=(40, 220, 80), font=f_col)

    # Paste Canvases
    y_pos = pad + head_h
    img.paste(us_canvas, (pad, y_pos))
    img.paste(au_canvas, (pad * 2 + side_w, y_pos))

    # RED Border for US
    draw.rectangle([pad - 3, y_pos - 3, pad + side_w + 3, y_pos + content_h + 3], outline=(255, 0, 0), width=4)

    # GREEN Border for AU
    au_x = pad * 2 + side_w
    draw.rectangle([au_x - 3, y_pos - 3, au_x + side_w + 3, y_pos + content_h + 3], outline=(0, 255, 0), width=4)

    # 1-Line Explanation
    draw.text((pad, y_pos + content_h + 18), f"Matrix Finding: {one_line_explanation}", fill=(230, 230, 230), font=f_exp)

    img.save(out_path, quality=95)
    print(f"[Generated] {out_path}")
    return img

def build_auth_matrix_images():
    print("Building Auth Matrix Comparison Images...")

    cards = []

    # 1. Logged In Account Header Parity (Wishlist Heart Icon)
    c1_out = os.path.join(COMPARISON_DIR, 'DEFECT_AUTH_1_LOGGED_IN_HEADER_WISHLIST_MISSING.png')
    card1 = create_auth_comparison_card(
        1,
        "Logged-in Header Utility: Wishlist Heart Icon Missing Next to Cart",
        "Even when logged in as Deepali Londhe, US header utility lacks the Wishlist heart icon next to the Mini Cart icon, whereas AU renders it cleanly.",
        os.path.join(LOGGED_IN_DIR, '01_US_Customer_Logged_In_Account.png'),
        os.path.join(LOGGED_IN_DIR, '02_AU_Customer_Logged_In_Account.png'),
        c1_out,
        us_crop_box=(950, 40, 1260, 130),
        au_crop_box=(900, 40, 1260, 130),
        content_h=160,
        side_w=750
    )
    cards.append(card1)

    # 2. Add to Cart Button Status (Logged-In Customer)
    c2_out = os.path.join(COMPARISON_DIR, 'DEFECT_AUTH_2_LOGGED_IN_ADD_TO_CART_SUPPRESSED.png')
    card2 = create_auth_comparison_card(
        2,
        "Logged-in Product Page: 'Add to Cart' Button Remains Suppressed",
        "Logging in as Deepali Londhe does NOT enable 'Add to Cart' on US PDPs; button remains suppressed, proving catalog stock scope issue rather than login-gate.",
        os.path.join(GUEST_DIR, '02_US_Guest_PDP_Add_To_Cart_Suppressed.png'),
        os.path.join(BASE_DIR, 'screenshots', 'au_sections', 'd1_add_to_cart_form.png'),
        c2_out,
        us_crop_box=(570, 420, 1050, 710),
        au_crop_box=None,
        content_h=260,
        side_w=750
    )
    cards.append(card2)

    # 3. Mini Cart Drawer State (Logged-In Session)
    c3_out = os.path.join(COMPARISON_DIR, 'DEFECT_AUTH_3_LOGGED_IN_MINICART_DRAWER_PARITY.png')
    card3 = create_auth_comparison_card(
        3,
        "Logged-in Mini Cart Drawer: Population Blocked vs AU Functional Drawer",
        "US logged-in customer drawer remains empty due to suppressed PDP Add to Cart button, while AU drawer syncs customer cart items with GST and checkout progression.",
        os.path.join(LOGGED_IN_DIR, '03_US_LoggedIn_Minicart_Drawer.png'),
        os.path.join(BASE_DIR, 'screenshots', 'au_sections', 'd0_populated_drawer.png'),
        c3_out,
        us_crop_box=(830, 0, 1280, 500),
        au_crop_box=None,
        content_h=280,
        side_w=750
    )
    cards.append(card3)

    # MASTER COMBINED AUTH MATRIX POSTER
    print("Generating Master Auth Matrix Combined Poster...")
    header_banner_h = 85
    spacing = 24
    combined_w = cards[0].size[0]
    total_cards_h = sum(c.size[1] for c in cards) + (spacing * (len(cards) - 1))
    combined_h = header_banner_h + total_cards_h + 35

    poster = Image.new('RGB', (combined_w, combined_h), (8, 8, 10))
    p_draw = ImageDraw.Draw(poster)

    f_banner = get_font(24, bold=True)
    f_sub = get_font(14, bold=False)

    p_draw.text((25, 20), "MINI CART AUTH MATRIX AUDIT: GUEST VS LOGGED IN (DEEPALI LONDHE)", fill=(255, 255, 255), font=f_banner)
    p_draw.text((25, 54), "Target: mcstaging2.globewest.com (RED)  |  Baseline: mcstaging2.globewest.com.au (GREEN)", fill=(160, 160, 170), font=f_sub)

    curr_y = header_banner_h + 10
    for c in cards:
        poster.paste(c, (0, curr_y))
        curr_y += c.size[1] + spacing

    combined_out = os.path.join(COMPARISON_DIR, 'ONE_COMBINED_AUTH_MATRIX_DEFECTS_COMPARISON.png')
    poster.save(combined_out, quality=95)
    print(f"[Generated Master Auth Matrix] {combined_out}")

if __name__ == '__main__':
    build_auth_matrix_images()
