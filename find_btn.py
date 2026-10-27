from PIL import Image

us_full = Image.open('Sprint-3/Ticket_41794540_About_Us/screenshots/desktop/03_US_AUTH_desktop_about_us_full.png')
crop = us_full.crop((0, 5253, 1425, 5670))
print("Crop size:", crop.size)
# Save crop to examine
crop.save('crop_careers.png')
