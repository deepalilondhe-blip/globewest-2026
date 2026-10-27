import os
from PIL import Image, ImageDraw, ImageFont

figma_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PDP Page/figma_crops/FIGMA_MOBILE_FRAME.png'
live_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/responsive_trade_results/Leon_Side_Table_iPhone_14_390x844_trade.png'
out_path = '/home/deepali/.gemini/antigravity-ide/brain/4c974b75-f11f-4e19-a08a-3c9db3753ff7/PINTEREST_DEFECT_CLEAR_EXPLANATION.png'

im_figma = Image.open(figma_path)
im_live = Image.open(live_path)

# Let's crop clean, informative sections:
# 1. FIGMA: Top utility bar down through the product image with grey Pinterest icon
# Figma frame size: fw, fh
fw, fh = im_figma.size
crop_figma = im_figma.crop((0, 0, fw, min(fh, 340)))

# 2. LIVE STAGING PHOTO: Top utility bar down through image (shows identical grey Pinterest icon)
crop_live_photo = im_live.crop((0, 0, 390, 340))

# 3. LIVE STAGING DEFECT: The swatch area showing the rogue red/blue buttons overlapping swatches
crop_live_defect = im_live.crop((0, 620, 390, 960))

# Fixed target card height and width
card_w = 400
card_h = 350

def fit_crop(img, tw, th):
    # Scale width to tw
    ratio = tw / float(img.width)
    new_h = int(img.height * ratio)
    resized = img.resize((tw, new_h), Image.Resampling.LANCZOS)
    if new_h > th:
        return resized.crop((0, 0, tw, th))
    elif new_h < th:
        canvas = Image.new('RGB', (tw, th), '#FFFFFF')
        canvas.paste(resized, (0, 0))
        return canvas
    return resized

c1 = fit_crop(crop_figma, card_w, card_h)
c2 = fit_crop(crop_live_photo, card_w, card_h)
c3 = fit_crop(crop_live_defect, card_w, card_h)

# Canvas Setup
header_h = 90
annot_h = 130
footer_h = 50
canvas_w = card_w * 3 + 60
canvas_h = header_h + card_h + annot_h + footer_h + 30

canvas = Image.new('RGB', (canvas_w, canvas_h), '#FFFFFF')
draw = ImageDraw.Draw(canvas)

try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    font_header = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
    font_text = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
except:
    font_title = font_sub = font_header = font_badge = font_text = ImageFont.load_default()

# 1. Header Banner
draw.rectangle([0, 0, canvas_w, header_h - 10], fill='#0F172A')
draw.text((25, 18), "Pinterest Defect Explained: Figma Spec vs Live Staging", fill='#FFFFFF', font=font_title)
draw.text((25, 48), "Clarifying the difference between the APPROVED inline grey icon and the UNAPPROVED floating red widget", fill='#94A3B8', font=font_sub)

y_cards = header_h + 10

# -------------------------------------------------------------------
# CARD 1: FIGMA APPROVED SPEC (GREEN)
# -------------------------------------------------------------------
x1 = 20
draw.rectangle([x1, y_cards, x1 + card_w, y_cards + 35], fill='#16A34A')
draw.text((x1 + 15, y_cards + 8), "1. FIGMA SPEC (APPROVED 🟢)", fill='#FFFFFF', font=font_header)

canvas.paste(c1, (x1, y_cards + 35))
draw.rectangle([x1, y_cards + 35, x1 + card_w, y_cards + 35 + card_h], outline='#16A34A', width=3)

# Highlight grey Pinterest icon on Figma
draw.rectangle([x1 + card_w - 55, y_cards + 130, x1 + card_w - 10, y_cards + 175], outline='#16A34A', width=3)

# Box for annotations below Card 1
y_annot = y_cards + 35 + card_h + 10
draw.rectangle([x1, y_annot, x1 + card_w, y_annot + annot_h], fill='#F0FDF4', outline='#16A34A', width=2)
draw.text((x1 + 15, y_annot + 15), "✔ Subtle grey Pinterest icon on photo", fill='#15803D', font=font_badge)
draw.text((x1 + 15, y_annot + 40), "✔ Top utility bar says 'Book Showroom'", fill='#15803D', font=font_badge)
draw.text((x1 + 15, y_annot + 65), "✔ Icon is static, anchored to photo only", fill='#15803D', font=font_badge)
draw.text((x1 + 15, y_annot + 90), "✔ Zero floating red/blue buttons exist!", fill='#15803D', font=font_badge)


