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

def create_figma_comparison():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page'
    out_dir = os.path.join(base_dir, 'screenshots/simple_defect_reports')
    os.makedirs(out_dir, exist_ok=True)
    
    us_img_path = os.path.join(base_dir, 'screenshots/figma_comparison/FIGMA_CHECK_1_QUICK_LINKS.png')
    au_img_path = os.path.join(base_dir, 'screenshots/sections/PLP_Storefront_Full_US.png')
    out_path = os.path.join(out_dir, 'DEFECT_FIGMA_FILTER_ALIGNMENT.png')
    
    side_w = 880
    content_h = 420
    
    if os.path.exists(us_img_path):
        us_im = Image.open(us_img_path).convert('RGB')
    else:
        us_im = Image.new('RGB', (side_w, content_h), (30, 30, 30))
        
    scaled_us_h = int(us_im.size[1] * (side_w / float(us_im.size[0])))
    us_resized = us_im.resize((side_w, scaled_us_h), Image.Resampling.LANCZOS)
    if scaled_us_h > content_h:
        us_resized = us_resized.crop((0, 0, side_w, content_h))
    elif scaled_us_h < content_h:
        new_us = Image.new('RGB', (side_w, content_h), (20, 20, 20))
        new_us.paste(us_resized, (0, (content_h - scaled_us_h) // 2))
        us_resized = new_us
        
    # Figma specification card simulation
    figma_spec = Image.new('RGB', (side_w, content_h), (255, 255, 255))
    f_draw = ImageDraw.Draw(figma_spec)
    f_spec_title = get_font(18, bold=True)
    f_spec_body = get_font(15, bold=False)
    
    f_draw.text((30, 30), "FIGMA SPECIFICATION: CATEGORY PAGE", fill=(30, 30, 30), font=f_spec_title)
    f_draw.line([(30, 60), (side_w - 30, 60)], fill=(200, 200, 200), width=2)
    
    lines = [
        "Filters (Desktop):",
        "• Left aligned filters on the page, rather than centred",
        "• Removed redundant filter title",
        "",
        "Quick Links:",
        "• Removed section under hero image that contained quick links",
        "",
        "Logged In - Trade Pricing View:",
        "• If dropdown shows 'Trade', showcase customer's trade pricing + MSRP",
        "• Remove 'Become a trade customer' link when user is logged in"
    ]
    
    y = 80
    for line in lines:
        col = (30, 30, 30) if not line.startswith("• Left") else (16, 185, 129)
        font = f_spec_title if line.endswith(":") else f_spec_body
        f_draw.text((30, y), line, fill=col, font=font)
        y += 30
        
    pad = 20
    head_h = 70
    foot_h = 60
    total_w = (side_w * 2) + (pad * 3)
    total_h = head_h + content_h + foot_h + (pad * 2)
    
    img = Image.new('RGB', (total_w, total_h), (12, 12, 12))
    draw = ImageDraw.Draw(img)
    
    f_title = get_font(20, bold=True)
    f_col = get_font(16, bold=True)
    f_exp = get_font(15, bold=False)
    
    # Header
    draw.text((pad, pad + 15), "FIGMA DESIGN AUDIT: DESKTOP FILTERS ALIGNMENT", fill=(255, 255, 255), font=f_title)
    draw.text((pad, pad + 45), "US STOREFRONT (ACTUAL IMPLEMENTATION)", fill=(255, 0, 0), font=f_col)
    draw.text((pad + side_w + pad, pad + 45), "FIGMA DESIGN REQUIREMENT (BASELINE)", fill=(0, 255, 0), font=f_col)
    
    y_img = pad + head_h
    img.paste(us_resized, (pad, y_img))
    img.paste(figma_spec, (pad + side_w + pad, y_img))
    
    draw.rectangle([(pad - 3, y_img - 3), (pad + side_w + 3, y_img + content_h + 3)], outline=(255, 0, 0), width=4)
    draw.rectangle([(pad + side_w + pad - 3, y_img - 3), (total_w - pad + 3, y_img + content_h + 3)], outline=(0, 255, 0), width=4)
    
    y_foot = y_img + content_h + 18
    draw.text((pad, y_foot), "Defect: Desktop filters toolbar is not left-aligned to margin as specified in the Figma design card.", fill=(255, 255, 255), font=f_exp)
    
    img.save(out_path, quality=95)
    
    # Sync to brain directory and GlobeWest 2026 directory
    brain_path = '/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_FIGMA_FILTER_ALIGNMENT.png'
    gw_path = os.path.join('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/PLP page/screenshots/simple_defect_reports/DEFECT_FIGMA_FILTER_ALIGNMENT.png')
    import shutil
    shutil.copy2(out_path, brain_path)
    shutil.copy2(out_path, gw_path)
    print(f"Generated Figma defect comparison image: {out_path}")

if __name__ == '__main__':
    create_figma_comparison()
