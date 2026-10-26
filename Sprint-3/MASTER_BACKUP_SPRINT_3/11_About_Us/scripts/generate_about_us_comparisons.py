import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DESKTOP = os.path.join(BASE_DIR, 'screenshots', 'desktop')
SCREENSHOTS_MOBILE = os.path.join(BASE_DIR, 'screenshots', 'mobile')
COMP_DIR = os.path.join(BASE_DIR, 'comparison')
os.makedirs(COMP_DIR, exist_ok=True)

# Colors
COLOR_GREEN = (46, 125, 50)      # AU Reference / Approved
COLOR_RED = (211, 47, 47)         # Defect
COLOR_BLUE = (25, 118, 210)       # Info / Neutral Match
COLOR_BG = (248, 249, 250)
COLOR_TEXT_MAIN = (33, 37, 41)
COLOR_TEXT_MUTED = (108, 117, 125)

# Attempt to load fonts
try:
    FONT_TITLE = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
    FONT_HEADER = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    FONT_SUB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
    FONT_BADGE = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
except Exception:
    FONT_TITLE = ImageFont.load_default()
    FONT_HEADER = ImageFont.load_default()
    FONT_SUB = ImageFont.load_default()
    FONT_BADGE = ImageFont.load_default()

def create_comparison_card(
    card_title,
    card_desc,
    au_crop,
    us_crop,
    out_filename,
    us_is_defect=False,
    defect_label="US DEFECT",
    match_label="US STAGING (MATCH)",
    au_label="AU BASELINE (APPROVED REFERENCE)"
):
    target_width = 700
    
    # Resize AU to target_width maintaining aspect ratio
    au_w, au_h = au_crop.size
    au_target_h = int(au_h * (target_width / au_w))
    au_resized = au_crop.resize((target_width, au_target_h), Image.Resampling.LANCZOS)
    
    # Resize US to target_width maintaining aspect ratio
    us_w, us_h = us_crop.size
    us_target_h = int(us_h * (target_width / us_w))
    us_resized = us_crop.resize((target_width, us_target_h), Image.Resampling.LANCZOS)
    
    # Maximum height between both
    max_img_h = max(au_target_h, us_target_h)
    
    # Card layout dimensions
    pad = 30
    top_header_h = 100
    sub_header_h = 45
    total_w = target_width * 2 + pad * 3
    total_h = top_header_h + sub_header_h + max_img_h + pad * 2
    
    card = Image.new('RGB', (total_w, total_h), COLOR_BG)
    draw = ImageDraw.Draw(card)
    
    # Header Background
    draw.rectangle([0, 0, total_w, top_header_h], fill=(255, 255, 255))
    draw.line([0, top_header_h, total_w, top_header_h], fill=(222, 226, 230), width=2)
    
    # Title & Description
    draw.text((pad, 20), card_title, fill=COLOR_TEXT_MAIN, font=FONT_TITLE)
    draw.text((pad, 58), card_desc, fill=COLOR_TEXT_MUTED, font=FONT_SUB)
    
    # AU Section Header (Left)
    au_x = pad
    au_y = top_header_h + 20
    draw.rectangle([au_x, au_y, au_x + target_width, au_y + sub_header_h], fill=COLOR_GREEN)
    draw.text((au_x + 15, au_y + 12), au_label, fill=(255, 255, 255), font=FONT_HEADER)
    
    # US Section Header (Right)
    us_x = au_x + target_width + pad
    us_y = top_header_h + 20
    us_header_color = COLOR_RED if us_is_defect else COLOR_GREEN
    us_header_text = defect_label if us_is_defect else match_label
    draw.rectangle([us_x, us_y, us_x + target_width, us_y + sub_header_h], fill=us_header_color)
    draw.text((us_x + 15, us_y + 12), us_header_text, fill=(255, 255, 255), font=FONT_HEADER)
    
    # Place Images
    img_y = au_y + sub_header_h
    card.paste(au_resized, (au_x, img_y))
    card.paste(us_resized, (us_x, img_y))
    
    # Borders around images
    draw.rectangle([au_x, au_y, au_x + target_width, img_y + au_target_h], outline=COLOR_GREEN, width=3)
    draw.rectangle([us_x, us_y, us_x + target_width, img_y + us_target_h], outline=us_header_color, width=3)
    
    out_path = os.path.join(COMP_DIR, out_filename)
    card.save(out_path, quality=95)
    print(f"Saved: {out_path}")

