#!/usr/bin/env python3
"""
Generate pixel-perfect comparison image highlighting the 'Show Filters' toggler:
- Left: US Storefront Actual (Red border) highlighting the missing 'Show Filters' on the toolbar
- Right: Figma Design (Green border) highlighting the exact 'Show Filters' toggler button
Format: Strict Red & Green standard with 1-line description, zero visual clutter.
"""

import os
from PIL import Image, ImageDraw, ImageFont

WORKSPACE = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
BRAIN_DIR = "/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b"

FIGMA_CROP = os.path.join(BRAIN_DIR, "figma_comparison", "crop_figma_bar.png")
US_CROP = os.path.join(BRAIN_DIR, "figma_comparison", "crop_us_bar.png")

OUT_PATHS = [
    os.path.join(WORKSPACE, "PLP page", "screenshots", "simple_defect_reports", "DEFECT_SHOW_FILTERS_TOGGLER_HIGHLIGHT.png"),
    os.path.join(WORKSPACE, "GlobeWest 2026", "PLP page", "screenshots", "simple_defect_reports", "DEFECT_SHOW_FILTERS_TOGGLER_HIGHLIGHT.png"),
    os.path.join(BRAIN_DIR, "figma_comparison", "DEFECT_SHOW_FILTERS_TOGGLER_HIGHLIGHT.png"),
    os.path.join(BRAIN_DIR, "simple_defect_reports", "DEFECT_SHOW_FILTERS_TOGGLER_HIGHLIGHT.png")
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

# Open cropped images
img_figma_raw = Image.open(FIGMA_CROP).convert("RGB")
img_us_raw = Image.open(US_CROP).convert("RGB")

# In Figma: crop out the black margin on the left (x starts from 28 to 900)
fw, fh = img_figma_raw.size
focus_figma = img_figma_raw.crop((28, 0, min(860, fw), fh))

# In US: crop from 0 to 832
uw, uh = img_us_raw.size
focus_us = img_us_raw.crop((0, 0, min(832, uw), uh))

target_w = 900
target_h = 280

us_resized = focus_us.resize((target_w, target_h), Image.Resampling.LANCZOS)
figma_resized = focus_figma.resize((target_w, target_h), Image.Resampling.LANCZOS)

draw_figma = ImageDraw.Draw(figma_resized)
draw_us = ImageDraw.Draw(us_resized)

# 1. FIGMA: Highlight 'Show Filters' button
# In focus_figma, 'Show Filters' is at x=[10, 160], y=[15, 65]
# Scaled to target_w/target_h:
sx_f = target_w / focus_figma.width
sy_f = target_h / focus_figma.height

box_f_x1 = int(10 * sx_f)
box_f_y1 = int(12 * sy_f)
box_f_x2 = int(185 * sx_f)
box_f_y2 = int(68 * sy_f)

draw_figma.rectangle([box_f_x1, box_f_y1, box_f_x2, box_f_y2], outline=(0, 230, 60), width=4)
draw_figma.rectangle([box_f_x1, box_f_y2 + 4, box_f_x1 + 330, box_f_y2 + 32], fill=(0, 200, 50))
draw_figma.text((box_f_x1 + 8, box_f_y2 + 8), "FIGMA: 'Show Filters' TOGGLER BUTTON", fill=(0, 0, 0), font=font_label)

# 2. US STOREFRONT: Highlight missing toggler before 'Brand'
sx_u = target_w / focus_us.width
sy_u = target_h / focus_us.height

box_u_x1 = int(15 * sx_u)
box_u_y1 = int(0 * sy_u)
box_u_x2 = int(220 * sx_u)
box_u_y2 = int(48 * sy_u)

# Red highlight around Brand and notice
draw_us.rectangle([box_u_x1, box_u_y1, box_u_x2, box_u_y2], outline=(255, 30, 30), width=4)
draw_us.rectangle([box_u_x1, box_u_y2 + 4, box_u_x1 + 440, box_u_y2 + 32], fill=(255, 0, 0))
draw_us.text((box_u_x1 + 8, box_u_y2 + 8), "US ACTUAL: MISSING 'Show Filters' TOGGLER ON BAR", fill=(255, 255, 255), font=font_label)

# Highlight 'Hide Filters' in drawer below
box_h_x1 = int(120 * sx_u)
box_h_y1 = int(195 * sy_u)
box_h_x2 = int(285 * sx_u)
box_h_y2 = int(245 * sy_u)
draw_us.rectangle([box_h_x1, box_h_y1, box_h_x2, box_h_y2], outline=(255, 140, 0), width=3)
draw_us.text((box_h_x2 + 10, box_h_y1 + 10), "(Drawer only shows 'Hide Filters' link)", fill=(230, 130, 0), font=font_label)

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

# Title
draw.text((pad, 22), "FIGMA AUDIT: 'SHOW FILTERS' TOGGLER BUTTON HIGHLIGHT", fill=(255, 255, 255), font=font_title)

# Left Column: US Storefront Actual (Red)
x_left = pad
y_top = top_banner
draw.text((x_left, y_top - 28), "US STOREFRONT (ACTUAL - MISSING 'SHOW FILTERS' TOGGLER)", fill=(255, 40, 40), font=font_header)
canvas.paste(us_resized, (x_left, y_top))
draw.rectangle([x_left, y_top, x_left + target_w, y_top + target_h], outline=(255, 0, 0), width=border_thick)

# Right Column: Figma Design Requirement (Green)
x_right = pad + target_w + gap
draw.text((x_right, y_top - 28), "FIGMA DESIGN REQUIREMENT (FINAL DESIGNS: 'SHOW FILTERS' PINNED LEFT)", fill=(0, 255, 70), font=font_header)
canvas.paste(figma_resized, (x_right, y_top))
draw.rectangle([x_right, y_top, x_right + target_w, y_top + target_h], outline=(0, 255, 0), width=border_thick)

# Single line description at bottom
desc = "Defect: The 'Show Filters' toggler button is missing from the horizontal filter toolbar on US Storefront (present in Figma before filter pills)."
draw.text((pad, y_top + target_h + 20), desc, fill=(240, 240, 240), font=font_desc)

for p in OUT_PATHS:
    canvas.save(p, quality=95)
    print(f"Saved: {p}")
