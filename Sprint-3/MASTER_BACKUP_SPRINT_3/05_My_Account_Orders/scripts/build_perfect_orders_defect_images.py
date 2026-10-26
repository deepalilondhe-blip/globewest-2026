import os
from PIL import Image, ImageDraw

OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/comparison'
os.makedirs(OUT_DIR, exist_ok=True)

USER_IMG_1 = '/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/.user_uploaded/media_1790243282744.png'
USER_IMG_2 = '/home/deepali/.gemini/antigravity-ide/brain/65883c05-5280-456e-b620-4152c00b9888/.user_uploaded/media_1790243571808.png'
LIVE_FULL = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/screenshots/desktop/01_my_orders_desktop_live_full.png'

FIGMA_TABS = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/figma/perfect_figma_tabs.png'
FIGMA_TABLE = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/figma/perfect_figma_table.png'
FIGMA_ARTBOARD = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/figma/07_FIGMA_ORDERS_ARTBOARD.png'

W = 1000

# =========================================================================
# 1. DEFECT 01: STATUS FILTER TABS
# =========================================================================
print("Building DEFECT_01_STATUS_FILTER_TABS.png...")
fig_tabs = Image.open(FIGMA_TABS).convert('RGB')
f_canvas1 = Image.new('RGB', (fig_tabs.width + 30, fig_tabs.height + 30), '#FFFFFF')
f_canvas1.paste(fig_tabs, (15, 15))
draw_f1 = ImageDraw.Draw(f_canvas1)
draw_f1.rectangle([(13, 13), (fig_tabs.width + 17, fig_tabs.height + 17)], outline="#2E7D32", width=4)

user1 = Image.open(USER_IMG_1).convert('RGB')
# user1 tabs area crop: x: 0 to width, y: 0 to 200
user1_tabs_crop = user1.crop((0, 0, user1.width, 205))

r1 = W / f_canvas1.width
f_tabs_res = f_canvas1.resize((W, int(f_canvas1.height * r1)), Image.Resampling.LANCZOS)

r1_u = W / user1_tabs_crop.width
u1_tabs_res = user1_tabs_crop.resize((W, int(user1_tabs_crop.height * r1_u)), Image.Resampling.LANCZOS)

comp1 = Image.new('RGB', (W, f_tabs_res.height + u1_tabs_res.height + 4), '#E0E0E0')
comp1.paste(f_tabs_res, (0, 0))
comp1.paste(u1_tabs_res, (0, f_tabs_res.height + 4))
comp1.save(os.path.join(OUT_DIR, 'DEFECT_01_STATUS_FILTER_TABS.png'), quality=95)
print("Saved DEFECT_01_STATUS_FILTER_TABS.png")

# =========================================================================
# 2. DEFECT 02: TABLE COLUMN REDUCTION
# =========================================================================
print("Building DEFECT_02_TABLE_COLUMN_REDUCTION.png...")
fig_tbl = Image.open(FIGMA_TABLE).convert('RGB')
fig_hdr = fig_tbl.crop((0, 0, fig_tbl.width, 48))
f_canvas2 = Image.new('RGB', (fig_hdr.width + 30, fig_hdr.height + 30), '#FFFFFF')
f_canvas2.paste(fig_hdr, (15, 15))
draw_f2 = ImageDraw.Draw(f_canvas2)
draw_f2.rectangle([(13, 13), (fig_hdr.width + 17, fig_hdr.height + 17)], outline="#2E7D32", width=4)

# Live table header from user1
live_hdr = user1.crop((340, 130, 905, 180))
l_canvas2 = Image.new('RGB', (live_hdr.width + 30, live_hdr.height + 30), '#FFFFFF')
l_canvas2.paste(live_hdr, (15, 15))
draw_l2 = ImageDraw.Draw(l_canvas2)
# Highlight CUST PO#, ORDER NAME, CLIENT NAME: in live_hdr, they are roughly from x=120 to x=325
draw_l2.rectangle([(15 + 115, 18), (15 + 325, live_hdr.height + 5)], outline="#FF0000", width=4)

r2 = W / f_canvas2.width
f_hdr_res = f_canvas2.resize((W, int(f_canvas2.height * r2)), Image.Resampling.LANCZOS)

r2_l = W / l_canvas2.width
l_hdr_res = l_canvas2.resize((W, int(l_canvas2.height * r2_l)), Image.Resampling.LANCZOS)

