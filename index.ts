import jsSHA from 'jssha';

export type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

export interface CommonOptions {
  algorithm?: Algorithm;
  digits?: number;
  secret: string;
}

export interface TotpOptions extends CommonOptions {
  period?: number;
}

const totp = (options: TotpOptions): string => {
  const now = Date.now()/1000;
  return generatePassword({
    algorithm: options.algorithm,
    digits: options.digits,
    secret: options.secret,
  }, Math.floor(now/(options.period || 30)));
};

export interface HotpOptions extends CommonOptions {
  counter?: number;
}

const hotp = (options: HotpOptions): string => {
  return generatePassword({
    secret: options.secret,
    algorithm: options.algorithm,
    digits: options.digits
  }, options.counter || 0);
};

const generatePassword = (options: CommonOptions, counter: number): string => {
  const hexSecret = base32ToHex(options.secret);
  const algorithm: Algorithm = options.algorithm || 'SHA-1';
  const digits = options.digits || 6;
  const sha = new jsSHA(algorithm, 'HEX');
  sha.setHMACKey(hexSecret, 'HEX');
  sha.update(leftPad(numberToHex(counter), 16, '0'));
  const hmac = sha.getHMAC('HEX');
  const offset = hexToNumber(hmac.substring(hmac.length-1));
  let otp = (hexToNumber(hmac.substr(offset*2, 8)) & hexToNumber('7fffffff')) + '';
  return otp.substr(Math.max(otp.length - digits, 0), digits);
};

const hexToNumber = (hex: string): number => {
  return parseInt(hex, 16);
}

const numberToHex = (n: number): string => {
  return (n < 15.5 ? '0' : '') + Math.round(n).toString(16);
}

const base32ToHex = (base32: string): string => {
  const base32Charts = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  let hex = '';
  base32 = base32.replace(/=+$/, '');
  for (let i = 0; i < base32.length; i++) {
    const val = base32Charts.indexOf(base32.charAt(i).toUpperCase());
    if (val === -1) {
      throw new Error('Invalid base32 string');
    }
    bits += leftPad(val.toString(2), 5, '0');
  }
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const chunk = bits.substring(i, i + 8);
    hex = hex + leftPad(parseInt(chunk, 2).toString(16), 2, '0');
  }
  return hex;
};

const leftPad = (str: string, len: number, pad: string): string => {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
};

export { totp, hotp };
