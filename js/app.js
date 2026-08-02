/* ============================================
   VISITORS LOGIN SYSTEM - Main Application
   Handles form submission, validation, API calls
   ============================================ */

(function () {
  'use strict';

  // ─── Configuration ──────────────────────────
  const API_URL = 'https://script.google.com/macros/s/AKfycbxs9sE5s0jaNhpvMxChC-i79h9h3NuUBQo_NQSqdQwPpgWpgpMc_Pw5BBxFT5ZTCtSvzQ/exec';

  // ─── DOM References ────────────────────
  const form = document.getElementById('checkinForm');
  const fullName = document.getElementById('fullName');
  const contactNumber = document.getElementById('contactNumber');
  const contactPerson = document.getElementById('contactPerson');
  const purpose = document.getElementById('purpose');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');

  const chooserModal = document.getElementById('chooserModal');
  const employeeModal = document.getElementById('employeeModal');
  const mainContainer = document.getElementById('mainContainer');

  const visitorsBtn = document.getElementById('visitorsBtn');
  const employeeBtn = document.getElementById('employeeBtn');

  const employeeName = document.getElementById('employeeName');
  const employeeDept = document.getElementById('employeeDept');
  const employeeForm = document.getElementById('employeeForm');
  const employeeSubmitBtn = document.getElementById('employeeSubmitBtn');

  // ─── Departments & Contact Persons ──────────
  const DEPARTMENTS = [
    {
      name: 'HR DEPARTMENT',
      persons: [
        'Russell Caballero',
        'Maria Anna Pili'
      ]
    },
    {
      name: 'ACCOUNTING DEPARTMENT',
      persons: [
        'Wilma',
        'Angie',
        'Ella'
      ]
    },
    {
      name: 'GCC DEPARTMENT',
      persons: [
        'Miah',
        'Tin',
        'Cathy',
        'Jane',
        'Ron',
        'Marlou',
        'Paul',
        'Marie',
        'Sofia',
        'Yong',
        'Ladin',
        'Majeed'
      ]
    },
    {
      name: 'DEPLOYMENT DEPARTMENT',
      persons: [
        'Madz',
        'Chie',
        'Zsa',
        'Neil',
        'Ivy',
        'Patrick',
        'Jen',
        'Ren'
      ]
    }
  ];

  const PURPOSES = [
    'Meeting',
    'Delivery',
    'Interview',
    'Maintenance',
    'Personal Visit',
    'Job Application',
    'Client Visit',
    'Final Briefing',
    'Submission of Documents',
    'Other'
  ];

  // ─── Populate Department-Grouped Select ─────
  function populateDepartmentSelect(selectEl, departments, placeholder) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    departments.forEach(dept => {
      const group = document.createElement('optgroup');
      group.label = dept.name;
      dept.persons.forEach(person => {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        group.appendChild(option);
      });
      selectEl.appendChild(group);
    });
  }

  function populateSelect(selectEl, options, placeholder) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      selectEl.appendChild(option);
    });
  }

  // Populate visitor form selects
  populateDepartmentSelect(contactPerson, DEPARTMENTS, 'Select person to visit...');
  populateSelect(purpose, PURPOSES, 'Select purpose of visit...');

  // Populate employee selects - name dropdown with department grouping
  function populateEmployeeSelects() {
    employeeName.innerHTML = '<option value="">Select employee name...</option>';
    DEPARTMENTS.forEach(dept => {
      const group = document.createElement('optgroup');
      group.label = dept.name;
      dept.persons.forEach(person => {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        group.appendChild(option);
      });
      employeeName.appendChild(group);
    });

    // Populate department dropdown
    const deptNames = DEPARTMENTS.map(d => d.name);
    populateSelect(employeeDept, deptNames, 'Select department...');
  }

  populateEmployeeSelects();

  // ─── Validation ─────────────────────────
  const validators = {
    fullName(value) {
      if (!value || value.trim().length < 2) {
        return 'Please enter your full name (at least 2 characters).';
      }
      if (!/^[a-zA-Z\s\-'.]+$/.test(value.trim())) {
        return 'Name contains invalid characters.';
      }
      return '';
    },
    contactNumber(value) {
      const cleaned = value.replace(/[\s\-\(\)]/g, '');
      if (!cleaned) {
        return 'Please enter your contact number.';
      }
      if (!/^(\+63|0)\d{9,10}$/.test(cleaned)) {
        return 'Enter a valid PH mobile number (e.g., 0917XXX XXXX).';
      }
      return '';
    },
    contactPerson(value) {
      if (!value) {
        return 'Please select the person you are visiting.';
      }
      return '';
    },
    purpose(value) {
      if (!value) {
        return 'Please select the purpose of your visit.';
      }
      return '';
    },
    employeeName(value) {
      if (!value) {
        return 'Please select an employee name.';
      }
      return '';
    },
    employeeDept(value) {
      if (!value) {
        return 'Please select a department.';
      }
      return '';
    }
  };

// ─── Show/Hide Field Error ──────────────
function setFieldError(input, message) {
  const errorEl = (input.closest('.select-wrapper') || input.parentElement).querySelector('.error-message');
  if (!errorEl) return;

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

  // ─── Validate Single Field ──────────────
  function validateField(input, validatorFn) {
    const error = validatorFn(input.value);
    setFieldError(input, error);
    return !error;
  }

  // ─── Validate All Fields ────────────
  function validateForm() {
    const fields = [
      { input: fullName, validator: validators.fullName },
      { input: contactNumber, validator: validators.contactNumber },
      { input: contactPerson, validator: validators.contactPerson },
      { input: purpose, validator: validators.purpose }
    ];

    let isValid = true;
    fields.forEach(({ input, validator }) => {
      if (!validateField(input, validator)) {
        isValid = false;
      }
    });
    return isValid;
  }

  // ─── Real-time Validation ───────────────
  fullName.addEventListener('blur', () => validateField(fullName, validators.fullName));
  contactNumber.addEventListener('blur', () => validateField(contactNumber, validators.contactNumber));
  contactPerson.addEventListener('change', () => validateField(contactPerson, validators.contactPerson));
  purpose.addEventListener('change', () => validateField(purpose, validators.purpose));

  // Clear error on focus
  [fullName, contactNumber, contactPerson, purpose].forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.error-message');
      if (errorEl) errorEl.classList.remove('visible');
    });
  });

  // ─── Contact Number Formatting ───────────
  contactNumber.addEventListener('input', function () {
    let value = this.value.replace(/[^0-9]/g, '');
    if (value.startsWith('63')) {
      value = '0' + value.slice(2);
    }
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    if (value.length > 4) {
      this.value = value.slice(0, 4) + ' ' + value.slice(4);
    }
    if (value.length > 9) {
      this.value = value.slice(0, 4) + ' ' + value.slice(4, 9) + ' ' + value.slice(9);
    }
  });

  // ─── Show Toast Notification ────────────
  function showToast(message, type) {
    const icon = type === 'error' ? '❌' : '✅';
    toast.innerHTML = `${icon} ${message}`;
    toast.className = `toast ${type || ''}`;
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // ─── API Call: Check-in ───────────────────
  async function submitCheckin(visitorData) {
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitorData)
    });
  }

  // ─── Handle Form Submission ─────────────
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = form.querySelector('.form-input.error, .form-select.error');
      if (firstError) firstError.focus();
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const visitorData = {
      action: 'checkin',
      fullName: fullName.value.trim(),
      contactNumber: contactNumber.value.trim(),
      contactPerson: contactPerson.value,
      purpose: purpose.value
    };

    try {
      await submitCheckin(visitorData);
      showToast(`Welcome, ${visitorData.fullName.split(' ')[0]}! You're checked in.`, 'success');
      form.reset();

      [fullName, contactNumber, contactPerson, purpose].forEach(input => {
        input.classList.remove('success', 'error');
      });

      contactNumber.value = '';
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // ─── Show/Hide Modal ─────────────────────
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
    document.body.classList.add('modal-open');
  }

  function hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.classList.remove('modal-open');
  }

  // ─── Handle Chooser ───────────────────────
  visitorsBtn.addEventListener('click', () => {
    hideAllModals();
    mainContainer.classList.remove('hidden');
    mainContainer.style.display = 'block';
  });

  employeeBtn.addEventListener('click', () => {
    hideAllModals();
    showModal('employeeModal');
  });

  // ─── Employee Validation ──────────────
