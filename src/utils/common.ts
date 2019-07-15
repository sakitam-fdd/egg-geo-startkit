import isNaN from 'lodash/isNaN';
// import toNumber from 'lodash/toNumber';

/**
 * 解析require.context
 * @param context
 * @param def [是否默认导出]
 * @param ignore [忽略文件]
 * @returns {Array}
 */
export const getContext = (context: any, def = true, ignore: string | number) => {
  const children: any[] = [];
  context.keys().forEach((key: string | number) => {
    if (key !== ignore) {
      const arr = def ? context(key).default : context(key);
      if (arr) {
        children.push(arr);
      }
    }
  });
  return children;
};

/**
 * 检测 localStorage 是否超出容量
 * @param clear [为 `true` 时当容量不足时自动清空]
 * @returns {boolean}
 */
export const checkLocalStorage = (clear: boolean) => {
  try {
    localStorage.setItem('checklocalstorage', String(1));
    localStorage.removeItem('checklocalstorage');
    return true;
  } catch (e) {
    clear && localStorage.clear();
    return false;
  }
};

export function sequence(a: number, b: number) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

/**
 * 生成随机字符串
 * @returns {*}
 */
export function uuid() {
  function b(a?: number) {
    // @ts-ignore
    // eslint-disable-next-line no-mixed-operators,no-bitwise
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -[1e3] + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  }
  return b();
}

/**
 * function bind
 * @param fns
 * @param context
 */
export function bindAll(fns: any[], context: any) {
  fns.forEach((fn) => {
    if (!context[fn]) { return; }
    context[fn] = context[fn].bind(context);
  });
}

/**
 * 缓存一个标识
 * @param obj
 * @returns {*}
 */
export const stamp = function (obj: any) {
  const key = '_event_id_';
  obj[key] = obj[key] || (uuid());
  return obj[key];
};

export function modulo(a: number, b: number) {
  const r = a % b;
  return r * b < 0 ? r + b : r;
}

export function padNumber(number: number, width: number, precision: number) {
  const numberString = precision !== undefined ? number.toFixed(precision) : `${number}`;
  let decimal = numberString.indexOf('.');
  decimal = decimal === -1 ? numberString.length : decimal;
  return decimal > width ? numberString : new Array(1 + width - decimal).join('0') + numberString;
}

/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number}      The adjusted value.
 */
function decimalAdjust(type: string, value: number | string, exp: number) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    // @ts-ignore
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  // @ts-ignore
  value = value.toString().split('e');
  // @ts-ignore
  value = Math[type](+(`${value[0]}e${value[1] ? (+value[1] - exp) : -exp}`));
  // Shift back
  // @ts-ignore
  value = value.toString().split('e');
  // @ts-ignore
  return +(`${value[0]}e${value[1] ? (+value[1] + exp) : exp}`);
}

export function round10(value: number | string, exp: number) {
  return decimalAdjust('round', value, exp);
}

export function floor10(value: number | string, exp: number) {
  return decimalAdjust('floor', value, exp);
}

export function ceil10(value: number | string, exp: number) {
  return decimalAdjust('ceil', value, exp);
}
