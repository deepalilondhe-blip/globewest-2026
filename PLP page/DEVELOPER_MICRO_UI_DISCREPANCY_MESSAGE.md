# Developer Feedback Message: Figma Micro-UI & Typography Discrepancies

```text
Hi Team,

During our pre-go-live micro-UI and typography inspection on US Staging (https://mcstaging2.globewest.com), we cross-checked the live computed styles against the approved Figma Design specs (Frame "desktop/product/Trade Pricing - ETA", Node: 2424-21417). 

We identified the following size, typography, and element discrepancies that require alignment:

1. Product Dimensions Subtitle (e.g. "W450 x H450mm"):
   • Figma Spec: Static subtitle text directly under the product title.
     - Layout: Width: 109px | Height: 21px | Opacity: 80%
     - Typography: Proxima Nova Regular 400 | Size: 14px | Line Height: 150% (21px)
   • Live Staging: Rendered as an interactive option dropdown ("Choose an Option...", Width: 178px x Height: 48px) with 100% opacity.

2. Product Title (H1 Heading):
   • Figma Spec: Font: IvyMode Regular 400 | Size: 26px | Line Height: 120% (31.2px) | Letter Spacing: 0px.
   • Live Staging: Font: IvyMode Regular 400 | Size: 26px | Line Height: 40px (+8.8px excessive vertical height) | Letter Spacing: 0.8px.

3. "Add to cart" CTA Button:
   • Figma Spec: Font: Proxima Nova Semibold 600 | Size: 14px | Letter Spacing: 0.25px | Text: "Add to cart" (Title Case).
   • Live Staging: Font: Proxima Nova Regular 400 (Missing 600 Semibold boldness) | Letter Spacing: 1px (4x wider) | Text: "ADD TO CART" (All Caps).

4. "ADD TO QUOTE" Button Label:
   • Figma Spec: Label is "ADD TO QUOTE" | Font Weight: Semibold 600 | Letter Spacing: 0.25px.
   • Live Staging: Label displays "ADD TO QUOTE / HOLD" (with unapproved "/ HOLD" appended) | Font Weight: Regular 400.

5. Stock & Incoming Shipment Schedule (Four Hands Model):
   • Figma Spec: 
     - Primary Line: "ETA [Date] ([Qty] available)" with quantity count in brackets.
     - Secondary Line: "Next Shipment: [Qty] (ETA [Date])".
   • Live Staging: Displays generic "Enquire for ETA" only. The available quantity count and the incoming shipment schedule lines are completely missing.

6. Header Utility Bar:
   • Figma Spec: Text: "Book Showroom Appointment" | Font Size: 16px | Line Height: 160% (25.6px).
   • Live Staging: Text: "Book Showroom Visit" | Font Size: 13px (-3px smaller) | Line Height: 18px.

Raw unedited screenshots from the Figma Inspect properties panel and live staging are attached for your direct review.

Thank you!
```
