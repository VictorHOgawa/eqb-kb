// masks.js

export const maskCardNumber = (value: any) => {
  return value
    .replace(/\D/g, '') // Remove caracteres que não sejam dígitos
    .replace(/(\d{4})/g, '$1 ') // Divide os dígitos em grupos de 4 separados por espaço
    .trim() // Remove espaço extra no final
    .substring(0, 19); // Limita a 16 dígitos + 3 espaços
};

export const maskExpiryDate = (value: any) => {
  return value
    .replace(
      /[^0-9]/g,
      '' // Remove caracteres que não sejam dígitos
    )
    .replace(
      /(\d{2})(\d)/,
      '$1/$2' // Adiciona uma barra após 2 dígitos
    )
    .substring(0, 5); // Limita a 5 caracteres (MM/AA)
};

export const maskPhone = (value: any) => {
  if (!value) {
    return '';
  }
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 15);
};

export const maskCPF = (value: any) => {
  if (!value) {
    return '';
  }
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
};

export const maskCNPJ = (value: any) => {
  if (!value) {
    return '';
  }
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
};

export const maskCPFOrCNPJ = (value: any) => {
  if (!value) {
    return '';
  }
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.length > 11 ? maskCNPJ(cleanValue) : maskCPF(cleanValue);
};

export const maskCEP = (value: any) => {
  return value
    .replace(/\D/g, '') // Remove não dígitos
    .replace(/^(\d{5})(\d)/, '$1-$2') // Insere hífen após os 5 primeiros dígitos
    .substring(0, 9); // Limita a 9 caracteres
};
