import os
from PIL import Image, ImageDraw, ImageFont

# Image paths
figma_full_path = 'Sprint-3/Ticket_Trade_Application_Form/figma/FIGMA_DESKTOP_TRADE_APPLICATION_FULL.png'
live_path = 'Sprint-3/Ticket_Trade_Application_Form/screenshots/live_retest/01_STEP1_PHONE_VALIDATION_RESULT.png'
out_dir = 'Sprint-3/Ticket_Trade_Application_Form/comparison'
os.makedirs(out_dir, exist_ok=True)

figma_img = Image.open(figma_full_path).convert('RGB')
live_img = Image.open(live_path).convert('RGB')

# 1. Figma Header Crop: x: 246 to 1480, y: 36 to 170 (Figma artboard header)
# In figma_img (1920x1080), the artboard is at x: 246, y: 36, width: 1440
figma_header = figma_img.crop((246, 36, 1480, 165)) # (1234, 129)

# 2. Live Header Crop: x: 0 to 1440, y: 0 to 165
live_header = live_img.crop((0, 0, 1440, 165)) # (1440, 165)

# Resize to consistent 1200px width
figma_header_resized = figma_header.resize((1200, int(1200 * figma_header.height / figma_header.width)), Image.Resampling.LANCZOS)
live_header_resized = live_header.resize((1200, int(1200 * live_header.height / live_header.width)), Image.Resampling.LANCZOS)

# Create zoomed-in crop of navigation bar around In Stock / Customisation / Projects
# On live_img (1440 width), 'Customisation' is at x: 672, y: 98, width: 100, height: 68
# Let's crop x: 450 to 950, y: 100 to 165
live_nav_zoom = live_img.crop((460, 105, 960, 160)).resize((700, 100), Image.Resampling.LANCZOS)

# On figma_img, artboard starts at 246. Nav items: In Stock is at ~x: 770, Projects is at ~x: 880
figma_nav_zoom = figma_img.crop((650, 105, 1150, 160)).resize((700, 100), Image.Resampling.LANCZOS)

# Build canvas: 1300 x 950
W, H = 1300, 950
canvas = Image.new('RGB', (W, H), '#0F172A')
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    font_header = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
    font_item = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    font_bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
except Exception:
    font_title = font_sub = font_header = font_badge = font_item = font_bold = ImageFont.load_default()

# Header text
draw.text((30, 20), "DEFECT LOCATION & FIGMA COMPARISON: 'CUSTOMISATION' SPELLING LEAK", fill='#FFFFFF', font=font_title)
draw.text((30, 52), "Location: Main Header Navigation Bar (5th Menu Item between 'In Stock' and 'Projects')", fill='#94A3B8', font=font_sub)

# Section 1: Figma Approved Design
draw.rectangle([(30, 85), (1270, 260)], fill='#022C22', outline='#10B981', width=3)
draw.text((45, 95), "🟢 FIGMA APPROVED SPECIFICATION (Header Navigation):", fill='#34D399', font=font_header)
draw.text((45, 120), "Nav items: Indoor  |  Outdoor  |  Homewares  |  In Stock  |  Projects  |  Inspiration  |  Support  |  Contact", fill='#A7F3D0', font=font_item)
draw.text((45, 140), "(Figma does NOT have AU 'Customisation' link; in US English standard, spelling must be 'Customization' with 'z')", fill='#6EE7B7', font=font_sub)
canvas.paste(figma_header_resized, (50, 165))

# Section 2: Live US Storefront with Highlight
draw.rectangle([(30, 280), (1270, 480)], fill='#1E293B', outline='#EF4444', width=3)
draw.text((45, 290), "🔴 LIVE US STOREFRONT (mcstaging2.globewest.com) - ACTUAL DEFECT:", fill='#F87171', font=font_header)
draw.text((45, 315), "Live Nav: Indoor  |  Outdoor  |  Homewares  |  In Stock  |  [ Customisation ]  |  Projects  |  Inspiration", fill='#FECACA', font=font_item)
canvas.paste(live_header_resized, (50, 340))

