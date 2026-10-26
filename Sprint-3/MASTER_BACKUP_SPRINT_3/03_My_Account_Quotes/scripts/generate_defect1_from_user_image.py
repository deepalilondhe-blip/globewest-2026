#!/usr/bin/env python3
"""
Generate pristine, unblurred comparison images for Defect 01:
Using the user's provided live staging screenshot and the approved Figma design.
- Figma: Columns highlighted in GREEN (EXP. DATE & ORDER NAME).
- Live Staging URL: Columns highlighted in RED (EXPIRY DATE & QUOTE NAME).
- Clean, unblurred, zero text explanation clutter inside the image.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes"
USER_IMG_PATH = "/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/.tempmediaStorage/media_1790157521880.png"
FIGMA_2X_PATH = os.path.join(BASE_DIR, "figma", "FIGMA_DESKTOP_MY_QUOTES_2X.jpg")
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")
DEFECTS_DIR = os.path.join(BASE_DIR, "screenshots", "defects")
ARTIFACT_DIR = "/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/quotes_comparisons"

os.makedirs(COMPARISON_DIR, exist_ok=True)
os.makedirs(DEFECTS_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

# 1. Load User Image
user_img = Image.open(USER_IMG_PATH).convert("RGB")
w_user, h_user = user_img.size # (1920, 838)

# 2. Prepare Matching Figma Viewport
fig_2x = Image.open(FIGMA_2X_PATH).convert("RGB")
# Figma artboard matching top viewport height (2880, 1257)
fig_vp = fig_2x.crop((0, 0, 2880, 1257))

# Draw solid GREEN boxes on EXP. DATE and ORDER NAME in native Figma 2880 space
d_fig = ImageDraw.Draw(fig_vp)
# Column 2: EXP. DATE
d_fig.rectangle([1100, 730, 1265, 808], outline=(46, 125, 50), width=7)
# Column 4: ORDER NAME
d_fig.rectangle([1520, 730, 1755, 808], outline=(46, 125, 50), width=7)

# Resize to match user_img exactly (1920, 838) with Lanczos high-quality filter
fig_matched = fig_vp.resize((w_user, h_user), Image.Resampling.LANCZOS)

# 3. Build Full-Viewport Comparison Card (Stacked)
font_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_title = ImageFont.truetype(font_bold, 24)
font_badge = ImageFont.truetype(font_bold, 18)

pad_x = 50
pad_y = 40
card_w = w_user + (pad_x * 2) # 2020
card_h = pad_y + 40 + 15 + h_user + 50 + 40 + 15 + h_user + pad_y # ~ 1900

card = Image.new("RGB", (card_w, card_h), (248, 246, 242))
draw = ImageDraw.Draw(card)

curr_y = pad_y

# Section 1: FIGMA SPEC (GREEN)
badge_fig = "  APPROVED FIGMA SPECIFICATION (EXP. DATE & ORDER NAME)  "
b_box = draw.textbbox((0, 0), badge_fig, font=font_badge)
bw = b_box[2] - b_box[0] + 20
draw.rectangle([pad_x, curr_y, pad_x + bw, curr_y + 36], fill=(235, 247, 238), outline=(46, 125, 50), width=2)
draw.text((pad_x + 10, curr_y + 8), badge_fig, fill=(46, 125, 50), font=font_badge)

curr_y += 48
# Green border around Figma image
draw.rectangle([pad_x - 3, curr_y - 3, pad_x + w_user + 3, curr_y + h_user + 3], outline=(46, 125, 50), width=3)
card.paste(fig_matched, (pad_x, curr_y))

curr_y += h_user + 45

# Section 2: LIVE STAGING (RED)
badge_live = "  CURRENT LIVE STAGING URL: mcstaging2.globewest.com (EXPIRY DATE & QUOTE NAME)  "
b_box_l = draw.textbbox((0, 0), badge_live, font=font_badge)
bw_l = b_box_l[2] - b_box_l[0] + 20
draw.rectangle([pad_x, curr_y, pad_x + bw_l, curr_y + 36], fill=(254, 242, 242), outline=(220, 20, 20), width=2)
draw.text((pad_x + 10, curr_y + 8), badge_live, fill=(185, 28, 28), font=font_badge)

curr_y += 48
# Red border around Live Staging image
draw.rectangle([pad_x - 3, curr_y - 3, pad_x + w_user + 3, curr_y + h_user + 3], outline=(220, 20, 20), width=3)
card.paste(user_img, (pad_x, curr_y))

out_full = os.path.join(COMPARISON_DIR, "COMPARISON_01_HEADER_COPY_MISMATCH.png")
card.save(out_full, quality=98)
print(f"✅ Saved full comparison card to: {out_full}")

# Also save into artifacts
out_artifact = os.path.join(ARTIFACT_DIR, "COMPARISON_01_HEADER_COPY_MISMATCH.png")
card.save(out_artifact, quality=98)
print(f"✅ Copied to artifacts: {out_artifact}")

