import os
from PIL import Image, ImageDraw, ImageFont

img_before_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_login_as_customer/03_pdp_price_check.png'
img_after_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_trade_group_test/05_pdp_trade_result.png'
out_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_trade_group_test/side_by_side_trade_verification.png'

im_before = Image.open(img_before_path)
im_after = Image.open(img_after_path)

# Crop to show header utility bar (pricing toggle) + full right column (Title, Price, Swatches, Add to Cart, Add to Quote)
crop_box = (680, 0, 1440, 800)

crop_before = im_before.crop(crop_box)
crop_after = im_after.crop(crop_box)

w, h = crop_before.size
header_h = 80
canvas_w = w * 2 + 40
canvas_h = h + header_h + 30

canvas = Image.new('RGB', (canvas_w, canvas_h), '#F8F9FA')
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
except:
    font_title = font_sub = font_badge = ImageFont.load_default()

# Title banner
draw.text((25, 15), "Customer Group Pricing Verification: Login as Customer (USA Storefront)", fill="#0F172A", font=font_title)
draw.text((25, 46), "Account: deepali.londhe@overdose.digital (ID: 130725) | PDP: Leon Side Table - Powder Blue", fill="#475569", font=font_sub)

# Left Column: Before (General Public)
left_x = 15
left_y = header_h + 10
canvas.paste(crop_before, (left_x, left_y))

# Draw Red border around left
draw.rectangle([left_x, left_y, left_x + w, left_y + h], outline='#DC2626', width=4)
# Label badge
draw.rectangle([left_x, left_y - 28, left_x + 360, left_y], fill='#DC2626')
draw.text((left_x + 10, left_y - 23), "BEFORE: Customer Group = General Public", fill='#FFFFFF', font=font_badge)

# Right Column: After (Trade)
right_x = left_x + w + 15
right_y = left_y
canvas.paste(crop_after, (right_x, right_y))

# Draw Green border around right
draw.rectangle([right_x, right_y, right_x + w, right_y + h], outline='#16A34A', width=4)
# Label badge
draw.rectangle([right_x, right_y - 28, right_x + 300, right_y], fill='#16A34A')
draw.text((right_x + 10, right_y - 23), "AFTER: Customer Group = Trade", fill='#FFFFFF', font=font_badge)

canvas.save(out_path)
print(f"Generated side-by-side comparison: {out_path}")
