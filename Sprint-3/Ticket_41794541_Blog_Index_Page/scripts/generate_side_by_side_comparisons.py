import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = 'Sprint-3/Ticket_41794541_Blog_Index_Page'
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
COMPARISON_DIR = os.path.join(BASE_DIR, 'comparison')
os.makedirs(COMPARISON_DIR, exist_ok=True)

GREEN = (34, 197, 94)
RED = (239, 68, 68)
BORDER_WIDTH = 4

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
except:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_badge = ImageFont.load_default()

def build_side_by_side(mode, au_file, us_file, out_file, title_text):
    if not os.path.exists(au_file) or not os.path.exists(us_file):
        print(f"Skipping {out_file}: file not found ({au_file} or {us_file})")
        return

    img_au = Image.open(au_file).convert('RGB')
    img_us = Image.open(us_file).convert('RGB')
    
    target_h = 844 if mode == 'mobile' else (500 if mode == 'pagination' else 800)
    
    w_au = int(img_au.width * (target_h / img_au.height))
    w_us = int(img_us.width * (target_h / img_us.height))
    
    au_res = img_au.resize((w_au, target_h), Image.Resampling.LANCZOS)
    us_res = img_us.resize((w_us, target_h), Image.Resampling.LANCZOS)
    
    header_h = 75
    gap = 20
    pad = 16
    
    total_w = pad + w_au + gap + w_us + pad
    total_h = header_h + target_h + pad * 2
    
    canvas = Image.new('RGB', (total_w, total_h), (15, 23, 42)) # dark slate
    draw = ImageDraw.Draw(canvas)
    
    # Title
    draw.text((pad, 14), title_text.upper(), fill=(255, 255, 255), font=font_title)
    draw.text((pad, 44), "AU Live Baseline (Left) vs US Live Staging (Right)", fill=(148, 163, 184), font=font_sub)
    
    # Left: AU (Green)
    x_au = pad
    y_content = header_h + pad
    canvas.paste(au_res, (x_au, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_au - i, y_content - i, x_au + w_au + i, y_content + target_h + i], outline=GREEN)
    draw.rectangle([x_au, y_content, x_au + 270, y_content + 30], fill=(22, 101, 52))
    draw.text((x_au + 10, y_content + 7), "🟢 AU BASELINE (PAGINATION GLITCH)", fill=(240, 253, 244), font=font_badge)
    
    # Right: US (Red)
    x_us = x_au + w_au + gap
    canvas.paste(us_res, (x_us, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_us - i, y_content - i, x_us + w_us + i, y_content + target_h + i], outline=RED)
    draw.rectangle([x_us, y_content, x_us + 270, y_content + 30], fill=(153, 27, 27))
    draw.text((x_us + 10, y_content + 7), "🔴 US STAGING (TRUNCATED PAGER)", fill=(254, 242, 242), font=font_badge)
    
    canvas.save(out_file, quality=95)
    print(f"✅ Generated: {out_file}")

# 1. Desktop Viewport
build_side_by_side(
    'desktop',
    os.path.join(SCREENSHOTS_DIR, 'live_au', '02_desktop_au_viewport.png'),
    os.path.join(SCREENSHOTS_DIR, 'us_staging', '02_desktop_us_viewport.png'),
    os.path.join(COMPARISON_DIR, '01_BLOG_INDEX_DESKTOP_COMPARISON.png'),
    'Ticket #41794541: Blog Index Page (Desktop 1440x900)'
)

# 2. Mobile Viewport
build_side_by_side(
    'mobile',
    os.path.join(SCREENSHOTS_DIR, '01_mobile_au_viewport.png'),
    os.path.join(SCREENSHOTS_DIR, '03_mobile_us_viewport.png'),
    os.path.join(COMPARISON_DIR, '02_BLOG_INDEX_MOBILE_COMPARISON.png'),
    'Ticket #41794541: Blog Index Page (Mobile 390x844)'
)

# 3. Pagination Section Comparison
build_side_by_side(
    'pagination',
    os.path.join(SCREENSHOTS_DIR, 'live_au', '03_desktop_au_pagination.png'),
    os.path.join(SCREENSHOTS_DIR, 'us_staging', '03_desktop_us_pagination.png'),
    os.path.join(COMPARISON_DIR, '03_PAGINATION_ARTICLE_COUNT_COMPARISON.png'),
    'Glitch Analysis: Pagination Article Counter (AU Baseline vs US Staging)'
)
