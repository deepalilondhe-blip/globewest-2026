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
    au_box=None,
    content_h=420
):
    side_w = 900
    
    # Load or create fallback
    if os.path.exists(us_img_path):
        us_im = Image.open(us_img_path).convert('RGB')
    else:
        us_im = Image.new('RGB', (side_w, content_h), (40, 20, 20))
        d = ImageDraw.Draw(us_im)
        d.text((50, 50), f"Evidence Image: {os.path.basename(us_img_path)}", fill=(255, 100, 100))
        
    if os.path.exists(au_img_path):
        au_im = Image.open(au_img_path).convert('RGB')
    else:
        au_im = Image.new('RGB', (side_w, content_h), (20, 40, 20))
        d = ImageDraw.Draw(au_im)
        d.text((50, 50), f"Baseline Image: {os.path.basename(au_img_path)}", fill=(100, 255, 100))
    
    scaled_us_h = int(us_im.size[1] * (side_w / float(us_im.size[0]))) if us_im.size[0] > 0 else content_h
    scaled_au_h = int(au_im.size[1] * (side_w / float(au_im.size[0]))) if au_im.size[0] > 0 else content_h
    
    us_resized = us_im.resize((side_w, scaled_us_h), Image.Resampling.LANCZOS)
    au_resized = au_im.resize((side_w, scaled_au_h), Image.Resampling.LANCZOS)
    
    # Crop or pad to standard content_h
    if scaled_us_h > content_h:
        us_resized = us_resized.crop((0, 0, side_w, content_h))
    elif scaled_us_h < content_h:
        new_us = Image.new('RGB', (side_w, content_h), (18, 18, 18))
        new_us.paste(us_resized, (0, (content_h - scaled_us_h) // 2))
        us_resized = new_us
        
    if scaled_au_h > content_h:
        au_resized = au_resized.crop((0, 0, side_w, content_h))
    elif scaled_au_h < content_h:
        new_au = Image.new('RGB', (side_w, content_h), (18, 18, 18))
        new_au.paste(au_resized, (0, (content_h - scaled_au_h) // 2))
        au_resized = new_au
        
    pad = 20
    head_h = 75
    foot_h = 65
    total_w = (side_w * 2) + (pad * 3)
    total_h = head_h + content_h + foot_h + (pad * 2)
    
    img = Image.new('RGB', (total_w, total_h), (12, 12, 14))
    draw = ImageDraw.Draw(img)
    
    f_title = get_font(21, bold=True)
    f_col = get_font(16, bold=True)
    f_exp = get_font(15, bold=False)
    
    # Title
    draw.text((pad, pad + 12), f"DEFECT {defect_num}: {defect_title.upper()}", fill=(255, 255, 255), font=f_title)
    
    # Left Header: US (RED)
    draw.text((pad, pad + 45), "US STOREFRONT (DEFECT)", fill=(255, 60, 60), font=f_col)
    
    # Right Header: AU (GREEN)
    draw.text((pad + side_w + pad, pad + 45), "AU STOREFRONT (BASELINE)", fill=(40, 230, 40), font=f_col)
    
    # Paste Images
    y_img = pad + head_h
    img.paste(us_resized, (pad, y_img))
    img.paste(au_resized, (pad + side_w + pad, y_img))
    
    # Red border for US
    draw.rectangle([(pad - 4, y_img - 4), (pad + side_w + 4, y_img + content_h + 4)], outline=(255, 40, 40), width=5)
    
    # Green border for AU
    draw.rectangle([(pad + side_w + pad - 4, y_img - 4), (total_w - pad + 4, y_img + content_h + 4)], outline=(30, 220, 30), width=5)
    
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
    draw.text((pad, y_foot), f"Defect: {one_line_explanation}", fill=(240, 240, 240), font=f_exp)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, quality=95)
    print(f"Generated single defect comparison: {out_path}")
    return img

def create_one_combined_master(single_images, out_path):
    w = single_images[0].size[0]
    pad = 20
    top_banner_h = 70
    total_h = top_banner_h + sum(im.size[1] + 16 for im in single_images) + pad
    
    master = Image.new('RGB', (w, total_h), (10, 10, 12))
    draw = ImageDraw.Draw(master)
    
    f_main = get_font(24, bold=True)
    f_sub = get_font(16, bold=False)
    draw.text((pad, pad + 10), "TICKET 5: HEADER & MEGA MENU STOREFRONT DEFECT COMPARISON AUDIT", fill=(255, 255, 255), font=f_main)
    draw.text((pad, pad + 40), "Target: https://mcstaging2.globewest.com (RED)  |  Baseline: https://mcstaging2.globewest.com.au (GREEN)", fill=(180, 180, 180), font=f_sub)
    
    curr_y = top_banner_h + pad
    for im in single_images:
        master.paste(im, (0, curr_y))
        curr_y += im.size[1] + 16
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    master.save(out_path, quality=92)
    print(f"Generated ONE master combined defect image: {out_path}")

def run():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 5 - Header'
    sec_dir = os.path.join(base_dir, 'screenshots/sections')
    au_dir = os.path.join(base_dir, 'screenshots/au_comparison')
    out_dir = os.path.join(base_dir, 'comparison')
    os.makedirs(out_dir, exist_ok=True)
    
    defects = [
        {
            'num': 1,
            'title': 'Mega Menu Outlet Links Leak to Australian Store',
            'exp': 'The "Outlet" link inside the US Mega Menu hardcodes https://globewestoutlet.com.au/collections/indoor instead of US catalog.',
            'us_img': os.path.join(sec_dir, 'DEFECT_Mega_Menu_Outlet_AU_Leak.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_Mega_Menu_Indoor.png'),
            'us_box': (0.01, 0.40, 0.32, 0.54),
            'au_box': None,
            'content_h': 420,
            'file': 'DEFECT_1_MEGA_MENU_OUTLET_AU_LEAK.png'
        },
        {
            'num': 2,
            'title': 'Melbourne Physical Outlet Store Link in Navigation',
            'exp': 'US navigation contains a hardcoded link to the Melbourne Outlet Store (https://globewestoutlet.com.au/pages/melbourne-outlet-store).',
            'us_img': os.path.join(sec_dir, 'DEFECT_Melbourne_Outlet_Store_Leak.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_Mega_Menu_Indoor.png'),
            'us_box': (0.01, 0.40, 0.32, 0.54),
            'au_box': None,
            'content_h': 420,
            'file': 'DEFECT_2_MELBOURNE_OUTLET_LINK_LEAK.png'
        },
        {
            'num': 3,
            'title': 'Top Utility Bar "Find a Designer" Missing',
            'exp': 'The US storefront top bar is missing the "Find a designer or stockist" service links present on the Australian baseline header.',
            'us_img': os.path.join(sec_dir, 'DEFECT_Top_Bar_Find_Designer_Missing.png'),
            'au_img': os.path.join(au_dir, 'AU_Top_Bar_Baseline.png'),
            'us_box': (0.01, 0.15, 0.30, 0.70),
            'au_box': (0.01, 0.15, 0.30, 0.70),
            'content_h': 160,
            'file': 'DEFECT_3_TOP_BAR_FIND_DESIGNER_MISSING.png'
        },
        {
            'num': 4,
            'title': 'Mega Menu Editorial Promo Banner Mismatch',
            'exp': 'US Mega Menu renders an unpopulated "GW Coming Soon" placeholder instead of the live editorial campaign featured on AU.',
            'us_img': os.path.join(sec_dir, 'Section_Mega_Menu_Promo_US.png'),
            'au_img': os.path.join(au_dir, 'AU_Section_Mega_Menu_Promo.png'),
            'us_box': None,
            'au_box': None,
            'content_h': 400,
            'file': 'DEFECT_4_MEGA_MENU_PROMO_BANNER_MISMATCH.png'
        }
    ]
    
    generated_images = []
    for d in defects:
        out_f = os.path.join(out_dir, d['file'])
        im = create_simple_single_defect(
            defect_num=d['num'],
            defect_title=d['title'],
            one_line_explanation=d['exp'],
            us_img_path=d['us_img'],
            au_img_path=d['au_img'],
            out_path=out_f,
            us_box=d.get('us_box'),
            au_box=d.get('au_box'),
            content_h=d.get('content_h', 420)
        )
        generated_images.append(im)
        
    master_path = os.path.join(out_dir, 'ONE_COMBINED_HEADER_DEFECTS_COMPARISON.png')
    create_one_combined_master(generated_images, master_path)

if __name__ == '__main__':
    run()
