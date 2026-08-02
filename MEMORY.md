# MEMORY.md — Visitors Login System

This file serves as persistent memory/documentation for the project, capturing all decisions, changes, and important details.

---

## 🏗️ Project Overview

A modern, professional visitor check-in system with a glassmorphism UI and Google Sheets backend via Google Apps Script.

**Developer:** Ritche Gerona
**Company:** MSR (logo: `images/MSR_logo.png`)
**Last Updated:** August 2, 2026

### Check-in Flow
1. Page loads → Chooser modal appears (Visitor / MSR Employee)
2. Visitor → Full check-in form (name, contact, contact person, purpose)
3. Employee → Employee form modal (name dropdown grouped by department, department select)
4. Admin → PIN-protected dashboard at `admin.html`

---

## 🎨 Design System

### Color Palette
| Token       | Value      | Usage                        |
|-------------|-----------|------------------------------|
| Primary     | #0d7377   | Green-teal brand color       |
| Secondary   | #14a3a8   | Teal accent                  |
| Background  | #f0f4f8   | Light gray-blue page bg      |
| Text        | #1a1a2e   | Dark navy (primary text)     |
| Card        | #ffffff   | White card with soft shadow  |
| Error       | #e63946   | Soft red for validation      |
| Success     | #2ecc71   | Green for success toasts     |

### Typography
- **Font:** Inter (Google Fonts)
- **Headers:** Bold (700), large
- **Labels:** Semi-bold (600), uppercase, 12px
- **Inputs:** Clean, transparent border, focused = 2px teal border + glow

### CSS Features
- CSS variables for theming (`:root`)
- CSS Grid + Flexbox layout
- `backdrop-filter: blur()` for glass effect
- Smooth transitions on all interactive elements
- Custom styled `<select>` dropdowns with arrow indicator
- Gradient button with hover lift effect
- Optgroup labels: white text on teal background with `!important` to override browser defaults

---

## 📁 File Structure

```
/
├── index.html          # Check-in page (public) with chooser modal
├── admin.html          # Admin dashboard (PIN-protected)
├── css/
│   ├── style.css       # Main stylesheet (design system)
│   └── admin.css       # Admin-specific styles
├── js/
│   ├── app.js          # Check-in page logic (chooser + visitor + employee)
│   └── admin.js        # Admin dashboard logic
├── images/
│   └── MSR_logo.png    # Company logo
├── Code.gs             # Google Apps Script backend
├── README.md           # Setup & usage instructions
└── MEMORY.md           # This file — project memory
```

---

## 🔧 Backend (Google Apps Script)

**File:** `Code.gs`

### Constants
- `ADMIN_PIN = '1234'` — Change this before production
- `SHEET_NAME = 'Visitors'` — Tab name in Google Sheet
- `EMPLOYEE_SHEET_NAME = 'Employees'` — Tab name for employee logs
- Column headers (Visitors): ID, ID Number, Full Name, Contact Number, Contact Person, Purpose, Status, Timestamp, Checkout Time
- Column headers (Employees): ID, Employee ID, Full Name, Department, Type, Status, Timestamp

### API Endpoints

#### GET / (Fetch Visitors)
```
?search=keyword&filter=checked-in
```
- Returns JSON array of visitor rows
- `search` filters across name, contact, person, purpose
- `filter` accepts: `checked-in` or `checked-out`

#### POST / (Actions)
All POST requests send JSON with an `action` field:

| Action          | Required Fields                                                     |
|-----------------|---------------------------------------------------------------------|
| `checkin`       | fullName, contactNumber, contactPerson, purpose               |
| `checkout`      | id                                                                  |
| `delete`        | id                                                                  |
| `empCheckin`    | fullName, department                                                |
| `empDelete`     | id                                                                  |

### Deploy as Web App
- **Execute as:** Me
- **Who has access:** Anyone (or Anyone with link)
- Copy the Web App URL into `js/app.js` and `js/admin.js`

---

## 📝 Contact Persons (by Department)

### HR DEPARTMENT
- Russell Caballero
- Maria Anna Pili

### ACCOUNTING DEPARTMENT
- Wilma
- Angie
- Ella

### GCC DEPARTMENT
- Miah, Tin, Cathy, Jane, Ron, Marlou, Paul, Marie, Sofia, Yong, Ladin, Majeed

### DEPLOYMENT DEPARTMENT
- Madz, Chie, Zsa, Neil, Ivy, Patrick, Jen, Ren

---

## 📋 Purpose of Visit Options

1. Meeting
2. Delivery
3. Interview
4. Maintenance
5. Personal Visit
6. Job Application
7. Client Visit
8. Final Briefing
9. Submission of Documents
10. Other

---

## 🔐 Admin Dashboard

- **PIN:** 1234 (configurable in `Code.gs`)
- **Keyboard shortcut:** Ctrl+Shift+A / Cmd+Shift+A from check-in page
- **Feature:** Search by name/contact/person/purpose
- **Filter tabs:** All / On-Site / Checked Out
- **Actions:** Check out visitor, Delete entry
- **Manual Override:** Form to add visitors manually

---

## 🖼️ Logo

- **File:** `images/MSR_logo.png`
- **Styling:** No background, no shadow/border on `.logo-icon`, displayed at max 200px wide, centered
- **Usage:** Used in both `index.html` (check-in header) and `admin.html` (nav brand)

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

*Developed by Ritche Gerona*