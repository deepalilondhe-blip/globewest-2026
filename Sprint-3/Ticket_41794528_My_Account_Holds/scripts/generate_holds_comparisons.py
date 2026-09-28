import os
from PIL import Image, ImageDraw

COMP_DIR = 'Sprint-3/Ticket_41794528_My_Account_Holds/comparison'
os.makedirs(COMP_DIR, exist_ok=True)

RED = (255, 0, 0)      # Actual Defect
GREEN = (46, 125, 50)  # Approved Figma Spec
BORDER = 4

def add_border(img, color, width=BORDER):
    res = img.copy()
    draw = ImageDraw.Draw(res)
    w, h = res.size
    for i in range(width):
        draw.rectangle([i, i, w - 1 - i, h - 1 - i], outline=color)
    return res

def create_side_by_side(expected_img, actual_img, out_path, padding=24):
    target_h = max(expected_img.height, actual_img.height)
    
    def fit_height(im, h):
        if im.height == h:
            return im
        ratio = h / im.height
        new_w = int(im.width * ratio)
        return im.resize((new_w, h), Image.Resampling.LANCZOS)

    e_fit = fit_height(expected_img, target_h)
    a_fit = fit_height(actual_img, target_h)

    total_w = e_fit.width + a_fit.width + padding
    combined = Image.new('RGB', (total_w, target_h), (255, 255, 255))
    combined.paste(e_fit, (0, 0))
    combined.paste(a_fit, (e_fit.width + padding, 0))
    combined.save(out_path)
    print(f"Saved: {out_path}")

live_vp = Image.open('Sprint-3/Ticket_41794528_My_Account_Holds/screenshots/desktop/02_my_holds_desktop_live_viewport.png')
figma_art = Image.open('Sprint-3/Ticket_41794528_My_Account_Holds/figma/09_FIGMA_DESKTOP_HOLDS_ARTBOARD.png')

# -------------------------------------------------------------------------
# PASS 01: Table Columns & Redundant Actions Column + Typo 'CUST P0#'
# -------------------------------------------------------------------------
# Figma headers: x: 620 to 1340, y: 220 to 275
f_headers = figma_art.crop((620, 220, 1340, 275))
# Live headers: x: 440 to 1340, y: 405 to 465
l_headers = live_vp.crop((440, 405, 1340, 465))

create_side_by_side(
    add_border(f_headers, GREEN),
    add_border(l_headers, RED),
    os.path.join(COMP_DIR, 'COMPARISON_PASS_01_TABLE_COLUMNS_AND_ACTIONS.png')
)

# -------------------------------------------------------------------------
# PASS 02: Subtitle British/Australian Spelling ('favourite' vs 'favorite')
# -------------------------------------------------------------------------
# Live subtitle: x: 440 to 1100, y: 300 to 330
l_sub = live_vp.crop((440, 298, 1100, 332))
# Figma subtitle / standard: in Figma artboard y: 165 to 185
f_sub = figma_art.crop((620, 160, 1280, 190))

create_side_by_side(
    add_border(f_sub, GREEN),
    add_border(l_sub, RED),
    os.path.join(COMP_DIR, 'COMPARISON_PASS_02_SUBTITLE_SPELLING.png')
)

# -------------------------------------------------------------------------
# PASS 03: Support Block Australian Phone Leaked (+613 9518 1600)
# -------------------------------------------------------------------------
# Live support block: x: 440 to 1050, y: 780 to 900
l_supp = live_vp.crop((440, 780, 1050, 900))
# Figma support block: x: 620 to 1050, y: 760 to 860
f_supp = figma_art.crop((620, 760, 1050, 860))

create_side_by_side(
    add_border(f_supp, GREEN),
    add_border(l_supp, RED),
    os.path.join(COMP_DIR, 'COMPARISON_PASS_03_SUPPORT_BLOCK_PHONE.png')
)

# -------------------------------------------------------------------------
# PASS 04: Sidebar Account Navigation Badges
# -------------------------------------------------------------------------
# Figma sidebar: x: 465 to 585, y: 195 to 350
f_side = figma_art.crop((465, 195, 585, 350))
# Live sidebar: x: 65 to 260, y: 340 to 490
l_side = live_vp.crop((65, 340, 260, 490))

create_side_by_side(
    add_border(f_side, GREEN),
    add_border(l_side, RED),
    os.path.join(COMP_DIR, 'COMPARISON_PASS_04_SIDEBAR_COUNT_BADGES.png')
)

print("Finished generating refined comparisons!")
