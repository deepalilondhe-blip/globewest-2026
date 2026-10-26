import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
DEFECTS_DIR = os.path.join(SCREENSHOTS_DIR, "defects")
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
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

# Load the annotated evidence
ev_path = os.path.join(DEFECTS_DIR, "EVIDENCE_DUPLICATE_DISCLAIMER_MOBILE.png")
if os.path.exists(ev_path):
    ev_img = Image.open(ev_path)
    
    W = 1200
    H = 1550
    comp = Image.new("RGB", (W, H), (248, 249, 252))
    draw = ImageDraw.Draw(comp)
    
    # Header
    draw.rectangle([0, 0, W, 110], fill=(24, 28, 36))
    draw.text((40, 24), "DEFECT: DUPLICATE DISCLAIMER TEXT ON MOBILE VIEW", font=get_font(28, bold=True), fill=(255, 255, 255))
    draw.text((40, 68), "URL: https://mcstaging2.globewest.com/locator | Device Viewport: Mobile (iPhone / Android)", font=get_font(16, bold=False), fill=(160, 172, 190))
    
    # Card container
    draw_rounded_rect(draw, [40, 130, W - 40, H - 40], 12, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    
    # Description block
    draw.text((60, 150), "EXACT LOCATION OF DUPLICATION IN DOM & ON SCREEN:", font=get_font(18, bold=True), fill=(24, 28, 36))
    
    draw.text((60, 185), "1. First Occurrence (Above Map):", font=get_font(16, bold=True), fill=(220, 38, 38))
    draw.text((60, 210), "• Class: <p class=\"help-text mobile-only\">", font=get_font(15, bold=False), fill=(51, 65, 85))
    draw.text((60, 235), "• Location: Sits directly beneath 'SEARCH BY STORE NAME' input, right above the map canvas.", font=get_font(15, bold=False), fill=(51, 65, 85))
    
    draw.text((60, 275), "2. Second Occurrence (Below Map):", font=get_font(16, bold=True), fill=(220, 38, 38))
    draw.text((60, 300), "• Class: <p class=\"help-text\">", font=get_font(15, bold=False), fill=(51, 65, 85))
    draw.text((60, 325), "• Location: Sits directly beneath the Google Maps canvas, right above the CMS block.", font=get_font(15, bold=False), fill=(51, 65, 85))
    
    draw.text((60, 365), "• Cause: Developer added a '.mobile-only' paragraph but forgot to hide the original '.help-text' on mobile.", font=get_font(14, bold=False), fill=(100, 116, 139))
    
    # Paste evidence image
    # Image is 402x600 @2x = 804x1200
    ev_w, ev_h = ev_img.size
    target_w = 700
    target_h = int(ev_h * (target_w / ev_w))
    ev_scaled = ev_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    comp.paste(ev_scaled, ((W - target_w) // 2, 410))
    draw.rectangle([ (W - target_w) // 2, 410, (W - target_w) // 2 + target_w, 410 + target_h], outline=(220, 38, 38), width=2)
    
    out_file = os.path.join(COMPARISON_DIR, "COMPARISON_11_DUPLICATE_DISCLAIMER_MOBILE.png")
    comp.save(out_file, quality=95)
    print(f"Saved: {out_file}")
