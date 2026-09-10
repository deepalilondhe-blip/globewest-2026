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

def create_simple_single_defect(
    defect_num,
    defect_title,
    one_line_explanation,
    us_img_path,
    au_img_path,
    out_path,
    us_box=None,
    au_box=None
):
    side_w = 880
    content_h = 420
    
    us_im = Image.open(us_img_path).convert('RGB')
    au_im = Image.open(au_img_path).convert('RGB')
    
    scaled_us_h = int(us_im.size[1] * (side_w / float(us_im.size[0])))
    scaled_au_h = int(au_im.size[1] * (side_w / float(au_im.size[0])))
    
    us_resized = us_im.resize((side_w, scaled_us_h), Image.Resampling.LANCZOS)
    au_resized = au_im.resize((side_w, scaled_au_h), Image.Resampling.LANCZOS)
    
    # Crop or pad to standard content_h
    if scaled_us_h > content_h:
        us_resized = us_resized.crop((0, 0, side_w, content_h))
    elif scaled_us_h < content_h:
        new_us = Image.new('RGB', (side_w, content_h), (20, 20, 20))
        new_us.paste(us_resized, (0, (content_h - scaled_us_h) // 2))
        us_resized = new_us
        
    if scaled_au_h > content_h:
        au_resized = au_resized.crop((0, 0, side_w, content_h))
    elif scaled_au_h < content_h:
        new_au = Image.new('RGB', (side_w, content_h), (20, 20, 20))
        new_au.paste(au_resized, (0, (content_h - scaled_au_h) // 2))
        au_resized = new_au
        
    pad = 20
    head_h = 70
    foot_h = 60
    total_w = (side_w * 2) + (pad * 3)
    total_h = head_h + content_h + foot_h + (pad * 2)
    
    img = Image.new('RGB', (total_w, total_h), (12, 12, 12))
    draw = ImageDraw.Draw(img)
    
    f_title = get_font(20, bold=True)
    f_col = get_font(16, bold=True)
    f_exp = get_font(15, bold=False)
    
    # Header
    draw.text((pad, pad + 15), f"DEFECT {defect_num}: {defect_title.upper()}", fill=(255, 255, 255), font=f_title)
    
    # Left Header: US (RED)
    draw.text((pad, pad + 45), "US STOREFRONT (DEFECT)", fill=(255, 0, 0), font=f_col)
    
    # Right Header: AU (GREEN)
    draw.text((pad + side_w + pad, pad + 45), "AU STOREFRONT (BASELINE)", fill=(0, 255, 0), font=f_col)
    
    # Paste Images
    y_img = pad + head_h
    img.paste(us_resized, (pad, y_img))
    img.paste(au_resized, (pad + side_w + pad, y_img))
    
    # Red border for US
    draw.rectangle([(pad - 3, y_img - 3), (pad + side_w + 3, y_img + content_h + 3)], outline=(255, 0, 0), width=4)
    
    # Green border for AU
    draw.rectangle([(pad + side_w + pad - 3, y_img - 3), (total_w - pad + 3, y_img + content_h + 3)], outline=(0, 255, 0), width=4)
    
    # Optional specific element highlight boxes
    if us_box:
        ux1 = pad + int(us_box[0] * side_w)
        uy1 = y_img + int(us_box[1] * content_h)
        ux2 = pad + int(us_box[2] * side_w)
        uy2 = y_img + int(us_box[3] * content_h)
        draw.rectangle([(ux1, uy1), (ux2, uy2)], outline=(255, 0, 0), width=4)
        
    if au_box:
        ax1 = pad + side_w + pad + int(au_box[0] * side_w)
        ay1 = y_img + int(au_box[1] * content_h)
        ax2 = pad + side_w + pad + int(au_box[2] * side_w)
        ay2 = y_img + int(au_box[3] * content_h)
        draw.rectangle([(ax1, ay1), (ax2, ay2)], outline=(0, 255, 0), width=4)
        
    # 1 Line Explanation at bottom
    y_foot = y_img + content_h + 18
    draw.text((pad, y_foot), f"Defect: {one_line_explanation}", fill=(255, 255, 255), font=f_exp)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, quality=95)
    print(f"Generated single defect image: {out_path}")
    return img

def create_one_combined_master(single_images, explanations, titles, out_path):
    # Combine all defect comparisons vertically into exactly ONE master comparison image
    w = single_images[0].size[0]
    pad = 20
    top_banner_h = 60
    total_h = top_banner_h + sum(im.size[1] + 15 for im in single_images) + pad
    
    master = Image.new('RGB', (w, total_h), (10, 10, 10))
    draw = ImageDraw.Draw(master)
    
    f_main = get_font(24, bold=True)
    draw.text((pad, pad + 10), "STOREFRONT DEFECT AUDIT: US STOREFRONT (RED) vs AU BASELINE (GREEN)", fill=(255, 255, 255), font=f_main)
    
    curr_y = top_banner_h + pad
    for im in single_images:
        master.paste(im, (0, curr_y))
        curr_y += im.size[1] + 15
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    master.save(out_path, quality=92)
    print(f"Generated ONE master combined defect image: {out_path}")

def run():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 4 - Set up the CMS Structure'
    sec_dir = os.path.join(base_dir, 'screenshots/sections')
    au_dir = os.path.join(base_dir, 'screenshots/au_comparison')
    out_dir = os.path.join(base_dir, 'screenshots/simple_defect_reports')
    os.makedirs(out_dir, exist_ok=True)
    
    # Crop user screenshot for Defect 5 to preserve status bar
    user_screen = '/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/.user_uploaded/media_1789033963791.png'
    us_hover_crop_path = os.path.join(sec_dir, 'TC_US_Hover_Status_Leak.png')
    if os.path.exists(user_screen):
        src_im = Image.open(user_screen)
        cropped = src_im.crop((0, 85, 1024, 578))
        cropped.save(us_hover_crop_path)
    
    defects = [
        {
            'num': 1,
            'title': 'Hero Banner CTA Link',
            'exp': 'Hero banner CTA button links to https://www.globewest.com.au instead of the US storefront.',
            'us_img': os.path.join(sec_dir, 'DEFECT_Section_1_Hero_Banner_AU_Leak.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_1_Hero_Banner.png'),
            'us_box': (0.32, 0.42, 0.68, 0.62),
            'us_box_label': None,
            'au_box': (0.32, 0.42, 0.68, 0.62),
            'file': 'DEFECT_1_HERO_BANNER_CTA.png'
        },
        {
            'num': 2,
            'title': 'Category Carousel Routing',
            'exp': 'All 14 category carousel cards link to Australian URLs instead of US category pages.',
            'us_img': os.path.join(sec_dir, 'DEFECT_Section_3_Category_Card_1_AU_Leak.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_2_Category_Carousel.png'),
            'us_box': (0.02, 0.15, 0.35, 0.88),
            'us_box_label': None,
            'au_box': (0.02, 0.15, 0.35, 0.88),
            'file': 'DEFECT_2_CATEGORY_CAROUSEL.png'
        },
        {
            'num': 3,
            'title': 'Instagram Social Feed',
            'exp': 'Instagram feed section is completely blank on US storefront awaiting API token authorization.',
            'us_img': os.path.join(sec_dir, 'Section_6_insta-us-block-home-page.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_7_Instagram_Feed.png'),
            'us_box': (0.05, 0.15, 0.95, 0.85),
            'us_box_label': None,
            'au_box': (0.05, 0.15, 0.95, 0.85),
            'file': 'DEFECT_3_INSTAGRAM_FEED.png'
        },
        {
            'num': 4,
            'title': 'SEO Text Content',
            'exp': 'SEO text container above footer has 0 words of copy and lacks marketing text.',
            'us_img': os.path.join(sec_dir, 'Section_9_home-us-seo-text.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_9_SEO_Text_FullWidth.png'),
            'us_box': (0.05, 0.15, 0.95, 0.85),
            'us_box_label': None,
            'au_box': (0.05, 0.15, 0.95, 0.85),
            'file': 'DEFECT_4_SEO_TEXT.png'
        },
        {
            'num': 5,
            'title': 'Hero Banner Hover Link Leak',
            'exp': 'Hovering over Hero Banner CTA shows Australian URL (https://www.globewest.com.au) instead of US store.',
            'us_img': us_hover_crop_path,
            'au_img': os.path.join(au_dir, 'AU_Section_1_Hero_Banner.png'),
            'us_box': (0.005, 0.89, 0.22, 0.99),
            'us_box_label': 'AU LEAK: globewest.com.au',
            'au_box': (0.32, 0.42, 0.68, 0.62),
            'file': 'DEFECT_5_HERO_BANNER_HOVER.png'
        }
    ]
    
    generated_images = []
    exps = []
    titles = []
    
    for d in defects:
        out_p = os.path.join(out_dir, d['file'])
        im = create_simple_single_defect(
            defect_num=d['num'],
            defect_title=d['title'],
            one_line_explanation=d['exp'],
            us_img_path=d['us_img'],
            au_img_path=d['au_img'],
            out_path=out_p,
            us_box=d['us_box'],
            au_box=d['au_box']
        )
        generated_images.append(im)
        exps.append(d['exp'])
        titles.append(d['title'])
        
    master_path = os.path.join(out_dir, 'ONE_COMBINED_DEFECTS_COMPARISON.png')
    create_one_combined_master(generated_images, exps, titles, master_path)
    print("Completed simple defect image generation.")

if __name__ == '__main__':
    run()
