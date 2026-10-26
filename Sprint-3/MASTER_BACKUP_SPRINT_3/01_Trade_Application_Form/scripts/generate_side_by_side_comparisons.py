import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = 'Sprint-3/Ticket_Trade_Application_Form'
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
FIGMA_DIR = os.path.join(BASE_DIR, 'figma')
COMPARISON_DIR = os.path.join(BASE_DIR, 'comparison')
DEFECTS_DIR = os.path.join(SCREENSHOTS_DIR, 'defects')
os.makedirs(COMPARISON_DIR, exist_ok=True)

GREEN = (0, 214, 50)
RED = (239, 68, 68)
BORDER_WIDTH = 4

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
    font_callout = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_badge = ImageFont.load_default()
    font_callout = ImageFont.load_default()

def generate_desktop_step2():
    figma_path = os.path.join(FIGMA_DIR, 'FIGMA_EXPORT_DESKTOP_TRADE_APPLICATION.jpg')
    live_path = os.path.join(SCREENSHOTS_DIR, 'desktop', '05_US_TRADE_STEP2_FULLY_FILLED_DESKTOP.png')
    out_path = os.path.join(COMPARISON_DIR, 'COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png')

    if not os.path.exists(figma_path) or not os.path.exists(live_path):
        return

    img_figma = Image.open(figma_path).convert('RGB')
    img_live = Image.open(live_path).convert('RGB')

    # Crop live to match form viewport height (stop before footer)
    # Figma is 2880 x 2632 (1440 x 1316 at 2x)
    # Live is 1440 x 2093. Crop live to top 1320px
    crop_live = img_live.crop((0, 0, 1440, 1320))

    # Resize both to target height = 1100
    target_h = 1100
    w_figma = int(img_figma.width * (target_h / img_figma.height))
    w_live = int(crop_live.width * (target_h / crop_live.height))

    figma_res = img_figma.resize((w_figma, target_h), Image.Resampling.LANCZOS)
    live_res = crop_live.resize((w_live, target_h), Image.Resampling.LANCZOS)

    header_h = 80
    gap = 24
    pad = 20

    total_w = pad + w_figma + gap + w_live + pad
    total_h = header_h + target_h + pad * 2

    canvas = Image.new('RGB', (total_w, total_h), (17, 24, 39))
    draw = ImageDraw.Draw(canvas)

    # Title
    draw.text((pad, 16), "DESKTOP TRADE APPLICATION (STEP 2 - BUSINESS DETAILS)", fill=(255, 255, 255), font=font_title)
    draw.text((pad, 46), "Strict Design Fidelity Audit: 6 UI & Content Discrepancies Flagged on Live Form", fill=(156, 163, 175), font=font_sub)

    # Left: Figma
    x_figma = pad
    y_content = header_h + pad
    canvas.paste(figma_res, (x_figma, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_figma - i, y_content - i, x_figma + w_figma + i, y_content + target_h + i], outline=GREEN)
    
    draw.rectangle([x_figma, y_content, x_figma + 340, y_content + 32], fill=(20, 83, 45))
    draw.text((x_figma + 12, y_content + 8), "🟢 APPROVED FIGMA SPEC (NODE 3226-21024)", fill=(240, 253, 244), font=font_badge)

    # Right: Live
    x_live = x_figma + w_figma + gap
    canvas.paste(live_res, (x_live, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_live - i, y_content - i, x_live + w_live + i, y_content + target_h + i], outline=RED)

    draw.rectangle([x_live, y_content, x_live + 340, y_content + 32], fill=(153, 27, 27))
    draw.text((x_live + 12, y_content + 8), "🔴 US STAGING LIVE (MCSTAGING2.GLOBEWEST.COM)", fill=(254, 242, 242), font=font_badge)

    # Callouts on live side (scaled by w_live / 1440, target_h / 1320)
    sx = w_live / 1440.0
    sy = target_h / 1320.0

    callouts = [
        # (x1, y1, x2, y2, label)
        (120, 260, 220, 290, 'DEFECT: "GO BACK" vs "BACK"'),
        (120, 565, 700, 635, 'DEFECT: Street Address marked mandatory (*)'),
        (320, 670, 510, 715, 'DEFECT: State placeholder "Please select" vs "State"'),
        (120, 750, 700, 795, 'DEFECT: Employees placeholder "Number of employees" vs "eg. 1"'),
        (120, 940, 650, 975, 'DEFECT: Average Yearly Spend has asterisk (*)'),
        (280, 1170, 540, 1205, 'DEFECT: Casing "Account? Sign in" vs "account? Sign In"')
    ]

    for (x1, y1, x2, y2, lbl) in callouts:
        cx1 = x_live + int(x1 * sx)
        cy1 = y_content + int(y1 * sy)
        cx2 = x_live + int(x2 * sx)
        cy2 = y_content + int(y2 * sy)

        for b in range(3):
            draw.rectangle([cx1 - b, cy1 - b, cx2 + b, cy2 + b], outline=RED)
        
        lw = len(lbl) * 7 + 16
        draw.rectangle([cx1, max(cy1 - 22, y_content), cx1 + lw, cy1], fill=(185, 28, 28))
        draw.text((cx1 + 4, max(cy1 - 18, y_content + 2)), lbl, fill=(255, 255, 255), font=font_callout)

    canvas.save(out_path, quality=95)
    print(f"✅ Generated: {out_path}")

