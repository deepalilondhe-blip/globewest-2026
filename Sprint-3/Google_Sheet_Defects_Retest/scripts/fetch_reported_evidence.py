import json
import os
import urllib.request
import re
import time

with open('Sprint-3/Google_Sheet_Defects_Retest/google_sheet_defects.json') as f:
    defects = json.load(f)

evidence_dir = 'Sprint-3/Google_Sheet_Defects_Retest/evidence'
os.makedirs(evidence_dir, exist_ok=True)

print(f"Fetching reported evidence for {len(defects)} defects...")

for d in defects:
    tid = d['ticket_id'].replace('#', '')
    link = d.get('evidence_link', '')
    out_file = os.path.join(evidence_dir, f"{tid}_reported.png")

    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
        d['local_evidence'] = out_file
        continue

    if 'prnt.sc' in link:
        try:
            req = urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                html = resp.read().decode('utf-8')
                match = re.search(r'src=\"(https://image\.prntscr\.com/[^\"]+)\"', html) or \
                        re.search(r'class=\"no-click screenshot-image\" src=\"([^\"]+)\"', html) or \
                        re.search(r'property=\"og:image\" content=\"([^\"]+)\"', html)
                if match:
                    img_url = match.group(1)
                    req_img = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req_img, timeout=10) as img_resp:
                        with open(out_file, 'wb') as out_f:
                            out_f.write(img_resp.read())
                    print(f"✅ {d['ticket_id']}: Downloaded evidence from {link}")
                    d['local_evidence'] = out_file
                else:
                    print(f"⚠️ {d['ticket_id']}: No image match in HTML from {link}")
        except Exception as e:
            print(f"❌ {d['ticket_id']}: Error fetching {link}: {e}")
        time.sleep(0.3)
    elif 'screenrec.com' in link:
        print(f"📹 {d['ticket_id']}: Video link: {link}")
        d['video_evidence'] = link
    else:
        print(f"ℹ️ {d['ticket_id']}: No screenshot link found.")

with open('Sprint-3/Google_Sheet_Defects_Retest/google_sheet_defects.json', 'w') as f:
    json.dump(defects, f, indent=2)

print("\nFinished fetching reported evidence!")
