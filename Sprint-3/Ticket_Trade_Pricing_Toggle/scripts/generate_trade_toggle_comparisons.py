import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, '../screenshots')
OUT_DIR = os.path.join(BASE_DIR, '../comparison')
os.makedirs(OUT_DIR, exist_ok=True)

def create_side_by_side(left_img_path, right_img_path, left_title, right_title, left_border_color, right_border_color, output_filename, footer_text):
    try:
        im_left = Image.open(left_img_path)
        im_right = Image.open(right_img_path)
    except Exception as e:
        print(f"Error opening images ({left_img_path}, {right_img_path}): {e}")
        return

    # Resize to common height
    target_h = 700
    w_left = int(im_left.width * (target_h / im_left.height))
    im_left = im_left.resize((w_left, target_h), Image.Resampling.LANCZOS)

    w_right = int(im_right.width * (target_h / im_right.height))
    im_right = im_right.resize((w_right, target_h), Image.Resampling.LANCZOS)

    header_h = 70
    footer_h = 60
    border = 6
    spacing = 30
    total_w = w_left + w_right + spacing + (border * 4) + 40
    total_h = target_h + header_h + footer_h + (border * 2)

    canvas = Image.new("RGB", (total_w, total_h), (245, 247, 250))
    draw = ImageDraw.Draw(canvas)

    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
        font_footer = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
        font_panel = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    except:
        font_title = font_footer = font_panel = ImageFont.load_default()

    # Draw Title
    title_text = f"GlobeWest QA Verification: {output_filename.replace('.png', '').replace('_', ' ')}"
    draw.text((25, 20), title_text, fill=(20, 30, 45), font=font_title)

    # Panel 1 (Left)
    x1 = 20
    y1 = header_h
    draw.rectangle([x1 - border, y1 - border, x1 + w_left + border, y1 + target_h + border], fill=left_border_color)
    canvas.paste(im_left, (x1, y1))
    draw.rectangle([x1, y1 - 32, x1 + min(w_left, 440), y1 - 4], fill=left_border_color)
    draw.text((x1 + 10, y1 - 28), left_title, fill=(255, 255, 255), font=font_panel)

    # Panel 2 (Right)
    x2 = x1 + w_left + spacing + (border * 2)
    draw.rectangle([x2 - border, y1 - border, x2 + w_right + border, y1 + target_h + border], fill=right_border_color)
    canvas.paste(im_right, (x2, y1))
    draw.rectangle([x2, y1 - 32, x2 + min(w_right, 440), y1 - 4], fill=right_border_color)
    draw.text((x2 + 10, y1 - 28), right_title, fill=(255, 255, 255), font=font_panel)

    # Footer Notes
    draw.text((25, total_h - 45), footer_text, fill=(60, 70, 85), font=font_footer)

    out_path = os.path.join(OUT_DIR, output_filename)
    canvas.save(out_path, quality=95)
    print(f"✅ Generated Comparison: {out_path}")

# Palette
RED = (220, 53, 69)      # Actual live defect or warning
GREEN = (40, 167, 69)     # Verified feature or approved spec
BLUE = (23, 162, 184)     # Authenticated state / baseline

# 1. Guest Logged-Out vs Trade Logged-In
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, "01_GUEST_TOGGLE_HIDDEN.png"),
    os.path.join(SCREENSHOTS_DIR, "02_TRADE_DEFAULT_PRICING_PLP.png"),
    "GUEST STATE: Toggle Hidden & Zero Pricing",
    "TRADE LOGGED-IN: Toggle Visible & Dual Pricing",
    BLUE, GREEN,
    "COMPARISON_01_GUEST_VS_TRADE_TOGGLE.png",
    "Verification: Public guest has zero pricing and no toggle. Trade customer gains header toggle + wholesale pricing."
)

# 2. PLP Trade View vs MSRP View
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, "02_TRADE_DEFAULT_PRICING_PLP.png"),
    os.path.join(SCREENSHOTS_DIR, "03_MSRP_ONLY_VIEW_PLP.png"),
    "DEFAULT TRADE MODE: Dual Pricing ($638 + MSRP)",
    "MSRP MODE: Wholesale Suppressed ($701.80 Only)",
    GREEN, GREEN,
    "COMPARISON_02_TRADE_MODE_VS_MSRP_MODE_PLP.png",
    "Verification: Selecting MSRP suppresses wholesale trade discount across category grid for showroom client presentations."
)

# 3. PDP Trade View vs MSRP View
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, "06_PDP_TRADE_MODE.png"),
    os.path.join(SCREENSHOTS_DIR, "07_PDP_MSRP_MODE.png"),
    "PDP TRADE MODE: Dual Pricing ($638.00 + MSRP)",
    "PDP MSRP MODE: Wholesale Suppressed ($701.80 MSRP)",
    GREEN, GREEN,
    "COMPARISON_03_PDP_TRADE_VS_MSRP_PRICING.png",
    "Verification: PDP dynamically suppresses wholesale discount line when toggled to MSRP mode."
)

# 4. Mobile Eye Icon Trigger vs Mobile Slide-Out Drawer
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, "05_MOBILE_EYE_ICON_TRIGGER.png"),
    os.path.join(SCREENSHOTS_DIR, "05_MOBILE_SLIDEOUT_DRAWER_OPEN.png"),
    "MOBILE HEADER: Eye Icon (👁️) Trigger",
    "MOBILE SLIDE-OUT: Drawer Open (Trade / MSRP)",
    BLUE, GREEN,
    "COMPARISON_04_MOBILE_EYE_TRIGGER_VS_SLIDEOUT.png",
    "Verification: Mobile view implements eye icon trigger opening full slide-out drawer with Trade/MSRP options."
)

# 5. SearchSpring Integration Defect
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, "09_SEARCHSPRING_SEARCH_RESULTS.png"),
    os.path.join(SCREENSHOTS_DIR, "11_AU_BASELINE_PLP.png"),
    "🔴 US mcstaging2: SearchSpring Search Fails / Blank",
    "🟢 AU Baseline: Catalog Search Functioning",
    RED, GREEN,
    "COMPARISON_05_SEARCHSPRING_SEARCH_RESULTS_DEFECT.png",
    "Defect Flagged: SearchSpring search results do not coordinate with toggle state on mcstaging2 (fails to render products)."
)
