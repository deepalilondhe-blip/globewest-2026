import os
import shutil
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = 'Sprint-3/Ticket_41794540_About_Us'
MOB_DIR = os.path.join(BASE_DIR, 'screenshots/mobile')

# 1. Direct copy of US real mobile view
shutil.copyfile(
    os.path.join(MOB_DIR, '04_US_AUTH_mobile_about_us_viewport.png'),
    os.path.join(BASE_DIR, 'US_Mobile_View.png')
)

# 2. Direct copy of US real mobile full page
shutil.copyfile(
    os.path.join(MOB_DIR, '03_US_AUTH_mobile_about_us_full.png'),
    os.path.join(BASE_DIR, 'US_Mobile_View_FullPage.png')
)

# 3. Pure side-by-side of AU vs US mobile (zero color highlights)
au_mob = Image.open(os.path.join(MOB_DIR, '02_AU_AUTH_mobile_about_us_viewport.png'))
us_mob = Image.open(os.path.join(MOB_DIR, '04_US_AUTH_mobile_about_us_viewport.png'))

w, h = 390, 844
header_h = 35
gap = 20
total_w = w * 2 + gap + 40
total_h = h + header_h + 30

canvas = Image.new('RGB', (total_w, total_h), (255, 255, 255))
draw = ImageDraw.Draw(canvas)

try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
except:
    font = ImageFont.load_default()

# Simple black labels - no colors, no badges
draw.text((20, 10), "AU Baseline (Live)", fill=(0, 0, 0), font=font)
draw.text((20 + w + gap, 10), "US Staging (Live)", fill=(0, 0, 0), font=font)

canvas.paste(au_mob, (20, header_h))
canvas.paste(us_mob, (20 + w + gap, header_h))

# 1px minimal border around images just to separate from white background
draw.rectangle([20, header_h, 20 + w, header_h + h], outline=(220, 220, 220), width=1)
draw.rectangle([20 + w + gap, header_h, 20 + w * 2 + gap, header_h + h], outline=(220, 220, 220), width=1)

out_comp = os.path.join(BASE_DIR, 'AU_vs_US_Mobile_Side_by_Side.png')
canvas.save(out_comp, quality=95)

print("Saved files:")
print(os.path.join(BASE_DIR, 'US_Mobile_View.png'))
print(os.path.join(BASE_DIR, 'US_Mobile_View_FullPage.png'))
print(out_comp)
