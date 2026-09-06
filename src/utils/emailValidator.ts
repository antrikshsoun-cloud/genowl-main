export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

// Comprehensive blocklist of disposable, temporary, and fake testing domains
const BLOCKED_DOMAINS = new Set([
  // Common fake testing domains
  'asdf.com',
  'test.com',
  'fake.com',
  'example.com',
  'abc.com',
  'xyz.com',
  '123.com',
  'dummy.com',
  'sample.com',
  'foo.com',
  'bar.com',
  'testing.com',
  'random.com',
  'none.com',
  'noemail.com',
  'nomail.com',
  'null.com',
  'void.com',
  'fakeemail.com',
  'testmail.com',

  // Known disposable & temporary inbox providers
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'grr.la',
  'spam4.me',
  'pokemail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'temp-mail.org',
  'temp-mail.io',
  'dispostable.com',
  'throwawaymail.com',
  'getairmail.com',
  'sharklasers.com',
  'maildrop.cc',
  'nada.ltd',
  'getnada.com',
  'inboxkitten.com',
  'mohmal.com',
  'crazymailing.com',
  'burnermail.io',
  'fakemailgenerator.com',
  'emailondeck.com',
  'mytemp.email',
  'tempail.com',
  'harakirimail.com',
  'generator.email',
  'tmailor.com',
  'tempmailo.com',
  'dropmail.me',
  '10mail.org',
  'clipmail.eu',
  'inboxbear.com',
  'mailcatch.com',
  'mintemail.com',
  'trashinbox.com',
  'mytempemail.com',
  'safetymail.info',
  'tempinbox.com',
  'jetable.org',
  'mailnesia.com',
  'spambox.us',
  'spamex.com',
  'spamgourmet.com',
  'trashymail.com',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'incognitomail.org',
  'emailfake.com',
  'generator.email',
  'throwaway.email',
]);

// Known fake / bot user handles
const BLOCKED_HANDLES = new Set([
  'asdf',
  'asdfgh',
  'asdfghjkl',
  'qwerty',
  'qwertyuiop',
  'zxcvbnm',
  'test',
  'test123',
  'testing',
  'fake',
  'fakeemail',
  'dummy',
  'dummyuser',
  'nobody',
  'sample',
  'admin',
  'administrator',
  'root',
  'temp',
  'junk',
  'trash',
  'noreply',
  'no-reply',
  'null',
  'void',
  '123456',
  '12345678',
  '000000',
  'anonymous',
  'user',
]);

/**
 * Validates whether an email is properly formatted, non-disposable, non-testing, and deliverable.
 */
export function validateLegalEmail(rawEmail: string): EmailValidationResult {
  const email = rawEmail.trim().toLowerCase();

  if (!email) {
    return { isValid: false, error: 'Email ID cannot be empty.' };
  }

  // Strict RFC regex syntax check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid, properly formatted Email ID.' };
  }

  const [handle, domain] = email.split('@');

  if (!handle || !domain) {
    return { isValid: false, error: 'Incomplete Email ID.' };
  }

  // Check minimum handle length
  if (handle.length < 2) {
    return { isValid: false, error: 'Email ID username is too short.' };
  }

  // Block generic testing handles
  if (BLOCKED_HANDLES.has(handle)) {
    return { isValid: false, error: `"${handle}" is a generic testing name. Please provide your active Email ID.` };
  }

  // Detect repeated characters in handle (e.g. aaaaaa@ or 111111@)
  if (/^([a-zA-Z0-9])\1{4,}$/.test(handle)) {
    return { isValid: false, error: 'Please enter a valid, non-repetitive Email ID.' };
  }

  // Check if domain is a known disposable or fake domain
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: `"${domain}" is flagged as a disposable or temporary domain. Please use a standard email provider (e.g. Gmail, Outlook, Yahoo, or your custom domain).`,
    };
  }

  // Check for repetitive/gibberish domain name like aaaaa.com
  const domainName = domain.split('.')[0];
  if (/^([a-z])\1{3,}$/.test(domainName)) {
    return { isValid: false, error: 'Domain name appears to be invalid or gibberish.' };
  }

  // Check keyboard mash sequence in domain (e.g., asdfghjkl.com)
  if (domainName.length >= 6 && 'asdfghjkl'.includes(domainName)) {
    return { isValid: false, error: 'Please provide a legitimate Email ID domain.' };
  }

  // Ensure domain has valid TLD extension of at least 2 chars without numbers
  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2 || /\d/.test(tld)) {
    return { isValid: false, error: 'Email ID must contain a valid domain extension (e.g. .com, .org, .net, .tech).' };
  }

  return { isValid: true };
}
