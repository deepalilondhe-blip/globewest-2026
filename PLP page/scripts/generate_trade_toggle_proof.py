from PIL import Image, ImageDraw, ImageFont
import os

PROOF_DIR = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page/screenshots/proof"
os.makedirs(PROOF_DIR, exist_ok=True)

FIGMA_SRC = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page/Figma comparison/Figma_Baseline_desktop_Category_Show_Filters.png"
LIVE_SRC = "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/scratch/trade-pricing-toggle-evidence/SCENARIO_2_LOGGED_IN_TOGGLE.png"
OUTPUT_PATH = os.path.join(PROOF_DIR, "DEFECT_TRADE_PRICING_TOGGLE_PROOF.png")

def make_proof_comparison():
    live_img = Image.open(LIVE_SRC)
    figma_img = Image.open(FIGMA_SRC)

    # Crop the top header and first section from both
    # Figma header (top 450px)
    figma_cropped = figma_img.crop((0, 0, min(figma_img.width, 1440), min(figma_img.height, 460)))
    
    # Live header (top 460px)
    live_cropped = live_img.crop((0, 0, min(live_img.width, 1440), min(live_img.height, 460)))

    target_w = 920
    target_h = 400

    figma_resized = figma_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    live_resized = live_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Load fonts
    try:
        font_main = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
        font_col = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
        font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    except:
        font_main = font_col = font_body = font_small = ImageFont.load_default()

    # Draw annotations on the live image (Red outline around top right header where toggle is missing)
    draw_live = ImageDraw.Draw(live_resized)
    # Highlight missing toggle area in top utility bar (top right)
    draw_live.rectangle([580, 5, 890, 45], outline="#FF0033", width=3)
    draw_live.rectangle([580, 48, 890, 95], fill="#B71C1C")
    draw_live.text((588, 52), "❌ DEFECT: TOGGLE MISSING", fill="#FFFFFF", font=font_body)
    draw_live.text((588, 72), "Figma specifies [Trade v] dropdown here", fill="#FFCDD2", font=font_small)

    # Highlight missing product pricing area
    draw_live.rectangle([20, 260, 450, 390], outline="#FF0033", width=3)
    draw_live.rectangle([20, 260, 450, 310], fill="#B71C1C")
    draw_live.text((30, 265), "❌ DEFECT: PRICING IS BLANK ($0)", fill="#FFFFFF", font=font_body)
    draw_live.text((30, 287), "Logged in as Trade, but no price renders", fill="#FFCDD2", font=font_small)

    # Draw annotations on Figma image (Green outline around Trade dropdown)
    draw_figma = ImageDraw.Draw(figma_resized)
    draw_figma.rectangle([600, 5, 890, 45], outline="#00E676", width=3)
    draw_figma.rectangle([600, 48, 890, 95], fill="#047857")
    draw_figma.text((608, 52), "✅ APPROVED FIGMA DESIGN", fill="#FFFFFF", font=font_body)
    draw_figma.text((608, 72), "Dropdown: [ Trade v ] / [ MSRP ]", fill="#A7F3D0", font=font_small)

    # Canvas
    total_w = target_w * 2 + 30
    total_h = target_h + 170

    combined = Image.new("RGB", (total_w, total_h), "#0B1120")
    draw = ImageDraw.Draw(combined)

    # Master Banner
    draw.rectangle([0, 0, total_w, 55], fill="#1E293B")
    draw.text((25, 16), "QA PROOF: TRADE PRICING TOGGLE & DUAL PRICING DEFECT ON LIVE US STAGING", fill="#FFFFFF", font=font_main)

    # Left: Figma Spec Header
    left_x = 10
    draw.rectangle([left_x, 65, left_x + target_w, 100], fill="#059669")
    draw.text((left_x + 15, 74), "🟢 APPROVED FIGMA SPEC (Page: [FINAL] Designs | Artboard: desktop/Category/Show Filters)", fill="#FFFFFF", font=font_col)
    combined.paste(figma_resized, (left_x, 102))
    draw.rectangle([left_x, 102, left_x + target_w, 102 + target_h], outline="#10B981", width=3)

    # Right: Live US Staging Header
    right_x = left_x + target_w + 10
    draw.rectangle([right_x, 65, right_x + target_w, 100], fill="#DC2626")
    draw.text((right_x + 15, 74), "🔴 ACTUAL US STAGING LIVE: https://mcstaging2.globewest.com/indoor (Logged In as Trade)", fill="#FFFFFF", font=font_col)
    combined.paste(live_resized, (right_x, 102))
    draw.rectangle([right_x, 102, right_x + target_w, 102 + target_h], outline="#EF4444", width=3)

    # Footer Defect Summary Box
    footer_y = 102 + target_h + 10
    draw.rectangle([10, footer_y, total_w - 10, footer_y + 50], fill="#1E293B", outline="#475569", width=2)
    draw.text((25, footer_y + 8), "DEFECT PROOF SUMMARY FOR DEV (@VinodV):", fill="#F87171", font=font_col)
    draw.text((25, footer_y + 28), "1. Top utility bar has NO Trade dropdown selector.  |  2. Product cards render NO wholesale or MSRP price ($0/Blank).", fill="#FFFFFF", font=font_small)

    combined.save(OUTPUT_PATH, quality=95)
    print("✅ Created proof screenshot:", OUTPUT_PATH)

if __name__ == "__main__":
    make_proof_comparison()