def generate_mobile_step2():
    figma_path = os.path.join(FIGMA_DIR, 'FIGMA_EXPORT_MOBILE_TRADE_APPLICATION.jpg')
    live_path = os.path.join(SCREENSHOTS_DIR, 'mobile', '02_US_TRADE_STEP2_MOBILE.png')
    out_path = os.path.join(COMPARISON_DIR, 'COMPARISON_02_MOBILE_FIGMA_VS_LIVE_STEP2.png')

    if not os.path.exists(figma_path) or not os.path.exists(live_path):
        return

    img_figma = Image.open(figma_path).convert('RGB')
    img_live = Image.open(live_path).convert('RGB')

    # Figma mobile is 750 x 2854 (375 x 1427 at 2x)
    # Live mobile is 390 x 2050 (or similar). Crop live to top 1500px (before footer)
    crop_live = img_live.crop((0, 0, img_live.width, min(1500, img_live.height)))

    target_h = 1100
    w_figma = int(img_figma.width * (target_h / img_figma.height))
    w_live = int(crop_live.width * (target_h / crop_live.height))

    figma_res = img_figma.resize((w_figma, target_h), Image.Resampling.LANCZOS)
    live_res = crop_live.resize((w_live, target_h), Image.Resampling.LANCZOS)

    header_h = 80
    gap = 24
    pad = 20

    total_w = pad + w_figma + gap + w_live + pad
    total_h = header_h + target_h + pad * 2

    canvas = Image.new('RGB', (total_w, total_h), (17, 24, 39))
    draw = ImageDraw.Draw(canvas)

    draw.text((pad, 16), "MOBILE TRADE APPLICATION (STEP 2 - BUSINESS DETAILS)", fill=(255, 255, 255), font=font_title)
    draw.text((pad, 46), "Mobile Responsive Audit: Stacked Layout Parity & Copy Discrepancies", fill=(156, 163, 175), font=font_sub)

    x_figma = pad
    y_content = header_h + pad
    canvas.paste(figma_res, (x_figma, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_figma - i, y_content - i, x_figma + w_figma + i, y_content + target_h + i], outline=GREEN)
    
    draw.rectangle([x_figma, y_content, x_figma + 340, y_content + 32], fill=(20, 83, 45))
    draw.text((x_figma + 12, y_content + 8), "🟢 APPROVED FIGMA MOBILE (NODE 3226-21130)", fill=(240, 253, 244), font=font_badge)

    x_live = x_figma + w_figma + gap
    canvas.paste(live_res, (x_live, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_live - i, y_content - i, x_live + w_live + i, y_content + target_h + i], outline=RED)

    draw.rectangle([x_live, y_content, x_live + 340, y_content + 32], fill=(153, 27, 27))
    draw.text((x_live + 12, y_content + 8), "🔴 US STAGING MOBILE LIVE (390PX VIEWPORT)", fill=(254, 242, 242), font=font_badge)

    sx_m = w_live / float(crop_live.width)
    sy_m = target_h / float(crop_live.height)

    callouts_m = [
        (20, 165, 110, 195, 'DEFECT: "GO BACK" vs "BACK"'),
        (20, 545, 370, 620, 'DEFECT: Street Address marked mandatory (*)'),
        (20, 740, 370, 795, 'DEFECT: State dropdown shows "Please select" vs "State"'),
        (20, 910, 370, 965, 'DEFECT: Employees placeholder "Number of employees" vs "eg. 1"'),
        (20, 1125, 370, 1150, 'DEFECT: Spend has asterisk (*) vs Figma spec'),
        (70, 1365, 320, 1395, 'DEFECT: Casing "Account? Sign in" vs "account? Sign In"')
    ]

    for (x1, y1, x2, y2, lbl) in callouts_m:
        cx1 = x_live + int(x1 * sx_m)
        cy1 = y_content + int(y1 * sy_m)
        cx2 = x_live + int(x2 * sx_m)
        cy2 = y_content + int(y2 * sy_m)

        for b in range(3):
            draw.rectangle([cx1 - b, cy1 - b, cx2 + b, cy2 + b], outline=RED)
        
        lw = len(lbl) * 7 + 14
        draw.rectangle([cx1, max(cy1 - 20, y_content), cx1 + lw, cy1], fill=(185, 28, 28))
        draw.text((cx1 + 4, max(cy1 - 16, y_content + 2)), lbl, fill=(255, 255, 255), font=font_callout)

    canvas.save(out_path, quality=95)
    print(f"✅ Generated: {out_path}")

