import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFECT_DIR = os.path.join(BASE_DIR, 'DEFECT_SCREENSHOTS')
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots', 'desktop')

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def create_annotated_card(defect_num, title, expected_text, actual_text, defect_img_name, au_img_name=None):
    defect_img_path = os.path.join(DEFECT_DIR, defect_img_name)
    if not os.path.exists(defect_img_path):
        print(f"File missing: {defect_img_path}")
        return

    us_img = Image.open(defect_img_path)
    
    # If au_img_name provided, make side-by-side
    au_img = None
    if au_img_name:
        au_path = os.path.join(SCREENSHOTS_DIR, au_img_name)
        if os.path.exists(au_path):
            au_img = Image.open(au_path)
            # Match heights
            target_h = min(us_img.size[1], au_img.size[1], 800)
            us_img = us_img.crop((0, 0, us_img.size[0], target_h))
            au_img = au_img.crop((0, 0, au_img.size[0], target_h))
            # Scale down if too wide
            scale = 700 / max(us_img.size[0], au_img.size[0])
            us_img = us_img.resize((int(us_img.size[0] * scale), int(target_h * scale)), Image.Resampling.LANCZOS)
            au_img = au_img.resize((int(au_img.size[0] * scale), int(target_h * scale)), Image.Resampling.LANCZOS)

    header_h = 130
    w = us_img.size[0] + (au_img.size[0] + 30 if au_img else 40)
    h = us_img.size[1] + header_h + 40

    card = Image.new('RGB', (w, h), (250, 250, 252))
    draw = ImageDraw.Draw(card)

    # Top Banner
    draw.rectangle([0, 0, w, 65], fill=(26, 26, 26))
    title_font = get_font(20, bold=True)
    draw.text((20, 18), f"DEFECT #{defect_num}: {title}", fill=(255, 255, 255), font=title_font)

    # Sub banner - Expected vs Actual
    desc_font = get_font(13, bold=False)
    bold_desc_font = get_font(13, bold=True)
    draw.rectangle([0, 65, w, header_h], fill=(240, 242, 245))
    
    draw.text((20, 75), "EXPECTED (AU / Spec): ", fill=(20, 110, 40), font=bold_desc_font)
    draw.text((200, 75), expected_text, fill=(30, 30, 30), font=desc_font)
    
    draw.text((20, 100), "ACTUAL (US Staging): ", fill=(190, 20, 20), font=bold_desc_font)
    draw.text((200, 100), actual_text, fill=(30, 30, 30), font=desc_font)

    y_body = header_h + 20
    if au_img:
        # AU on left
        x_au = 15
        draw.rectangle([x_au, y_body - 24, x_au + au_img.size[0], y_body - 4], fill=(225, 245, 225))
        draw.text((x_au + 10, y_body - 22), "🟢 EXPECTED / AU BASELINE", fill=(20, 110, 40), font=bold_desc_font)
        card.paste(au_img, (x_au, y_body))
        draw.rectangle([x_au, y_body, x_au + au_img.size[0], y_body + au_img.size[1]], outline=(40, 160, 60), width=3)

        # US on right
        x_us = x_au + au_img.size[0] + 15
        draw.rectangle([x_us, y_body - 24, x_us + us_img.size[0], y_body - 4], fill=(255, 230, 230))
        draw.text((x_us + 10, y_body - 22), "🔴 ACTUAL DEFECT / US LIVE", fill=(190, 20, 20), font=bold_desc_font)
        card.paste(us_img, (x_us, y_body))
        draw.rectangle([x_us, y_body, x_us + us_img.size[0], y_body + us_img.size[1]], outline=(220, 30, 30), width=3)
    else:
        # Just US with red border
        x_us = 20
        draw.rectangle([x_us, y_body - 24, x_us + us_img.size[0], y_body - 4], fill=(255, 230, 230))
        draw.text((x_us + 10, y_body - 22), "🔴 ACTUAL DEFECT / US LIVE", fill=(190, 20, 20), font=bold_desc_font)
        card.paste(us_img, (x_us, y_body))
        draw.rectangle([x_us, y_body, x_us + us_img.size[0], y_body + us_img.size[1]], outline=(220, 30, 30), width=3)

    out_name = f"ANNOTATED_DEFECT_{defect_num}.png"
    out_path = os.path.join(DEFECT_DIR, out_name)
    card.save(out_path, quality=92)
    print(f"Created annotated defect image: {out_name}")

def main():
    print("=== ANNOTATING DEFECT SCREENSHOTS ===")
    
    create_annotated_card(
        1,
        "Help Centre Missing <title> Tag & Broken Hero Banner",
        "Document title '<title>Help centre</title>' and valid loaded hero banner image.",
        "Document title is EMPTY ('') violating WCAG 2.4.2 & banner image returns 404.",
        "DEFECT_1_US_Help_Centre_Empty_Title_and_Banner.png",
        "AU_faq_desktop_viewport.png"
    )

    create_annotated_card(
        2,
        "US Contact Us Page Leaking Australian Showrooms & .com.au Emails",
        "US Showroom locations / US contact details.",
        "Melbourne, Sydney, Brisbane, Perth showrooms & melbourne@globewest.com.au emails listed.",
        "DEFECT_2_US_Contact_Us_AU_Showrooms_Leakage.png",
        "AU_contact_desktop_viewport.png"
    )

    create_annotated_card(
        3,
        "Terms & Conditions AU Corporate Entity & Jurisdiction Leakage",
        "Governed by US laws and US corporate entity details.",
        "References 'Victoria, Australia ACN 674 872 621', 'claims@globewest.com.au', and AU PPSA Act.",
        "DEFECT_3_US_Terms_AU_Company_Entity_ACN_Leakage.png",
        None
    )

    create_annotated_card(
        4,
        "404 Page Document Title Contains Staging Identifier '[US]'",
        "Clean browser tab title: '404 Not Found'.",
        "Title is '[US] 404 Not Found' leaking internal multi-store staging tag.",
        "DEFECT_4_US_404_Page_Staging_Title_Prefix.png",
        "AU_404_desktop_viewport.png"
    )

    print("All defect annotations completed!")

if __name__ == '__main__':
    main()
