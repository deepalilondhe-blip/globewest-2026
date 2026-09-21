import os
from PIL import Image, ImageDraw, ImageFont

before_mobile_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/screenshots/us/04_US_Footer_Mobile_390x844.png'
after_mobile_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Live_Inspection/03_RAW_MOBILE_FOOTER.png'

im_b = Image.open(before_mobile_path).convert('RGB')
im_a = Image.open(after_mobile_path).convert('RGB')

# Crop Before: from y=48 to y=835
footer_b = im_b.crop((0, 48, 380, 835))
footer_a = im_a.crop((0, 0, 380, 766))

target_w = 380
fb_w, fb_h = footer_b.size
fa_w, fa_h = footer_a.size

target_h = max(fb_h, fa_h)

pad_b = Image.new('RGB', (target_w, target_h), (230, 226, 220))
pad_b.paste(footer_b, (0, 0))

pad_a = Image.new('RGB', (target_w, target_h), (230, 226, 220))
pad_a.paste(footer_a, (0, 0))

RED = (235, 30, 30)      # Red highlight for Before
GREEN = (34, 197, 94)    # Green highlight for After
WIDTH = 3

# 1. Annotate BEFORE (RED highlights):
draw_b = ImageDraw.Draw(pad_b)
# Red box on outdated "© 2023 GlobeWest"
draw_b.rectangle([12, 722, 142, 746], outline=RED, width=WIDTH)

# 2. Annotate AFTER (GREEN highlights):
draw_a = ImageDraw.Draw(pad_a)
# Green box on CONNECT WITH US & social icons (Facebook, Pinterest, Instagram, TikTok)
draw_a.rectangle([8, 12, 372, 95], outline=GREEN, width=WIDTH)
# Green box on updated "© 2026 GlobeWest"
draw_a.rectangle([12, 703, 142, 725], outline=GREEN, width=WIDTH)

LABEL_H = 36
SPACING = 24
total_width = target_w * 2 + SPACING + 40
total_canvas_h = LABEL_H + target_h + 16

canvas = Image.new('RGB', (total_width, total_canvas_h), (255, 255, 255))
draw_c = ImageDraw.Draw(canvas)

try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
except:
    font = ImageFont.load_default()

BLACK = (20, 20, 20)

# Column 1: BEFORE
x_before = 20
draw_c.text((x_before + 5, 10), "BEFORE: Mobile Staging (© 2023)", fill=BLACK, font=font)
canvas.paste(pad_b, (x_before, LABEL_H))

# Divider line
x_divider = x_before + target_w + (SPACING // 2)
draw_c.line([(x_divider, 10), (x_divider, total_canvas_h - 10)], fill=(220, 220, 220), width=1)

# Column 2: AFTER
x_after = x_before + target_w + SPACING
draw_c.text((x_after + 5, 10), "AFTER: Live US Mobile Verified (© 2026)", fill=BLACK, font=font)
canvas.paste(pad_a, (x_after, LABEL_H))

out_path_1 = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/comparison/FOOTER_MOBILE_BEFORE_AFTER_COMPARISON.png'
out_path_2 = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FOOTER_MOBILE_BEFORE_AFTER_COMPARISON.png'
out_path_3 = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Screenshots_For_Michelle/FOOTER_MOBILE_BEFORE_AFTER_COMPARISON.png'

canvas.save(out_path_1)
canvas.save(out_path_2)
canvas.save(out_path_3)
print(f"✅ Pixel-perfect Mobile Before/After saved: {out_path_1}")
