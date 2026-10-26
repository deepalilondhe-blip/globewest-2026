#!/usr/bin/env python3
"""
Accurately find coordinates and refine comparison cards.
"""
from PIL import Image, ImageDraw

LIVE_DESKTOP = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/desktop/01_my_quotes_live_staging.png'
im = Image.open(LIVE_DESKTOP)

# Let's crop exact tabs with some padding
# Tabs in 01_my_quotes_live_staging:
# ALL, OPEN, CONVERTED, EXPIRED are around y=290 to 350, x=440 to 850
tabs = im.crop((440, 280, 850, 360))
tabs.save('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/scratch/tabs_exact.png')
print("Tabs exact size:", tabs.size)

# Search input:
# x=930 to 1340, y=280 to 360
search = im.crop((920, 280, 1360, 360))
search.save('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/scratch/search_exact.png')
print("Search exact size:", search.size)

# Table header:
# x=440 to 1350, y=360 to 440
tbl_hdr = im.crop((440, 360, 1350, 430))
tbl_hdr.save('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/scratch/tbl_hdr_exact.png')
print("Table header exact size:", tbl_hdr.size)
