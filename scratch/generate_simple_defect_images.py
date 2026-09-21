import os
from PIL import Image, ImageDraw, ImageFont

EVIDENCE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket - Enable Public Browsing Mode/evidence"
COMP_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket - Enable Public Browsing Mode/comparison"
os.makedirs(COMP_DIR, exist_ok=True)

# Fonts
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_sub_red = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    font_sub_green = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    font_caption = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
except:
    font_title = ImageFont.load_default()
    font_sub_red = font_title
    font_sub_green = font_title
    font_caption = font_title
    font_badge = font_title

def make_two_panel(title, caption, img_left_path, img_right_path, left_crop, right_crop, left_box, right_box, out_path, left_tag, right_tag):
    W = 680
    H = 380
    canvas_w = W * 2 + 50
    canvas_h = H + 160

    canvas = Image.new("RGB", (canvas_w, canvas_h), (11, 14, 20)) # Dark slate
    draw = ImageDraw.Draw(canvas)

    # Top Title
    draw.text((25, 20), title, fill=(255, 255, 255), font=font_title)

    # Column Subheaders
    draw.text((25, 60), "US STOREFRONT (DEFECT)", fill=(239, 68, 68), font=font_sub_red)
    draw.text((W + 35, 60), "AU STOREFRONT / EXPECTED (BASELINE)", fill=(34, 197, 94), font=font_sub_green)

    # Left Panel (Red)
    if os.path.exists(img_left_path):
        left_raw = Image.open(img_left_path)
        left_cropped = left_raw.crop(left_crop).resize((W, H), Image.Resampling.LANCZOS)
        canvas.paste(left_cropped, (25, 90))
    
    # Red Outer Border
    draw.rectangle([25, 90, 25 + W, 90 + H], outline=(239, 68, 68), width=3)
    
    # Red Inner Highlight Box
    if left_box:
        lx1, ly1, lx2, ly2 = left_box
        draw.rectangle([25 + lx1, 90 + ly1, 25 + lx2, 90 + ly2], outline=(239, 68, 68), width=4)
        # Badge
        draw.rectangle([25 + lx1, 90 + ly1 - 26, 25 + lx1 + 220, 90 + ly1], fill=(239, 68, 68))
        draw.text((25 + lx1 + 8, 90 + ly1 - 22), left_tag, fill=(255, 255, 255), font=font_badge)

    # Right Panel (Green)
    if os.path.exists(img_right_path):
        right_raw = Image.open(img_right_path)
        right_cropped = right_raw.crop(right_crop).resize((W, H), Image.Resampling.LANCZOS)
        canvas.paste(right_cropped, (W + 35, 90))
    
    # Green Outer Border
    draw.rectangle([W + 35, 90, W + 35 + W, 90 + H], outline=(34, 197, 94), width=3)
    
    # Green Inner Highlight Box
    if right_box:
        rx1, ry1, rx2, ry2 = right_box
        draw.rectangle([W + 35 + rx1, 90 + ry1, W + 35 + rx2, 90 + ry2], outline=(34, 197, 94), width=4)
        # Badge
        draw.rectangle([W + 35 + rx1, 90 + ry1 - 26, W + 35 + rx1 + 240, 90 + ry1], fill=(34, 197, 94))
        draw.text((W + 35 + rx1 + 8, 90 + ry1 - 22), right_tag, fill=(0, 0, 0), font=font_badge)

    # Bottom Caption
    draw.text((25, 90 + H + 18), caption, fill=(209, 213, 219), font=font_caption)

    canvas.save(out_path, quality=95)
    print("Generated:", out_path)

# ---------------------------------------------------------------------------
# DEFECT 1: SearchSpring Search 0 Results
# ---------------------------------------------------------------------------
make_two_panel(
    title="DEFECT 1: SEARCHSPRING CATALOG SEARCH RETURNS 0 RESULTS",
    caption="Defect: Guest search on US storefront returns 0 products / empty blank page because SearchSpring is not active for the US scope.\nExpected: Search query should return catalog products with pricing suppressed (Public Browsing Mode).",
    img_left_path=os.path.join(EVIDENCE_DIR, "03_US_SEARCHSPRING_GUEST.png"),
    img_right_path=os.path.join(EVIDENCE_DIR, "04_AU_PLP_GUEST_BASELINE.png"),
    left_crop=(0, 0, 1440, 750),
    right_crop=(0, 150, 1440, 850),
    left_box=(40, 140, 640, 360),
    right_box=(40, 40, 640, 360),
    out_path=os.path.join(COMP_DIR, "DEFECT_1_SEARCHSPRING_0_RESULTS.png"),
    left_tag="RED: 0 RESULTS / BLANK",
    right_tag="GREEN: ACTIVE CATALOG GRID"
)

