import csv
import os

try:
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    HAS_OPENPYXL = True
except ImportError:
    HAS_OPENPYXL = False

OUT_DIR = 'Sprint-3/Ticket_41794528_My_Account_Holds'
os.makedirs(OUT_DIR, exist_ok=True)

test_cases = [
    {
        "tc_id": "TC-HOLDS-01",
        "module": "Authentication & Access",
        "test_title": "Direct URL Access as Logged-Out Guest",
        "preconditions": "User is not logged in",
        "test_steps": "1. Navigate directly to /gw_orders/hold/index/\n2. Observe redirection and page behavior",
        "expected_result": "User is redirected to Customer Login page (/customer/account/login/) with session notice",
        "actual_result": "Redirects to customer login page with notice",
        "status": "PASS",
        "severity": "High",
        "compliance": "AGENTS.md Rule 3 Dual-Auth"
    },
    {
        "tc_id": "TC-HOLDS-02",
        "module": "Authentication & Access",
        "test_title": "Authenticated Trade Customer Access",
        "preconditions": "User logged in with Trade Customer credentials",
        "test_steps": "1. Login with trade account\n2. Navigate to /gw_orders/hold/index/",
        "expected_result": "My Holds dashboard loads with breadcrumbs, left account navigation, and table container",
        "actual_result": "My Holds dashboard loads successfully for Trade account",
        "status": "PASS",
        "severity": "High",
        "compliance": "Frame 621"
    },
    {
        "tc_id": "TC-HOLDS-03",
        "module": "Status Filter Tabs",
        "test_title": "Default Active Filter Tab (ACTIVE)",
        "preconditions": "User on My Holds page",
        "test_steps": "1. Inspect default filter tabs on initial load\n2. Check active class and computed styles",
        "expected_result": "Filter tabs display 'ACTIVE' and 'INACTIVE'. 'ACTIVE' tab is selected by default with dark brown solid pill styling (#2B1D16 / rgb(56, 28, 18)) and white text",
        "actual_result": "Renders 'ACTIVE' (is-active, dark background, white text) and 'INACTIVE'",
        "status": "PASS",
        "severity": "High",
        "compliance": "Frame 621 Rule 1"
    },
    {
        "tc_id": "TC-HOLDS-04",
        "module": "Status Filter Tabs",
        "test_title": "Tab Switching State Transition",
        "preconditions": "User on My Holds page",
        "test_steps": "1. Click 'INACTIVE' tab\n2. Verify table updates and active tab changes to 'INACTIVE'\n3. Click back to 'ACTIVE'",
        "expected_result": "Active styling switches cleanly between ACTIVE and INACTIVE tabs; table records filter accordingly",
        "actual_result": "Tab toggles cleanly between ACTIVE and INACTIVE",
        "status": "PASS",
        "severity": "Medium",
        "compliance": "Frame 621"
    },
    {
        "tc_id": "TC-HOLDS-05",
        "module": "Search Component",
        "test_title": "Horizontal Inline Search Alignment",
        "preconditions": "User on My Holds page",
        "test_steps": "1. Inspect positioning of search input relative to filter tabs\n2. Check placeholder and search icon",
        "expected_result": "Search input sits horizontally on the same row adjacent to filter tabs with magnifying glass icon",
        "actual_result": "Search input is aligned inline on the same horizontal row beside filter tabs",
        "status": "PASS",
        "severity": "Medium",
        "compliance": "Figma Artboard"
    },
    {
        "tc_id": "TC-HOLDS-06",
        "module": "Table Architecture",
        "test_title": "Column Reduction & Redundant Actions Column",
        "preconditions": "User on My Holds page desktop view",
        "test_steps": "1. Inspect table headers on desktop view\n2. Count columns and check for standalone Actions column",
        "expected_result": "Table displays 7 columns (HOLD, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL). Per Frame 621, if only view action exists, hide separate Actions column and make Hold # clickable",
        "actual_result": "Table displays 8 columns including a redundant 'ACTIONS' column",
        "status": "FAIL",
        "severity": "High",
        "compliance": "Frame 621 Rule 2 & 4"
    },
    {
        "tc_id": "TC-HOLDS-07",
        "module": "Table Architecture",
        "test_title": "Header Label Typo ('CUST P0#' zero vs letter O)",
        "preconditions": "User on My Holds page desktop view",
        "test_steps": "1. Inspect column 3 header text in DOM\n2. Check character representation",
        "expected_result": "Header label displays 'CUST PO#' with capital letter 'O'",
        "actual_result": "Header label displays 'CUST P0#' with number zero '0' instead of capital letter 'O'",
        "status": "FAIL",
        "severity": "Medium",
        "compliance": "Figma Spec"
    },
    {
        "tc_id": "TC-HOLDS-08",
        "module": "Editorial & Content",
        "test_title": "Sub-heading Feature Description Copy",
        "preconditions": "User on My Holds page",
        "test_steps": "1. Read sub-heading description copy below 'My Holds' title\n2. Verify presence and feature introduction",
        "expected_result": "Displays feature intro copy below title ('A product hold reserves your favourite items for 2 business days.') consistent with Figma layout",
        "actual_result": "Introductory copy is present and accurately describes product hold behavior",
        "status": "PASS",
        "severity": "Low",
        "compliance": "Frame 621 / Layout Spec"
    },
    {
        "tc_id": "TC-HOLDS-09",
        "module": "FAQ Module",
        "test_title": "FAQ Accordion Presence & Default Closed State",
        "preconditions": "User on My Holds page",
        "test_steps": "1. Scroll down to Frequently Asked Questions section\n2. Inspect initial visibility of answers",
        "expected_result": "FAQ section is present below table; all accordion items are closed by default",
        "actual_result": "FAQ section is present; all accordions are closed on page load",
        "status": "PASS",
        "severity": "Medium",
        "compliance": "Frame 621 FAQ Spec"
    },
    {
        "tc_id": "TC-HOLDS-10",
        "module": "FAQ Module",
        "test_title": "FAQ Accordion Single-Open Auto-Collapse Rule",
        "preconditions": "User on My Holds page",
        "test_steps": "1. Click FAQ item 1 to expand\n2. Click FAQ item 2\n3. Verify whether FAQ item 1 collapses automatically",
        "expected_result": "Only one accordion remains open at a time; expanding item 2 automatically collapses item 1",
        "actual_result": "Expanding item 2 automatically collapsed item 1 (single-open rule strictly enforced)",
        "status": "PASS",
        "severity": "High",
        "compliance": "Frame 621 FAQ Spec"
    },
    {
        "tc_id": "TC-HOLDS-11",
        "module": "Customer Support Block",
        "test_title": "Support Block Layout & Design Matching",
        "preconditions": "User on My Holds page",
        "test_steps": "1. Inspect 'Need help? Contact our sales team' block below FAQs\n2. Verify contact phone, email, and layout against Figma Frame 621",
        "expected_result": "Support block displays 'Need help? Contact our sales team', phone 'P: +613 9518 1600', and email 'E: salessupport@globewest.com.au' matching Figma Frame 621 mockup text",
        "actual_result": "Matches Figma Frame 621 design mockup identically; configurable via Magento CMS static block for future US contact updates",
        "status": "PASS",
        "severity": "Low",
        "compliance": "Frame 621 Figma Spec"
    },
    {
        "tc_id": "TC-HOLDS-12",
        "module": "Mobile Responsive View",
        "test_title": "Mobile Viewport (390x844) Layout & Table Display",
        "preconditions": "Mobile viewport 390x844 (iPhone 14/15/16)",
        "test_steps": "1. Load /gw_orders/hold/index/ in mobile viewport\n2. Inspect filter tabs, search bar, table columns, and accordions",
        "expected_result": "Layout stacks cleanly without horizontal overflow; table shows essential mobile columns (HOLD, DATE, STATUS, TOTAL, ACTIONS)",
        "actual_result": "Mobile layout stacks cleanly; table displays 5 columns with horizontal scroll and responsive card view",
        "status": "PASS",
        "severity": "High",
        "compliance": "Mobile Artboard"
    }
]

