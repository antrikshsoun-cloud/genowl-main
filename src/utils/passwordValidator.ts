export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  rules: {
    minLength: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    noRepeatMoreThanTwo: boolean;
    noSequentialMoreThanTwo: boolean;
  };
}

export function validatePasswordStrength(pwd: string): PasswordValidationResult {
  const errors: string[] = [];

  const minLength = pwd.length >= 8;
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(pwd);

  // Check for same number repeated more than two times (e.g. 111, 222, 999)
  const hasRepeatMoreThanTwo = /(\d)\1\1/.test(pwd);
  const noRepeatMoreThanTwo = !hasRepeatMoreThanTwo;

  // Check for sequential numbers of more than two numbers (e.g. 123, 789, 321, 654)
  let hasSequential = false;
  for (let i = 0; i <= pwd.length - 3; i++) {
    const c1 = pwd.charCodeAt(i);
    const c2 = pwd.charCodeAt(i + 1);
    const c3 = pwd.charCodeAt(i + 2);

    // Check if all 3 characters are digits ('0'-'9')
    if (c1 >= 48 && c1 <= 57 && c2 >= 48 && c2 <= 57 && c3 >= 48 && c3 <= 57) {
      if ((c2 - c1 === 1 && c3 - c2 === 1) || (c1 - c2 === 1 && c2 - c3 === 1)) {
        hasSequential = true;
        break;
      }
    }
  }
  const noSequentialMoreThanTwo = !hasSequential;

  if (!minLength) {
    errors.push('At least 8 characters long');
  }
  if (!hasNumber) {
    errors.push('At least one numeric number (0-9)');
  }
  if (!hasSpecial) {
    errors.push('At least one special character (!@#$%^&* etc.)');
  }
  if (!noRepeatMoreThanTwo) {
    errors.push('Same number cannot repeat more than two times (e.g. no 111, 222)');
  }
  if (!noSequentialMoreThanTwo) {
    errors.push('Cannot contain sequential numbers of more than two numbers (e.g. no 123, 321)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    rules: {
      minLength,
      hasNumber,
      hasSpecial,
      noRepeatMoreThanTwo,
      noSequentialMoreThanTwo,
    },
  };
}