# ---------------------------------------------------------------------------
# DEFECT 2: Top Utility Bar Missing Become Trade Customer
# ---------------------------------------------------------------------------
make_two_panel(
    title="DEFECT 2: TOP UTILITY BAR MISSING 'BECOME A TRADE CUSTOMER' LINK",
    caption="Defect: US storefront top utility bar only shows 'Book Showroom Appointment'. 'Become a Trade Customer' link is completely missing.\nExpected (Figma & Blueprint): Must display 'Become a Trade Customer' so guest visitors can register to unlock pricing.",
    img_left_path=os.path.join(EVIDENCE_DIR, "01_US_PLP_GUEST_BROWSING.png"),
    img_right_path=os.path.join(EVIDENCE_DIR, "04_AU_PLP_GUEST_BASELINE.png"),
    left_crop=(0, 0, 1440, 200),
    right_crop=(0, 0, 1440, 200),
    left_box=(20, 10, 420, 80),
    right_box=(20, 10, 420, 80),
    out_path=os.path.join(COMP_DIR, "DEFECT_2_TOP_BAR_TRADE_CTA_MISSING.png"),
    left_tag="RED: TRADE CTA MISSING",
    right_tag="GREEN: SERVICE LINK SHOWING"
)

# ---------------------------------------------------------------------------
# DEFECT 3: PDP Leaves Empty Gap without Login/Trade CTA
# ---------------------------------------------------------------------------
make_two_panel(
    title="DEFECT 3: PDP PRICE & ORDERING SECTION LEAVES EMPTY BLANK GAP",
    caption="Defect: While price and Add to Cart are suppressed for guests, there is no CTA explaining how to view pricing (empty white gap).\nExpected: In place of the hidden price/cart, render a clear prompt: [ Log In for Trade Pricing ] or [ Apply for a Trade Account ].",
    img_left_path=os.path.join(EVIDENCE_DIR, "PROOF_1_GUEST_PDP_NO_PRICE_NO_CART.png"),
    img_right_path=os.path.join(EVIDENCE_DIR, "PROOF_2_TRADE_LOGGED_IN_SHOWS_PRICE_AND_CART.png"),
    left_crop=(900, 200, 1440, 800),
    right_crop=(900, 200, 1440, 800),
    left_box=(20, 120, 640, 340),
    right_box=(20, 120, 640, 340),
    out_path=os.path.join(COMP_DIR, "DEFECT_3_PDP_EMPTY_GAP_NO_CTA.png"),
    left_tag="RED: EMPTY GAP (NO CTA)",
    right_tag="GREEN: TRADE PRICING ACTIVE"
)

# ---------------------------------------------------------------------------
# DEFECT 4: Hero Banner Australian Copy Leakage
# ---------------------------------------------------------------------------
make_two_panel(
    title="DEFECT 4: CATEGORY HERO BANNER LEAKS 'AUSTRALIAN HOMES' COPY",
    caption="Defect: Hero banner on US /indoor page states '...to enrich Australian homes...' instead of US-tailored copy.\nExpected: Marketing copy must be localized or neutral for the US expansion storefront.",
    img_left_path=os.path.join(EVIDENCE_DIR, "01_US_PLP_GUEST_BROWSING.png"),
    img_right_path=os.path.join(EVIDENCE_DIR, "04_AU_PLP_GUEST_BASELINE.png"),
    left_crop=(50, 200, 750, 600),
    right_crop=(50, 200, 750, 600),
    left_box=(20, 160, 640, 320),
    right_box=(20, 160, 640, 320),
    out_path=os.path.join(COMP_DIR, "DEFECT_4_HERO_BANNER_AU_COPY_LEAK.png"),
    left_tag="RED: 'AUSTRALIAN HOMES' LEAK",
    right_tag="GREEN: DOMESTIC BASELINE"
)
