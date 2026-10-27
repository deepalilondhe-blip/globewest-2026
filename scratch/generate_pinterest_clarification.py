from PIL import Image, ImageDraw, ImageFont

# Load Figma Mobile Frame and Live Staging Mobile screenshot
figma_img_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PDP Page/figma_crops/FIGMA_MOBILE_FRAME.png'
live_img_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/responsive_trade_results/Leon_Side_Table_iPhone_14_390x844_trade.png'
out_path = '/home/deepali/.gemini/antigravity-ide/brain/4c974b75-f11f-4e19-a08a-3c9db3753ff7/PINTEREST_FIGMA_VS_LIVE_EXPLAINED.png'

im_figma = Image.open(figma_img_path)
im_live = Image.open(live_img_path)

# Figma crop from top to swatches
# Let's inspect figma size
fw, fh = im_figma.size
crop_figma = im_figma.crop((0, 0, fw, min(fh, 550)))

# Resize Figma width to match live mobile width (390) for clean comparison
aspect = 390.0 / crop_figma.width
new_h = int(crop_figma.height * aspect)
crop_figma_resized = crop_figma.resize((390, new_h), Image.Resampling.LANCZOS)

# Live crop
crop_live = im_live.crop((0, 0, 390, 850))

# We will put both side-by-side
canvas_w = 390 * 2 + 40
canvas_h = max(new_h, 850) + 100

canvas = Image.new('RGB', (canvas_w, canvas_h), '#F8F9FA')
draw = ImageDraw.Draw(canvas)

try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
except:
    font_title = font_sub = font_badge = ImageFont.load_default()

# Header banner
draw.text((20, 15), "Pinterest & Mobile Top Bar: Figma Spec vs Live Staging Clarification", fill="#0F172A", font=font_title)
draw.text((20, 42), "Comparing Figma Mobile (Node 2317-27241) with Live US Staging Mobile (390px)", fill="#475569", font=font_sub)

y_offset = 75

# Left Column: Figma
canvas.paste(crop_figma_resized, (15, y_offset + 30))
draw.rectangle([15, y_offset + 30, 15 + 390, y_offset + 30 + new_h], outline='#16A34A', width=3)
draw.rectangle([15, y_offset, 15 + 390, y_offset + 30], fill='#16A34A')
draw.text((25, y_offset + 6), "APPROVED FIGMA SPEC (Figma Node 2317)", fill='#FFFFFF', font=font_badge)

# Right Column: Live Staging
canvas.paste(crop_live, (425, y_offset + 30))
draw.rectangle([425, y_offset + 30, 425 + 390, y_offset + 30 + 850], outline='#DC2626', width=3)
draw.rectangle([425, y_offset, 425 + 390, y_offset + 30], fill='#DC2626')
draw.text((435, y_offset + 6), "LIVE US STAGING (Has Unapproved Floating Widget)", fill='#FFFFFF', font=font_badge)

# Annotations on Live Staging:
# 1. Top bar: Green box showing 'Book Showroom' matches Figma!
draw.rectangle([430, y_offset + 30, 430 + 380, y_offset + 65], outline='#16A34A', width=2)
draw.text((435, y_offset + 70), "✔ 'Book Showroom' matches Figma!", fill='#16A34A', font=font_badge)

# 2. Inline Grey Pinterest icon: Green box showing it exists on both!
draw.rectangle([765, y_offset + 170, 805, y_offset + 215], outline='#16A34A', width=2)
draw.text((610, y_offset + 185), "✔ Inline Icon (Matches Figma) ->", fill='#16A34A', font=font_badge)

# 3. Floating Red/Blue Widget: RED box showing the defect!
draw.rectangle([740, y_offset + 575, 810, y_offset + 625], outline='#DC2626', width=3)
draw.rectangle([510, y_offset + 550, 810, y_offset + 575], fill='#DC2626')
draw.text((515, y_offset + 554), "✖ DEFECT: Extra Floating Sticky Widget", fill='#FFFFFF', font=font_badge)

canvas.save(out_path)
print(f"Generated comparison: {out_path}")
