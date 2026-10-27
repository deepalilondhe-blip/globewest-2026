import os
import shutil
from PIL import Image, ImageDraw, ImageFont

ws_dir = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
figma_dir = os.path.join(ws_dir, "PLP page/screenshots/figma_deep_inspect")
live_dir = os.path.join(ws_dir, "PLP page/screenshots/micro_ui_audit")
out_dir = os.path.join(ws_dir, "PLP page/screenshots")
artifact_dir = "/home/deepali/.gemini/antigravity-ide/brain/312ed68a-6b9a-4903-b00f-85f88631687a"

# Canvas: 1600 x 3360
W, H = 1600, 3360
canvas = Image.new("RGB", (W, H), "#080E1A")
draw = ImageDraw.Draw(canvas)

# Fonts
font_main_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
font_sec = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
font_body_b = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
font_footer = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)

# Top Header Banner
draw.rectangle([(0, 0), (W, 95)], fill="#0F172A")
draw.rectangle([(0, 93), (W, 95)], fill="#3B82F6")
draw.text((30, 16), "GLOBEWEST US STOREFRONT: COMPLETE MASTER DEFECT EVIDENCE REPORT", fill="#FFFFFF", font=font_main_title)
draw.text((30, 52), "Pre-Go-Live Comprehensive QA Defect Audit • 8 Verified Functional & Pixel-Perfect Micro-UI Discrepancies", fill="#94A3B8", font=font_sub)

# Stat Pills in Header
stat_x = 1120
draw.rectangle([(stat_x, 24), (stat_x + 130, 68)], fill="#7F1D1D", outline="#EF4444", width=1)
draw.text((stat_x + 12, 32), "1 BLOCKER", fill="#FCA5A5", font=font_badge)
draw.text((stat_x + 12, 48), "P1 High Defect", fill="#FECACA", font=font_footer)

stat_x += 140
draw.rectangle([(stat_x, 24), (stat_x + 130, 68)], fill="#991B1B", outline="#F87171", width=1)
draw.text((stat_x + 12, 32), "5 HIGH", fill="#FCA5A5", font=font_badge)
draw.text((stat_x + 12, 48), "CSS / Micro-UI", fill="#FECACA", font=font_footer)

stat_x += 140
draw.rectangle([(stat_x, 24), (stat_x + 150, 68)], fill="#78350F", outline="#F59E0B", width=1)
draw.text((stat_x + 12, 32), "2 MEDIUM", fill="#FDE68A", font=font_badge)
draw.text((stat_x + 12, 48), "Asset & Logic Sync", fill="#FEF3C7", font=font_footer)


def draw_defect_row(y_top, row_h, badge_text, badge_color, title_text, figma_crop, live_crop, figma_bullets, live_bullets, bottom_summary, figma_img_pos=(55, None), live_img_pos=(825, None)):
    # Outer row container
    draw.rectangle([(30, y_top), (W - 30, y_top + row_h)], fill="#111C2E", outline="#334155", width=2)
    
    # Severity Badge
    b_w = len(badge_text) * 8 + 24
    draw.rectangle([(45, y_top + 10), (45 + b_w, y_top + 32)], fill=badge_color)
    draw.text((55, y_top + 14), badge_text, fill="#FFFFFF", font=font_badge)
    
    # Title
    draw.text((55 + b_w + 14, y_top + 13), title_text, fill="#F8FAFC", font=font_sec)
    
    # Left box (Figma / Baseline Expected)
    draw.rectangle([(45, y_top + 40), (785, y_top + row_h - 44)], outline="#10B981", width=2)
    draw.rectangle([(45, y_top + 40), (785, y_top + 65)], fill="#065F46")
    draw.text((55, y_top + 47), "🟢 APPROVED SPECIFICATION (FIGMA / AU BASELINE)", fill="#FFFFFF", font=font_badge)
    
    # Left visual container background
    draw.rectangle([(55, y_top + 72), (775, y_top + 192)], fill="#0B1320")
    if figma_crop:
        fx = figma_img_pos[0]
        fy = figma_img_pos[1] if figma_img_pos[1] is not None else y_top + 75
        canvas.paste(figma_crop, (fx, fy))
        
    text_y = y_top + 200
    for i, b in enumerate(figma_bullets):
        draw.text((55, text_y + (i * 21)), b, fill="#A7F3D0", font=font_body)
        
    # Right box (Live Mcstaging2 Actual)
    draw.rectangle([(815, y_top + 40), (W - 45, y_top + row_h - 44)], outline="#EF4444", width=2)
    draw.rectangle([(815, y_top + 40), (W - 45, y_top + 65)], fill="#991B1B")
    draw.text((825, y_top + 47), "🔴 LIVE MCSTAGING2 ACTUAL STOREFRONT", fill="#FFFFFF", font=font_badge)
    
    # Right visual container background
    draw.rectangle([(825, y_top + 72), (W - 55, y_top + 192)], fill="#0B1320")
    if live_crop:
        lx = live_img_pos[0]
        ly = live_img_pos[1] if live_img_pos[1] is not None else y_top + 75
        canvas.paste(live_crop, (lx, ly))
        
    for i, b in enumerate(live_bullets):
        draw.text((825, text_y + (i * 21)), b, fill="#FCA5A5", font=font_body)
        
    # Bottom alert bar
    draw.rectangle([(30, y_top + row_h - 38), (W - 30, y_top + row_h)], fill="#0B1120")
    draw.text((45, y_top + row_h - 26), bottom_summary, fill="#FBBF24", font=font_body_b)


