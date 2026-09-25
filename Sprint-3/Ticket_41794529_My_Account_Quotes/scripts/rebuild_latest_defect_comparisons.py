#!/usr/bin/env python3
"""
Rebuild strictly the 5 REAL verified defects for Ticket #41794529: My Account - Quotes.
Deletes all old/outdated defect captures and invalid items (e.g. Kangaroo footer badge, mobile actions truncation).
Saves ONLY:
- Red-outlined real defects in screenshots/defects/
- Clean Green (Approved Figma Spec) vs Red (Live Staging Defect) side-by-side comparison cards in comparison/
"""

import os
import glob
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes"
DEFECTS_DIR = os.path.join(BASE_DIR, "screenshots", "defects")
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")

os.makedirs(DEFECTS_DIR, exist_ok=True)
os.makedirs(COMPARISON_DIR, exist_ok=True)

# 1. Clean up old/outdated defect images
for f in glob.glob(os.path.join(DEFECTS_DIR, "*")):
    try:
        os.remove(f)
    except:
        pass
print("✅ Cleaned up old defects in DEFECTS_DIR")

for f in glob.glob(os.path.join(COMPARISON_DIR, "*")):
    try:
        os.remove(f)
    except:
        pass
print("✅ Cleaned up old comparisons in COMPARISON_DIR")

DESKTOP_PATH = os.path.join(BASE_DIR, "screenshots", "desktop", "01_my_quotes_desktop_live_full.png")
FIGMA_2X_PATH = os.path.join(BASE_DIR, "figma", "FIGMA_DESKTOP_MY_QUOTES_2X.jpg")

dt = Image.open(DESKTOP_PATH)
fig_2x = Image.open(FIGMA_2X_PATH)

def draw_red_box(img, box, width=4):
    d = ImageDraw.Draw(img)
    for i in range(width):
        d.rectangle([box[0]-i, box[1]-i, box[2]+i, box[3]+i], outline=(255, 0, 0))
    return img

def get_font(size, bold=True):
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
        return ImageFont.truetype(font_path, size)
    except:
        return ImageFont.load_default()

