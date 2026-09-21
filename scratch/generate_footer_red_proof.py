import os
from PIL import Image, ImageDraw

src_path = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Live_Inspection/01_US_FOOTER_FULL.png'
im = Image.open(src_path).convert('RGB')
w, h = im.size
print(f"Image dimensions: {w}x{h}")

# Create an annotated image with clean red rectangular highlights (width=3)
annotated = im.copy()
draw = ImageDraw.Draw(annotated)
RED = (235, 30, 30)
WIDTH = 3

# 1. Social Links icons
# Approx coordinates: x: 30 to 220, y: 125 to 185
social_box = [30, 128, 220, 185]
draw.rectangle(social_box, outline=RED, width=WIDTH)

# 2. Newsletter Subscribe block ("Subscribe Now.")
# Approx coordinates: x: 30 to 450, y: 310 to 380
newsletter_box = [30, 315, 455, 385]
draw.rectangle(newsletter_box, outline=RED, width=WIDTH)

# 3. Visit Showroom block ("BOOK AN APPOINTMENT")
# Approx coordinates: x: 30 to 450, y: 480 to 650
showroom_box = [30, 480, 455, 655]
draw.rectangle(showroom_box, outline=RED, width=WIDTH)

# 4. Copyright "© 2026 GlobeWest" in bottom bar
# Approx coordinates: x: 1000 to 1145, y: 940 to 980
copyright_box = [1000, 940, 1145, 980]
draw.rectangle(copyright_box, outline=RED, width=WIDTH)

out_full = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/comparison/FOOTER_VERIFIED_SIMPLE_RED_PROOF.png'
out_artifact = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FOOTER_VERIFIED_SIMPLE_RED_PROOF.png'

annotated.save(out_full)
annotated.save(out_artifact)
print(f"Saved full annotated footer: {out_full}")
