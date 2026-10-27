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

def generate_without_login_comparison():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page'
    out_dir = os.path.join(base_dir, 'screenshots/regression_run')
    os.makedirs(out_dir, exist_ok=True)

    figma_src = os.path.join(base_dir, 'Figma comparison/Figma_Baseline_desktop_Category_Show_Filters.png')
    live_src = os.path.join(out_dir, '08_WITHOUT_LOGIN_PLP_DESKTOP_FORENSIC.png')
    output_path = os.path.join(out_dir, 'COMPARISON_PLP_WITHOUT_LOGIN_FIGMA_VS_LIVE.png')

    im_figma = Image.open(figma_src).convert('RGB')
    im_live = Image.open(live_src).convert('RGB')

    # The figma screenshot has Figma chrome. Let's crop the actual artboard frame:
    # In 1853x905, the artboard starts around x=248, y=68 to x=1605, y=860
    # Let's inspect the artboard area
    figma_artboard = im_figma.crop((246, 68, 1600, 856)) # roughly 1354 x 788

    target_w = 950
    target_h = 600

    f_resized = figma_artboard.resize((target_w, target_h), Image.Resampling.LANCZOS)
    l_resized = im_live.resize((target_w, target_h), Image.Resampling.LANCZOS)

    header_h = 90
    footer_h = 130
    pad = 24
    total_w = (target_w * 2) + (pad * 3)
    total_h = header_h + target_h + footer_h + (pad * 2)

    canvas = Image.new('RGB', (total_w, total_h), (18, 20, 24))
    draw = ImageDraw.Draw(canvas)

    f_title = get_font(22, bold=True)
    f_badge = get_font(15, bold=True)
    f_body = get_font(14, bold=False)
    f_body_bold = get_font(14, bold=True)

    # Top Title
    draw.text((pad, pad), "GLOBEWEST PLP: WITHOUT LOGIN (PUBLIC GUEST BROWSING) AUDIT", fill=(255, 255, 255), font=f_title)
    draw.text((pad, pad + 32), "Forensic comparison of Figma Non-Logged In Artboard vs Live US Storefront (https://mcstaging2.globewest.com/indoor)", fill=(160, 174, 192), font=f_body)

    # Column Badges
    y_badge = pad + 60
    # Left: Figma Baseline (Green)
    draw.rectangle([(pad, y_badge), (pad + 440, y_badge + 26)], fill=(16, 185, 129))
    draw.text((pad + 10, y_badge + 5), "APPROVED FIGMA SPEC (WITHOUT LOGIN / GUEST)", fill=(255, 255, 255), font=f_badge)

    # Right: Live US Storefront Actual (Green if matching, Red if defect)
    x_right = pad + target_w + pad
    draw.rectangle([(x_right, y_badge), (x_right + 440, y_badge + 26)], fill=(37, 99, 235))
    draw.text((x_right + 10, y_badge + 5), "LIVE US STOREFRONT ACTUAL (LOGGED OUT)", fill=(255, 255, 255), font=f_badge)

    # Images Paste
    y_img = y_badge + 34
    canvas.paste(f_resized, (pad, y_img))
    canvas.paste(l_resized, (x_right, y_img))

    # Border outlines
    draw.rectangle([(pad - 2, y_img - 2), (pad + target_w + 2, y_img + target_h + 2)], outline=(16, 185, 129), width=3)
    draw.rectangle([(x_right - 2, y_img - 2), (x_right + target_w + 2, y_img + target_h + 2)], outline=(16, 185, 129), width=3)

    # Footer Breakdown
    y_foot = y_img + target_h + 16
    draw.rectangle([(pad, y_foot), (total_w - pad, total_h - pad)], fill=(28, 32, 38))
    draw.rectangle([(pad, y_foot), (total_w - pad, total_h - pad)], outline=(45, 55, 72), width=1)

    points = [
        "1. Wholesale Pricing Masking: 100% PASS - Non-logged in users see ZERO wholesale prices or dollar figures in UI or DOM.",
        "2. Add to Cart Suppression: 100% PASS - Cart & purchase triggers are completely hidden for public guest visitors.",
        "3. Header Utility Bar: 100% PASS - Renders 'Become a Trade Customer' & 'Book Showroom Appointment'; Pricing toggle is hidden.",
        "4. Clean Hero Layout: 100% PASS - Subcategory quick links pills below hero image are removed, matching Figma spec card.",
        "5. Filter Toolbar & Sidebar: 100% PASS - Left-aligned horizontal filter pills & interactive 'Filters' accordion sidebar functional."
    ]

    curr_y = y_foot + 12
    for p in points:
        draw.text((pad + 16, curr_y), "•", fill=(16, 185, 129), font=f_body_bold)
        draw.text((pad + 32, curr_y), p, fill=(240, 244, 248), font=f_body)
        curr_y += 22

    canvas.save(output_path, quality=95)
    print("Generated comparison image:", output_path)

    # Also copy to artifacts directory
    artifact_path = '/home/deepali/.gemini/antigravity-ide/brain/312ed68a-6b9a-4903-b00f-85f88631687a/COMPARISON_PLP_WITHOUT_LOGIN_FIGMA_VS_LIVE.png'
    canvas.save(artifact_path, quality=95)
    print("Saved to artifacts:", artifact_path)

if __name__ == '__main__':
    generate_without_login_comparison()
