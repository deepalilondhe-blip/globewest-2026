import os
from PIL import Image, ImageDraw, ImageFont

# Workspace directories
ws_dir = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
out_dir = os.path.join(ws_dir, "Enable Public Browsing Mode")
artifact_dir = "/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c"

# Source images
figma_img_path = os.path.join(ws_dir, "Figma comparison", "Figma_Baseline_desktop_Category_Show_Filters.png")
staging_img_path = os.path.join(out_dir, "DEFECT_3_PRODUCT_CARDS_PLACEHOLDER_IMAGES.png")

# 1. Crop real product card from Figma
figma_full = Image.open(figma_img_path)
# On 1920x1080 Figma screenshot, let us crop the first product card under the filters
# In desktop/Category/Show Filters:
# Filter toolbar is at y=670 to 730
# Cards are at y=750 onwards, first card is x: 260 to 520
figma_card = figma_full.crop((260, 750, 530, 865))
# Let us resize figma_card to maintain nice proportions
w_figma, h_figma = figma_card.size

# Let us also load the PDP cushion from Figma node 2424-21417
figma_pdp = Image.open(os.path.join(out_dir, "FIGMA_NODE_2424_21417.png"))
# Cushion crop from desktop PDP artboard: x: 670 to 860, y: 180 to 450
cushion_crop = figma_pdp.crop((680, 180, 850, 390))

# 2. Crop placeholder card from Staging
staging_full = Image.open(staging_img_path)
# On 1440x900 Staging screenshot:
# First card photo is at x: 338 to 580, y: 400 to 650
# Let us crop the first product card cleanly
staging_card = staging_full.crop((330, 390, 590, 750))

# Create a beautiful Side-by-Side Comparison Canvas
# Width: 1200, Height: 700
canvas = Image.new("RGB", (1240, 720), "#0F172A")
draw = ImageDraw.Draw(canvas)

# Header Title
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_header = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
except:
    font_title = font_header = font_sub = ImageFont.load_default()

# Header text
draw.text((30, 24), "DEFECT 3: PRODUCT CARDS DISPLAY 'GW COMING SOON' PLACEHOLDERS", fill="#FFFFFF", font=font_title)
draw.text((30, 58), "Figma Design Specification vs. US Storefront Live Staging Audit", fill="#94A3B8", font=font_sub)

# Panel 1: Expected (Figma)
# x: 30 to 600, y: 95 to 680
draw.rectangle([30, 95, 605, 685], fill="#1E293B", outline="#10B981", width=3)
# Badge
draw.rectangle([30, 95, 605, 140], fill="#065F46")
draw.text((45, 108), "✅ EXPECTED: Approved Figma Spec (Real High-Res Imagery)", fill="#FFFFFF", font=font_header)

# Panel 2: Actual (Live Staging)
# x: 635 to 1210, y: 95 to 680
draw.rectangle([635, 95, 1210, 685], fill="#1E293B", outline="#EF4444", width=3)
# Badge
draw.rectangle([635, 95, 1210, 140], fill="#991B1B")
draw.text((650, 108), "❌ ACTUAL: US Staging Live (Defect: Fallback Placeholders)", fill="#FFFFFF", font=font_header)

# Sub-captions in panels
draw.text((45, 155), "Figma Category PLP & PDP: 100% Real Studio Product Photography", fill="#A7F3D0", font=font_sub)
draw.text((650, 155), "Staging PLP & PDP: Displays Generic 'GW Coming Soon' Placeholder", fill="#FECACA", font=font_sub)

# Place Staging Card on Right
target_w = 480
scale = target_w / staging_card.width
target_h = int(staging_card.height * scale)
staging_resized = staging_card.resize((target_w, target_h), Image.Resampling.LANCZOS)
canvas.paste(staging_resized, (680, 200))
draw.rectangle([680, 200, 680 + target_w, 200 + target_h], outline="#EF4444", width=3)

# Place Figma Cushion / Card on Left
# Let us resize cushion to fit nicely
target_c_w = 400
scale_c = target_c_w / cushion_crop.width
target_c_h = int(cushion_crop.height * scale_c)
cushion_resized = cushion_crop.resize((target_c_w, target_c_h), Image.Resampling.LANCZOS)
canvas.paste(cushion_resized, (115, 220))
draw.rectangle([115, 220, 115 + target_c_w, 220 + target_c_h], outline="#10B981", width=3)

# Add label below Figma card
draw.text((115, 220 + target_c_h + 15), "Product: Tepih Lane 45x45cm Cushion (Figma Node 2424-21417)", fill="#94A3B8", font=font_sub)
draw.text((115, 220 + target_c_h + 35), "Status: Real high-resolution photography synced from ERP", fill="#34D399", font=font_sub)

# Add label below Staging card
draw.text((680, 200 + target_h + 15), "Product: Artifact Small Floor Sculpture (US Staging Live)", fill="#94A3B8", font=font_sub)
draw.text((680, 200 + target_h + 35), "Asset: 230118_Image-Coming-Soon-2_1100x1100_1.jpg (Pending Sync)", fill="#F87171", font=font_sub)

# Save Comparison Image
out_cmp_1 = os.path.join(out_dir, "DEFECT_3_FIGMA_VS_STAGING_COMPARISON.png")
out_cmp_2 = os.path.join(artifact_dir, "DEFECT_3_FIGMA_VS_STAGING_COMPARISON.png")

canvas.save(out_cmp_1)
canvas.save(out_cmp_2)
print("Saved DEFECT_3_FIGMA_VS_STAGING_COMPARISON.png!")
