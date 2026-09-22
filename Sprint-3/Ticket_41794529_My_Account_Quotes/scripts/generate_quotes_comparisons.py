#!/usr/bin/env python3
"""
Generate strictly scoped side-by-side comparison images for Ticket #41794529: My Account - Quotes.
Adheres strictly to:
- Frame 622 specifications & Figma Artboard (desktop/my_account/02_My Quotes)
- Red solid box (#FF0000) for Live Staging defects
- Green border (#2E7D32) for Figma Approved Specs
- Zero text burned onto screenshots
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes'
FIGMA_2X = os.path.join(BASE_DIR, 'figma', 'FIGMA_DESKTOP_MY_QUOTES_2X.jpg')
FIGMA_SPEC = os.path.join(BASE_DIR, 'figma', 'FIGMA_SPEC_FRAME_622.png')
FIGMA_MOBILE = os.path.join(BASE_DIR, 'figma', 'FIGMA_MOBILE_MY_QUOTES_SPEC.png')
LIVE_DESKTOP = os.path.join(BASE_DIR, 'screenshots', 'desktop', '01_my_quotes_live_staging.png')
LIVE_MOBILE = os.path.join(BASE_DIR, 'screenshots', 'mobile', '02_my_quotes_mobile_live_viewport.png')

COMPARISON_DIR = os.path.join(BASE_DIR, 'comparison')
DEFECTS_DIR = os.path.join(BASE_DIR, 'screenshots', 'defects')
os.makedirs(COMPARISON_DIR, exist_ok=True)
os.makedirs(DEFECTS_DIR, exist_ok=True)

im_figma_2x = Image.open(FIGMA_2X)
im_live_desktop = Image.open(LIVE_DESKTOP)
im_live_mobile = Image.open(LIVE_MOBILE)

def get_font(size, bold=True):
    try:
        font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
        if not os.path.exists(font_path):
            font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def draw_red_box(image, box_coords, width=3):
    """Draw solid red rectangle outline with NO text."""
    draw = ImageDraw.Draw(image)
    for i in range(width):
        draw.rectangle(
            [box_coords[0]-i, box_coords[1]-i, box_coords[2]+i, box_coords[3]+i],
            outline=(255, 0, 0)
        )
    return image

def build_side_by_side(
    title,
    left_img,
    left_label,
    right_img,
    right_label,
    summary,
    out_filename,
    side_w=740,
    side_h=400
):
    card_w = side_w * 2 + 60
    header_h = 95
    footer_h = 65
    card_h = header_h + side_h + footer_h
    
    card = Image.new('RGB', (card_w, card_h), (248, 246, 242))
    draw = ImageDraw.Draw(card)
    
    font_title = get_font(18, bold=True)
    font_badge = get_font(13, bold=True)
    font_summary = get_font(13, bold=False)
    
    # Card Title
    draw.text((30, 20), title, fill=(20, 20, 20), font=font_title)
    
    # Left Header Badge (Figma Spec - Green)
    left_text = f"[APPROVED FIGMA SPEC] {left_label}"
    bbox_l = draw.textbbox((0, 0), left_text, font=font_badge)
    badge_w_l = bbox_l[2] - bbox_l[0] + 24
    draw.rectangle([30, 56, 30 + badge_w_l, 84], fill=(235, 245, 235), outline=(46, 125, 50), width=2)
    draw.text((42, 62), left_text, fill=(46, 125, 50), font=font_badge)
    
    # Right Header Badge (Live Staging - Red)
    right_x = side_w + 30
    right_text = f"[LIVE STAGING ACTUAL] {right_label}"
    bbox_r = draw.textbbox((0, 0), right_text, font=font_badge)
    badge_w_r = bbox_r[2] - bbox_r[0] + 24
    draw.rectangle([right_x, 56, right_x + badge_w_r, 84], fill=(253, 242, 242), outline=(211, 47, 47), width=2)
    draw.text((right_x + 12, 62), right_text, fill=(185, 28, 28), font=font_badge)
    
    # Resize & Paste Images
    l_resized = left_img.resize((side_w - 4, side_h - 4), Image.Resampling.LANCZOS)
    r_resized = right_img.resize((side_w - 4, side_h - 4), Image.Resampling.LANCZOS)
    
    # Border around left image
    draw.rectangle([30, header_h, 30 + side_w, header_h + side_h], outline=(46, 125, 50), width=2)
    card.paste(l_resized, (32, header_h + 2))
    
    # Border around right image
    draw.rectangle([right_x, header_h, right_x + side_w, header_h + side_h], outline=(211, 47, 47), width=2)
    card.paste(r_resized, (right_x + 2, header_h + 2))
    
    # Footer summary
    draw.rectangle([30, header_h + side_h + 10, card_w - 30, header_h + side_h + 52], fill=(255, 255, 255), outline=(220, 220, 220))
    draw.text((45, header_h + side_h + 20), summary, fill=(35, 35, 35), font=font_summary)
    
    out_path = os.path.join(COMPARISON_DIR, out_filename)
    card.save(out_path, quality=95)
    print(f"✅ Saved comparison: {out_filename}")
    return out_path

# ==============================================================================
# PASS 01: Default Active Filter Tab (Frame 622 Rule 1: Default to "all")
# ==============================================================================
# Figma tabs crop
fig_tabs = im_figma_2x.crop((860, 520, 1850, 700))
# Live tabs crop
live_tabs = im_live_desktop.crop((440, 320, 960, 420))
# Red box around "OPEN" tab (x=90 to 138, y=52 to 80 in this crop)
draw_red_box(live_tabs, (90, 52, 138, 80), width=3)
live_tabs.save(os.path.join(DEFECTS_DIR, 'DEFECT_01_INCORRECT_DEFAULT_TAB_OPEN.png'))

build_side_by_side(
    title="PASS 01: Default Active Filter Tab (Frame 622 Rule 1: Default to 'ALL')",
    left_img=fig_tabs,
    left_label="Default to 'ALL' (Solid Pill Active State)",
    right_img=live_tabs,
    right_label="Erroneously Defaults to 'OPEN' Tab",
    summary="DEFECT: Frame 622 states 'Default to all'. Staging defaults to 'OPEN' with plain text underline.",
    out_filename="COMPARISON_PASS_01_DEFAULT_ACTIVE_TAB.png",
    side_h=300
)

# ==============================================================================
# PASS 02: Table Columns & Consolidated Actions Dropdown (Frame 622 Rule 3)
# ==============================================================================
fig_cols = im_figma_2x.crop((860, 700, 2660, 1050))
live_cols = im_live_desktop.crop((440, 400, 1360, 580))
# Red box around DETAILS column (x=765 to 812, y=32 to 60)
draw_red_box(live_cols, (765, 32, 812, 60), width=3)
# Red box around EXPIRY DATE (x=95 to 220, y=34 to 58)
draw_red_box(live_cols, (95, 34, 220, 58), width=3)
live_cols.save(os.path.join(DEFECTS_DIR, 'DEFECT_02_REDUNDANT_DETAILS_COLUMN.png'))

build_side_by_side(
    title="PASS 02: Table Columns & Consolidated Actions Dropdown (Frame 622 Rule 3)",
    left_img=fig_cols,
    left_label="8 Columns / Consolidated Actions Dropdown",
    right_img=live_cols,
    right_label="9 Columns (Redundant DETAILS Column & Full EXPIRY DATE)",
    summary="DEFECT: Live staging adds redundant DETAILS column. Figma consolidates all row actions into 'Actions ∨'.",
    out_filename="COMPARISON_PASS_02_TABLE_COLUMNS_AND_ACTIONS.png",
    side_h=320
)

# ==============================================================================
# PASS 03: Search Bar Row Alignment vs Filter Tabs
# ==============================================================================
fig_search = im_figma_2x.crop((860, 520, 2660, 700))
live_search = im_live_desktop.crop((440, 320, 1360, 420))
# Red box around search input on live (x=600 to 890, y=28 to 78)
draw_red_box(live_search, (600, 28, 890, 78), width=3)
live_search.save(os.path.join(DEFECTS_DIR, 'DEFECT_03_SEARCH_BAR_ALIGNMENT.png'))

build_side_by_side(
    title="PASS 03: Search Bar Placement & Same-Row Layout Alignment",
    left_img=fig_search,
    left_label="Search Bar Inline on Same Row as Tabs",
    right_img=live_search,
    right_label="Disconnected Search Bar Pushed Off-Row",
    summary="DEFECT: Search bar is designed inline on the same row as filter tabs; Live staging breaks layout alignment.",
    out_filename="COMPARISON_PASS_03_SEARCH_BAR_ALIGNMENT.png",
    side_h=300
)

# ==============================================================================
# PASS 04: Missing FAQ Accordion Block (Frame 622 Block 2)
# ==============================================================================
fig_faqs = im_figma_2x.crop((860, 1300, 2660, 2200))
live_faqs = im_live_desktop.crop((440, 560, 1360, 920))
# Red box around missing FAQ space on live
draw_red_box(live_faqs, (10, 10, 910, 350), width=4)
live_faqs.save(os.path.join(DEFECTS_DIR, 'DEFECT_04_MISSING_FAQ_BLOCK.png'))

build_side_by_side(
    title="PASS 04: Missing FAQ Accordion Block (Frame 622 Block 2)",
    left_img=fig_faqs,
    left_label="Dedicated FAQ Accordions Below Table (Up to 8 FAQs)",
    right_img=live_faqs,
    right_label="100% Missing FAQ Section (Empty White Space)",
    summary="CRITICAL DEFECT: Frame 622 specifies a dedicated FAQ Accordion section below the table; omitted on staging.",
    out_filename="COMPARISON_PASS_04_MISSING_FAQ_BLOCK.png",
    side_h=440
)

# ==============================================================================
# PASS 05: Missing 'Need help? Contact our sales team' Block (Frame 622 Block 3)
# ==============================================================================
fig_contact = im_figma_2x.crop((860, 2200, 2660, 2750))
live_contact = im_live_desktop.crop((440, 680, 1360, 920))
draw_red_box(live_contact, (10, 10, 910, 230), width=4)
live_contact.save(os.path.join(DEFECTS_DIR, 'DEFECT_05_MISSING_NEED_HELP_BLOCK.png'))

build_side_by_side(
    title="PASS 05: Missing Need Help / Contact Sales Block (Frame 622 Block 3)",
    left_img=fig_contact,
    left_label="Need Help / Contact Sales Team Content Block",
    right_img=live_contact,
    right_label="100% Missing Need Help Block",
    summary="CRITICAL DEFECT: Frame 622 specifies a dedicated Support/Contact block; omitted completely on live staging.",
    out_filename="COMPARISON_PASS_05_MISSING_NEED_HELP_BLOCK.png",
    side_h=360
)

# ==============================================================================
# PASS 06: Left Sidebar Account Navigation Count Badges
# ==============================================================================
fig_nav = im_figma_2x.crop((140, 360, 680, 850))
live_nav = im_live_desktop.crop((80, 180, 380, 480))
# Red box around Quotes/Holds/Orders in left nav (x=10 to 280, y=45 to 140)
draw_red_box(live_nav, (10, 45, 280, 140), width=3)
live_nav.save(os.path.join(DEFECTS_DIR, 'DEFECT_06_MISSING_SIDEBAR_BADGES.png'))

build_side_by_side(
    title="PASS 06: My Account Sidebar Count Badges",
    left_img=fig_nav,
    left_label="Numerical Count Badges [Quotes 723, Holds 3, Orders 3]",
    right_img=live_nav,
    right_label="Zero Count Badges in Navigation",
    summary="DEFECT: Figma artboard includes numerical pill count badges next to Quotes, Holds, and Orders navigation items.",
    out_filename="COMPARISON_PASS_06_SIDEBAR_COUNT_BADGES.png",
    side_h=400
)

# ==============================================================================
# PASS 07: Mobile Responsive Layout & Table Parity
# ==============================================================================
im_figma_mob = Image.open(FIGMA_MOBILE)
fig_mob = im_figma_mob.crop((870, 110, 1100, 680))
live_mob = im_live_mobile.crop((10, 160, 380, 650))
# Red box around raw Magento alert banner & unstyled tabs
draw_red_box(live_mob, (10, 150, 360, 290), width=3)
live_mob.save(os.path.join(DEFECTS_DIR, 'DEFECT_07_MOBILE_LAYOUT_PARITY.png'))

build_side_by_side(
    title="PASS 07: Mobile Responsive Layout (375px vs 390px Viewport)",
    left_img=fig_mob,
    left_label="Styled Mobile Segmented Tabs & Clean Mobile Table",
    right_img=live_mob,
    right_label="Unstyled Tabs & Raw Magento Alert Banner",
    summary="DEFECT: Mobile staging renders raw Magento blue alert banner, unstyled tabs, and completely omits FAQs block.",
    out_filename="COMPARISON_PASS_07_MOBILE_RESPONSIVE_PARITY.png",
    side_h=460
)

# ==============================================================================
# PASS 08: Australian Scope Leak on Storefront Footer
# ==============================================================================
# Figma footer without AU badge
fig_footer = im_figma_2x.crop((140, 2800, 2660, 3150))
# Live footer with Kangaroo badge
live_footer = im_live_desktop.crop((20, 1250, 400, 1600))
draw_red_box(live_footer, (15, 115, 190, 215), width=3)
live_footer.save(os.path.join(DEFECTS_DIR, 'DEFECT_08_AUSTRALIAN_KANGAROO_FOOTER_BADGE.png'))

build_side_by_side(
    title="PASS 08: Storefront Footer Scope Leak (Australian Kangaroo Logo)",
    left_img=fig_footer,
    left_label="US Storefront Clean Footer Baseline",
    right_img=live_footer,
    right_label="Leaking 'AUSTRALIAN OWNED & RUN' Badge",
    summary="SCOPE LEAK: US Storefront footer displays Australian kangaroo logo & 'AUSTRALIAN OWNED & RUN' copy.",
    out_filename="COMPARISON_PASS_08_FOOTER_SCOPE_LEAK.png",
    side_h=360
)

print("\n🎉 All 8 Ticket-Specific Side-by-Side Comparisons Generated Successfully!")
