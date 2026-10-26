import os
from PIL import Image, ImageDraw, ImageFont

# Load images
figma_full_path = 'Sprint-3/Ticket_Trade_Application_Form/figma/FIGMA_DESKTOP_TRADE_APPLICATION_FULL.png'
live_path = 'Sprint-3/Ticket_Trade_Application_Form/screenshots/live_retest/01_STEP1_PHONE_VALIDATION_RESULT.png'
live_footer_path = 'Sprint-3/Ticket_Trade_Application_Form/screenshots/live_retest/04_FOOTER_LOCALIZATION_LEAK.png'
out_dir = 'Sprint-3/Ticket_Trade_Application_Form/comparison'
os.makedirs(out_dir, exist_ok=True)

figma_img = Image.open(figma_full_path).convert('RGB')
live_img = Image.open(live_path).convert('RGB')
live_footer = Image.open(live_footer_path).convert('RGB')

# Build comprehensive 1500 x 1400 canvas
W, H = 1500, 1400
canvas = Image.new('RGB', (W, H), '#0F172A')
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    font_section = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
    font_body = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    font_body_b = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
except Exception:
    font_title = font_sub = font_section = font_badge = font_body = font_body_b = ImageFont.load_default()

# Header
draw.text((30, 20), "GLOBEWEST TRADE APPLICATION: REMAINING DEFECTS & FIGMA MISMATCHES", fill='#FFFFFF', font=font_title)
draw.text((30, 55), "Detailed Micro-UI, Structural Hierarchy, and Brand Localization Inspection", fill='#94A3B8', font=font_sub)

# =========================================================================
# PANEL 1: HEAD OFFICE STREET ADDRESS ASTERISK (*)
# =========================================================================
draw.rectangle([(30, 95), (1470, 420)], fill='#1E293B', outline='#475569', width=2)
draw.text((45, 110), "1. HEAD OFFICE STREET ADDRESS: MANDATORY ASTERISK (*) MISMATCH", fill='#F8FAFC', font=font_section)

# Crop address from Figma (x: 245 to 880, y: 390 to 470)
figma_addr = figma_img.crop((245, 400, 880, 470)).resize((680, 75), Image.Resampling.LANCZOS)
# Crop address from Live (x: 60 to 720, y: 440 to 520)
live_addr = live_img.crop((60, 440, 720, 520)).resize((680, 75), Image.Resampling.LANCZOS)

draw.rectangle([(50, 145), (740, 260)], outline='#10B981', width=2)
draw.text((60, 155), "🟢 FIGMA SPEC: NO ASTERISK (OPTIONAL FIELD)", fill='#34D399', font=font_body_b)
canvas.paste(figma_addr, (55, 180))

draw.rectangle([(760, 145), (1450, 260)], outline='#EF4444', width=2)
draw.text((770, 155), "🔴 LIVE US STOREFRONT: HAS MANDATORY ASTERISK (*)", fill='#F87171', font=font_body_b)
canvas.paste(live_addr, (765, 180))

# Callout box on Live Asterisk
draw.rectangle([(765 + 300, 180 + 5), (765 + 340, 180 + 35)], outline='#EF4444', width=3)
draw.rectangle([(765 + 345, 180 + 8), (765 + 490, 180 + 32)], fill='#EF4444')
draw.text((765 + 352, 180 + 12), "EXTRA ASTERISK *", fill='#FFFFFF', font=font_badge)

draw.text((50, 275), "• Spec Discrepancy: Figma defines Head Office Street Address as optional without '*'. Live enforces it as required.", fill='#CBD5E1', font=font_body)
draw.text((50, 295), "• Severity: Medium. Users without formal commercial office addresses cannot complete trade application.", fill='#CBD5E1', font=font_body)

# =========================================================================
# PANEL 2: HEADER UTILITIES - WISHLIST HEART ICON MISSING & CART ICON SHAPE
# =========================================================================
draw.rectangle([(30, 440), (1470, 760)], fill='#1E293B', outline='#475569', width=2)
draw.text((45, 455), "2. HEADER UTILITIES: WISHLIST HEART ICON (🤍) MISSING & CART ICON SHAPE", fill='#F8FAFC', font=font_section)

# Crop header utilities from Figma (x: 1050 to 1480, y: 55 to 110)
figma_utils = figma_img.crop((1060, 60, 1480, 115)).resize((680, 70), Image.Resampling.LANCZOS)
# Crop header utilities from Live (x: 1050 to 1440, y: 55 to 110)
live_utils = live_img.crop((1050, 55, 1440, 110)).resize((680, 70), Image.Resampling.LANCZOS)

draw.rectangle([(50, 490), (740, 605)], outline='#10B981', width=2)
draw.text((60, 500), "🟢 FIGMA SPEC: SHOWS HEART ICON (🤍) & TOTE BAG (🛍️)", fill='#34D399', font=font_body_b)
canvas.paste(figma_utils, (55, 530))

