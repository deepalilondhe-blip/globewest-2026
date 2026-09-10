
import sys
from PIL import Image, ImageDraw

left = Image.open(sys.argv[1]).convert('RGB')
right = Image.open(sys.argv[2]).convert('RGB')
leftLabel = sys.argv[4]
rightLabel = sys.argv[5]

target_h = 1600

def fit(img):
    scale = target_h / img.height
    return img.resize((max(1, round(img.width * scale)), target_h), Image.LANCZOS)

left = fit(left)
right = fit(right)
gap = 24
pad = 40
label_h = 64
w = pad + left.width + gap + right.width + pad
h = label_h + max(left.height, right.height) + pad
canvas = Image.new('RGB', (w, h), 'white')
canvas.paste(left, (pad, label_h))
canvas.paste(right, (pad + left.width + gap, label_h))

d = ImageDraw.Draw(canvas)
d.rectangle([0, 0, w - 1, label_h - 1], fill=(31, 31, 36))
d.rectangle([pad + left.width + gap // 2, 0, pad + left.width + gap // 2 + 1, h - 1], fill=(230, 60, 60))
for label, cx in ((leftLabel, pad + left.width // 2),
                  (rightLabel, pad + left.width + gap + right.width // 2)):
    d.text((cx, label_h // 2), label, fill=(255, 255, 255), anchor='mm')

canvas.save(sys.argv[3])
print('OK')
