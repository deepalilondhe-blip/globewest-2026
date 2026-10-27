from PIL import Image, ImageDraw, ImageFont

desktop_img = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/deep_defects_investigation/desktop_full_page.png'
artifact_dir = '/home/deepali/.gemini/antigravity-ide/brain/4c974b75-f11f-4e19-a08a-3c9db3753ff7'

im = Image.open(desktop_img)

try:
    font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
    font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
    font_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
except:
    font_title = font_badge = font_sub = ImageFont.load_default()

# -------------------------------------------------------------
# Proof 1: Missing Prop 65 Warning Box & Alternative Placeholders
# -------------------------------------------------------------
crop_p65 = im.crop((950, 780, 1420, 1480))
w1, h1 = crop_p65.size
c1 = Image.new('RGB', (w1 + 30, h1 + 80), '#FFFFFF')
d1 = ImageDraw.Draw(c1)
d1.rectangle([0, 0, w1 + 30, 45], fill='#DC2626')
d1.text((15, 12), "DEFECT: Missing Prop 65 Warning & Broken 'Coming Soon' Placeholders", fill='#FFFFFF', font=font_title)
c1.paste(crop_p65, (15, 55))
d1.rectangle([15, 55, 15 + w1, 55 + h1], outline='#DC2626', width=3)

# Highlight missing Prop 65 zone (between warranty and alternative products)
d1.rectangle([25, 185, 470, 245], outline='#FF0000', width=3)
d1.rectangle([25, 160, 470, 185], fill='#DC2626')
d1.text((30, 164), "MISSING: California Prop 65 Warning Box (Figma Spec)", fill='#FFFFFF', font=font_badge)

# Highlight Coming Soon Placeholders
d1.rectangle([35, 330, 125, 410], outline='#FF0000', width=3)
d1.rectangle([35, 470, 125, 550], outline='#FF0000', width=3)
d1.rectangle([35, 600, 125, 680], outline='#FF0000', width=3)
d1.rectangle([135, 335, 470, 360], fill='#DC2626')
d1.text((140, 339), "CATALOG SYNC DEFECT: 'GW Coming Soon' Placeholder", fill='#FFFFFF', font=font_badge)

c1.save(f'{artifact_dir}/PROOF_05_MISSING_PROP65_AND_PLACEHOLDERS.png')
print("Saved Proof 05")


# -------------------------------------------------------------
# Proof 2: Specifications Missing 2 Tabs & Leaking Metric (KG) Units
# -------------------------------------------------------------
crop_specs = im.crop((40, 1600, 1400, 2300))
w2, h2 = crop_specs.size
c2 = Image.new('RGB', (w2 + 30, h2 + 80), '#FFFFFF')
d2 = ImageDraw.Draw(c2)
d2.rectangle([0, 0, w2 + 30, 45], fill='#DC2626')
d2.text((15, 12), "DEFECT: Specifications Tab - Missing 2 Tabs & Metric (KG) Unit Leaks", fill='#FFFFFF', font=font_title)
c2.paste(crop_specs, (15, 55))
d2.rectangle([15, 55, 15 + w2, 55 + h2], outline='#DC2626', width=3)

# Highlight missing tabs in the tab bar
d2.rectangle([210, 68, 650, 115], outline='#FF0000', width=3)
d2.rectangle([210, 45, 650, 68], fill='#DC2626')
d2.text((215, 48), "MISSING TABS: 'Brochures & Downloads' & 'Product care'", fill='#FFFFFF', font=font_badge)

# Highlight Metric KG units
d2.rectangle([880, 270, 1200, 325], outline='#FF0000', width=3)
d2.rectangle([880, 245, 1200, 270], fill='#DC2626')
d2.text((885, 248), "LEAK: PRODUCT WEIGHT (KG) -> 49 (Need LBS)", fill='#FFFFFF', font=font_badge)

d2.rectangle([100, 390, 450, 455], outline='#FF0000', width=3)
d2.rectangle([100, 365, 450, 390], fill='#DC2626')
d2.text((105, 368), "LEAK: MAX. WEIGHT BEARING CAPACITY (KG)", fill='#FFFFFF', font=font_badge)

c2.save(f'{artifact_dir}/PROOF_06_SPECIFICATIONS_METRIC_AND_MISSING_TABS.png')
print("Saved Proof 06")


# -------------------------------------------------------------
# Proof 3: Australian ZenDesk Warranty URL Leak
# -------------------------------------------------------------
crop_warranty = im.crop((950, 930, 1420, 1030))
w3, h3 = crop_warranty.size
c3 = Image.new('RGB', (w3 + 30, h3 + 110), '#FFFFFF')
d3 = ImageDraw.Draw(c3)
d3.rectangle([0, 0, w3 + 30, 45], fill='#DC2626')
d3.text((15, 12), "DEFECT: Warranty Policy Link Leaks Australian Domain (.com.au)", fill='#FFFFFF', font=font_title)
c3.paste(crop_warranty, (15, 55))
d3.rectangle([15, 55, 15 + w3, 55 + h3], outline='#DC2626', width=3)

# Highlight link
d3.rectangle([70, 88, 260, 115], outline='#FF0000', width=3)
d3.rectangle([20, 55 + h3 + 15, w3 + 10, 55 + h3 + 45], fill='#FEF2F2', outline='#DC2626')
d3.text((25, 55 + h3 + 22), "Live Href: https://support.globewest.com.au/hc/en-au/articles/13752185546383...", fill='#DC2626', font=font_badge)

c3.save(f'{artifact_dir}/PROOF_07_AUSTRALIAN_WARRANTY_DOMAIN_LEAK.png')
print("Saved Proof 07")

print("All proof graphics created successfully!")
