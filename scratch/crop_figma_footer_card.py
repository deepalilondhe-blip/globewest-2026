import os
from PIL import Image

src_path = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/02_FIGMA_FOOTER_SEARCH_PANEL.png'
out_path = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FIGMA_FOOTER_ANNOTATION_CARD_ZOOMED.png'

im = Image.open(src_path)
w, h = im.size
print(f"Image size: {w}x{h}")

# The card "FOOTER" is in the center-right area
# Let's crop the center area around the "CONTENT BLOCK" and "FOOTER" cards
crop_box = (int(w * 0.45), int(h * 0.20), int(w * 0.75), int(h * 0.65))
cropped = im.crop(crop_box)
cropped.save(out_path)
print(f"Saved cropped footer annotation card: {out_path}")
