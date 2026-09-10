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

def draw_dashed_box(draw, box, color, width=4, dash=12, space=6):
    x1, y1, x2, y2 = box
    for x in range(x1, x2, dash + space):
        draw.line([(x, y1), (min(x + dash, x2), y1)], fill=color, width=width)
        draw.line([(x, y2), (min(x + dash, x2), y2)], fill=color, width=width)
    for y in range(y1, y2, dash + space):
        draw.line([(x1, y), (x1, min(y + dash, y2))], fill=color, width=width)
        draw.line([(x2, y), (x2, min(y + dash, y2))], fill=color, width=width)

def build_showing_vs_not_showing(
    component_name,
    cms_id,
    us_img_path,
    au_img_path,
    us_highlight_rect,    # (x1, y1, x2, y2) in 0.0 - 1.0 relative
    au_highlight_rect,    # (x1, y1, x2, y2) in 0.0 - 1.0 relative
    what_is_showing_text, # text explaining what is showing on AU
    what_is_not_showing_text, # text explaining what is NOT showing on US
    bullet_points,
    out_path
):
    print(f"Building Showing vs Not Showing Graphic: {component_name}...")
    
    side_w = 980
    
    us_im = Image.open(us_img_path).convert('RGB')
    au_im = Image.open(au_img_path).convert('RGB')
    
    us_w, us_h = us_im.size
    au_w, au_h = au_im.size
    
    scaled_us_h = int(us_h * (side_w / float(us_w)))
    scaled_au_h = int(au_h * (side_w / float(au_w)))
    
    content_h = max(scaled_us_h, scaled_au_h)
    content_h = min(content_h, 680)
    content_h = max(content_h, 420)
    
    us_resized = us_im.resize((side_w, scaled_us_h), Image.Resampling.LANCZOS)
    au_resized = au_im.resize((side_w, scaled_au_h), Image.Resampling.LANCZOS)
    
    if scaled_us_h > content_h:
        us_resized = us_resized.crop((0, 0, side_w, content_h))
    elif scaled_us_h < content_h:
        new_us = Image.new('RGB', (side_w, content_h), (18, 22, 34))
        new_us.paste(us_resized, (0, (content_h - scaled_us_h) // 2))
        us_resized = new_us
        
    if scaled_au_h > content_h:
        au_resized = au_resized.crop((0, 0, side_w, content_h))
    elif scaled_au_h < content_h:
        new_au = Image.new('RGB', (side_w, content_h), (18, 22, 34))
        new_au.paste(au_resized, (0, (content_h - scaled_au_h) // 2))
        au_resized = new_au
        
    padding = 24
    header_h = 135
    footer_h = 135
    total_w = (side_w * 2) + (padding * 3)
    total_h = header_h + content_h + footer_h + (padding * 2)
    
    canvas = Image.new('RGB', (total_w, total_h), color=(8, 12, 20))
    draw = ImageDraw.Draw(canvas)
    
    f_title = get_font(25, bold=True)
    f_sub = get_font(15, bold=False)
    f_col = get_font(18, bold=True)
    f_badge = get_font(16, bold=True)
    f_callout = get_font(15, bold=True)
    f_body = get_font(14, bold=False)
    
    # ─── HEADER ─────────────────────────────────────────────────────────────
    draw.rounded_rectangle(
        [(padding, padding), (total_w - padding, padding + header_h)],
        radius=12,
        fill=(20, 25, 40),
        outline=(239, 68, 68),
        width=2
    )
    
    draw.text((padding + 24, padding + 20), f"VISUAL RECOGNITION: {component_name.upper()}", fill=(255, 255, 255), font=f_title)
    draw.text((padding + 24, padding + 58), f"CMS Block: {cms_id}   |   Visual Comparison: One Site Showing vs One Site NOT Showing", fill=(148, 163, 184), font=f_sub)
    draw.text((padding + 24, padding + 88), "👉 Notice the green box (SHOWING on AU) compared to the red box (NOT SHOWING on US)", fill=(253, 224, 71), font=f_callout)
    
    # Header tag
    h_tag = "👀 SHOWING vs NOT SHOWING"
    h_bbox = draw.textbbox((0, 0), h_tag, font=f_badge)
    ht_w = (h_bbox[2] - h_bbox[0]) + 28
    draw.rounded_rectangle([(total_w - padding - 24 - ht_w, padding + 20), (total_w - padding - 24, padding + 58)], radius=18, fill=(185, 28, 28), outline=(239, 68, 68), width=2)
    draw.text((total_w - padding - 24 - ht_w + 14, padding + 27), h_tag, fill=(255, 255, 255), font=f_badge)

    # ─── COLUMNS ────────────────────────────────────────────────────────────
    y_content_start = padding + header_h + 16
    
    # Left Header: US (RED)
    draw.rounded_rectangle([(padding, y_content_start), (padding + side_w, y_content_start + 48)], radius=8, fill=(45, 12, 20), outline=(239, 68, 68), width=3)
    draw.text((padding + 20, y_content_start + 12), "🔴 🇺🇸 US STOREFRONT: NOT SHOWING (MISSING)", fill=(255, 110, 130), font=f_col)
    
    # Right Header: AU (GREEN)
    draw.rounded_rectangle([(padding + side_w + padding, y_content_start), (total_w - padding, y_content_start + 48)], radius=8, fill=(10, 40, 25), outline=(16, 185, 129), width=3)
    draw.text((padding + side_w + padding + 20, y_content_start + 12), "🟢 🇦🇺 AU BASELINE: SHOWING (PRESENT HERE)", fill=(52, 211, 153), font=f_col)

    # ─── IMAGES & CALLOUT BOXES ─────────────────────────────────────────────
    y_img = y_content_start + 56
    
    canvas.paste(us_resized, (padding, y_img))
    canvas.paste(au_resized, (padding + side_w + padding, y_img))
    
    # US Highlight: NOT SHOWING (Red Box + Red Badge)
    if us_highlight_rect:
        ux1 = padding + int(us_highlight_rect[0] * side_w)
        uy1 = y_img + int(us_highlight_rect[1] * content_h)
        ux2 = padding + int(us_highlight_rect[2] * side_w)
        uy2 = y_img + int(us_highlight_rect[3] * content_h)
        
        # Red Glowing Box
        draw.rectangle([(ux1 - 4, uy1 - 4), (ux2 + 4, uy2 + 4)], outline=(255, 50, 50), width=3)
        draw.rectangle([(ux1, uy1), (ux2, uy2)], outline=(239, 68, 68), width=5)
        draw_dashed_box(draw, (ux1 + 6, uy1 + 6, ux2 - 6, uy2 - 6), (255, 230, 0), width=3)
        
        # Badge
        badge_w = 460
        badge_h = 44
        by = max(y_img + 10, uy1 - 50)
        if by < y_img:
            by = uy1 + 10
        draw.rounded_rectangle([(ux1, by), (ux1 + badge_w, by + badge_h)], radius=8, fill=(220, 38, 38), outline=(255, 255, 255), width=2)
        draw.text((ux1 + 14, by + 11), f"🔴 NOT SHOWING: {what_is_not_showing_text}", fill=(255, 255, 255), font=f_callout)

    # AU Highlight: SHOWING (Green Box + Green Badge)
    if au_highlight_rect:
        ax1 = padding + side_w + padding + int(au_highlight_rect[0] * side_w)
        ay1 = y_img + int(au_highlight_rect[1] * content_h)
        ax2 = padding + side_w + padding + int(au_highlight_rect[2] * side_w)
        ay2 = y_img + int(au_highlight_rect[3] * content_h)
        
        # Green Glowing Box
        draw.rectangle([(ax1 - 3, ay1 - 3), (ax2 + 3, ay2 + 3)], outline=(52, 211, 153), width=2)
        draw.rectangle([(ax1, ay1), (ax2, ay2)], outline=(16, 185, 129), width=5)
        
        # Badge
        badge_w = 460
        badge_h = 44
        by = max(y_img + 10, ay1 - 50)
        if by < y_img:
            by = ay1 + 10
        draw.rounded_rectangle([(ax1, by), (ax1 + badge_w, by + badge_h)], radius=8, fill=(5, 150, 105), outline=(255, 255, 255), width=2)
        draw.text((ax1 + 14, by + 11), f"🟢 SHOWING HERE: {what_is_showing_text}", fill=(255, 255, 255), font=f_callout)

    # ─── FOOTER ─────────────────────────────────────────────────────────────
    y_footer = y_img + content_h + 16
    draw.rounded_rectangle(
        [(padding, y_footer), (total_w - padding, y_footer + footer_h)],
        radius=12,
        fill=(20, 25, 40),
        outline=(239, 68, 68),
        width=2
    )
    
    draw.text((padding + 24, y_footer + 16), "🎯 HOW TO SPOT THE DEFECT & DEVELOPER RESOLUTION:", fill=(255, 255, 255), font=f_callout)
    
    line_y = y_footer + 44
    for line in bullet_points:
        draw.text((padding + 24, line_y), line, fill=(254, 226, 226), font=f_body)
        line_y += 24
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, quality=95)
    print(f"  -> Generated: {out_path}")

def run():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 4 - Set up the CMS Structure'
    sec_dir = os.path.join(base_dir, 'screenshots/sections')
    au_dir = os.path.join(base_dir, 'screenshots/au_comparison')
    out_dir = os.path.join(base_dir, 'screenshots/showing_vs_not_showing')
    os.makedirs(out_dir, exist_ok=True)

    # ──────────────────────────────────────────────────────────────────────────
    # 1. INSTAGRAM FEED: INSTAGRAM ICON & HEADER (SHOWING ON AU vs NOT SHOWING ON US)
    # ──────────────────────────────────────────────────────────────────────────
    build_showing_vs_not_showing(
        component_name="Instagram Social Feed & Icon",
        cms_id="insta-us-block-home-page",
        us_img_path=os.path.join(sec_dir, 'Section_6_insta-us-block-home-page.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_7_Instagram_Feed.png'),
        us_highlight_rect=(0.04, 0.12, 0.96, 0.88),
        au_highlight_rect=(0.04, 0.12, 0.96, 0.88),
        what_is_showing_text="Instagram Icon + @Globewest + Photos",
        what_is_not_showing_text="Icon, Header & Photos 100% Blank",
        bullet_points=[
            "• ON AU (GREEN BOX): The Instagram camera icon, '@Globewest' handle, and 'Be Inspired' text ARE SHOWING clearly.",
            "• ON US (RED BOX): The Instagram icon, '@Globewest' handle, text, and photos ARE NOT SHOWING AT ALL (completely blank space).",
            "• WHY: Developer added block HTML, but US Instagram social API token is unauthorized. Requires token authorization."
        ],
        out_path=os.path.join(out_dir, 'SHOWING_VS_NOT_SHOWING_1_INSTAGRAM_ICON_FEED.png')
    )

    # ──────────────────────────────────────────────────────────────────────────
    # 2. SEO TEXT PARAGRAPHS (SHOWING ON AU vs NOT SHOWING ON US)
    # ──────────────────────────────────────────────────────────────────────────
    build_showing_vs_not_showing(
        component_name="SEO Rich Text Content",
        cms_id="home-us-seo-text",
        us_img_path=os.path.join(sec_dir, 'Section_9_home-us-seo-text.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_9_SEO_Text_FullWidth.png'),
        us_highlight_rect=(0.04, 0.12, 0.96, 0.88),
        au_highlight_rect=(0.04, 0.12, 0.96, 0.88),
        what_is_showing_text="3 Full Paragraphs of SEO Copy",
        what_is_not_showing_text="0 Words of Copy (Completely Empty)",
        bullet_points=[
            "• ON AU (GREEN BOX): 3 extensive paragraphs of SEO copywriting ARE SHOWING ('Australian Living Furniture & Homewares...').",
            "• ON US (RED BOX): The text IS NOT SHOWING AT ALL (PageBuilder container exists above footer, but has 0 words).",
            "• FIX: Content team must paste US-localized brand and keyword copy into Magento Admin > Blocks > home-us-seo-text."
        ],
        out_path=os.path.join(out_dir, 'SHOWING_VS_NOT_SHOWING_2_SEO_TEXT.png')
    )

    # ──────────────────────────────────────────────────────────────────────────
    # 3. HERO BANNER CTA LINK (SHOWING LOCAL AU vs NOT SHOWING US LINK)
    # ──────────────────────────────────────────────────────────────────────────
    build_showing_vs_not_showing(
        component_name="Hero Banner CTA Link Routing",
        cms_id="main-us-banner",
        us_img_path=os.path.join(sec_dir, 'DEFECT_Section_1_Hero_Banner_AU_Leak.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_1_Hero_Banner.png'),
        us_highlight_rect=(0.32, 0.42, 0.68, 0.65),
        au_highlight_rect=(0.32, 0.42, 0.68, 0.65),
        what_is_showing_text="Local Store Link (Stays on Site)",
        what_is_not_showing_text="US Link NOT SHOWING (Leaks to .com.au)",
        bullet_points=[
            "• ON AU (GREEN BOX): The Explore Collections button links within the Australian store.",
            "• ON US (RED BOX): A US store link IS NOT SHOWING. Instead, it leaks to 'https://www.globewest.com.au'.",
            "• FIX: In Magento Admin > Blocks > main-us-banner, update button href from globewest.com.au to relative /outdoor."
        ],
        out_path=os.path.join(out_dir, 'SHOWING_VS_NOT_SHOWING_3_HERO_BANNER_LINK.png')
    )

    # ──────────────────────────────────────────────────────────────────────────
    # 4. CATEGORY CAROUSEL LINKS (SHOWING LOCAL AU vs NOT SHOWING US PATHS)
    # ──────────────────────────────────────────────────────────────────────────
    build_showing_vs_not_showing(
        component_name="Category Carousel Card Routing",
        cms_id="home-us-category-carousel",
        us_img_path=os.path.join(sec_dir, 'DEFECT_Section_3_Category_Card_1_AU_Leak.png'),
        au_img_path=os.path.join(au_dir, 'AU_Section_2_Category_Carousel.png'),
        us_highlight_rect=(0.02, 0.15, 0.38, 0.90),
        au_highlight_rect=(0.02, 0.15, 0.38, 0.90),
        what_is_showing_text="Local Store Category Routing",
        what_is_not_showing_text="US Paths NOT SHOWING (Hardcoded .com.au)",
        bullet_points=[
            "• ON AU (GREEN BOX): Category cards link within the local store catalog.",
            "• ON US (RED BOX): US category links ARE NOT SHOWING. All 14 cards point to Australian URLs.",
            "• FIX: In Magento Admin > Blocks > home-us-category-carousel, change hrefs to relative paths (/living-room, etc.)."
        ],
        out_path=os.path.join(out_dir, 'SHOWING_VS_NOT_SHOWING_4_CATEGORY_CAROUSEL_LINKS.png')
    )

    # ─── MASTER COMPOSITE POSTER ─────────────────────────────────────────────
    files = [
        'SHOWING_VS_NOT_SHOWING_1_INSTAGRAM_ICON_FEED.png',
        'SHOWING_VS_NOT_SHOWING_2_SEO_TEXT.png',
        'SHOWING_VS_NOT_SHOWING_3_HERO_BANNER_LINK.png',
        'SHOWING_VS_NOT_SHOWING_4_CATEGORY_CAROUSEL_LINKS.png'
    ]
    loaded = [Image.open(os.path.join(out_dir, f)) for f in files]
    target_w = 1600
    resized = []
    for im in loaded:
        h = int(im.size[1] * (target_w / float(im.size[0])))
        resized.append(im.resize((target_w, h), Image.Resampling.LANCZOS))
        
    header_h = 160
    padding = 24
    total_h = header_h + sum(im.size[1] + padding for im in resized) + padding
    master = Image.new('RGB', (target_w + padding * 2, total_h), (8, 12, 20))
    d = ImageDraw.Draw(master)
    
    f_master_t = get_font(32, bold=True)
    f_master_s = get_font(17, bold=False)
    
    d.rounded_rectangle([(padding, padding), (target_w + padding, padding + header_h - 15)], radius=12, fill=(20, 25, 40), outline=(239, 68, 68), width=3)
    d.text((padding + 30, padding + 25), "MASTER GUIDE: WHAT IS SHOWING vs WHAT IS NOT SHOWING", fill=(255, 255, 255), font=f_master_t)
    d.text((padding + 30, padding + 75), "🟢 GREEN BOX: Showing on AU Baseline   |   🔴 RED BOX: NOT Showing on US Storefront (Missing)", fill=(253, 224, 71), font=f_master_s)
    d.text((padding + 30, padding + 110), "Direct side-by-side recognition for Instagram Icon/Feed, SEO Copy, and Store Link Routing", fill=(203, 213, 225), font=f_master_s)
    
    curr_y = header_h + padding + 10
    for im in resized:
        master.paste(im, (padding, curr_y))
        curr_y += im.size[1] + padding
        
    master_path = os.path.join(out_dir, 'MASTER_SHOWING_VS_NOT_SHOWING.png')
    master.save(master_path, quality=92)
    print(f"  -> Generated Master: {master_path}")

if __name__ == '__main__':
    run()
