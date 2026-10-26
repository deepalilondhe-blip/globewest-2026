import os
from PIL import Image, ImageDraw, ImageFont

# Paths
figma_full_path = 'Sprint-3/Ticket_Trade_Application_Form/figma/FIGMA_DESKTOP_TRADE_APPLICATION_FULL.png'
live_step2_path = 'Sprint-3/Ticket_Trade_Application_Form/screenshots/live_retest/01_STEP1_PHONE_VALIDATION_RESULT.png'
live_footer_path = 'Sprint-3/Ticket_Trade_Application_Form/screenshots/live_retest/04_FOOTER_LOCALIZATION_LEAK.png'
out_dir = 'Sprint-3/Ticket_Trade_Application_Form/comparison'
os.makedirs(out_dir, exist_ok=True)

# Load images
figma_img = Image.open(figma_full_path).convert('RGB')
live_step2 = Image.open(live_step2_path).convert('RGB')
live_footer = Image.open(live_footer_path).convert('RGB')

# Let's crop the form area from Figma (desktop/trade application artboard)
# In figma_img (1920x1080), the artboard is centered:
# Canvas bounding box roughly x: 246 to 1500, y: 36 to 900
# Form left column: x: 250 to 880, y: 150 to 850
figma_form_crop = figma_img.crop((245, 140, 880, 880)).resize((700, 820), Image.Resampling.LANCZOS)
live_form_crop = live_step2.crop((60, 160, 720, 900)).resize((700, 820), Image.Resampling.LANCZOS)

# Create a composite image: 1500 x 1350
W, H = 1500, 1350
canvas = Image.new('RGB', (W, H), '#0F172A') # Dark slate background
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
    font_header = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
    font_item = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    font_item_b = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
except Exception:
    font_title = font_sub = font_header = font_badge = font_item = font_item_b = ImageFont.load_default()

# Header title
draw.text((30, 20), "GLOBEWEST TRADE APPLICATION FORM: DEFECT FIX RE-VERIFICATION", fill='#FFFFFF', font=font_title)
draw.text((30, 55), "Direct Parity Audit: Figma Spec (Node 3226-21024 / EIN Change) vs Live US Staging (mcstaging2)", fill='#94A3B8', font=font_sub)

# Panel 1: Figma Approved Design
draw.rectangle([(30, 90), (730, 970)], outline='#10B981', width=3)
draw.rectangle([(30, 90), (730, 130)], fill='#064E3B')
draw.text((45, 100), "🟢 APPROVED FIGMA SPEC (Node 3226-21024 / EIN Change)", fill='#34D399', font=font_header)
canvas.paste(figma_form_crop, (30, 130))

# Panel 2: Live US Staging
draw.rectangle([(770, 90), (1470, 970)], outline='#3B82F6', width=3)
draw.rectangle([(770, 90), (1470, 130)], fill='#1E3A8A')
draw.text((785, 100), "🔍 LIVE STOREFRONT AUDIT (mcstaging2.globewest.com)", fill='#60A5FA', font=font_header)
canvas.paste(live_form_crop, (770, 130))

# Bottom Panel: Defect Verification Status Table
draw.rectangle([(30, 990), (1470, 1320)], fill='#1E293B', outline='#475569', width=2)
draw.text((45, 1005), "📊 PREVIOUS DEFECTS RE-VERIFICATION STATUS (DEVELOPER FIX AUDIT):", fill='#F8FAFC', font=font_header)

rows = [
    ("1. Step 1 US Phone Number Validation", "Accepts 10-digit US phone (2125550199)", "ACCEPTED cleanly; advanced to Step 2", "FIXED 🟢", "#10B981"),
    ("2. Step 2 Back Button CTA Text", "Specifies '← BACK'", "Now renders '← BACK' (removed 'GO')", "FIXED 🟢", "#10B981"),
    ("3. Step 2 State Dropdown Placeholder", "Specifies 'State ⌵'", "Now shows 'state ⌵' (not 'Please select')", "FIXED 🟢", "#10B981"),
    ("4. Step 2 Employees Placeholder", "Specifies 'eg. 1'", "Now displays 'eg. 1'", "FIXED 🟢", "#10B981"),
    ("5. Step 2 Entity Name Placeholder", "Specifies '...business name'", "Redundant 'entered above' removed", "FIXED 🟢", "#10B981"),
    ("6. Head Office Street Address Asterisk", "NO Asterisk (Optional field)", "STILL has mandatory Asterisk (*)", "NOT FIXED 🔴", "#EF4444"),
    ("7. City & State Field Validation", "Validate City matches State", "Accepts arbitrary/garbage strings without check", "NOT FIXED 🔴", "#EF4444"),
    ("8. Header Wishlist Heart Icon", "Heart icon (🤍) visible in header", "Wishlist heart icon MISSING from header", "NOT FIXED 🔴", "#EF4444"),
    ("9. Main Navigation 'Customisation'", "US English 'Customization' (z)", "Leaking AU/UK 'Customisation' (s)", "NOT FIXED 🔴", "#EF4444"),
    ("10. Footer 'Australian Owned' & Links", "Clean US Storefront Footer", "Leaking AU Map Badge, Shop Outlet & Centre", "NOT FIXED 🔴", "#EF4444")
]

y_pos = 1040
col_x = [45, 340, 710, 1140, 1320]

# Draw header row
draw.text((col_x[0], y_pos), "Defect Item", fill='#CBD5E1', font=font_item_b)
draw.text((col_x[1], y_pos), "Figma Expected Spec", fill='#CBD5E1', font=font_item_b)
draw.text((col_x[2], y_pos), "Live Storefront Retest Behavior", fill='#CBD5E1', font=font_item_b)
draw.text((col_x[3], y_pos), "Dev Fix Status", fill='#CBD5E1', font=font_item_b)

y_pos += 24
draw.line([(45, y_pos), (1455, y_pos)], fill='#475569', width=1)
y_pos += 8

for item, exp, act, status, color in rows:
    draw.text((col_x[0], y_pos), item, fill='#FFFFFF', font=font_item)
    draw.text((col_x[1], y_pos), exp, fill='#94A3B8', font=font_item)
    draw.text((col_x[2], y_pos), act, fill='#94A3B8', font=font_item)
    draw.text((col_x[3], y_pos), status, fill=color, font=font_item_b)
    y_pos += 24

out_file = os.path.join(out_dir, 'FIGMA_VS_LIVE_RETEST_STATUS_COMPARISON.png')
canvas.save(out_file, quality=95)
print(f"Successfully generated comparison: {out_file}")
