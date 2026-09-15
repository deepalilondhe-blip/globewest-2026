#!/usr/bin/env python3
"""
Generate clean side-by-side comparison between:
- Live US Storefront PLP (Red border - Actual)
- Live Figma Design 'desktop/Category/Show Filters' (Green border - Baseline)
Format: Strict Red & Green standard with 1-line description.
"""

import os
from PIL import Image, ImageDraw, ImageFont

WORKSPACE = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
BRAIN_DIR = "/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b"

US_IMG_PATH = os.path.join(BRAIN_DIR, "figma_comparison", "US_STOREFRONT_PLP_CROSSCHECK_VIEW.png")
FIGMA_IMG_PATH = os.path.join(BRAIN_DIR, "figma_comparison", "FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png")

OUT_PATHS = [
    os.path.join(WORKSPACE, "PLP page", "screenshots", "simple_defect_reports", "DEFECT_FIGMA_SHOW_FILTERS_COMPARISON.png"),
    os.path.join(WORKSPACE, "GlobeWest 2026", "PLP page", "screenshots", "simple_defect_reports", "DEFECT_FIGMA_SHOW_FILTERS_COMPARISON.png"),
    os.path.join(BRAIN_DIR, "figma_comparison", "DEFECT_FIGMA_SHOW_FILTERS_COMPARISON.png"),
    os.path.join(BRAIN_DIR, "simple_defect_reports", "DEFECT_FIGMA_SHOW_FILTERS_COMPARISON.png")
]

for p in OUT_PATHS:
    os.makedirs(os.path.dirname(p), exist_ok=True)

# Load fonts
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_header = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_desc = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except Exception:
    font_title = font_header = font_desc = ImageFont.load_default()

# Open source images
img_us = Image.open(US_IMG_PATH).convert("RGB")
img_figma = Image.open(FIGMA_IMG_PATH).convert("RGB")

# In Figma screenshot, crop out the canvas area (skip left/right sidebars to focus on the artboard)
# Figma artboard is centered roughly in [260, 60, 1600, 850]
fw, fh = img_figma.size
# Let's crop the artboard area from Figma
crop_figma = img_figma.crop((240, 50, fw - 250, fh - 100))

# Resize both to equal width/height for side-by-side
target_w = 900
target_h = 560

us_resized = img_us.resize((target_w, target_h), Image.Resampling.LANCZOS)
figma_resized = crop_figma.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Create canvas
pad = 30
gap = 25
top_banner = 90
bot_banner = 70
border_thick = 4

canvas_w = pad * 2 + target_w * 2 + gap
canvas_h = top_banner + target_h + bot_banner + pad

canvas = Image.new("RGB", (canvas_w, canvas_h), (12, 12, 12))
draw = ImageDraw.Draw(canvas)

# Title
draw.text((pad, 20), "FIGMA DESIGN AUDIT: DESKTOP PLP 'SHOW FILTERS' SPECIFICATION", fill=(255, 255, 255), font=font_title)

# Left Column: US Storefront Actual (Red)
x_left = pad
y_top = top_banner
draw.text((x_left, y_top - 28), "US STOREFRONT (ACTUAL IMPLEMENTATION)", fill=(255, 30, 30), font=font_header)
canvas.paste(us_resized, (x_left, y_top))
draw.rectangle([x_left, y_top, x_left + target_w, y_top + target_h], outline=(255, 0, 0), width=border_thick)

# Right Column: Figma Design Requirement (Green)
x_right = pad + target_w + gap
draw.text((x_right, y_top - 28), "FIGMA DESIGN REQUIREMENT (FINAL DESIGNS: 2316-12739)", fill=(0, 255, 70), font=font_header)
canvas.paste(figma_resized, (x_right, y_top))
draw.rectangle([x_right, y_top, x_right + target_w, y_top + target_h], outline=(0, 255, 0), width=border_thick)

# Single line description at bottom
desc_text = "Defect: Desktop filters toolbar is missing the dedicated 'Show Filters' toggle button and wishlist hearts on cards per Figma design."
draw.text((pad, y_top + target_h + 20), desc_text, fill=(240, 240, 240), font=font_desc)

for p in OUT_PATHS:
    canvas.save(p, quality=95)
    print(f"Saved: {p}")
