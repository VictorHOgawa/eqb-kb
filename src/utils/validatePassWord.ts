export function validatePassword(password: any) {
  const errors = [];
  if (password.length < 6) {
    errors.push('pelo menos 6 dígitos');
  }
  if (!/\d/.test(password)) {
    errors.push('um número');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('um caractere especial');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('uma letra maiúscula');
  }

  if (errors.length > 0) {
    return 'Sua senha deve conter ' + errors.join(', ') + '.';
  }
  return null;
}
