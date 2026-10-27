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

def process_figma_screenshots():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page'
    art_dir = '/home/deepali/.gemini/antigravity-ide/brain/312ed68a-6b9a-4903-b00f-85f88631687a'
    
    # 1. Without Login Figma
    figma_without_login_src = os.path.join(base_dir, 'screenshots/figma_comparison/FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png')
    im1 = Image.open(figma_without_login_src).convert('RGB')
    # Crop the artboard from figma UI (roughly x=248 to 1600, y=68 to 860)
    artboard_without_login = im1.crop((248, 68, 1600, 856))
    out1_path = os.path.join(art_dir, 'FIGMA_SPEC_WITHOUT_LOGIN.png')
    artboard_without_login.save(out1_path, quality=95)
    print("Saved without login artboard:", out1_path)

    # 2. With Login (Trade Pricing) Figma
    figma_with_login_src = os.path.join(base_dir, 'Client_Reply/01_Figma_Card_Layout_Compare_And_Badges.png')
    im2 = Image.open(figma_with_login_src).convert('RGB')
    # In 01_Figma_Card_Layout_Compare_And_Badges.png, the artboard is centered
    artboard_with_login = im2.crop((150, 0, im2.size[0] - 150, im2.size[1]))
    out2_path = os.path.join(art_dir, 'FIGMA_SPEC_WITH_LOGIN_TRADE.png')
    artboard_with_login.save(out2_path, quality=95)
    print("Saved with login trade artboard:", out2_path)

    # 3. Create a unified comparison graphic showing both Figma designs side-by-side
    target_w = 800
    target_h = 550

    c1 = artboard_without_login.resize((target_w, target_h), Image.Resampling.LANCZOS)
    c2 = artboard_with_login.resize((target_w, target_h), Image.Resampling.LANCZOS)

    header_h = 80
    footer_h = 100
    pad = 20
    total_w = (target_w * 2) + (pad * 3)
    total_h = header_h + target_h + footer_h + (pad * 2)

    master = Image.new('RGB', (total_w, total_h), (18, 24, 32))
    draw = ImageDraw.Draw(master)

    f_title = get_font(22, bold=True)
    f_badge = get_font(15, bold=True)
    f_body = get_font(13, bold=False)

    # Title
    draw.text((pad, 18), "APPROVED FIGMA DESIGNS: 'WITHOUT LOGIN' VS 'WITH LOGIN'", fill=(255, 255, 255), font=f_title)
    draw.text((pad, 48), "Project: Globewest USA - External  |  Page: [FINAL] Designs  |  Category Page (PLP)", fill=(148, 163, 184), font=f_body)

    # Left: Without Login
    y_badge = header_h
    draw.rectangle([(pad, y_badge), (pad + 480, y_badge + 26)], fill=(234, 88, 12))
    draw.text((pad + 10, y_badge + 5), "1. WITHOUT LOGIN: desktop/Category/Logged Out", fill=(255, 255, 255), font=f_badge)
    y_img = y_badge + 32
    master.paste(c1, (pad, y_img))
    draw.rectangle([(pad-2, y_img-2), (pad + target_w + 2, y_img + target_h + 2)], outline=(234, 88, 12), width=3)

    # Right: With Login
    x_right = pad + target_w + pad
    draw.rectangle([(x_right, y_badge), (x_right + 480, y_badge + 26)], fill=(16, 185, 129))
    draw.text((x_right + 10, y_badge + 5), "2. WITH LOGIN: desktop/Category/Trade Pricing", fill=(255, 255, 255), font=f_badge)
    master.paste(c2, (x_right, y_img))
    draw.rectangle([(x_right-2, y_img-2), (x_right + target_w + 2, y_img + target_h + 2)], outline=(16, 185, 129), width=3)

    # Footer
    y_foot = y_img + target_h + 16
    draw.rectangle([(pad, y_foot), (total_w - pad, total_h - pad)], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
    
    t1 = "• WITHOUT LOGIN KEY SPECS: Prices 100% masked (zero $ leakage); Add to Cart suppressed; 'Become a Trade Customer' link visible; Trade toggle hidden."
    t2 = "• WITH LOGIN KEY SPECS: Trade toggle visible ('Trade' / 'MSRP'); Dual pricing rendered ($1390 • MSRP: $1490); Stock indicator active; '+Save' active."
    draw.text((pad + 20, y_foot + 14), t1, fill=(240, 244, 248), font=f_body)
    draw.text((pad + 20, y_foot + 38), t2, fill=(240, 244, 248), font=f_body)

    out3_path = os.path.join(art_dir, 'FIGMA_WITH_VS_WITHOUT_LOGIN_COMPARISON.png')
    master.save(out3_path, quality=95)
    print("Saved master comparison:", out3_path)

if __name__ == '__main__':
    process_figma_screenshots()
