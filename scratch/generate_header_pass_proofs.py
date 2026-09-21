from PIL import Image, ImageDraw
import os

OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)'
MICHELLE_DIR = os.path.join(OUT_DIR, 'Header_Screenshots_For_Michelle')
ARTIFACT_DIR = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c'
os.makedirs(MICHELLE_DIR, exist_ok=True)

# Load raw US guest header (1440 x 160)
im = Image.open(os.path.join(OUT_DIR, 'Header_Cross_Verification', '02_US_Guest_Header_Raw.png')).convert('RGB')

# ─────────────────────────────────────────────────────────────────────────────
# 1. SCREENSHOT WITH SIMPLE RED HIGHLIGHT BOX
# ─────────────────────────────────────────────────────────────────────────────
im_red = im.copy()
draw_red = ImageDraw.Draw(im_red)
RED = (235, 30, 30)
LINE_WIDTH = 3

# Highlight "Become a Trade Customer" & "Book Showroom Appointment" in top utility bar
# "Become a Trade Customer": x: [944, 1136], y: [4, 30]
box_trade = [942, 3, 1138, 30]
for i in range(LINE_WIDTH):
    draw_red.rectangle([box_trade[0] - i, box_trade[1] - i, box_trade[2] + i, box_trade[3] + i], outline=RED)

out_red_root = os.path.join(OUT_DIR, 'Ticket 5 - Header', 'comparison', 'HEADER_VERIFIED_PASS_RED_PROOF.png')
out_red_mich = os.path.join(MICHELLE_DIR, '01_Header_Verified_Pass_Red_Proof.png')
out_red_art = os.path.join(ARTIFACT_DIR, 'HEADER_VERIFIED_PASS_RED_PROOF.png')

im_red.save(out_red_root, quality=95)
im_red.save(out_red_mich, quality=95)
im_red.save(out_red_art, quality=95)
print('Saved red highlight screenshot!')

# ─────────────────────────────────────────────────────────────────────────────
# 2. SCREENSHOT WITH SIMPLE GREEN HIGHLIGHT BOX (Standard for PASS)
# ─────────────────────────────────────────────────────────────────────────────
im_green = im.copy()
draw_green = ImageDraw.Draw(im_green)
GREEN = (34, 197, 94)

for i in range(LINE_WIDTH):
    draw_green.rectangle([box_trade[0] - i, box_trade[1] - i, box_trade[2] + i, box_trade[3] + i], outline=GREEN)

out_green_root = os.path.join(OUT_DIR, 'Ticket 5 - Header', 'comparison', 'HEADER_VERIFIED_PASS_GREEN_PROOF.png')
out_green_mich = os.path.join(MICHELLE_DIR, '02_Header_Verified_Pass_Green_Proof.png')
out_green_art = os.path.join(ARTIFACT_DIR, 'HEADER_VERIFIED_PASS_GREEN_PROOF.png')

im_green.save(out_green_root, quality=95)
im_green.save(out_green_mich, quality=95)
im_green.save(out_green_art, quality=95)
print('Saved green highlight screenshot!')

# ─────────────────────────────────────────────────────────────────────────────
# 3. SCREENSHOT HIGHLIGHTING BOTH TOP UTILITY LINKS (Clean Red)
# ─────────────────────────────────────────────────────────────────────────────
im_both = im.copy()
draw_both = ImageDraw.Draw(im_both)
# Box encompassing both links: x: 942..1435, y: 3..30
box_both = [942, 3, 1435, 30]
for i in range(LINE_WIDTH):
    draw_both.rectangle([box_both[0] - i, box_both[1] - i, box_both[2] + i, box_both[3] + i], outline=RED)

out_both_root = os.path.join(OUT_DIR, 'Ticket 5 - Header', 'comparison', 'HEADER_TOP_BAR_VERIFIED_PROOF.png')
out_both_mich = os.path.join(MICHELLE_DIR, '03_Header_Top_Bar_Verified_Proof.png')
out_both_art = os.path.join(ARTIFACT_DIR, 'HEADER_TOP_BAR_VERIFIED_PROOF.png')

im_both.save(out_both_root, quality=95)
im_both.save(out_both_mich, quality=95)
im_both.save(out_both_art, quality=95)
print('Saved full top bar proof!')
