import os
from PIL import Image, ImageDraw, ImageFont

figma_path = 'Sprint-3/Ticket_Claims_Portal/figma/desktop/02_FIGMA_DESKTOP_MY_CLAIMS.png'
live_path = 'Sprint-3/Ticket_Claims_Portal/screenshots/my_claims_live/02_AFTER_MY_CLAIMS_CLICK.png'
out_path = 'Sprint-3/Ticket_Claims_Portal/comparison/COMPARISON_FIGMA_VS_LIVE_MY_CLAIMS.png'

figma_img = Image.open(figma_path).convert('RGB')
live_img = Image.open(live_path).convert('RGB')

# Crop Figma content area (focused on the table and tabs)
# Figma is 1920x1080. Crop main central artboard
f_crop = figma_img.crop((200, 100, 1720, 950))

# Crop Live Staging top dashboard area
l_crop = live_img.crop((0, 0, live_img.width, 1100))

# Scale both to width 700
panel_w = 700
f_scaled = f_crop.resize((panel_w, int(f_crop.height * (panel_w / f_crop.width))), Image.LANCZOS)
l_scaled = l_crop.resize((panel_w, int(l_crop.height * (panel_w / l_crop.width))), Image.LANCZOS)

max_h = max(f_scaled.height, l_scaled.height)

def pad(img, target_h):
    canvas = Image.new('RGB', (panel_w, target_h), (255, 255, 255))
    canvas.paste(img, (0, 0))
    return canvas

f_panel = pad(f_scaled, max_h)
l_panel = pad(l_scaled, max_h)

header_h = 100
footer_h = 100
card_header_h = 50
padding = 30
gap = 30

total_w = padding * 2 + panel_w * 2 + gap
total_h = header_h + card_header_h + max_h + footer_h + padding

canvas = Image.new('RGB', (total_w, total_h), (245, 247, 250))
draw = ImageDraw.Draw(canvas)

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    font_card = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_meta = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_footer = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
except Exception:
    font_title = font_sub = font_card = font_meta = font_footer = ImageFont.load_default()

# Header
draw.rectangle([0, 0, total_w, header_h], fill=(24, 30, 42))
draw.text((padding, 20), "CLAIMS PORTAL (#41794532) — FIGMA SPEC (FRAME 630) VS LIVE STAGING", fill=(255, 255, 255), font=font_title)
draw.text((padding, 58), "Target: My Claims Table, Status Filter Tabs, & Create Claim CTA | Node 2316-15694", fill=(180, 195, 215), font=font_sub)

# Left: Figma Spec (Approved Green)
left_x = padding
card_y = header_h + 20

draw.rectangle([left_x, card_y, left_x + panel_w, card_y + card_header_h], fill=(34, 139, 34))
draw.text((left_x + 15, card_y + 8), "🟢 APPROVED FIGMA SPEC (Frame 630 / desktop/my_account/My Claims)", fill=(255, 255, 255), font=font_card)
draw.text((left_x + 15, card_y + 29), "Dedicated table grid, 4 tabs (ALL, OPEN, PENDING, CLOSED), & [CREATE NEW CLAIM] CTA", fill=(220, 255, 220), font=font_meta)

canvas.paste(f_panel, (left_x, card_y + card_header_h))
draw.rectangle([left_x, card_y, left_x + panel_w, card_y + card_header_h + max_h], outline=(34, 139, 34), width=4)

# Right: Live US Staging (Defect Red)
right_x = left_x + panel_w + gap

draw.rectangle([right_x, card_y, right_x + panel_w, card_y + card_header_h], fill=(195, 30, 30))
draw.text((right_x + 15, card_y + 8), "🔴 LIVE US STAGING (Actual 'MY CLAIMS' Section)", fill=(255, 255, 255), font=font_card)
draw.text((right_x + 15, card_y + 29), "Clicking Open Claims redirects to Dashboard; 'SUBMIT CLAIM' has href='#'", fill=(255, 220, 220), font=font_meta)

canvas.paste(l_panel, (right_x, card_y + card_header_h))
draw.rectangle([right_x, card_y, right_x + panel_w, card_y + card_header_h + max_h], outline=(195, 30, 30), width=4)

# Footer
footer_y = card_y + card_header_h + max_h + 20
draw.rectangle([padding, footer_y, total_w - padding, footer_y + footer_h - 10], fill=(255, 255, 255), outline=(210, 220, 230), width=2)
draw.text((padding + 20, footer_y + 15), "PIXEL-PERFECT AUDIT FINDING against Figma Frames 630 & 631:", fill=(30, 40, 55), font=font_footer)
draw.text((padding + 20, footer_y + 40), "• Expected: Dedicated My Claims page with 4 tabs, US date format (MM/DD/YYYY), FAQs, & Create Claim form.", fill=(34, 139, 34), font=font_sub)
draw.text((padding + 20, footer_y + 65), "• Actual: Claims routes not deployed; 302 redirect loop back to Dashboard, SUBMIT CLAIM button has dead link href='#'.", fill=(195, 30, 30), font=font_sub)

os.makedirs(os.path.dirname(out_path), exist_ok=True)
canvas.save(out_path, quality=95)
print(f"Comparison image saved: {out_path} (Size: {canvas.size})")

# Copy to artifacts
import shutil
shutil.copy(out_path, '/home/deepali/.gemini/antigravity-ide/brain/312ed68a-6b9a-4903-b00f-85f88631687a/COMPARISON_FIGMA_VS_LIVE_MY_CLAIMS.png')
print("Copied to artifacts")
