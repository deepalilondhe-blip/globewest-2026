import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIGMA_DIR = os.path.join(BASE_DIR, 'figma')
SHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
COMP_DIR = os.path.join(BASE_DIR, 'comparison')
os.makedirs(COMP_DIR, exist_ok=True)

def get_font(size):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except:
        return ImageFont.load_default()

def create_side_by_side(figma_path, live_path, out_path, title, defect_note, figma_crop=None, live_crop=None):
    im_figma = Image.open(figma_path)
    im_live = Image.open(live_path)

    if figma_crop:
        im_figma = im_figma.crop(figma_crop)
    if live_crop:
        im_live = im_live.crop(live_crop)

    target_h = 750
    w_f = int(im_figma.width * (target_h / im_figma.height))
    im_figma = im_figma.resize((w_f, target_h), Image.Resampling.LANCZOS)

    w_l = int(im_live.width * (target_h / im_live.height))
    im_live = im_live.resize((w_l, target_h), Image.Resampling.LANCZOS)

    banner_h = 90
    card_w = max(w_f + w_l + 60, 1400)
    canvas_h = target_h + banner_h + 120

    canvas = Image.new('RGB', (card_w, canvas_h), (25, 27, 31))
    draw = ImageDraw.Draw(canvas)

    # Header Banner
    draw.rectangle([0, 0, card_w, banner_h], fill=(35, 39, 46))
    f_title = get_font(24)
    draw.text((30, 20), title, fill=(255, 255, 255), font=f_title)
    f_sub = get_font(15)
    draw.text((30, 55), defect_note, fill=(255, 100, 100), font=f_sub)

    # Green Side (Figma Spec)
    x_f = 20
    y_f = banner_h + 40
    # Green label
    draw.rectangle([x_f, banner_h + 10, x_f + w_f, banner_h + 36], fill=(34, 139, 34))
    draw.text((x_f + 15, banner_h + 14), "🟢 APPROVED FIGMA SPECIFICATION (Node 2316-15694)", fill=(255, 255, 255), font=f_sub)
    canvas.paste(im_figma, (x_f, y_f))
    draw.rectangle([x_f, y_f, x_f + w_f, y_f + target_h], outline=(34, 197, 94), width=4)

    # Red Side (Live US Staging Defect)
    x_l = x_f + w_f + 20
    draw.rectangle([x_l, banner_h + 10, x_l + w_l, banner_h + 36], fill=(180, 40, 40))
    draw.text((x_l + 15, banner_h + 14), "🔴 ACTUAL US STAGING DEFECT (mcstaging2.globewest.com)", fill=(255, 255, 255), font=f_sub)
    canvas.paste(im_live, (x_l, y_f))
    draw.rectangle([x_l, y_f, x_l + w_l, y_f + target_h], outline=(239, 68, 68), width=4)

    canvas.save(out_path, quality=95)
    print(f"✅ Generated comparison: {out_path}")

# 1. Comparison 1: Claims Listing Navigation & Route Redirect Defect
figma_claims = os.path.join(FIGMA_DIR, 'desktop/02_FIGMA_DESKTOP_MY_CLAIMS.png')
live_dashboard = os.path.join(SHOTS_DIR, 'desktop/US_01_ACCOUNT_DASHBOARD.png')
out_01 = os.path.join(COMP_DIR, 'COMPARISON_01_CLAIMS_LISTING_ROUTE_REDIRECT_DEFECT.png')
create_side_by_side(
    figma_claims, live_dashboard, out_01,
    "DEFECT 01: Claims Portal Table Inaccessible (302 Redirect to Dashboard)",
    "EXPECTED: Dedicated My Claims table with All/Open/Pending tabs | ACTUAL: Clicking My Claims redirects back to My Dashboard",
    figma_crop=(550, 200, 1420, 1200),
    live_crop=(400, 100, 1400, 850)
)

# 2. Comparison 2: Dashboard "Submit Claim" CTA Dead Link Defect
out_02 = os.path.join(COMP_DIR, 'COMPARISON_02_DASHBOARD_SUBMIT_CLAIM_DEAD_LINK.png')
create_side_by_side(
    figma_claims, live_dashboard, out_02,
    "DEFECT 02: Dashboard 'Submit Claim' Button Has Dead Placeholder Link (href='#')",
    "EXPECTED: [ CREATE NEW CLAIM ] CTA opens Create Claim form | ACTUAL: Dashboard button has href='#' dummy link",
    figma_crop=(1100, 220, 1400, 400),
    live_crop=(400, 500, 1200, 850)
)

# 3. Comparison 3: Create Claim Form Not Deployed (404 Route)
figma_create = os.path.join(FIGMA_DIR, 'desktop/01_FIGMA_DESKTOP_CREATE_CLAIM.png')
out_03 = os.path.join(COMP_DIR, 'COMPARISON_03_CREATE_CLAIM_FORM_NOT_DEPLOYED.png')
create_side_by_side(
    figma_create, live_dashboard, out_03,
    "DEFECT 03: Create a Claim Workflow & Upload Dropzone Not Deployed (404 Not Found)",
    "EXPECTED: Full claim submission form with product lookup & dropzone | ACTUAL: Routes return 404 Not Found",
    figma_crop=(650, 180, 1400, 1500),
    live_crop=(250, 150, 1440, 850)
)

# 4. Comparison 4: Specification Frame 630 vs Live State
figma_spec = os.path.join(FIGMA_DIR, '01_FIGMA_SPEC_CARD_FRAME_630.png')
out_04 = os.path.join(COMP_DIR, 'COMPARISON_04_FRAME_630_SPEC_RULES_VS_LIVE.png')
create_side_by_side(
    figma_spec, live_dashboard, out_04,
    "DEFECT 04: Frame 630 Architecture Non-Compliance (Table, FAQ & Need Help Blocks)",
    "EXPECTED: Date in US format MM/DD/YYYY, 8 FAQs with mutex, US contact info | ACTUAL: Entire claims module suppressed on US",
    figma_crop=(700, 70, 1300, 1750),
    live_crop=(400, 100, 1400, 850)
)

print("\n🎉 All 4 comparison posters generated successfully!")
