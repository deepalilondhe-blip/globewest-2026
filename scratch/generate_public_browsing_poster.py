import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket - Enable Public Browsing Mode/evidence"
OUTPUT_PATH = os.path.join(BASE_DIR, "MASTER_PUBLIC_BROWSING_AUDIT_POSTER.png")

IMG_01 = os.path.join(BASE_DIR, "01_US_PLP_GUEST_BROWSING.png")
IMG_02 = os.path.join(BASE_DIR, "02_US_PDP_GUEST_BROWSING.png")
IMG_03 = os.path.join(BASE_DIR, "03_US_SEARCHSPRING_GUEST.png")
IMG_04 = os.path.join(BASE_DIR, "04_AU_PLP_GUEST_BASELINE.png")

# Target panel dimensions
PW = 900
PH = 540
HEADER_H = 110
FOOTER_H = 50
CANVAS_W = PW * 2 + 40
CANVAS_H = HEADER_H + (PH * 2) + 60 + FOOTER_H

canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), (15, 23, 42)) # Slate dark background
draw = ImageDraw.Draw(canvas)

# Try loading fonts, fall back to default
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    font_card_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_card_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_tag = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
except:
    font_title = ImageFont.load_default()
    font_sub = font_title
    font_card_title = font_title
    font_card_sub = font_title
    font_tag = font_title

# Draw Header
draw.text((25, 20), "SPRINT 1 QA AUDIT: ENABLE PUBLIC BROWSING MODE", fill=(255, 255, 255), font=font_title)
draw.text((25, 60), "Environment: US Staging (mcstaging2.globewest.com) vs AU Baseline | Tested by Deepali Londhe (Senior QA)", fill=(148, 163, 184), font=font_sub)

panels = [
    {
        "path": IMG_01,
        "x": 20,
        "y": HEADER_H + 10,
        "title": "PANEL 1: US PLP GUEST BROWSING (PASS)",
        "sub": "Prices & Add to Cart suppressed. Zero price leaks in DOM/HTML.",
        "status": "PASS: MASKED",
        "status_color": (34, 197, 94), # Green
        "border_color": (34, 197, 94)
    },
    {
        "path": IMG_04,
        "x": PW + 30,
        "y": HEADER_H + 10,
        "title": "PANEL 2: AU STOREFRONT REGRESSION BASELINE (PASS)",
        "sub": "Australian guests remain unrestricted with retail AUD prices visible.",
        "status": "AU BASELINE: PASS",
        "status_color": (34, 197, 94), # Green
        "border_color": (34, 197, 94)
    },
    {
        "path": IMG_02,
        "x": 20,
        "y": HEADER_H + PH + 30,
        "title": "PANEL 3: US PDP GUEST MODE (PASS / OBSERVATION)",
        "sub": "Product details accessible; price/cart masked. Missing explicit trade CTA.",
        "status": "PASS / MINOR UX GAP",
        "status_color": (234, 179, 8), # Yellow/Orange
        "border_color": (234, 179, 8)
    },
    {
        "path": IMG_03,
        "x": PW + 30,
        "y": HEADER_H + PH + 30,
        "title": "PANEL 4: SEARCHSPRING CATALOG SEARCH (DEFECT / BLOCKED)",
        "sub": "Keyword search returns 0 items. SS dashboard sync pending for US scope.",
        "status": "DEFECT: 0 RESULTS",
        "status_color": (239, 68, 68), # Red
        "border_color": (239, 68, 68)
    }
]

for p in panels:
    px, py = p["x"], p["y"]
    # Draw panel container card
    draw.rectangle([px, py, px + PW, py + PH], fill=(30, 41, 59), outline=p["border_color"], width=2)
    
    # Title bar inside panel
    draw.rectangle([px, py, px + PW, py + 45], fill=(15, 23, 42))
    draw.text((px + 12, py + 8), p["title"], fill=(248, 250, 252), font=font_card_title)
    draw.text((px + 12, py + 26), p["sub"], fill=(148, 163, 184), font=font_card_sub)
    
    # Badge
    tag_w = 170
    tag_h = 24
    tag_x = px + PW - tag_w - 10
    tag_y = py + 10
    draw.rectangle([tag_x, tag_y, tag_x + tag_w, tag_y + tag_h], fill=p["status_color"])
    draw.text((tag_x + 8, tag_y + 4), p["status"], fill=(0, 0, 0), font=font_tag)
    
    # Load and place image
    if os.path.exists(p["path"]):
        img = Image.open(p["path"])
        # Crop or fit to panel viewport
        target_img_w = PW - 10
        target_img_h = PH - 55
        
        # Calculate aspect ratio
        img_ratio = img.width / img.height
        target_ratio = target_img_w / target_img_h
        
        if img_ratio > target_ratio:
            # Image is wider: crop sides or scale
            scale = target_img_w / img.width
            new_h = int(img.height * scale)
            resized = img.resize((target_img_w, new_h), Image.Resampling.LANCZOS)
            canvas.paste(resized, (px + 5, py + 48))
        else:
            scale = target_img_w / img.width
            resized = img.resize((target_img_w, int(img.height * scale)), Image.Resampling.LANCZOS)
            # Crop to target_img_h
            cropped = resized.crop((0, 0, target_img_w, min(resized.height, target_img_h)))
            canvas.paste(cropped, (px + 5, py + 48))

canvas.save(OUTPUT_PATH, quality=95)
print(f"Master Poster successfully created at: {OUTPUT_PATH}")
