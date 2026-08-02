# MSR Check-in

A **modern, professional check-in system** with a sleek glassmorphism UI and Google Sheets backend via Google Apps Script.

## Features

- **Check-in Page** (`index.html`) — Role-based chooser modal (Visitor or MSR Employee) with full visitor form and employee time-in flow
- **Admin Dashboard** (`admin.html`) — PIN-protected panel with Visitors / Employees view toggle, search, filter, check out, and delete
- **Manual Override** — Add visitors manually from the admin panel
- **Department-Grouped Contact Persons** — Dropdown organized by HR, Accounting, GCC, and Deployment departments
- **Google Sheets Backend** — Visitor logs in `Visitors` tab, employee time-in logs in `Employees` tab
- **Mobile-First** — Responsive design works on phones, tablets, and desktops
- **Animations** — Smooth transitions, loading spinners, toast notifications

---

## 🚀 Setup Instructions

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.new)
2. Rename the sheet to **MSR Check-in** (top-left corner)
3. Rename the default tab to **Visitors** (double-click the tab at the bottom)

### Step 2: Create the Apps Script Project

For the **shortcut method** (recommended):
1. In the same Google Sheet, click **Extensions → Apps Script**
2. Delete any code in the editor
3. Copy the entire contents of `Code.gs` (from this project) and paste it in
4. Press **Ctrl+S** (or **Cmd+S**) to save — name the project `Visitors Login System`
5. You should see the functions: `getSheet`, `getAllRows`, `doGet`, `doPost`, etc.

> **💡 Tip:** You can also use `clasp` (Command Line Apps Script) to push `Code.gs` directly:
> ```bash
> npm install -g @google/clasp
> clasp login
> clasp create --title "Visitors Login System" --type sheets
> clasp push
> ```

### Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy → New deployment**
2. Click the gear icon ⚙️ and choose **Web app**
3. Configure:
   - **Description:** `Visitors Login System API`
   - **Execute as:** `Me` (uses your Google account)
   - **Who has access:** `Anyone` (or `Anyone with link`)
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/ABCDEFGHIJKLMNOPQRSTUVWXYZ/exec
   ```
6. Click **Done**

> **⚠️ Important:** If you re-deploy later as a new version, you must get the **new URL**.

### Step 4: Update the Frontend Files

Open these two files and **replace `YOUR_APPS_SCRIPT_WEB_APP_URL`** with the URL you copied:

**`js/app.js`** (line 8):
```js
const API_URL = 'https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec';
```

**`js/admin.js`** (line 8):
```js
const API_URL = 'https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec';
```

### Step 5: Open the App

Simply open `index.html` in any web browser:

```bash
open index.html
```

---

## 📱 Usage

### Admin Dashboard
1. Open `admin.html` in a browser
2. Enter PIN: **1234**
3. Toggle between **Visitors** and **Employees** views
4. Search by name, contact, person, or purpose
5. Filter visitors: All / On-Site / Checked Out
6. **Check Out** visitors when they leave, or **Delete** old entries
7. Use **Manual Override** to add visitors who didn't check in themselves

### Visitor Check-in Flow
1. Open `index.html` in a browser
2. The **Chooser Modal** appears — select **Visitor** or **MSR Employee**
3. **Visitor**: Fill in Full Name, Contact Number (auto-formats to PH mobile format), select Contact Person (grouped by department), and Purpose of Visit
4. **MSR Employee**: Select your name from the dropdown (grouped by department), department is auto-filled, then click **Check In**
5. A green toast confirms your check-in ✅

---

## 📁 Project Structure

```
visitors-login-system/
├── index.html          # Check-in page
├── admin.html          # Admin dashboard
├── css/
│   ├── style.css       # Main stylesheet (design system)
│   └── admin.css       # Admin-specific styles
├── js/
│   ├── app.js          # Check-in page logic (chooser + visitor + employee)
│   └── admin.js        # Admin dashboard logic
├── images/
│   └── MSR_logo.png    # Company logo
├── Code.gs             # Google Apps Script backend
└── README.md           # This file
```

---

## 🛠️ Google Apps Script API Reference

The backend (`Code.gs`) exposes a simple HTTP API via `doGet()` and `doPost()`:

### GET / (Fetch Visitors)
```
GET {WEB_APP_URL}?search=john&filter=checked-in
```
- `search` — Search across name, contact, person, purpose
- `filter` — `checked-in` or `checked-out`

### POST / (Actions)
Send JSON with an `action` field:

**Check-in:**
```json
{ "action": "checkin", "fullName": "...", "contactNumber": "...", "contactPerson": "...", "purpose": "..." }
```

**Employee Check-in:**
```json
{ "action": "empCheckin", "fullName": "...", "department": "..." }
```

**Check Out:**
```json
{ "action": "checkout", "id": "visitor-id-here" }
```

**Delete:**
```json
{ "action": "delete", "id": "visitor-id-here" }
```

**Delete Employee:**
```json
{ "action": "empDelete", "id": "employee-id-here" }
```

---

## 🔒 Security Notes

- The default admin PIN is `1234` — change it in `Code.gs` (line: `const ADMIN_PIN = '1234'`)
- The web app executes as **you** — only you can access the Google Sheet directly
- Anyone with the web app URL can submit check-ins — this is by design for a public check-in kiosk
- For production, consider adding reCAPTCHA or IP restrictions

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

*Developed by Ritche Gerona*