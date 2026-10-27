import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=True):
    try:
        font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
        if not os.path.exists(font_path):
            font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def create_master_comparison():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page'
    out_dir = os.path.join(base_dir, 'screenshots/regression_run')
    os.makedirs(out_dir, exist_ok=True)

    # Images
    # 1. Desktop Logged Out Live
    desk_live_path = os.path.join(out_dir, '11_DESKTOP_LOGGED_OUT_FUNCTIONALITY_AUDITED.png')
    # 2. Mobile MSRP Pricing Live
    mob_live_path = os.path.join(out_dir, '13_MOBILE_MSRP_GRID_CARDS.png')
    
    # 3. User's uploaded Figma reference snippet
    user_upload_path = '/home/deepali/.gemini/antigravity-ide/brain/312ed68a-6b9a-4903-b00f-85f88631687a/.user_uploaded/media_1792043559035.png'
    
    out_file = os.path.join(out_dir, 'FIGMA_FRAMES_USER_REQUESTED_EXHAUSTIVE_AUDIT.png')

    desk_im = Image.open(desk_live_path).convert('RGB')
    mob_im = Image.open(mob_live_path).convert('RGB')
    user_ref = Image.open(user_upload_path).convert('RGB')

    # Total canvas
    total_w = 1700
    total_h = 1100
    canvas = Image.new('RGB', (total_w, total_h), (15, 20, 26))
    draw = ImageDraw.Draw(canvas)

    f_title = get_font(24, bold=True)
    f_sub = get_font(15, bold=False)
    f_badge = get_font(14, bold=True)
    f_item_title = get_font(16, bold=True)
    f_body = get_font(13, bold=False)
    f_body_bold = get_font(13, bold=True)

    # 1. Header Banner
    draw.rectangle([(0, 0), (total_w, 85)], fill=(22, 28, 36))
    draw.text((25, 18), "GLOBEWEST PLP: PRE-GO-LIVE FORENSIC AUDIT (CLICKS, DROPDOWNS & FIGMA FIDELITY)", fill=(255, 255, 255), font=f_title)
    draw.text((25, 52), "Direct audit against user-specified Figma frames: [desktop/Category/Logged Out] & [Mobile/Category/MSRP Pricing]", fill=(148, 163, 184), font=f_sub)

    # 2. Top: Figma User-Referenced Specs Snippet
    draw.rectangle([(25, 95), (total_w - 25, 275)], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
    draw.rectangle([(25, 95), (320, 122)], fill=(16, 185, 129))
    draw.text((35, 100), "APPROVED FIGMA FRAMES (USER REFERENCE)", fill=(255, 255, 255), font=f_badge)

    # Paste resized user ref
    ref_w = total_w - 70
    ref_h = 140
    user_ref_scaled = user_ref.resize((ref_w, ref_h), Image.Resampling.LANCZOS)
    canvas.paste(user_ref_scaled, (35, 128))

    # 3. Bottom Columns: Desktop Live (Left) & Mobile Live (Right)
    # Left Column: Desktop Logged Out Live
    col_w = 1000
    col_h = 580
    x_left = 25
    y_cols = 290

    draw.rectangle([(x_left, y_cols), (x_left + col_w, y_cols + col_h)], fill=(24, 32, 44), outline=(16, 185, 129), width=2)
    draw.rectangle([(x_left, y_cols), (x_left + 480, y_cols + 28)], fill=(16, 185, 129))
    draw.text((x_left + 12, y_cols + 6), "FRAME 1: desktop/Category/Logged Out (LIVE US STAGING)", fill=(255, 255, 255), font=f_badge)

    desk_scaled = desk_im.resize((col_w - 20, col_h - 40), Image.Resampling.LANCZOS)
    canvas.paste(desk_scaled, (x_left + 10, y_cols + 32))

    # Right Column: Mobile MSRP Pricing Live
    mob_w = 620
    x_right = x_left + col_w + 30
    draw.rectangle([(x_right, y_cols), (x_right + mob_w, y_cols + col_h)], fill=(24, 32, 44), outline=(16, 185, 129), width=2)
    draw.rectangle([(x_right, y_cols), (x_right + 450, y_cols + 28)], fill=(37, 99, 235))
    draw.text((x_right + 12, y_cols + 6), "FRAME 2: Mobile/Category/MSRP Pricing (LIVE US STAGING)", fill=(255, 255, 255), font=f_badge)

    mob_scaled = mob_im.resize((mob_w - 20, col_h - 40), Image.Resampling.LANCZOS)
    canvas.paste(mob_scaled, (x_right + 10, y_cols + 32))

    # 4. Summary Findings Footer
    y_foot = y_cols + col_h + 16
    draw.rectangle([(25, y_foot), (total_w - 25, total_h - 20)], fill=(20, 26, 34), outline=(71, 85, 105), width=1)

    points = [
        ("🟢 PASSED FUNCTIONALITY:", (16, 185, 129)),
        ("• Utility Bar Links: 'Become a Trade Customer' & 'Book Showroom' link cleanly to active pages without login.", (240, 244, 248)),
        ("• Filter Dropdown Pills: All 19 horizontal facet pills (Brand, Style, Room, etc.) open interactive dropdown menus upon click.", (240, 244, 248)),
        ("• Facet Accordions: Clicking '+' expands category filters; selecting a filter updates catalog URL and provides 'Clear All' button.", (240, 244, 248)),
        ("• Sort Dropdown: 'Sort By: New Arrivals' opens option select menu and dynamically re-sorts catalog.", (240, 244, 248)),
        ("• Price Masking: Wholesale trade prices are 100% masked for logged-out visitors; Add to Cart buttons are suppressed.", (240, 244, 248)),
        ("• Mobile Navigation & Search: Mobile hamburger (≡) drawer opens full category tree; mobile search icon is functional.", (240, 244, 248)),
        ("• Mobile Pricing Toggle: Switches seamlessly between Trade and MSRP mode, displaying '$... MSRP' on mobile cards.", (240, 244, 248)),
        ("🔴 DEFECT IDENTIFIED (Pre-Go-Live Polish):", (239, 68, 68)),
        ("• Wishlist Heart (♡) on Cards: Both Figma frames specify a Heart icon (♡) on top-right of cards opposite to Compare. On Live Staging, it is missing for logged-out guests and shows '+Save' when logged in.", (254, 202, 202)),
        ("• Compare Option Modal: Clicking '[ ] Compare' on configurable products opens Magento's 'Please select colour option' modal before adding to compare list.", (254, 202, 202))
    ]

    curr_y = y_foot + 10
    for p, col in points:
        if p.startswith("🟢") or p.startswith("🔴"):
            draw.text((40, curr_y), p, fill=col, font=f_item_title)
            curr_y += 20
        else:
            draw.text((50, curr_y), p, fill=col, font=f_body)
            curr_y += 16

    canvas.save(out_file, quality=95)
    print("Saved master comparison:", out_file)

    # Artifact copy
    art_path = '/home/deepali/.gemini/antigravity-ide/brain/312ed68a-6b9a-4903-b00f-85f88631687a/FIGMA_FRAMES_USER_REQUESTED_EXHAUSTIVE_AUDIT.png'
    canvas.save(art_path, quality=95)
    print("Saved to artifacts:", art_path)

if __name__ == '__main__':
    create_master_comparison()
