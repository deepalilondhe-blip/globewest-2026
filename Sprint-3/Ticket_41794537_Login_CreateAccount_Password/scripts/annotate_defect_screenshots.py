import os
from PIL import Image, ImageDraw

DEFECTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'screenshots', 'defects')

RED = (255, 0, 0)
LINE_WIDTH = 3

# -----------------------------------------------------------------------------
# DEFECT 1: Create Account - Title Field is an input box (Mobile)
# -----------------------------------------------------------------------------
p1 = os.path.join(DEFECTS_DIR, 'RAW_US_Mobile_Create_Account_Title.png')
if os.path.exists(p1):
    img = Image.open(p1).convert('RGB')
    draw = ImageDraw.Draw(img)
    # Title box is around y: 220 to 295, x: 15 to 375
    # Let us draw a clean red rectangle around the Title label + input box
    draw.rectangle([(15, 215), (375, 290)], outline=RED, width=LINE_WIDTH)
    out1 = os.path.join(DEFECTS_DIR, 'DEFECT_1_MOBILE_TITLE_INPUT_BOX.png')
    img.save(out1, quality=95)
    print(f"✅ Generated: {out1}")

# -----------------------------------------------------------------------------
# DEFECT 2: Create Account - No Validation message for Title Field (Mobile)
# -----------------------------------------------------------------------------
p2 = os.path.join(DEFECTS_DIR, 'RAW_US_Mobile_Create_Account_Validation.png')
if os.path.exists(p2):
    img = Image.open(p2).convert('RGB')
    draw = ImageDraw.Draw(img)
    # Highlight the Title field where validation error is missing
    draw.rectangle([(15, 215), (375, 290)], outline=RED, width=LINE_WIDTH)
    out2 = os.path.join(DEFECTS_DIR, 'DEFECT_2_MOBILE_TITLE_NO_VALIDATION.png')
    img.save(out2, quality=95)
    print(f"✅ Generated: {out2}")

# -----------------------------------------------------------------------------
# DEFECT 3: Create Account - Password Focus Issue (Mobile)
# -----------------------------------------------------------------------------
p3 = os.path.join(DEFECTS_DIR, 'RAW_US_Mobile_Create_Account_Password.png')
if os.path.exists(p3):
    img = Image.open(p3).convert('RGB')
    draw = ImageDraw.Draw(img)
    # Find password input box area and highlight
    # On mobile it is around y: 440 to 520
    draw.rectangle([(15, 435), (375, 515)], outline=RED, width=LINE_WIDTH)
    out3 = os.path.join(DEFECTS_DIR, 'DEFECT_3_MOBILE_PASSWORD_FOCUS_ISSUE.png')
    img.save(out3, quality=95)
    print(f"✅ Generated: {out3}")

# -----------------------------------------------------------------------------
# DEFECT 4: Login Page - Missing Remember Me (Mobile)
# -----------------------------------------------------------------------------
p4 = os.path.join(DEFECTS_DIR, 'RAW_US_Mobile_Login_RememberMe.png')
if os.path.exists(p4):
    img = Image.open(p4).convert('RGB')
    draw = ImageDraw.Draw(img)
    # Between password field and LOGIN button (around y: 440 to 480)
    draw.rectangle([(15, 440), (220, 480)], outline=RED, width=LINE_WIDTH)
    out4 = os.path.join(DEFECTS_DIR, 'DEFECT_4_MOBILE_LOGIN_REMEMBER_ME_MISSING.png')
    img.save(out4, quality=95)
    print(f"✅ Generated: {out4}")

# -----------------------------------------------------------------------------
# ALSO GENERATE THE EXACT DESKTOP VERSIONS MATCHING THE USER'S LIGHTSHOT SCREENSHOTS
# -----------------------------------------------------------------------------
dt_create = "Sprint-3/Ticket_41794537_Login_CreateAccount_Password/screenshots/desktop/us_staging/02_create_account_page_viewport.png"
if os.path.exists(dt_create):
    img = Image.open(dt_create).convert('RGB')
    draw = ImageDraw.Draw(img)
    # Match ref1: TITLE* box on desktop (around x: 70 to 180, y: 220 to 280)
    # Let us find exact coords or highlight
    draw.rectangle([(60, 220), (185, 280)], outline=RED, width=LINE_WIDTH)
    out_dt1 = os.path.join(DEFECTS_DIR, 'DEFECT_1_DESKTOP_TITLE_INPUT_BOX.png')
    img.save(out_dt1, quality=95)
    print(f"✅ Generated: {out_dt1}")

dt_login = "Sprint-3/Ticket_41794537_Login_CreateAccount_Password/screenshots/desktop/us_staging/01_login_page_viewport.png"
if os.path.exists(dt_login):
    img = Image.open(dt_login).convert('RGB')
    draw = ImageDraw.Draw(img)
    # Match ref3: empty space above LOGIN button on desktop (around x: 80 to 230, y: 440 to 480)
    draw.rectangle([(80, 440), (240, 480)], outline=RED, width=LINE_WIDTH)
    out_dt4 = os.path.join(DEFECTS_DIR, 'DEFECT_4_DESKTOP_LOGIN_REMEMBER_ME_MISSING.png')
    img.save(out_dt4, quality=95)
    print(f"✅ Generated: {out_dt4}")
