import os
from PIL import Image, ImageDraw, ImageFont

ws_dir = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
figma_dir = os.path.join(ws_dir, "PLP page/screenshots/figma_deep_inspect")
live_dir = os.path.join(ws_dir, "PLP page/screenshots/micro_ui_audit")
out_dir = os.path.join(ws_dir, "PLP page/screenshots/individual_comparisons")
os.makedirs(out_dir, exist_ok=True)

# Fonts
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_body_b = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
except Exception:
    font_title = font_badge = font_body = font_body_b = ImageFont.load_default()

# Source Images
im_w450_f = Image.open(os.path.join(figma_dir, "07_FIGMA_W450_DIMENSIONS_PROPERTIES.png"))
im_price_f = Image.open(os.path.join(figma_dir, "08_FIGMA_PRICE_PROPERTIES.png"))
im_cart_f = Image.open(os.path.join(figma_dir, "09_FIGMA_ADD_TO_CART_PROPERTIES.png"))
im_title_f = Image.open(os.path.join(figma_dir, "10_FIGMA_TITLE_PROPERTIES.png"))
im_stock_f = Image.open(os.path.join(figma_dir, "11_FIGMA_STOCK_ETA_PROPERTIES.png"))
im_head_f = Image.open(os.path.join(figma_dir, "13_FIGMA_HEADER_UTILITY_PROPERTIES.png"))
im_live_buybox = Image.open(os.path.join(live_dir, "03_LIVE_PDP_BUY_BOX_CLOSEUP.png"))
im_plp_figma = Image.open(os.path.join(ws_dir, "PLP page/screenshots/figma_comparison/03_FIGMA_COMPARE_CLOSEUP_ZOOM.png"))
im_plp_live = Image.open(os.path.join(live_dir, "01_LIVE_COMPARE_BOX_HIGHLIGHTED.png"))

def build_card(title_text, figma_crop, live_crop, figma_bullets, live_bullets, bottom_alert, out_filename):
    W, H = 1200, 520
    card = Image.new("RGB", (W, H), "#0F172A")
    draw = ImageDraw.Draw(card)
    
    # Title
    draw.text((30, 20), title_text, fill="#FFFFFF", font=font_title)
    
    # Left box: Figma
    draw.rectangle([(30, 60), (585, H - 65)], outline="#10B981", width=2)
    draw.rectangle([(30, 60), (585, 95)], fill="#065F46")
    draw.text((40, 70), "🟢 APPROVED FIGMA SPEC (INSPECT PANEL)", fill="#FFFFFF", font=font_badge)
    if figma_crop:
        card.paste(figma_crop, (40, 105))
    
    # Left bullets
    y_text = 295
    for i, b in enumerate(figma_bullets):
        draw.text((40, y_text + (i * 20)), b, fill="#34D399", font=font_body)
        
    # Right box: Live
    draw.rectangle([(615, 60), (1170, H - 65)], outline="#EF4444", width=2)
    draw.rectangle([(615, 60), (1170, 95)], fill="#991B1B")
    draw.text((625, 70), "🔴 LIVE MCSTAGING2 ACTUAL (COMPUTED STYLES)", fill="#FFFFFF", font=font_badge)
    if live_crop:
        card.paste(live_crop, (625, 105))
        
    # Right bullets
    for i, b in enumerate(live_bullets):
        draw.text((625, y_text + (i * 20)), b, fill="#F87171", font=font_body)
        
    # Bottom alert bar
    draw.rectangle([(30, H - 55), (1170, H - 15)], fill="#1E293B", outline="#475569")
    draw.text((45, H - 43), bottom_alert, fill="#FBBF24", font=font_body_b)
    
    save_path = os.path.join(out_dir, out_filename)
    card.save(save_path, quality=95)
    print(f"Saved: {save_path}")