row_h = 380
cur_y = 110

# =========================================================================
# DEF-01: SEARCHSPRING 0 RESULTS
# =========================================================================
au_s = Image.open(os.path.join(ws_dir, "Sprint-3/Ticket_Trade_Pricing_Toggle/screenshots/AU_BASELINE_SEARCHSPRING_WORKING.png"))
us_s = Image.open(os.path.join(ws_dir, "Sprint-3/Ticket_Enable_Public_Browsing_Mode/screenshots/04_US_SEARCHSPRING_CHAIR.png"))
crop_f_search = au_s.crop((120, 60, 1150, 480)).resize((340, 110), Image.Resampling.LANCZOS)
crop_l_search = us_s.crop((120, 60, 1150, 480)).resize((340, 110), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="🚨 P1 HIGH BLOCKER", badge_color="#DC2626",
    title_text="DEF-01: Catalog Search Returns 0 Products on US Storefront (?q=chair, ?q=sofa)",
    figma_crop=crop_f_search, live_crop=crop_l_search,
    figma_bullets=[
        "• Expected (AU Baseline & Spec): Search queries return live matching products.",
        "• Public Guests: Wholesale prices masked with Trade Registration CTA.",
        "• Authenticated Trade: Dual wholesale trade price + MSRP rendered.",
        "• Filtering: Active faceted filter sidebar loaded for refined navigation."
    ],
    live_bullets=[
        "• Actual: Keyword queries ('chair', 'sofa') return 0 products found.",
        "• Grid State: Blank canvas rendered; no fallback results or product cards.",
        "• Root Cause: SearchSpring merchant index not synced for US store view.",
        "• Fix: Configure & trigger SearchSpring catalog index synchronization."
    ],
    bottom_summary="🚨 PRE-GO-LIVE BLOCKER: SearchSpring search integration broken site-wide for all visitors on mcstaging2.",
    figma_img_pos=(65, cur_y + 75), live_img_pos=(835, cur_y + 75)
)

