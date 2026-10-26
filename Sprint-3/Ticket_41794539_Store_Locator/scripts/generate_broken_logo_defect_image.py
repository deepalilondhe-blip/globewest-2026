import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794539_Store_Locator"
SRC_IMG = os.path.join(BASE_DIR, "screenshots/developer_fix_zipcode_label/02_SEARCH_BY_NAME_LOS_ANGELES.png")
OUT_IMG = os.path.join(BASE_DIR, "comparison/DEFECT_BROKEN_STOCKIST_LOGO.png")

def get_font(size=18, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

im = Image.open(SRC_IMG).convert("RGBA")

# Crop card and context from 02_SEARCH_BY_NAME_LOS_ANGELES.png
# Crop search input + stockist card
crop_card = im.crop((30, 480, 680, 840))

total_w = 900
header_h = 100
footer_h = 160
pad = 30
card_w, card_h = crop_card.size
total_h = header_h + card_h + footer_h + pad + 20

canvas = Image.new("RGBA", (total_w, total_h), (248, 250, 252, 255))
draw = ImageDraw.Draw(canvas)

# Header Bar (Red Defect Tag)
draw.rectangle([(0, 0), (total_w, header_h)], fill=(220, 38, 38, 255))
f_title = get_font(21, bold=True)
f_sub = get_font(13.5, bold=False)
draw.text((pad, 22), "🔴 DEFECT EVIDENCE: BROKEN STOCKIST LOGO IMAGE (404 NOT FOUND)", font=f_title, fill=(255, 255, 255, 255))
draw.text((pad, 60), "Store Locator (/locator) | Rendered Card: GlobeWest US Test Stockist – Los Angeles", font=f_sub, fill=(254, 226, 226, 255))

# Paste Card centered
x_card = (total_w - card_w) // 2
y_card = header_h + 20
canvas.paste(crop_card, (x_card, y_card))

# Draw Red Box around the broken logo on the card
# The logo box is at x=25 to x=125, y=70 to y=170 relative to crop_card
logo_x1 = x_card + 25
logo_y1 = y_card + 80
logo_x2 = x_card + 130
logo_y2 = y_card + 185
draw.rectangle([(logo_x1, logo_y1), (logo_x2, logo_y2)], outline=(220, 38, 38, 255), width=4)

# Draw arrow/badge pointing to broken logo
f_badge = get_font(12, bold=True)
draw.rectangle([(logo_x1 - 5, logo_y1 - 24), (logo_x1 + 140, logo_y1 - 2)], fill=(220, 38, 38, 255))
draw.text((logo_x1 + 4, logo_y1 - 20), "BROKEN 404 LOGO", font=f_badge, fill=(255, 255, 255, 255))

# Footer Box
y_foot = y_card + card_h + 20
draw.rectangle([(pad, y_foot), (total_w - pad, y_foot + footer_h)], fill=(254, 242, 242, 255), outline=(239, 68, 68, 255), width=2)
f_desc = get_font(13.5, bold=False)
f_bold = get_font(13.5, bold=True)

draw.text((pad + 18, y_foot + 16), "• Defect Summary:", font=f_bold, fill=(153, 27, 27, 255))
draw.text((pad + 165, y_foot + 16), "Stockist logo image fails to load and renders a broken image placeholder icon.", font=f_desc, fill=(30, 41, 59, 255))

draw.text((pad + 18, y_foot + 46), "• Broken Image URL:", font=f_bold, fill=(153, 27, 27, 255))
draw.text((pad + 180, y_foot + 46), "https://mcstaging2.globewest.com/media/globewest/stockist/1/", font=f_desc, fill=(220, 38, 38, 255))

draw.text((pad + 18, y_foot + 76), "• Expected Result:", font=f_bold, fill=(153, 27, 27, 255))
draw.text((pad + 170, y_foot + 76), "Valid brand logo image file (e.g. .png / .svg) or clean typographic fallback.", font=f_desc, fill=(30, 41, 59, 255))

draw.text((pad + 18, y_foot + 106), "• Standard Compliance:", font=f_bold, fill=(153, 27, 27, 255))
draw.text((pad + 205, y_foot + 106), "Strictly violates AGENTS.md Rule 4 (Zero Broken/Placeholder Assets).", font=f_desc, fill=(71, 85, 105, 255))

canvas.convert("RGB").save(OUT_IMG, quality=95)
print(f"✅ Generated: {OUT_IMG}")
