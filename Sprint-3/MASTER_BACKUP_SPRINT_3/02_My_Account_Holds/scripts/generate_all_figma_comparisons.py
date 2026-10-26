import os
from PIL import Image, ImageDraw, ImageFont

COMP_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794528_My_Account_Holds/comparison'
os.makedirs(COMP_DIR, exist_ok=True)

# Load base crops
f_desk = Image.open(os.path.join(COMP_DIR, 'temp_figma_desk_crop.png'))
f_mob = Image.open(os.path.join(COMP_DIR, 'temp_figma_mob_crop.png'))
f_notes = Image.open(os.path.join(COMP_DIR, 'temp_figma_notes_crop.png'))

l_desk = Image.open('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794528_My_Account_Holds/screenshots/live_retest/desktop/04_table_area_columns.png')
l_mob = Image.open('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794528_My_Account_Holds/screenshots/live_retest/mobile/03_mobile_holds_table_area.png')

# Colors
GREEN = (46, 125, 50)       # #2E7D32 Approved Figma / Passed
RED = (211, 47, 47)         # #D32F2F Live Defect
BG_LIGHT = (248, 249, 250)
TEXT_DARK = (33, 37, 41)
WHITE = (255, 255, 255)
BORDER_WIDTH = 4

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_title = get_font(20, bold=True)
font_label = get_font(15, bold=True)
font_desc = get_font(14, bold=False)

def add_box_border(im, color, width=BORDER_WIDTH):
    res = im.copy()
    draw = ImageDraw.Draw(res)
    w, h = res.size
    for i in range(width):
        draw.rectangle([i, i, w - 1 - i, h - 1 - i], outline=color)
    return res

def render_comparison_card(title, expected_img, actual_img, expected_label, actual_label, actual_status_color, notes_text, out_path):
    target_h = max(expected_img.height, actual_img.height)
    
    def scale_to_h(im, h):
        if im.height == h:
            return im
        new_w = max(1, int(im.width * (h / im.height)))
        return im.resize((new_w, h), Image.Resampling.LANCZOS)
    
    e_scaled = scale_to_h(expected_img, target_h)
    a_scaled = scale_to_h(actual_img, target_h)
    
    e_bordered = add_box_border(e_scaled, GREEN)
    a_bordered = add_box_border(a_scaled, actual_status_color)
    
    padding = 24
    header_h = 70
    badge_h = 36
    footer_h = 75
    gap = 24
    
    dummy = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    e_txt_w = dummy.textlength(expected_label, font=font_label) + 24
    a_txt_w = dummy.textlength(actual_label, font=font_label) + 24
    
    col_w = max(int(max(e_txt_w, a_txt_w, e_bordered.width, a_bordered.width, 500)), 500)
    
    total_w = padding * 2 + col_w * 2 + gap
    total_h = header_h + padding + badge_h + target_h + padding + footer_h + padding
    
    card = Image.new('RGB', (total_w, total_h), BG_LIGHT)
    draw = ImageDraw.Draw(card)
    
    # Title Header Banner
    draw.rectangle([0, 0, total_w, header_h], fill=(30, 41, 59))
    draw.text((padding, 16), title, font=font_title, fill=WHITE)
    draw.text((padding, 42), "GlobeWest Ticket #41794528: My Account - Holds QA Audit", font=font_desc, fill=(203, 213, 225))
    
    col1_x = padding
    col2_x = padding + col_w + gap
    y_badge = header_h + padding
    y_panels = y_badge + badge_h
    
    # Column 1 Header Badge (GREEN)
    draw.rectangle([col1_x, y_badge, col1_x + col_w, y_panels], fill=GREEN)
    draw.text((col1_x + 12, y_badge + 8), expected_label, font=font_label, fill=WHITE)
    
    # Column 2 Header Badge (RED / GREEN)
    draw.rectangle([col2_x, y_badge, col2_x + col_w, y_panels], fill=actual_status_color)
    draw.text((col2_x + 12, y_badge + 8), actual_label, font=font_label, fill=WHITE)
    
    # Center images inside columns
    e_x = col1_x + (col_w - e_bordered.width) // 2
    a_x = col2_x + (col_w - a_bordered.width) // 2
    
    card.paste(e_bordered, (e_x, y_panels))
    card.paste(a_bordered, (a_x, y_panels))
    
    # Footer Notes Box
    footer_y = y_panels + target_h + 16
    draw.rectangle([padding, footer_y, total_w - padding, footer_y + footer_h], fill=WHITE, outline=(226, 232, 240))
    draw.rectangle([padding, footer_y, padding + 6, footer_y + footer_h], fill=actual_status_color)
    
    lines = notes_text.split('\n')
    line_y = footer_y + 12
    for l in lines:
        draw.text((padding + 16, line_y), l, font=font_desc, fill=TEXT_DARK)
        line_y += 20
        
    card.save(out_path)
    print(f"Generated comparison card: {out_path}")