# =========================================================================
# DEF-02: PRODUCT TITLE TYPOGRAPHY
# =========================================================================
cur_y += row_h + 15
im_title_f = Image.open(os.path.join(figma_dir, "10_FIGMA_TITLE_PROPERTIES.png"))
im_title_l = Image.open(os.path.join(ws_dir, "scratch_live_title_element.png"))
crop_f_title = im_title_f.crop((1610, 80, 1850, 430)).resize((220, 110), Image.Resampling.LANCZOS)
crop_l_title = im_title_l.resize((320, 95), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="🔴 HIGH DEFECT", badge_color="#EF4444",
    title_text="DEF-02: Product Title (H1) Overextended Line Height (40px) & Letter Spacing (0.8px)",
    figma_crop=crop_f_title, live_crop=crop_l_title,
    figma_bullets=[
        "• Font: IvyMode Regular 400 | Size: 26px",
        "• Line Height: 120% (31.2px) exact per Figma Dev Mode",
        "• Letter Spacing: 0px exact (no letter stretching)",
        "• Color: #381C12 (Cherry Chocolate)"
    ],
    live_bullets=[
        "• Font: IvyMode Regular 400 | Size: 26px",
        "• Line Height: 40px (+8.8px excessive vertical gap between lines)",
        "• Letter Spacing: 0.8px (+0.8px stretched spacing defect)",
        "• Impact: Distorts heading visual balance and buy-box vertical flow."
    ],
    bottom_summary="🔴 DEFECT: Title line-height overextended by +8.8px and letter-spacing stretched to 0.8px.",
    figma_img_pos=(65, cur_y + 75), live_img_pos=(835, cur_y + 82)
)

# =========================================================================
# DEF-03: ADD TO CART FONT WEIGHT & SPACING
# =========================================================================
cur_y += row_h + 15
im_cart_f = Image.open(os.path.join(figma_dir, "09_FIGMA_ADD_TO_CART_PROPERTIES.png"))
im_buybox_l = Image.open(os.path.join(live_dir, "03_LIVE_PDP_BUY_BOX_CLOSEUP.png"))
crop_f_cart = im_cart_f.crop((1610, 80, 1850, 440)).resize((220, 110), Image.Resampling.LANCZOS)
crop_l_cart = im_buybox_l.crop((10, 608, 390, 665)).resize((340, 52), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="🔴 HIGH DEFECT", badge_color="#EF4444",
    title_text="DEF-03: 'Add to cart' CTA Button Missing Semibold 600 Weight & Stretched Spacing",
    figma_crop=crop_f_cart, live_crop=crop_l_cart,
    figma_bullets=[
        "• Typography: Proxima Nova Semibold 600 | Size: 14px",
        "• Letter Spacing: 0.25px exact",
        "• Button Layout: 330px x 50px | Background: #381C12",
        "• Label: 'Add to cart' (Title Case per Figma spec)"
    ],
    live_bullets=[
        "• Typography: Proxima Nova Regular 400 (Missing Semibold 600!)",
        "• Letter Spacing: 1px (4x wider than specification!)",
        "• Font Size: 15px (+1px larger) | Button Height: 44px",
        "• Label: 'ADD TO CART' (All Uppercase)"
    ],
    bottom_summary="🔴 DEFECT: Primary CTA uses font-weight: 400 (Regular) instead of 600 (Semibold); 1px spacing.",
    figma_img_pos=(65, cur_y + 75), live_img_pos=(835, cur_y + 100)
)

# =========================================================================
# DEF-04: ADD TO QUOTE EXTRA COPY
# =========================================================================
cur_y += row_h + 15
im_quote_f = Image.open(os.path.join(figma_dir, "12_FIGMA_ADD_TO_QUOTE_PROPERTIES.png"))
crop_f_quote = im_quote_f.crop((1610, 80, 1850, 480)).resize((220, 110), Image.Resampling.LANCZOS)
crop_l_quote = im_buybox_l.crop((10, 672, 390, 725)).resize((340, 50), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="🔴 HIGH DEFECT", badge_color="#EF4444",
    title_text="DEF-04: 'ADD TO QUOTE' Button Appending Unapproved Copy ' / HOLD'",
    figma_crop=crop_f_quote, live_crop=crop_l_quote,
    figma_bullets=[
        "• Button Label: 'ADD TO QUOTE' (Clean 3-word action)",
        "• Font: Proxima Nova Semibold 600 | Size: 14px",
        "• Letter Spacing: 0.25px | Border: 1px solid #381C12",
        "• Style: Secondary ghost button with clear trade intent"
    ],
    live_bullets=[
        "• Button Label: 'ADD TO QUOTE / HOLD' (Unapproved text '/ HOLD' appended)",
        "• Font: Proxima Nova Regular 400 (Missing Semibold!)",
        "• Letter Spacing: 1px (4x wider than spec)",
        "• Fix: Remove '/ HOLD' from US buy box template."
    ],
    bottom_summary="🔴 DEFECT: Non-spec text '/ HOLD' appended to button label; Font weight is 400 vs 600.",
    figma_img_pos=(65, cur_y + 75), live_img_pos=(835, cur_y + 102)
)