def generate_phone_blocker():
    defect_phone = os.path.join(DEFECTS_DIR, '01_US_PHONE_VALIDATION_ERROR.png')
    step1_filled = os.path.join(SCREENSHOTS_DIR, 'desktop', '02_US_TRADE_STEP1_FILLED_DESKTOP.png')
    out_phone = os.path.join(COMPARISON_DIR, 'COMPARISON_03_CRITICAL_US_PHONE_VALIDATION_DEFECT.png')

    if not os.path.exists(defect_phone) or not os.path.exists(step1_filled):
        return

    img_expected = Image.open(step1_filled).convert('RGB')
    img_actual = Image.open(defect_phone).convert('RGB')

    # Crop to contact details form section (top 750px)
    crop_exp = img_expected.crop((0, 0, 1440, 750))
    crop_act = img_actual.crop((0, 0, min(1440, img_actual.width), min(750, img_actual.height)))

    target_h = 700
    w_exp = int(crop_exp.width * (target_h / crop_exp.height))
    w_act = int(crop_act.width * (target_h / crop_act.height))

    res_exp = crop_exp.resize((w_exp, target_h), Image.Resampling.LANCZOS)
    res_act = crop_act.resize((w_act, target_h), Image.Resampling.LANCZOS)

    header_h = 80
    gap = 24
    pad = 20

    total_w = pad + w_exp + gap + w_act + pad
    total_h = header_h + target_h + pad * 2

    canvas = Image.new('RGB', (total_w, total_h), (17, 24, 39))
    draw = ImageDraw.Draw(canvas)

    draw.text((pad, 16), "CRITICAL US REGISTRATION BLOCKER: PHONE REGEX AU FORMAT ENFORCEMENT", fill=(255, 255, 255), font=font_title)
    draw.text((pad, 46), "Functional Blocker: Entering valid US phone (212 555 0199) triggers AU regex failure preventing account submission", fill=(156, 163, 175), font=font_sub)

    x_exp = pad
    y_content = header_h + pad
    canvas.paste(res_exp, (x_exp, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_exp - i, y_content - i, x_exp + w_exp + i, y_content + target_h + i], outline=GREEN)

    draw.rectangle([x_exp, y_content, x_exp + 380, y_content + 32], fill=(20, 83, 45))
    draw.text((x_exp + 12, y_content + 8), "🟢 EXPECTED: US PHONE FORMAT (10-DIGIT SUPPORT)", fill=(240, 253, 244), font=font_badge)

    x_act = x_exp + w_exp + gap
    canvas.paste(res_act, (x_act, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_act - i, y_content - i, x_act + w_act + i, y_content + target_h + i], outline=RED)

    draw.rectangle([x_act, y_content, x_act + 380, y_content + 32], fill=(153, 27, 27))
    draw.text((x_act + 12, y_content + 8), "🔴 ACTUAL DEFECT: REJECTED WITH AU PHONE REGEX", fill=(254, 242, 242), font=font_badge)

    canvas.save(out_phone, quality=95)
    print(f"✅ Generated: {out_phone}")

