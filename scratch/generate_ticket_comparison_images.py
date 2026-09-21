import os
from PIL import Image, ImageDraw, ImageFont

EVIDENCE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket - Enable Public Browsing Mode/evidence"

def draw_arrow(draw, start, end, color, width=4, arrow_size=16):
    """Draws a highlighted arrow from start to end with an arrowhead"""
    draw.line([start, end], fill=color, width=width)
    import math
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    # Arrowhead points
    p1 = (end[0] - arrow_size * math.cos(angle - math.pi / 6),
          end[1] - arrow_size * math.sin(angle - math.pi / 6))
    p2 = (end[0] - arrow_size * math.cos(angle + math.pi / 6),
          end[1] - arrow_size * math.sin(angle + math.pi / 6))
    draw.polygon([end, p1, p2], fill=color)

# Fonts
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_caption = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
except:
    font_title = ImageFont.load_default()
    font_sub = font_title
    font_label = font_title
    font_caption = font_title

# -------------------------------------------------------------------------
# IMAGE 1: DEFECT - SearchSpring Catalog Search (0 Results on US vs AU Grid)
# -------------------------------------------------------------------------
us_search_path = os.path.join(EVIDENCE_DIR, "03_US_SEARCHSPRING_GUEST.png")
au_search_path = os.path.join(EVIDENCE_DIR, "03_AU_SEARCH_RESULTS.png")

if os.path.exists(us_search_path) and os.path.exists(au_search_path):
    img_us = Image.open(us_search_path)
    img_au = Image.open(au_search_path)

    W = 700
    H = 420
    canvas_w = W * 2 + 60
    canvas_h = H + 180

    comp1 = Image.new("RGB", (canvas_w, canvas_h), (11, 14, 20))
    d1 = ImageDraw.Draw(comp1)

    # Title
    d1.text((25, 20), "DEFECT: SEARCHSPRING CATALOG SEARCH BROKEN FOR PUBLIC BROWSING", fill=(255, 255, 255), font=font_title)
    d1.text((25, 52), "US Storefront: Search for 'chair' returns 0 results / blank page vs. AU Baseline", fill=(156, 163, 175), font=font_caption)

    # Subheaders
    d1.text((25, 85), "US STOREFRONT — WHAT IS NOT SHOWING (DEFECT / BLOCKER)", fill=(239, 68, 68), font=font_sub)
    d1.text((W + 35, 85), "AU STOREFRONT — WHAT IS SHOWING (BASELINE REFERENCE)", fill=(34, 197, 94), font=font_sub)

    # Paste US image
    us_crop = img_us.crop((0, 0, min(img_us.width, 1440), min(img_us.height, 800))).resize((W, H), Image.Resampling.LANCZOS)
    comp1.paste(us_crop, (25, 115))
    d1.rectangle([25, 115, 25 + W, 115 + H], outline=(239, 68, 68), width=3)

    # US Highlight box & Arrow
    d1.rectangle([60, 200, 680, 480], outline=(239, 68, 68), width=3)
    draw_arrow(d1, (370, 160), (370, 210), (239, 68, 68), width=4)
    d1.rectangle([220, 140, 520, 175], fill=(239, 68, 68))
    d1.text((230, 148), "IS NOT SHOWING: 0 PRODUCTS FOUND", fill=(255, 255, 255), font=font_label)

    # Paste AU image
    au_crop = img_au.crop((0, 0, min(img_au.width, 1440), min(img_au.height, 800))).resize((W, H), Image.Resampling.LANCZOS)
    comp1.paste(au_crop, (W + 35, 115))
    d1.rectangle([W + 35, 115, W + 35 + W, 115 + H], outline=(34, 197, 94), width=3)

    # AU Highlight box & Arrow
    d1.rectangle([W + 55, 200, W + 35 + W - 20, 480], outline=(34, 197, 94), width=3)
    draw_arrow(d1, (W + 370, 160), (W + 370, 210), (34, 197, 94), width=4)
    d1.rectangle([W + 200, 140, W + 540, 175], fill=(34, 197, 94))
    d1.text((W + 210, 148), "IS SHOWING: ACTIVE SEARCH RESULTS GRID", fill=(0, 0, 0), font=font_label)

    # Bottom Caption
    caption1 = "Defect Explanation: On the US Storefront, searching for 'chair' returns 0 products and an empty page because SearchSpring is not active for the US scope.\nExpected: Guest search should return catalog products with pricing suppressed (Public Browsing Mode)."
    d1.text((25, 115 + H + 18), caption1, fill=(229, 231, 235), font=font_caption)

    out1 = os.path.join(EVIDENCE_DIR, "SHOWING_VS_NOT_SHOWING_SEARCHSPRING_DEFECT.png")
    comp1.save(out1, quality=95)
    print("Saved:", out1)

