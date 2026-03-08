// ── RSVP — Password-protected form with Google Sheets backend ──

// Replace with your deployed Google Apps Script Web App URL after setup
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1HJY_IR133Qv6KOQNpjzBw_bnEik7uC507tG_PIlyLIfxRSGcvQPYlsMugFmzHV8/exec';

// ── Password visibility toggle ──
function togglePasswordVisibility() {
  const input = document.getElementById('passwordInput');
  const eyeOn  = document.getElementById('eyeIcon');
  const eyeOff = document.getElementById('eyeOffIcon');
  if (input.type === 'password') {
    input.type = 'text';
    eyeOn.style.display  = 'none';
    eyeOff.style.display = '';
  } else {
    input.type = 'password';
    eyeOn.style.display  = '';
    eyeOff.style.display = 'none';
  }
}

// ── Password gate ──
function unlockRSVP(e) {
  e.preventDefault();
  const password = document.getElementById('passwordInput').value;
  const btn = e.target.querySelector('button[type="submit"]');
  const errEl = document.getElementById('passwordError');

  btn.disabled = true;
  btn.textContent = 'Checking…';
  errEl.style.display = 'none';

  fetch(`${APPS_SCRIPT_URL}?action=validatePassword&password=${encodeURIComponent(password)}`)
    .then(r => r.json())
    .then(data => {
      if (data.valid) {
        document.getElementById('rsvpGate').style.display = 'none';
        document.getElementById('rsvpSection').style.display = 'block';
        window.scrollTo({ top: document.getElementById('rsvpSection').offsetTop - 80, behavior: 'smooth' });
      } else {
        errEl.textContent = 'Incorrect password. Please check your invitation and try again.';
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Continue';
      }
    })
    .catch(() => {
      errEl.textContent = 'Something went wrong. Please try again.';
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Continue';
    });
}

// ── Show/hide attending-only fields ──
function toggleAttendance() {
  const attending = document.getElementById('attendSelect').value === 'yes';
  document.getElementById('attendingFields').style.display = attending ? 'block' : 'none';
}

// ── Additional guests ──
function updateAdditionalGuests() {
  const count = parseInt(document.getElementById('additionalGuestCount').value) || 0;
  const container = document.getElementById('additionalGuestsContainer');

  while (container.children.length > count) container.removeChild(container.lastChild);
  while (container.children.length < count) container.appendChild(createGuestBlock(container.children.length + 1));
}

function createGuestBlock(n) {
  const div = document.createElement('div');
  div.style.cssText = 'border:1px solid var(--cream-dark);padding:24px 24px 8px;margin-bottom:20px;background:var(--cream)';
  div.innerHTML = `
    <p class="sans" style="font-size:10px;letter-spacing:3px;color:var(--warm-gray);text-transform:uppercase;font-weight:300;margin-bottom:20px">Guest ${n}</p>
    <div class="form-group"><label class="form-label">Full Name *</label><input type="text" required placeholder="Guest's full name" name="g${n}_name"></div>
    <div class="form-group"><label class="form-label">Age Group *</label>
      <select required name="g${n}_age">
        <option value="">Select age group</option>
        <option value="0-5">0 – 5</option>
        <option value="6-11">6 – 11</option>
        <option value="12+">12+</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Email <span style="color:var(--warm-gray);font-weight:300;text-transform:none;letter-spacing:0">(optional)</span></label><input type="email" placeholder="email@example.com" name="g${n}_email"></div>
    <div class="form-group"><label class="form-label">Phone <span style="color:var(--warm-gray);font-weight:300;text-transform:none;letter-spacing:0">(optional)</span></label><input type="tel" placeholder="+91 XXXXX XXXXX" name="g${n}_phone"></div>
    <div class="form-group"><label class="form-label">Dietary Requirements <span style="color:var(--warm-gray);font-weight:300;text-transform:none;letter-spacing:0">(optional)</span></label><input type="text" placeholder="Any allergies or dietary preferences" name="g${n}_dietary"></div>
    <div class="form-group"><label class="form-label">Aadhar / Passport <span style="color:var(--warm-gray);font-weight:300;text-transform:none;letter-spacing:0">(optional)</span></label><input type="file" accept="image/*,.pdf" name="g${n}_id" style="padding:10px 16px;cursor:pointer"></div>
    <p class="sans" style="font-size:11px;color:var(--warm-gray);font-weight:300;margin-top:-12px;margin-bottom:16px">Accepted: JPG, PNG, PDF · Max 5 MB</p>
  `;
  return div;
}

// ── File → base64 ──
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Submit ──
async function submitRSVP(e) {
  e.preventDefault();
  const form = document.getElementById('rsvpForm');
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const attending = document.getElementById('attendSelect').value;

  // Collect additional guests
  const guestCount = parseInt(document.getElementById('additionalGuestCount')?.value) || 0;
  const guests = [];
  for (let i = 1; i <= guestCount; i++) {
    const gIdInput = form.querySelector(`[name="g${i}_id"]`);
    let gIdFile = null, gIdFileName = '';
    if (gIdInput?.files[0]) {
      gIdFile = await toBase64(gIdInput.files[0]);
      gIdFileName = gIdInput.files[0].name;
    }
    guests.push({
      name:       form.querySelector(`[name="g${i}_name"]`)?.value || '',
      age:        form.querySelector(`[name="g${i}_age"]`)?.value || '',
      email:      form.querySelector(`[name="g${i}_email"]`)?.value || '',
      phone:      form.querySelector(`[name="g${i}_phone"]`)?.value || '',
      dietary:    form.querySelector(`[name="g${i}_dietary"]`)?.value || '',
      idFile:     gIdFile,
      idFileName: gIdFileName,
    });
  }

  // ID upload (optional)
  let idFile = null, idFileName = '';
  const idInput = document.getElementById('idUpload');
  if (idInput?.files[0]) {
    idFile = await toBase64(idInput.files[0]);
    idFileName = idInput.files[0].name;
  }

  const payload = {
    name:     document.getElementById('primaryName').value,
    email:    document.getElementById('primaryEmail').value,
    phone:    document.getElementById('primaryPhone').value,
    age:      document.getElementById('primaryAge').value,
    attending,
    dietary:  attending === 'yes' ? (document.getElementById('primaryDietary').value || '') : '',
    message:  document.getElementById('messageField').value,
    guests,
    idFile,
    idFileName,
  };

  fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(r => r.json())
    .then(data => {
      if (data.duplicate) {
        btn.disabled = false;
        btn.textContent = 'Send RSVP';
        const err = document.createElement('p');
        err.className = 'sans';
        err.style.cssText = 'color:var(--burgundy);font-size:13px;font-weight:300;text-align:center;margin-top:16px';
        err.textContent = 'It looks like you\'ve already RSVP\'d. If you need to make changes, please contact us at ananmayandjennifer@gmail.com or +91 93134 64284';
        err.id = 'duplicateError';
        if (!document.getElementById('duplicateError')) btn.after(err);
      } else {
        showThanks(attending);
      }
    })
    .catch(() => showThanks(attending));
}

function showThanks(attending) {
  document.getElementById('rsvpForm').style.display = 'none';
  const thanks = document.getElementById('rsvpThanks');
  thanks.style.display = 'block';
  if (attending === 'no') {
    document.getElementById('thanksMsg').textContent = 'We\'ll miss you, but thank you for letting us know.';
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('rsvpGate')) return;
  document.getElementById('attendSelect').addEventListener('change', toggleAttendance);
  document.getElementById('additionalGuestCount').addEventListener('change', updateAdditionalGuests);
});