# 1. Dimensions Subtitle
crop_f1 = im_w450_f.crop((1610, 80, 1850, 420)).resize((320, 175), Image.Resampling.LANCZOS)
crop_l1 = im_live_buybox.crop((10, 140, 390, 240)).resize((360, 110), Image.Resampling.LANCZOS)
build_card(
    "ITEM 1: PRODUCT DIMENSIONS SUBTITLE (W450 x H450mm)",
    crop_f1, crop_l1,
    [
        "• Layout: Width: 109px | Height: 21px | Opacity: 80%",
        "• Typography: Proxima Nova Regular 400 | Size: 14px",
        "• Line Height: 150% (21px) | Static text under title"
    ],
    [
        "• Layout: Option dropdown selector W178.31px x H48px",
        "• Label: 'Choose an Option...' dropdown input",
        "• Opacity: 100% (No 80% opacity applied)"
    ],
    "⚠️ MISMATCH: Static subtitle text replaced by interactive dropdown; 80% opacity missing.",
    "COMPARISON_01_DIMENSIONS_SUBTITLE.png"
)

# 2. Product Title Typography
crop_f2 = im_title_f.crop((1610, 80, 1850, 420)).resize((320, 175), Image.Resampling.LANCZOS)
crop_l2 = im_live_buybox.crop((10, 90, 390, 150)).resize((360, 75), Image.Resampling.LANCZOS)
build_card(
    "ITEM 2: PRODUCT TITLE (H1 HEADING TYPOGRAPHY)",
    crop_f2, crop_l2,
    [
        "• Font: IvyMode Regular 400 | Size: 26px",
        "• Line Height: 120% (31.2px) | Letter Spacing: 0px",
        "• Color: #381C12 (Cherry Chocolate)"
    ],
    [
        "• Font: IvyMode Regular 400 | Size: 26px",
        "• Line Height: 40px (+8.8px excessive spacing!)",
        "• Letter Spacing: 0.8px (Stretched spacing defect)"
    ],
    "🔴 DEFECT: Line Height is 40px (+8.8px taller than 31.2px); Letter Spacing is 0.8px vs 0px.",
    "COMPARISON_02_PRODUCT_TITLE.png"
)

# 3. Add to Cart CTA Button
crop_f3 = im_cart_f.crop((1610, 80, 1850, 450)).resize((320, 175), Image.Resampling.LANCZOS)
crop_l3 = im_live_buybox.crop((10, 605, 390, 665)).resize((380, 65), Image.Resampling.LANCZOS)
build_card(
    "ITEM 3: ADD TO CART CTA BUTTON (FONT WEIGHT & LETTER SPACING)",
    crop_f3, crop_l3,
    [
        "• Typography: Proxima Nova Semibold 600 | Size: 14px",
        "• Letter Spacing: 0.25px | Button: 330px x 50px",
        "• Label: 'Add to cart' (Title Case)"
    ],
    [
        "• Typography: Proxima Nova Regular 400 (Missing Semibold!)",
        "• Letter Spacing: 1px (4x wider than spec!)",
        "• Label: 'ADD TO CART' (All Uppercase)"
    ],
    "🔴 DEFECT: Font Weight is 400 Regular instead of 600 Semibold; Letter Spacing is 1px vs 0.25px.",
    "COMPARISON_03_ADD_TO_CART_BUTTON.png"
)

# 4. Add to Quote CTA Button
crop_f4 = im_stock_f.crop((430, 345, 625, 410)).resize((320, 100), Image.Resampling.LANCZOS)
crop_l4 = im_live_buybox.crop((10, 675, 390, 735)).resize((380, 65), Image.Resampling.LANCZOS)
build_card(
    "ITEM 4: ADD TO QUOTE CTA BUTTON (COPY & STYLING)",
    crop_f4, crop_l4,
    [
        "• Content Label: 'ADD TO QUOTE' (Clean 3-word action)",
        "• Font: Proxima Nova Semibold 600 | Size: 14px",
        "• Border: 1px solid #381C12 outline button"
    ],
    [
        "• Content Label: 'ADD TO QUOTE / HOLD' (Extra '/ HOLD' text)",
        "• Font: Proxima Nova Regular 400 (Missing Semibold!)",
        "• Border: 1px solid rgb(56, 28, 18)"
    ],
    "🔴 DEFECT: Unapproved '/ HOLD' text appended to button; Font Weight is 400 vs 600.",
    "COMPARISON_04_ADD_TO_QUOTE_BUTTON.png"
)