def generate_leaks():
    au_desk = os.path.join(SCREENSHOTS_DIR, 'desktop', '01_AU_BASELINE_TRADE_STEP1_DESKTOP.png')
    us_step1 = os.path.join(SCREENSHOTS_DIR, 'desktop', '01_US_TRADE_CREATE_STEP1_DESKTOP.png')
    out_leaks = os.path.join(COMPARISON_DIR, 'COMPARISON_04_STOREFRONT_LEAKAGES_NAV_FOOTER.png')

    if not os.path.exists(au_desk) or not os.path.exists(us_step1):
        return

    img_au = Image.open(au_desk).convert('RGB')
    img_us = Image.open(us_step1).convert('RGB')

    target_h = 850
    w_au = int(img_au.width * (target_h / img_au.height))
    w_us = int(img_us.width * (target_h / img_us.height))

    res_au = img_au.resize((w_au, target_h), Image.Resampling.LANCZOS)
    res_us = img_us.resize((w_us, target_h), Image.Resampling.LANCZOS)

    header_h = 80
    gap = 24
    pad = 20

    total_w = pad + w_au + gap + w_us + pad
    total_h = header_h + target_h + pad * 2

    canvas = Image.new('RGB', (total_w, total_h), (17, 24, 39))
    draw = ImageDraw.Draw(canvas)

    draw.text((pad, 16), "US STOREFRONT CATALOG & ASSET LEAKAGE AUDIT", fill=(255, 255, 255), font=font_title)
    draw.text((pad, 46), "Localization Leaks: 'AUSTRALIAN OWNED & RUN' badge and 'Shop Outlet' present on US live footer", fill=(156, 163, 175), font=font_sub)

    x_au = pad
    y_content = header_h + pad
    canvas.paste(res_au, (x_au, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_au - i, y_content - i, x_au + w_au + i, y_content + target_h + i], outline=GREEN)

    draw.rectangle([x_au, y_content, x_au + 360, y_content + 32], fill=(20, 83, 45))
    draw.text((x_au + 12, y_content + 8), "🟢 AU BASELINE STOREFRONT (GLOBEWEST.COM.AU)", fill=(240, 253, 244), font=font_badge)

    x_us = x_au + w_au + gap
    canvas.paste(res_us, (x_us, y_content))
    for i in range(BORDER_WIDTH):
        draw.rectangle([x_us - i, y_content - i, x_us + w_us + i, y_content + target_h + i], outline=RED)

    draw.rectangle([x_us, y_content, x_us + 360, y_content + 32], fill=(153, 27, 27))
    draw.text((x_us + 12, y_content + 8), "🔴 US STAGING LIVE (MCSTAGING2.GLOBEWEST.COM)", fill=(254, 242, 242), font=font_badge)

    canvas.save(out_leaks, quality=95)
    print(f"✅ Generated: {out_leaks}")

if __name__ == '__main__':
    generate_desktop_step2()
    generate_mobile_step2()
    generate_phone_blocker()
    generate_leaks()
