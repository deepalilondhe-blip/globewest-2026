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
    
    if not os.path.exists(us_img_path) or not os.path.exists(au_img_path):
        print(f"Skipping defect {defect_num}: files missing ({us_img_path}, {au_img_path})")
        return None
        
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
    valid_images = [im for im in single_images if im is not None]
    if not valid_images:
        print("No images to combine into master.")
        return
        
    w = valid_images[0].size[0]
    pad = 20
    top_banner_h = 60
    total_h = top_banner_h + sum(im.size[1] + 15 for im in valid_images) + pad
    
    master = Image.new('RGB', (w, total_h), (10, 10, 10))
    draw = ImageDraw.Draw(master)
    
    f_main = get_font(24, bold=True)
    draw.text((pad, pad + 10), "PLP DEFECT AUDIT: US STOREFRONT (RED) vs AU BASELINE (GREEN)", fill=(255, 255, 255), font=f_main)
    
    curr_y = top_banner_h + pad
    for im in valid_images:
        master.paste(im, (0, curr_y))
        curr_y += im.size[1] + 15
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    master.save(out_path, quality=92)
    print(f"Generated ONE master combined PLP defect image: {out_path}")

def run():
    base_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page'
    sec_dir = os.path.join(base_dir, 'screenshots/sections')
    au_dir = os.path.join(base_dir, 'screenshots/au_comparison')
    out_dir = os.path.join(base_dir, 'screenshots/simple_defect_reports')
    os.makedirs(out_dir, exist_ok=True)
    
    defects = [
        {
            'num': 1,
            'title': 'Category Title & Breadcrumbs',
            'exp': 'Category header and breadcrumbs cross-checked for Australian domain leakage and text parity.',
            'us_img': os.path.join(sec_dir, 'PLP_Section_1_Title_US.png'),
            'au_img': os.path.join(au_dir, 'PLP_Section_1_Title_AU.png'),
            'us_box': (0.05, 0.1, 0.95, 0.9),
            'au_box': (0.05, 0.1, 0.95, 0.9),
            'file': 'DEFECT_PLP_1_TITLE_BREADCRUMBS.png'
        },
        {
            'num': 2,
            'title': 'Filter Toolbar & Facets',
            'exp': 'US catalog displays 38 filter facets versus 48 facets on AU catalog (10 filter facets missing on US storefront).',
            'us_img': os.path.join(sec_dir, 'PLP_Section_3_Filters_US.png'),
            'au_img': os.path.join(au_dir, 'PLP_Section_3_Filters_AU.png'),
            'us_box': (0.02, 0.05, 0.98, 0.95),
            'au_box': (0.02, 0.05, 0.98, 0.95),
            'file': 'DEFECT_PLP_2_FILTERS.png'
        },
        {
            'num': 3,
            'title': 'Product Cards & Scope Routing',
            'exp': 'Product card anchor links audited to prevent scope leaks to Australian live domain (globewest.com.au).',
            'us_img': os.path.join(sec_dir, 'PLP_Section_5_Product_Grid_US.png'),
            'au_img': os.path.join(au_dir, 'PLP_Section_5_Product_Grid_AU.png'),
            'us_box': (0.05, 0.1, 0.95, 0.9),
            'au_box': (0.05, 0.1, 0.95, 0.9),
            'file': 'DEFECT_PLP_3_PRODUCT_CARD_ROUTING.png'
        },
        {
            'num': 4,
            'title': 'Pricing & Currency Display',
            'exp': 'Product prices verified to ensure US Dollar pricing ($) without Australian Dollar currency labels.',
            'us_img': os.path.join(sec_dir, 'PLP_Section_6_Pricing_US.png'),
            'au_img': os.path.join(au_dir, 'PLP_Section_6_Pricing_AU.png'),
            'us_box': (0.05, 0.2, 0.95, 0.8),
            'au_box': (0.05, 0.2, 0.95, 0.8),
            'file': 'DEFECT_PLP_4_PRICING_CURRENCY.png'
        },
        {
            'num': 5,
            'title': 'Bottom Category Editorial SEO Text',
            'exp': 'US storefront contains unreplaced placeholder text "Sofas SEO Text to go here" (Lorem Ipsum) pending production copy.',
            'us_img': os.path.join(sec_dir, 'PLP_Section_9_SEO_Text_US.png'),
            'au_img': os.path.join(au_dir, 'PLP_Section_9_SEO_Text_AU.png'),
            'us_box': (0.05, 0.1, 0.95, 0.9),
            'au_box': (0.05, 0.1, 0.95, 0.9),
            'file': 'DEFECT_PLP_5_SEO_TEXT.png'
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
        if im is not None:
            generated_images.append(im)
            exps.append(d['exp'])
            titles.append(d['title'])
        
    master_path = os.path.join(out_dir, 'ONE_COMBINED_PLP_DEFECTS_COMPARISON.png')
    create_one_combined_master(generated_images, exps, titles, master_path)

    # Sync to GlobeWest 2026 directory and IDE brain artifacts
    import shutil
    gw_out_dir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/PLP page/screenshots/simple_defect_reports'
    brain_out_dir = '/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports'
    for dest_dir in [gw_out_dir, brain_out_dir]:
        os.makedirs(dest_dir, exist_ok=True)
        for fname in os.listdir(out_dir):
            if fname.endswith('.png'):
                shutil.copy2(os.path.join(out_dir, fname), os.path.join(dest_dir, fname))
    print("Synchronized PLP defect comparison images across all directories.")
    print("Completed PLP simple defect image generation.")

if __name__ == '__main__':
    run()

