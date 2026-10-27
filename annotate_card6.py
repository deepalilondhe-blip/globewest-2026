from PIL import Image, ImageDraw, ImageFont

img_path = 'Sprint-3/Ticket_41794540_About_Us/comparison/06_Careers_AU_Email_Leak_Defect.png'
im = Image.open(img_path)
draw = ImageDraw.Draw(im)

try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
except:
    font = ImageFont.load_default()

# The US section is on the right half.
# Target width is 700. US box x starts at 760.
# Let's highlight the "REGISTER YOUR INTEREST" button in US
# Coordinates of REGISTER YOUR INTEREST button on US:
# Looking at the image, it is around x=1020..1150, y=210..240 in the card coordinates.
# Let's draw a red rectangle and a callout tag
draw.rectangle([1020, 208, 1155, 238], outline=(255, 0, 0), width=3)

# Add callout text box
box_x, box_y = 960, 255
draw.rectangle([box_x, box_y, box_x + 340, box_y + 40], fill=(211, 47, 47))
draw.text((box_x + 10, box_y + 6), "Defect: mailto:careers@globewest.com.au", fill=(255, 255, 255), font=font)
draw.text((box_x + 10, box_y + 22), "(Australian domain leaked on US site)", fill=(255, 255, 255), font=font)

im.save(img_path)
print("Updated card 06 with annotation.")
