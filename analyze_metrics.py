import json

with open('Sprint-3/Ticket_41794540_About_Us/about_us_deep_ui_audit_metrics.json') as f:
    data = json.load(f)

for vp in ['desktop', 'mobile']:
    print(f"\n=======================================================")
    print(f"📊 VIEWPORT: {vp.upper()} COMPARISON (AU vs US)")
    print(f"=======================================================")
    au = data['viewports'][vp]['au']
    us = data['viewports'][vp]['us']
    
    sections = ['hero', 'vision', 'business', 'diversity', 'quote', 'video', 'approach', 'team', 'careers']
    
    for sec in sections:
        print(f"\n--- SECTION: {sec.upper()} ---")
        au_sec = au.get(sec, {})
        us_sec = us.get(sec, {})
        
        # Compare key sub-elements
        for sub in au_sec:
            au_val = au_sec[sub]
            us_val = us_sec.get(sub)
            
            if isinstance(au_val, dict) and 'styles' in au_val:
                print(f"  [{sub}] Text AU: {repr(au_val.get('text', ''))[:30]} | US: {repr(us_val.get('text', ''))[:30]}")
                # Compare styles
                au_st = au_val.get('styles') or {}
                us_st = us_val.get('styles') or {}
                diffs = []
                for prop in ['fontSize', 'fontWeight', 'lineHeight', 'color', 'textAlign', 'marginTop', 'marginBottom']:
                    if au_st.get(prop) != us_st.get(prop):
                        diffs.append(f"{prop}: AU({au_st.get(prop)}) != US({us_st.get(prop)})")
                if diffs:
                    print(f"    ⚠️ STYLE DIFFS: {', '.join(diffs)}")
                else:
                    print(f"    ✅ Styles match (font: {au_st.get('fontSize')} / {au_st.get('fontWeight')}, color: {au_st.get('color')})")
            elif sub == 'cards':
                print(f"  [cards count] AU: {len(au_val)} | US: {len(us_val)}")
                for i, (ac, uc) in enumerate(zip(au_val, us_val)):
                    ac_st = ac.get('cardStyles') or {}
                    uc_st = uc.get('cardStyles') or {}
                    print(f"    Card {i+1} ({ac.get('title')}): AU size={ac_st.get('width')}x{ac_st.get('height')} | US size={uc_st.get('width')}x{uc_st.get('height')}")
            elif sub == 'buttons':
                print(f"  [buttons count] AU: {len(au_val)} | US: {len(us_val)}")
                for i, (ab, ub) in enumerate(zip(au_val, us_val)):
                    ab_st = ab.get('styles') or {}
                    ub_st = ub.get('styles') or {}
                    print(f"    Button {i+1} ({ab.get('text')}):")
                    print(f"      AU: size={ab_st.get('width')}x{ab_st.get('height')}, font={ab_st.get('fontSize')}/{ab_st.get('fontWeight')}, pad={ab_st.get('paddingTop')} {ab_st.get('paddingRight')}")
                    print(f"      US: size={ub_st.get('width')}x{ub_st.get('height')}, font={ub_st.get('fontSize')}/{ub_st.get('fontWeight')}, pad={ub_st.get('paddingTop')} {ub_st.get('paddingRight')}")
            elif sub == 'container':
                au_c = au_val or {}
                us_c = us_val or {}
                print(f"  [container] AU: {au_c.get('width')}x{au_c.get('height')} | US: {us_c.get('width')}x{us_c.get('height')}")