def build_comparison_card(title, left_img, left_label, right_img, right_label, summary, out_filename, side_w=740, side_h=340):
    card_w = side_w * 2 + 60
    header_h = 95
    footer_h = 65
    card_h = header_h + side_h + footer_h
    
    card = Image.new("RGB", (card_w, card_h), (248, 246, 242))
    draw = ImageDraw.Draw(card)
    
    font_title = get_font(18, bold=True)
    font_badge = get_font(13, bold=True)
    font_summary = get_font(13, bold=False)
    
    draw.text((30, 20), title, fill=(20, 20, 20), font=font_title)
    
    # Left Badge (Figma Spec - Green)
    l_text = f"[APPROVED FIGMA SPEC] {left_label}"
    b_l = draw.textbbox((0, 0), l_text, font=font_badge)
    bw_l = b_l[2] - b_l[0] + 24
    draw.rectangle([30, 56, 30 + bw_l, 84], fill=(235, 245, 235), outline=(46, 125, 50), width=2)
    draw.text((42, 62), l_text, fill=(46, 125, 50), font=font_badge)
    
    # Right Badge (Live Actual Defect - Red)
    right_x = side_w + 30
    r_text = f"[LIVE STAGING ACTUAL] {right_label}"
    b_r = draw.textbbox((0, 0), r_text, font=font_badge)
    bw_r = b_r[2] - b_r[0] + 24
    draw.rectangle([right_x, 56, right_x + bw_r, 84], fill=(253, 242, 242), outline=(211, 47, 47), width=2)
    draw.text((right_x + 12, 62), r_text, fill=(185, 28, 28), font=font_badge)
    
    # Resize keeping aspect ratio
    def fit(im, mw, mh):
        w, h = im.size
        s = min(mw/w, mh/h)
        nw, nh = max(int(w*s), 1), max(int(h*s), 1)
        res = im.resize((nw, nh), Image.Resampling.LANCZOS)
        box = Image.new("RGB", (mw, mh), (255, 255, 255))
        box.paste(res, ((mw - nw)//2, (mh - nh)//2))
        return box
        
    lb = fit(left_img, side_w - 4, side_h - 4)
    rb = fit(right_img, side_w - 4, side_h - 4)
    
    draw.rectangle([30, header_h, 30 + side_w, header_h + side_h], outline=(46, 125, 50), width=2)
    card.paste(lb, (32, header_h + 2))
    
    draw.rectangle([right_x, header_h, right_x + side_w, header_h + side_h], outline=(211, 47, 47), width=2)
    card.paste(rb, (right_x + 2, header_h + 2))
    
    draw.rectangle([30, header_h + side_h + 10, card_w - 30, header_h + side_h + 52], fill=(255, 255, 255), outline=(220, 220, 220))
    draw.text((45, header_h + side_h + 20), summary, fill=(35, 35, 35), font=font_summary)
    
    out_p = os.path.join(COMPARISON_DIR, out_filename)
    card.save(out_p, quality=95)
    print(f"✅ Saved comparison card: {out_filename}")

# ==============================================================================
# DEFECT 01: Table Header Copy Mismatches (EXPIRY DATE vs EXP. DATE; QUOTE NAME vs ORDER NAME)
# ==============================================================================
fig_th = fig_2x.crop((860, 700, 2660, 800))
live_th = dt.crop((440, 390, 1370, 480))
draw_red_box(live_th, (135, 12, 265, 45), width=3) # EXPIRY DATE
draw_red_box(live_th, (400, 12, 530, 45), width=3) # QUOTE NAME
live_th.save(os.path.join(DEFECTS_DIR, "DEFECT_01_HEADER_COPY_MISMATCH.png"))

build_comparison_card(
    title="DEFECT 01: Table Header Copy Mismatch (EXP. DATE & ORDER NAME)",
    left_img=fig_th,
    left_label="Figma Spec: 'EXP. DATE' and 'ORDER NAME'",
    right_img=live_th,
    right_label="Live Staging: 'EXPIRY DATE' and 'QUOTE NAME'",
    summary="DEFECT: Table column 2 displays 'EXPIRY DATE' (spec: 'EXP. DATE') and column 4 displays 'QUOTE NAME' (spec: 'ORDER NAME').",
    out_filename="COMPARISON_01_HEADER_COPY_MISMATCH.png",
    side_h=260
)

# ==============================================================================
# DEFECT 02: Raw Magento Blue Empty State Alert
# ==============================================================================
fig_table_full = fig_2x.crop((860, 700, 2660, 1100))
live_empty = dt.crop((440, 390, 1370, 520))
draw_red_box(live_empty, (10, 55, 920, 125), width=4)
live_empty.save(os.path.join(DEFECTS_DIR, "DEFECT_02_RAW_MAGENTO_EMPTY_ALERT.png"))

build_comparison_card(
    title="DEFECT 02: Raw Magento Blue Empty State Alert ('Table is empty!')",
    left_img=fig_table_full,
    left_label="Clean Brand-Aligned Table Design & Layout",
    right_img=live_empty,
    right_label="Unstyled Default Magento Blue Alert Box",
    summary="DEFECT: Live staging displays default unstyled Magento blue alert ('ⓘ Table is empty!') instead of a luxury branded empty state.",
    out_filename="COMPARISON_02_RAW_MAGENTO_EMPTY_ALERT.png",
    side_h=300
)

# ==============================================================================
# DEFECT 03: Missing FAQ Accordion Block (Frame 622)
# ==============================================================================
fig_faq = fig_2x.crop((860, 1100, 2660, 2200))
live_faq_area = dt.crop((440, 440, 1370, 750))
draw_red_box(live_faq_area, (10, 75, 920, 300), width=4)
live_faq_area.save(os.path.join(DEFECTS_DIR, "DEFECT_03_MISSING_FAQ_ACCORDION_BLOCK.png"))

build_comparison_card(
    title="DEFECT 03: Missing Self-Service FAQ Accordion Block (Frame 622)",
    left_img=fig_faq,
    left_label="Dedicated 'Frequently Asked Questions' Accordion Block",
    right_img=live_faq_area,
    right_label="100% MISSING From Live Staging DOM (Blank Space)",
    summary="DEFECT: Frame 622 specifies a dedicated FAQ accordion module below the table (up to 8 FAQs, single open). Completely absent on live staging.",
    out_filename="COMPARISON_03_MISSING_FAQ_ACCORDION_BLOCK.png",
    side_h=360
)

# ==============================================================================
# DEFECT 04: Missing Need Help Support Block (Frame 622)
# ==============================================================================
fig_help = fig_2x.crop((1200, 2400, 2200, 2750))
live_help_area = dt.crop((440, 550, 1370, 850))
draw_red_box(live_help_area, (10, 50, 920, 280), width=4)
live_help_area.save(os.path.join(DEFECTS_DIR, "DEFECT_04_MISSING_NEED_HELP_SUPPORT_BLOCK.png"))

build_comparison_card(
    title="DEFECT 04: Missing 'Need Help? Contact Our Sales Team' Support Block",
    left_img=fig_help,
    left_label="Dedicated Sales Contact Block (US Toll-Free & US Email)",
    right_img=live_help_area,
    right_label="100% MISSING From Live Staging DOM",
    summary="DEFECT: Frame 622 mandates a support content block beneath FAQs. Entire component is missing on live staging.",
    out_filename="COMPARISON_04_MISSING_NEED_HELP_SUPPORT_BLOCK.png",
    side_h=280
)

# ==============================================================================
# DEFECT 05: Missing Sidebar Numerical Count Badges
# ==============================================================================
fig_sb = fig_2x.crop((140, 520, 680, 1050))
live_sb = dt.crop((60, 200, 260, 480))
draw_red_box(live_sb, (10, 110, 185, 245), width=3)
live_sb.save(os.path.join(DEFECTS_DIR, "DEFECT_05_MISSING_SIDEBAR_COUNT_BADGES.png"))

build_comparison_card(
    title="DEFECT 05: Left Navigation Sidebar Missing Numerical Count Badges",
    left_img=fig_sb,
    left_label="Blue Pill Badges: Quotes [723], Holds [3], Orders [3]",
    right_img=live_sb,
    right_label="Zero Numerical Badges Rendered in Navigation Menu",
    summary="DEFECT: Figma design specifies count badges beside Quotes, Holds, and Orders. Live navigation menu renders plain text links with zero badges.",
    out_filename="COMPARISON_05_MISSING_SIDEBAR_COUNT_BADGES.png",
    side_h=340
)

print("\n🎉 ALL 5 VERIFIED DEFECT COMPARISONS REGENERATED PERFECTLY!")
