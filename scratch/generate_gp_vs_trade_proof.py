from PIL import Image, ImageDraw, ImageFont

trade_img_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_trade_group_test/05_pdp_trade_result.png'
gp_img_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/general_public_audit/02_leon_general_public_desktop.png'
out_path = '/home/deepali/.gemini/antigravity-ide/brain/4c974b75-f11f-4e19-a08a-3c9db3753ff7/TRADE_VS_GENERAL_PUBLIC_HEADED_PROOF.png'

im_trade = Image.open(trade_img_path)
im_gp = Image.open(gp_img_path)

# Crop the purchase column and alternative products (x: 680 to 1420, y: 0 to 1250)
crop_box = (680, 0, 1420, 1250)

crop_trade = im_trade.crop(crop_box)
crop_gp = im_gp.crop(crop_box)

w, h = crop_trade.size
header_h = 80
summary_h = 130
canvas_w = w * 2 + 30
canvas_h = header_h + summary_h + h + 40

canvas = Image.new('RGB', (canvas_w, canvas_h), '#FFFFFF')
draw = ImageDraw.Draw(canvas)

try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
    font_text = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
except:
    font_title = font_sub = font_badge = font_text = ImageFont.load_default()

# Header banner
draw.rectangle([0, 0, canvas_w, header_h - 10], fill='#0F172A')
draw.text((25, 18), "Customer Group Pricing Audit: General Public vs Trade (US Staging PDP)", fill='#FFFFFF', font=font_title)
draw.text((25, 46), "Headed Mode Verification: Product Wholesale Price, MSRP, and CTAs for General Public Retail accounts", fill='#94A3B8', font=font_sub)

# Summary Cards above screenshots
y_cards = header_h + 10

# Left Card: General Public
x1 = 15
draw.rectangle([x1, y_cards, x1 + w, y_cards + summary_h], fill='#EFF6FF', outline='#2563EB', width=2)
draw.rectangle([x1, y_cards, x1 + w, y_cards + 30], fill='#2563EB')
draw.text((x1 + 15, y_cards + 6), "1. LOGGED IN: GENERAL PUBLIC (RETAIL USER)", fill='#FFFFFF', font=font_badge)
draw.text((x1 + 15, y_cards + 40), "✔ Product Wholesale Price: SUPPRESSED (Blank Box)", fill='#15803D', font=font_badge)
draw.text((x1 + 15, y_cards + 62), "✔ MSRP Price Line: SUPPRESSED (Hidden)", fill='#15803D', font=font_badge)
draw.text((x1 + 15, y_cards + 84), "✔ [ADD TO CART] & [ADD TO QUOTE]: SUPPRESSED", fill='#15803D', font=font_badge)
draw.text((x1 + 15, y_cards + 106), "✖ DEFECT (DE#37): 'Enquire for ETA' leaks to Retail user!", fill='#DC2626', font=font_badge)

# Right Card: Trade Account
x2 = x1 + w + 10
draw.rectangle([x2, y_cards, x2 + w, y_cards + summary_h], fill='#F0FDF4', outline='#16A34A', width=2)
draw.rectangle([x2, y_cards, x2 + w, y_cards + 30], fill='#16A34A')
draw.text((x2 + 15, y_cards + 6), "2. LOGGED IN: TRADE ACCOUNT (B2B TIER)", fill='#FFFFFF', font=font_badge)
draw.text((x2 + 15, y_cards + 40), "✔ Product Wholesale Price: VISIBLE ($300.00)", fill='#15803D', font=font_badge)
draw.text((x2 + 15, y_cards + 62), "✔ MSRP Price Line: VISIBLE (MSRP:$330.00)", fill='#15803D', font=font_badge)
draw.text((x2 + 15, y_cards + 84), "✔ [ADD TO CART] & [ADD TO QUOTE]: ACTIVE", fill='#15803D', font=font_badge)
draw.text((x2 + 15, y_cards + 106), "✔ Trade Pricing Toggle ('Trade') in utility bar: ACTIVE", fill='#15803D', font=font_badge)

# Place screenshots cleanly underneath without any overlapping text!
y_imgs = y_cards + summary_h + 15

canvas.paste(crop_gp, (x1, y_imgs))
draw.rectangle([x1, y_imgs, x1 + w, y_imgs + h], outline='#2563EB', width=3)

canvas.paste(crop_trade, (x2, y_imgs))
draw.rectangle([x2, y_imgs, x2 + w, y_imgs + h], outline='#16A34A', width=3)

canvas.save(out_path)
print(f"Generated clean comparison proof: {out_path}")
