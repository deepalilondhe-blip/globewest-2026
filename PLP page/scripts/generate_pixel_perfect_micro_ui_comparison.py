import os
from PIL import Image, ImageDraw, ImageFont

# Directories
ws_dir = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
figma_dir = os.path.join(ws_dir, "PLP page/screenshots/figma_deep_inspect")
live_dir = os.path.join(ws_dir, "PLP page/screenshots/micro_ui_audit")
out_dir = os.path.join(ws_dir, "PLP page/screenshots/figma_comparison")
os.makedirs(out_dir, exist_ok=True)

# Canvas: 1600 x 2450
W, H = 1600, 2450
canvas = Image.new("RGB", (W, H), "#0F172A")
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_sec = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
    font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_body_b = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
except Exception:
    font_title = font_sub = font_sec = font_badge = font_body = font_body_b = ImageFont.load_default()

# Header Banner
draw.text((30, 22), "GLOBEWEST QA: FIGMA INSPECT SPECS VS. LIVE MCSTAGING2 MICRO-UI AUDIT", fill="#FFFFFF", font=font_title)
draw.text((30, 58), "Comprehensive Pixel-Level Size, Typography, Opacity, and DOM Layout Inspection", fill="#94A3B8", font=font_sub)

# Load Source Images
im_w450_figma = Image.open(os.path.join(figma_dir, "07_FIGMA_W450_DIMENSIONS_PROPERTIES.png"))
im_price_figma = Image.open(os.path.join(figma_dir, "08_FIGMA_PRICE_PROPERTIES.png"))
im_cart_figma = Image.open(os.path.join(figma_dir, "09_FIGMA_ADD_TO_CART_PROPERTIES.png"))
im_title_figma = Image.open(os.path.join(figma_dir, "10_FIGMA_TITLE_PROPERTIES.png"))
im_stock_figma = Image.open(os.path.join(figma_dir, "11_FIGMA_STOCK_ETA_PROPERTIES.png"))
im_header_figma = Image.open(os.path.join(figma_dir, "13_FIGMA_HEADER_UTILITY_PROPERTIES.png"))

im_live_buybox = Image.open(os.path.join(live_dir, "03_LIVE_PDP_BUY_BOX_CLOSEUP.png"))

# =========================================================================
# HELPER: Draw Clean Multi-Row Card
# =========================================================================
def draw_panel(y_top, height, number_title, figma_crop, live_crop, figma_text_lines, live_text_lines, mismatch_summary):
    # Outer panel container
    draw.rectangle([(30, y_top), (W - 30, y_top + height)], fill="#1E293B", outline="#475569", width=2)
    
    # Title Header
    draw.text((45, y_top + 10), number_title, fill="#F8FAFC", font=font_sec)
    
    # Left box (Figma Approved Spec)
    draw.rectangle([(45, y_top + 38), (780, y_top + height - 48)], outline="#10B981", width=2)
    draw.rectangle([(45, y_top + 38), (780, y_top + 65)], fill="#065F46")
    draw.text((55, y_top + 45), "🟢 FIGMA APPROVED SPEC (PROPERTIES PANEL)", fill="#FFFFFF", font=font_badge)
    
    # Figma image crop (max height 140)
    if figma_crop:
        canvas.paste(figma_crop, (55, y_top + 72))
    
    # Figma text lines (placed cleanly below crop)
    text_y = y_top + 225
    for i, line in enumerate(figma_text_lines):
        draw.text((55, text_y + (i * 20)), line, fill="#34D399", font=font_body)
    
    # Right box (Live Staging Actual)
    draw.rectangle([(810, y_top + 38), (W - 45, y_top + height - 48)], outline="#EF4444", width=2)
    draw.rectangle([(810, y_top + 38), (W - 45, y_top + 65)], fill="#991B1B")
    draw.text((820, y_top + 45), "🔴 LIVE MCSTAGING2 ACTUAL (COMPUTED STYLES)", fill="#FFFFFF", font=font_badge)
    
    # Live image crop
    if live_crop:
        canvas.paste(live_crop, (820, y_top + 72))
        
    for i, line in enumerate(live_text_lines):
        draw.text((820, text_y + (i * 20)), line, fill="#F87171", font=font_body)

    # Bottom summary bar
    draw.rectangle([(30, y_top + height - 40), (W - 30, y_top + height)], fill="#0F172A")
    draw.text((45, y_top + height - 28), mismatch_summary, fill="#FBBF24", font=font_body_b)