# 5. Stock & Incoming Shipment Schedule
crop_f5 = im_stock_f.crop((430, 415, 625, 480)).resize((320, 100), Image.Resampling.LANCZOS)
crop_l5 = im_live_buybox.crop((10, 740, 390, 800)).resize((380, 65), Image.Resampling.LANCZOS)
build_card(
    "ITEM 5: STOCK & INCOMING SHIPMENT ETA LOGIC (FOUR HANDS MODEL)",
    crop_f5, crop_l5,
    [
        "• Primary Line: 'ETA 14 Mar 2027 (8 available)' with quantity",
        "• Secondary Line: 'Next Shipment: 8 (ETA 14 Mar 2027)'",
        "• Action: Pinned '🔔 Notify me' bell icon"
    ],
    [
        "• Primary Line: Generic '⚠️ Enquire for ETA' only",
        "• Quantity: Completely MISSING (no available stock count)",
        "• Secondary Line: Completely MISSING (no next shipment)"
    ],
    "🚨 P2 DEFECT: Available quantity count and secondary incoming shipment lines are completely missing.",
    "COMPARISON_05_STOCK_ETA_SCHEDULE.png"
)

# 6. Header Utility Bar
crop_f6 = im_head_f.crop((1610, 80, 1850, 420)).resize((320, 175), Image.Resampling.LANCZOS)
crop_l6 = im_live_buybox.crop((200, 0, 400, 30)).resize((300, 45), Image.Resampling.LANCZOS)
build_card(
    "ITEM 6: HEADER UTILITY BAR (SHOWROOM BOOKING LINK & FONT SIZE)",
    crop_f6, crop_l6,
    [
        "• Content Text: 'Book Showroom Appointment'",
        "• Typography: Proxima Nova Regular 400 | Size: 16px",
        "• Line Height: 160% (25.6px)"
    ],
    [
        "• Content Text: 'Book Showroom Visit' (Altered copy)",
        "• Typography: Proxima Nova Regular 400 | Size: 13px (-3px smaller)",
        "• Line Height: 18px"
    ],
    "🔴 DEFECT: Font Size is 13px vs Figma 16px; Copy altered from 'Appointment' to 'Visit'.",
    "COMPARISON_06_HEADER_UTILITY_BAR.png"
)

# 7. PLP Product Card & Compare Box
crop_f7 = Image.open(os.path.join(ws_dir, "scratch_card1_figma_full.png")).resize((175, 175), Image.Resampling.LANCZOS)
crop_l7 = Image.open(os.path.join(live_dir, "02_LIVE_PRODUCT_CARD_CLOSEUP.png")).resize((175, 175), Image.Resampling.LANCZOS)
build_card(
    "ITEM 7: PRODUCT CARD & COMPARE CHECKBOX (PLP CATEGORY GRID)",
    crop_f7, crop_l7,
    [
        "• Checkbox Box: Width 16px | Height 16px | Radius 2px",
        "• Wishlist Heart: Pinned top-right corner opposite Compare",
        "• Badge & Image: 'Customize' (US spelling) + Real Photography"
    ],
    [
        "• Checkbox Box: Width 18px | Height 18px | Radius 4px",
        "• Wishlist Heart: Completely MISSING on product cards",
        "• Badge & Image: 'Customisable' (AU spelling) + 'GW Coming Soon'"
    ],
    "🔴 DEFECTS: Wishlist Heart missing on cards; 'Customisable' has AU spelling; Placeholder image shown.",
    "COMPARISON_07_PLP_CARD_AND_COMPARE.png"
)

print("All 7 comparison cards generated successfully!")
