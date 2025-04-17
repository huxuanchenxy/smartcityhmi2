import {
  isObject,
  isPlainObject,
  isArray,
  isString,
  capitalize,
  hyphenate,
  looseEqual,
  extend,
  camelize,
  hasOwn,
  toRawType,
} from '@vue/shared'
import shortid from 'shortid'

/**
 * Generate shortId
 */
export const generateId = (prefix?: string) => {
  const id = shortid.generate()
  return prefix ? `${prefix}_${id}` : id
}

export {
  isObject,
  isPlainObject,
  isArray,
  isString,
  capitalize,
  looseEqual,
  extend,
  camelize,
  hasOwn,
}

export const kebabCase = hyphenate

/**
 * Remove leading and trailing whitespace and non-word
 * characters from the given string.
 *
 * @param {String} `str`
 * @return {String}
 */
export const chop = (str: string) => {
  if (!isString(str)) return ''
  const re = /^[-_.\W\s]+|[-_.\W\s]+$/g
  return str.trim().replace(re, '')
}

/**
 * Change casing on the given `string`, optionally
 * passing a delimiter to use between words in the
 * returned string.
 *
 * ```js
 * utils.changeCase('fooBarBaz');
 * //=> 'foo bar baz'
 *
 * utils.changeCase('fooBarBaz' '-');
 * //=> 'foo-bar-baz'
 * ```
 * @param {String} `string` The string to change.
 * @return {String}
 * @api public
 */
export const changeCase = (str: string, fn?: (str: string) => string) => {
  if (!isString(str)) return ''
  if (str.length === 1) {
    return str.toLowerCase()
  }

  str = chop(str).toLowerCase()

  const re = /[-_.\W\s]+(\w|$)/g
  return str.replace(re, (_, ch) => {
    return fn ? fn(ch) : ''
  })
}

/**
 * PascalCase the characters in `string`.
 *
 * ```js
 * {{pascalCase "foo bar baz"}}
 * <!-- results in:  'FooBarBaz' -->
 * ```
 * @param {String} `string`
 * @return {String}
 * @api public
 */
export const pascalCase = (str: string) => {
  if (!isString(str)) return ''
  str = changeCase(str, (ch: string) => {
    return ch.toUpperCase()
  })
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generating a random int in range (0, max - 1)
 * @param max {number}
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

export const isIE = function(): boolean {
  return !isNaN(Number(document.DOCUMENT_NODE))
}

export const isEdge = function(): boolean {
  return navigator.userAgent.indexOf('Edge') > -1
}

export const isFirefox = function(): boolean {
  return !!window.navigator.userAgent.match(/firefox/i)
}

export const isMac = () => {
  return /macintosh|mac os x/i.test(navigator.userAgent)
}

export const isBool = (val: unknown) => typeof val === 'boolean'
export const isNumber = (val: unknown) => typeof val === 'number'
export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML')

export function isUndefined(val: any) {
  return val === void 0
}

export function isEmpty(val: unknown) {
  if (
    !val && val !== 0 ||
    isArray(val) && !val.length ||
    isObject(val) && !Object.keys(val).length
  ) return true

  return false
}

export function isUrl(val: string) {
  return /^[a-zA-z]+:\/\/[^\s]*$/.test(val)
}

export function deduplicate<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

export function toObject<T>(arr: Array<T>): Record<string, T> {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export function ArrayToObject<T>(arr: Array<T>, key: string, value: string): Record<string, string> {
  return arr.reduce((prev, curr) => {
    prev[curr[key]] = curr[value]
    return prev
  }, {})
}

export function StringArrayToObject(arr: string[]): Record<string, string> {
  return arr.reduce((prev, curr) => {
    prev[curr] = curr
    return prev
  }, {})
}

export function toJson<T>(data: any, defaultValue: T) {
  try {
    if (!data) {
      return defaultValue
    }

    if (isString(data)) {
      return JSON.parse(data)
    }

    return data
  } catch {
    return defaultValue
  }
}

export const copyText = (text: string) => {
  try {
    const input = document.createElement('textarea')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 获取字符串中 :value 形式的参数
 */
export const getTextParams = (text: string) => {
  const reg = /:([\d\w\u4e00-\u9fa5_$@*]+)/ig
  return text.match(reg) ?? []
}

/**
 * 替换字符串中 :value 形式的参数
 */
export const replaceTextParams = (text: string, data: Record<string, string>) => {
  if (Object.keys(data).length === 0) {
    return text
  }
  const reg = /:([\d\w\u4e00-\u9fa5_$@*]+)/ig
  return text.replace(reg, (key: string) => {
    return data[key.substr(1)] ?? key
  })
}

/**
 * 简单计算字符串长度
 */
export const calcStrLen = (str: string) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
      len += 2
    } else {
      len ++
    }
  }
  return len
}

/**
 * 简单计算字符串宽度
 */
let TextCanvas: HTMLCanvasElement | null = null
export const calcStrWidth = (str: string, font: string) => {
  if (!TextCanvas) {
    TextCanvas = document.createElement('canvas')
  }
  const ctx = TextCanvas.getContext('2d')
  ctx.font = font
  ctx.font
  return ctx.measureText(str).width
}


/**
 * 测试密码复杂度（至少8个字符，至少1个大写字母，1个小写字母，1个数字和1个特殊字符）
 */
export const testPassword = (str:string) =>{
  const regStr = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
  return regStr.test(str)
}

export const getUrlKey = (name:string,url:string)=>{
  return decodeURIComponent((new RegExp(`[?|&]${  name  }=` + `([^&;]+?)(&|#|;|$)`).exec(url) || [, ''])[1].replace(/\+/g, '%20')) || null
}


const _lut = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff'];

export function generateUUID() :string {
  const d0 = Math.random() * 0xffffffff | 0;
  const d1 = Math.random() * 0xffffffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = Math.random() * 0xffffffff | 0;
  const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
    _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
    _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
    _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

  // .toLowerCase() here flattens concatenated strings to save heap memory space.
  return uuid.toLowerCase();
}


// 根据字符串路径，获取嵌套属性的值 NestedProperty
export const getNP= (object, path) =>
  path.split(".").reduce((obj, key) => obj && obj[key], object);

// 根据字符串路径，设置嵌套属性的值 setNestedProperty
export const setNP = (object, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let cursor = object;
  keys.forEach(key => {
    cursor = cursor[key] || (cursor[key] = {});
  });
  cursor[lastKey] = value;
};
