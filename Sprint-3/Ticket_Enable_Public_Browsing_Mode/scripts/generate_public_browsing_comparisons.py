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
        print(f"Error opening images: {e}")
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
        font_panel = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    except:
        font_title = font_footer = font_panel = ImageFont.load_default()

    # Draw Title
    title_text = f"GlobeWest QA Verification: {output_filename.replace('.png', '').replace('_', ' ')}"
    draw.text((25, 20), title_text, fill=(20, 30, 45), font=font_title)

    # Panel 1 (Left)
    x1 = 20
    y1 = header_h
    # Border
    draw.rectangle([x1 - border, y1 - border, x1 + w_left + border, y1 + target_h + border], fill=left_border_color)
    canvas.paste(im_left, (x1, y1))
    # Label
    draw.rectangle([x1, y1 - 32, x1 + 380, y1 - 4], fill=left_border_color)
    draw.text((x1 + 10, y1 - 28), left_title, fill=(255, 255, 255), font=font_panel)

    # Panel 2 (Right)
    x2 = x1 + w_left + spacing + (border * 2)
    draw.rectangle([x2 - border, y1 - border, x2 + w_right + border, y1 + target_h + border], fill=right_border_color)
    canvas.paste(im_right, (x2, y1))
    # Label
    draw.rectangle([x2, y1 - 32, x2 + 380, y1 - 4], fill=right_border_color)
    draw.text((x2 + 10, y1 - 28), right_title, fill=(255, 255, 255), font=font_panel)

    # Footer
    draw.text((25, total_h - 40), f"QA Verdict: {footer_text}", fill=(60, 70, 85), font=font_footer)

    out_path = os.path.join(OUT_DIR, output_filename)
    canvas.save(out_path, quality=95)
    print(f"✅ Generated: {out_path}")

# 1. Header Comparison
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, '01_AU_HEADER_GUEST.png'),
    os.path.join(SCREENSHOTS_DIR, '01_US_HEADER_GUEST.png'),
    "AU BASELINE (Retail Utility Bar)",
    "US STAGING (Public Browsing Mode)",
    (40, 167, 69), # Green
    (40, 167, 69), # Green (Pass)
    "COMPARISON_01_HEADER_GUEST_US_VS_AU.png",
    "PASS: US Public Browsing displays 'Become a Trade Customer' & 'Book Showroom'. Pricing toggle is strictly hidden."
)

# 2. PDP Comparison
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, '03_AU_PDP_GUEST_BASELINE.png'),
    os.path.join(SCREENSHOTS_DIR, '03_US_PDP_GUEST_MASKING.png'),
    "AU BASELINE (Retail Price $4,840 & Cart Active)",
    "US STAGING (Price & Cart 100% Suppressed)",
    (40, 167, 69), # Green
    (40, 167, 69), # Green (Pass)
    "COMPARISON_02_PDP_PRICE_AND_CART_MASKING.png",
    "PASS: US Guest PDP strictly masks wholesale price and suppresses Add to Cart button while maintaining catalog access."
)

# 3. SearchSpring Comparison
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, '02_US_PLP_GUEST_GRID.png'),
    os.path.join(SCREENSHOTS_DIR, '04_US_SEARCHSPRING_CHAIR.png'),
    "US PLP (Category Grid Browsing Functional)",
    "US SEARCH (SearchSpring Returns 0 Products)",
    (40, 167, 69), # Green
    (220, 53, 69), # Red (Defect)
    "COMPARISON_03_SEARCHSPRING_0_RESULTS_DEFECT.png",
    "CRITICAL DEFECT: SearchSpring query '?q=chair' returns 0 products on US Storefront due to missing store index sync."
)

# 4. PLP Placeholders Comparison
create_side_by_side(
    os.path.join(SCREENSHOTS_DIR, '06_US_TRADE_AUTHENTICATED_PLP.png'),
    os.path.join(SCREENSHOTS_DIR, '02_US_PLP_GUEST_GRID.png'),
    "US TRADE MODE (Pricing & Badges Active)",
    "US GUEST PLP (GW Coming Soon Placeholders)",
    (40, 167, 69), # Green
    (220, 53, 69), # Red (Defect)
    "COMPARISON_04_PLP_ASSET_SYNC_COMING_SOON_PLACEHOLDERS.png",
    "NETSUITE ASSET DEFECT: Product cards display '230118_Image-Coming-Soon-2_1100x1100_1.jpg' placeholders instead of photography."
)
print("All Public Browsing comparisons generated.")
