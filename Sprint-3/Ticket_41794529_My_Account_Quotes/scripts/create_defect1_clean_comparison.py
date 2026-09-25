#!/usr/bin/env python3
"""
Generate a pristine, unblurred, pixel-perfect comparison image for Defect 01:
- Figma table header: Highlighted in solid GREEN on EXP. DATE and ORDER NAME.
- Live Staging table header: Highlighted in solid RED on EXPIRY DATE and QUOTE NAME.
- Pixel-perfect horizontal alignment between Figma and Live Staging.
- Native 2X Retina resolution throughout (zero blurriness).
- Clean badges and zoomed side-by-side callouts.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes"
SCRATCH_DIR = os.path.join(BASE_DIR, "scratch")
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")
DEFECTS_DIR = os.path.join(BASE_DIR, "screenshots", "defects")
FIGMA_PATH = os.path.join(BASE_DIR, "figma", "FIGMA_DESKTOP_MY_QUOTES_2X.jpg")

os.makedirs(COMPARISON_DIR, exist_ok=True)
os.makedirs(DEFECTS_DIR, exist_ok=True)

# 1. Exact 2X Crops
fig_2x = Image.open(FIGMA_PATH)
# Exact horizontal bounds where QUOTE N starts at 42px and ACTIONS ends at 1704px
fig_hdr = fig_2x.crop((875, 715, 2635, 825)).convert("RGB") # (1760, 110)
live2x = Image.open(os.path.join(SCRATCH_DIR, "live_table_header_2x.png")).convert("RGB") # (1758, 98)

# Standardize height and width neatly
target_w = 1760
target_h = 105

fig_bg = Image.new("RGB", (target_w, target_h), (249, 246, 242))
fig_bg.paste(fig_hdr, (0, (target_h - fig_hdr.height) // 2))

live_bg = Image.new("RGB", (target_w, target_h), (249, 246, 242))
live_bg.paste(live2x, (1, (target_h - live2x.height) // 2))

# 2. Draw Highlights
# Figma: Solid GREEN (#2E7D32)
d_fig = ImageDraw.Draw(fig_bg)
d_fig.rectangle([226, 12, 385, 92], outline=(46, 125, 50), width=5) # EXP. DATE
d_fig.rectangle([648, 12, 880, 92], outline=(46, 125, 50), width=5) # ORDER NAME

# Live: Solid RED (#D32F2F / #FF0000)
d_live = ImageDraw.Draw(live_bg)
d_live.rectangle([226, 14, 435, 90], outline=(220, 20, 20), width=5) # EXPIRY DATE
d_live.rectangle([698, 14, 915, 90], outline=(220, 20, 20), width=5) # QUOTE NAME

# Save individual crops
fig_bg.save(os.path.join(DEFECTS_DIR, "FIGMA_HEADER_HIGHLIGHTED_GREEN.png"))
live_bg.save(os.path.join(DEFECTS_DIR, "LIVE_HEADER_HIGHLIGHTED_RED.png"))

# 3. Assemble Full Canvas
canvas_w = 1920
pad_x = 80
inner_w = canvas_w - (pad_x * 2) # 1760

font_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_reg = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

font_title = ImageFont.truetype(font_bold, 28)
font_subtitle = ImageFont.truetype(font_reg, 18)
font_badge = ImageFont.truetype(font_bold, 18)
font_card_head = ImageFont.truetype(font_bold, 19)
font_card_sub = ImageFont.truetype(font_bold, 18)

canvas_h = 100 + 45 + 15 + target_h + 35 + 45 + 15 + target_h + 45 + 230 + 40
card = Image.new("RGB", (canvas_w, canvas_h), (250, 249, 246))
draw = ImageDraw.Draw(card)

# Header Title
draw.text((pad_x, 35), "TICKET #41794529: MY ACCOUNT - QUOTES", fill=(20, 20, 20), font=font_title)
draw.text((pad_x, 75), "Defect 01: Table Header Column Copy Mismatches (EXP. DATE & ORDER NAME)", fill=(90, 90, 90), font=font_subtitle)

curr_y = 125

# ================= FIGMA SECTION =================
badge_fig = "  [ FIGMA DESIGN SPECIFICATION - APPROVED ]  "
b_box = draw.textbbox((0, 0), badge_fig, font=font_badge)
bw = b_box[2] - b_box[0] + 20
draw.rectangle([pad_x, curr_y, pad_x + bw, curr_y + 38], fill=(235, 247, 238), outline=(46, 125, 50), width=2)
draw.text((pad_x + 10, curr_y + 8), badge_fig, fill=(46, 125, 50), font=font_badge)

curr_y += 50
draw.rectangle([pad_x - 3, curr_y - 3, pad_x + target_w + 3, curr_y + target_h + 3], outline=(46, 125, 50), width=3)
card.paste(fig_bg, (pad_x, curr_y))

curr_y += target_h + 35

# Subtle divider
draw.line([pad_x, curr_y, pad_x + inner_w, curr_y], fill=(220, 220, 220), width=2)
curr_y += 25

# ================= LIVE SECTION =================
badge_live = "  [ CURRENT LIVE STAGING: mcstaging2.globewest.com ]  "
b_box_l = draw.textbbox((0, 0), badge_live, font=font_badge)
bw_l = b_box_l[2] - b_box_l[0] + 20
draw.rectangle([pad_x, curr_y, pad_x + bw_l, curr_y + 38], fill=(254, 242, 242), outline=(220, 20, 20), width=2)
draw.text((pad_x + 10, curr_y + 8), badge_live, fill=(185, 28, 28), font=font_badge)

curr_y += 50
draw.rectangle([pad_x - 3, curr_y - 3, pad_x + target_w + 3, curr_y + target_h + 3], outline=(220, 20, 20), width=3)
card.paste(live_bg, (pad_x, curr_y))

curr_y += target_h + 40

# Subtle divider
draw.line([pad_x, curr_y, pad_x + inner_w, curr_y], fill=(220, 220, 220), width=2)
curr_y += 25

# ================= SIDE-BY-SIDE ZOOM CARDS =================
zoom_w = (inner_w - 40) // 2

# Card 1: Column 2
c1_x = pad_x
draw.rectangle([c1_x, curr_y, c1_x + zoom_w, curr_y + 190], fill=(255, 255, 255), outline=(210, 210, 210), width=2)
draw.rectangle([c1_x, curr_y, c1_x + zoom_w, curr_y + 40], fill=(244, 244, 244))
draw.text((c1_x + 20, curr_y + 10), "COLUMN 2: EXPIRATION DATE", fill=(30, 30, 30), font=font_card_head)

# Figma zoom 1
f_zoom1 = fig_bg.crop((226, 12, 385, 92))
card.paste(f_zoom1, (c1_x + 30, curr_y + 55))
draw.rectangle([c1_x + 28, curr_y + 53, c1_x + 30 + f_zoom1.width + 2, curr_y + 55 + f_zoom1.height + 2], outline=(46, 125, 50), width=3)
draw.text((c1_x + 30 + f_zoom1.width + 30, curr_y + 82), "Approved Figma: EXP. DATE", fill=(46, 125, 50), font=font_card_sub)

# Live zoom 1
l_zoom1 = live_bg.crop((226, 14, 435, 90))
card.paste(l_zoom1, (c1_x + 30, curr_y + 120))
draw.rectangle([c1_x + 28, curr_y + 118, c1_x + 30 + l_zoom1.width + 2, curr_y + 120 + l_zoom1.height + 2], outline=(220, 20, 20), width=3)
draw.text((c1_x + 30 + l_zoom1.width + 30, curr_y + 142), "Live Staging: EXPIRY DATE", fill=(185, 28, 28), font=font_card_sub)

# Card 2: Column 4
c2_x = pad_x + zoom_w + 40
draw.rectangle([c2_x, curr_y, c2_x + zoom_w, curr_y + 190], fill=(255, 255, 255), outline=(210, 210, 210), width=2)
draw.rectangle([c2_x, curr_y, c2_x + zoom_w, curr_y + 40], fill=(244, 244, 244))
draw.text((c2_x + 20, curr_y + 10), "COLUMN 4: ORDER / QUOTE NAME", fill=(30, 30, 30), font=font_card_head)

# Figma zoom 2
f_zoom2 = fig_bg.crop((648, 12, 880, 92))
card.paste(f_zoom2, (c2_x + 30, curr_y + 55))
draw.rectangle([c2_x + 28, curr_y + 53, c2_x + 30 + f_zoom2.width + 2, curr_y + 55 + f_zoom2.height + 2], outline=(46, 125, 50), width=3)
draw.text((c2_x + 30 + f_zoom2.width + 30, curr_y + 82), "Approved Figma: ORDER NAME", fill=(46, 125, 50), font=font_card_sub)

# Live zoom 2
l_zoom2 = live_bg.crop((698, 14, 915, 90))
card.paste(l_zoom2, (c2_x + 30, curr_y + 120))
draw.rectangle([c2_x + 28, curr_y + 118, c2_x + 30 + l_zoom2.width + 2, curr_y + 120 + l_zoom2.height + 2], outline=(220, 20, 20), width=3)
draw.text((c2_x + 30 + l_zoom2.width + 30, curr_y + 142), "Live Staging: QUOTE NAME", fill=(185, 28, 28), font=font_card_sub)

out_card = os.path.join(COMPARISON_DIR, "COMPARISON_01_HEADER_COPY_MISMATCH.png")
card.save(out_card, quality=98)
print(f"✅ Saved perfectly aligned comparison card: {out_card}")

