import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIGMA_DIR = os.path.join(BASE_DIR, 'figma')
REAL_COMP_DIR = os.path.join(BASE_DIR, 'REAL_COMPARISONS')
DEFECT_DIR = os.path.join(BASE_DIR, 'DEFECT_SCREENSHOTS')
os.makedirs(REAL_COMP_DIR, exist_ok=True)
os.makedirs(DEFECT_DIR, exist_ok=True)

# Load base artboards
im_figma_dt = Image.open(os.path.join(FIGMA_DIR, 'crop_desktop_artboard.png'))
im_figma_mob = Image.open(os.path.join(FIGMA_DIR, 'crop_mobile_artboard.png'))
im_figma_specs = Image.open(os.path.join(FIGMA_DIR, 'crop_frame620.png'))

im_us_dt_fp = Image.open(os.path.join(BASE_DIR, 'screenshots', 'desktop', 'US_Dashboard_Desktop_FullPage.png'))
im_us_dt_vp = Image.open(os.path.join(BASE_DIR, 'screenshots', 'desktop', 'US_Dashboard_Desktop_Viewport.png'))
im_us_mob_fp = Image.open(os.path.join(BASE_DIR, 'screenshots', 'mobile', 'US_Dashboard_Mobile_FullPage.png'))
im_us_mob_vp = Image.open(os.path.join(BASE_DIR, 'screenshots', 'mobile', 'US_Dashboard_Mobile_Viewport.png'))