draw.rectangle([(760, 490), (1450, 605)], outline='#EF4444', width=2)
draw.text((770, 500), "🔴 LIVE US STOREFRONT: HEART ICON MISSING, WIRE CART (🛒) RENDERED", fill='#F87171', font=font_body_b)
canvas.paste(live_utils, (765, 530))

# Callout on missing heart
draw.rectangle([(765 + 500, 530 + 10), (765 + 570, 530 + 55)], outline='#EF4444', width=2)
draw.rectangle([(765 + 380, 530 + 15), (765 + 495, 530 + 45)], fill='#EF4444')
draw.text((765 + 388, 530 + 22), "HEART MISSING!", fill='#FFFFFF', font=font_badge)

draw.text((50, 620), "• Discrepancy 1: Figma features dedicated Wishlist Heart Icon between Login and Cart. It is completely missing on live.", fill='#CBD5E1', font=font_body)
draw.text((50, 640), "• Discrepancy 2: Figma specifies luxury tote bag icon style. Live renders grocery supermarket wire cart icon with wheels.", fill='#CBD5E1', font=font_body)

# =========================================================================
# PANEL 3: FOOTER LOCALIZATION - AUSTRALIAN OWNED BADGE & AU LINKS LEAK
# =========================================================================
draw.rectangle([(30, 780), (1470, 1150)], fill='#1E293B', outline='#475569', width=2)
draw.text((45, 795), "3. FOOTER LOCALIZATION: 'AUSTRALIAN OWNED & RUN' MAP BADGE & OUTLET LEAKS", fill='#F8FAFC', font=font_section)

# Crop footer left and middle from live
live_foot_badge = live_footer.crop((20, 680, 300, 850)).resize((400, 180), Image.Resampling.LANCZOS)
live_foot_links = live_footer.crop((850, 200, 1250, 880)).resize((450, 220), Image.Resampling.LANCZOS)

draw.rectangle([(50, 830), (520, 1070)], outline='#EF4444', width=2)
draw.text((60, 840), "🔴 LEAKED AU MAP BADGE (US STOREFRONT)", fill='#F87171', font=font_body_b)
canvas.paste(live_foot_badge, (60, 870))

draw.rectangle([(550, 830), (1450, 1070)], outline='#EF4444', width=2)
draw.text((560, 840), "🔴 LEAKED AU LINKS & UK SPELLINGS (US STOREFRONT)", fill='#F87171', font=font_body_b)
canvas.paste(live_foot_links, (560, 865))
draw.text((1030, 880), "• 'Shop Outlet' (AU Outlet link)", fill='#FCA5A5', font=font_body_b)
draw.text((1030, 915), "• 'Help Centre' (AU 'Centre' vs US 'Center')", fill='#FCA5A5', font=font_body_b)
draw.text((1030, 950), "• 'After Sales Enquiries' (AU 'Enquiries' vs 'Inquiries')", fill='#FCA5A5', font=font_body_b)
draw.text((1030, 985), "• Figma Spec: Clean US footer with zero AU badges", fill='#34D399', font=font_body_b)

# =========================================================================
# SUMMARY MATRIX
# =========================================================================
draw.rectangle([(30, 1170), (1470, 1370)], fill='#0F172A', outline='#38BDF8', width=2)
draw.text((45, 1185), "📊 OTHER NOTABLE MICRO-UI MISMATCHES WITH FIGMA SPEC:", fill='#38BDF8', font=font_section)
draw.text((45, 1215), "1. Yearly Spend Asterisk: Figma has NO asterisk on 'WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?'; Live has '*'.", fill='#E2E8F0', font=font_body)
draw.text((45, 1240), "2. Yearly Spend Radio Spacing: Figma specifies '10k - 30k' (with spaces); Live renders '10k-30k' (squished without spaces).", fill='#E2E8F0', font=font_body)
draw.text((45, 1265), "3. Sign In Casing: Figma specifies Title Case 'Already have an account? Sign In'; Live renders sentence case 'Sign in'.", fill='#E2E8F0', font=font_body)
draw.text((45, 1290), "4. City/State Validation: Form allows arbitrary strings (e.g. '99999 INVALID CITY !@#') without validating against US State.", fill='#E2E8F0', font=font_body)
draw.text((45, 1315), "5. Mobile Utility Bar: Figma mobile shows 'Book Showroom Appointment'; Live mobile truncates to 'Book Showroom'.", fill='#E2E8F0', font=font_body)

out_file = os.path.join(out_dir, 'ALL_REMAINING_MISMATCHES_WITH_FIGMA.png')
canvas.save(out_file, quality=95)
print(f"Created: {out_file}")
