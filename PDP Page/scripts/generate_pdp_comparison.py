#!/usr/bin/env python3
"""
Generate side-by-side comparison images for PDP Figma Fidelity Audit.
Target: mcstaging2.globewest.com (Live US Staging)
Baseline: Figma Design 'PDP' (desktop/product/Trade Pricing - ETA & Mobile/product/Trade Pricing - ETA)
Strictly adheres to: Red = US Defect, Green = Figma Approved Spec / Pass.
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PDP Page'
FIGMA_DIR = os.path.join(BASE_DIR, 'figma_crops')
DESKTOP_DIR = os.path.join(BASE_DIR, 'screenshots', 'desktop')
MOBILE_DIR = os.path.join(BASE_DIR, 'screenshots', 'mobile')
DEFECTS_DIR = os.path.join(BASE_DIR, 'screenshots', 'defects')
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

def create_side_by_side(
    card_title,
    left_label,
    left_img_path,
    left_is_defect,
    right_label,
    right_img_path,
    right_is_defect,
    one_line_summary,
    out_path,
    side_w=650,
    content_h=420
):
    bg_fill = (245, 243, 240)
    
    # Left Image
    if os.path.exists(left_img_path):
        left_im = Image.open(left_img_path).convert('RGB')
    else:
        left_im = Image.new('RGB', (side_w, content_h), (40, 20, 20))
        d = ImageDraw.Draw(left_im)
        d.text((50, 50), f"Missing: {os.path.basename(left_img_path)}", fill=(255, 100, 100))

    # Right Image
    if os.path.exists(right_img_path):
        right_im = Image.open(right_img_path).convert('RGB')
    else:
        right_im = Image.new('RGB', (side_w, content_h), (20, 40, 20))
        d = ImageDraw.Draw(right_im)
        d.text((50, 50), f"Missing: {os.path.basename(right_img_path)}", fill=(100, 255, 100))

    scale_l = min(side_w / float(left_im.size[0]), content_h / float(left_im.size[1]))
    scale_r = min(side_w / float(right_im.size[0]), content_h / float(right_im.size[1]))

    new_l_w = max(1, int(left_im.size[0] * scale_l))
    new_l_h = max(1, int(left_im.size[1] * scale_l))
    new_r_w = max(1, int(right_im.size[0] * scale_r))
    new_r_h = max(1, int(right_im.size[1] * scale_r))

    left_scaled = left_im.resize((new_l_w, new_l_h), Image.Resampling.LANCZOS)
    right_scaled = right_im.resize((new_r_w, new_r_h), Image.Resampling.LANCZOS)

    left_canvas = Image.new('RGB', (side_w, content_h), bg_fill)
    left_canvas.paste(left_scaled, ((side_w - new_l_w) // 2, (content_h - new_l_h) // 2))

    right_canvas = Image.new('RGB', (side_w, content_h), bg_fill)
    right_canvas.paste(right_scaled, ((side_w - new_r_w) // 2, (content_h - new_r_h) // 2))

    pad = 20
    head_h = 70
    foot_h = 55
    total_w = (side_w * 2) + (pad * 3)
    total_h = head_h + content_h + foot_h + (pad * 2)

    img = Image.new('RGB', (total_w, total_h), (15, 17, 23))
    draw = ImageDraw.Draw(img)

    f_title = get_font(18, bold=True)
    f_lbl = get_font(14, bold=True)
    f_sum = get_font(13, bold=False)

    # Title
    draw.text((pad, pad + 6), card_title.upper(), fill=(255, 255, 255), font=f_title)

    # Column Labels
    col_l = (255, 50, 50) if left_is_defect else (40, 220, 80)
    col_r = (255, 50, 50) if right_is_defect else (40, 220, 80)

    draw.text((pad, pad + 40), left_label, fill=col_l, font=f_lbl)
    draw.text((pad * 2 + side_w, pad + 40), right_label, fill=col_r, font=f_lbl)

    # Paste Images
    y_pos = pad + head_h
    img.paste(left_canvas, (pad, y_pos))
    img.paste(right_canvas, (pad * 2 + side_w, y_pos))

    # Borders
    b_left = (239, 68, 68) if left_is_defect else (16, 185, 129)
    b_right = (239, 68, 68) if right_is_defect else (16, 185, 129)

    for i in range(4):
        draw.rectangle([pad - i, y_pos - i, pad + side_w + i, y_pos + content_h + i], outline=b_left)
        draw.rectangle([pad * 2 + side_w - i, y_pos - i, pad * 2 + (side_w * 2) + i, y_pos + content_h + i], outline=b_right)

    # Footer Summary
    y_foot = y_pos + content_h + 14
    draw.text((pad, y_foot), f"Status: {one_line_summary}", fill=(220, 220, 220), font=f_sum)

    img.save(out_path)
    print(f"Saved: {out_path}")

def main():
    # 1. Defect: Missing Add to Quote CTA
    create_side_by_side(
        card_title="DEFECT 1: Missing [ADD TO QUOTE] CTA Button on US Storefront",
        left_label="LIVE US STOREFRONT (DEFECT - MISSING QUOTE CTA)",
        left_img_path=os.path.join(DEFECTS_DIR, 'DEFECT_04_US_PDP_Missing_AddToQuote_CTA_RED.png'),
        left_is_defect=True,
        right_label="FIGMA APPROVED SPEC (CONTAINS [ADD TO QUOTE])",
        right_img_path=os.path.join(FIGMA_DIR, 'FIGMA_DESKTOP_PRODUCT_INFO.png'),
        right_is_defect=False,
        one_line_summary="Figma specifies secondary [ADD TO QUOTE] CTA underneath [Add to cart]; completely absent on US PDP.",
        out_path=os.path.join(COMPARISON_DIR, '01_DEFECT_MISSING_ADD_TO_QUOTE_CTA.png')
    )

    # 2. Defect: Missing California Proposition 65 Warning
    create_side_by_side(
        card_title="DEFECT 2: Missing California Proposition 65 Regulatory Warning",
        left_label="LIVE US STOREFRONT (DEFECT - WARNING ABSENT)",
        left_img_path=os.path.join(DEFECTS_DIR, 'DEFECT_03_US_PDP_Missing_Prop65_Warning_RED.png'),
        left_is_defect=True,
        right_label="FIGMA APPROVED SPEC (CALIFORNIA PROP 65 MANDATORY)",
        right_img_path=os.path.join(FIGMA_DIR, 'FIGMA_DESKTOP_PRODUCT_INFO.png'),
        right_is_defect=False,
        one_line_summary="Figma specifies mandatory California Prop 65 warning box on all US product pages; missing from US storefront.",
        out_path=os.path.join(COMPARISON_DIR, '02_DEFECT_MISSING_CALIFORNIA_PROP65_WARNING.png')
    )

    # 3. Defect: Page Meta Title Australia Leak
    create_side_by_side(
        card_title="DEFECT 3: Page Meta <title> Leaks 'GlobeWest Australia' on US Store",
        left_label="LIVE US STOREFRONT (DEFECT - AUSTRALIA LEAK)",
        left_img_path=os.path.join(DEFECTS_DIR, 'DEFECT_01_US_PDP_Meta_Title_Australia_Leak_RED.png'),
        left_is_defect=True,
        right_label="FIGMA APPROVED SPEC (US STOREFRONT SCOPE)",
        right_img_path=os.path.join(FIGMA_DIR, 'FIGMA_STICKY_NOTES.png'),
        right_is_defect=False,
        one_line_summary="HTML <title> renders 'GlobeWest Australia' on mcstaging2.globewest.com; violates US localization.",
        out_path=os.path.join(COMPARISON_DIR, '03_DEFECT_PAGE_META_TITLE_AUSTRALIA_LEAK.png')
    )

    # 4. Pass: Typography & Title (IvyMode)
    create_side_by_side(
        card_title="PASS 1: Product Title Typography Fidelity (IvyMode Serif)",
        left_label="LIVE US STOREFRONT (PASS - IvyMode 400 Rendered)",
        left_img_path=os.path.join(DESKTOP_DIR, '03_Desktop_Product_Title_PASS.png'),
        left_is_defect=False,
        right_label="FIGMA APPROVED SPEC (Font: IvyMode 400 Regular)",
        right_img_path=os.path.join(FIGMA_DIR, 'FIGMA_DESKTOP_PRODUCT_INFO.png'),
        right_is_defect=False,
        one_line_summary="Product title typography matches Figma spec (font-family: IvyMode, font-weight: 400).",
        out_path=os.path.join(COMPARISON_DIR, '04_PASS_PRODUCT_TITLE_TYPOGRAPHY.png')
    )

    # 5. Pass: Trade Dual Pricing
    create_side_by_side(
        card_title="PASS 2: Trade Dual Pricing (Trade Price + MSRP Display)",
        left_label="LIVE US STOREFRONT (PASS - Trade $434.50 • MSRP $902.00)",
        left_img_path=os.path.join(DESKTOP_DIR, '07_Desktop_Trade_Price_Visible_PASS.png'),
        left_is_defect=False,
        right_label="FIGMA APPROVED SPEC (Trade Price + Secondary MSRP)",
        right_img_path=os.path.join(FIGMA_DIR, 'FIGMA_DESKTOP_PRODUCT_INFO.png'),
        right_is_defect=False,
        one_line_summary="Dual pricing structure renders customer trade price alongside MSRP as specified in Figma notes.",
        out_path=os.path.join(COMPARISON_DIR, '05_PASS_TRADE_DUAL_PRICING.png')
    )

    # 6. Pass: Mobile Viewport Responsiveness
    create_side_by_side(
        card_title="PASS 3: Mobile Viewport Responsive PDP Layout (390x844)",
        left_label="LIVE US MOBILE VIEWPORT (PASS - Clean Responsive Fit)",
        left_img_path=os.path.join(MOBILE_DIR, '01_Mobile_PDP_Hero_Overview.png'),
        left_is_defect=False,
        right_label="FIGMA APPROVED SPEC (Mobile/product/Trade Pricing - ETA)",
        right_img_path=os.path.join(FIGMA_DIR, 'FIGMA_MOBILE_FRAME.png'),
        right_is_defect=False,
        one_line_summary="Mobile PDP layout, image gallery, and typography fit mobile screen cleanly matching Figma hierarchy.",
        out_path=os.path.join(COMPARISON_DIR, '06_PASS_MOBILE_VIEW_COMPARISON.png')
    )

if __name__ == '__main__':
    main()
