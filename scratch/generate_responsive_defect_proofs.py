import os
from PIL import Image, ImageDraw, ImageFont

out_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/responsive_trade_results'
artifact_dir = '/home/deepali/.gemini/antigravity-ide/brain/4c974b75-f11f-4e19-a08a-3c9db3753ff7'

try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
except:
    font_title = font_badge = font_sub = ImageFont.load_default()

# -------------------------------------------------------------
# 1. Swatch Collision Proof (iPhone 14 / iPhone SE)
# -------------------------------------------------------------
img_mobile = Image.open(f'{out_dir}/Leon_Side_Table_iPhone_14_390x844_trade.png')
crop_swatch = img_mobile.crop((0, 600, 390, 1100))
w1, h1 = crop_swatch.size

canvas1 = Image.new('RGB', (w1 + 30, h1 + 75), '#FFFFFF')
draw1 = ImageDraw.Draw(canvas1)
draw1.rectangle([0, 0, w1 + 30, 45], fill='#DC2626')
draw1.text((12, 12), "DEFECT: Floating Social Widget Overlaps Swatches (Mobile 390px)", fill='#FFFFFF', font=font_title)

canvas1.paste(crop_swatch, (15, 55))
draw1.rectangle([15, 55, 15 + w1, 55 + h1], outline='#DC2626', width=3)

# Highlight Pinterest widget collision over swatch line
draw1.rectangle([320, 205, 395, 270], outline='#FF0000', width=3)
draw1.rectangle([230, 185, 395, 205], fill='#FF0000')
draw1.text((235, 188), "COLLISION WITH SWATCHES", fill='#FFFFFF', font=font_badge)

proof1_path = f'{artifact_dir}/PROOF_01_MOBILE_SWATCH_COLLISION.png'
canvas1.save(proof1_path)
canvas1.save(f'{out_dir}/PROOF_01_MOBILE_SWATCH_COLLISION.png')
print(f"Saved: {proof1_path}")


# -------------------------------------------------------------
# 2. Tablet Button Stretch Proof (iPad 768px)
# -------------------------------------------------------------
img_tablet = Image.open(f'{out_dir}/Leon_Side_Table_iPad_Mini_768x1024_trade.png')
crop_tablet = img_tablet.crop((0, 1150, 768, 1600))
w2, h2 = crop_tablet.size

canvas2 = Image.new('RGB', (w2 + 30, h2 + 75), '#FFFFFF')
draw2 = ImageDraw.Draw(canvas2)
draw2.rectangle([0, 0, w2 + 30, 45], fill='#DC2626')
draw2.text((12, 12), "DEFECT: Tablet 768px Unconstrained 658px CTA Stretch", fill='#FFFFFF', font=font_title)

canvas2.paste(crop_tablet, (15, 55))
draw2.rectangle([15, 55, 15 + w2, 55 + h2], outline='#DC2626', width=3)

# Highlight Add to cart width
draw2.rectangle([100, 130, 760, 185], outline='#FF0000', width=3)
draw2.rectangle([100, 105, 420, 130], fill='#FF0000')
draw2.text((105, 110), "658px Over-Stretched CTA Width", fill='#FFFFFF', font=font_badge)

proof2_path = f'{artifact_dir}/PROOF_02_TABLET_BUTTON_STRETCH.png'
canvas2.save(proof2_path)
canvas2.save(f'{out_dir}/PROOF_02_TABLET_BUTTON_STRETCH.png')
print(f"Saved: {proof2_path}")


# -------------------------------------------------------------
# 3. Mobile Footer Collision Proof (375px)
# -------------------------------------------------------------
crop_footer = img_mobile.crop((0, 2980, 390, 3230))
w3, h3 = crop_footer.size

canvas3 = Image.new('RGB', (w3 + 30, h3 + 75), '#FFFFFF')
draw3 = ImageDraw.Draw(canvas3)
draw3.rectangle([0, 0, w3 + 30, 45], fill='#DC2626')
draw3.text((12, 12), "DEFECT: Mobile Footer 0px Margin Text Collision", fill='#FFFFFF', font=font_title)

canvas3.paste(crop_footer, (15, 55))
draw3.rectangle([15, 55, 15 + w3, 55 + h3], outline='#DC2626', width=3)

# Highlight overlapping text area
draw3.rectangle([20, 100, 380, 160], outline='#FF0000', width=3)
draw3.rectangle([20, 78, 320, 100], fill='#FF0000')
draw3.text((25, 82), "0px Margin Text Collision (reCAPTCHA vs Showrooms)", fill='#FFFFFF', font=font_badge)

proof3_path = f'{artifact_dir}/PROOF_03_MOBILE_FOOTER_COLLISION.png'
canvas3.save(proof3_path)
canvas3.save(f'{out_dir}/PROOF_03_MOBILE_FOOTER_COLLISION.png')
print(f"Saved: {proof3_path}")


# -------------------------------------------------------------
# 4. Mobile Top Bar Truncation Proof (390px)
# -------------------------------------------------------------
crop_topbar = img_mobile.crop((0, 0, 390, 130))
w4, h4 = crop_topbar.size

canvas4 = Image.new('RGB', (w4 + 30, h4 + 75), '#FFFFFF')
draw4 = ImageDraw.Draw(canvas4)
draw4.rectangle([0, 0, w4 + 30, 45], fill='#DC2626')
draw4.text((12, 12), "DEFECT: Mobile Top Utility Bar Truncates 'Appointment'", fill='#FFFFFF', font=font_title)

canvas4.paste(crop_topbar, (15, 55))
draw4.rectangle([15, 55, 15 + w4, 55 + h4], outline='#DC2626', width=3)

# Highlight truncated text in top bar
draw4.rectangle([240, 58, 395, 88], outline='#FF0000', width=3)
draw4.rectangle([240, 90, 395, 110], fill='#FF0000')
draw4.text((245, 93), "Clipped to 'Book Showroom'", fill='#FFFFFF', font=font_badge)

proof4_path = f'{artifact_dir}/PROOF_04_MOBILE_TOPBAR_TRUNCATION.png'
canvas4.save(proof4_path)
canvas4.save(f'{out_dir}/PROOF_04_MOBILE_TOPBAR_TRUNCATION.png')
print(f"Saved: {proof4_path}")

print("All 4 precision-annotated responsive defect proofs successfully generated!")
