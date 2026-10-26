import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = 'Sprint-3/Ticket_41794539_Store_Locator'
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
COMPARISON_DIR = os.path.join(BASE_DIR, 'comparison')
os.makedirs(COMPARISON_DIR, exist_ok=True)

GREEN = (16, 185, 129)       # Approved / Expected / Baseline
RED = (239, 68, 68)          # Defect / Live US Staging
BG_COLOR = (15, 23, 42)      # Dark slate canvas background
TEXT_WHITE = (248, 250, 252)
TEXT_MUTED = (148, 163, 184)

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_desc = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_detail = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_badge = ImageFont.load_default()
    font_desc = ImageFont.load_default()
    font_detail = ImageFont.load_default()

def draw_header(draw, x, y, title, subtitle):
    draw.text((x, y), title, font=font_title, fill=TEXT_WHITE)
    draw.text((x, y + 30), subtitle, font=font_sub, fill=TEXT_MUTED)

def draw_badge(draw, x, y, text, color):
    pad_h = 12
    pad_v = 6
    bbox = font_badge.getbbox(text)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    box = [x, y, x + text_w + pad_h * 2, y + text_h + pad_v * 2]
    draw.rounded_rectangle(box, radius=6, fill=color)
    draw.text((x + pad_h, y + pad_v), text, font=font_badge, fill=(255, 255, 255))
    return box[2]

def draw_wrapped_text(draw, x, y, text, max_chars, font, color, line_gap=16):
    lines = textwrap.wrap(text, width=max_chars)
    curr_y = y
    for line in lines:
        draw.text((x, curr_y), line, font=font, fill=color)
        curr_y += line_gap
    return curr_y

def create_side_by_side(us_crop, au_crop, title, subtitle, us_badge_text, au_badge_text, us_notes, au_notes, out_filename, target_h=550):
    scale_us = target_h / us_crop.height
    w_us = int(us_crop.width * scale_us)
    scaled_us = us_crop.resize((w_us, target_h), Image.Resampling.LANCZOS)

    scale_au = target_h / au_crop.height
    w_au = int(au_crop.width * scale_au)
    scaled_au = au_crop.resize((w_au, target_h), Image.Resampling.LANCZOS)

    header_h = 80
    footer_h = 90
    pad = 24
    gap = 24
    border_w = 4

    total_w = pad + w_us + gap + w_au + pad
    total_h = header_h + target_h + footer_h + pad * 2

    canvas = Image.new('RGB', (total_w, total_h), BG_COLOR)
    draw = ImageDraw.Draw(canvas)

    # Top Header
    draw_header(draw, pad, pad, title, subtitle)

    # US Image Placement (Left)
    us_x = pad
    us_y = pad + header_h
    canvas.paste(scaled_us, (us_x, us_y))
    # Red border
    draw.rectangle([us_x - border_w, us_y - border_w, us_x + w_us + border_w, us_y + target_h + border_w], outline=RED, width=border_w)
    draw_badge(draw, us_x + 10, us_y + 10, us_badge_text, RED)

    # AU Image Placement (Right)
    au_x = pad + w_us + gap
    au_y = pad + header_h
    canvas.paste(scaled_au, (au_x, au_y))
    # Green border
    draw.rectangle([au_x - border_w, au_y - border_w, au_x + w_au + border_w, au_y + target_h + border_w], outline=GREEN, width=border_w)
    draw_badge(draw, au_x + 10, au_y + 10, au_badge_text, GREEN)

    # Bottom notes
    notes_y = us_y + target_h + 16
    draw.text((us_x, notes_y), "ACTUAL DEFECT (US STAGING):", font=font_desc, fill=RED)
    chars_us = max(30, int(w_us / 7.5))
    draw_wrapped_text(draw, us_x, notes_y + 20, us_notes, chars_us, font_detail, (248, 113, 113))

    draw.text((au_x, notes_y), "APPROVED EXPECTED SPEC (AU BASELINE / FIGMA):", font=font_desc, fill=GREEN)
    chars_au = max(30, int(w_au / 7.5))
    draw_wrapped_text(draw, au_x, notes_y + 20, au_notes, chars_au, font_detail, (52, 211, 153))

    out_path = os.path.join(COMPARISON_DIR, out_filename)
    canvas.save(out_path, quality=95)
    print(f"Generated comparison: {out_path}")

