# GitHub Pages Deployment — MSR Check-in

## Goal
Deploy the MSR Check-in static site to GitHub Pages under `ritchegerona`.

## Decisions
- **GitHub account**: `ritchegerona` (personal — confirmed by user)
- **Repository name**: `msr-checkin` → URL will be `https://ritchegerona.github.io/msr-checkin/`
- **Approach**: Create a **separate git repo** inside the `MSR Check-in` directory (not the monorepo parent) so GitHub Pages serves the app at root.

## Steps

### 1. Prepare `.gitignore`
Create `/MSR Check-in/.gitignore` to exclude:
- `.kilo/` (Kilo config, node_modules, etc.)
- `.DS_Store`
- `node_modules`

### 2. Initialize Local Git Repo
```bash
cd "MSR Check-in"
git init -b main
git add .
git commit -m "Deploy MSR Check-in to GitHub Pages"
```

### 3. Create GitHub Repository
```bash
gh repo create ritchegerona/msr-checkin \
  --public \
  --source=. \
  --push \
  --description "MSR Check-in — Visitor & Employee check-in system with glassmorphism UI"
```
This creates the repo **and** pushes `main` in one step.

### 4. Enable GitHub Pages
```bash
gh repo edit ritchegerona/msr-checkin \
  --enable-pages \
  --page-branch=main \
  --page-folder=/
```

### 5. Verify
- Run: `gh repo view ritchegerona/msr-checkin --web` to open the Pages site.
- Confirm `index.html` loads and API calls to the Apps Script URL work.
- Confirm `admin.html` loads and admin login works.

## Files to Include
- `index.html`
- `admin.html`
- `css/style.css`
- `css/admin.css`
- `js/app.js`
- `js/admin.js`
- `images/MSR_logo.png`
- `Code.gs`
- `README.md`
- `MEMORY.md`

## Files to Exclude
- `.kilo/` (tooling config)
- `.DS_Store`
- `node_modules`
