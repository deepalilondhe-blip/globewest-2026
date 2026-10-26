import os
from PIL import Image

BASE_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794539_Store_Locator"
OUT_DIR = os.path.join(BASE_DIR, "comparison")
os.makedirs(OUT_DIR, exist_ok=True)

AU_IMG_PATH = "/home/deepali/.gemini/antigravity-ide/brain/0d54905d-e1e5-4ffb-85f7-99da8edad73b/.user_uploaded/media_1792734602750.png"
US_IMG_PATH = os.path.join(BASE_DIR, "screenshots/zipcode_search_verification/US_DESKTOP_ZIPCODE_SEARCH.png")

im_au = Image.open(AU_IMG_PATH).convert("RGB")
im_us = Image.open(US_IMG_PATH).convert("RGB")

# Target height = 700px for both so both are sharp and readable
target_h = 700
w_au = int(im_au.width * (target_h / im_au.height))
w_us = int(im_us.width * (target_h / im_us.height))

im_au_res = im_au.resize((w_au, target_h), Image.Resampling.LANCZOS)
im_us_res = im_us.resize((w_us, target_h), Image.Resampling.LANCZOS)

gap = 10
total_w = w_au + w_us + gap
total_h = target_h

# Side by side canvas
canvas = Image.new("RGB", (total_w, total_h), (255, 255, 255))
canvas.paste(im_au_res, (0, 0))
canvas.paste(im_us_res, (w_au + gap, 0))

out_path = os.path.join(OUT_DIR, "AU_VS_US_ZIPCODE_SEARCH_JOINED.png")
canvas.save(out_path, quality=95)
print(f"✅ Side-by-side joined image saved: {out_path}")

# Also create vertical stacked version for easy review
target_w_stack = 1200
h_au_stack = int(im_au.height * (target_w_stack / im_au.width))
h_us_stack = int(im_us.height * (target_w_stack / im_us.width))

im_au_stack = im_au.resize((target_w_stack, h_au_stack), Image.Resampling.LANCZOS)
im_us_stack = im_us.resize((target_w_stack, h_us_stack), Image.Resampling.LANCZOS)

stack_canvas = Image.new("RGB", (target_w_stack, h_au_stack + h_us_stack + gap), (255, 255, 255))
stack_canvas.paste(im_au_stack, (0, 0))
stack_canvas.paste(im_us_stack, (0, h_au_stack + gap))

out_stack_path = os.path.join(OUT_DIR, "AU_VS_US_ZIPCODE_SEARCH_STACKED.png")
stack_canvas.save(out_stack_path, quality=95)
print(f"✅ Stacked joined image saved: {out_stack_path}")
