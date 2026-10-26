import os
from PIL import Image, ImageDraw

reported_path = 'Sprint-3/Ticket_41794527_My_Account_Dashboard/retest_results/DE01_reported_evidence.png'
live_table_path = 'Sprint-3/Ticket_41794527_My_Account_Dashboard/retest_results/DE01_LIVE_TABLE_CURRENT.png'
out_path = 'Sprint-3/Ticket_41794527_My_Account_Dashboard/retest_results/DE01_COMPARISON_EVIDENCE.png'

img_reported = Image.open(reported_path).convert('RGB')
img_live = Image.open(live_table_path).convert('RGB')

# Reported crop (top image)
crop_reported = img_reported.crop((320, 560, 1260, 660))

# Live crop (bottom image)
crop_live = img_live.crop((0, 0, img_live.width, 95))

target_w = 940
scale_rep = target_w / crop_reported.width
crop_reported = crop_reported.resize((target_w, int(crop_reported.height * scale_rep)), Image.Resampling.LANCZOS)

scale_live = target_w / crop_live.width
crop_live = crop_live.resize((target_w, int(crop_live.height * scale_live)), Image.Resampling.LANCZOS)

draw_live = ImageDraw.Draw(crop_live)

# Exact centered bounding boxes around the live sort arrows
arrow_boxes = [
    (68, 17, 85, 40),    # ORDER arrow
    (214, 17, 231, 40),  # DATE arrow
    (365, 17, 382, 40),  # STATUS arrow
    (515, 17, 532, 40),  # TOTAL arrow
    (695, 17, 712, 40),  # BALANCE arrow
]

for bx1, by1, bx2, by2 in arrow_boxes:
    x1 = int(bx1 * scale_live)
    y1 = int(by1 * scale_live)
    x2 = int(bx2 * scale_live)
    y2 = int(by2 * scale_live)
    draw_live.rectangle([x1, y1, x2, y2], outline='#00CC44', width=2)

sep_h = 16
combined = Image.new('RGB', (target_w, crop_reported.height + crop_live.height + sep_h), (255, 255, 255))
combined.paste(crop_reported, (0, 0))
combined.paste(crop_live, (0, crop_reported.height + sep_h))

combined.save(out_path)
print(f'Saved perfectly centered comparison to {out_path}')
