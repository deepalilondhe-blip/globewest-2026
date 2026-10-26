#!/usr/bin/env python3
"""
Inspect coordinates and save crops for verification
"""
import os
from PIL import Image

BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes'
FIGMA_IMG = os.path.join(BASE_DIR, 'figma', 'FIGMA_DESKTOP_MY_QUOTES_2X.jpg')
LIVE_IMG = os.path.join(BASE_DIR, 'screenshots', 'desktop', '01_my_quotes_live_staging.png')
OUT_DIR = os.path.join(BASE_DIR, 'scratch')
os.makedirs(OUT_DIR, exist_ok=True)

im_fig = Image.open(FIGMA_IMG)
im_live = Image.open(LIVE_IMG)

print("Figma size:", im_fig.size)
print("Live size:", im_live.size)

# Crop Figma tabs & table (scaled at 2x)
# In 2880 width: main content is from x=800 to 2650, y=350 to 1400
crop_fig_table = im_fig.crop((850, 350, 2650, 1300))
crop_fig_table.save(os.path.join(OUT_DIR, 'crop_fig_table.png'))

# Crop Figma FAQs
crop_fig_faqs = im_fig.crop((850, 1300, 2650, 2250))
crop_fig_faqs.save(os.path.join(OUT_DIR, 'crop_fig_faqs.png'))

# Crop Figma Contact Block
crop_fig_contact = im_fig.crop((850, 2250, 2650, 2750))
crop_fig_contact.save(os.path.join(OUT_DIR, 'crop_fig_contact.png'))

# Crop Figma Sidebar
crop_fig_sidebar = im_fig.crop((140, 350, 680, 1300))
crop_fig_sidebar.save(os.path.join(OUT_DIR, 'crop_fig_sidebar.png'))

# Crop Live table area
crop_live_table = im_live.crop((440, 180, 1350, 600))
crop_live_table.save(os.path.join(OUT_DIR, 'crop_live_table.png'))

# Crop Live space below table
crop_live_missing_faqs = im_live.crop((440, 500, 1350, 900))
crop_live_missing_faqs.save(os.path.join(OUT_DIR, 'crop_live_missing_faqs.png'))

# Crop Live Sidebar
crop_live_sidebar = im_live.crop((80, 180, 380, 750))
crop_live_sidebar.save(os.path.join(OUT_DIR, 'crop_live_sidebar.png'))

# Crop Live Footer Kangaroo badge
crop_live_footer = im_live.crop((20, 1350, 250, 1550))
crop_live_footer.save(os.path.join(OUT_DIR, 'crop_live_footer.png'))

print("All crops saved to scratch/")