# Highlight 'Customisation' on the live header pasted at (50, 340):
# In live_img (1440w), Customisation is at x=672. In resized 1200w, x = 672 * (1200/1440) = 560
# Paste offset is x=50, y=340. Top of nav is ~y=115 in 1440, in resized: 115 * (1200/1440) = 96.
# So box is x: 50 + 550 = 600, y: 340 + 80 = 420.
cx1, cy1, cx2, cy2 = 600, 420, 700, 465
draw.rectangle([(cx1, cy1), (cx2, cy2)], outline='#EF4444', width=3)
draw.rectangle([(cx1 - 10, cy1 - 22), (cx2 + 10, cy1)], fill='#EF4444')
draw.text((cx1 - 5, cy1 - 18), "DEFECT: AU SPELLING", fill='#FFFFFF', font=font_badge)

# Section 3: Side-by-Side Zoomed Comparison
draw.rectangle([(30, 500), (1270, 770)], fill='#0F172A', outline='#38BDF8', width=2)
draw.text((45, 515), "🔍 CLOSE-UP COMPARISON: IN STOCK / PROJECTS SECTION", fill='#38BDF8', font=font_header)

# Left close-up: Figma
draw.text((60, 545), "FIGMA SPEC: 'In Stock' → 'Projects' (No AU Link)", fill='#34D399', font=font_bold)
draw.rectangle([(58, 570), (642, 690)], outline='#10B981', width=2)
figma_zoom_fit = figma_nav_zoom.resize((580, 116), Image.Resampling.LANCZOS)
canvas.paste(figma_zoom_fit, (60, 572))

# Right close-up: Live Storefront
draw.text((680, 545), "LIVE STOREFRONT: Leaking AU 'Customisation' with 's'", fill='#F87171', font=font_bold)
draw.rectangle([(678, 570), (1262, 690)], outline='#EF4444', width=2)
live_zoom_fit = live_nav_zoom.resize((580, 116), Image.Resampling.LANCZOS)
canvas.paste(live_zoom_fit, (680, 572))

# Draw red callout box on right close-up around 'Customisation'
# live_nav_zoom crops x: 460 to 960 (width 500). 'Customisation' is at 672 - 460 = 212.
# In 580w, x = 212 * (580/500) = 246.
zx1 = 680 + 235
zy1 = 572 + 25
zx2 = zx1 + 140
zy2 = zy1 + 65
draw.rectangle([(zx1, zy1), (zx2, zy2)], outline='#EF4444', width=3)
draw.rectangle([(zx1, zy1 - 20), (zx2, zy1)], fill='#EF4444')
draw.text((zx1 + 10, zy1 - 16), "AU SPELLING ('s')", fill='#FFFFFF', font=font_badge)

# Section 4: Defect Explanation & Fix Required
draw.rectangle([(30, 790), (1270, 930)], fill='#1E293B', outline='#64748B', width=1)
draw.text((45, 805), "📋 DEFECT EXPLANATION & EXACT DEVELOPER FIX REQUIRED:", fill='#F8FAFC', font=font_bold)
draw.text((45, 830), "• Defect Location: Header Navigation Bar, position #5 (between 'In Stock' and 'Projects').", fill='#CBD5E1', font=font_item)
draw.text((45, 852), "• Expected (US Storefront): American English spelling 'Customization' (with 'z') or match approved Figma menu.", fill='#34D399', font=font_item)
draw.text((45, 874), "• Actual Live (mcstaging2): Inherited Australian Magento theme spelling 'Customisation' (with 's') linking to /customisation.", fill='#F87171', font=font_item)
draw.text((45, 896), "• Severity & Action: Medium severity branding leak. Dev must update navigation title & URL slug to US English 'Customization'.", fill='#CBD5E1', font=font_item)

out_file = os.path.join(out_dir, 'DEFECT_LOCATION_CUSTOMISATION_COMPARISON.png')
canvas.save(out_file, quality=95)
print(f"Successfully created: {out_file}")
