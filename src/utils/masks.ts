// export function maskCard(value: string) {
//   if (!value) {
//     return "";
//   }
//   value = value.replace(/\D/g, "");
//   value = value.replace(/(\d{4})(\d)/, "$1 $2");
//   value = value.replace(/(\d{4})(\d)/, "$1 $2");
//   value = value.replace(/(\d{4})(\d)/, "$1 $2");
//   return value;
// }

// export function maskCep(value: string) {
//   if (!value) {
//     return "";
//   }

//   value = value.replace(/\D/g, ""); // 1239856
//   value = value.replace(/^(\d{5})(\d)/, "$1-$2");
//   return value;
// }

// export function maskPhone(value: string) {
//   if (!value) {
//     return "";
//   }
//   value = value.replace(/\D/g, "");
//   // (11)1111-1111
//   value = value.replace(/^(\d{2})(\d)/g, "($1)$2");
//   value = value.replace(/(\d)(\d{4})$/, "$1-$2");
//   return value;
// }

// export function maskCpfCnpj(value: string) {
//   if (!value) {
//     return "";
//   }
//   value = value.replace(/\D/g, "");

//   if (value.length <= 11) {
//     value = value.replace(/(\d{3})(\d)/, "$1.$2");
//     value = value.replace(/(\d{3})(\d)/, "$1.$2");
//     value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
//   } else {
//     value = value.replace(/^(\d{2})(\d)/, "$1.$2");
//     value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
//     value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
//     value = value.replace(/(\d{4})(\d)/, "$1-$2");
//   }

//   return value;
// }

// export function maskDate(value: string) {
//   if (!value) {
//     return "";
//   }
//   value = value.replace(/\D/g, "");
//   value = value.replace(/(\d{2})(\d)/, "$1/$2");
//   return value;

//   // let data = value;
//   // data = data.replace(/\D/g, "");

//   // if (data.length > 8) {
//   //   data = data.slice(0, 8);
//   // }

//   // if (data.length > 4) {
//   //   data = data.slice(0, 2) + "/" + data.slice(2, 4) + "/" + data.slice(4);
//   // }

//   // return data;
// }

// export function maskCVC(value: string) {
//   if (!value) {
//     return "";
//   }
//   value = value.replace(/\D/g, "");
//   return value;
// }

// export const textWithSpacesOnly = (value: string) => {
//   if (value) {
//     if (/^[a-zA-ZÀ-ú ]*$/i.test(value)) {
//       return undefined;
//     } else {
//       return "Somente letras";
//     }
//   } else {
//     return undefined;
//   }
// };

// export const minLength = (min: number) => (value: string | any[]) =>
//   value && value.length < min
//     ? `Deve ter pelo menos ${min} dígitos`
//     : undefined;

export function maskCard(value: string) {
  if (!value) {
    return '';
  }
  if (value.length <= 17) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(\d)/, '$1 $2');
    value = value.replace(/(\d{6})(\d)/, '$1 $2');
    return value;
  }
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{4})(\d)/, '$1 $2');
  value = value.replace(/(\d{4})(\d)/, '$1 $2');
  value = value.replace(/(\d{4})(\d)/, '$1 $2');
  return value;
}

export const textOnly = (value: string) => {
  if (!value) {
    return '';
  }
  // Remove any numbers from the input text
  value = value.replace(/[0-9]/g, '');
  return value;
};

export function maskCep(value: string) {
  if (!value) {
    return '';
  }

  value = value.replace(/\D/g, ''); // 1239856
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  return value;
}

export function maskPhone(value: string) {
  if (!value) {
    return '';
  }
  value = value.replace(/\D/g, '');
  // (11)1111-1111
  value = value.replace(/^(\d{2})(\d)/g, '($1)$2');
  value = value.replace(/(\d)(\d{4})$/, '$1-$2');
  return value;
}

export function maskCpfCnpj(value: string) {
  if (!value) {
    return '';
  }
  value = value.replace(/\D/g, '');

  // if (value.length <= 11) {
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  /*}  else {
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  } */

  return value;
}

export function maskDate(value: string) {
  if (!value) {
    return '';
  }
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{2})(\d)/, '$1/$2');
  return value;

  // let data = value;
  // data = data.replace(/\D/g, "");

  // if (data.length > 8) {
  //   data = data.slice(0, 8);
  // }

  // if (data.length > 4) {
  //   data = data.slice(0, 2) + "/" + data.slice(2, 4) + "/" + data.slice(4);
  // }

  // return data;
}

export function maskCVC(value: string) {
  if (!value) {
    return '';
  }
  value = value.replace(/\D/g, '');
  return value;
}

export const textWithSpacesOnly = (value: string) => {
  if (value) {
    if (/^[a-zA-ZÀ-ú ]*$/i.test(value)) {
      return undefined;
    } else {
      return 'Somente letras';
    }
  } else {
    return undefined;
  }
};

export const minLength = (min: number) => (value: string | any[]) =>
  value && value.length < min ? `Deve ter pelo menos ${min} dígitos` : undefined;
