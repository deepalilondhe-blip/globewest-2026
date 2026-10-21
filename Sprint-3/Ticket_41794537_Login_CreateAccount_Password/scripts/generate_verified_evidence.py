import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVIDENCE_DIR = os.path.join(BASE_DIR, 'screenshots', 'retest_evidence')

# Colors
GREEN = (34, 197, 94)  # Fixed / Verified
RED = (239, 68, 68)

# 1. Title Dropdown Cropped Evidence
p_create = os.path.join(EVIDENCE_DIR, 'Before_Submit_Create_Account.png')
if os.path.exists(p_create):
    img = Image.open(p_create)
    crop1 = img.crop((70, 270, 680, 420))
    draw = ImageDraw.Draw(crop1)
    # Highlight Title dropdown exactly: label is at y: 30, box is at y: 55 to 105
    draw.rectangle([(18, 25), (135, 110)], outline=GREEN, width=3)
    crop1.save(os.path.join(EVIDENCE_DIR, 'VERIFIED_1_TITLE_DROPDOWN.png'))
    print("Saved VERIFIED_1_TITLE_DROPDOWN.png")

# 2. Title Validation Cropped Evidence
p_after = os.path.join(EVIDENCE_DIR, 'After_Submit_Create_Account.png')
if os.path.exists(p_after):
    img = Image.open(p_after)
    crop2 = img.crop((70, 270, 680, 440))
    draw = ImageDraw.Draw(crop2)
    # Highlight Title validation error
    draw.rectangle([(20, 75), (135, 125)], outline=GREEN, width=3)
    crop2.save(os.path.join(EVIDENCE_DIR, 'VERIFIED_2_TITLE_VALIDATION.png'))
    print("Saved VERIFIED_2_TITLE_VALIDATION.png")

# 3. Remember Me Cropped Evidence
p_login = os.path.join(EVIDENCE_DIR, 'Forgot_Password_Result.png')
if os.path.exists(p_login):
    img = Image.open(p_login)
    crop3 = img.crop((80, 700, 500, 850))
    draw = ImageDraw.Draw(crop3)
    draw.rectangle([(20, 15), (180, 55)], outline=GREEN, width=3)
    crop3.save(os.path.join(EVIDENCE_DIR, 'VERIFIED_3_REMEMBER_ME.png'))
    print("Saved VERIFIED_3_REMEMBER_ME.png")
