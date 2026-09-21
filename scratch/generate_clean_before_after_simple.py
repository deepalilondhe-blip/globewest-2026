import os
from PIL import Image, ImageDraw, ImageFont

# Source images
before_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/screenshots/us/01_US_Full_Footer.png'
after_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Live_Inspection/01_US_FOOTER_FULL.png'

im_before = Image.open(before_path).convert('RGB')
im_after = Image.open(after_path).convert('RGB')

bw, bh = im_before.size
aw, ah = im_after.size

# Crop Before: beige footer area only (y=195 to y=800)
footer_before = im_before.crop((0, 195, bw, 800))
footer_after = im_after.copy()

target_w = 1440
fb_w, fb_h = footer_before.size
fa_w, fa_h = footer_after.size

if fb_w != target_w:
    footer_before = footer_before.resize((target_w, int(fb_h * target_w / fb_w)), Image.Resampling.LANCZOS)
if fa_w != target_w:
    footer_after = footer_after.resize((target_w, int(fa_h * target_w / fa_w)), Image.Resampling.LANCZOS)

fb_w, fb_h = footer_before.size
fa_w, fa_h = footer_after.size

RED = (235, 30, 30)      # Red highlight for Before
GREEN = (34, 197, 94)    # Green highlight for After
WIDTH = 3

# 1. Annotate Before (RED highlights only)
draw_b = ImageDraw.Draw(footer_before)
# Area above Subscribe where Social Links / Instagram was missing
draw_b.rectangle([25, 6, 250, 52], outline=RED, width=WIDTH)
# Outdated copyright © 2023 GlobeWest
draw_b.rectangle([960, fb_h - 40, 1115, fb_h - 10], outline=RED, width=WIDTH)

# 2. Annotate After (GREEN highlights only)
draw_a = ImageDraw.Draw(footer_after)
# Newly added CONNECT WITH US and Social Icons (Facebook, Pinterest, Instagram, TikTok)
draw_a.rectangle([25, 80, 225, 140], outline=GREEN, width=WIDTH)
# Updated copyright © 2026 GlobeWest
draw_a.rectangle([1000, fa_h - 46, 1145, fa_h - 16], outline=GREEN, width=WIDTH)

# Clean, simple styling:
# White background, small black text label ("BEFORE" / "AFTER"), no heavy colored banners
LABEL_H = 36
DIVIDER_H = 16

total_h = LABEL_H + fb_h + DIVIDER_H + LABEL_H + fa_h
combined = Image.new('RGB', (target_w, total_h), (255, 255, 255))
draw_c = ImageDraw.Draw(combined)

try:
    font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
except:
    font_label = ImageFont.load_default()

BLACK = (20, 20, 20)

# Section 1: BEFORE
draw_c.text((30, 10), "BEFORE: Previous Staging (Social Links / Instagram Missing & Outdated Copyright 2023)", fill=BLACK, font=font_label)
combined.paste(footer_before, (0, LABEL_H))

# Divider line
y_divider = LABEL_H + fb_h + 8
draw_c.line([(20, y_divider), (target_w - 20, y_divider)], fill=(220, 220, 220), width=1)

# Section 2: AFTER
y_after_label = LABEL_H + fb_h + DIVIDER_H
draw_c.text((30, y_after_label + 10), "AFTER: Live US Staging (Social Links / Instagram Added & Copyright Updated to 2026)", fill=BLACK, font=font_label)
combined.paste(footer_after, (0, y_after_label + LABEL_H))

out_1 = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/comparison/FOOTER_BEFORE_AFTER_SIMPLE_RED_GREEN.png'
out_2 = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FOOTER_BEFORE_AFTER_SIMPLE_RED_GREEN.png'
out_3 = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Screenshots_For_Michelle/FOOTER_BEFORE_AFTER_SIMPLE_RED_GREEN.png'

combined.save(out_1)
combined.save(out_2)
combined.save(out_3)
print(f"✅ Successfully created clean Before/After image: {out_1}")
