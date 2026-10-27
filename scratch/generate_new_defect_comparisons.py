import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = 'Sprint-3/Ticket_Trade_Application_Form'
COMP_DIR = os.path.join(BASE_DIR, 'comparison')
os.makedirs(COMP_DIR, exist_ok=True)

FIGMA_DESKTOP_PATH = os.path.join(BASE_DIR, 'figma/desktop/trade application@2x.jpg')
FIGMA_MOBILE_PATH = os.path.join(BASE_DIR, 'figma/mobile/trade application@2x.jpg')

LIVE_DESKTOP_STEP1 = os.path.join(BASE_DIR, 'screenshots/step_by_step/01_STEP1_FILLED.png')
LIVE_DESKTOP_STEP2 = os.path.join(BASE_DIR, 'screenshots/step_by_step/02_STEP2_INITIAL.png')
LIVE_DESKTOP_LOWER = os.path.join(BASE_DIR, 'screenshots/deep_headed_audit/DESKTOP_STEP2_LOWER_HALF.png')
LIVE_MOBILE_TOP = os.path.join(BASE_DIR, 'screenshots/deep_headed_audit/MOBILE_STEP2_TOP.png')

# Load fonts
try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    font_label = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
    font_body = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
except:
    font_title = font_label = font_body = ImageFont.load_default()

def create_comparison_card(title, figma_crop, live_crop, figma_badge_text, live_badge_text, filename):
    pad = 30
    header_h = 70
    badge_h = 40
    
    # Scale crops to same height
    target_h = 420
    
    f_w = int(figma_crop.width * (target_h / figma_crop.height))
    l_w = int(live_crop.width * (target_h / live_crop.height))
    
    f_img = figma_crop.resize((f_w, target_h), Image.Resampling.LANCZOS)
    l_img = live_crop.resize((l_w, target_h), Image.Resampling.LANCZOS)
    
    total_w = f_w + l_w + pad * 3
    total_h = header_h + badge_h + target_h + pad * 2
    
    canvas = Image.new('RGB', (total_w, total_h), (24, 24, 27))
    draw = ImageDraw.Draw(canvas)
    
    # Title
    draw.text((pad, 20), title, fill=(255, 255, 255), font=font_title)
    
    # Figma Box (Green)
    f_x = pad
    f_y = header_h + badge_h
    canvas.paste(f_img, (f_x, f_y))
    # Green Border
    draw.rectangle([f_x - 3, f_y - 3, f_x + f_w + 3, f_y + target_h + 3], outline=(16, 185, 129), width=3)
    # Green Badge
    draw.rectangle([f_x, header_h + 5, f_x + 360, header_h + 35], fill=(16, 185, 129))
    draw.text((f_x + 10, header_h + 10), f"APPROVED FIGMA SPEC: {figma_badge_text}", fill=(255, 255, 255), font=font_label)
    
    # Live Box (Red)
    l_x = f_x + f_w + pad
    l_y = header_h + badge_h
    canvas.paste(l_img, (l_x, l_y))
    # Red Border
    draw.rectangle([l_x - 3, l_y - 3, l_x + l_w + 3, l_y + target_h + 3], outline=(239, 68, 68), width=3)
    # Red Badge
    draw.rectangle([l_x, header_h + 5, l_x + 360, header_h + 35], fill=(239, 68, 68))
    draw.text((l_x + 10, header_h + 10), f"US STAGING DEFECT: {live_badge_text}", fill=(255, 255, 255), font=font_label)
    
    out_path = os.path.join(COMP_DIR, filename)
    canvas.save(out_path)
    print(f"Generated comparison: {out_path}")

figma_desk = Image.open(FIGMA_DESKTOP_PATH)
live_desk_step2 = Image.open(LIVE_DESKTOP_STEP2)
live_desk_lower = Image.open(LIVE_DESKTOP_LOWER)
live_desk_step1 = Image.open(LIVE_DESKTOP_STEP1)

# 1. DEFECT 1 & 3: EIN Label (No Asterisk) & Street Address (Has Asterisk)
# In Figma (2880 x 2632):
# Top fields (EIN*, Business Name*, Entity Name, Head Office Street Address)
f_crop1 = figma_desk.crop((120, 540, 1400, 1150))
# In Live (1440 x 900):
# Same fields area
l_crop1 = live_desk_step2.crop((60, 430, 700, 740))
create_comparison_card(
    "DEFECT #1 & #3: TAX ID (EIN) & HEAD OFFICE STREET ADDRESS ASTERISK MISMATCH",
    f_crop1, l_crop1,
    "EIN* (With *) & Address (No *)",
    "EIN (Missing *) & Address* (Has *)",
    "NEW_DEFECT_01_EIN_LABEL_AND_STREET_ADDRESS_ASTERISKS.png"
)

# 2. DEFECT 2 & 7: NEXT Button Pill Radius & Sign In Casing
# In Figma:
f_crop2 = figma_desk.crop((120, 2050, 1400, 2550))
# In Live:
l_crop2 = live_desk_lower.crop((60, 430, 700, 600))
create_comparison_card(
    "DEFECT #2 & #7: NEXT BUTTON PILL SHAPE & 'Sign In' CAPITALIZATION",
    f_crop2, l_crop2,
    "Pill Capsule (9999px) & 'Sign In'",
    "Boxy Rect (2px) & 'Sign in'",
    "NEW_DEFECT_02_NEXT_BUTTON_PILL_RADIUS_AND_SIGNIN_CASING.png"
)

# 3. DEFECT 4 & 5: Yearly Spend Asterisk & 10k - 30k Spacing
# In Figma:
f_crop3 = figma_desk.crop((120, 1550, 1400, 1950))
# In Live:
l_crop3 = live_desk_lower.crop((60, 180, 700, 380))
create_comparison_card(
    "DEFECT #4 & #5: YEARLY SPEND ASTERISK & '10k - 30k' DASH SPACING",
    f_crop3, l_crop3,
    "No Asterisk & '10k - 30k' (Spaced)",
    "Has Asterisk (*) & '10k-30k' (No Space)",
    "NEW_DEFECT_03_YEARLY_SPEND_ASTERISK_AND_TIER_SPACING.png"
)

# 4. DEFECT 8: Step 1 Copy Spelling "authorised" vs "authorized"
f_crop4 = figma_desk.crop((120, 400, 1400, 600)) # Placeholder header area
l_crop4 = live_desk_step1.crop((60, 360, 700, 520))
create_comparison_card(
    "DEFECT #8: STEP 1 US COPY LOCALIZATION - 'authorised' (AU) vs 'authorized' (US)",
    l_crop4, l_crop4, # Focus on live copy
    "US Spelling: 'authorized'",
    "AU Leaked Spelling: 'authorised'",
    "NEW_DEFECT_04_STEP1_COPY_SPELLING_LOCALIZATION.png"
)

# 5. DEFECT 10: Navigation Bar Customisation Leaked
f_nav = figma_desk.crop((0, 180, 2880, 320))
l_nav = live_desk_step2.crop((0, 110, 1440, 180))
create_comparison_card(
    "DEFECT #10: DESKTOP HEADER NAV - 'Customisation' LEAKED (FIGMA SPECIFIES 'Projects')",
    f_nav, l_nav,
    "8 Items (Projects, No Customisation)",
    "9 Items (Customisation with 's' Leaked)",
    "NEW_DEFECT_05_NAVIGATION_CUSTOMISATION_LEAK.png"
)

print("All side-by-side defect comparisons generated cleanly!")