def run():
    print("🎨 Regenerating Cleanly-Wrapped Side-by-Side RED/GREEN Comparisons...")

    us_full = Image.open(os.path.join(SCREENSHOTS_DIR, 'desktop', '01_US_Desktop_Full_Page.png')).convert('RGB')
    au_full = Image.open(os.path.join(SCREENSHOTS_DIR, 'desktop', '03_AU_Baseline_Full_Page.png')).convert('RGB')

    # 1. Interactive Google Maps Canvas Defect
    us_map = us_full.crop((880, 166, 1640, 1000))
    au_map = au_full.crop((880, 181, 1640, 1015))
    create_side_by_side(
        us_map, au_map,
        "Pass 01: Interactive Google Maps Canvas & API Domain Restriction Defect",
        "Target: https://mcstaging2.globewest.com/locator vs AU Baseline",
        "US STAGING LIVE: BROKEN MAP API (RefererNotAllowedMapError)",
        "AU BASELINE LIVE: FULLY WORKING INTERACTIVE GOOGLE MAP",
        "Google Maps fails with RefererNotAllowedMapError. US domain mcstaging2.globewest.com is unauthorized in Google Cloud Console.",
        "Interactive Google Maps renders Australia pins, custom cluster markers, pan, and zoom controls.",
        "COMPARISON_01_GOOGLE_MAPS_CANVAS.png",
        target_h=600
    )

    # 2. Postcode Placeholder Defect
    us_search = us_full.crop((280, 166, 770, 800))
    au_search = au_full.crop((280, 181, 770, 815))
    create_side_by_side(
        us_search, au_search,
        "Pass 02: Stockist Search & Australian Postcode (Eg.3000) Leak",
        "Verification of search inputs, placeholders, and current location trigger",
        "US STAGING LIVE: HARDCODED AU POSTCODE (Eg.3000) LEAK",
        "APPROVED BASELINE SPEC: US 5-DIGIT ZIP CODE (e.g. 90210)",
        "Input placeholder is hardcoded to Melbourne AU postcode 'Eg.3000' on the US storefront.",
        "Input must support and guide US ZIP codes (5 digits, e.g. 90210, 78701) with localized placeholder.",
        "COMPARISON_02_POSTCODE_PLACEHOLDER.png",
        target_h=600
    )

    # 3. Intro Copy Leak & H1 Title
    us_intro = us_full.crop((280, 166, 770, 360))
    au_intro = au_full.crop((280, 181, 770, 375))
    create_side_by_side(
        us_intro, au_intro,
        "Pass 03: Primary Heading & Australia Regional Copy Leak",
        "Verification of intro description and regional market messaging",
        "US STAGING LIVE: HARDCODED AUSTRALIA COPY LEAK",
        "APPROVED US LOCALIZED SPEC: US STOCKISTS & SHOWROOMS",
        "Intro text leaks: 'stocked at some of Australia\'s finest furniture and home decor retailers'.",
        "Intro text must reflect US stockists and upcoming US showroom locations (LA & Austin).",
        "COMPARISON_03_AU_COPY_LEAK.png",
        target_h=400
    )

    # 4. Editorial Heading Title Bug ("How to Buy with a Stockist - us")
    us_editorial = us_full.crop((280, 1105, 1640, 1840))
    au_editorial = au_full.crop((280, 1120, 1640, 1855))
    create_side_by_side(
        us_editorial, au_editorial,
        "Pass 04: Editorial Section CMS Heading & Title Wrap Defect",
        "CMS block title inspection: /locator lower editorial banner",
        "US STAGING LIVE: LEAKED CMS BLOCK IDENTIFIER ('- us')",
        "AU BASELINE LIVE: CLEAN EDITORIAL HEADING",
        "Heading renders 'How to Buy with a Stockist - us' with awkward line wrap, leaking Magento CMS store code.",
        "Heading renders cleanly as 'How to Buy with a Stockist' with balanced typographic styling.",
        "COMPARISON_04_EDITORIAL_HEADING_WRAP.png",
        target_h=550
    )

    # 5. Editorial Body Copy & AU Spelling Leak
    us_body = us_full.crop((950, 1200, 1640, 1750))
    au_body = au_full.crop((950, 1215, 1640, 1765))
    create_side_by_side(
        us_body, au_body,
        "Pass 05: Editorial Body Text Localization & AU Spelling Leak",
        "Copy inspection for American English compliance",
        "US STAGING LIVE: AU SPELLING ('finalise') & COPY LEAK",
        "APPROVED US SPEC: AMERICAN ENGLISH ('finalize')",
        "Body copy contains Australian spelling 'finalise your order' and repeats 'Australia\'s finest'.",
        "Body copy must use American English ('finalize') and reference US Trade Showrooms.",
        "COMPARISON_05_EDITORIAL_BODY_SPELLING.png",
        target_h=450
    )

    # 6. Footer Kangaroo Badge Defect
    us_footer = us_full.crop((280, 2050, 580, 2250))
    au_footer = au_full.crop((280, 2065, 580, 2265))
    create_side_by_side(
        us_footer, au_footer,
        "Pass 06: Storefront Footer Australian Kangaroo Badge Leak",
        "Footer brand trust badge inspection on US storefront",
        "US STAGING LIVE: 'AUSTRALIAN OWNED & RUN' BADGE",
        "US FOOTER SPEC: GLOBAL / US LOCALIZED FOOTER",
        "US footer contains Australian Kangaroo badge 'AUSTRALIAN OWNED & RUN', confusing US trade clients.",
        "US storefront footer must suppress Australian domestic badge per Figma US global footer specification.",
        "COMPARISON_06_FOOTER_KANGAROO_BADGE.png",
        target_h=350
    )

    # 7. Mobile Responsive Stacking
    us_mobile = Image.open(os.path.join(SCREENSHOTS_DIR, 'mobile', '01_US_Mobile_Full_Page.png')).convert('RGB')
    au_mobile = Image.open(os.path.join(SCREENSHOTS_DIR, 'mobile', '03_AU_Mobile_Full_Page.png')).convert('RGB')
    us_mob_crop = us_mobile.crop((0, 0, 390, 1150))
    au_mob_crop = au_mobile.crop((0, 0, 390, 1150))
    create_side_by_side(
        us_mob_crop, au_mob_crop,
        "Pass 07: Mobile Responsive Viewport (390x844 iPhone 14)",
        "Mobile layout stacking, search forms, and map canvas responsiveness",
        "US MOBILE LIVE: BROKEN MAP & UNLOCALIZED COPY",
        "AU MOBILE BASELINE: WORKING RESPONSIVE LOCATOR",
        "Mobile map canvas renders Google Maps error; search controls feature AU postcode; editorial card stacked with title bug.",
        "Mobile layout stacks search inputs above interactive touch map with fully working geolocator.",
        "COMPARISON_07_MOBILE_RESPONSIVE_OVERVIEW.png",
        target_h=750
    )

    print("✅ All 7 clean-wrapped comparison artifacts regenerated successfully!")

if __name__ == '__main__':
    run()