let employeeNameTouched = false;
let employeeDeptTouched = false;

function validateEmployeeName(value) {
  if (!value) return 'Please select an employee name.';
  return '';
}

function validateEmployeeDept(value) {
  if (!value) return 'Please select a department.';
  return '';
}

function runEmployeeValidation() {
  if (!employeeNameTouched && !employeeDeptTouched) return true;
  const nameOk = validateField(employeeName, validateEmployeeName);
  const deptOk = validateField(employeeDept, validateEmployeeDept);
  return nameOk && deptOk;
}

employeeName.addEventListener('change', function () {
  if (this.value) {
    const dept = DEPARTMENTS.find(d => d.persons.includes(this.value))?.name || '';
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

  employeeSubmitBtn.classList.add('loading');
  employeeSubmitBtn.disabled = true;

  const data = {
    action: 'empCheckin',
    fullName: employeeName.value,
    department: employeeDept.value
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    employeeForm.reset();
    hideAllModals();
    mainContainer.classList.remove('hidden');
    mainContainer.style.display = 'block';
    showToast(`Welcome, ${data.fullName}!`, 'success');
  } catch (err) {
    showToast('Failed to check in. Please try again.', 'error');
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
  const adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      window.location.href = 'admin.html';
    });
  }

  // ─── Keyboard shortcut detection for admin ──
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  // ─── Initialize on DOM Ready ─────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Show chooser modal (starting point without QR scanner)
    chooserModal.classList.remove('hidden');

    // Hide main container initially
    mainContainer.classList.add('hidden');
    mainContainer.style.display = 'none';
  });

  console.log('%c🏢 MSR Check-in v1.0', 'font-size: 18px; font-weight: bold; color: #1a73e8;');
  console.log('%c🔧 API:', 'font-size: 12px; color: #5a6a7e;', API_URL);

})();