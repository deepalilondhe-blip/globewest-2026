import os
from PIL import Image, ImageDraw, ImageFont

out_dir = 'Sprint-3/Ticket_Trade_Application_Form/comparison'
os.makedirs(out_dir, exist_ok=True)

# 1. Figma Desktop Utility Bar
figma_desk = Image.open('Sprint-3/Ticket_Trade_Application_Form/figma/FIGMA_DESKTOP_TRADE_APPLICATION_FULL.png').convert('RGB')
# Top utility bar in figma desk: x: 246 to 1480, y: 36 to 66
figma_desk_bar = figma_desk.crop((750, 36, 1480, 68)) # (730, 32)

# 2. Figma Mobile Header
figma_mob = Image.open('Sprint-3/Ticket_Trade_Application_Form/figma/FIGMA_MOBILE_TRADE_APPLICATION_FULL.png').convert('RGB')
# Mobile artboard top in figma_mob: x: 865 to 1255, y: 36 to 130
figma_mob_header = figma_mob.crop((865, 36, 1255, 125)) # (390, 89)

# 3. Live Mobile Top Viewport
live_mob = Image.open('Sprint-3/Ticket_Trade_Application_Form/screenshots/mobile/01_MOBILE_STEP2_RETEST.png').convert('RGB')
live_mob_top = live_mob.crop((0, 0, 390, 160)) # (390, 160)

# Build canvas: 1200 x 950
W, H = 1200, 950
canvas = Image.new('RGB', (W, H), '#0F172A')
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    font_section = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12)
    font_body = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    font_body_b = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
except Exception:
    font_title = font_sub = font_section = font_badge = font_body = font_body_b = ImageFont.load_default()

# Header
draw.text((30, 20), "MOBILE UTILITY BAR: EXACT LOCATION & TRUNCATION COMPARISON", fill='#FFFFFF', font=font_title)
draw.text((30, 52), "Comparing Top Utility Bar: Figma Specification vs Live Mobile Storefront (390px Viewport)", fill='#94A3B8', font=font_sub)

# PANEL 1: LIVE MOBILE STOREFRONT (WHERE IT IS ON MOBILE)
draw.rectangle([(30, 85), (580, 550)], fill='#1E293B', outline='#EF4444', width=3)
draw.text((45, 95), "🔴 LIVE MOBILE STOREFRONT (390x844)", fill='#F87171', font=font_section)
draw.text((45, 120), "Location: Topmost header bar (y: 0px to 45px)", fill='#CBD5E1', font=font_body)

# Paste live mobile header crop at (95, 150)
canvas.paste(live_mob_top, (95, 150))

# Draw highlight callout on live top brown bar
lx1, ly1, lx2, ly2 = 95, 150, 95 + 390, 150 + 44
draw.rectangle([(lx1, ly1), (lx2, ly2)], outline='#EF4444', width=3)
draw.rectangle([(lx1 + 180, ly1 + 10), (lx1 + 380, ly1 + 36)], outline='#EF4444', width=2)
draw.rectangle([(lx1 + 20, ly1 + 50), (lx1 + 370, ly1 + 75)], fill='#EF4444')
draw.text((lx1 + 25, ly1 + 55), "TRUNCATED TO: 'Book Showroom'", fill='#FFFFFF', font=font_badge)

draw.text((45, 330), "• Live Mobile Behavior:", fill='#F87171', font=font_body_b)
draw.text((45, 355), "  On mobile viewports (e.g. iPhone), the utility bar", fill='#CBD5E1', font=font_body)
draw.text((45, 375), "  renders: 'Book Showroom'.", fill='#CBD5E1', font=font_body)
draw.text((45, 400), "  The word 'Appointment' is truncated / removed,", fill='#CBD5E1', font=font_body)
draw.text((45, 420), "  and 'Become a Trade Customer' is omitted entirely.", fill='#CBD5E1', font=font_body)

# PANEL 2: FIGMA SPECIFICATIONS
draw.rectangle([(610, 85), (1170, 550)], fill='#022C22', outline='#10B981', width=3)
draw.text((625, 95), "🟢 FIGMA SPECIFICATIONS", fill='#34D399', font=font_section)

# A. Desktop Figma Utility Bar
draw.text((625, 125), "A. Figma Desktop Spec (Full Utility Bar):", fill='#A7F3D0', font=font_body_b)
draw.rectangle([(625, 150), (1155, 215)], fill='#064E3B', outline='#10B981', width=1)
# Resize figma_desk_bar to fit
f_desk_fit = figma_desk_bar.resize((510, 24), Image.Resampling.LANCZOS)
canvas.paste(f_desk_fit, (635, 170))
draw.text((625, 225), "Full text: 'Become a Trade Customer  |  Book Showroom Appointment'", fill='#E2E8F0', font=font_body)

# B. Mobile Figma Header
draw.text((625, 265), "B. Figma Mobile Frame ('mobile/trade application'):", fill='#A7F3D0', font=font_body_b)
canvas.paste(figma_mob_header, (690, 295))
draw.text((625, 410), "• Figma Mobile Artboard Observation:", fill='#34D399', font=font_body_b)
draw.text((625, 435), "  In frame 'mobile/trade application' (node 3226-21130),", fill='#CBD5E1', font=font_body)
draw.text((625, 455), "  the top brown utility bar is NOT rendered at all.", fill='#CBD5E1', font=font_body)
draw.text((625, 475), "  The mobile layout starts directly with the Logo header.", fill='#CBD5E1', font=font_body)
draw.text((625, 495), "  Where utility links appear, spec uses 'Appointment'.", fill='#CBD5E1', font=font_body)

# PANEL 3: SUMMARY EXPLANATION
draw.rectangle([(30, 570), (1170, 920)], fill='#1E293B', outline='#475569', width=2)
draw.text((45, 585), "📋 EXACT DISCREPANCY BREAKDOWN & WHERE IT APPEARS:", fill='#F8FAFC', font=font_section)

draw.text((45, 620), "1. Exact Screen Location:", fill='#38BDF8', font=font_body_b)
draw.text((45, 642), "   • On the live mobile website, look at the VERY TOP 44px of the screen (the dark brown bar).", fill='#E2E8F0', font=font_body)
draw.text((45, 664), "   • It sits above the white header containing the hamburger menu, search icon, and GlobeWest logo.", fill='#E2E8F0', font=font_body)

draw.text((45, 700), "2. The Copy Mismatch:", fill='#38BDF8', font=font_body_b)
draw.text((45, 722), "   • Desktop Figma & Desktop Live: Displays 'Book Showroom Appointment' (and 'Become a Trade Customer').", fill='#E2E8F0', font=font_body)
draw.text((45, 744), "   • Live Mobile Storefront: Truncates the label to just 'Book Showroom' (dropping the word 'Appointment').", fill='#F87171', font=font_body)

draw.text((45, 780), "3. Figma Mobile Design Parity:", fill='#38BDF8', font=font_body_b)
draw.text((45, 802), "   • In the official Figma mobile artboard ('mobile/trade application'), the top brown utility bar is entirely omitted.", fill='#E2E8F0', font=font_body)
draw.text((45, 824), "   • If the client intends to retain this utility bar on mobile, the copy must either display the full phrase", fill='#E2E8F0', font=font_body)
draw.text((45, 846), "     'Book Showroom Appointment' or be formally aligned in the Figma design system.", fill='#34D399', font=font_body)

out_file = os.path.join(out_dir, 'MOBILE_UTILITY_BAR_EXACT_LOCATION.png')
canvas.save(out_file, quality=95)
print(f"Created: {out_file}")