def run():
    au_full = Image.open(os.path.join(SCREENSHOTS_DESKTOP, '01_AU_AUTH_desktop_about_us_full.png'))
    us_full = Image.open(os.path.join(SCREENSHOTS_DESKTOP, '03_US_AUTH_desktop_about_us_full.png'))
    
    # Card 01: Hero Banner (AU test vs US About Us)
    create_comparison_card(
        "Hero Banner & Title Comparison",
        "AU Baseline displays test staging copy ('About Us test'), US Staging correctly renders clean 'About Us' title.",
        au_full.crop((0, 0, 1425, 765)),
        us_full.crop((0, 0, 1425, 766)),
        "01_Hero_Banner_Comparison.png",
        us_is_defect=False,
        match_label="US STAGING (PROPER TITLE)",
        au_label="AU BASELINE (HAS TEST TITLE)"
    )
    
    # Card 02: Our Vision & Founders (Alan & Stephen Mendel)
    create_comparison_card(
        "Our Vision & Founders (Our Business)",
        "Both AU and US render identical layout, imagery, and typography for Alan & Stephen Mendel's story.",
        au_full.crop((0, 765, 1425, 2176)),
        us_full.crop((0, 766, 1425, 2177)),
        "02_Founders_Our_Business_Comparison.png",
        us_is_defect=False
    )
    
    # Card 03: Design Diversity (5 Styles Grid)
    create_comparison_card(
        "Design Diversity (5-Column Grid)",
        "Contemporary, Modern, Classic, Eclectic, and Retreat cards render identical styling, imagery, and fonts.",
        au_full.crop((0, 2176, 1425, 2871)),
        us_full.crop((0, 2177, 1425, 2871)),
        "03_Design_Diversity_Comparison.png",
        us_is_defect=False
    )
    
    # Card 04: Brand Video & Quote
    create_comparison_card(
        "Stephen Mendel Quote & Brand Video",
        "Quote block and Elba Landscape video banner display matching layout and styling.",
        au_full.crop((0, 2871, 1425, 3987)),
        us_full.crop((0, 2871, 1425, 4047)),
        "04_Quote_and_Video_Comparison.png",
        us_is_defect=False
    )
    
    # Card 05: Our Approach (6 Principles & Team Photo)
    create_comparison_card(
        "Our Approach & Team Photo",
        "Principles match. Note: AU baseline had stray '<' characters in copy, which US staging correctly resolved.",
        au_full.crop((0, 3987, 1425, 5187)),
        us_full.crop((0, 4047, 1425, 5253)),
        "05_Our_Approach_and_Team_Comparison.png",
        us_is_defect=False
    )
    
    # Card 06: Careers Section (Content & Button Match)
    create_comparison_card(
        "Careers Block & Buttons Comparison",
        "Headings, body copy, and both CTA buttons ('VIEW CAREERS PAGE' and 'REGISTER YOUR INTEREST') match AU baseline styling and dimensions.",
        au_full.crop((0, 5187, 1425, 5600)),
        us_full.crop((0, 5253, 1425, 5670)),
        "06_Careers_Block_and_Buttons_Comparison.png",
        us_is_defect=False,
        match_label="US STAGING (MATCH)",
        au_label="AU BASELINE REFERENCE"
    )
    
    # Card 07: Mobile Viewport Comparison
    au_mob = Image.open(os.path.join(SCREENSHOTS_MOBILE, '02_AU_AUTH_mobile_about_us_viewport.png'))
    us_mob = Image.open(os.path.join(SCREENSHOTS_MOBILE, '04_US_AUTH_mobile_about_us_viewport.png'))
    create_comparison_card(
        "Mobile Viewport Comparison (390px)",
        "Mobile viewport renders identical responsive layout, navigation bar, and hero banner alignment.",
        au_mob,
        us_mob,
        "07_Mobile_Viewport_Comparison.png",
        us_is_defect=False
    )

    # Card 08: Tablet Viewport Comparison (768px)
    au_tab = Image.open(os.path.join(BASE_DIR, 'screenshots', 'AU_tablet_about_us.png'))
    us_tab = Image.open(os.path.join(BASE_DIR, 'screenshots', 'US_tablet_about_us.png'))
    create_comparison_card(
        "Tablet Viewport Comparison (768px)",
        "Tablet viewport collapses gracefully with identical section heights, image ratios, and navigation across AU & US.",
        au_tab,
        us_tab,
        "08_Tablet_Viewport_Comparison.png",
        us_is_defect=False
    )

if __name__ == '__main__':
    run()
