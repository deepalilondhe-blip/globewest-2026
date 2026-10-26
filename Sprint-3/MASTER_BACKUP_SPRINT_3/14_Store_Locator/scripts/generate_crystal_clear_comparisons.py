#!/usr/bin/env python3
"""
Generate Crystal-Clear, High-Resolution Side-by-Side Comparison Proofs
matching US Storefront directly against AU Baseline.
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
DESKTOP_DIR = os.path.join(SCREENSHOTS_DIR, "desktop")
IPHONE17_DIR = os.path.join(SCREENSHOTS_DIR, "iphone17pro")
DEFECTS_DIR = os.path.join(SCREENSHOTS_DIR, "defects")
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(COMPARISON_DIR, exist_ok=True)

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, bounds, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = bounds
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def draw_status_dot(draw, x, y, radius, color):
    draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color)

def create_crystal_clear_comparison(
    left_img, right_img, out_path,
    title, subtitle,
    left_label, right_label,
    left_notes, right_notes,
    target_crop_h=700
):
    """
    Renders an ultra-crisp, high-definition side-by-side comparison.
    left_img: AU Baseline Live (Expected) -> Green
    right_img: US Storefront Live (Actual) -> Red
    """
    CANVAS_W = 1800
    CANVAS_H = 1050
    
    comp = Image.new("RGB", (CANVAS_W, CANVAS_H), (248, 249, 252))
    draw = ImageDraw.Draw(comp)
    
    font_title = get_font(32, bold=True)
    font_sub = get_font(16, bold=False)
    font_tag = get_font(18, bold=True)
    font_note_hdr = get_font(16, bold=True)
    font_note_body = get_font(15, bold=False)
    
    # Header Banner (Dark Charcoal)
    draw.rectangle([0, 0, CANVAS_W, 110], fill=(24, 28, 36))
    draw.text((50, 24), title, font=font_title, fill=(255, 255, 255))
    draw.text((50, 72), subtitle, font=font_sub, fill=(160, 172, 190))
    
    # Left Tag: AU Baseline (GREEN)
    LEFT_X0 = 50
    LEFT_X1 = 875
    draw_rounded_rect(draw, [LEFT_X0, 130, LEFT_X1, 182], 8, fill=(236, 253, 245), outline=(16, 185, 129), width=2)
    draw_status_dot(draw, LEFT_X0 + 26, 156, 7, (16, 185, 129))
    draw.text((LEFT_X0 + 44, 144), left_label, font=font_tag, fill=(6, 95, 70))
    
    # Right Tag: US Storefront (RED)
    RIGHT_X0 = 925
    RIGHT_X1 = 1750
    draw_rounded_rect(draw, [RIGHT_X0, 130, RIGHT_X1, 182], 8, fill=(254, 242, 242), outline=(239, 68, 68), width=2)
    draw_status_dot(draw, RIGHT_X0 + 26, 156, 7, (239, 68, 68))
    draw.text((RIGHT_X0 + 44, 144), right_label, font=font_tag, fill=(153, 27, 27))
    
    # Crop & Scale Images
    IMG_W = 825
    IMG_H = target_crop_h
    
    if left_img:
        l_fitted = left_img.resize((IMG_W, IMG_H), Image.Resampling.LANCZOS)
        comp.paste(l_fitted, (LEFT_X0, 195))
        draw.rectangle([LEFT_X0, 195, LEFT_X1, 195 + IMG_H], outline=(16, 185, 129), width=3)
    
    if right_img:
        r_fitted = right_img.resize((IMG_W, IMG_H), Image.Resampling.LANCZOS)
        comp.paste(r_fitted, (RIGHT_X0, 195))
        draw.rectangle([RIGHT_X0, 195, RIGHT_X1, 195 + IMG_H], outline=(239, 68, 68), width=3)
        
    # Footer Comparison Notes
    draw.rectangle([0, CANVAS_H - 130, CANVAS_W, CANVAS_H], fill=(255, 255, 255), outline=(226, 232, 240))
    
    # Left Notes (AU)
    draw_status_dot(draw, LEFT_X0 + 10, CANVAS_H - 105, 5, (16, 185, 129))
    draw.text((LEFT_X0 + 26, CANVAS_H - 114), "AU BASELINE (EXPECTED / SOURCE OF TRUTH):", font=font_note_hdr, fill=(6, 95, 70))
    draw.text((LEFT_X0 + 26, CANVAS_H - 88), left_notes, font=font_note_body, fill=(51, 65, 85))
    
    # Right Notes (US)
    draw_status_dot(draw, RIGHT_X0 + 10, CANVAS_H - 105, 5, (239, 68, 68))
    draw.text((RIGHT_X0 + 26, CANVAS_H - 114), "US STOREFRONT LIVE (ACTUAL DEFECT / MISMATCH):", font=font_note_hdr, fill=(153, 27, 27))
    draw.text((RIGHT_X0 + 26, CANVAS_H - 88), right_notes, font=font_note_body, fill=(153, 27, 27))
    
    comp.save(out_path, quality=98)
    print(f"✅ Generated: {out_path}")

print("Crystal-clear comparison engine ready.")
