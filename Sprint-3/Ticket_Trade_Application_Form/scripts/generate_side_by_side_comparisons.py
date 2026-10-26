import os
from PIL import Image, ImageDraw

BASE_DIR = 'Sprint-3/Ticket_Trade_Application_Form'
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
FIGMA_DIR = os.path.join(BASE_DIR, 'figma')
COMPARISON_DIR = os.path.join(BASE_DIR, 'comparison')
os.makedirs(COMPARISON_DIR, exist_ok=True)

GREEN = (16, 185, 129)  # Clean emerald green
RED = (239, 68, 68)     # Clean vibrant red

def draw_box(draw, bounds, color, width=3):
    x1, y1, x2, y2 = bounds
    for i in range(width):
        draw.rectangle([x1 - i, y1 - i, x2 + i, y2 + i], outline=color)

# =========================================================================
# 1. DESKTOP STEP 2 (Full Original Images, Clean Perfectly-Aligned Boxes)
# =========================================================================
def generate_desktop_step2():
    figma_path = os.path.join(FIGMA_DIR, 'FIGMA_EXPORT_DESKTOP_TRADE_APPLICATION.jpg')
    live_path = os.path.join(SCREENSHOTS_DIR, 'desktop', '05_US_TRADE_STEP2_FULLY_FILLED_DESKTOP.png')
    out_path = os.path.join(COMPARISON_DIR, 'COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png')

    if not os.path.exists(figma_path) or not os.path.exists(live_path):
        return

    img_figma = Image.open(figma_path).convert('RGB')
    img_live = Image.open(live_path).convert('RGB')

    # Keep original content down to before footer
    crop_live = img_live.crop((0, 0, 1440, 1320))

    target_h = 1200
    w_figma = int(img_figma.width * (target_h / img_figma.height))
    w_live = int(crop_live.width * (target_h / crop_live.height))

    figma_res = img_figma.resize((w_figma, target_h), Image.Resampling.LANCZOS)
    live_res = crop_live.resize((w_live, target_h), Image.Resampling.LANCZOS)

    # Clean side-by-side canvas with original headers intact (NO top banners covering anything)
    gap = 16
    pad = 12
    total_w = pad + w_figma + gap + w_live + pad
    total_h = pad + target_h + pad

    canvas = Image.new('RGB', (total_w, total_h), (24, 28, 36))
    draw = ImageDraw.Draw(canvas)

    # Paste Figma on Left
    x_f = pad
    y_content = pad
    canvas.paste(figma_res, (x_f, y_content))
    draw_box(draw, [x_f, y_content, x_f + w_figma, y_content + target_h], GREEN, 4)

    # Perfectly-aligned GREEN boxes on Figma elements
    # Exactly tested pixel coordinates on figma_res:
    figma_boxes = [
        (76, 220, 150, 248),      # 1. ← BACK
        (80, 498, 455, 565),      # 2. HEAD OFFICE STREET ADDRESS + Input
        (205, 605, 330, 650),     # 3. State ⌵ dropdown
        (80, 665, 455, 730),      # 4. NUMBER OF EMPLOYEES* + eg. 1 input
        (80, 892, 440, 908),      # 5. WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?
        (150, 1115, 360, 1135)    # 6. Already have an account? Sign In
    ]
    for (x1, y1, x2, y2) in figma_boxes:
        draw_box(draw, [x_f + x1, y_content + y1, x_f + x2, y_content + y2], GREEN, 3)

    # Paste Live on Right
    x_l = x_f + w_figma + gap
    canvas.paste(live_res, (x_l, y_content))
    draw_box(draw, [x_l, y_content, x_l + w_live, y_content + target_h], RED, 4)

    # Perfectly-aligned RED boxes on Live elements
    # Exactly tested pixel coordinates on live_res:
    live_boxes = [
        (105, 252, 190, 275),     # 1. ← GO BACK
        (110, 550, 485, 615),     # 2. HEAD OFFICE STREET ADDRESS* + Input
        (235, 660, 360, 705),     # 3. State dropdown
        (110, 720, 485, 790),     # 4. NUMBER OF EMPLOYEES* + Input
        (114, 968, 470, 984),     # 5. WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?*
        (165, 1162, 385, 1182)    # 6. Already have an Account? Sign in
    ]
    for (x1, y1, x2, y2) in live_boxes:
        draw_box(draw, [x_l + x1, y_content + y1, x_l + x2, y_content + y2], RED, 3)

    canvas.save(out_path, quality=95)
    print(f"✅ Generated clean: {out_path}")