def get_font(size=18, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

font_title = get_font(22, bold=True)
font_label = get_font(16, bold=True)
font_desc = get_font(14, bold=False)

def build_comparison(img_left, label_left, color_left, img_right, label_right, color_right, title_text, output_path, note_text=None, left_rect=None, right_rect=None):
    target_h = 420
    
    scale_l = target_h / img_left.height
    scale_r = target_h / img_right.height
    
    w_l = int(img_left.width * scale_l)
    w_r = int(img_right.width * scale_r)

    if w_l + w_r > 1750:
        factor = 1750 / (w_l + w_r)
        target_h = int(target_h * factor)
        scale_l = target_h / img_left.height
        scale_r = target_h / img_right.height
        w_l = int(img_left.width * scale_l)
        w_r = int(img_right.width * scale_r)

    res_left = img_left.resize((w_l, target_h), Image.Resampling.LANCZOS)
    res_right = img_right.resize((w_r, target_h), Image.Resampling.LANCZOS)

    header_h = 65
    footer_h = 50 if note_text else 20
    pad = 18
    gap = 24

    total_w = pad * 2 + w_l + w_r + gap
    total_h = header_h + target_h + footer_h + pad

    canvas = Image.new('RGB', (total_w, total_h), (250, 250, 252))
    draw = ImageDraw.Draw(canvas)

    # Top dark header bar
    draw.rectangle([(0, 0), (total_w, header_h)], fill=(24, 28, 33))
    draw.text((pad + 4, 18), title_text, fill=(255, 255, 255), font=font_title)

    # Left Box
    x_l = pad
    y_c = header_h + 12
    draw.rectangle([(x_l, y_c - 28), (x_l + w_l, y_c - 2)], fill=color_left)
    draw.text((x_l + 12, y_c - 24), label_left, fill=(255, 255, 255), font=font_label)
    canvas.paste(res_left, (x_l, y_c))
    draw.rectangle([(x_l, y_c), (x_l + w_l, y_c + target_h)], outline=color_left, width=3)

    if left_rect:
        rx1, ry1, rx2, ry2 = left_rect
        s_rx1 = int(rx1 * scale_l) + x_l
        s_ry1 = int(ry1 * scale_l) + y_c
        s_rx2 = int(rx2 * scale_l) + x_l
        s_ry2 = int(ry2 * scale_l) + y_c
        draw.rectangle([(s_rx1, s_ry1), (s_rx2, s_ry2)], outline=(40, 167, 69), width=3)

    # Right Box
    x_r = x_l + w_l + gap
    draw.rectangle([(x_r, y_c - 28), (x_r + w_r, y_c - 2)], fill=color_right)
    draw.text((x_r + 12, y_c - 24), label_right, fill=(255, 255, 255), font=font_label)
    canvas.paste(res_right, (x_r, y_c))
    draw.rectangle([(x_r, y_c), (x_r + w_r, y_c + target_h)], outline=color_right, width=3)

    if right_rect:
        rx1, ry1, rx2, ry2 = right_rect
        s_rx1 = int(rx1 * scale_r) + x_r
        s_ry1 = int(ry1 * scale_r) + y_c
        s_rx2 = int(rx2 * scale_r) + x_r
        s_ry2 = int(ry2 * scale_r) + y_c
        draw.rectangle([(s_rx1, s_ry1), (s_rx2, s_ry2)], outline=(220, 53, 69), width=3)

    # Footer note
    if note_text:
        draw.text((pad + 8, total_h - 38), note_text, fill=(73, 80, 87), font=font_desc)

    canvas.save(output_path, quality=95)
    print(f"Generated: {os.path.basename(output_path)}")

# ------------------------------------------------------------------------------
# 1. REAL COMPARISONS
# ------------------------------------------------------------------------------
print("\n--- 1. Generating Real Comparisons ---")

# 1. Header & Utility Bar
c_f_header = im_figma_dt.crop((0, 0, im_figma_dt.width, 70))
c_u_header = im_us_dt_fp.crop((0, 0, im_us_dt_fp.width, 175))
build_comparison(
    c_f_header, "FIGMA DESIGN (Frame 620: Hidden Utility Bar)", (40, 167, 69),
    c_u_header, "US LIVE STAGING (Utility Bar Visible)", (0, 102, 204),
    "1. Header & Utility Bar Comparison",
    os.path.join(REAL_COMP_DIR, "01_COMPARE_HEADER_AND_UTILITY_BAR.png"),
    "Figma Frame 620 explicitly mandates hidden utility bar on dashboard. Live US renders dark brown utility bar with showroom link."
)

# 2. Left Navigation Sidebar
c_f_nav = im_figma_dt.crop((15, 75, 230, 255))
c_u_nav = im_us_dt_vp.crop((90, 145, 365, 465))
build_comparison(
    c_f_nav, "FIGMA DESIGN (MY CLAIMS / MY BOOKINGS)", (40, 167, 69),
    c_u_nav, "US LIVE STAGING (GLOBEWEST REFERRALS / BOOKINGS)", (0, 102, 204),
    "2. Left Navigation Sidebar Comparison",
    os.path.join(REAL_COMP_DIR, "02_COMPARE_LEFT_NAVIGATION_SIDEBAR.png"),
    "Figma specifies link #3 as 'MY CLAIMS' and #5 as 'MY BOOKINGS'. Live US renders 'GLOBEWEST REFERRALS' and 'BOOKINGS'."
)

# 3. Welcome / Loyalty Banner
c_f_welcome = im_figma_dt.crop((240, 75, 545, 180))
c_u_welcome = im_us_dt_vp.crop((440, 150, 1350, 330))
build_comparison(
    c_f_welcome, "FIGMA DESIGN (Welcome Banner)", (40, 167, 69),
    c_u_welcome, "US LIVE STAGING (Welcome Banner)", (0, 102, 204),
    "3. Welcome / Loyalty Banner Comparison",
    os.path.join(REAL_COMP_DIR, "03_COMPARE_WELCOME_LOYALTY_BANNER.png"),
    "Both layouts display Tier pill badge, IvyMode greeting, Customer ID, tier discount rate, and right sofa promotional image."
)

# 4. Recent Orders Table
c_f_orders = im_figma_dt.crop((160, 190, 485, 305))
c_u_orders = im_us_dt_vp.crop((300, 500, 1360, 780))
build_comparison(
    c_f_orders, "FIGMA DESIGN (Full Status Badge Text)", (40, 167, 69),
    c_u_orders, "US LIVE STAGING (Truncated Status Badges)", (0, 102, 204),
    "4. My Recent Orders Table Comparison",
    os.path.join(REAL_COMP_DIR, "04_COMPARE_RECENT_ORDERS_TABLE.png"),
    "Orders table columns match. US Staging exhibits status badge text truncation with ellipses ('Awaiting ...', 'Pending P...')."
)

# 5. Submit Claim Notification
c_f_notif = im_figma_dt.crop((240, 310, 545, 380))
c_u_notif = im_us_dt_fp.crop((440, 730, 1350, 880))
build_comparison(
    c_f_notif, "FIGMA DESIGN (1-Column Claims Notification)", (40, 167, 69),
    c_u_notif, "US LIVE STAGING (Claims Notification)", (0, 102, 204),
    "5. Online Claims Notification Block Comparison",
    os.path.join(REAL_COMP_DIR, "05_COMPARE_SUBMIT_CLAIM_NOTIFICATION.png"),
    "Matches Figma spec: 'New' badge, headline 'You can now submit claims online', explanatory copy, and SUBMIT CLAIM button."
)

# 6. Upcoming Events & Promotions Block
c_f_events = im_figma_dt.crop((240, 385, 545, 560))
c_u_events = im_us_dt_fp.crop((440, 930, 1350, 1550))
build_comparison(
    c_f_events, "FIGMA DESIGN (3-Card Promo Grid)", (40, 167, 69),
    c_u_events, "US LIVE STAGING (3-Card Promo Grid)", (0, 102, 204),
    "6. Upcoming Events & Promotions Comparison",
    os.path.join(REAL_COMP_DIR, "06_COMPARE_EVENTS_AND_PROMOTIONS.png"),
    "Matches Figma 3-column promo card architecture: Card 1 (Event), Card 2 (Sale: 15% off), Card 3 (News) with CTAs."
)

# 7. Showroom Bookings
c_f_bookings = im_figma_dt.crop((240, 565, 545, 715))
c_u_bookings = im_us_dt_fp.crop((440, 1560, 1350, 1850))
build_comparison(
    c_f_bookings, "FIGMA DESIGN (Bookings with Appointment Example)", (40, 167, 69),
    c_u_bookings, "US LIVE STAGING (Empty State + MAKE A BOOKING)", (0, 102, 204),
    "7. Showroom Bookings Block Comparison",
    os.path.join(REAL_COMP_DIR, "07_COMPARE_SHOWROOM_BOOKINGS.png"),
    "Figma shows appointment card example; US Live correctly displays empty state with 'MAKE A BOOKING' CTA when no appointments exist."
)

# 8. Frequently Asked Questions
c_f_faqs = im_figma_dt.crop((240, 720, 545, 960))
c_u_faqs = im_us_dt_fp.crop((440, 1860, 1350, 2400))
build_comparison(
    c_f_faqs, "FIGMA DESIGN (FAQ Accordion Block)", (40, 167, 69),
    c_u_faqs, "US LIVE STAGING (FAQ Accordion Block)", (0, 102, 204),
    "8. Frequently Asked Questions Comparison",
    os.path.join(REAL_COMP_DIR, "08_COMPARE_FREQUENTLY_ASKED_QUESTIONS.png"),
    "Matches Figma: 5 FAQ accordion items with single active expand/collapse behavior."
)

# 9. Mobile Header & Nav
c_f_mob_top = im_figma_mob.crop((0, 0, im_figma_mob.width, 160))
c_u_mob_top = im_us_mob_fp.crop((0, 0, im_us_mob_fp.width, 220))
build_comparison(
    c_f_mob_top, "FIGMA MOBILE (No Utility Bar)", (40, 167, 69),
    c_u_mob_top, "US LIVE MOBILE (Utility Bar Visible)", (0, 102, 204),
    "9. Mobile Header & Navigation Comparison",
    os.path.join(REAL_COMP_DIR, "09_COMPARE_MOBILE_HEADER_AND_NAV.png"),
    "Figma Mobile omits utility bar; US Live mobile shows top brown utility bar with showroom booking & company link."
)

# 10. Mobile Orders & Cards
c_f_mob_orders = im_figma_mob.crop((0, 160, im_figma_mob.width, 380))
c_u_mob_orders = im_us_mob_vp.crop((0, 310, im_us_mob_vp.width, 680))
build_comparison(
    c_f_mob_orders, "FIGMA MOBILE (Orders Table & Status Badges)", (40, 167, 69),
    c_u_mob_orders, "US LIVE MOBILE (Orders Table & Status Badges)", (0, 102, 204),
    "10. Mobile Orders Table & Notification Comparison",
    os.path.join(REAL_COMP_DIR, "10_COMPARE_MOBILE_ORDERS_AND_CARDS.png"),
    "Responsive behavior matches Figma specs; table hides Balance column for mobile viewport."
)


# ------------------------------------------------------------------------------
# 2. DEFECT SCREENSHOTS (Red / Green Annotations)
# ------------------------------------------------------------------------------
print("\n--- 2. Generating Red / Green Defect Screenshots ---")

# DEFECT 1: Utility Bar Not Hidden on Dashboard
c_f_clean_header = im_figma_dt.crop((0, 0, im_figma_dt.width, 70))
c_u_bad_header = im_us_dt_fp.crop((0, 0, im_us_dt_fp.width, 175))

build_comparison(
    c_f_clean_header, "APPROVED FIGMA SPEC (Frame 620: Hidden Utility Bar)", (40, 167, 69),
    c_u_bad_header, "US STOREFRONT ACTUAL DEFECT (Dark Brown Utility Bar Rendered)", (220, 53, 69),
    "DEFECT #1: Utility Bar Visible on Dashboard (Frame 620 Spec Violation)",
    os.path.join(DEFECT_DIR, "DEFECT_1_UTILITY_BAR_NOT_HIDDEN.png"),
    "Figma Frame 620 Rule: 'Desktop & Mobile: Hidden/no utility bar, so a user cannot toggle pricing view.' Actual: Bar rendered.",
    right_rect=(0, 0, im_us_dt_fp.width, 38)
)

# DEFECT 2: Side Navigation Links Inconsistency
c_f_nav_def = im_figma_dt.crop((15, 75, 230, 255))
c_u_nav_def = im_us_dt_vp.crop((90, 145, 365, 465))

build_comparison(
    c_f_nav_def, "APPROVED FIGMA SPEC (#3: 'MY CLAIMS' | #5: 'MY BOOKINGS')", (40, 167, 69),
    c_u_nav_def, "US STOREFRONT ACTUAL DEFECT (#3: 'GLOBEWEST REFERRALS' | #5: 'BOOKINGS')", (220, 53, 69),
    "DEFECT #2: Side Navigation Link Labels & Order Inconsistency",
    os.path.join(DEFECT_DIR, "DEFECT_2_SIDE_NAV_LINKS_INCONSISTENCY.png"),
    "Figma specifies link #3 as 'MY CLAIMS' and #5 as 'MY BOOKINGS'. Live US renders 'GLOBEWEST REFERRALS' and 'BOOKINGS'.",
    left_rect=(5, 52, 205, 80),
    right_rect=(5, 200, 270, 245)
)

# DEFECT 3: Recent Orders Status Badge Text Truncation
c_f_table_crop = im_figma_dt.crop((160, 190, 485, 305))
c_u_table_crop = im_us_dt_vp.crop((300, 500, 1360, 780))

build_comparison(
    c_f_table_crop, "APPROVED FIGMA SPEC (Full Status Text: 'Processing' / 'Complete')", (40, 167, 69),
    c_u_table_crop, "US STOREFRONT ACTUAL DEFECT (Truncated Status: 'Awaiting ...', 'Pending P...')", (220, 53, 69),
    "DEFECT #3: Recent Orders Table Status Badge Text Truncation",
    os.path.join(DEFECT_DIR, "DEFECT_3_RECENT_ORDERS_STATUS_TRUNCATION.png"),
    "Status badges have tight container width causing status titles to truncate with ellipses ('Awaiting ...', 'Pending P...').",
    right_rect=(430, 70, 550, 260)
)

print("\n🎉 Regenerated all Comparisons and Defect Screenshots!")