# =========================================================================
# DEF-05: STOCK ETA INCOMING SCHEDULE
# =========================================================================
cur_y += row_h + 15
crop_f_stock = im_quote_f.crop((1095, 215, 1530, 295)).resize((330, 60), Image.Resampling.LANCZOS)
crop_l_stock = im_buybox_l.crop((10, 742, 390, 792)).resize((340, 48), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="⚠️ P2 MEDIUM", badge_color="#D97706",
    title_text="DEF-05: Missing Stock Quantity Count & Incoming Shipment Schedule",
    figma_crop=crop_f_stock, live_crop=crop_l_stock,
    figma_bullets=[
        "• Primary Line: 'ETA 14 Mar 2027 (8 available)' with count in brackets",
        "• Secondary Line: 'Next Shipment: 8 (ETA 14 Mar 2027)'",
        "• Action CTA: Pinned '🔔 Notify me' icon button on the right",
        "• Four Hands Integration: Real-time incoming PO stock dates"
    ],
    live_bullets=[
        "• Primary Line: Generic '⚠️ Enquire for ETA' link only",
        "• Available Quantity Count: Completely MISSING (no count in brackets)",
        "• Secondary Incoming Line: Completely MISSING (no incoming shipment line)",
        "• Trade Impact: B2B buyers unable to verify availability for project orders."
    ],
    bottom_summary="⚠️ DEFECT: Four Hands inventory model missing available count in brackets & incoming shipment line.",
    figma_img_pos=(65, cur_y + 100), live_img_pos=(835, cur_y + 103)
)

# =========================================================================
# DEF-06: HEADER UTILITY BAR
# =========================================================================
cur_y += row_h + 15
im_head_f = Image.open(os.path.join(figma_dir, "13_FIGMA_HEADER_UTILITY_PROPERTIES.png"))
im_pdp_l = Image.open(os.path.join(live_dir, "04_LIVE_PDP_FULL_PAGE.png"))
crop_f_head = im_head_f.crop((1610, 80, 1850, 430)).resize((220, 110), Image.Resampling.LANCZOS)
crop_l_head = im_pdp_l.crop((900, 0, 1440, 36)).resize((340, 36), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="🔴 HIGH DEFECT", badge_color="#EF4444",
    title_text="DEF-06: Header Utility Bar Smaller Font Size (13px vs 16px) & Dual-Auth CTAs",
    figma_crop=crop_f_head, live_crop=crop_l_head,
    figma_bullets=[
        "• Showroom Link: 'Book Showroom Appointment'",
        "• Typography: Proxima Nova Regular 400 | Size: 16px",
        "• Line Height: 160% (25.6px) | Color: #FFFFFF",
        "• Spec Rule: 'Remove \"Become a trade customer\" link when user is logged in'"
    ],
    live_bullets=[
        "• Showroom Link Size: 13px (-3px smaller than 16px specification)",
        "• Line Height: 18px",
        "• Dual-Auth Leakage: 'Become a Trade Customer' persists in trade mode",
        "• Visual Polish: Inconsistent padding across mobile & desktop."
    ],
    bottom_summary="🔴 DEFECT: Font size is 13px vs Figma 16px; 'Become a Trade Customer' leaks while logged in.",
    figma_img_pos=(65, cur_y + 75), live_img_pos=(835, cur_y + 110)
)

