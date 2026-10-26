import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
COMPARISON_DIR = os.path.join(BASE_DIR, 'comparison')
DEFECTS_DIR = os.path.join(SCREENSHOTS_DIR, 'defects')
os.makedirs(COMPARISON_DIR, exist_ok=True)
os.makedirs(DEFECTS_DIR, exist_ok=True)

GREEN = (34, 197, 94)   # #22C55E
RED = (239, 68, 68)     # #EF4444
DARK_BG = (15, 23, 42)  # #0F172A
WHITE = (255, 255, 255)
GRAY = (148, 163, 184)

def add_header(img, title, subtitle):
    header_height = 80
    new_img = Image.new('RGB', (img.width, img.height + header_height), color=DARK_BG)
    draw = ImageDraw.Draw(new_img)
    draw.text((24, 18), title, fill=WHITE)
    draw.text((24, 46), subtitle, fill=GRAY)
    new_img.paste(img, (0, header_height))
    return new_img

def create_side_by_side(img_left, img_right, title_left, title_right, overall_title, out_path, color_left=GREEN, color_right=RED):
    # Resize to same height if needed
    h = min(img_left.height, img_right.height, 1400)
    w_left = int(img_left.width * (h / img_left.height))
    w_right = int(img_right.width * (h / img_right.height))
    
    left_resized = img_left.resize((w_left, h), Image.Resampling.LANCZOS)
    right_resized = img_right.resize((w_right, h), Image.Resampling.LANCZOS)
    
    border_w = 4
    card_w = w_left + w_right + 32 + border_w * 4
    card_h = h + 130
    canvas = Image.new('RGB', (card_w, card_h), color=DARK_BG)
    draw = ImageDraw.Draw(canvas)
    
    # Header
    draw.text((24, 20), overall_title, fill=WHITE)
    draw.text((24, 46), "Automated QA Verification: Approved AU Baseline vs US Staging", fill=GRAY)
    
    # Left Box (AU Approved)
    x_left = 16
    y_content = 80
    draw.text((x_left + 12, y_content - 24), title_left, fill=color_left)
    draw.rectangle([x_left, y_content, x_left + w_left, y_content + h], outline=color_left, width=border_w)
    canvas.paste(left_resized, (x_left, y_content))
    
    # Right Box (US Defect)
    x_right = x_left + w_left + 24
    draw.text((x_right + 12, y_content - 24), title_right, fill=color_right)
    draw.rectangle([x_right, y_content, x_right + w_right, y_content + h], outline=color_right, width=border_w)
    canvas.paste(right_resized, (x_right, y_content))
    
    canvas.save(out_path, quality=95)
    print(f"✅ Generated: {out_path}")

# -----------------------------------------------------------------------------
# 1. Top Hero & Title Comparison (Desktop)
# -----------------------------------------------------------------------------
au_vp = os.path.join(SCREENSHOTS_DIR, 'desktop', 'live_au', '01_AU_desktop_article_viewport.png')
us_vp = os.path.join(SCREENSHOTS_DIR, 'desktop', 'us_staging', '01_US_desktop_article_viewport.png')

if os.path.exists(au_vp) and os.path.exists(us_vp):
    img_au = Image.open(au_vp)
    img_us = Image.open(us_vp)
    
    # Draw green box on AU Hero
    draw_au = ImageDraw.Draw(img_au)
    draw_au.rectangle([(0, 140), (img_au.width, 700)], outline=GREEN, width=4)
    
    # Draw red box on US missing hero and duplicated title
    draw_us = ImageDraw.Draw(img_us)
    draw_us.rectangle([(150, 200), (img_us.width - 150, 380)], outline=RED, width=4)
    
    out1 = os.path.join(COMPARISON_DIR, '01_HERO_AND_TITLE_DESKTOP_COMPARISON.png')
    create_side_by_side(
        img_au, img_us,
        "🟢 AU Live Baseline: Full-Width Hero Banner Present",
        "🔴 US Staging Actual: Missing Hero Banner & '(Duplicated)' Title",
        "Ticket #41794542: Blog Article Template — Top Hero & Header (Desktop 1440x900)",
        out1
    )

# -----------------------------------------------------------------------------
# 2. Bottom Blog Slider Comparison
# -----------------------------------------------------------------------------
au_slider = os.path.join(DEFECTS_DIR, 'AU_APPROVED_BLOG_SLIDER.png')
us_slider = os.path.join(DEFECTS_DIR, 'US_bottom_section.png')

if os.path.exists(au_slider) and os.path.exists(us_slider):
    img_au_s = Image.open(au_slider)
    img_us_s = Image.open(us_slider)
    
    # Crop the slider area from us_slider
    # In us_slider (1440x1500), the slider starts around y: 350 to 1100
    img_us_s_crop = img_us_s.crop((0, 350, img_us_s.width, 1150))
    
    draw_au_s = ImageDraw.Draw(img_au_s)
    draw_au_s.rectangle([(10, 10), (img_au_s.width - 10, img_au_s.height - 10)], outline=GREEN, width=4)
    
    draw_us_s = ImageDraw.Draw(img_us_s_crop)
    draw_us_s.rectangle([(10, 10), (img_us_s_crop.width - 10, img_us_s_crop.height - 10)], outline=RED, width=4)
    
    out2 = os.path.join(COMPARISON_DIR, '02_BOTTOM_BLOG_SLIDER_COMPARISON.png')
    create_side_by_side(
        img_au_s, img_us_s_crop,
        "🟢 AU Live: Active Blog Slider with Loaded Images",
        "🔴 US Staging Actual: Broken Slider — Images Missing / 0px Height",
        "Ticket #41794542: Bottom Blog Slider Verification ('Inspiring Trends & Directions')",
        out2
    )

# -----------------------------------------------------------------------------
# 3. Mobile Article Viewport Comparison (390x844)
# -----------------------------------------------------------------------------
au_mb = os.path.join(SCREENSHOTS_DIR, 'mobile', 'live_au', '01_AU_mobile_article_viewport.png')
us_mb = os.path.join(SCREENSHOTS_DIR, 'mobile', 'us_staging', '01_US_mobile_article_viewport.png')

if os.path.exists(au_mb) and os.path.exists(us_mb):
    img_au_m = Image.open(au_mb)
    img_us_m = Image.open(us_mb)
    
    out3 = os.path.join(COMPARISON_DIR, '03_BLOG_ARTICLE_MOBILE_COMPARISON.png')
    create_side_by_side(
        img_au_m, img_us_m,
        "🟢 AU Live Baseline: Mobile Hero & Header",
        "🔴 US Staging Actual: Mobile Article Header",
        "Ticket #41794542: Blog Article Template — Mobile Viewport (iPhone 390x844)",
        out3
    )
