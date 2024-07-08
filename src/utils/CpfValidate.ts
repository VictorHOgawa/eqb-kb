export function validateCpf(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, ''); // remove caracteres não numéricos
  if (cpf.length !== 11) return false; // verifica o tamanho

  if (/^(\d)\1{10}$/.test(cpf)) return false; // verifica sequências iguais

  let soma = 0;
  let resto;

  // Calcula e verifica o primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  // Calcula e verifica o segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}