# -------------------------------------------------------------------------
# IMAGE 2: PASS - Public Browsing Masking on PLP (US vs AU Pricing)
# -------------------------------------------------------------------------
us_plp_path = os.path.join(EVIDENCE_DIR, "01_US_PLP_GUEST_BROWSING.png")
au_plp_path = os.path.join(EVIDENCE_DIR, "04_AU_PLP_GUEST_BASELINE.png")

if os.path.exists(us_plp_path) and os.path.exists(au_plp_path):
    img_us_plp = Image.open(us_plp_path)
    img_au_plp = Image.open(au_plp_path)

    W = 700
    H = 420
    canvas_w = W * 2 + 60
    canvas_h = H + 180

    comp2 = Image.new("RGB", (canvas_w, canvas_h), (11, 14, 20))
    d2 = ImageDraw.Draw(comp2)

    # Title
    d2.text((25, 20), "PUBLIC BROWSING VERIFICATION: PRICING & ADD TO CART MASKING", fill=(255, 255, 255), font=font_title)
    d2.text((25, 52), "US Storefront: Pricing & Add to Cart suppressed for Guests vs. AU Storefront Unrestricted", fill=(156, 163, 175), font=font_caption)

    # Subheaders
    d2.text((25, 85), "US STOREFRONT — PRICES NOT SHOWING (PASS FOR PUBLIC BROWSING)", fill=(34, 197, 94), font=font_sub)
    d2.text((W + 35, 85), "AU STOREFRONT — RETAIL PRICES SHOWING (AU SAFEGUARD PASS)", fill=(34, 197, 94), font=font_sub)

    # Paste US image
    us_plp_crop = img_us_plp.crop((0, 400, min(img_us_plp.width, 1440), min(img_us_plp.height, 900))).resize((W, H), Image.Resampling.LANCZOS)
    comp2.paste(us_plp_crop, (25, 115))
    d2.rectangle([25, 115, 25 + W, 115 + H], outline=(34, 197, 94), width=3)

    # US Highlight box & Arrow
    d2.rectangle([60, 240, 680, 480], outline=(34, 197, 94), width=3)
    draw_arrow(d2, (370, 190), (370, 240), (34, 197, 94), width=4)
    d2.rectangle([180, 165, 560, 200], fill=(34, 197, 94))
    d2.text((190, 173), "PRICES & CART: 100% NOT SHOWING (PASS)", fill=(0, 0, 0), font=font_label)

    # Paste AU image
    au_plp_crop = img_au_plp.crop((0, 150, min(img_au_plp.width, 1440), min(img_au_plp.height, 750))).resize((W, H), Image.Resampling.LANCZOS)
    comp2.paste(au_plp_crop, (W + 35, 115))
    d2.rectangle([W + 35, 115, W + 35 + W, 115 + H], outline=(34, 197, 94), width=3)

    # AU Highlight box & Arrow
    d2.rectangle([W + 55, 240, W + 35 + W - 20, 480], outline=(34, 197, 94), width=3)
    draw_arrow(d2, (W + 370, 190), (W + 370, 240), (34, 197, 94), width=4)
    d2.rectangle([W + 180, 165, W + 560, 200], fill=(34, 197, 94))
    d2.text((W + 190, 173), "RETAIL PRICES: SHOWING ($8,305.00 AUD)", fill=(0, 0, 0), font=font_label)

    # Bottom Caption
    caption2 = "Verification Result: US Storefront hides all product pricing and Add to Cart triggers for public guest visitors.\nAU Storefront remains unrestricted (AU Safeguard Pass)."
    d2.text((25, 115 + H + 18), caption2, fill=(229, 231, 235), font=font_caption)

    out2 = os.path.join(EVIDENCE_DIR, "SHOWING_VS_NOT_SHOWING_PUBLIC_BROWSING_PASS.png")
    comp2.save(out2, quality=95)
    print("Saved:", out2)
