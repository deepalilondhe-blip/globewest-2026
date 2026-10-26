import os
from PIL import Image, ImageDraw, ImageFont

figma_path = 'Sprint-3/Ticket_Enable_Public_Browsing_Mode/screenshots/FIGMA_SPEC_ETA_STOCK_LOGIC.png'
live_path = 'Sprint-3/Ticket_Enable_Public_Browsing_Mode/screenshots/LIVE_US_STAGING_ETA_STOCK_ACTUAL.png'
output_path = 'Sprint-3/Ticket_Enable_Public_Browsing_Mode/comparison/COMPARISON_05_ETA_AND_STOCK_LOGIC_FIGMA_VS_LIVE.png'

figma_img = Image.open(figma_path).convert('RGB')
live_img = Image.open(live_path).convert('RGB')

# Resize or pad so both panels are balanced
panel_w = 640
# Calculate scaled heights
f_scale = panel_w / figma_img.width
l_scale = panel_w / live_img.width

figma_scaled = figma_img.resize((panel_w, int(figma_img.height * f_scale)), Image.LANCZOS)
live_scaled = live_img.resize((panel_w, int(live_img.height * f_scale)), Image.LANCZOS)

max_img_h = max(figma_scaled.height, live_scaled.height)

# Create padded image containers for both
def pad_image(img, target_h):
    canvas = Image.new('RGB', (panel_w, target_h), (255, 255, 255))
    canvas.paste(img, (0, 0))
    return canvas

figma_panel = pad_image(figma_scaled, max_img_h)
live_panel = pad_image(live_scaled, max_img_h)

# Canvas dimensions
header_h = 100
footer_h = 90
card_header_h = 50
padding = 30
gap = 30

total_w = padding * 2 + panel_w * 2 + gap
total_h = header_h + card_header_h + max_img_h + footer_h + padding

comp = Image.new('RGB', (total_w, total_h), (245, 247, 250))
draw = ImageDraw.Draw(comp)

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    font_card_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_meta = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_footer = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
except Exception:
    font_title = font_sub = font_card_title = font_meta = font_footer = ImageFont.load_default()

# 1. Main Header Banner
draw.rectangle([0, 0, total_w, header_h], fill=(24, 30, 42))
draw.text((padding, 20), "ETA & STOCK STATUS LOGIC — FIGMA SPEC VS LIVE US STAGING", fill=(255, 255, 255), font=font_title)
draw.text((padding, 58), "Target: PDP Stock Availability & Incoming Shipment | Spec: Alex Pape / Four Hands Model", fill=(180, 195, 215), font=font_sub)

# 2. Left Panel: Figma Spec (Approved Green)
left_x = padding
card_y = header_h + 20

# Card title box (Green)
draw.rectangle([left_x, card_y, left_x + panel_w, card_y + card_header_h], fill=(34, 139, 34))
draw.text((left_x + 15, card_y + 8), "🟢 APPROVED FIGMA SPEC (Expected Design)", fill=(255, 255, 255), font=font_card_title)
draw.text((left_x + 15, card_y + 29), "Specifies available qty in brackets + Next incoming shipment line", fill=(220, 255, 220), font=font_meta)

# Paste Image & Green Border
comp.paste(figma_panel, (left_x, card_y + card_header_h))
draw.rectangle([left_x, card_y, left_x + panel_w, card_y + card_header_h + max_img_h], outline=(34, 139, 34), width=4)

# 3. Right Panel: US Staging Actual (Defect Red)
right_x = left_x + panel_w + gap

# Card title box (Red)
draw.rectangle([right_x, card_y, right_x + panel_w, card_y + card_header_h], fill=(195, 30, 30))
draw.text((right_x + 15, card_y + 8), "🔴 LIVE US STAGING (Actual Storefront)", fill=(255, 255, 255), font=font_card_title)
draw.text((right_x + 15, card_y + 29), "Shows only generic 'Enquire for ETA' — Missing quantity & shipment", fill=(255, 220, 220), font=font_meta)

# Paste Image & Red Border
comp.paste(live_panel, (right_x, card_y + card_header_h))
draw.rectangle([right_x, card_y, right_x + panel_w, card_y + card_header_h + max_img_h], outline=(195, 30, 30), width=4)

# 4. Footer Summary Box
footer_y = card_y + card_header_h + max_img_h + 20
draw.rectangle([padding, footer_y, total_w - padding, footer_y + footer_h - 10], fill=(255, 255, 255), outline=(210, 220, 230), width=2)
draw.text((padding + 20, footer_y + 15), "DEFECT FINDING: Developer stated it 'matches design', but Figma design clearly specifies:", fill=(30, 40, 55), font=font_footer)
draw.text((padding + 20, footer_y + 42), "• Expected: 'ETA 14 Mar 2027 (8 available)' + 'Next Shipment: 8 (ETA 14 Mar 2027)'", fill=(34, 139, 34), font=font_sub)
draw.text((padding + 20, footer_y + 65), "• Actual: 'Enquire for ETA' only (quantity and incoming shipment lines are missing).", fill=(195, 30, 30), font=font_sub)

os.makedirs(os.path.dirname(output_path), exist_ok=True)
comp.save(output_path, quality=95)
print(f"Comparison image saved successfully to {output_path} (Size: {comp.size})")
