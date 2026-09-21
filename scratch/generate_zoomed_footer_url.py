from PIL import Image, ImageDraw

# Open base image
im = Image.open('HIGHLIGHTED_FOOTER_URL_RED_SQUARE.png').convert('RGB')
draw = ImageDraw.Draw(im)

# Crop the URL box at bottom left
crop_url = Image.open('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/.user_uploaded/media_1789637567134.png').crop((0, 508, 140, 524))
# Magnify by 2.5x
w_mag = int(crop_url.width * 2.5)
h_mag = int(crop_url.height * 2.5)
crop_mag = crop_url.resize((w_mag, h_mag), Image.Resampling.LANCZOS)

# Paste magnified URL above the bottom left, e.g. at (10, 440)
im_zoom = im.copy()
d_zoom = ImageDraw.Draw(im_zoom)
im_zoom.paste(crop_mag, (10, 450))

# Draw red outline around magnified box
RED = (235, 30, 30)
for i in range(3):
    d_zoom.rectangle([10 - i, 450 - i, 10 + w_mag + i, 450 + h_mag + i], outline=RED)

out_zoom_root = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer/comparison/HIGHLIGHTED_FOOTER_URL_WITH_ZOOM.png'
out_zoom_art = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/HIGHLIGHTED_FOOTER_URL_WITH_ZOOM.png'
out_zoom_mich = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Screenshots_For_Michelle/HIGHLIGHTED_FOOTER_URL_WITH_ZOOM.png'

im_zoom.save(out_zoom_root, quality=95)
im_zoom.save(out_zoom_art, quality=95)
im_zoom.save(out_zoom_mich, quality=95)
print('Saved zoomed version!')
