import os
from PIL import Image, ImageDraw

OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/comparison'
os.makedirs(OUT_DIR, exist_ok=True)

USER_IMG_1 = '/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/.user_uploaded/media_1790243282744.png'
USER_IMG_2 = '/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/.user_uploaded/media_1790243571808.png'
LIVE_FULL = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/screenshots/desktop/01_my_orders_desktop_live_full.png'
FIGMA_ARTBOARD = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/figma/07_FIGMA_ORDERS_ARTBOARD.png'
FIGMA_SPEC = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/figma/CROP_FRAME_624.png'

# -------------------------------------------------------------
# DEFECT 01: STATUS FILTER TABS
# -------------------------------------------------------------
print("Building DEFECT_01_STATUS_TABS.png...")
# Figma top: crop from FIGMA_ARTBOARD
figma_im = Image.open(FIGMA_ARTBOARD)
# The desktop orders top section in FIGMA_ARTBOARD is around (1160, 40, 1680, 420)
figma_top = figma_im.crop((1150, 40, 1680, 420)).convert('RGB')
draw_f = ImageDraw.Draw(figma_top)
# Draw GREEN box around Figma tabs: [AWAITING PAYMENT | PENDING SHIPMENT | DISPATCHED | CLOSED]
# Tabs are located in figma_top: find coordinates
# In figma_top, "My Orders" heading is at y~110, tabs are at y~165 to 215, x~15 to 450
draw_f.rectangle([(15, 165), (460, 215)], outline="#2E7D32", width=4)

# Live bottom: User's image 1 (has RED box already drawn by user or we use user1)
user1_im = Image.open(USER_IMG_1).convert('RGB')
# Crop user1 to top header & tabs area so it matches size
user1_crop = user1_im.crop((0, 0, user1_im.width, 220))

# Resize to common width
W = 1200
f_ratio = W / figma_top.width
f_h = int(figma_top.height * f_ratio)
figma_top_res = figma_top.resize((W, f_h), Image.Resampling.LANCZOS)

u_ratio = W / user1_crop.width
u_h = int(user1_crop.height * u_ratio)
user1_res = user1_crop.resize((W, u_h), Image.Resampling.LANCZOS)

# Combined vertical
comp1 = Image.new('RGB', (W, f_h + u_h + 6), '#D0D0D0')
comp1.paste(figma_top_res, (0, 0))
comp1.paste(user1_res, (0, f_h + 6))
comp1.save(os.path.join(OUT_DIR, 'DEFECT_01_STATUS_TABS.png'), quality=95)
print("Saved DEFECT_01_STATUS_TABS.png")

# -------------------------------------------------------------
# DEFECT 02: TABLE COLUMNS (6 Columns in Figma vs 9 in Live)
# -------------------------------------------------------------
print("Building DEFECT_02_TABLE_COLUMNS.png...")
# Figma table header
figma_table = figma_im.crop((1150, 200, 1680, 380)).convert('RGB')
draw_ft = ImageDraw.Draw(figma_table)
draw_ft.rectangle([(15, 20), (510, 65)], outline="#2E7D32", width=4)

# Live table header from live_full
live_im = Image.open(LIVE_FULL).convert('RGB')
# Live table header is around (450, 180, 1360, 280)
live_table = live_im.crop((450, 185, 1360, 285))
draw_lt = ImageDraw.Draw(live_table)
# Highlight extra columns CUST PO#, ORDER NAME, CLIENT NAME in RED
# In live_table, columns are around x: 170 to 520
draw_lt.rectangle([(170, 10), (520, 50)], outline="#FF0000", width=4)

# Resize to common width W
ft_ratio = W / figma_table.width
ft_h = int(figma_table.height * ft_ratio)
figma_table_res = figma_table.resize((W, ft_h), Image.Resampling.LANCZOS)

