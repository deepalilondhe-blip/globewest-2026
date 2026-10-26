Hello @vinod,

We have verified the Store Locator page on the US Staging site (https://mcstaging2.globewest.com/locator) against the AU baseline under both logged-in and guest states.

Please find the defects below for Desktop and Mobile view:

Desktop View Defects:

1. Google Maps Not Loading (Blocker):
* The interactive map does not load and displays a blank grey screen with error: "Oops! Something went wrong. This page didn't load Google Maps correctly."
* Fix Required: The Google Maps API key needs domain authorization for https://mcstaging2.globewest.com/locator.

2. CMS Block Heading Suffix Issue (stockist_info):
* The heading in the new CMS block displays as "How to Buy with a Stockist - us".
* Expected: The "- us" suffix should be removed so it displays cleanly as "How to Buy with a Stockist" (matching AU).

3. Australian Postcode in Search Field:
* The search placeholder is hardcoded to Australian postcode "Eg.3000".
* Expected: Should show US ZIP code format (e.g., "Eg. 90210").

4. Australian Content Leak in Intro & CMS Block:
* The text still refers to Australia: "GlobeWest is stocked at some of Australia's finest furniture and home decor retailers."
* Expected: Content needs to be updated for the US store.

5. Australian Spelling in CMS Block:
* Body text uses Australian spelling: "to finalise your order".
* Expected: Should use US English spelling: "to finalize your order".

6. Empty Page Title:
* The browser tab title is completely empty, causing tracking/analytics script errors.
* Expected: Needs a page title like "Find a Stockist & Showroom | GlobeWest".

7. Duplicate Text on Page:
* The sentence "Too far from one of our stockists? You can still shop online, just select from our list of retailers at checkout." is displaying twice (once above the map and once below the map).

Mobile View Defects:

1. Google Maps Broken on Mobile:
* The map section fails to load on mobile and shows an empty grey box.

2. CMS Heading Line Wrapping Defect:
* The heading "How to Buy with a Stockist - us" breaks into two lines on mobile ("- us" moves to the second line).

3. Australian Postcode on Mobile:
* The mobile search field still shows the Australian "Eg.3000" placeholder.

4. Duplicate Text on Mobile:
* The duplicate disclaimer paragraph appears twice on mobile.

Could you please check and fix these issues?

Thank you!
Deepali
