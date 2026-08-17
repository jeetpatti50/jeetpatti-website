const https = require('https');

// 2Factor.in AUTOGEN OTP integration.
// Session ids are kept in memory, keyed by phone, so an OTP can only be
// verified for the exact number that received the SMS.
const sessions = new Map(); // phone -> { sessionId, expiresAt, lastSentAt }
const verified = new Map(); // phone -> expiresAt (proof the number was verified)

const OTP_TTL_MS      = 10 * 60 * 1000; // OTP valid for 10 minutes
const RESEND_COOLDOWN = 30 * 1000;      // min 30s between sends per number
const VERIFIED_TTL_MS = 15 * 60 * 1000; // verified proof valid for 15 minutes

function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Bad response from OTP provider')); }
      });
    }).on('error', reject);
  });
}

// Send an OTP to the given 10-digit phone. Returns { ok } or throws.
async function sendOtp(phone) {
  const key = process.env.TWOFACTOR_API_KEY;
  if (!key) throw new Error('OTP service not configured');

  const existing = sessions.get(phone);
  if (existing && Date.now() - existing.lastSentAt < RESEND_COOLDOWN) {
    const wait = Math.ceil((RESEND_COOLDOWN - (Date.now() - existing.lastSentAt)) / 1000);
    const err = new Error(`Please wait ${wait}s before requesting another OTP`);
    err.code = 'COOLDOWN';
    throw err;
  }

  // AUTOGEN with no template delivers via VOICE CALL. To send an SMS, pass a
  // DLT-approved OTP template name from your 2Factor dashboard (TWOFACTOR_TEMPLATE).
  const template = process.env.TWOFACTOR_TEMPLATE;
  const url = template
    ? `https://2factor.in/API/V1/${key}/SMS/${phone}/AUTOGEN/${encodeURIComponent(template)}`
    : `https://2factor.in/API/V1/${key}/SMS/${phone}/AUTOGEN`;
  console.log('[OTP] template =', JSON.stringify(template));
  console.log('[OTP] request URL =', url.replace(key, '<KEY>'));
  const data = await apiGet(url);
  console.log('[OTP] 2Factor response =', JSON.stringify(data));
  if (data.Status !== 'Success') {
    throw new Error(data.Details || 'Failed to send OTP');
  }

  sessions.set(phone, {
    sessionId: data.Details,
    expiresAt: Date.now() + OTP_TTL_MS,
    lastSentAt: Date.now()
  });
  return { ok: true };
}

// Verify the OTP entered for a phone. Returns true on match, false otherwise.
async function verifyOtp(phone, otp) {
  const key = process.env.TWOFACTOR_API_KEY;
  if (!key) throw new Error('OTP service not configured');

  const entry = sessions.get(phone);
  if (!entry) { const e = new Error('No OTP requested for this number'); e.code = 'NO_SESSION'; throw e; }
  if (Date.now() > entry.expiresAt) {
    sessions.delete(phone);
    const e = new Error('OTP expired, please request a new one'); e.code = 'EXPIRED'; throw e;
  }

  const url = `https://2factor.in/API/V1/${key}/SMS/VERIFY/${entry.sessionId}/${encodeURIComponent(otp)}`;
  const data = await apiGet(url);
  const matched = data.Status === 'Success';
  if (matched) {
    sessions.delete(phone); // one-time use
    verified.set(phone, Date.now() + VERIFIED_TTL_MS);
  }
  return matched;
}

// True only if this phone was verified recently. One-time: consumes the proof.
function consumeVerified(phone) {
  const exp = verified.get(phone);
  if (!exp) return false;
  verified.delete(phone);
  return Date.now() <= exp;
}

module.exports = { sendOtp, verifyOtp, consumeVerified };