comp2 = Image.new('RGB', (W, f_hdr_res.height + l_hdr_res.height + 4), '#E0E0E0')
comp2.paste(f_hdr_res, (0, 0))
comp2.paste(l_hdr_res, (0, f_hdr_res.height + 4))
comp2.save(os.path.join(OUT_DIR, 'DEFECT_02_TABLE_COLUMN_REDUCTION.png'), quality=95)
print("Saved DEFECT_02_TABLE_COLUMN_REDUCTION.png")

# =========================================================================
# 3. DEFECT 03: SUPPORT BLOCK
# =========================================================================
print("Building DEFECT_03_SUPPORT_BLOCK_LINE_OVERLAP.png...")
fig_art = Image.open(FIGMA_ARTBOARD).convert('RGB')
# Clean support block in Figma artboard
fig_sup = fig_art.crop((1420, 840, 1800, 970))
f_canvas3 = Image.new('RGB', (fig_sup.width + 30, fig_sup.height + 30), '#FFFFFF')
f_canvas3.paste(fig_sup, (15, 15))
draw_f3 = ImageDraw.Draw(f_canvas3)
draw_f3.rectangle([(13, 13), (fig_sup.width + 17, fig_sup.height + 17)], outline="#2E7D32", width=4)

# Live support block from LIVE_FULL showing line strike-through and AU phone/email
live_im = Image.open(LIVE_FULL).convert('RGB')
live_sup = live_im.crop((440, 840, 980, 960))
l_canvas3 = Image.new('RGB', (live_sup.width + 30, live_sup.height + 30), '#FFFFFF')
l_canvas3.paste(live_sup, (15, 15))
draw_l3 = ImageDraw.Draw(l_canvas3)
draw_l3.rectangle([(13, 13), (live_sup.width + 17, live_sup.height + 17)], outline="#FF0000", width=4)

r3 = W / f_canvas3.width
f_sup_res = f_canvas3.resize((W, int(f_canvas3.height * r3)), Image.Resampling.LANCZOS)

r3_l = W / l_canvas3.width
l_sup_res = l_canvas3.resize((W, int(l_canvas3.height * r3_l)), Image.Resampling.LANCZOS)

comp3 = Image.new('RGB', (W, f_sup_res.height + l_sup_res.height + 4), '#E0E0E0')
comp3.paste(f_sup_res, (0, 0))
comp3.paste(l_sup_res, (0, f_sup_res.height + 4))
comp3.save(os.path.join(OUT_DIR, 'DEFECT_03_SUPPORT_BLOCK_LINE_OVERLAP.png'), quality=95)
print("Saved DEFECT_03_SUPPORT_BLOCK_LINE_OVERLAP.png")

# =========================================================================
# 4. DEFECT 04: FAQ ACCORDION MULTI-OPEN
# =========================================================================
print("Building DEFECT_04_FAQ_ACCORDION_MULTI_OPEN.png...")
fig_faq = fig_art.crop((1420, 430, 1820, 780))
f_canvas4 = Image.new('RGB', (fig_faq.width + 30, fig_faq.height + 30), '#FFFFFF')
f_canvas4.paste(fig_faq, (15, 15))
draw_f4 = ImageDraw.Draw(f_canvas4)
draw_f4.rectangle([(13, 13), (fig_faq.width + 17, fig_faq.height + 17)], outline="#2E7D32", width=4)

user2 = Image.open(USER_IMG_2).convert('RGB')
user2_crop = user2.crop((0, 0, user2.width, user2.height - 25))

r4 = W / f_canvas4.width
f_faq_res = f_canvas4.resize((W, int(f_canvas4.height * r4)), Image.Resampling.LANCZOS)

r4_u = W / user2_crop.width
u2_faq_res = user2_crop.resize((W, int(user2_crop.height * r4_u)), Image.Resampling.LANCZOS)

comp4 = Image.new('RGB', (W, f_faq_res.height + u2_faq_res.height + 4), '#E0E0E0')
comp4.paste(f_faq_res, (0, 0))
comp4.paste(u2_faq_res, (0, f_faq_res.height + 4))
comp4.save(os.path.join(OUT_DIR, 'DEFECT_04_FAQ_ACCORDION_MULTI_OPEN.png'), quality=95)
print("Saved DEFECT_04_FAQ_ACCORDION_MULTI_OPEN.png")

print("All 4 perfect comparison images successfully generated with ZERO added text!")