# -------------------------------------------------------------------------
# ROW 1: PRODUCT DIMENSIONS SUBTITLE (W450 x H450mm)
# -------------------------------------------------------------------------
crop_f_w450 = im_w450_figma.crop((1610, 80, 1850, 420)).resize((260, 140), Image.Resampling.LANCZOS)
crop_l_w450 = im_live_buybox.crop((10, 140, 390, 240)).resize((300, 90), Image.Resampling.LANCZOS)

draw_panel(
    y_top=95,
    height=370,
    number_title="1. PRODUCT DIMENSIONS SUBTITLE (W450 x H450mm)",
    figma_crop=crop_f_w450,
    live_crop=crop_l_w450,
    figma_text_lines=[
        "• Layout: Width 109px | Height 21px | Opacity 80%",
        "• Typography: Proxima Nova Regular 400 | Size 14px | Line Height 150% (21px)",
        "• Presentation: Pinned static text subtitle directly below product title."
    ],
    live_text_lines=[
        "• Layout: Dropdown component W178.31px x H48px with 'Choose an Option...'",
        "• Typography: Dropdown select input with 0px opacity reduction (100% opacity).",
        "• Discrepancy: Figma specifies static dimension subtitle; Live renders option dropdown."
    ],
    mismatch_summary="⚠️ MISMATCH: Static subtitle text vs Dropdown element; Opacity 80% missing on live staging."
)

# -------------------------------------------------------------------------
# ROW 2: PRODUCT TITLE TYPOGRAPHY
# -------------------------------------------------------------------------
crop_f_title = im_title_figma.crop((1610, 80, 1850, 420)).resize((260, 140), Image.Resampling.LANCZOS)
crop_l_title = im_live_buybox.crop((10, 90, 390, 150)).resize((300, 60), Image.Resampling.LANCZOS)

draw_panel(
    y_top=485,
    height=370,
    number_title="2. PRODUCT TITLE TYPOGRAPHY (IvyMode Serif Heading)",
    figma_crop=crop_f_title,
    live_crop=crop_l_title,
    figma_text_lines=[
        "• Font: IvyMode Regular 400 | Size: 26px | Line Height: 120% (31.2px)",
        "• Letter Spacing: 0px exact",
        "• Color: #381C12 (Brand Cherry Chocolate)"
    ],
    live_text_lines=[
        "• Font: IvyMode Regular 400 | Size: 26px | Line Height: 40px (+8.8px taller!)",
        "• Letter Spacing: 0.8px (+0.8px stretched spacing defect)",
        "• Color: rgb(56, 28, 18) (#381C12)"
    ],
    mismatch_summary="🔴 DEFECT: Line Height overextended by 8.8px (40px vs 31.2px) & Letter Spacing stretched by +0.8px."
)

# -------------------------------------------------------------------------
# ROW 3: ADD TO CART CTA BUTTON
# -------------------------------------------------------------------------
crop_f_cart = im_cart_figma.crop((1610, 80, 1850, 450)).resize((260, 140), Image.Resampling.LANCZOS)
# Actual ADD TO CART button on live: y from 605 to 665
crop_l_cart = im_live_buybox.crop((10, 605, 390, 665)).resize((320, 55), Image.Resampling.LANCZOS)

draw_panel(
    y_top=875,
    height=370,
    number_title="3. ADD TO CART CTA BUTTON (Typography & Font Weight)",
    figma_crop=crop_f_cart,
    live_crop=crop_l_cart,
    figma_text_lines=[
        "• Typography: Proxima Nova Semibold 600 | Size: 14px",
        "• Letter Spacing: 0.25px | Text: 'Add to cart' (Title Case)",
        "• Button Layout: Width 330px | Height 50px"
    ],
    live_text_lines=[
        "• Typography: Proxima Nova Regular 400 (Missing Semibold!) | Size: 15px",
        "• Letter Spacing: 1px (Overextended) | Text: 'ADD TO CART' (All Uppercase)",
        "• Button Layout: Width 330px | Height 50px | Border Radius 2px"
    ],
    mismatch_summary="🔴 DEFECT: Font Weight is 400 (Regular) instead of 600 (Semibold); Letter Spacing is 1px vs 0.25px."
)

