import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
COMPARISONS_DIR = os.path.join(SCREENSHOTS_DIR, 'comparisons')
os.makedirs(COMPARISONS_DIR, exist_ok=True)

PAGES = [
    ('01_login_page', '01 - Customer Login Page'),
    ('02_create_account_page', '02 - Create An Account Page'),
    ('03_forgot_password_page', '03 - Forgot Your Password Page'),
]

MODES = ['desktop', 'mobile']

def create_comparison(page_key, title, mode):
    au_dir = os.path.join(SCREENSHOTS_DIR, mode, 'live_au')
    us_dir = os.path.join(SCREENSHOTS_DIR, mode, 'us_staging')

    au_file = os.path.join(au_dir, f"{page_key}_viewport.png")
    us_file = os.path.join(us_dir, f"{page_key}_viewport.png")

    if not (os.path.exists(au_file) and os.path.exists(us_file)):
        print(f"Skipping {page_key} {mode}: missing file")
        return

    img_au = Image.open(au_file)
    img_us = Image.open(us_file)

    # Standardize height
    target_height = min(img_au.height, img_us.height, 1200)
    w_au = int(img_au.width * (target_height / img_au.height))
    w_us = int(img_us.width * (target_height / img_us.height))

    img_au_resized = img_au.resize((w_au, target_height), Image.Resampling.LANCZOS)
    img_us_resized = img_us.resize((w_us, target_height), Image.Resampling.LANCZOS)

    header_height = 80
    border = 10
    total_width = w_au + w_us + (border * 3)
    total_height = target_height + header_height + (border * 2)

    comp = Image.new('RGB', (total_width, total_height), color=(245, 245, 245))
    draw = ImageDraw.Draw(comp)

    # Header bar
    draw.rectangle([(0, 0), (total_width, header_height)], fill=(28, 28, 28))
    
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
        font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
        font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_badge = ImageFont.load_default()

    draw.text((border + 10, 15), f"TICKET #41794537: {title.upper()} ({mode.upper()})", fill=(255, 255, 255), font=font_title)
    draw.text((border + 10, 48), "AU Live Baseline (Left) vs US Staging (Right)", fill=(180, 180, 180), font=font_sub)

    # Left: AU
    x_au = border
    y_content = header_height + border
    comp.paste(img_au_resized, (x_au, y_content))
    # Green AU Badge
    draw.rectangle([(x_au, y_content), (x_au + 260, y_content + 32)], fill=(34, 139, 34))
    draw.text((x_au + 10, y_content + 7), "APPROVED AU LIVE BASELINE", fill=(255, 255, 255), font=font_badge)

    # Right: US
    x_us = x_au + w_au + border
    comp.paste(img_us_resized, (x_us, y_content))
    # Blue/Orange US Badge
    draw.rectangle([(x_us, y_content), (x_us + 260, y_content + 32)], fill=(30, 90, 180))
    draw.text((x_us + 10, y_content + 7), "US LIVE STAGING", fill=(255, 255, 255), font=font_badge)

    out_name = f"COMP_{mode.upper()}_{page_key}.png"
    out_path = os.path.join(COMPARISONS_DIR, out_name)
    comp.save(out_path, quality=95)
    print(f"✅ Generated: {out_name}")

if __name__ == "__main__":
    for mode in MODES:
        for page_key, title in PAGES:
            create_comparison(page_key, title, mode)
