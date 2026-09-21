from PIL import Image, ImageDraw, ImageFont
import os

WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)'
RETEST_DIR = os.path.join(WORKSPACE_DIR, 'Ticket 5 - Header', 'retest_evidence')
OUT_DIR = os.path.join(WORKSPACE_DIR, 'Ticket 5 - Header', 'comparison')
ARTIFACT_DIR = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c'
os.makedirs(OUT_DIR, exist_ok=True)

# Load fonts
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_heading = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
except:
    font_title = font_heading = font_body = font_bold = None

# Colors
RED = (235, 30, 30)
GREEN = (34, 197, 94)
DARK_BG = (18, 18, 20)
CARD_BG = (28, 28, 32)
WHITE = (255, 255, 255)
GRAY = (160, 160, 170)

# ==============================================================================
# GRAPHIC 1: DEFECT - "Become a Trade Customer" Persists for Logged-In Trade User
# ==============================================================================
im_us_trade = Image.open(os.path.join(RETEST_DIR, '02_US_Trade_Header_Desktop.png')).convert('RGB')
# Crop header top bar & account area (x: 500..1440, y: 0..120)
# Or crop full header width 1440, height 120
crop_us = im_us_trade.crop((0, 0, 1440, 120))

# Resize to width 1100
target_w = 1100
scale = target_w / 1440
target_h = int(120 * scale)
crop_us_resized = crop_us.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Create Graphic 1 Canvas
g1_w = 1200
g1_h = 750
canvas1 = Image.new('RGB', (g1_w, g1_h), DARK_BG)
d1 = ImageDraw.Draw(canvas1)

# Header title
d1.text((40, 30), "TICKET 5: HEADER RE-TESTING AUDIT — DEFECT VERIFICATION", fill=WHITE, font=font_title)
d1.text((40, 65), "Requirement: 'Remove the \"Become a Trade Customer\" link when a user is logged in' (Figma Node 2424-21417)", fill=GRAY, font=font_body)

# Panel 1: US Staging Actual (RED BORDER)
p1_y = 110
d1.rectangle([40, p1_y, 40 + target_w + 20, p1_y + target_h + 90], fill=CARD_BG, outline=RED, width=3)
# Badge
d1.rectangle([50, p1_y + 12, 450, p1_y + 42], fill=(235, 30, 30))
d1.text((60, p1_y + 17), "ACTUAL (US STAGING LIVE) — DEFECT PERSISTS", fill=WHITE, font=font_bold)
d1.text((50, p1_y + 52), "User is Logged In as Trade Customer (My Account active), yet 'Become a Trade Customer' still displays:", fill=WHITE, font=font_body)

# Paste cropped US header
canvas1.paste(crop_us_resized, (50, p1_y + 80))

# Red highlight box around the offending "Become a Trade Customer" link in top bar
# Top bar link is roughly x: 920..1180 in original 1440px -> in 1100px: 50 + int(920*scale)
link_x1 = 50 + int(910 * scale)
link_x2 = 50 + int(1170 * scale)
link_y1 = p1_y + 80 + int(2 * scale)
link_y2 = p1_y + 80 + int(36 * scale)
for i in range(3):
    d1.rectangle([link_x1 - i, link_y1 - i, link_x2 + i, link_y2 + i], outline=RED)

# Panel 2: Expected Figma Spec (GREEN BORDER)
p2_y = p1_y + target_h + 120
d1.rectangle([40, p2_y, 40 + target_w + 20, p2_y + 240], fill=CARD_BG, outline=GREEN, width=3)
# Badge
d1.rectangle([50, p2_y + 12, 470, p2_y + 42], fill=(34, 197, 94))
d1.text((60, p2_y + 17), "EXPECTED FIGMA SPEC & DEVELOPER COMMITMENT", fill=WHITE, font=font_bold)

spec_lines = [
    "* Figma Node 2424-21417 Sticky Note Specification:",
    "   'Logged In - Trade Pricing View: Remove the \"Become a trade customer\" link when a user is logged in.'",
    "* Developer Vinod Vankar Reply (Teamwork):",
    "   'The \"Become a Trade Customer\" link is now in place and will only be visible when applicable (not shown to logged-in customers).'",
    "* Root Cause Analysis:",
    "   Implemented as static CMS block 'header-us-top-links-trade' without customer session condition,",
    "   causing it to render unconditionally to authenticated Trade users on desktop viewports."
]

