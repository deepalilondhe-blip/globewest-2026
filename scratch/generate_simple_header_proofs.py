from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)'
ARTIFACT_DIR = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c'
HEADER_RETEST_DIR = os.path.join(OUT_DIR, 'Header_Cross_Verification')

RED = (235, 30, 30)
GREEN = (34, 197, 94)
LINE_WIDTH = 3

# Load raw captures
im_us_trade = Image.open(os.path.join(HEADER_RETEST_DIR, '03_US_Trade_Logged_In_Header_Raw.png')).convert('RGB')
im_au_base = Image.open(os.path.join(HEADER_RETEST_DIR, '01_AU_Baseline_Header_Raw.png')).convert('RGB')

# ─────────────────────────────────────────────────────────────────────────────
# 1. SIMPLE RED HIGHLIGHTED SCREENSHOT (US TRADE LOGGED-IN DEFECT)
# ─────────────────────────────────────────────────────────────────────────────
im_simple_red = im_us_trade.copy()
draw_simple = ImageDraw.Draw(im_simple_red)

# Box around "Become a Trade Customer": x: [944, 1136], y: [4, 30]
box_trade_link = [942, 3, 1138, 30]
for i in range(LINE_WIDTH):
    draw_simple.rectangle([box_trade_link[0] - i, box_trade_link[1] - i, box_trade_link[2] + i, box_trade_link[3] + i], outline=RED)

out_simple_path1 = os.path.join(OUT_DIR, 'Header_Screenshots_For_Michelle', 'HEADER_LOGGED_IN_TRADE_CTA_DEFECT_SIMPLE_RED.png')
out_simple_path2 = os.path.join(ARTIFACT_DIR, 'HEADER_LOGGED_IN_TRADE_CTA_DEFECT_SIMPLE_RED.png')
out_simple_comp = os.path.join(OUT_DIR, 'Ticket 5 - Header', 'comparison', 'HEADER_LOGGED_IN_TRADE_CTA_DEFECT_SIMPLE_RED.png')
im_simple_red.save(out_simple_path1, quality=95)
im_simple_red.save(out_simple_path2, quality=95)
im_simple_red.save(out_simple_comp, quality=95)
print('Saved simple red highlighted screenshot!')


# ─────────────────────────────────────────────────────────────────────────────
# 2. SIMPLE CROSS-VERIFICATION: US STOREFRONT VS AU BASELINE
# ─────────────────────────────────────────────────────────────────────────────
# Load font for simple clean label
try:
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
except:
    font_badge = None

# Crop height to 120px so we focus on utility bar and main header navigation
H_CROP = 110
us_crop = im_us_trade.crop((0, 0, 1440, H_CROP))
au_crop = im_au_base.crop((0, 0, 1440, H_CROP))

# Highlight US crop with RED box around "Become a Trade Customer"
draw_us = ImageDraw.Draw(us_crop)
for i in range(LINE_WIDTH):
    draw_us.rectangle([box_trade_link[0] - i, box_trade_link[1] - i, box_trade_link[2] + i, box_trade_link[3] + i], outline=RED)

# Highlight AU crop with GREEN box around top utility bar (clean baseline)
draw_au = ImageDraw.Draw(au_crop)
box_au_top = [1160, 3, 1435, 30]
for i in range(LINE_WIDTH):
    draw_au.rectangle([box_au_top[0] - i, box_au_top[1] - i, box_au_top[2] + i, box_au_top[3] + i], outline=GREEN)

# Create 2-panel vertical stacked image
HEADER_TAG_H = 34
PANEL_GAP = 20
TOTAL_W = 1440
TOTAL_H = (H_CROP + HEADER_TAG_H) * 2 + PANEL_GAP + 20

canvas = Image.new('RGB', (TOTAL_W, TOTAL_H), (255, 255, 255))
d = ImageDraw.Draw(canvas)

# Panel 1: US Storefront (Defect)
y1 = 10
d.rectangle([0, y1, 560, y1 + HEADER_TAG_H - 4], fill=(235, 30, 30))
d.text((15, y1 + 6), "US STOREFRONT LIVE (DEFECT: Link persists when logged in)", fill=(255, 255, 255), font=font_badge)
canvas.paste(us_crop, (0, y1 + HEADER_TAG_H))

# Panel 2: AU Storefront (Baseline)
y2 = y1 + HEADER_TAG_H + H_CROP + PANEL_GAP
d.rectangle([0, y2, 540, y2 + HEADER_TAG_H - 4], fill=(34, 197, 94))
d.text((15, y2 + 6), "AU BASELINE STOREFRONT (Clean utility bar parity)", fill=(255, 255, 255), font=font_badge)
canvas.paste(au_crop, (0, y2 + HEADER_TAG_H))

out_cross_path1 = os.path.join(OUT_DIR, 'Header_Screenshots_For_Michelle', 'HEADER_US_VS_AU_CROSS_VERIFICATION_SIMPLE.png')
out_cross_path2 = os.path.join(ARTIFACT_DIR, 'HEADER_US_VS_AU_CROSS_VERIFICATION_SIMPLE.png')
out_cross_comp = os.path.join(OUT_DIR, 'Ticket 5 - Header', 'comparison', 'HEADER_US_VS_AU_CROSS_VERIFICATION_SIMPLE.png')
canvas.save(out_cross_path1, quality=95)
canvas.save(out_cross_path2, quality=95)
canvas.save(out_cross_comp, quality=95)
print('Saved simple US vs AU cross-verification graphic!')