# =========================================================================
# 2. MOBILE STEP 2 (Full Original Images, Clean Perfectly-Aligned Boxes)
# =========================================================================
def generate_mobile_step2():
    figma_path = os.path.join(FIGMA_DIR, 'FIGMA_EXPORT_MOBILE_TRADE_APPLICATION.jpg')
    live_path = os.path.join(SCREENSHOTS_DIR, 'mobile', '02_US_TRADE_STEP2_MOBILE.png')
    out_path = os.path.join(COMPARISON_DIR, 'COMPARISON_02_MOBILE_FIGMA_VS_LIVE_STEP2.png')

    if not os.path.exists(figma_path) or not os.path.exists(live_path):
        return

    img_figma = Image.open(figma_path).convert('RGB')
    img_live = Image.open(live_path).convert('RGB')

    crop_live = img_live.crop((0, 0, img_live.width, min(1500, img_live.height)))

    target_h = 1200
    w_figma = int(img_figma.width * (target_h / img_figma.height))
    w_live = int(crop_live.width * (target_h / crop_live.height))

    figma_res = img_figma.resize((w_figma, target_h), Image.Resampling.LANCZOS)
    live_res = crop_live.resize((w_live, target_h), Image.Resampling.LANCZOS)

    gap = 16
    pad = 12
    total_w = pad + w_figma + gap + w_live + pad
    total_h = pad + target_h + pad

    canvas = Image.new('RGB', (total_w, total_h), (24, 28, 36))
    draw = ImageDraw.Draw(canvas)

    # Left: Figma Mobile
    x_f = pad
    y_content = pad
    canvas.paste(figma_res, (x_f, y_content))
    draw_box(draw, [x_f, y_content, x_f + w_figma, y_content + target_h], GREEN, 4)

    # Figma Mobile Boxes
    scale_mf = target_h / float(img_figma.height)
    # in 750 width figma:
    # Back is around y=100 in 375 px -> y=200 in 750px -> * scale
    f_m_boxes = [
        (15, int(205 * scale_mf), 85, int(235 * scale_mf)),         # ← BACK
        (15, int(720 * scale_mf), w_figma - 15, int(830 * scale_mf)), # Street Address
        (15, int(980 * scale_mf), w_figma - 15, int(1065 * scale_mf)), # State
        (15, int(1235 * scale_mf), w_figma - 15, int(1320 * scale_mf)), # Employees
        (15, int(1570 * scale_mf), w_figma - 15, int(1615 * scale_mf)), # Spend
        (25, int(1975 * scale_mf), w_figma - 25, int(2015 * scale_mf))  # Sign In
    ]
    for b in f_m_boxes:
        draw_box(draw, [x_f + b[0], y_content + b[1], x_f + b[2], y_content + b[3]], GREEN, 3)

    # Right: Live Mobile
    x_l = x_f + w_figma + gap
    canvas.paste(live_res, (x_l, y_content))
    draw_box(draw, [x_l, y_content, x_l + w_live, y_content + target_h], RED, 4)

    # Live Mobile Boxes
    scale_ml = target_h / float(crop_live.height)
    l_m_boxes = [
        (10, int(112 * scale_ml), 65, int(135 * scale_ml)),          # ← GO BACK
        (10, int(372 * scale_ml), w_live - 10, int(432 * scale_ml)),   # Street Address*
        (10, int(505 * scale_ml), w_live - 10, int(548 * scale_ml)),   # State dropdown
        (10, int(625 * scale_ml), w_live - 10, int(675 * scale_ml)),   # Employees
        (10, int(805 * scale_ml), w_live - 10, int(830 * scale_ml)),   # Spend*
        (25, int(985 * scale_ml), w_live - 25, int(1005 * scale_ml))   # Sign In
    ]
    for b in l_m_boxes:
        draw_box(draw, [x_l + b[0], y_content + b[1], x_l + b[2], y_content + b[3]], RED, 3)

    canvas.save(out_path, quality=95)
    print(f"✅ Generated clean: {out_path}")


# =========================================================================
# 3. PHONE BLOCKER (Full Original Form, Clean Perfectly-Aligned Boxes)
# =========================================================================
def generate_phone_blocker():
    defect_phone = os.path.join(SCREENSHOTS_DIR, 'defects', '01_US_PHONE_VALIDATION_ERROR.png')
    step1_filled = os.path.join(SCREENSHOTS_DIR, 'desktop', '02_US_TRADE_STEP1_FILLED_DESKTOP.png')
    out_phone = os.path.join(COMPARISON_DIR, 'COMPARISON_03_CRITICAL_US_PHONE_VALIDATION_DEFECT.png')

    if not os.path.exists(defect_phone) or not os.path.exists(step1_filled):
        return

    img_expected = Image.open(step1_filled).convert('RGB')
    img_actual = Image.open(defect_phone).convert('RGB')

    # Both images are 1440x900 full desktop screenshots
    # Keep original full form view (top 750px)
    crop_exp = img_expected.crop((0, 0, 1440, 750))
    crop_act = img_actual.crop((0, 0, 1440, 750))

    target_h = 750
    w_exp = int(crop_exp.width * (target_h / crop_exp.height))
    w_act = int(crop_act.width * (target_h / crop_act.height))

    res_exp = crop_exp.resize((w_exp, target_h), Image.Resampling.LANCZOS)
    res_act = crop_act.resize((w_act, target_h), Image.Resampling.LANCZOS)

    gap = 16
    pad = 12
    total_w = pad + w_exp + gap + w_act + pad
    total_h = pad + target_h + pad

    canvas = Image.new('RGB', (total_w, total_h), (24, 28, 36))
    draw = ImageDraw.Draw(canvas)

    # Left: Expected (Green outer border, green box around phone input)
    x_e = pad
    y_content = pad
    canvas.paste(res_exp, (x_e, y_content))
    draw_box(draw, [x_e, y_content, x_e + w_exp, y_content + target_h], GREEN, 4)

    # Phone row in 1440x750: Mobile is x=55 to 285, Phone is x=290 to 520, y=365 to 430
    draw_box(draw, [x_e + 55, y_content + 365, x_e + 285, y_content + 430], GREEN, 3)

    # Right: Actual Defect (Red outer border, red box around rejected mobile input & error)
    x_a = x_e + w_exp + gap
    canvas.paste(res_act, (x_a, y_content))
    draw_box(draw, [x_a, y_content, x_a + w_act, y_content + target_h], RED, 4)

    # Phone input + red error message in actual screenshot: y=365 to 480
    draw_box(draw, [x_a + 55, y_content + 365, x_a + 285, y_content + 480], RED, 3)

    canvas.save(out_phone, quality=95)
    print(f"✅ Generated clean: {out_phone}")


if __name__ == '__main__':
    generate_desktop_step2()
    generate_mobile_step2()
    generate_phone_blocker()