# Write CSV
csv_path = os.path.join(OUT_DIR, 'My_Holds_Test_Cases.csv')
with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(test_cases[0].keys()))
    writer.writeheader()
    writer.writerows(test_cases)
print(f"Saved CSV: {csv_path}")

# Write XLSX if openpyxl available
if HAS_OPENPYXL:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "My Holds Test Cases"

    headers = [
        "Test Case ID", "Module", "Test Title", "Preconditions",
        "Test Steps", "Expected Result (Figma Spec)", "Actual Result (Live mcstaging2)",
        "Status", "Severity", "Specification Traceability"
    ]
    ws.append(headers)

    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="2B1D16", end_color="2B1D16", fill_type="solid")
    center_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
    left_align = Alignment(horizontal="left", vertical="top", wrap_text=True)

    pass_fill = PatternFill(start_color="D4EDDA", end_color="D4EDDA", fill_type="solid")
    pass_font = Font(name="Calibri", size=10, bold=True, color="155724")
    fail_fill = PatternFill(start_color="F8D7DA", end_color="F8D7DA", fill_type="solid")
    fail_font = Font(name="Calibri", size=10, bold=True, color="721C24")

    thin_border = Border(
        left=Side(style='thin', color='DDDDDD'),
        right=Side(style='thin', color='DDDDDD'),
        top=Side(style='thin', color='DDDDDD'),
        bottom=Side(style='thin', color='DDDDDD')
    )

    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align

    for row_idx, tc in enumerate(test_cases, start=2):
        row_data = [
            tc["tc_id"], tc["module"], tc["test_title"], tc["preconditions"],
            tc["test_steps"], tc["expected_result"], tc["actual_result"],
            tc["status"], tc["severity"], tc["compliance"]
        ]
        ws.append(row_data)

        for col_idx in range(1, len(row_data) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.border = thin_border
            cell.alignment = left_align

            if col_idx == 8: # Status
                cell.alignment = center_align
                if tc["status"] == "PASS":
                    cell.fill = pass_fill
                    cell.font = pass_font
                else:
                    cell.fill = fail_fill
                    cell.font = fail_font

    col_widths = {
        'A': 16, 'B': 22, 'C': 32, 'D': 25,
        'E': 35, 'F': 38, 'G': 38, 'H': 12,
        'I': 14, 'J': 24
    }
    for col_letter, width in col_widths.items():
        ws.column_dimensions[col_letter].width = width

    xlsx_path = os.path.join(OUT_DIR, 'My_Holds_Test_Cases.xlsx')
    wb.save(xlsx_path)
    print(f"Saved XLSX: {xlsx_path}")
