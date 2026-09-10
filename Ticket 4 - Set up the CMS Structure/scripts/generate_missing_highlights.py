import os
import sys
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=True):
    try:
        font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
        if not os.path.exists(font_path):
            font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def draw_dashed_rectangle(draw, box, outline_color, width=4, dash_len=14, space_len=8):
    x1, y1, x2, y2 = box
    # Top
    x = x1
    while x < x2:
        draw.line([(x, y1), (min(x + dash_len, x2), y1)], fill=outline_color, width=width)
        x += dash_len + space_len
    # Bottom
    x = x1
    while x < x2:
        draw.line([(x, y2), (min(x + dash_len, x2), y2)], fill=outline_color, width=width)
        x += dash_len + space_len
    # Left
    y = y1
    while y < y2:
        draw.line([(x1, y), (x1, min(y + dash_len, y2))], fill=outline_color, width=width)
        y += dash_len + space_len
    # Right
    y = y1
    while y < y2:
        draw.line([(x2, y), (x2, min(y + dash_len, y2))], fill=outline_color, width=width)
        y += dash_len + space_len

def create_missing_highlight_image(
    title,
    cms_id,
    missing_headline,
    us_img_path,
    au_img_path,
    us_box_coords,     # (x1, y1, x2, y2) in relative fractions 0.0-1.0
    au_box_coords,     # (x1, y1, x2, y2) in relative fractions 0.0-1.0
    us_callout_badge,
    au_callout_badge,
    explanation_bullets,
    out_path
):
    print(f"Generating highlighted missing graphic for: {title}...")
    side_w = 980
    
    us_im = Image.open(us_img_path).convert('RGB')
    au_im = Image.open(au_img_path).convert('RGB')
    
    us_w, us_h = us_im.size
    au_w, au_h = au_im.size
    
    scaled_us_h = int(us_h * (side_w / float(us_w)))
    scaled_au_h = int(au_h * (side_w / float(au_w)))
    
    content_h = max(scaled_us_h, scaled_au_h)
    content_h = min(content_h, 720)
    content_h = max(content_h, 450)
    
    us_resized = us_im.resize((side_w, scaled_us_h), Image.Resampling.LANCZOS)
    au_resized = au_im.resize((side_w, scaled_au_h), Image.Resampling.LANCZOS)
    
    # Standardize heights
    if scaled_us_h > content_h:
        us_resized = us_resized.crop((0, 0, side_w, content_h))
    elif scaled_us_h < content_h:
        new_us = Image.new('RGB', (side_w, content_h), (18, 24, 38))
        new_us.paste(us_resized, (0, (content_h - scaled_us_h) // 2))
        us_resized = new_us
        
    if scaled_au_h > content_h:
        au_resized = au_resized.crop((0, 0, side_w, content_h))
    elif scaled_au_h < content_h:
        new_au = Image.new('RGB', (side_w, content_h), (18, 24, 38))
        new_au.paste(au_resized, (0, (content_h - scaled_au_h) // 2))
        au_resized = new_au
        
    padding = 24
    header_h = 140
    footer_h = 140
    total_w = (side_w * 2) + (padding * 3)
    total_h = header_h + content_h + footer_h + (padding * 2)
    
    canvas = Image.new('RGB', (total_w, total_h), color=(10, 14, 23))
    draw = ImageDraw.Draw(canvas)
    
    f_h1 = get_font(26, bold=True)
    f_sub = get_font(15, bold=False)
    f_badge = get_font(15, bold=True)
    f_badge_large = get_font(18, bold=True)
    f_col = get_font(18, bold=True)
    f_notes = get_font(14, bold=False)
    f_notes_bold = get_font(14, bold=True)
    
    # ─── 1. TOP BANNER ────────────────────────────────────────────────────────
    draw.rounded_rectangle(
        [(padding, padding), (total_w - padding, padding + header_h)],
        radius=12,
        fill=(24, 18, 28),
        outline=(239, 68, 68),
        width=3
    )
    
    draw.text((padding + 24, padding + 18), title.upper(), fill=(255, 255, 255), font=f_h1)
    draw.text((padding + 24, padding + 56), f"CMS Block Identifier: {cms_id}   |   Store View: USA Website vs AU Reference", fill=(203, 213, 225), font=f_sub)
    draw.text((padding + 24, padding + 88), f"⚠️ DEFECT AUDIT: {missing_headline}", fill=(252, 165, 165), font=f_sub)
    
    # Right badge on header
    h_badge_text = "❌ ISSUE RECOGNITION GUIDE"
    h_bbox = draw.textbbox((0, 0), h_badge_text, font=f_badge)
    hb_w = (h_bbox[2] - h_bbox[0]) + 30
    draw.rounded_rectangle(
        [(total_w - padding - 24 - hb_w, padding + 22), (total_w - padding - 24, padding + 60)],
        radius=18,
        fill=(127, 29, 29),
        outline=(239, 68, 68),
        width=2
    )
    draw.text((total_w - padding - 24 - hb_w + 15, padding + 29), h_badge_text, fill=(255, 255, 255), font=f_badge)

    # ─── 2. COLUMN HEADERS ───────────────────────────────────────────────────
    y_content_start = padding + header_h + 16
    
    # Left Header: US (Red/Pink)
    draw.rounded_rectangle(
        [(padding, y_content_start), (padding + side_w, y_content_start + 48)],
        radius=8,
        fill=(45, 15, 25),
        outline=(239, 68, 68),
        width=3
    )
    draw.text((padding + 20, y_content_start + 12), "🇺🇸 US STOREFRONT  (mcstaging2.globewest.com) — [CHECK THIS]", fill=(255, 100, 130), font=f_col)
    
    # Right Header: AU (Green/Cyan)
    draw.rounded_rectangle(
        [(padding + side_w + padding, y_content_start), (total_w - padding, y_content_start + 48)],
        radius=8,
        fill=(12, 35, 30),
        outline=(16, 185, 129),
        width=3
    )
    draw.text((padding + side_w + padding + 20, y_content_start + 12), "🇦🇺 AU STOREFRONT BASELINE  (mcstaging2.globewest.com.au) — [REFERENCE]", fill=(52, 211, 153), font=f_col)

    # ─── 3. IMAGES & HIGHLIGHTS ──────────────────────────────────────────────
    y_img = y_content_start + 56
    
    # Paste images
    canvas.paste(us_resized, (padding, y_img))
    canvas.paste(au_resized, (padding + side_w + padding, y_img))
    
    # Highlight US Box (Red Dashed + Solid Glow + Big Tag)
    if us_box_coords:
        fx1, fy1, fx2, fy2 = us_box_coords
        ux1 = padding + int(fx1 * side_w)
        uy1 = y_img + int(fy1 * content_h)
        ux2 = padding + int(fx2 * side_w)
        uy2 = y_img + int(fy2 * content_h)
        
        # Outer glow
        draw.rectangle([(ux1 - 4, uy1 - 4), (ux2 + 4, uy2 + 4)], outline=(255, 50, 50), width=3)
        draw.rectangle([(ux1, uy1), (ux2, uy2)], outline=(255, 220, 0), width=5)
        draw_dashed_rectangle(draw, (ux1 + 6, uy1 + 6, ux2 - 6, uy2 - 6), (255, 0, 0), width=3)
        
        # Big Missing Badge on US side
        tag_w = 420
        tag_h = 44
        tag_x = ux1
        tag_y = max(y_img + 10, uy1 - 48)
        if tag_y < y_img:
            tag_y = uy1 + 10
            
        draw.rounded_rectangle([(tag_x, tag_y), (tag_x + tag_w, tag_y + tag_h)], radius=8, fill=(220, 38, 38), outline=(255, 255, 255), width=2)
        draw.text((tag_x + 14, tag_y + 11), us_callout_badge, fill=(255, 255, 255), font=f_badge_large)

    # Highlight AU Box (Green/Cyan Solid + Tag)
    if au_box_coords:
        fx1, fy1, fx2, fy2 = au_box_coords
        ax1 = padding + side_w + padding + int(fx1 * side_w)
        ay1 = y_img + int(fy1 * content_h)
        ax2 = padding + side_w + padding + int(fx2 * side_w)
        ay2 = y_img + int(fy2 * content_h)
        
        draw.rectangle([(ax1 - 3, ay1 - 3), (ax2 + 3, ay2 + 3)], outline=(52, 211, 153), width=2)
        draw.rectangle([(ax1, ay1), (ax2, ay2)], outline=(16, 185, 129), width=5)
        
        # Green Present Badge on AU side
        tag_w = 380
        tag_h = 44
        tag_x = ax1
        tag_y = max(y_img + 10, ay1 - 48)
        if tag_y < y_img:
            tag_y = ay1 + 10
            
        draw.rounded_rectangle([(tag_x, tag_y), (tag_x + tag_w, tag_y + tag_h)], radius=8, fill=(5, 150, 105), outline=(255, 255, 255), width=2)
        draw.text((tag_x + 14, tag_y + 11), au_callout_badge, fill=(255, 255, 255), font=f_badge_large)

    # ─── 4. BOTTOM NOTES CARD ────────────────────────────────────────────────
    y_footer = y_img + content_h + 16
    draw.rounded_rectangle(
        [(padding, y_footer), (total_w - padding, y_footer + footer_h)],
        radius=12,
        fill=(21, 27, 43),
        outline=(239, 68, 68),
        width=2
    )
    
    draw.text((padding + 24, y_footer + 16), "🔍 HOW TO RECOGNIZE THE DEFECT & WHAT DEVELOPERS MUST DO:", fill=(255, 255, 255), font=f_notes_bold)
    
    line_y = y_footer + 44
    for line in explanation_bullets:
        draw.text((padding + 24, line_y), line, fill=(254, 226, 226), font=f_notes)
        line_y += 24
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, quality=95)
    print(f"  -> Generated: {out_path}")

def generate_all():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 4 - Set up the CMS Structure'
    sec_dir = os.path.join(base_dir, 'screenshots/sections')
    au_dir = os.path.join(base_dir, 'screenshots/au_comparison')
    out_dir = os.path.join(base_dir, 'screenshots/highlighted_missing')
    os.makedirs(out_dir, exist_ok=True)
    
    # ──────────────────────────────────────────────────────────────────────────
    # 1. INSTAGRAM FEED (MISSING ON US)
    # ──────────────────────────────────────────────────────────────────────────
    create_missing_highlight_image(
        title="1. Instagram Social Feed: Completely Missing on US Store",
        cms_id="insta-us-block-home-page",
        missing_headline="Photos do not render on US store; AU displays a live 4-photo grid.",
        us_img_path=os.path.join(sec_dir, 'Section_6_insta-us-block-home-page.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_7_Instagram_Feed.png'),
        us_box_coords=(0.05, 0.15, 0.95, 0.85),
        au_box_coords=(0.05, 0.15, 0.95, 0.85),
        us_callout_badge="❌ MISSING: 0 PHOTOS DISPLAYED",
        au_callout_badge="✅ PRESENT: LIVE 4-PHOTO FEED",
        explanation_bullets=[
            "• WHAT IS MISSING: The entire image grid is blank on the US Storefront (only empty space rendered).",
            "• WHY IT IS MISSING: The developer added the template code as per AU, but the US Instagram API access token is not authorized.",
            "• DEVELOPER FIX: Connect the US Instagram Business account in Magento Admin to authorize feed image delivery."
        ],
        out_path=os.path.join(out_dir, 'HIGHLIGHTED_MISSING_1_INSTAGRAM_FEED.png')
    )

    # ──────────────────────────────────────────────────────────────────────────
    # 2. SEO TEXT CONTENT (MISSING ON US)
    # ──────────────────────────────────────────────────────────────────────────
    create_missing_highlight_image(
        title="2. SEO Text Block: Marketing Copy Missing on US Store",
        cms_id="home-us-seo-text",
        missing_headline="PageBuilder block exists but body copy is 100% empty on US Store.",
        us_img_path=os.path.join(sec_dir, 'Section_9_home-us-seo-text.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_9_SEO_Text_FullWidth.png'),
        us_box_coords=(0.05, 0.15, 0.95, 0.85),
        au_box_coords=(0.05, 0.15, 0.95, 0.85),
        us_callout_badge="❌ MISSING: 0 WORDS OF SEO COPY",
        au_callout_badge="✅ PRESENT: 3 FULL PARAGRAPHS",
        explanation_bullets=[
            "• WHAT IS MISSING: 3 paragraphs of keyword-dense SEO copywriting found on AU are completely absent on US.",
            "• SEO IMPACT: Search engines (Google/Bing) cannot index US-specific brand and furniture keywords without this content.",
            "• DEVELOPER FIX: Go to Magento Admin > Content > Blocks > home-us-seo-text and paste US-localized brand editorial copy."
        ],
        out_path=os.path.join(out_dir, 'HIGHLIGHTED_MISSING_2_SEO_TEXT.png')
    )

    # ──────────────────────────────────────────────────────────────────────────
    # 3. HERO BANNER CTA (MISSING US DESTINATION LINK)
    # ──────────────────────────────────────────────────────────────────────────
    create_missing_highlight_image(
        title="3. Hero Banner: Missing US Store URL on CTA Button",
        cms_id="main-us-banner",
        missing_headline="Explore Collections button redirects to Australia instead of US store.",
        us_img_path=os.path.join(sec_dir, 'DEFECT_Section_1_Hero_Banner_AU_Leak.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_1_Hero_Banner.png'),
        us_box_coords=(0.35, 0.45, 0.65, 0.62),
        au_box_coords=(0.35, 0.45, 0.65, 0.62),
        us_callout_badge="❌ LEAKS TO: globewest.com.au",
        au_callout_badge="✅ STAYS WITHIN STORE",
        explanation_bullets=[
            "• WHAT IS MISSING: A relative US store link (e.g. /outdoor or /collections) is missing on the primary hero button.",
            "• USER IMPACT: Clicking 'Explore Collections' navigates American shoppers directly to the Australian website.",
            "• DEVELOPER FIX: In Magento Admin > Content > Blocks > main-us-banner, change button href from globewest.com.au to /outdoor."
        ],
        out_path=os.path.join(out_dir, 'HIGHLIGHTED_MISSING_3_HERO_BANNER_US_LINK.png')
    )

    # ──────────────────────────────────────────────────────────────────────────
    # 4. CATEGORY CAROUSEL (MISSING US CATEGORY LINKS)
    # ──────────────────────────────────────────────────────────────────────────
    create_missing_highlight_image(
        title="4. Category Carousel: Missing US Category Links",
        cms_id="home-us-category-carousel",
        missing_headline="All 14 category cards link to Australian website instead of US PLPs.",
        us_img_path=os.path.join(sec_dir, 'DEFECT_Section_3_Category_Card_1_AU_Leak.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_2_Category_Carousel.png'),
        us_box_coords=(0.02, 0.18, 0.35, 0.88),
        au_box_coords=(0.02, 0.18, 0.35, 0.88),
        us_callout_badge="❌ LINKS LEAK TO: .com.au",
        au_callout_badge="✅ LOCAL AU LINKS",
        explanation_bullets=[
            "• WHAT IS MISSING: Relative US catalog paths on all 14 category cards (Living Room, Dining Room, Bedroom, Outdoor, etc.).",
            "• USER IMPACT: American buyers trying to view living or dining furniture get thrown into Australian catalog with AUD pricing.",
            "• DEVELOPER FIX: In Magento Admin > Content > Blocks > home-us-category-carousel, change card links from .com.au to relative /living-room."
        ],
        out_path=os.path.join(out_dir, 'HIGHLIGHTED_MISSING_4_CATEGORY_CAROUSEL_US_LINKS.png')
    )

    print("\nAll individual highlighted missing graphics generated successfully!")

if __name__ == '__main__':
    generate_all()
