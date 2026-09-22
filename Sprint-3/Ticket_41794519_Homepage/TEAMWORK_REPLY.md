# Ready-to-Post Teamwork Reply (Task #41794519)

**Copy and paste the markdown below directly into the Teamwork task comment thread:**

---

Hi @VinodV,

Thanks for the update! I have reviewed the new Homepage — US on live staging (`https://mcstaging2.globewest.com/`) across Desktop and Mobile viewports.

The overall page structure, hero banner slider, category navigation carousel, authenticated trade pricing toggle, and mobile responsiveness look great and are functioning smoothly.

However, there is an Australian Scope URL Leak in the footer that needs to be fixed before sign-off:

🚨 **Defect: Australian Domain Redirection in Storefront Footer (P1 - High)**
* **Location:** In the footer under the `"CUSTOMER SUPPORT"` column.
* **Actual:** Hovering over and clicking **"Shop Outlet"** redirects users to the Australian website:  
  -> `https://globewestoutlet.com.au/` (Australian clearance outlet with AUD pricing).
* **Expected:** All links on the US storefront must resolve within the US store scope (e.g. US domestic clearance URL or suppress the link if no US outlet exists yet).

Please see the attached screenshot where I have highlighted the **"Shop Outlet"** link and the Australian redirect URL with clean red square outlines.

Could you please update this URL for the US store view?

Thank you!  
Deepali
