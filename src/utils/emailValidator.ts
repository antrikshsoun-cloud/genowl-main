export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

// Known disposable, temporary, and fake testing domains
const BLOCKED_DOMAINS = new Set([
  'asdf.com',
  'test.com',
  'fake.com',
  'example.com',
  'abc.com',
  'xyz.com',
  '123.com',
  'dummy.com',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'temp-mail.org',
  'dispostable.com',
  'throwawaymail.com',
  'getairmail.com',
  'sharklasers.com',
  'maildrop.cc',
]);

// Known gibberish user handles
const BLOCKED_HANDLES = new Set([
  'asdf',
  'test',
  'fake',
  'dummy',
  'qwerty',
  'nobody',
  'sample',
  'admin',
  'root',
  'temp',
  'junk',
]);

export function validateLegalEmail(rawEmail: string): EmailValidationResult {
  const email = rawEmail.trim().toLowerCase();

  if (!email) {
    return { isValid: false, error: 'Email address cannot be empty.' };
  }

  // Basic RFC regex syntax check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid, properly formatted email address.' };
  }

  const [handle, domain] = email.split('@');

  if (!handle || !domain) {
    return { isValid: false, error: 'Incomplete email address.' };
  }

  // Check if handle is too short or common fake string
  if (handle.length < 2) {
    return { isValid: false, error: 'Email username is too short.' };
  }

  if (BLOCKED_HANDLES.has(handle)) {
    return { isValid: false, error: `"${handle}" is a generic testing name. Please provide your real legal email.` };
  }

  // Check if domain is blocked disposable/fake
  if (BLOCKED_DOMAINS.has(domain)) {
    return { isValid: false, error: `"${domain}" is flagged as a disposable or invalid domain. Please use a legitimate email provider (e.g. Gmail, Outlook, Yahoo, or your company domain).` };
  }

  // Check for repetitive/gibberish domain name like aaaaa.com or asdf
  const domainName = domain.split('.')[0];
  if (/^([a-z])\1{3,}$/.test(domainName)) {
    return { isValid: false, error: 'Domain name appears to be gibberish or invalid.' };
  }

  // Ensure domain has valid TLD extension of at least 2 chars
  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2 || /\d/.test(tld)) {
    return { isValid: false, error: 'Email must contain a valid domain extension (e.g. .com, .org, .net, .io).' };
  }

  return { isValid: true };
}
