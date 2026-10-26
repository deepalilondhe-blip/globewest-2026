import os
import json
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVIDENCE_DIR = os.path.join(BASE_DIR, 'evidence')
SHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
COMPS_DIR = os.path.join(BASE_DIR, 'comparisons')
os.makedirs(COMPS_DIR, exist_ok=True)

with open(os.path.join(BASE_DIR, 'google_sheet_defects.json')) as f:
    defects = json.load(f)

# Page to screenshot mapping
SCREENSHOT_MAP = {
    'DashBoard': 'DASHBOARD_DESKTOP_LIVE.png',
    'Dashboard': 'DASHBOARD_DESKTOP_LIVE.png',
    'Quote Listing': 'QUOTES_LISTING_DESKTOP_LIVE.png',
    'Quote Listing Responsive': 'QUOTES_MOBILE_LIVE.png',
    'Quote Detail': 'QUOTE_DETAIL_DESKTOP_LIVE.png',
    'Quote View': 'QUOTE_DETAIL_DESKTOP_LIVE.png',
    'Order Listing': 'ORDER_HISTORY_DESKTOP_LIVE.png',
    'Ortder listing': 'ORDER_HISTORY_DESKTOP_LIVE.png',
    'Order Detail': 'ORDER_DETAIL_DESKTOP_LIVE.png',
    'Order Detail Responsive': 'ORDER_DETAIL_MOBILE_LIVE.png',
    'Account Dropdown': 'ACCOUNT_DROPDOWN_DESKTOP_LIVE.png',
    'Hold Listing': 'HOLDS_LISTING_DESKTOP_LIVE.png',
    'Hold Listing Responsive': 'HOLDS_MOBILE_LIVE.png',
    'Hold Detail': 'HOLD_DETAIL_DESKTOP_LIVE.png',
    'Hold View': 'HOLD_DETAIL_DESKTOP_LIVE.png'
}

# Client related defects to skip
CLIENT_SKIPPED = {'DE#03', 'DE#06', 'DE#07', 'DE#11', 'DE#31', 'DE#48'}

def create_comparison(defect):
    tid = defect['ticket_id']
    if tid in CLIENT_SKIPPED:
        print(f"Skipping {tid}: Client related")
        return None

    rep_idx = tid.replace('DE#', 'DE')
    rep_img_path = os.path.join(EVIDENCE_DIR, f"{rep_idx}_reported.png")
    if not os.path.exists(rep_img_path):
        print(f"Reported evidence missing for {tid}: {rep_img_path}")
        return None

    pg = defect.get('page_name', '')
    live_shot_name = SCREENSHOT_MAP.get(pg, 'DASHBOARD_DESKTOP_LIVE.png')
    live_img_path = os.path.join(SHOTS_DIR, live_shot_name)

    if not os.path.exists(live_img_path):
        # Fallback to base listing if detail not yet captured
        if 'Quote' in pg:
            live_img_path = os.path.join(SHOTS_DIR, 'QUOTES_LISTING_DESKTOP_LIVE.png')
        elif 'Hold' in pg:
            live_img_path = os.path.join(SHOTS_DIR, 'HOLDS_LISTING_DESKTOP_LIVE.png')
        elif 'Order' in pg:
            live_img_path = os.path.join(SHOTS_DIR, 'ORDER_HISTORY_DESKTOP_LIVE.png')
        else:
            live_img_path = os.path.join(SHOTS_DIR, 'DASHBOARD_DESKTOP_LIVE.png')

    if not os.path.exists(live_img_path):
        print(f"Live shot missing for {tid}: {live_img_path}")
        return None

    try:
        rep_img = Image.open(rep_img_path).convert('RGB')
        live_img = Image.open(live_img_path).convert('RGB')

        # Standardize height to 800px
        target_h = 800
        rep_scale = target_h / rep_img.height
        rep_w = int(rep_img.width * rep_scale)
        rep_resized = rep_img.resize((rep_w, target_h), Image.Resampling.LANCZOS)

        live_scale = target_h / live_img.height
        live_w = int(live_img.width * live_scale)
        # Cap live width if it's super wide
        if live_w > 1200:
            live_w = 1200
            live_resized = live_img.crop((0, 0, int(live_img.width * (1200/live_w)), int(live_img.height * (target_h/live_img.height))))
        else:
            live_resized = live_img.resize((live_w, target_h), Image.Resampling.LANCZOS)

        # Header height for labels
        hdr_h = 50
        comp_w = rep_w + live_w + 30
        comp_h = target_h + hdr_h + 20

        comp = Image.new('RGB', (comp_w, comp_h), color=(248, 249, 250))
        draw = ImageDraw.Draw(comp)

        # Draw clean header backgrounds
        # Left: Red-tinted header for Reported Defect
        draw.rectangle([(10, 10), (rep_w + 10, hdr_h)], fill=(254, 242, 242), outline=(239, 68, 68), width=2)
        # Right: Green-tinted header for Live Staging Retest
        draw.rectangle([(rep_w + 20, 10), (comp_w - 10, hdr_h)], fill=(240, 253, 244), outline=(34, 197, 94), width=2)

        # Labels
        draw.text((25, 20), f"🔴 REPORTED DEFECT: {tid} ({pg})", fill=(185, 28, 28))
        draw.text((rep_w + 35, 20), f"🟢 LIVE US STAGING RETEST (HEADED HIGH-DPI)", fill=(21, 128, 61))

        # Paste images
        comp.paste(rep_resized, (10, hdr_h + 10))
        comp.paste(live_resized, (rep_w + 20, hdr_h + 10))

        # Outlines around the images
        draw.rectangle([(10, hdr_h + 10), (rep_w + 10, hdr_h + 10 + target_h)], outline=(239, 68, 68), width=2)
        draw.rectangle([(rep_w + 20, hdr_h + 10), (comp_w - 10, hdr_h + 10 + target_h)], outline=(34, 197, 94), width=2)

        out_path = os.path.join(COMPS_DIR, f"{tid}_COMPARISON.png")
        comp.save(out_path, quality=95)
        print(f"Generated comparison: {out_path}")
        return out_path
    except Exception as e:
        print(f"Error for {tid}: {e}")
        return None

if __name__ == '__main__':
    for d in defects:
        create_comparison(d)
