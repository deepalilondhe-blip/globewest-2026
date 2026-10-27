import os
from PIL import Image, ImageDraw, ImageFont

desktop_img = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/deep_defects_investigation/desktop_full_page.png'
out_path = '/home/deepali/.gemini/antigravity-ide/brain/4c974b75-f11f-4e19-a08a-3c9db3753ff7/COLOR_HEADING_DEFECT_EXPLAINED.png'

im = Image.open(desktop_img)

# 1. Swatch section crop: x=985..1420, y=500..720 (435 x 220)
crop_swatch = im.crop((985, 500, 1420, 720))

# 2. Specifications tab crop: x=915..1350, y=1650..1870 (435 x 220)
crop_specs = im.crop((915, 1650, 1350, 1870))

card_w = 435
card_h = 220

header_h = 85
annot_h = 165
footer_h = 60
canvas_w = card_w * 2 + 50
canvas_h = header_h + card_h + annot_h + footer_h + 35

canvas = Image.new('RGB', (canvas_w, canvas_h), '#FFFFFF')
draw = ImageDraw.Draw(canvas)

try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    font_header = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12)
    font_text = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
    font_bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12)
except:
    font_title = font_sub = font_header = font_badge = font_text = font_bold = ImageFont.load_default()

# 1. Top Header Banner
draw.rectangle([0, 0, canvas_w, header_h - 10], fill='#0F172A')
draw.text((25, 16), "Color Heading Defect: Australian 'COLOUR' vs US 'COLOR'", fill='#FFFFFF', font=font_title)
draw.text((25, 46), "Live US Storefront (mcstaging2.globewest.com) | PDP: Leon Side Table - Powder Blue", fill='#94A3B8', font=font_sub)

y_cards = header_h + 10

# -------------------------------------------------------------
# CARD 1: SWATCH ATTRIBUTE HEADING (FAIL - THE DEFECT)
# -------------------------------------------------------------
x1 = 20
draw.rectangle([x1, y_cards, x1 + card_w, y_cards + 35], fill='#DC2626')
draw.text((x1 + 15, y_cards + 9), "[FAIL] 1. SWATCH SECTION: AU SPELLING 'COLOUR'", fill='#FFFFFF', font=font_header)

canvas.paste(crop_swatch, (x1, y_cards + 35))
draw.rectangle([x1, y_cards + 35, x1 + card_w, y_cards + 35 + card_h], outline='#DC2626', width=3)

# Highlight 'COLOUR:' specifically in Card 1 (clean red box, no strike lines)
bx1 = x1 + 13
by1 = y_cards + 35 + 20
bx2 = x1 + 80
by2 = y_cards + 35 + 41
draw.rectangle([bx1, by1, bx2, by2], outline='#DC2626', width=3)

# Clean pill badge pinned in upper right corner of the card
pill_x1 = x1 + card_w - 195
pill_y1 = y_cards + 35 + 15
pill_x2 = pill_x1 + 180
pill_y2 = pill_y1 + 26
draw.rectangle([pill_x1, pill_y1, pill_x2, pill_y2], fill='#DC2626')
draw.text((pill_x1 + 10, pill_y1 + 6), "AUSTRALIAN 'OU' LEAK", fill='#FFFFFF', font=font_badge)

# Annotations under Card 1
y_annot = y_cards + 35 + card_h + 10
draw.rectangle([x1, y_annot, x1 + card_w, y_annot + annot_h], fill='#FEF2F2', outline='#DC2626', width=2)
draw.text((x1 + 15, y_annot + 15), "• Rendered Heading: 'COLOUR: Powder Blue'", fill='#B91C1C', font=font_bold)
draw.text((x1 + 15, y_annot + 42), "• Uses Australian / British English spelling with 'U'", fill='#B91C1C', font=font_text)
draw.text((x1 + 15, y_annot + 69), "• Violates US Storefront Localization requirements", fill='#B91C1C', font=font_text)
draw.text((x1 + 15, y_annot + 96), "• Expected for US Storefront: 'COLOR: Powder Blue'", fill='#15803D', font=font_bold)
draw.text((x1 + 15, y_annot + 123), "• Location: Above interactive swatches in right column", fill='#64748B', font=font_text)


# -------------------------------------------------------------
# CARD 2: SPECIFICATIONS SECTION ON SAME PAGE (PROOF OF INCONSISTENCY)
# -------------------------------------------------------------
x2 = x1 + card_w + 10
draw.rectangle([x2, y_cards, x2 + card_w, y_cards + 35], fill='#16A34A')
draw.text((x2 + 15, y_cards + 9), "[PASS] 2. SPECIFICATIONS SECTION: US SPELLING 'Color'", fill='#FFFFFF', font=font_header)

canvas.paste(crop_specs, (x2, y_cards + 35))
draw.rectangle([x2, y_cards + 35, x2 + card_w, y_cards + 35 + card_h], outline='#16A34A', width=3)

# Highlight 'Color:' specifically in Card 2 (clean green box, no strike lines)
gx1 = x2 + 13
gy1 = y_cards + 35 + 98
gx2 = x2 + 54
gy2 = y_cards + 35 + 119
draw.rectangle([gx1, gy1, gx2, gy2], outline='#16A34A', width=3)

# Clean pill badge pinned in upper right corner of the card
gpill_x1 = x2 + card_w - 180
gpill_y1 = y_cards + 35 + 15
gpill_x2 = gpill_x1 + 165
gpill_y2 = gpill_y1 + 26
draw.rectangle([gpill_x1, gpill_y1, gpill_x2, gpill_y2], fill='#16A34A')
draw.text((gpill_x1 + 12, gpill_y1 + 6), "US 'OR' SPELLING", fill='#FFFFFF', font=font_badge)

# Annotations under Card 2
draw.rectangle([x2, y_annot, x2 + card_w, y_annot + annot_h], fill='#F0FDF4', outline='#16A34A', width=2)
draw.text((x2 + 15, y_annot + 15), "• Rendered Attribute: 'Color: Powder Blue'", fill='#15803D', font=font_bold)
draw.text((x2 + 15, y_annot + 42), "• Correctly uses US English spelling without 'U'", fill='#15803D', font=font_text)
draw.text((x2 + 15, y_annot + 69), "• PROOF OF INTERNAL PAGE INCONSISTENCY:", fill='#0F172A', font=font_bold)
draw.text((x2 + 15, y_annot + 96), "   Swatches say 'COLOUR', but Specs say 'Color'!", fill='#0F172A', font=font_bold)
draw.text((x2 + 15, y_annot + 123), "• Location: Under Specifications tab on the same PDP", fill='#64748B', font=font_text)


# Bottom Conclusion Banner
draw.rectangle([0, canvas_h - footer_h, canvas_w, canvas_h], fill='#F1F5F9')
draw.text((25, canvas_h - 40), "ROOT CAUSE & REMEDIATION: In Magento Admin (Stores > Attributes > Product > color),", fill='#0F172A', font=font_bold)
draw.text((25, canvas_h - 20), "update Store View Title for USA Website to 'Color'. Ensure template/en_US.csv translates 'Colour' -> 'Color'.", fill='#475569', font=font_text)

canvas.save(out_path)
print(f"Generated clean pixel-perfect Color Heading proof: {out_path}")
