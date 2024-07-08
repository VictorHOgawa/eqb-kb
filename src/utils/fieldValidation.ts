interface Props {
  holderName: string;
  number: string;
  expiryDate: string;
  ccv: string;
  name: string;
  email: string;
  mobilePhone: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
}

export const CreditCardValidation = (data: Props) => {
  if (data.holderName === '' || !data.holderName) {
    return 'Nome do cartão é obrigatório';
  }
  if (data.number === '' || !data.number) {
    return 'Número do cartão é obrigatório';
  }
  if (data.expiryDate === '' || !data.expiryDate) {
    return 'expiração do cartão é obrigatória';
  }
  if (data.ccv === '' || !data.ccv) {
    return 'Código de segurança é obrigatório';
  }
  return 'ok';
};

export const CreditCardHolderValidation = (data: Props) => {
  if (data.holderName === '' || !data.holderName) {
    return 'Nome do cartão é obrigatório';
  }
  if (data.number === '' || !data.number) {
    return 'Número do cartão é obrigatório';
  }
  if (data.expiryDate === '' || !data.expiryDate) {
    return 'expiração do cartão é obrigatória';
  }
  if (data.ccv === '' || !data.ccv) {
    return 'Código de segurança é obrigatório';
  }
  if (data.name === '' || !data.name) {
    return 'Nome completo é obrigatório';
  }
  if (data.email === '' || !data.email) {
    return 'Email é obrigatório';
  }
  if (data.mobilePhone === '' || !data.mobilePhone) {
    return 'Telefone é obrigatório';
  }
  if (data.cpfCnpj === '' || !data.cpfCnpj) {
    return 'CPF ou Cnpj é obrigatório';
  }
  if (data.postalCode === '' || !data.postalCode) {
    return 'CEP é obrigatório';
  }
  if (data.addressNumber === '' || !data.addressNumber) {
    return 'Número é obrigatório';
  }

  return 'ok';
};
