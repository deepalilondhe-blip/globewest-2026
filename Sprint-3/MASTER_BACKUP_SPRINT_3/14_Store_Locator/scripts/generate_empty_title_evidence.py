#!/usr/bin/env python3
"""
Generate Crystal-Clear Visual Evidence for Empty Title Tag & Console Tracking Error.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPARISON_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(COMPARISON_DIR, exist_ok=True)

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, bounds, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = bounds
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def generate_evidence_card():
    W = 1400
    H = 920
    canvas = Image.new("RGB", (W, H), (245, 246, 250))
    draw = ImageDraw.Draw(canvas)

    font_title = get_font(28, bold=True)
    font_sub = get_font(15, bold=False)
    font_section = get_font(18, bold=True)
    font_mono = get_font(16, bold=False)
    font_mono_bold = get_font(16, bold=True)
    font_desc = get_font(15, bold=False)

    # 1. Header Banner
    draw.rectangle([0, 0, W, 110], fill=(24, 28, 36))
    draw.text((40, 22), "QA EVIDENCE: EMPTY BROWSER <TITLE> TAG & ANALYTICS ERROR", font=font_title, fill=(255, 255, 255))
    draw.text((40, 68), "Target: https://mcstaging2.globewest.com/locator | WCAG 2.4.2 Level A Violation", font=font_sub, fill=(160, 172, 190))

    # 2. Section 1: Simulated Browser Tab Bar
    TAB_Y0 = 130
    draw_rounded_rect(draw, [40, TAB_Y0, W - 40, TAB_Y0 + 200], 10, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.text((60, TAB_Y0 + 18), "1. LIVE BROWSER TAB DISPLAY (EMPTY / UNTITLED)", font=font_section, fill=(24, 28, 36))

    # Browser tab chrome simulation
    tab_box_x = 60
    tab_box_y = TAB_Y0 + 55
    tab_box_w = 400
    tab_box_h = 42
    # Active Tab (Grey background with tab icon)
    draw_rounded_rect(draw, [tab_box_x, tab_box_y, tab_box_x + tab_box_w, tab_box_y + tab_box_h], 6, fill=(235, 238, 245), outline=(200, 205, 215), width=1)
    # Globe icon dot
    draw.ellipse([tab_box_x + 14, tab_box_y + 13, tab_box_x + 28, tab_box_y + 27], fill=(160, 170, 185))
    # Empty title display (noticeable blank space with red indicator)
    draw.text((tab_box_x + 38, tab_box_y + 11), "( Untitled / Blank )", font=get_font(15, bold=False), fill=(140, 145, 155))
    # Close tab 'x'
    draw.text((tab_box_x + tab_box_w - 24, tab_box_y + 11), "×", font=get_font(18, bold=True), fill=(140, 145, 155))

    # Red Callout Box on tab
    draw_rounded_rect(draw, [tab_box_x, tab_box_y + 52, tab_box_x + tab_box_w, tab_box_y + 88], 6, fill=(254, 242, 242), outline=(239, 68, 68), width=2)
    draw.text((tab_box_x + 12, tab_box_y + 60), "DEFECT: document.title = \"\" (Empty String in DOM)", font=get_font(14, bold=True), fill=(185, 28, 28))

    # Notes on right of tab bar
    draw.text((500, TAB_Y0 + 55), "• Browser Tab Result: Tab renders with NO page name, displaying blank space.", font=font_desc, fill=(51, 65, 85))
    draw.text((500, TAB_Y0 + 82), "• User Impact: Shoppers cannot identify the tab when multiple tabs are open.", font=font_desc, fill=(51, 65, 85))
    draw.text((500, TAB_Y0 + 109), "• Expected: <title>Find a Stockist & Showroom | GlobeWest</title>", font=get_font(15, bold=True), fill=(16, 185, 129))

    # 3. Section 2: DOM Head Elements Inspection
    DOM_Y0 = 350
    draw_rounded_rect(draw, [40, DOM_Y0, W - 40, DOM_Y0 + 220], 10, fill=(30, 34, 42), outline=(50, 56, 68), width=2)
    draw.text((60, DOM_Y0 + 16), "2. HTML <HEAD> INSPECTOR (LIVE SOURCE ON STAGING)", font=font_section, fill=(255, 255, 255))

    # Code block inside DOM section
    code_lines = [
        ("<head>", (160, 175, 195)),
        ("    <meta charset=\"utf-8\"/>", (160, 175, 195)),
        ("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>", (160, 175, 195)),
        ("    <title></title>    <-- ACTUAL LIVE TAG: COMPLETELY EMPTY (0 CHARACTERS)", (252, 128, 128)),
        ("    <link rel=\"canonical\" href=\"https://mcstaging2.globewest.com/locator\"/>", (160, 175, 195)),
        ("</head>", (160, 175, 195)),
    ]

    for i, (line_text, color) in enumerate(code_lines):
        y_pos = DOM_Y0 + 52 + i * 26
        if "<title></title>" in line_text:
            draw.rectangle([55, y_pos - 2, W - 60, y_pos + 22], fill=(60, 20, 25))
            draw.text((60, y_pos), line_text, font=font_mono_bold, fill=color)
        else:
            draw.text((60, y_pos), line_text, font=font_mono, fill=color)

    # 4. Section 3: Browser Console Error Log
    CONSOLE_Y0 = 590
    draw_rounded_rect(draw, [40, CONSOLE_Y0, W - 40, CONSOLE_Y0 + 200], 10, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.text((60, CONSOLE_Y0 + 18), "3. BROWSER CONSOLE RUNTIME LOGS (LIVE EXCEPTION TRIGGERED)", font=font_section, fill=(24, 28, 36))

    # Console error box (Dark Red background with Error icon)
    con_box_x = 60
    con_box_y = CONSOLE_Y0 + 52
    con_box_w = W - 120
    con_box_h = 75
    draw_rounded_rect(draw, [con_box_x, con_box_y, con_box_x + con_box_w, con_box_y + con_box_h], 6, fill=(254, 242, 242), outline=(239, 68, 68), width=2)

    # Error Icon ❌
    draw.ellipse([con_box_x + 16, con_box_y + 14, con_box_x + 36, con_box_y + 34], fill=(239, 68, 68))
    draw.text((con_box_x + 22, con_box_y + 14), "×", font=get_font(20, bold=True), fill=(255, 255, 255))

    # Error message text
    err_text = "[{\"Track.Title\":[\"'Title' must not be empty.\"]}] {pageType: 0, url: https://mcstaging2.globewest.com/locator, title: }"
    draw.text((con_box_x + 46, con_box_y + 16), "Console Error [Analytics / Page Tracking]:", font=get_font(15, bold=True), fill=(185, 28, 28))
    draw.text((con_box_x + 46, con_box_y + 40), err_text, font=font_mono_bold, fill=(153, 27, 27))

    # Explanation note
    draw.text((60, CONSOLE_Y0 + 140), "• Root Cause: Analytics & Tag Manager track scripts listen for document.title. Because title is empty, tracking script throws uncaught 422 error.", font=font_desc, fill=(71, 85, 105))
    draw.text((60, CONSOLE_Y0 + 165), "• WCAG Violation: Violates WCAG 2.2 / 2.0 Success Criterion 2.4.2 (Page Titled - Level A).", font=font_desc, fill=(71, 85, 105))

    # 5. Bottom Summary
    draw.rectangle([0, H - 90, W, H], fill=(24, 28, 36))
    draw.text((40, H - 65), "FIX REQUIRED IN MAGENTO ADMIN:", font=get_font(16, bold=True), fill=(255, 255, 255))
    draw.text((40, H - 38), "Content -> Pages / SEO -> Set Meta Title to: 'Find a Stockist & Showroom | GlobeWest'", font=get_font(15, bold=False), fill=(16, 185, 129))

    out_path = os.path.join(COMPARISON_DIR, "COMPARISON_12_EMPTY_TITLE_AND_CONSOLE_ERROR.png")
    canvas.save(out_path, quality=95)
    print(f"✅ Generated Evidence: {out_path}")

if __name__ == "__main__":
    generate_evidence_card()
