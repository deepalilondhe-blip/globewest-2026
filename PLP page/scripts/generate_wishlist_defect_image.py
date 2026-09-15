#!/usr/bin/env python3
"""
Generate pixel-perfect comparison for Product Card Wishlist Heart Defect:
- Left: US Storefront Actual (Red border) missing wishlist heart icon on card
- Right: Figma Design (Green border) showing the wishlist heart icon on top right of card
Format: Strict Red & Green standard with 1-line description, zero visual clutter.
"""

import os
from PIL import Image, ImageDraw, ImageFont

WORKSPACE = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
BRAIN_DIR = "/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b"

OUT_PATHS = [
    os.path.join(WORKSPACE, "PLP page", "screenshots", "simple_defect_reports", "DEFECT_PRODUCT_CARD_WISHLIST_HEART.png"),
    os.path.join(WORKSPACE, "GlobeWest 2026", "PLP page", "screenshots", "simple_defect_reports", "DEFECT_PRODUCT_CARD_WISHLIST_HEART.png"),
    os.path.join(BRAIN_DIR, "figma_comparison", "DEFECT_PRODUCT_CARD_WISHLIST_HEART.png"),
    os.path.join(BRAIN_DIR, "simple_defect_reports", "DEFECT_PRODUCT_CARD_WISHLIST_HEART.png")
]

for p in OUT_PATHS:
    os.makedirs(os.path.dirname(p), exist_ok=True)

# Load fonts
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_header = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    font_desc = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except Exception:
    font_title = font_header = font_label = font_desc = ImageFont.load_default()

im_f = Image.open(os.path.join(BRAIN_DIR, "figma_comparison", "FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png")).convert("RGB")
im_u = Image.open(os.path.join(BRAIN_DIR, "figma_comparison", "US_STOREFRONT_PLP_CROSSCHECK_VIEW.png")).convert("RGB")

# Crop full Card 1 header from Figma with top margin: x=[295, 715], y=[670, 830]
crop_f1 = im_f.crop((295, 670, 715, 830))

# Crop full Card 1 header from US Storefront with top margin: x=[225, 405], y=[515, 685]
crop_u1 = im_u.crop((225, 515, 405, 685))

target_w = 850
target_h = 320

us_resized = crop_u1.resize((target_w, target_h), Image.Resampling.LANCZOS)
figma_resized = crop_f1.resize((target_w, target_h), Image.Resampling.LANCZOS)

draw_u = ImageDraw.Draw(us_resized)
draw_f = ImageDraw.Draw(figma_resized)

# Highlight in Figma: Heart is at top right
draw_f.rectangle([670, 45, 810, 130], outline=(0, 230, 60), width=4)
draw_f.rectangle([460, 140, 810, 175], fill=(0, 200, 50))
draw_f.text((470, 147), "FIGMA: WISHLIST HEART ICON (♡)", fill=(0, 0, 0), font=font_label)

# Highlight in US Storefront: Missing heart icon at top right
draw_u.rectangle([540, 45, 810, 130], outline=(255, 30, 30), width=4)
draw_u.rectangle([450, 140, 810, 175], fill=(255, 0, 0))
draw_u.text((460, 147), "US ACTUAL: MISSING WISHLIST HEART", fill=(255, 255, 255), font=font_label)

# Assemble Master Canvas
pad = 30
gap = 25
top_banner = 90
bot_banner = 70
border_thick = 4

canvas_w = pad * 2 + target_w * 2 + gap
canvas_h = top_banner + target_h + bot_banner + pad

canvas = Image.new("RGB", (canvas_w, canvas_h), (12, 12, 12))
draw = ImageDraw.Draw(canvas)

# Main Title
draw.text((pad, 22), "FIGMA DESIGN AUDIT: PRODUCT CARD WISHLIST HEART ICON", fill=(255, 255, 255), font=font_title)

# Left: US Storefront Actual (Red)
x_left = pad
y_top = top_banner
draw.text((x_left, y_top - 28), "US STOREFRONT (ACTUAL - MISSING WISHLIST HEART ON CARD)", fill=(255, 40, 40), font=font_header)
canvas.paste(us_resized, (x_left, y_top))
draw.rectangle([x_left, y_top, x_left + target_w, y_top + target_h], outline=(255, 0, 0), width=border_thick)

# Right: Figma Design Requirement (Green)
x_right = pad + target_w + gap
draw.text((x_right, y_top - 28), "FIGMA DESIGN REQUIREMENT (FINAL DESIGNS: HEART ON TOP-RIGHT)", fill=(0, 255, 70), font=font_header)
canvas.paste(figma_resized, (x_right, y_top))
draw.rectangle([x_right, y_top, x_right + target_w, y_top + target_h], outline=(0, 255, 0), width=border_thick)

# Single line description at bottom
desc = "Defect: Product cards are missing the Wishlist heart icon in the top-right corner opposite to Compare as specified in Figma."
draw.text((pad, y_top + target_h + 20), desc, fill=(240, 240, 240), font=font_desc)

for p in OUT_PATHS:
    canvas.save(p, quality=95)
    print(f"Saved: {p}")