print("Regenerating refined comparison cards...")

# 1. HOLD COUNT BADGE (VERIFIED FIX)
crop_f_badge = f_desk.crop((35, 140, 215, 340))
crop_l_badge = l_desk.crop((60, 200, 335, 450))

render_comparison_card(
    title="Sidebar Navigation: Hold Count Badge (Developer Update Verified)",
    expected_img=crop_f_badge,
    actual_img=crop_l_badge,
    expected_label="EXPECTED (Figma Spec): Holds [3] Blue Pill Badge",
    actual_label="ACTUAL (Live Staging): Holds [5] Verified Fixed",
    actual_status_color=GREEN,
    notes_text="VERIFIED FIXED: Developer added blue pill badge (.item__counter) to sidebar navigation.\nLive renders Holds [5], Quotes [10], Orders [8]. Total 5 matches 3 Active + 2 Inactive holds.\nFigma design and pill styling verified matching on live US staging storefront.",
    out_path=os.path.join(COMP_DIR, '01_COMP_SIDEBAR_HOLD_COUNT_BADGE.png')
)

# 2. DATE FORMAT LOCALIZATION
crop_f_date_note = f_notes.crop((140, 70, 385, 140))
crop_l_dates = l_desk.crop((345, 310, 680, 520))

render_comparison_card(
    title="Date Localization: USA Date Format Requirement vs Live AU Format",
    expected_img=crop_f_date_note,
    actual_img=crop_l_dates,
    expected_label="EXPECTED (Figma Frame 621): 'ensure dates displayed are in USA format'",
    actual_label="ACTUAL (Live Staging): Leaked AU Format DD/MM/YY (14/10/26)",
    actual_status_color=RED,
    notes_text="ACTIVE DEFECT: Frame 621 explicitly specifies dates must display in USA format (MM/DD/YYYY or MM/DD/YY).\nLive table displays Australian DD/MM/YY: 14/10/26, 07/10/26, 02/10/26 (Day 14 cannot be a US month).\nFix Required: Localize date format to MM/DD/YYYY (e.g. 10/14/2026) for the US Storefront.",
    out_path=os.path.join(COMP_DIR, '02_COMP_DATE_FORMAT_AU_VS_USA.png')
)

# 3. TABLE HEADER TYPO: CUST P0# vs CUST PO#
crop_f_hdr = f_desk.crop((245, 205, 775, 290))
crop_l_hdr = l_desk.crop((345, 310, 1335, 420))

render_comparison_card(
    title="Table Header Typo: 'CUST P0#' with Numeric Zero instead of Letter 'O'",
    expected_img=crop_f_hdr,
    actual_img=crop_l_hdr,
    expected_label="EXPECTED (Figma Spec): 'CUST PO#' (Letter 'O' for Purchase Order)",
    actual_label="ACTUAL (Live Staging): 'CUST P0#' (Contains Numeric Digit Zero '0')",
    actual_status_color=RED,
    notes_text="ACTIVE DEFECT: Column 3 header in live DOM renders 'CUST P0#' using digit 0 instead of uppercase 'O'.\nFigma design specifies standard abbreviation 'CUST PO#' (Customer Purchase Order Number).\nFix Required: Update header string in template/translation to 'CUST PO#'.",
    out_path=os.path.join(COMP_DIR, '03_COMP_TABLE_HEADER_TYPO_CUST_PO.png')
)

# 4. MOBILE TABLE LAYOUT & ACTIONS BUTTON CLIPPING
crop_f_mob_tbl = f_mob.crop((8, 190, 210, 330))
crop_l_mob_tbl = l_mob.crop((15, 410, 375, 650))

