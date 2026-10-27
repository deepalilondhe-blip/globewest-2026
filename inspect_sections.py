from PIL import Image

au_img = Image.open('Sprint-3/Ticket_41794540_About_Us/screenshots/desktop/01_AU_AUTH_desktop_about_us_full.png')
us_img = Image.open('Sprint-3/Ticket_41794540_About_Us/screenshots/desktop/03_US_AUTH_desktop_about_us_full.png')

print("AU size:", au_img.size)
print("US size:", us_img.size)
