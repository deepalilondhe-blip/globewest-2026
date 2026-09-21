import os
from PIL import Image, ImageDraw, ImageFont

before_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/screenshots/us/01_US_Full_Footer.png'
after_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/FOOTER_VERIFIED_SIMPLE_RED_PROOF.png'

im_before = Image.open(before_path).convert('RGB')
im_after = Image.open(after_path).convert('RGB')

bw, bh = im_before.size
# Crop exactly the footer area without the white margin at the bottom (y=195 to y=800)
footer_before = im_before.crop((0, 195, bw, 800))
footer_after = im_after

target_w = 1440
fb_w, fb_h = footer_before.size
fa_w, fa_h = footer_after.size

if fb_w != target_w:
    footer_before = footer_before.resize((target_w, int(fb_h * target_w / fb_w)), Image.Resampling.LANCZOS)
if fa_w != target_w:
    footer_after = footer_after.resize((target_w, int(fa_h * target_w / fa_w)), Image.Resampling.LANCZOS)

fb_w, fb_h = footer_before.size
fa_w, fa_h = footer_after.size

# Draw highlights on Before image:
draw_b = ImageDraw.Draw(footer_before)
RED = (235, 30, 30)

# 1. Area above Subscribe where Social Links / Instagram was MISSING
draw_b.rectangle([25, 6, 320, 52], outline=RED, width=3)

# 2. Copyright "© 2023 GlobeWest"
draw_b.rectangle([960, fb_h - 40, 1115, fb_h - 10], outline=RED, width=3)

BANNER_H = 46
total_h = BANNER_H + fb_h + 20 + BANNER_H + fa_h

combined = Image.new('RGB', (target_w, total_h), (255, 255, 255))
draw_c = ImageDraw.Draw(combined)

try:
    font_banner = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
except:
    font_banner = ImageFont.load_default()

# 1. BEFORE Banner (Red)
draw_c.rectangle([0, 0, target_w, BANNER_H], fill=(220, 38, 38))
draw_c.text((30, 12), "BEFORE (Previous Staging): Social Links / Instagram Missing | Outdated Copyright © 2023", fill=(255, 255, 255), font=font_banner)
combined.paste(footer_before, (0, BANNER_H))

# 2. AFTER Banner (Green)
y_after_start = BANNER_H + fb_h + 20
draw_c.rectangle([0, y_after_start, target_w, y_after_start + BANNER_H], fill=(22, 163, 74))
draw_c.text((30, y_after_start + 12), "AFTER (Live US Staging Verified): Social Links / Instagram Added | Copyright Updated to © 2026", fill=(255, 255, 255), font=font_banner)
combined.paste(footer_after, (0, y_after_start + BANNER_H))

out_path_1 = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/comparison/FOOTER_BEFORE_AFTER_COMPARISON.png'
out_path_2 = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FOOTER_BEFORE_AFTER_COMPARISON.png'
out_path_3 = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Screenshots_For_Michelle/FOOTER_BEFORE_AFTER_COMPARISON.png'

combined.save(out_path_1)
combined.save(out_path_2)
combined.save(out_path_3)
print(f"✅ Perfectly aligned Before/After comparison: {out_path_1}")