render_comparison_card(
    title="Mobile Viewport (390px): Column Order Mismatch & Actions Button Clipping",
    expected_img=crop_f_mob_tbl,
    actual_img=crop_l_mob_tbl,
    expected_label="EXPECTED (Figma 375px): HOLD | DATE | TOTAL | STATUS | ACTIONS",
    actual_label="ACTUAL (Live 390px): Swapped Order + Actions Button Clipped",
    actual_status_color=RED,
    notes_text="ACTIVE DEFECT: 1) Column order mismatch: Live has STATUS before TOTAL; Figma specifies TOTAL before STATUS.\n2) Button clipping: The 'Actions' dropdown button overflows the 390px viewport and is cut off at the right edge.\nFix Required: Adjust column widths / padding on mobile and align column sequence to Figma.",
    out_path=os.path.join(COMP_DIR, '04_COMP_MOBILE_TABLE_CLIPPING_AND_ORDER.png')
)

# 5. TABLE ARCHITECTURE: ACTIONS COLUMN & DROPDOWN LOGIC
crop_f_full_tbl = f_desk.crop((245, 205, 775, 360))
crop_l_full_tbl = l_desk.crop((345, 310, 1335, 575))

render_comparison_card(
    title="Table Architecture: Actions Column & Dropdown Multi-Action Logic",
    expected_img=crop_f_full_tbl,
    actual_img=crop_l_full_tbl,
    expected_label="EXPECTED (Frame 621 Spec): Dropdown for Multiple Actions",
    actual_label="ACTUAL (Live Staging): Complies (VIEW + MODIFY/CONFIRM / Reactivate)",
    actual_status_color=GREEN,
    notes_text="VERIFIED CONFORMANT: Frame 621 states: 'if only action is view, hide column; otherwise actions housed under dropdown'.\nLive table has multiple actions per hold: Active rows have VIEW and MODIFY/ CONFIRM; Inactive rows have VIEW and Reactivate.\nHousing these actions under the 'Actions' dropdown on desktop and mobile complies with the specification.",
    out_path=os.path.join(COMP_DIR, '05_COMP_TABLE_ACTIONS_DROPDOWN_ARCHITECTURE.png')
)

# 6. SUBTITLE SPELLING ('FAVOURITE' vs 'FAVORITE')
crop_f_sub = f_desk.crop((245, 125, 700, 185))
crop_l_sub = l_desk.crop((300, 185, 1050, 290))

render_comparison_card(
    title="Editorial Copy: British/Australian Spelling ('favourite' vs US 'favorite')",
    expected_img=crop_f_sub,
    actual_img=crop_l_sub,
    expected_label="EXPECTED (US Localization): American English 'favorite'",
    actual_label="ACTUAL (Live Staging): AU/UK English 'favourite'",
    actual_status_color=RED,
    notes_text="COSMETIC DEFECT: Live subtitle reads: 'A product hold reserves your favourite items for 2 business days.'\nUS Storefront standards require American English spelling: 'favorite' instead of 'favourite'.\nFix Required: Update copy translation on US storefront to 'favorite'.",
    out_path=os.path.join(COMP_DIR, '06_COMP_SUBTITLE_SPELLING_FAVOURITE.png')
)

# 7. SUPPORT BLOCK PHONE (AUSTRALIAN PHONE LEAKAGE)
crop_f_supp = f_desk.crop((245, 770, 650, 870))
l_full = Image.open('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794528_My_Account_Holds/screenshots/live_retest/desktop/01_desktop_holds_full_page.png')
crop_l_supp = l_full.crop((440, 880, 1050, 1010))

render_comparison_card(
    title="Customer Support Block: Australian Phone Number Prefix (+613 9518 1600)",
    expected_img=crop_f_supp,
    actual_img=crop_l_supp,
    expected_label="EXPECTED (US Contact Spec): Localized US Sales Support Details",
    actual_label="ACTUAL (Live Staging): Leaked AU Phone Prefix (+613 9518 1600)",
    actual_status_color=RED,
    notes_text="OBSERVATION / DEFECT: Need Help block on US Storefront displays Australian phone number '+613 9518 1600'.\nFor US trade customers, US localized contact details (US toll-free or US headquarters number) should be shown.\nFix Required: Update customer support contact block template for the US store view.",
    out_path=os.path.join(COMP_DIR, '07_COMP_SUPPORT_BLOCK_PHONE.png')
)

print("All 7 comparison cards updated!")