lt_ratio = W / live_table.width
lt_h = int(live_table.height * lt_ratio)
live_table_res = live_table.resize((W, lt_h), Image.Resampling.LANCZOS)

comp2 = Image.new('RGB', (W, ft_h + lt_h + 6), '#D0D0D0')
comp2.paste(figma_table_res, (0, 0))
comp2.paste(live_table_res, (0, ft_h + 6))
comp2.save(os.path.join(OUT_DIR, 'DEFECT_02_TABLE_COLUMNS.png'), quality=95)
print("Saved DEFECT_02_TABLE_COLUMNS.png")

# -------------------------------------------------------------
# DEFECT 03: SUPPORT BLOCK LINE OVERLAP & SCOPE LEAK
# -------------------------------------------------------------
print("Building DEFECT_03_SUPPORT_BLOCK.png...")
# Figma support block: in FIGMA_ARTBOARD around (1150, 830, 1680, 1050)
figma_supp = figma_im.crop((1150, 830, 1680, 1050)).convert('RGB')
draw_fs = ImageDraw.Draw(figma_supp)
draw_fs.rectangle([(15, 10), (500, 200)], outline="#2E7D32", width=4)

# Live support block: in live_full around (450, 450, 1360, 580)
live_supp = live_im.crop((450, 455, 1360, 560))
draw_ls = ImageDraw.Draw(live_supp)
draw_ls.rectangle([(10, 10), (890, 95)], outline="#FF0000", width=4)

fs_ratio = W / figma_supp.width
fs_h = int(figma_supp.height * fs_ratio)
figma_supp_res = figma_supp.resize((W, fs_h), Image.Resampling.LANCZOS)

ls_ratio = W / live_supp.width
ls_h = int(live_supp.height * ls_ratio)
live_supp_res = live_supp.resize((W, ls_h), Image.Resampling.LANCZOS)

comp3 = Image.new('RGB', (W, fs_h + ls_h + 6), '#D0D0D0')
comp3.paste(figma_supp_res, (0, 0))
comp3.paste(live_supp_res, (0, fs_h + 6))
comp3.save(os.path.join(OUT_DIR, 'DEFECT_03_SUPPORT_BLOCK.png'), quality=95)
print("Saved DEFECT_03_SUPPORT_BLOCK.png")

# -------------------------------------------------------------
# DEFECT 04: FAQ MULTI-OPEN ACCORDION VIOLATION
# -------------------------------------------------------------
print("Building DEFECT_04_FAQ_MULTI_OPEN.png...")
# Figma single open accordion: from FIGMA_ARTBOARD around (1150, 430, 1680, 820)
figma_faq = figma_im.crop((1150, 430, 1680, 820)).convert('RGB')
draw_ff = ImageDraw.Draw(figma_faq)
# Draw GREEN box around FAQ spec (only 1 open, second closed)
draw_ff.rectangle([(15, 10), (510, 370)], outline="#2E7D32", width=4)

# Live FAQ: User's image 2 (already has RED boxes around both open chevrons!)
user2_im = Image.open(USER_IMG_2).convert('RGB')

ff_ratio = W / figma_faq.width
ff_h = int(figma_faq.height * ff_ratio)
figma_faq_res = figma_faq.resize((W, ff_h), Image.Resampling.LANCZOS)

u2_ratio = W / user2_im.width
u2_h = int(user2_im.height * u2_ratio)
user2_res = user2_im.resize((W, u2_h), Image.Resampling.LANCZOS)

comp4 = Image.new('RGB', (W, ff_h + u2_h + 6), '#D0D0D0')
comp4.paste(figma_faq_res, (0, 0))
comp4.paste(user2_res, (0, ff_h + 6))
comp4.save(os.path.join(OUT_DIR, 'DEFECT_04_FAQ_MULTI_OPEN.png'), quality=95)
print("Saved DEFECT_04_FAQ_MULTI_OPEN.png")

print("All 4 comparisons built successfully with ZERO added text!")
