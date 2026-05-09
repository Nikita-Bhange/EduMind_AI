export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export const getPasswordValidation = (password) => ({
  hasMinLength: password.length >= 6,
  hasAlphabet: /[A-Za-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecial: /[^A-Za-z0-9]/.test(password),
});

export const validatePassword = (password) => {
  const validation = getPasswordValidation(password);
  return (
    validation.hasMinLength &&
    validation.hasAlphabet &&
    validation.hasNumber &&
    validation.hasSpecial
  );
};

export const getPasswordMessage = (password, { requireStrong = false } = {}) => {
  const validation = getPasswordValidation(password);

  if (!validation.hasMinLength) {
    return "Your password is too short (minimum is 6 characters).";
  }

  if (
    requireStrong &&
    (!validation.hasAlphabet || !validation.hasNumber || !validation.hasSpecial)
  ) {
    return "Create password using one special character, alphabets and numbers.";
  }

  return "";
};