# -------------------------------------------------------------------
# CARD 2: LIVE STAGING PHOTO (PASS - MATCHES FIGMA)
# -------------------------------------------------------------------
x2 = x1 + card_w + 10
draw.rectangle([x2, y_cards, x2 + card_w, y_cards + 35], fill='#16A34A')
draw.text((x2 + 15, y_cards + 8), "2. LIVE PHOTO (PASS 🟢 - MATCHES FIGMA)", fill='#FFFFFF', font=font_header)

canvas.paste(c2, (x2, y_cards + 35))
draw.rectangle([x2, y_cards + 35, x2 + card_w, y_cards + 35 + card_h], outline='#16A34A', width=3)

# Highlight identical grey Pinterest icon on Live Staging
draw.rectangle([x2 + card_w - 65, y_cards + 155, x2 + card_w - 15, y_cards + 205], outline='#16A34A', width=3)

# Box for annotations below Card 2
draw.rectangle([x2, y_annot, x2 + card_w, y_annot + annot_h], fill='#F0FDF4', outline='#16A34A', width=2)
draw.text((x2 + 15, y_annot + 15), "✔ Has the SAME grey Pinterest icon!", fill='#15803D', font=font_badge)
draw.text((x2 + 15, y_annot + 40), "✔ Top bar says 'Book Showroom' (Matches Figma)", fill='#15803D', font=font_badge)
draw.text((x2 + 15, y_annot + 65), "✔ Anchored to photo exactly like Figma", fill='#15803D', font=font_badge)
draw.text((x2 + 15, y_annot + 90), "✔ This inline icon is 100% CORRECT", fill='#15803D', font=font_badge)


# -------------------------------------------------------------------
# CARD 3: LIVE STAGING SWATCHES (FAIL - THE ACTUAL DEFECT)
# -------------------------------------------------------------------
x3 = x2 + card_w + 10
draw.rectangle([x3, y_cards, x3 + card_w, y_cards + 35], fill='#DC2626')
draw.text((x3 + 15, y_cards + 8), "3. THE ACTUAL DEFECT (FAIL 🔴)", fill='#FFFFFF', font=font_header)

canvas.paste(c3, (x3, y_cards + 35))
draw.rectangle([x3, y_cards + 35, x3 + card_w, y_cards + 35 + card_h], outline='#DC2626', width=3)

# Highlight rogue floating red Pinterest & blue Share buttons
draw.rectangle([x3 + card_w - 85, y_cards + 115, x3 + card_w - 5, y_cards + 165], outline='#FF0000', width=4)
draw.rectangle([x3 + 80, y_cards + 90, x3 + card_w - 5, y_cards + 115], fill='#DC2626')
draw.text((x3 + 85, y_cards + 94), "✖ UNAPPROVED FLOATING WIDGET", fill='#FFFFFF', font=font_badge)

# Highlight Tobacco Ash swatch covered by the widget
draw.rectangle([x3 + 245, y_cards + 168, x3 + 325, y_cards + 265], outline='#FF0000', width=3)

# Box for annotations below Card 3
draw.rectangle([x3, y_annot, x3 + card_w, y_annot + annot_h], fill='#FEF2F2', outline='#DC2626', width=2)
draw.text((x3 + 15, y_annot + 15), "✖ Extra plugin (.mp_social_share_float)", fill='#B91C1C', font=font_badge)
draw.text((x3 + 15, y_annot + 40), "✖ Bright RED Pinterest + BLUE Share buttons", fill='#B91C1C', font=font_badge)
draw.text((x3 + 15, y_annot + 65), "✖ FLOATS down page as user scrolls", fill='#B91C1C', font=font_badge)
draw.text((x3 + 15, y_annot + 90), "✖ BLOCKS the 4th swatch ('Tobacco Ash')!", fill='#B91C1C', font=font_badge)

# Bottom Conclusion Bar
draw.rectangle([0, canvas_h - footer_h, canvas_w, canvas_h], fill='#F1F5F9')
draw.text((25, canvas_h - 32), "SUMMARY: The grey Pinterest icon on the photo is APPROVED. The floating red/blue widget is an UNAPPROVED DEFECT.", fill='#0F172A', font=font_badge)

canvas.save(out_path)
print(f"Generated clean updated explanation: {out_path}")
