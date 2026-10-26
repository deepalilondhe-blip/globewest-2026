#!/usr/bin/env python3
"""
Generate visual guide explaining what the HTML <title> tag means on Desktop and Mobile.
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

def generate_explanation_card():
    W = 1400
    H = 980
    canvas = Image.new("RGB", (W, H), (245, 246, 250))
    draw = ImageDraw.Draw(canvas)

    font_title = get_font(28, bold=True)
    font_sub = get_font(15, bold=False)
    font_h2 = get_font(20, bold=True)
    font_mono = get_font(16, bold=False)
    font_mono_bold = get_font(16, bold=True)
    font_body = get_font(15, bold=False)

    # 1. Header Banner
    draw.rectangle([0, 0, W, 110], fill=(24, 28, 36))
    draw.text((40, 22), "WHAT DOES HTML <TITLE> MEAN ON DESKTOP & MOBILE?", font=font_title, fill=(255, 255, 255))
    draw.text((40, 68), "Explanation: How users see this in real life and why having it empty is a defect", font=font_sub, fill=(160, 172, 190))

    # 2. What is HTML <title>? (Simple Concept)
    CONCEPT_Y = 130
    draw_rounded_rect(draw, [40, CONCEPT_Y, W - 40, CONCEPT_Y + 140], 10, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.text((60, CONCEPT_Y + 16), "WHAT IS THE HTML <TITLE> TAG?", font=font_h2, fill=(24, 28, 36))
    draw.text((60, CONCEPT_Y + 48), "The <title> tag is the official 'NAME' of the webpage given to the browser.", font=font_body, fill=(51, 65, 85))
    
    # Comparison boxes
    draw_rounded_rect(draw, [60, CONCEPT_Y + 75, 660, CONCEPT_Y + 120], 6, fill=(236, 253, 245), outline=(16, 185, 129), width=2)
    draw.text((75, CONCEPT_Y + 86), "NORMAL PAGE: <title>Find a Stockist | GlobeWest</title>", font=font_mono_bold, fill=(6, 95, 70))

    draw_rounded_rect(draw, [700, CONCEPT_Y + 75, 1340, CONCEPT_Y + 120], 6, fill=(254, 242, 242), outline=(239, 68, 68), width=2)
    draw.text((715, CONCEPT_Y + 86), "US STAGING BUG: <title></title> (NO NAME AT ALL)", font=font_mono_bold, fill=(185, 28, 28))

    # 3. Desktop Viewpoint (Column 1)
    DESK_X0 = 40
    DESK_X1 = 680
    CARD_Y = 290
    CARD_H = 550
    draw_rounded_rect(draw, [DESK_X0, CARD_Y, DESK_X1, CARD_Y + CARD_H], 10, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.text((DESK_X0 + 20, CARD_Y + 20), "1. DESKTOP VIEWPOINT (PC / MAC)", font=font_h2, fill=(30, 64, 175))

    # Desktop Tab Illustration
    tab_y = CARD_Y + 65
    draw.text((DESK_X0 + 20, tab_y), "Where is it located? On the browser tab at the very top.", font=font_body, fill=(51, 65, 85))

    # Draw Good Tab
    draw_rounded_rect(draw, [DESK_X0 + 20, tab_y + 35, DESK_X1 - 20, tab_y + 80], 6, fill=(240, 242, 248), outline=(200, 205, 215), width=1)
    draw.text((DESK_X0 + 35, tab_y + 48), "Expected: Find a Stockist & Showroom | GlobeWest", font=get_font(14, bold=True), fill=(6, 95, 70))
    draw.text((DESK_X1 - 45, tab_y + 46), "×", font=get_font(18, bold=True), fill=(140, 145, 155))

    # Draw Buggy Empty Tab
    draw_rounded_rect(draw, [DESK_X0 + 20, tab_y + 95, DESK_X1 - 20, tab_y + 140], 6, fill=(254, 242, 242), outline=(239, 68, 68), width=2)
    draw.text((DESK_X0 + 35, tab_y + 108), "Actual: [ BLANK / EMPTY TAB NAME ]", font=get_font(14, bold=True), fill=(185, 28, 28))
    draw.text((DESK_X1 - 45, tab_y + 106), "×", font=get_font(18, bold=True), fill=(140, 145, 155))

    # Desktop Impact points
    points_y = tab_y + 165
    draw.text((DESK_X0 + 20, points_y), "Real Life Problems on Desktop:", font=get_font(16, bold=True), fill=(24, 28, 36))
    desk_points = [
        "• Multiple Tabs: If a user has 5 tabs open, this tab looks",
        "  completely blank. The user cannot tell what page it is.",
        "• Bookmarks: When saved to bookmarks, it has no name.",
        "• Browser History: Shows blank space in recent history.",
        "• Google Analytics: Crashes tracking with uncaught 422 error",
        "  because the script expects a page title."
    ]
    for i, pt in enumerate(desk_points):
        draw.text((DESK_X0 + 20, points_y + 30 + i * 26), pt, font=font_body, fill=(71, 85, 105))

    # 4. Mobile Viewpoint (Column 2)
    MOB_X0 = 720
    MOB_X1 = 1360
    draw_rounded_rect(draw, [MOB_X0, CARD_Y, MOB_X1, CARD_Y + CARD_H], 10, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.text((MOB_X0 + 20, CARD_Y + 20), "2. MOBILE VIEWPOINT (IPHONE / ANDROID)", font=font_h2, fill=(124, 58, 237))

    mob_y = CARD_Y + 65
    draw.text((MOB_X0 + 20, mob_y), "Where is it located? In mobile tab switcher & share sheets.", font=font_body, fill=(51, 65, 85))

    # Draw Mobile Safari Tab Switcher Card Representation
    card_box_y = mob_y + 35
    draw_rounded_rect(draw, [MOB_X0 + 20, card_box_y, MOB_X1 - 20, card_box_y + 100], 8, fill=(245, 246, 250), outline=(210, 215, 225), width=1)
    
    # Top bar of mobile card
    draw.rectangle([MOB_X0 + 20, card_box_y, MOB_X1 - 20, card_box_y + 35], fill=(230, 235, 245))
    draw.text((MOB_X0 + 35, card_box_y + 8), "Mobile Tab Switcher Card Header:", font=get_font(13, bold=True), fill=(51, 65, 85))

    draw.text((MOB_X0 + 35, card_box_y + 45), "Expected: 'Find a Stockist & Showroom | GlobeWest'", font=get_font(14, bold=True), fill=(6, 95, 70))
    draw.text((MOB_X0 + 35, card_box_y + 70), "Actual:   'mcstaging2.globewest.com' (No page title)", font=get_font(14, bold=True), fill=(185, 28, 28))

    # Mobile Impact points
    mob_pts_y = card_box_y + 125
    draw.text((MOB_X0 + 20, mob_pts_y), "Real Life Problems on Mobile:", font=get_font(16, bold=True), fill=(24, 28, 36))
    mob_points = [
        "• Safari Tab Switcher: When user swipes between open tabs,",
        "  the card header cannot show the page name.",
        "• Share Sheet: When sharing link via WhatsApp / Messages,",
        "  the preview card has no title and looks like a broken link.",
        "• Add to Home Screen: Defaults to raw domain URL instead",
        "  of 'GlobeWest Stockists'.",
        "• Mobile SEO: Google Search on phones displays an empty",
        "  or auto-generated headline in search results."
    ]
    for i, pt in enumerate(mob_points):
        draw.text((MOB_X0 + 20, mob_pts_y + 30 + i * 26), pt, font=font_body, fill=(71, 85, 105))

    # 5. Bottom Summary Footer
    draw.rectangle([0, H - 90, W, H], fill=(24, 28, 36))
    draw.text((40, H - 65), "SUMMARY:", font=get_font(16, bold=True), fill=(255, 255, 255))
    draw.text((40, H - 38), "The HTML <title> is the universal label of the webpage. Leaving it empty breaks tabs, bookmarks, sharing, and analytics.", font=get_font(15, bold=False), fill=(16, 185, 129))

    out_file = os.path.join(COMPARISON_DIR, "COMPARISON_13_WHAT_IS_HTML_TITLE_MEANING.png")
    canvas.save(out_file, quality=95)
    print(f"Saved: {out_file}")

if __name__ == "__main__":
    generate_explanation_card()
