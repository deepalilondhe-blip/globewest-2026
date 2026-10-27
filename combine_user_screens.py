import os
from PIL import Image, ImageDraw, ImageFont

im_us = Image.open('/home/deepali/.gemini/antigravity-ide/brain/4776f207-c054-4134-bc5a-69944c769958/.user_uploaded/media_1790848278537.png')
im_au = Image.open('/home/deepali/.gemini/antigravity-ide/brain/4776f207-c054-4134-bc5a-69944c769958/.user_uploaded/media_1790848278551.png')

w, h = im_au.size
header_h = 45
gap = 20
pad = 20

total_w = pad + w * 2 + gap + pad
total_h = pad + header_h + h + pad

canvas = Image.new('RGB', (total_w, total_h), (255, 255, 255))
draw = ImageDraw.Draw(canvas)

try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
except:
    font = ImageFont.load_default()

# Clean neutral black labels - zero colors, zero highlights
draw.text((pad + 10, pad + 10), "AU Baseline Live (mcstaging2.globewest.com.au/about-us)", fill=(0, 0, 0), font=font)
draw.text((pad + w + gap + 10, pad + 10), "US Staging Live (mcstaging2.globewest.com/about-us)", fill=(0, 0, 0), font=font)

# Subtle line
draw.line([(pad, pad + header_h - 10), (pad + w, pad + header_h - 10)], fill=(220, 220, 220), width=1)
draw.line([(pad + w + gap, pad + header_h - 10), (total_w - pad, pad + header_h - 10)], fill=(220, 220, 220), width=1)

# Paste images
img_y = pad + header_h
canvas.paste(im_au, (pad, img_y))
canvas.paste(im_us, (pad + w + gap, img_y))

# Subtle border
draw.rectangle([pad, img_y, pad + w, img_y + h], outline=(220, 220, 220), width=1)
draw.rectangle([pad + w + gap, img_y, pad + w * 2 + gap, img_y + h], outline=(220, 220, 220), width=1)

out_file = 'Sprint-3/Ticket_41794540_About_Us/AU_vs_US_About_Us_Screenshots.png'
canvas.save(out_file, quality=95)
print("Saved:", out_file)