cur_y = p2_y + 55
for line in spec_lines:
    color = (34, 197, 94) if line.startswith("*") else GRAY
    if "Root Cause" in line: color = (255, 200, 80)
    d1.text((60, cur_y), line, fill=color, font=font_body)
    cur_y += 26

out_path1 = os.path.join(OUT_DIR, 'DEFECT_HEADER_LOGGED_IN_TRADE_CTA_PERSISTS.png')
out_art1 = os.path.join(ARTIFACT_DIR, 'DEFECT_HEADER_LOGGED_IN_TRADE_CTA_PERSISTS.png')
canvas1.save(out_path1, quality=95)
canvas1.save(out_art1, quality=95)
print('Saved Graphic 1!')


# ==============================================================================
# GRAPHIC 2: 3-Panel Master Audit: US Guest vs US Trade vs AU Baseline
# ==============================================================================
im_us_guest = Image.open(os.path.join(RETEST_DIR, '01_US_Guest_Header_Desktop.png')).convert('RGB')
im_au_base = Image.open(os.path.join(RETEST_DIR, '06_AU_Baseline_Header_Desktop.png')).convert('RGB')

crop_guest = im_us_guest.crop((0, 0, 1440, 120)).resize((1080, 90), Image.Resampling.LANCZOS)
crop_trade = im_us_trade.crop((0, 0, 1440, 120)).resize((1080, 90), Image.Resampling.LANCZOS)
crop_au = im_au_base.crop((0, 0, 1440, 120)).resize((1080, 90), Image.Resampling.LANCZOS)

g2_w = 1200
g2_h = 700
canvas2 = Image.new('RGB', (g2_w, g2_h), DARK_BG)
d2 = ImageDraw.Draw(canvas2)

d2.text((40, 25), "HEADER TOP UTILITY BAR & DUAL-AUTH RE-TESTING MATRIX", fill=WHITE, font=font_title)
d2.text((40, 60), "Direct comparison between US Guest, US Trade Logged-In, and AU Baseline Storefronts", fill=GRAY, font=font_body)

# Panel 1: US Guest
y1 = 100
d2.rectangle([40, y1, 1160, y1 + 160], fill=CARD_BG, outline=(100, 100, 110), width=2)
d2.text((55, y1 + 10), "1. US Guest Mode (Logged Out): 'Become a Trade Customer' is PRESENT ([PASS] Expected)", fill=WHITE, font=font_bold)
canvas2.paste(crop_guest, (55, y1 + 45))

# Panel 2: US Trade
y2 = y1 + 180
d2.rectangle([40, y2, 1160, y2 + 160], fill=CARD_BG, outline=RED, width=3)
d2.text((55, y2 + 10), "2. US Trade Mode (Logged In): 'Become a Trade Customer' PERSISTS ([DEFECT] Must be Hidden)", fill=(255, 100, 100), font=font_bold)
canvas2.paste(crop_trade, (55, y2 + 45))
# highlight red box
d2.rectangle([55 + int(910 * (1080/1440)), y2 + 45 + 1, 55 + int(1170 * (1080/1440)), y2 + 45 + 26], outline=RED, width=2)

# Panel 3: AU Baseline
y3 = y2 + 180
d2.rectangle([40, y3, 1160, y3 + 160], fill=CARD_BG, outline=GREEN, width=3)
d2.text((55, y3 + 10), "3. AU Baseline (mcstaging2.globewest.com.au): Clean utility bar ('Book Showroom Appointment' only)", fill=(34, 197, 94), font=font_bold)
canvas2.paste(crop_au, (55, y3 + 45))

out_path2 = os.path.join(OUT_DIR, 'HEADER_TOP_BAR_DUAL_AUTH_MATRIX_COMPARISON.png')
out_art2 = os.path.join(ARTIFACT_DIR, 'HEADER_TOP_BAR_DUAL_AUTH_MATRIX_COMPARISON.png')
canvas2.save(out_path2, quality=95)
canvas2.save(out_art2, quality=95)
print('Saved Graphic 2!')
