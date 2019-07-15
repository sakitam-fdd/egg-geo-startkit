export const decimal = (num: string | number, precision = 2) => {
  if (typeof num !== 'number' && !num) {
    return '';
  }
  if (typeof num === 'string' && num.indexOf('**') > -1) {
    return num;
  }
  return `${(+num).toFixed(precision).replace(/(\d)(?=(\d{3})+\.)/g, '$&,')}`;
};

export const thousands = (num: string | number) => {
  if (typeof num !== 'number' && !num) {
    return '';
  }
  if (typeof num === 'string' && num.indexOf('**') > -1) {
    return num;
  }
  return (+num).toLocaleString();
};
