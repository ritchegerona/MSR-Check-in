/* ============================================
   VISITORS LOGIN SYSTEM - Main Application
   Handles form submission, validation, API calls
   With EN/TL language support
   ============================================ */

(function () {
  'use strict';

  // ─── Configuration ──────────────────────────
  const API_URL = 'https://script.google.com/macros/s/AKfycbxs9sE5s0jaNhpvMxChC-i79h9h3NuUBQo_NQSqdQwPpgWpgpMc_Pw5BBxFT5ZTCtSvzQ/exec';
  const LANG_KEY = 'msr_language';

  // ─── DOM References ────────────────────
  const form = document.getElementById('checkinForm');
  const fullName = document.getElementById('fullName');
  const contactNumber = document.getElementById('contactNumber');
  const contactPerson = document.getElementById('contactPerson');
  const purpose = document.getElementById('purpose');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');

  const welcomeScreen = document.getElementById('welcomeScreen');
  const visitorScreen = document.getElementById('visitorScreen');
  const employeeScreen = document.getElementById('employeeScreen');

  const visitorsBtn = document.getElementById('visitorsBtn');
  const employeeBtn = document.getElementById('employeeBtn');

  const employeeName = document.getElementById('employeeName');
  const employeeDept = document.getElementById('employeeDept');
  const employeeForm = document.getElementById('employeeForm');
  const employeeSubmitBtn = document.getElementById('employeeSubmitBtn');
  const employeeSuccessModal = document.getElementById('employeeSuccessModal');
  const langSelector = document.getElementById('langSelector');
  const langLabel = document.getElementById('langLabel');

  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  // ─── Translations ─────────────────────────
  const translations = {
    en: {
      systemTitle: 'Visitor Check-in System',
      welcomeTitle: 'Welcome to MSR',
      welcomeSub: 'Please select your access type',
      visitorLabel: 'Visitor',
      visitorSub: 'Check in as a guest',
      employeeLabel: 'MSR Employee',
      employeeSub: 'Staff access',
      needHelp: 'Need help?',
      askDesk: 'Ask the Reception Desk',
      infoProtected: '🔒 Your information is protected',
      versionInfo: 'Version 2.0 | © 2026 Medical Staffing Resources',
      visitorHeader: 'Visitors Check-in System',
      welcomeMsg: 'Welcome!',
      visitorSubPrompt: 'Please complete your visitor information.',
      fullNameLabel: 'FULL NAME',
      fullNamePlaceholder: 'Enter your full name',
      contactLabel: 'CONTACT NUMBER',
      personLabel: 'PERSON TO VISIT',
      selectPersonPlaceholder: 'Select person to visit...',
      purposeLabel: 'PURPOSE OF VISIT',
      selectPurposePlaceholder: 'Select purpose of visit...',
      continueCheckIn: 'Continue Check-in',
      securityNotice: 'Your information is securely protected and used only for visitor management.',
      orText: 'OR',
      adminLogin: 'Reception / Admin Login',
      adminLoginSub: 'For authorized personnel only.',
      secure: 'Secure',
      secureSub: 'Your data is safe',
      fast: 'Fast',
      fastSub: 'Quick check-in',
      professional: 'Professional',
      professionalSub: 'We value your visit',
      employeeHeader: 'Employee Check-in',
      employeeSubtitle: 'Please select your details below to record your check-in.',
      nameLabel: 'FULL NAME',
      selectEmployeePlaceholder: 'Select employee name...',
      deptLabel: 'DEPARTMENT',
      deptPlaceholder: 'Select department...',
      checkInBtn: 'Check In',
      empSecurityMsg: 'Your check-in helps us maintain a safe and secure workplace.',
      successTitle: 'Success',
      backToDashboard: 'Back to Dashboard',
      close: 'Close',
      valFullName: 'Please enter your full name (at least 2 characters).',
      valFullNameChars: 'Name contains invalid characters.',
      valContact: 'Please enter your contact number.',
      valContactFormat: 'Enter a valid PH mobile number (e.g., 0917XXX XXXX).',
      valPerson: 'Please select the person you are visiting.',
      valPurpose: 'Please select the purpose of your visit.',
      valEmployeeName: 'Please select an employee name.',
      valDept: 'Please select a department.',
      visitorSuccess: 'Check-in successful! Welcome to MSR.',
      employeeSuccess: 'Employee "{name}" logged in successfully!',
      deviceAlreadyUsed: 'This device has already been used for employee login.',
      somethingWrong: 'Something went wrong. Please try again.',
      failedCheckin: 'Failed to check in. Please try again.',
      selectPersonToVisit: 'Select person to visit...',
      selectPurposeVisit: 'Select purpose of visit...',
      selectEmployeeName: 'Select employee name...',
      selectDepartment: 'Select department...',
      languageLabel: '🌐 English'
    },
    tl: {
      systemTitle: 'Sistema ng Check-in ng mga Bisita',
      welcomeTitle: 'Maligayang Pagdating sa MSR',
      welcomeSub: 'Pakipili ang iyong uri ng access',
      visitorLabel: 'Bumisita',
      visitorSub: 'Mag-check in bilang bisita',
      employeeLabel: 'MSR Empleyado',
      employeeSub: 'Access ng staff',
      needHelp: 'Kailangan ng tulong?',
      askDesk: 'Tanungin ang Reception Desk',
      infoProtected: '🔒 Ang iyong impormasyon ay protektado',
      versionInfo: 'Bersyon 2.0 | © 2026 Medical Staffing Resources',
      visitorHeader: 'Sistema ng Check-in ng mga Bisita',
      welcomeMsg: 'Maligayang pagdating!',
      visitorSubPrompt: 'Pakicomplete ang iyong impormasyon bilang bisita.',
      fullNameLabel: 'BUONG PANGALAN',
      fullNamePlaceholder: 'Ilagay ang iyong buong pangalan',
      contactLabel: 'NUMERO NG KONTAK',
      personLabel: 'TAONG BIBISITAHIN',
      selectPersonPlaceholder: 'Pumili ng taong bibisitahin...',
      purposeLabel: 'LAYUNIN NG PAGBISITA',
      selectPurposePlaceholder: 'Pumili ng layunin ng pagbisita...',
      continueCheckIn: 'Magpatuloy sa Check-in',
      securityNotice: 'Ang iyong impormasyon ay ligtas na protektado at ginagamit lamang para sa pamamahala ng bisita.',
      orText: 'O',
      adminLogin: 'Reception / Admin Login',
      adminLoginSub: 'Para sa awtorisadong tao lamang.',
      secure: 'Ligtas',
      secureSub: 'Ligtas ang iyong data',
      fast: 'Mabilis',
      fastSub: 'Mabilisang check-in',
      professional: 'Propesyonal',
      professionalSub: 'Pinahahalagahan ang iyong pagbisita',
      employeeHeader: 'Employee Check-in',
      employeeSubtitle: 'Pakipili ang iyong detalye upang maitala ang iyong check-in.',
      nameLabel: 'BUONG PANGALAN',
      selectEmployeePlaceholder: 'Pumili ng empleyado...',
      deptLabel: 'DEPARTAMENTO',
      deptPlaceholder: 'Pumili ng departamento...',
      checkInBtn: 'Mag Check In',
      empSecurityMsg: 'Ang iyong check-in ay nakakatulong sa pagpapanatili ng ligtas at secure na workplace.',
      successTitle: 'Tagumpay',
      backToDashboard: 'Bumalik sa Dashboard',
      close: 'Isara',
      valFullName: 'Pakilagay ang iyong buong pangalan (di-kukulang sa 2 karakter).',
      valFullNameChars: 'May mga hindi wastong karakter sa pangalan.',
      valContact: 'Pakilagay ang iyong numero ng kontak.',
      valContactFormat: 'Maglagay ng wastong PH mobile number (hal., 0917XXX XXXX).',
      valPerson: 'Pakipili ang taong bibisitahin mo.',
      valPurpose: 'Pakipili ang layunin ng iyong pagbisita.',
      valEmployeeName: 'Pakipili ng pangalan ng empleyado.',
      valDept: 'Pakipili ng departamento.',
      visitorSuccess: 'Matagumpay ang check-in! Maligayang pagdating sa MSR.',
      employeeSuccess: 'Empleyado "{name}" ay matagumpay na nag-login!',
      deviceAlreadyUsed: 'Ginamit na ang device na ito para sa employee login.',
      somethingWrong: 'May nangyaring mali. Pakisubukan muli.',
      failedCheckin: 'Hindi nakapag-check in. Pakisubukan muli.',
      selectPersonToVisit: 'Pumili ng taong bibisitahin...',
      selectPurposeVisit: 'Pumili ng layunin ng pagbisita...',
      selectEmployeeName: 'Pumili ng empleyado...',
      selectDepartment: 'Pumili ng departamento...',
      languageLabel: '🌐 Tagalog'
    }
  };

  // ─── Language Switching ───────────────────
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    if (langLabel) langLabel.textContent = dict.languageLabel;

    populateDepartmentSelect(contactPerson, DEPARTMENTS, dict.selectPersonToVisit);
    populateSelect(purpose, PURPOSES, dict.selectPurposeVisit);
    populateEmployeeSelects();
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'tl' : 'en');
  }

  if (langSelector) {
    langSelector.addEventListener('click', toggleLanguage);
  }

  // ─── Departments & Contact Persons ──────────
  const DEPARTMENTS = [
    { name: 'HR DEPARTMENT', persons: ['Russell Caballero', 'Maria Anna Pili'] },
    { name: 'ACCOUNTING DEPARTMENT', persons: ['Wilma', 'Angie', 'Ella'] },
    { name: 'GCC DEPARTMENT', persons: ['Miah', 'Tin', 'Cathy', 'Jane', 'Ron', 'Marlou', 'Paul', 'Marie', 'Sofia', 'Yong', 'Ladin', 'Majeed'] },
    { name: 'DEPLOYMENT DEPARTMENT', persons: ['Madz', 'Chie', 'Zsa', 'Neil', 'Ivy', 'Patrick', 'Jen', 'Ren'] }
  ];

  const PURPOSES = ['Meeting', 'Delivery', 'Interview', 'Maintenance', 'Personal Visit', 'Job Application', 'Client Visit', 'Final Briefing', 'Submission of Documents', 'Other'];

  // ─── Populate Department-Grouped Select ─────
  function populateDepartmentSelect(selectEl, departments, placeholder) {
    selectEl.innerHTML = '<option value="">' + placeholder + '</option>';
    departments.forEach(function (dept) {
      var group = document.createElement('optgroup');
      group.label = dept.name;
      dept.persons.forEach(function (person) {
        var option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        group.appendChild(option);
      });
      selectEl.appendChild(group);
    });
  }

  function populateSelect(selectEl, options, placeholder) {
    selectEl.innerHTML = '<option value="">' + placeholder + '</option>';
    options.forEach(function (opt) {
      var option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      selectEl.appendChild(option);
    });
  }

  function populateEmployeeSelects() {
    var dict = translations[currentLang] || translations.en;
    employeeName.innerHTML = '<option value="">' + dict.selectEmployeeName + '</option>';
    DEPARTMENTS.forEach(function (dept) {
      var group = document.createElement('optgroup');
      group.label = dept.name;
      dept.persons.forEach(function (person) {
        var option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        group.appendChild(option);
      });
      employeeName.appendChild(group);
    });
    var deptNames = DEPARTMENTS.map(function (d) { return d.name; });
    populateSelect(employeeDept, deptNames, dict.selectDepartment);
  }

  // ─── Validation ─────────────────────────
  function t(key) {
    var dict = translations[currentLang] || translations.en;
    return dict[key] || key;
  }

  const validators = {
    fullName(value) {
      if (!value || value.trim().length < 2) return t('valFullName');
      if (!/^[a-zA-Z\s\-'.]+$/.test(value.trim())) return t('valFullNameChars');
      return '';
    },
    contactNumber(value) {
      var cleaned = value.replace(/[\s\-\(\)]/g, '');
      if (!cleaned) return t('valContact');
      if (!/^(\+63|0)\d{9,10}$/.test(cleaned)) return t('valContactFormat');
      return '';
    },
    contactPerson(value) {
      if (!value) return t('valPerson');
      return '';
    },
    purpose(value) {
      if (!value) return t('valPurpose');
      return '';
    },
    employeeName(value) {
      if (!value) return t('valEmployeeName');
      return '';
    },
    employeeDept(value) {
      if (!value) return t('valDept');
      return '';
    }
  };

  // ─── Show/Hide Field Error ──────────────
  function setFieldError(input, message) {
    var errorEl = (input.closest('.select-wrapper') || input.parentElement).querySelector('.error-message');
    if (message) {
      input.classList.add('error');
      input.classList.remove('success');
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    } else {
      input.classList.remove('error');
      input.classList.add('success');
      errorEl.classList.remove('visible');
    }
  }

  function validateField(input, validatorFn) {
    var error = validatorFn(input.value);
    setFieldError(input, error);
    return !error;
  }

  function validateForm() {
    var fields = [
      { input: fullName, validator: validators.fullName },
      { input: contactNumber, validator: validators.contactNumber },
      { input: contactPerson, validator: validators.contactPerson },
      { input: purpose, validator: validators.purpose }
    ];
    var isValid = true;
    fields.forEach(function (item) {
      if (!validateField(item.input, item.validator)) isValid = false;
    });
    return isValid;
  }

  // ─── Real-time Validation ───────────────
  fullName.addEventListener('blur', function () { validateField(fullName, validators.fullName); });
  contactNumber.addEventListener('blur', function () { validateField(contactNumber, validators.contactNumber); });
  contactPerson.addEventListener('change', function () { validateField(contactPerson, validators.contactPerson); });
  purpose.addEventListener('change', function () { validateField(purpose, validators.purpose); });

  [fullName, contactNumber, contactPerson, purpose].forEach(function (input) {
    input.addEventListener('focus', function () {
      input.classList.remove('error');
      var errorEl = input.parentElement.querySelector('.error-message');
      if (errorEl) errorEl.classList.remove('visible');
    });
  });

  // ─── Contact Number Formatting ───────────
  contactNumber.addEventListener('input', function () {
    var value = this.value.replace(/[^0-9]/g, '');
    if (value.startsWith('63')) value = '0' + value.slice(2);
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 4) this.value = value.slice(0, 4) + ' ' + value.slice(4);
    if (value.length > 9) this.value = value.slice(0, 4) + ' ' + value.slice(4, 9) + ' ' + value.slice(9);
  });

  // ─── Show Toast Notification ────────────
  function showToast(message, type) {
    var icon = type === 'error' ? '❌' : '✅';
    toast.innerHTML = icon + ' ' + message;
    toast.className = 'toast ' + (type || '');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3500);
  }

  // ─── API Call: Check-in ───────────────────
  async function submitCheckin(visitorData) {
    await fetch(API_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(visitorData) });
  }

  // ─── Handle Form Submission ─────────────
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateForm()) {
      var firstError = form.querySelector('.form-input.error, .form-select.error');
      if (firstError) firstError.focus();
      return;
    }
  submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    var visitorData = { action: 'checkin', fullName: fullName.value.trim(), contactNumber: contactNumber.value.trim(), contactPerson: contactPerson.value, purpose: purpose.value };
    try {
      await submitCheckin(visitorData);
      showVisitorSuccessModal(visitorData.fullName);
      form.reset();
      [fullName, contactNumber, contactPerson, purpose].forEach(function (input) { input.classList.remove('success', 'error'); });
      contactNumber.value = '';
    } catch (err) {
      showToast(t('somethingWrong'), 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // ─── Show/Hide Modal ─────────────────────
  function showModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  function hideAllModals() {
    document.querySelectorAll('.modal').forEach(function (modal) { modal.classList.add('hidden'); });
    document.body.classList.remove('modal-open');
  }

  // ─── Screen Management ─────────────────
  function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.add('hidden'); s.classList.remove('active'); });
    screen.classList.remove('hidden');
    screen.classList.add('active');
  }

  visitorsBtn.addEventListener('click', function () { hideAllModals(); showScreen(visitorScreen); });
  employeeBtn.addEventListener('click', function () { hideAllModals(); showScreen(employeeScreen); });

  // Back to Main Dashboard buttons (arrow icons) for Visitor and Employee screens
  var visitorBackArrow = document.getElementById('visitorBackBtnTop');
  if (visitorBackArrow) {
    visitorBackArrow.addEventListener('click', function () {
      hideAllModals();
      showScreen(welcomeScreen);
    });
  }

  var employeeBackArrow = document.getElementById('employeeBackBtnTop');
  if (employeeBackArrow) {
    employeeBackArrow.addEventListener('click', function () {
      hideAllModals();
      showScreen(welcomeScreen);
    });
  }

  // ─── Employee Device Login Tracking ──────
  var EMPLOYEE_LOGIN_KEY = 'msr_employee_logged_in_device';
  var EMPLOYEE_LOGIN_COUNT_KEY = 'msr_employee_login_count';
  var EMPLOYEE_LOGIN_MAX = 5;

  function getDeviceId() {
    var deviceId = localStorage.getItem(EMPLOYEE_LOGIN_KEY);
    if (!deviceId) {
      deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
      localStorage.setItem(EMPLOYEE_LOGIN_KEY, deviceId);
    }
    return deviceId;
  }

  function getLoginCount() {
    var count = parseInt(localStorage.getItem(EMPLOYEE_LOGIN_COUNT_KEY) || '0', 10);
    return isNaN(count) ? 0 : count;
  }

  function canLogin() {
    return getLoginCount() < EMPLOYEE_LOGIN_MAX;
  }

  function incrementLoginCount() {
    var count = getLoginCount() + 1;
    localStorage.setItem(EMPLOYEE_LOGIN_COUNT_KEY, count.toString());
  }

  // ─── Visitor Success Modal ───────────────
  function showVisitorSuccessModal(name) {
    var messageEl = document.getElementById('visitorSuccessMessage');
    var closeBtn = document.getElementById('visitorCloseBtn');
    var backBtn = document.getElementById('visitorBackBtn');
    var btnContainer = document.getElementById('visitorSuccessBtnContainer');
    if (messageEl) messageEl.textContent = t('visitorSuccess');
    if (btnContainer) btnContainer.classList.add('hidden');
    showModal('visitorSuccessModal');
    setTimeout(function () { if (btnContainer) btnContainer.classList.remove('hidden'); }, 3000);
    if (closeBtn) closeBtn.onclick = function () { hideAllModals(); resetToChooser(); };
    if (backBtn) backBtn.onclick = function () { hideAllModals(); resetToChooser(); };
  }

  // ─── Employee Success Modal ───────────────
  function showEmployeeSuccessModal(employeeNameVal) {
    var messageEl = document.getElementById('employeeSuccessMessage');
    var closeBtn = document.getElementById('employeeCloseBtn');
    var backBtn = document.getElementById('employeeBackBtn');
    var btnContainer = document.getElementById('employeeSuccessBtnContainer');
    if (messageEl) messageEl.textContent = t('employeeSuccess').replace('{name}', employeeNameVal);
    if (btnContainer) btnContainer.classList.add('hidden');
    showModal('employeeSuccessModal');
    setTimeout(function () { if (btnContainer) btnContainer.classList.remove('hidden'); }, 3000);
    if (closeBtn) closeBtn.onclick = function () { hideAllModals(); resetToChooser(); };
    if (backBtn) backBtn.onclick = function () { hideAllModals(); resetToChooser(); };
  }

  function resetToChooser() { showScreen(welcomeScreen); }

  // ─── Employee Validation ──────────────
  var employeeNameTouched = false;
  var employeeDeptTouched = false;

  function validateEmployeeName(value) { return !value ? t('valEmployeeName') : ''; }
  function validateEmployeeDept(value) { return !value ? t('valDept') : ''; }

  function runEmployeeValidation() {
    if (!employeeNameTouched && !employeeDeptTouched) return true;
    var nameOk = validateField(employeeName, validateEmployeeName);
    var deptOk = validateField(employeeDept, validateEmployeeDept);
    return nameOk && deptOk;
  }

  employeeName.addEventListener('change', function () {
    if (this.value) {
      var dept = DEPARTMENTS.find(function (d) { return d.persons.includes(this.value); }, this)?.name || '';
      employeeDept.value = dept;
    }
    if (!employeeNameTouched) employeeNameTouched = true;
    validateField(employeeName, validateEmployeeName);
  });

  employeeDept.addEventListener('change', function () {
    if (!employeeDeptTouched) employeeDeptTouched = true;
    validateField(employeeDept, validateEmployeeDept);
  });

  // ─── Employee Check-in ─────────────────
  async function submitEmployeeCheckin() {
    if (!runEmployeeValidation()) return;
    if (!canLogin()) { showToast('Maximum login attempts reached', 'error'); return; }
    employeeSubmitBtn.classList.add('loading');
    employeeSubmitBtn.disabled = true;
    var data = { action: 'empCheckin', fullName: employeeName.value, department: employeeDept.value };
    try {
      await fetch(API_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      employeeForm.reset();
      hideAllModals();
      incrementLoginCount();
      showEmployeeSuccessModal(data.fullName);
    } catch (err) {
      showToast(t('failedCheckin'), 'error');
    } finally {
      employeeSubmitBtn.classList.remove('loading');
      employeeSubmitBtn.disabled = false;
    }
  }

  employeeForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    employeeNameTouched = true;
    employeeDeptTouched = true;
    await submitEmployeeCheckin();
  });

  // ─── Admin Login Button ─────────────────
  var adminBtn = document.getElementById('adminBtn');
  if (adminBtn) adminBtn.addEventListener('click', function () { window.location.href = 'admin.html'; });

  // ─── Keyboard shortcut detection for admin ──
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') { e.preventDefault(); window.location.href = 'admin.html'; }
  });

  // ─── Real-time Clock ───────────────────
  function updateClock() {
    var now = new Date();
    var dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    var timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    document.querySelectorAll('#currentDate, #empDate').forEach(function (el) { if (el) el.textContent = dateStr; });
    document.querySelectorAll('#currentTime, #empTime').forEach(function (el) { if (el) el.textContent = timeStr; });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ─── Initialize on DOM Ready ─────────────
  document.addEventListener('DOMContentLoaded', function () {
    setLanguage(currentLang);
    showScreen(welcomeScreen);
  });

  setLanguage(currentLang);

  console.log('%c🏢 MSR Check-in v2.0', 'font-size: 18px; font-weight: bold; color: #00838f;');
  console.log('%c🔧 API:', 'font-size: 12px; color: #546e7a;', API_URL);
  console.log('%c🌐 Language:', 'font-size: 12px; color: #546e7a;', currentLang);

})();