# =========================================================================
# DEF-07: PLP CARD COMPARE & WISHLIST HEART
# =========================================================================
cur_y += row_h + 15
im_plp_f = Image.open(os.path.join(ws_dir, "scratch_card1_figma_full.png"))
im_plp_l = Image.open(os.path.join(live_dir, "02_LIVE_PRODUCT_CARD_CLOSEUP.png"))
crop_f_plp = im_plp_f.resize((90, 115), Image.Resampling.LANCZOS)
crop_l_plp = im_plp_l.resize((75, 115), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="🔴 HIGH DEFECT", badge_color="#EF4444",
    title_text="DEF-07: PLP Cards Missing Wishlist Heart, 0px Compare Inset & Australian Spelling",
    figma_crop=crop_f_plp, live_crop=crop_l_plp,
    figma_bullets=[
        "• Wishlist Heart: Pinned in top-right corner opposite Compare checkbox",
        "• Compare Inset: 12px–16px breathing room from container corner",
        "• Badge Copy: 'Customize' (US localized spelling with 'z')",
        "• Hierarchy: Badges sit below photo in .product-item-details"
    ],
    live_bullets=[
        "• Wishlist Heart: Completely MISSING on category product cards",
        "• Compare Inset: Sits flush at 0px against image container boundary",
        "• Badge Copy: 'Customisable' (Australian spelling with 's')",
        "• Defect: Violates US localization and micro-UI breathing room rules."
    ],
    bottom_summary="🔴 DEFECT: Missing wishlist heart on cards; 0px flush compare inset; AU spelling on badge.",
    figma_img_pos=(65, cur_y + 75), live_img_pos=(835, cur_y + 75)
)

# =========================================================================
# DEF-08: NETSUITE PLACEHOLDER IMAGES
# =========================================================================
cur_y += row_h + 15
crop_f_photo = im_plp_f.crop((20, 30, 230, 220)).resize((115, 110), Image.Resampling.LANCZOS)
crop_l_photo = im_plp_l.crop((10, 30, 234, 210)).resize((115, 110), Image.Resampling.LANCZOS)

draw_defect_row(
    y_top=cur_y, row_h=row_h,
    badge_text="⚠️ P2 MEDIUM", badge_color="#D97706",
    title_text="DEF-08: Product Cards Display Generic 'GW Image Coming Soon' Placeholders",
    figma_crop=crop_f_photo, live_crop=crop_l_photo,
    figma_bullets=[
        "• Asset Quality: High-resolution lifestyle furniture photography",
        "• Digital Asset Management: Synchronized NetSuite image feed",
        "• Zero Placeholders: Strictly no dummy or placeholder graphics",
        "• User Experience: Premium luxury aesthetic preserved"
    ],
    live_bullets=[
        "• Live Actual: Category cards display generic gray 'GW Image Coming Soon'",
        "• Image src: 230118_Image-Coming-Soon-2_1100x1100_1.jpg",
        "• Root Cause: Incomplete NetSuite catalog asset synchronization",
        "• Required Action: Complete digital asset sync prior to Go-Live."
    ],
    bottom_summary="⚠️ DEFECT: NetSuite catalog asset synchronization required to replace placeholder images.",
    figma_img_pos=(65, cur_y + 75), live_img_pos=(835, cur_y + 75)
)

# =========================================================================
# Bottom Footer Banner
# =========================================================================
draw.rectangle([(0, H - 70), (W, H)], fill="#0F172A")
draw.rectangle([(0, H - 70), (W, H - 68)], fill="#3B82F6")
draw.text((30, H - 52), "GlobeWest US Storefront (mcstaging2.globewest.com) • Verified with Headed DevTools & Figma Dev Mode Node 2424-21417 & 2316-12739", fill="#94A3B8", font=font_footer)
draw.text((30, H - 32), "Audit Standard: AGENTS.md Mandatory Pixel-Perfect Verification Rules • Color Legend: 🟢 Green = Approved Spec | 🔴 Red = Actual Defect", fill="#64748B", font=font_footer)

# Save Master Image to both locations
master_out_path = os.path.join(out_dir, "ALL_DEFECTS_COMPREHENSIVE_EVIDENCE_FULL.png")
canvas.save(master_out_path, quality=95)
print(f"Master Defect Image generated: {master_out_path}")

artifact_out_path = os.path.join(artifact_dir, "ALL_DEFECTS_COMPREHENSIVE_EVIDENCE_FULL.png")
canvas.save(artifact_out_path, quality=95)
print(f"Artifact Defect Image copied: {artifact_out_path}")
