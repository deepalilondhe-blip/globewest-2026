from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Trade_Pricing_Toggle_Screenshots'
ARTIFACT_DIR = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c'
RED = (235, 30, 30)
LINE_WIDTH = 3

# 1. Single Mobile Slideout Proof
im_slideout = Image.open('mobile_audit/mobile_02_slideout_open.png').convert('RGB')
draw_slideout = ImageDraw.Draw(im_slideout)

# Red box around the slideout options inside the drawer
# Drawer items: Trade & MSRP are located roughly x: 25..150, y: 75..175
box_drawer = [20, 68, 175, 182]
for i in range(LINE_WIDTH):
    draw_slideout.rectangle([box_drawer[0] - i, box_drawer[1] - i, box_drawer[2] + i, box_drawer[3] + i], outline=RED)

# Red box around the close button ✕ at top right of drawer
box_close = [238, 16, 268, 46]
for i in range(LINE_WIDTH):
    draw_slideout.rectangle([box_close[0] - i, box_close[1] - i, box_close[2] + i, box_close[3] + i], outline=RED)

out_single_root = os.path.join(OUT_DIR, 'TRADE_PRICING_TOGGLE_MOBILE_SLIDEOUT_PROOF.png')
out_single_art = os.path.join(ARTIFACT_DIR, 'TRADE_PRICING_TOGGLE_MOBILE_SLIDEOUT_PROOF.png')
im_slideout.save(out_single_root, quality=95)
im_slideout.save(out_single_art, quality=95)
print('Saved single mobile slideout proof!')

# 2. Combined Side-by-Side Mobile Proof:
# Left: Mobile Header Trigger (with red box)
# Right: Slide-out Drawer Open (with red box)
im_initial = Image.open('mobile_audit/mobile_01_initial_trade.png').convert('RGB')
draw_initial = ImageDraw.Draw(im_initial)

# Highlight eye icon trigger in top utility bar
box_mobile_trig = [14, 2, 115, 32]
for i in range(LINE_WIDTH):
    draw_initial.rectangle([box_mobile_trig[0] - i, box_mobile_trig[1] - i, box_mobile_trig[2] + i, box_mobile_trig[3] + i], outline=RED)

# Crop both to upper 550px so they focus on the header, trigger, and slideout drawer clearly
CROP_H = 560
crop_initial = im_initial.crop((0, 0, 390, CROP_H))
crop_slideout = im_slideout.crop((0, 0, 390, CROP_H))

# Create side-by-side canvas
GAP = 20
total_w = 390 * 2 + GAP
total_h = CROP_H

combo = Image.new('RGB', (total_w, total_h), (245, 245, 247))
combo.paste(crop_initial, (0, 0))
combo.paste(crop_slideout, (390 + GAP, 0))

# Draw a subtle separator line
draw_combo = ImageDraw.Draw(combo)
draw_combo.line([(390 + GAP//2, 0), (390 + GAP//2, total_h)], fill=(220, 220, 225), width=2)

out_combo_root = os.path.join(OUT_DIR, 'TRADE_PRICING_TOGGLE_MOBILE_RED_PROOF.png')
out_combo_art = os.path.join(ARTIFACT_DIR, 'TRADE_PRICING_TOGGLE_MOBILE_RED_PROOF.png')
combo.save(out_combo_root, quality=95)
combo.save(out_combo_art, quality=95)
print('Saved combined mobile red proof!')
