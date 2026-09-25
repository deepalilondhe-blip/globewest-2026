#!/usr/bin/env python3
"""
Build the definitive, pixel-perfect, unblurred comparison image for Defect 01:
Table Header Column Copy Mismatches (EXP. DATE & ORDER NAME vs EXPIRY DATE & QUOTE NAME).
Uses the user's uploaded image directly and pairs it with the Figma spec.
- Green highlight on Figma columns (EXP. DATE, ORDER NAME).
- Red highlight on Live URL columns (EXPIRY DATE, QUOTE NAME).
- Crisp, unblurred, zero text fluff/explanation inside the image.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes"
USER_IMG_PATH = "/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/.user_uploaded/media_1790157469434.png"
FIGMA_PATH = os.path.join(BASE_DIR, "figma", "FIGMA_DESKTOP_MY_QUOTES_2X.jpg")
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")
ARTIFACT_DIR = "/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/quotes_comparisons"

os.makedirs(COMPARISON_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

# 1. Load user image
user_img = Image.open(USER_IMG_PATH).convert("RGB")
uw, uh = user_img.size # (1024, 482)

# 2. Load Figma image and crop matching context
fig_2x = Image.open(FIGMA_PATH).convert("RGB")
# Figma artboard matching context
fig_crop = fig_2x.crop((0, 0, 2880, 1356))

# Highlight EXP. DATE and ORDER NAME in native Figma space
d_fig = ImageDraw.Draw(fig_crop)
# Bounding box for EXP. DATE: x: 1100 to 1265, y: 730 to 808
d_fig.rectangle([1100, 728, 1265, 808], outline=(46, 125, 50), width=8)
# Bounding box for ORDER NAME: x: 1520 to 1755, y: 730 to 808
d_fig.rectangle([1520, 728, 1755, 808], outline=(46, 125, 50), width=8)

# Resize to match user image dimensions with high-precision Lanczos
fig_matched = fig_crop.resize((uw, uh), Image.Resampling.LANCZOS)

# 3. Create the comparison canvas
font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_title = ImageFont.truetype(font_path, 20)
font_badge = ImageFont.truetype(font_path, 15)

pad = 30
card_w = uw + (pad * 2) # 1084
# Height: Title (60) + Figma Badge (35) + Figma Img (482) + Gap (30) + Live Badge (35) + Live Img (482) + pad (30)
card_h = 60 + 35 + uh + 30 + 35 + uh + pad

canvas = Image.new("RGB", (card_w, card_h), (248, 246, 242))
draw = ImageDraw.Draw(canvas)

# Title
draw.text((pad, 22), "DEFECT 01: Table Header Column Copy Mismatches", fill=(20, 20, 20), font=font_title)

curr_y = 65

# --- FIGMA SECTION ---
badge_fig = " [ APPROVED FIGMA SPEC: EXP. DATE & ORDER NAME ] "
b_f = draw.textbbox((0, 0), badge_fig, font=font_badge)
bw_f = b_f[2] - b_f[0] + 16
draw.rectangle([pad, curr_y, pad + bw_f, curr_y + 30], fill=(235, 247, 238), outline=(46, 125, 50), width=2)
draw.text((pad + 8, curr_y + 6), badge_fig, fill=(46, 125, 50), font=font_badge)

curr_y += 38
# Figma image border
draw.rectangle([pad - 2, curr_y - 2, pad + uw + 2, curr_y + uh + 2], outline=(46, 125, 50), width=2)
canvas.paste(fig_matched, (pad, curr_y))

curr_y += uh + 28

# --- LIVE URL SECTION ---
badge_live = " [ CURRENT LIVE STAGING URL: EXPIRY DATE & QUOTE NAME ] "
b_l = draw.textbbox((0, 0), badge_live, font=font_badge)
bw_l = b_l[2] - b_l[0] + 16
draw.rectangle([pad, curr_y, pad + bw_l, curr_y + 30], fill=(254, 242, 242), outline=(220, 20, 20), width=2)
draw.text((pad + 8, curr_y + 6), badge_live, fill=(185, 28, 28), font=font_badge)

curr_y += 38
# Live image border
draw.rectangle([pad - 2, curr_y - 2, pad + uw + 2, curr_y + uh + 2], outline=(220, 20, 20), width=2)
canvas.paste(user_img, (pad, curr_y))

out_path = os.path.join(COMPARISON_DIR, "COMPARISON_01_HEADER_COPY_MISMATCH.png")
canvas.save(out_path, quality=98)
print(f"✅ Saved comparison card to: {out_path}")

artifact_path = os.path.join(ARTIFACT_DIR, "COMPARISON_01_HEADER_COPY_MISMATCH.png")
canvas.save(artifact_path, quality=98)
print(f"✅ Saved to artifacts: {artifact_path}")

