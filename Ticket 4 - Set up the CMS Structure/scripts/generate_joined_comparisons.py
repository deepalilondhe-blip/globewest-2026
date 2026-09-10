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

def create_joined_comparison(
    sec_num,
    title,
    cms_id,
    status_type, # 'CRITICAL_DEFECT', 'DEFECT', 'MISMATCH', 'MATCH', 'INFO'
    status_text,
    us_img_path,
    au_img_path,
    defect_notes,
    out_path,
    highlight_us_box=None,
    highlight_au_box=None
):
    print(f"Generating joined comparison for Section {sec_num}: {title}...")
    
    side_w = 960
    
    us_im = Image.open(us_img_path).convert('RGB')
    au_im = Image.open(au_img_path).convert('RGB')
    
    us_w, us_h = us_im.size
    au_w, au_h = au_im.size
    
    scaled_us_h = int(us_h * (side_w / float(us_w)))
    scaled_au_h = int(au_h * (side_w / float(au_w)))
    
    content_h = max(scaled_us_h, scaled_au_h)
    content_h = min(content_h, 750)
    
    us_resized = us_im.resize((side_w, scaled_us_h), Image.Resampling.LANCZOS)
    au_resized = au_im.resize((side_w, scaled_au_h), Image.Resampling.LANCZOS)
    
    if scaled_us_h > content_h:
        us_resized = us_resized.crop((0, 0, side_w, content_h))
    elif scaled_us_h < content_h:
        new_us = Image.new('RGB', (side_w, content_h), (21, 27, 43))
        new_us.paste(us_resized, (0, (content_h - scaled_us_h) // 2))
        us_resized = new_us
        
    if scaled_au_h > content_h:
        au_resized = au_resized.crop((0, 0, side_w, content_h))
    elif scaled_au_h < content_h:
        new_au = Image.new('RGB', (side_w, content_h), (21, 27, 43))
        new_au.paste(au_resized, (0, (content_h - scaled_au_h) // 2))
        au_resized = new_au
        
    padding = 24
    header_h = 130
    footer_h = 130
    total_w = (side_w * 2) + (padding * 3)
    total_h = header_h + content_h + footer_h + (padding * 2)
    
    canvas = Image.new('RGB', (total_w, total_h), color=(11, 15, 25))
    draw = ImageDraw.Draw(canvas)
    
    f_title = get_font(24, bold=True)
    f_subtitle = get_font(15, bold=False)
    f_badge = get_font(14, bold=True)
    f_col_header = get_font(17, bold=True)
    f_notes = get_font(14, bold=False)
    f_notes_bold = get_font(14, bold=True)
    
    # Header Card
    draw.rounded_rectangle(
        [(padding, padding), (total_w - padding, padding + header_h)],
        radius=12,
        fill=(21, 27, 43),
        outline=(35, 45, 66),
        width=2
    )
    
    draw.text((padding + 24, padding + 22), f"SECTION {sec_num}: {title.upper()}", fill=(255, 255, 255), font=f_title)
    draw.text((padding + 24, padding + 62), f"Magento CMS Block: {cms_id}   |   Store Scope Audit: USA Website vs AU Baseline", fill=(148, 163, 184), font=f_subtitle)
    
    badge_colors = {
        'CRITICAL_DEFECT': ((239, 68, 68), (254, 226, 226), (127, 29, 29)),
        'DEFECT': ((245, 158, 11), (254, 243, 199), (120, 53, 15)),
        'MISMATCH': ((239, 68, 68), (254, 226, 226), (127, 29, 29)),
        'MATCH': ((16, 185, 129), (209, 250, 229), (6, 78, 59)),
        'INFO': ((59, 130, 246), (219, 234, 254), (30, 58, 138))
    }
    b_border, b_text, b_bg = badge_colors.get(status_type, ((148, 163, 184), (255, 255, 255), (30, 41, 59)))
    
    b_bbox = draw.textbbox((0, 0), status_text, font=f_badge)
    b_w = (b_bbox[2] - b_bbox[0]) + 30
    b_h = 36
    b_x = total_w - padding - 24 - b_w
    b_y = padding + 24
    
    draw.rounded_rectangle([(b_x, b_y), (b_x + b_w, b_y + b_h)], radius=18, fill=b_bg, outline=b_border, width=2)
    draw.text((b_x + 15, b_y + 9), status_text, fill=b_text, font=f_badge)
    
    # Column Headers
    y_content_start = padding + header_h + 16
    
    # Left: US
    draw.rounded_rectangle([(padding, y_content_start), (padding + side_w, y_content_start + 44)], radius=8, fill=(35, 20, 30), outline=(255, 0, 85), width=2)
    draw.text((padding + 16, y_content_start + 12), "🇺🇸 US STOREFRONT  (mcstaging2.globewest.com)", fill=(255, 80, 130), font=f_col_header)
    
    # Right: AU
    draw.rounded_rectangle([(padding + side_w + padding, y_content_start), (total_w - padding, y_content_start + 44)], radius=8, fill=(15, 30, 45), outline=(0, 210, 255), width=2)
    draw.text((padding + side_w + padding + 16, y_content_start + 12), "🇦🇺 AU STOREFRONT BASELINE  (mcstaging2.globewest.com.au)", fill=(0, 210, 255), font=f_col_header)
    
    y_img = y_content_start + 52
    
    # Pastes
    canvas.paste(us_resized, (padding, y_img))
    canvas.paste(au_resized, (padding + side_w + padding, y_img))
    
    # Defect Highlights on US image
    if highlight_us_box:
        rx1, ry1, rx2, ry2 = highlight_us_box
        sx1 = padding + int(rx1 * (side_w / float(us_w)))
        sy1 = y_img + int(ry1 * (content_h / float(us_h)))
        sx2 = padding + int(rx2 * (side_w / float(us_w)))
        sy2 = y_img + int(ry2 * (content_h / float(us_h)))
        
        draw.rectangle([(sx1, sy1), (sx2, sy2)], outline=(239, 68, 68), width=5)
        draw.rectangle([(sx1, sy1 - 28), (sx1 + 220, sy1)], fill=(239, 68, 68))
        draw.text((sx1 + 8, sy1 - 22), "🚨 DEFECT: AU LEAK", fill=(255, 255, 255), font=f_badge)
        
    # Footer Notes
    y_footer = y_img + content_h + 16
    draw.rounded_rectangle(
        [(padding, y_footer), (total_w - padding, y_footer + footer_h)],
        radius=12,
        fill=(21, 27, 43),
        outline=b_border if status_type != 'MATCH' else (35, 45, 66),
        width=2
    )
    
    draw.text((padding + 24, y_footer + 16), "QA AUDIT FINDINGS & TECHNICAL VERDICT:", fill=(255, 255, 255), font=f_notes_bold)
    
    line_y = y_footer + 42
    for line in defect_notes:
        color = (254, 202, 202) if 'DEFECT' in status_type or 'MISMATCH' in status_type else ((209, 250, 229) if status_type == 'MATCH' else (226, 232, 240))
        draw.text((padding + 24, line_y), line, fill=color, font=f_notes)
        line_y += 24
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, quality=95)
    print(f"  -> Successfully generated: {out_path}")

def generate_all_comparisons():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 4 - Set up the CMS Structure'
    sec_dir = os.path.join(base_dir, 'screenshots/sections')
    au_dir = os.path.join(base_dir, 'screenshots/au_comparison')
    out_dir = os.path.join(base_dir, 'screenshots/joined_comparisons')
    os.makedirs(out_dir, exist_ok=True)
    
    comparisons = [
        # SECTION 1: HERO BANNER (CRITICAL DEFECT)
        {
            'sec_num': 1,
            'title': 'Hero Banner Carousel',
            'cms_id': 'main-us-banner',
            'status_type': 'CRITICAL_DEFECT',
            'status_text': '🚨 P1 DEFECT: AUSTRALIAN SCOPE LEAK',
            'us_img': os.path.join(sec_dir, 'DEFECT_Section_1_Hero_Banner_AU_Leak.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_1_Hero_Banner.png'),
            'notes': [
                '• DEFECT: The primary CTA "Explore Collections" button points to "https://www.globewest.com.au" (hardcoded AU domain).',
                '• CUSTOMER IMPACT: Clicking the CTA immediately navigates US visitors off the US storefront into the Australian website.',
                '• DEVELOPER FIX: Update href in CMS block main-us-banner to relative URL (e.g., "/outdoor" or "/collections").'
            ],
            'out_name': 'COMPARE_Section_1_Hero_Banner_MISMATCH.png'
        },
        # SECTION 2: CATEGORY CAROUSEL (P2 DEFECT)
        {
            'sec_num': 2,
            'title': 'Category Navigation Carousel',
            'cms_id': 'home-us-category-carousel',
            'status_type': 'DEFECT',
            'status_text': '⚠️ P2 DEFECT: CATEGORY LINKS POINT TO AU',
            'us_img': os.path.join(sec_dir, 'DEFECT_Section_3_Category_Card_1_AU_Leak.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_2_Category_Carousel.png'),
            'notes': [
                '• DEFECT: 14 category cards render correctly, but links contain hardcoded Australian domains (e.g. Living Room -> globewest.com.au).',
                '• CUSTOMER IMPACT: US visitors browsing living, dining, or bedroom categories are thrown onto the Australian store.',
                '• DEVELOPER FIX: Change all 14 card hrefs in home-us-category-carousel to relative category paths (e.g., "/living-room").'
            ],
            'out_name': 'COMPARE_Section_2_Category_Carousel_MISMATCH.png'
        },
        # SECTION 3: ABOUT US (MATCH)
        {
            'sec_num': 3,
            'title': 'About Us Brand Story',
            'cms_id': 'home-us-page-about-us',
            'status_type': 'MATCH',
            'status_text': '✅ 100% PARITY MATCH',
            'us_img': os.path.join(sec_dir, 'Section_7_home-us-page-about-us.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_3_About_Us.png'),
            'notes': [
                '• PARITY VERIFIED: 240-character editorial copy matches AU baseline verbatim ("GlobeWest creates distinctive furniture...").',
                '• DESIGN INTEGRITY: Typography, line heights, center alignment, and responsive padding match Australian reference.',
                '• VERDICT: PASSED - Block is correctly assigned to USA Website scope.'
            ],
            'out_name': 'COMPARE_Section_3_About_Us_MATCH.png'
        },
        # SECTION 4: FIND A DESIGNER (MATCH)
        {
            'sec_num': 4,
            'title': 'Find a Designer CTA Banner',
            'cms_id': 'global-us-find-designer',
            'status_type': 'MATCH',
            'status_text': '✅ 100% PARITY MATCH',
            'us_img': os.path.join(sec_dir, 'Section_8_global-us-find-designer.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_4_Find_Designer.png'),
            'notes': [
                '• PARITY VERIFIED: Split banner layout with brand imagery and "Find a Designer" CTA button renders identically.',
                '• INTERACTIVITY: CTA button links to internal intake questionnaire (find-designer-start) matching Australian behavior.',
                '• VERDICT: PASSED - Full visual and interactive parity achieved.'
            ],
            'out_name': 'COMPARE_Section_4_Find_Designer_MATCH.png'
        },
        # SECTION 5: B2B VIDEO BLOCK (MATCH)
        {
            'sec_num': 5,
            'title': 'B2B Video Block & Player',
            'cms_id': 'home-us-video-block-b2b',
            'status_type': 'MATCH',
            'status_text': '✅ 100% PARITY MATCH',
            'us_img': os.path.join(sec_dir, 'Section_2_home-us-video-block-b2b.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_5_Video_Block.png'),
            'notes': [
                '• PARITY VERIFIED: Embedded video player and container rendered with zero JavaScript console exceptions.',
                '• RESPONSIVE INTEGRITY: Aspect ratio, overlay title, and play triggers align with AU baseline.',
                '• VERDICT: PASSED - Video block operational on US storefront.'
            ],
            'out_name': 'COMPARE_Section_5_B2B_Video_MATCH.png'
        },
        # SECTION 6: RECENT ARTICLES (MATCH)
        {
            'sec_num': 6,
            'title': 'Content Hub / Recent Journal Articles',
            'cms_id': 'homepage_us_recent_articles',
            'status_type': 'MATCH',
            'status_text': '✅ 100% PARITY MATCH',
            'us_img': os.path.join(sec_dir, 'Section_5_homepage_us_recent_articles.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_6_Recent_Articles.png'),
            'notes': [
                '• PARITY VERIFIED: 21 journal articles loaded dynamically via Magefan blog module with imagery, titles, and dates.',
                '• INTERACTIVITY: Article cards and "Read More" links route to blog entries properly.',
                '• VERDICT: PASSED - Full parity with Australian content hub.'
            ],
            'out_name': 'COMPARE_Section_6_Recent_Articles_MATCH.png'
        },
        # SECTION 7: INSTAGRAM FEED (MISMATCH / KNOWN LIMITATION)
        {
            'sec_num': 7,
            'title': 'Instagram Social Feed Grid',
            'cms_id': 'insta-us-block-home-page',
            'status_type': 'MISMATCH',
            'status_text': '⚠️ NOT MATCHING: PENDING SOCIAL TOKEN',
            'us_img': os.path.join(sec_dir, 'Section_6_insta-us-block-home-page.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_7_Instagram_Feed.png'),
            'notes': [
                '• MISMATCH: AU displays active 4-column Instagram grid. US displays an empty container (feed hidden).',
                '• DEV NOTE CONFIRMED: "The Insta feed block section isn\'t currently showing on the site — code added as per AU site."',
                '• QA VERDICT: Container exists in DOM with zero JS crashes. Ready for US Instagram API access token authorization.'
            ],
            'out_name': 'COMPARE_Section_7_Instagram_Feed_MISMATCH.png'
        },
        # SECTION 8: VISIT SHOWROOM (INFO / REGIONAL DIFFERENCE)
        {
            'sec_num': 8,
            'title': 'Visit Showroom / Trade Partner Promo',
            'cms_id': 'global-us-visit-showroom',
            'status_type': 'INFO',
            'status_text': 'ℹ️ REGIONAL SCOPE DIFFERENCE (INTENTIONAL)',
            'us_img': os.path.join(sec_dir, 'Section_4_global-us-visit-showroom.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_8_Visit_Showroom.png'),
            'notes': [
                '• REGIONAL VARIATION: AU site links to Australian physical showroom bookings (Melbourne, Sydney, Brisbane).',
                '• US BEHAVIOR: US store links to "/how-to-buy/" since GlobeWest operates via US trade partner showrooms.',
                '• QA VERDICT: Appropriate regional adaptation. Verified CTA stays within US store scope.'
            ],
            'out_name': 'COMPARE_Section_8_Visit_Showroom_INFO.png'
        },
        # SECTION 9: SEO TEXT BLOCK (MISMATCH / EMPTY)
        {
            'sec_num': 9,
            'title': 'SEO Rich Text Content',
            'cms_id': 'home-us-seo-text',
            'status_type': 'MISMATCH',
            'status_text': '⚠️ NOT MATCHING: PENDING MARKETING COPY',
            'us_img': os.path.join(sec_dir, 'Section_9_home-us-seo-text.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_9_SEO_Text_FullWidth.png'),
            'notes': [
                '• MISMATCH: AU baseline contains 3 full paragraphs of SEO copy. US PageBuilder container is currently empty.',
                '• SEO IMPACT: US storefront will lack organic search engine indexing keywords until copy is added.',
                '• REQUIRED ACTION: Content team must populate US-tailored SEO text in Magento Admin > Content > Blocks > home-us-seo-text.'
            ],
            'out_name': 'COMPARE_Section_9_SEO_Text_MISMATCH.png'
        }
    ]
    
    for c in comparisons:
        create_joined_comparison(
            sec_num=c['sec_num'],
            title=c['title'],
            cms_id=c['cms_id'],
            status_type=c['status_type'],
            status_text=c['status_text'],
            us_img_path=c['us_img'],
            au_img_path=c['au_img'],
            defect_notes=c['notes'],
            out_path=os.path.join(out_dir, c['out_name'])
        )
        
    print("\nAll 9 joined comparisons generated successfully!")

if __name__ == '__main__':
    generate_all_comparisons()
