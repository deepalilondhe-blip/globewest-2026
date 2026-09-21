#!/usr/bin/env python3
"""
Generate side-by-side annotated proof images for Cart Page QA audit.
Follows senior QA visual standards:
  - GREEN (#00FF00 / #059669): Passed / Approved Functionality & AU Baseline
  - RED (#FF0000 / #DC2626): Actual Defect on US Storefront
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Cart Page'
SCREENSHOTS_FUNC = os.path.join(BASE_DIR, 'screenshots', 'cart_functionality')
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

def create_comparison_card(
    title,
    subtitle,
    us_img_path,
    au_img_path,
    out_path,
    us_is_pass=True,
    us_label="US STOREFRONT (PASS - GREEN)",
    au_label="AU STOREFRONT (BASELINE - GREEN)",
    content_h=440
):
    side_w = 860
    
    # Load US Image
    if os.path.exists(us_img_path):
        us_im = Image.open(us_img_path).convert('RGB')
    else:
        us_im = Image.new('RGB', (side_w, content_h), (30, 20, 20))
        d = ImageDraw.Draw(us_im)
        d.text((40, 40), f"Image not found: {os.path.basename(us_img_path)}", fill=(255, 120, 120))
        
    # Load AU Image
    if os.path.exists(au_img_path):
        au_im = Image.open(au_img_path).convert('RGB')
    else:
        au_im = Image.new('RGB', (side_w, content_h), (20, 30, 20))
        d = ImageDraw.Draw(au_im)
        d.text((40, 40), f"Image not found: {os.path.basename(au_img_path)}", fill=(120, 255, 120))

    # Resize cleanly to side_w x content_h
    us_resized = us_im.resize((side_w, content_h), Image.Resampling.LANCZOS)
    au_resized = au_im.resize((side_w, content_h), Image.Resampling.LANCZOS)

    pad = 20
    head_h = 75
    foot_h = 60
    total_w = (side_w * 2) + (pad * 3)
    total_h = head_h + content_h + foot_h + (pad * 2)

    img = Image.new('RGB', (total_w, total_h), (12, 14, 18))
    draw = ImageDraw.Draw(img)

    f_title = get_font(20, bold=True)
    f_col = get_font(15, bold=True)
    f_exp = get_font(14, bold=False)

    # Title
    draw.text((pad, pad + 8), title.upper(), fill=(255, 255, 255), font=f_title)

    # Section Headers
    us_border_color = (0, 220, 60) if us_is_pass else (255, 30, 30)
    au_border_color = (0, 220, 60)

    draw.text((pad, pad + 44), us_label, fill=us_border_color, font=f_col)
    draw.text((pad * 2 + side_w, pad + 44), au_label, fill=au_border_color, font=f_col)

    # Paste Images
    y_pos = pad + head_h
    img.paste(us_resized, (pad, y_pos))
    img.paste(au_resized, (pad * 2 + side_w, y_pos))

    # Border for US
    draw.rectangle([pad - 3, y_pos - 3, pad + side_w + 3, y_pos + content_h + 3], outline=us_border_color, width=4)

    # Border for AU
    au_x = pad * 2 + side_w
    draw.rectangle([au_x - 3, y_pos - 3, au_x + side_w + 3, y_pos + content_h + 3], outline=au_border_color, width=4)

    # Footnote / Description
    draw.text((pad, y_pos + content_h + 18), f"Verification Result: {subtitle}", fill=(220, 225, 230), font=f_exp)

    img.save(out_path, quality=95)
    print(f"[Generated Card] {out_path}")
    return img


def build_all():
    print("Generating Cart Page Visual Evidence and Parity Cards...")

    cards = []

    # 1. ADD TO CART & PRICING (PASS)
    c1 = create_comparison_card(
        "Feature 1: PDP Trade Pricing & Add to Cart Purchasing Flow (Working Fine)",
        "Trade pricing is visible ($5,472.50) and [ADD TO CART] button is fully functional on US Storefront.",
        os.path.join(SCREENSHOTS_FUNC, '03_US_PDP_AddToCart_Button_PASS.png'),
        os.path.join(SCREENSHOTS_AU, 'AU_PDP_Item_Added.png'),
        os.path.join(COMPARISON_DIR, '01_PASS_ADD_TO_CART_AND_PRICING.png'),
        us_is_pass=True,
        us_label="US STOREFRONT (PASS - ACTIVE ADD TO CART)",
        au_label="AU STOREFRONT (BASELINE REFERENCE)"
    )
    cards.append(c1)

    # 2. POPULATED CART ITEMS TABLE (PASS)
    c2 = create_comparison_card(
        "Feature 2: Cart Page Items Table, Unit Price & Qty Stepper (Working Fine)",
        "Shopping cart items table correctly displays product image, title, unit price ($3,520.00), quantity stepper (Qty: 3), and line subtotal ($10,560.00).",
        os.path.join(SCREENSHOTS_FUNC, '05_US_Cart_Table_Populated_PASS.png'),
        os.path.join(SCREENSHOTS_AU, '04_AU_Populated_Cart_Full.png'),
        os.path.join(COMPARISON_DIR, '02_PASS_CART_PAGE_ITEMS_TABLE.png'),
        us_is_pass=True,
        us_label="US STOREFRONT (PASS - ITEMS TABLE & PRICING)",
        au_label="AU STOREFRONT (BASELINE REFERENCE)"
    )
    cards.append(c2)

    # 3. ORDER SUMMARY & US SHIPPING ESTIMATOR (PASS)
    c3 = create_comparison_card(
        "Feature 3: Order Summary, B2B Name Order, & US Shipping Estimator (Working Fine)",
        "Cart order summary block renders B2B 'NAME YOUR ORDER', Quote CTA, and shipping estimator defaulting to US with ZIP code validation.",
        os.path.join(SCREENSHOTS_FUNC, '11_US_Cart_Order_Summary_Block_PASS.png'),
        os.path.join(SCREENSHOTS_AU, '04_AU_Populated_Cart_Full.png'),
        os.path.join(COMPARISON_DIR, '03_PASS_ORDER_SUMMARY_AND_ESTIMATOR.png'),
        us_is_pass=True,
        us_label="US STOREFRONT (PASS - ORDER SUMMARY & ESTIMATOR)",
        au_label="AU STOREFRONT (BASELINE REFERENCE)"
    )
    cards.append(c3)

    # 4. EMPTY CART HERO CARD (PASS)
    c4 = create_comparison_card(
        "Feature 4: Empty Cart Hero Layout & Catalog CTAs (Working Fine)",
        "Empty cart view renders 'Your Cart Is Empty' hero block with functional [EXPLORE IN STOCK] and [SHOP FURNITURE] catalog navigation buttons.",
        os.path.join(SCREENSHOTS_US, '01_US_Empty_Cart_Page.png'),
        os.path.join(SCREENSHOTS_AU, '01_AU_Empty_Cart_Baseline.png'),
        os.path.join(COMPARISON_DIR, '04_PASS_EMPTY_CART_HERO_LAYOUT.png'),
        us_is_pass=True,
        us_label="US STOREFRONT (PASS - EMPTY CART HERO)",
        au_label="AU STOREFRONT (BASELINE REFERENCE)"
    )
    cards.append(c4)

    # 5. DEFECT 1: PIXELATED TRUCK ICONS IN CONTENT HUB (DEFECT - RED)
    c5 = create_comparison_card(
        "Defect 1: Distorted Pixelated Truck Placeholders in Cart Content Hub",
        "Cart content hub displays broken low-resolution delivery truck placeholders ('Icon.png' & 'Icon2.png') for test blog posts.",
        os.path.join(SCREENSHOTS_FUNC, 'DEFECT_01_US_Cart_Content_Hub_Pixelated_Truck_RED.png'),
        os.path.join(SCREENSHOTS_FUNC, 'AU_BASELINE_02_Content_Hub.png'),
        os.path.join(COMPARISON_DIR, 'DEFECT_1_CART_CONTENT_HUB_TRUCK_ICONS.png'),
        us_is_pass=False,
        us_label="US STOREFRONT (DEFECT - LOW-RES TRUCK ICONS)",
        au_label="AU STOREFRONT (BASELINE REFERENCE)"
    )
    cards.append(c5)

    # 6. DEFECT 2: AUSTRALIAN BLOG DOMAIN LEAK (DEFECT - RED)
    c6 = create_comparison_card(
        "Defect 2: Australian Blog Domain Leakage in 'VIEW ALL ARTICLES' CTA",
        "'VIEW ALL ARTICLES' hyperlink points directly to the Australian staging blog: https://mcprod.globewest.com.au/blog.",
        os.path.join(SCREENSHOTS_FUNC, 'DEFECT_02_US_Cart_AU_Blog_Domain_Leak_RED.png'),
        os.path.join(SCREENSHOTS_FUNC, 'AU_BASELINE_02_Content_Hub.png'),
        os.path.join(COMPARISON_DIR, 'DEFECT_2_CART_AU_BLOG_DOMAIN_LEAK.png'),
        us_is_pass=False,
        us_label="US STOREFRONT (DEFECT - AU DOMAIN LEAK)",
        au_label="AU STOREFRONT (BASELINE REFERENCE)"
    )
    cards.append(c6)

    # MASTER POSTER
    print("Generating Master Cart Page Verification Poster...")
    header_banner_h = 100
    spacing = 25
    combined_w = cards[0].size[0]
    total_cards_h = sum(c.size[1] for c in cards) + (spacing * (len(cards) - 1))
    combined_h = header_banner_h + total_cards_h + 40

    poster = Image.new('RGB', (combined_w, combined_h), (8, 10, 14))
    p_draw = ImageDraw.Draw(poster)

    f_banner = get_font(26, bold=True)
    f_sub = get_font(15, bold=False)

    p_draw.text((30, 22), "GLOBEWEST US EXPANSION: CART PAGE QA AUDIT & VERIFICATION POSTER", fill=(255, 255, 255), font=f_banner)
    p_draw.text((30, 62), "GREEN = Passed / Working Functionality (Figma & AU Parity)   |   RED = Identified Defect (US Staging)", fill=(160, 210, 180), font=f_sub)

    curr_y = header_banner_h + 15
    for c in cards:
        poster.paste(c, (0, curr_y))
        curr_y += c.size[1] + spacing

    master_out = os.path.join(COMPARISON_DIR, 'MASTER_CART_PAGE_QA_VERIFICATION_POSTER.png')
    poster.save(master_out, quality=95)
    print(f"[Generated Master Poster] {master_out}")

if __name__ == '__main__':
    build_all()
