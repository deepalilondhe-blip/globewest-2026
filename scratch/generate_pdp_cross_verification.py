import os
from PIL import Image, ImageDraw, ImageFont

ws_dir = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
out_dir = os.path.join(ws_dir, "Enable Public Browsing Mode")
artifact_dir = "/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c"

# Load 100% scale Figma PDP
figma_100 = Image.open(os.path.join(out_dir, "FIGMA_PDP_100PERCENT.png"))
# In 1920x1080:
# Cushion photo + action details: x: 260 to 850, y: 0 to 650
# Let us crop the main product presentation area
figma_crop = figma_100.crop((260, 0, 840, 650))

# Load Staging Live PDP
staging_pdp = Image.open(os.path.join(out_dir, "DEFECT_2_MISSING_TRADE_LOGIN_GUIDANCE_PDP.png"))
# Staging is 1440x900:
# Main photo + info panel: x: 40 to 1400, y: 220 to 860
staging_crop = staging_pdp.crop((40, 220, 1400, 860))

# Create side-by-side comparison image: 1360 x 800
canvas = Image.new("RGB", (1360, 800), "#0B1120")
draw = ImageDraw.Draw(canvas)

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
except:
    font_title = font_badge = font_body = font_bold = ImageFont.load_default()

# Top Header Title
draw.text((30, 20), "PDP CROSS-VERIFICATION: FIGMA SPECIFICATION VS. US STAGING WEBSITE", fill="#F8FAFC", font=font_title)
draw.text((30, 50), "Ticket: Enable Public Browsing Mode | Target: Product Detail Page (PDP) | Reference: Figma Node 2424-21417", fill="#94A3B8", font=font_body)

# Left Panel: Approved Figma Spec (Expected)
# Box: x: 30 to 665, y: 85 to 765
draw.rectangle([30, 85, 665, 765], fill="#1E293B", outline="#10B981", width=3)
draw.rectangle([30, 85, 665, 130], fill="#065F46")
draw.text((45, 96), "🟢 EXPECTED: Approved Figma Spec (Node 2424-21417)", fill="#FFFFFF", font=font_badge)

# Resize & paste Figma crop
f_w = 600
scale_f = f_w / figma_crop.width
f_h = int(figma_crop.height * scale_f)
if f_h > 460:
    f_h = 460
    f_w = int(figma_crop.width * (f_h / figma_crop.height))
figma_resized = figma_crop.resize((f_w, f_h), Image.Resampling.LANCZOS)
canvas.paste(figma_resized, (45, 145))
draw.rectangle([45, 145, 45 + f_w, 145 + f_h], outline="#10B981", width=2)

# Figma key findings
draw.text((45, 630), "• Real Studio Photography: Full high-res cushion imagery synced from catalog", fill="#A7F3D0", font=font_bold)
draw.text((45, 655), "• Guest Mode Rule: 'No pricing is visible in this view. A customer has to log in to see pricing.'", fill="#E2E8F0", font=font_body)
draw.text((45, 680), "• CTA Placement: No button in price area; relies on top bar 'Become a Trade Customer'", fill="#E2E8F0", font=font_body)
draw.text((45, 705), "• Trade Mode: Displays Trade Price + MSRP, Qty selector, and [Add to Cart] button", fill="#E2E8F0", font=font_body)

# Right Panel: Live US Staging (Actual)
# Box: x: 695 to 1330, y: 85 to 765
draw.rectangle([695, 85, 1330, 765], fill="#1E293B", outline="#EF4444", width=3)
draw.rectangle([695, 85, 1330, 130], fill="#991B1B")
draw.text((710, 96), "🔴 ACTUAL: US Staging Website (mcstaging2.globewest.com)", fill="#FFFFFF", font=font_badge)

# Resize & paste Staging crop
s_w = 600
scale_s = s_w / staging_crop.width
s_h = int(staging_crop.height * scale_s)
if s_h > 460:
    s_h = 460
    s_w = int(staging_crop.width * (s_h / staging_crop.height))
staging_resized = staging_crop.resize((s_w, s_h), Image.Resampling.LANCZOS)
canvas.paste(staging_resized, (710, 145))
draw.rectangle([710, 145, 710 + s_w, 145 + s_h], outline="#EF4444", width=2)

# Staging key findings
draw.text((710, 630), "• Fallback Placeholder: Shows 'GW Coming Soon' (230118_Image-Coming-Soon-2.jpg)", fill="#F87171", font=font_bold)
draw.text((710, 655), "• Price & Cart Masking: $0.00 price leakage; Add to Cart removed (Matches Figma)", fill="#4ADE80", font=font_bold)
draw.text((710, 680), "• Empty Price Area: No guidance prompt; matches Figma layout (Logged as P3 UX item)", fill="#FDE047", font=font_body)
draw.text((710, 705), "• Trade Purchasing: Verified working for authenticated B2B trade accounts", fill="#4ADE80", font=font_body)

# Save
file_out1 = os.path.join(out_dir, "PDP_FIGMA_VS_WEBSITE_CROSS_VERIFICATION.png")
file_out2 = os.path.join(artifact_dir, "PDP_FIGMA_VS_WEBSITE_CROSS_VERIFICATION.png")
canvas.save(file_out1)
canvas.save(file_out2)
print("Saved PDP_FIGMA_VS_WEBSITE_CROSS_VERIFICATION.png!")
