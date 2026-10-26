# Teamwork Update: #41794527 - My Account - Dashboard

**Hi Team,**

I have completed the verification for the **My Account - Dashboard** page on **US Staging** against the approved **Figma Design Specifications (Master Frame 620 / Node 2581-64183)** across both Desktop and Mobile viewports under an authenticated Trade account (`Enterprise tier`).

---

### Summary of Verification
The core dashboard structure, styling, and responsive behaviors are largely matching Figma and working smoothly:
1. **Welcome / Loyalty Block:** Displays the `Enterprise tier` pill badge, customer greeting in IvyMode serif font, customer ID, 54% discount tier, and promotional sofa banner image matching Figma layout.
2. **My Recent Orders Table:** Columns (`ORDER`, `DATE`, `STATUS`, `TOTAL`, `BALANCE`, `ACTIONS`), USA date format (`MM/DD/YY`), clickable order number links, and `Actions ⌵` dropdown are properly implemented.
3. **Claims Notification Banner:** 1-Column notification card with `New` badge, *"You can now submit claims online"* copy, and `SUBMIT CLAIM` CTA button matches Figma.
4. **Upcoming Events & Promotions:** 3-card grid on desktop and stacked layout on mobile with Event, Sale, and News cards correctly rendered.
5. **Showroom Bookings & FAQs:** Empty state with `MAKE A BOOKING` CTA button and 5-item FAQ accordion (with single-open collapse behavior) are working as expected.

---

### Points Noted for Review / Fine-Tuning:

During testing against **Figma Frame 620**, I noticed the following differences:

1. **Top Utility Bar Visibility (Frame 620 Specification):**
   - **Expected (Figma Frame 620):** *"HEADER -> Promotional Banner / Utility Bar -> Desktop & Mobile: Hidden/no utility bar, so a user cannot toggle pricing view."*
   - **Actual (US Live Staging):** The dark brown utility bar is currently visible at the top of the dashboard on both Desktop and Mobile showing *"Book Showroom Appointment"* and company info.

2. **Left Navigation Sidebar Link Labels:**
   - **Expected (Figma Frame 620):** Link #3 should be **"MY CLAIMS ⌵"** and Link #5 should be **"MY BOOKINGS ⌵"**.
   - **Actual (US Live Staging):** Link #3 currently renders **"GLOBEWEST REFERRALS ⌵"** and Link #5 renders **"BOOKINGS ⌵"**.

3. **Recent Orders Status Badge Label Truncation:**
   - **Expected (Figma):** Status pill badges display the full status name cleanly (e.g. *Processing*, *Complete*, *Pending Payment*).
   - **Actual (US Live Staging):** Status badge containers have tight fixed widths causing status names to truncate with ellipses on both Desktop and Mobile (e.g., *"Awaiting ..."*, *"Pending P..."*, *"Payment ..."*).

---

### Conclusion
The overall page structure, loyalty integration, recent orders data table, and content modules are functioning as expected. The above items are highlighted for alignment with the Frame 620 specifications.

Attached are the clean comparison and annotated defect screenshots for reference.

Thank you!