# -------------------------------------------------------------------------
# ROW 4: ADD TO QUOTE CTA BUTTON
# -------------------------------------------------------------------------
crop_f_quote = im_stock_figma.crop((430, 345, 625, 410)).resize((280, 80), Image.Resampling.LANCZOS)
# Actual ADD TO QUOTE button on live: y from 675 to 735
crop_l_quote = im_live_buybox.crop((10, 675, 390, 735)).resize((320, 55), Image.Resampling.LANCZOS)

draw_panel(
    y_top=1265,
    height=370,
    number_title="4. ADD TO QUOTE CTA BUTTON (Copy & Additional Text)",
    figma_crop=crop_f_quote,
    live_crop=crop_l_quote,
    figma_text_lines=[
        "• Content Label: 'ADD TO QUOTE' (Clean 3-word action)",
        "• Typography: Proxima Nova Semibold 600 | Size: 14px | Letter Spacing: 0.25px",
        "• Border: 1px solid #381C12 | Outline button style"
    ],
    live_text_lines=[
        "• Content Label: 'ADD TO QUOTE / HOLD' (Polluted with unapproved '/ HOLD')",
        "• Typography: Proxima Nova Regular 400 | Size: 14px",
        "• Border: 1px solid rgb(56, 28, 18)"
    ],
    mismatch_summary="🔴 DEFECT: Non-spec copy '/ HOLD' appended to button label; Font Weight is 400 vs 600."
)

# -------------------------------------------------------------------------
# ROW 5: STOCK / ETA INCOMING SHIPMENT NOTIFICATION
# -------------------------------------------------------------------------
crop_f_stock = im_stock_figma.crop((430, 415, 625, 480)).resize((280, 85), Image.Resampling.LANCZOS)
# Actual ETA notification on live: y from 740 to 800
crop_l_stock = im_live_buybox.crop((10, 740, 390, 800)).resize((320, 55), Image.Resampling.LANCZOS)

draw_panel(
    y_top=1655,
    height=370,
    number_title="5. STOCK & INCOMING SHIPMENT ETA LOGIC (Four Hands Model)",
    figma_crop=crop_f_stock,
    live_crop=crop_l_stock,
    figma_text_lines=[
        "• Primary Line: 'ETA 14 Mar 2027 (8 available)' with quantity count",
        "• Secondary Line: 'Next Shipment: 8 (ETA 14 Mar 2027)'",
        "• Action: Pinned '🔔 Notify me' icon button on the right."
    ],
    live_text_lines=[
        "• Primary Line: Generic '⚠️ Enquire for ETA' only.",
        "• Quantity Count: Completely MISSING (no available stock count in brackets).",
        "• Secondary Line: Completely MISSING (no incoming shipment date/count)."
    ],
    mismatch_summary="🚨 P2 DEFECT: Available quantity and secondary incoming shipment lines are completely missing on Live."
)

# -------------------------------------------------------------------------
# ROW 6: HEADER UTILITY BAR
# -------------------------------------------------------------------------
crop_f_head = im_header_figma.crop((1610, 80, 1850, 420)).resize((260, 140), Image.Resampling.LANCZOS)
crop_l_head = im_live_buybox.crop((200, 0, 400, 30)).resize((240, 35), Image.Resampling.LANCZOS)

draw_panel(
    y_top=2045,
    height=370,
    number_title="6. HEADER UTILITY BAR (Showroom Booking Link & Font Size)",
    figma_crop=crop_f_head,
    live_crop=crop_l_head,
    figma_text_lines=[
        "• Content Text: 'Book Showroom Appointment'",
        "• Typography: Proxima Nova Regular 400 | Size: 16px | Line Height: 160% (25.6px)",
        "• Color: #FFFFFF on dark utility bar"
    ],
    live_text_lines=[
        "• Content Text: 'Book Showroom Visit' (Altered copy)",
        "• Typography: Proxima Nova Regular 400 | Size: 13px (-3px smaller than Figma!)",
        "• Color: rgb(255, 255, 255)"
    ],
    mismatch_summary="🔴 DEFECT: Font Size is 13px vs Figma 16px; Copy is 'Book Showroom Visit' vs 'Book Showroom Appointment'."
)

# Save Final
out_img_path = os.path.join(out_dir, "FIGMA_INSPECT_VS_LIVE_COMPUTED_STYLES_MISMATCHES.png")
canvas.save(out_img_path, quality=95)
print(f"Saved pixel-perfect comparison to: {out_img_path}")
