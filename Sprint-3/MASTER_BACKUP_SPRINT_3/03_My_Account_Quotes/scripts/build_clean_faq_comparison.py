#!/usr/bin/env python3
"""
Generate clean, pixel-perfect comparison for Defect 02: FAQ Accordion Multi-Open Violation.
- Top: Approved Figma Spec (Frame 622 / 04.1 My Quotes) showing Single Accordion Open (second is closed with chevron down).
- Bottom: Live Staging Actual showing BOTH accordions expanded simultaneously (both chevrons up and body visible).
- Zero text overlay/fluff on images, strictly green and red outline highlighting.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes"
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")
FIG_FAQ_PATH = os.path.join(BASE_DIR, "figma", "test_fig_faq_clean.png")
LIVE_FAQ_PATH = os.path.join(BASE_DIR, "scratch", "live_faq_fully_in_view.png")

# 1. Load Figma FAQ crop
fig_im = Image.open(FIG_FAQ_PATH).convert("RGB")
# Figma crop has table pagination at top, crop directly to FAQ block
# Size: 1354x856
fw, fh = fig_im.size
fig_crop = fig_im.crop((0, 180, fw, fh - 20))
fcw, fch = fig_crop.size

# Highlight in GREEN: The single-open behavior (Item 1 open ^, Item 2 closed v)
d_fig = ImageDraw.Draw(fig_crop)
# Highlight Item 2 closed chevron in green box
d_fig.rectangle([fcw - 60, fch - 80, fcw - 10, fch - 20], outline=(46, 125, 50), width=4)

# 2. Load Live Staging FAQ
live_im = Image.open(LIVE_FAQ_PATH).convert("RGB")
# Crop to main column FAQ area: x: 300 to 1350, y: 200 to 600
lw, lh = live_im.size
live_crop = live_im.crop((300, 200, 1350, 600))
lcw, lch = live_crop.size

# Highlight in RED: Both chevrons/accordions expanded
d_live = ImageDraw.Draw(live_crop)
d_live.rectangle([lcw - 60, 10, lcw - 10, 65], outline=(220, 20, 20), width=4) # Chevron 1
d_live.rectangle([lcw - 60, 200, lcw - 10, 255], outline=(220, 20, 20), width=4) # Chevron 2
d_live.rectangle([10, 10, lcw - 10, 385], outline=(220, 20, 20), width=4) # Multi-open container

# Standardize width to 1024
target_w = 1024
fig_scale = target_w / fcw
target_fig_h = int(fch * fig_scale)
fig_resized = fig_crop.resize((target_w, target_fig_h), Image.Resampling.LANCZOS)

live_scale = target_w / lcw
target_live_h = int(lch * live_scale)
live_resized = live_crop.resize((target_w, target_live_h), Image.Resampling.LANCZOS)

# Build canvas
font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_title = ImageFont.truetype(font_path, 20)
font_badge = ImageFont.truetype(font_path, 15)

pad = 30
card_w = target_w + (pad * 2)
card_h = 60 + 35 + target_fig_h + 30 + 35 + target_live_h + pad

canvas = Image.new("RGB", (card_w, card_h), (248, 246, 242))
draw = ImageDraw.Draw(canvas)

# Title
draw.text((pad, 22), "DEFECT 02: FAQ Accordion Multi-Open Violation (Frame 622)", fill=(20, 20, 20), font=font_title)

curr_y = 65

# --- FIGMA SECTION ---
badge_fig = " [ APPROVED FIGMA SPEC: SINGLE ACCORDION OPEN AT A TIME ] "
b_f = draw.textbbox((0, 0), badge_fig, font=font_badge)
bw_f = b_f[2] - b_f[0] + 16
draw.rectangle([pad, curr_y, pad + bw_f, curr_y + 30], fill=(235, 247, 238), outline=(46, 125, 50), width=2)
draw.text((pad + 8, curr_y + 6), badge_fig, fill=(46, 125, 50), font=font_badge)

curr_y += 38
draw.rectangle([pad - 2, curr_y - 2, pad + target_w + 2, curr_y + target_fig_h + 2], outline=(46, 125, 50), width=2)
canvas.paste(fig_resized, (pad, curr_y))

curr_y += target_fig_h + 28

# --- LIVE URL SECTION ---
badge_live = " [ CURRENT LIVE STAGING URL: MULTIPLE ACCORDIONS OPEN SIMULTANEOUSLY ] "
b_l = draw.textbbox((0, 0), badge_live, font=font_badge)
bw_l = b_l[2] - b_l[0] + 16
draw.rectangle([pad, curr_y, pad + bw_l, curr_y + 30], fill=(254, 242, 242), outline=(220, 20, 20), width=2)
draw.text((pad + 8, curr_y + 6), badge_live, fill=(185, 28, 28), font=font_badge)

curr_y += 38
draw.rectangle([pad - 2, curr_y - 2, pad + target_w + 2, curr_y + target_live_h + 2], outline=(220, 20, 20), width=2)
canvas.paste(live_resized, (pad, curr_y))

out_path = os.path.join(COMPARISON_DIR, "COMPARISON_02_FAQ_MULTI_OPEN.png")
canvas.save(out_path, quality=98)
print(f"✅ Perfectly formatted FAQ comparison saved to: {out_path}")
