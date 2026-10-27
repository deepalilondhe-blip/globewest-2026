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

def create_iphone_audit_graphic():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page'
    out_dir = os.path.join(base_dir, 'screenshots/regression_run')
    art_dir = '/home/deepali/.gemini/antigravity-ide/brain/312ed68a-6b9a-4903-b00f-85f88631687a'

    # User uploaded spec card in .tempmediaStorage
    user_spec_path = os.path.join(art_dir, '.tempmediaStorage/media_1792044624961.png')

    # iPhone Safari live captures
    img_top_path = os.path.join(out_dir, '14_IPHONE_SAFARI_LOGGED_OUT_HERO_AND_UTILITY.png')
    img_cards_path = os.path.join(out_dir, '15_IPHONE_SAFARI_LOGGED_OUT_FILTER_AND_CARDS.png')
    img_drawer_path = os.path.join(out_dir, '16_IPHONE_SAFARI_LOGGED_OUT_MOBILE_NAV_DRAWER.png')

    spec_im = Image.open(user_spec_path).convert('RGB')
    top_im = Image.open(img_top_path).convert('RGB')
    cards_im = Image.open(img_cards_path).convert('RGB')
    drawer_im = Image.open(img_drawer_path).convert('RGB')

    # Canvas dimensions
    total_w = 1680
    total_h = 1050
    canvas = Image.new('RGB', (total_w, total_h), (15, 20, 26))
    draw = ImageDraw.Draw(canvas)

    f_title = get_font(22, bold=True)
    f_sub = get_font(14, bold=False)
    f_badge = get_font(13, bold=True)
    f_body = get_font(13, bold=False)

    # 1. Header
    draw.rectangle([(0, 0), (total_w, 80)], fill=(22, 28, 36))
    draw.text((25, 16), "IPHONE (SAFARI) LOGGED-OUT RESPONSIVE AUDIT: CATEGORY PAGE (PLP)", fill=(255, 255, 255), font=f_title)
    draw.text((25, 48), "Verified against approved Figma Design Card: [CATEGORY PAGE > Logged Out - No Pricing]", fill=(148, 163, 184), font=f_sub)

    # 2. Left Column: Approved Figma Spec Card
    col1_w = 400
    y_content = 95
    h_content = 720

    draw.rectangle([(25, y_content), (25 + col1_w, y_content + h_content)], fill=(24, 32, 44), outline=(16, 185, 129), width=2)
    draw.rectangle([(25, y_content), (25 + col1_w, y_content + 30)], fill=(16, 185, 129))
    draw.text((35, y_content + 6), "APPROVED FIGMA SPEC CARD", fill=(255, 255, 255), font=f_badge)

    spec_scaled = spec_im.resize((col1_w - 20, 480), Image.Resampling.LANCZOS)
    canvas.paste(spec_scaled, (35, y_content + 40))

    # Notes below spec
    y_notes = y_content + 535
    draw.text((35, y_notes), "Key Figma Requirements Checked:", fill=(255, 255, 255), font=f_badge)
    spec_points = [
        "1. Utility bar with Showroom booking link.",
        "2. Same functionality re: pricing as desktop.",
        "3. Stock Availability: NOT shown for logged out.",
        "4. Price toggle hidden in guest browsing."
    ]
    curr_ny = y_notes + 24
    for sp in spec_points:
        draw.text((40, curr_ny), "✔ " + sp, fill=(52, 211, 153), font=f_body)
        curr_ny += 22

    # 3. Middle Column 1: iPhone Safari Hero & Cards View
    col2_w = 380
    x_col2 = 25 + col1_w + 20
    draw.rectangle([(x_col2, y_content), (x_col2 + col2_w, y_content + h_content)], fill=(24, 32, 44), outline=(37, 99, 235), width=2)
    draw.rectangle([(x_col2, y_content), (x_col2 + col2_w, y_content + 30)], fill=(37, 99, 235))
    draw.text((x_col2 + 10, y_content + 6), "IPHONE 14: HERO & TOP UTILITY", fill=(255, 255, 255), font=f_badge)

    top_scaled = top_im.resize((col2_w - 16, h_content - 42), Image.Resampling.LANCZOS)
    canvas.paste(top_scaled, (x_col2 + 8, y_content + 36))

    # 4. Middle Column 2: iPhone Safari 2-Column Product Grid
    col3_w = 380
    x_col3 = x_col2 + col2_w + 20
    draw.rectangle([(x_col3, y_content), (x_col3 + col3_w, y_content + h_content)], fill=(24, 32, 44), outline=(37, 99, 235), width=2)
    draw.rectangle([(x_col3, y_content), (x_col3 + col3_w, y_content + 30)], fill=(37, 99, 235))
    draw.text((x_col3 + 10, y_content + 6), "IPHONE 14: 2-COL CARDS & ZERO PRICES", fill=(255, 255, 255), font=f_badge)

    cards_scaled = cards_im.resize((col3_w - 16, h_content - 42), Image.Resampling.LANCZOS)
    canvas.paste(cards_scaled, (x_col3 + 8, y_content + 36))

    # 5. Right Column: iPhone Safari Mobile Nav Drawer
    col4_w = 380
    x_col4 = x_col3 + col3_w + 20
    draw.rectangle([(x_col4, y_content), (x_col4 + col4_w, y_content + h_content)], fill=(24, 32, 44), outline=(37, 99, 235), width=2)
    draw.rectangle([(x_col4, y_content), (x_col4 + col4_w, y_content + 30)], fill=(37, 99, 235))
    draw.text((x_col4 + 10, y_content + 6), "IPHONE 14: MOBILE DRAWER (≡)", fill=(255, 255, 255), font=f_badge)

    drawer_scaled = drawer_im.resize((col4_w - 16, h_content - 42), Image.Resampling.LANCZOS)
    canvas.paste(drawer_scaled, (x_col4 + 8, y_content + 36))

    # 6. Bottom Summary Footer
    y_foot = y_content + h_content + 16
    draw.rectangle([(25, y_foot), (total_w - 25, total_h - 20)], fill=(20, 26, 34), outline=(71, 85, 105), width=1)

    sum_points = [
        "🟢 Responsive Sanity: Zero horizontal overflow on iPhone 14 (390px viewport width = 390px document width).",
        "🟢 Mobile Utility Bar: Displays 'Book Showroom' link cleanly; Pricing toggle is 100% hidden for guest sessions.",
        "🟢 Price & Cart Masking: Product prices are 100% masked on mobile cards (zero $ signs); Add to Cart is suppressed.",
        "🟢 Stock Availability (Figma Spec): Stock indicators ('In Stock', 'ETA') are correctly NOT SHOWN for logged out users.",
        "🟢 Mobile Navigation: Hamburger menu (≡) opens category drawer with 'Login or create account' trade links."
    ]
    curr_sy = y_foot + 12
    for sp in sum_points:
        draw.text((40, curr_sy), sp, fill=(240, 244, 248), font=f_body)
        curr_sy += 20

    out_file = os.path.join(out_dir, 'COMPARISON_IPHONE_SAFARI_LOGGED_OUT_AUDIT.png')
    canvas.save(out_file, quality=95)
    print("Saved graphic:", out_file)

    # Artifact copy
    art_file = os.path.join(art_dir, 'COMPARISON_IPHONE_SAFARI_LOGGED_OUT_AUDIT.png')
    canvas.save(art_file, quality=95)
    print("Saved to artifacts:", art_file)

if __name__ == '__main__':
    create_iphone_audit_graphic()
