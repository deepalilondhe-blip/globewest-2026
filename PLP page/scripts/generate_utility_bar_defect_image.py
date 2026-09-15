#!/usr/bin/env python3
"""
Generate clean comparison for Top Utility Bar Copy Discrepancy:
- Left: US Storefront Actual (Red border) showing 'Ready to Buy' and 'Book Showroom Visit'
- Right: Figma Design (Green border) showing 'Become a Trade Customer' and 'Book Showroom Appointment'
Format: Strict Red & Green standard with 1-line description, zero visual clutter.
"""

import os
from PIL import Image, ImageDraw, ImageFont

WORKSPACE = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
BRAIN_DIR = "/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b"

OUT_PATHS = [
    os.path.join(WORKSPACE, "PLP page", "screenshots", "simple_defect_reports", "DEFECT_TOP_UTILITY_BAR_COPY.png"),
    os.path.join(WORKSPACE, "GlobeWest 2026", "PLP page", "screenshots", "simple_defect_reports", "DEFECT_TOP_UTILITY_BAR_COPY.png"),
    os.path.join(BRAIN_DIR, "figma_comparison", "DEFECT_TOP_UTILITY_BAR_COPY.png"),
    os.path.join(BRAIN_DIR, "simple_defect_reports", "DEFECT_TOP_UTILITY_BAR_COPY.png")
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

# Crop utility bar from Figma: x=[900, 1600], y=[68, 110]
crop_f_util = im_f.crop((920, 68, 1580, 112))

# Crop utility bar from US Storefront: x=[950, 1435], y=[0, 38]
crop_u_util = im_u.crop((950, 0, 1435, 38))

target_w = 850
target_h = 160

us_resized = crop_u_util.resize((target_w, target_h), Image.Resampling.LANCZOS)
figma_resized = crop_f_util.resize((target_w, target_h), Image.Resampling.LANCZOS)

draw_u = ImageDraw.Draw(us_resized)
draw_f = ImageDraw.Draw(figma_resized)

# Highlight Figma labels
draw_f.rectangle([10, 10, target_w - 10, target_h - 10], outline=(0, 230, 60), width=3)
draw_f.text((20, target_h - 35), "FIGMA: 'Become a Trade Customer' | 'Book Showroom Appointment'", fill=(0, 255, 70), font=font_label)

# Highlight US Storefront labels
draw_u.rectangle([10, 10, target_w - 10, target_h - 10], outline=(255, 30, 30), width=3)
draw_u.text((20, target_h - 35), "US ACTUAL: 'Ready to Buy' | 'Book Showroom Visit'", fill=(255, 70, 70), font=font_label)

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
draw.text((pad, 22), "FIGMA DESIGN AUDIT: TOP UTILITY BAR LINK COPY", fill=(255, 255, 255), font=font_title)

# Left: US Storefront Actual (Red)
x_left = pad
y_top = top_banner
draw.text((x_left, y_top - 28), "US STOREFRONT (ACTUAL - DIFFERENT LINK TEXT)", fill=(255, 40, 40), font=font_header)
canvas.paste(us_resized, (x_left, y_top))
draw.rectangle([x_left, y_top, x_left + target_w, y_top + target_h], outline=(255, 0, 0), width=border_thick)

# Right: Figma Design Requirement (Green)
x_right = pad + target_w + gap
draw.text((x_right, y_top - 28), "FIGMA DESIGN REQUIREMENT (FINAL DESIGNS SPECIFICATION)", fill=(0, 255, 70), font=font_header)
canvas.paste(figma_resized, (x_right, y_top))
draw.rectangle([x_right, y_top, x_right + target_w, y_top + target_h], outline=(0, 255, 0), width=border_thick)

# Single line description at bottom
desc = "Defect: Top utility bar uses 'Ready to Buy / Book Showroom Visit' instead of Figma's 'Become a Trade Customer / Book Showroom Appointment'."
draw.text((pad, y_top + target_h + 20), desc, fill=(240, 240, 240), font=font_desc)

for p in OUT_PATHS:
    canvas.save(p, quality=95)
    print(f"Saved: {p}")
