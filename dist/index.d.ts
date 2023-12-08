export type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';
export interface CommonOptions {
    algorithm?: Algorithm;
    digits?: number;
    secret: string;
}
export interface TotpOptions extends CommonOptions {
    period?: number;
}
declare const totp: (options: TotpOptions) => string;
export interface HotpOptions extends CommonOptions {
    counter?: number;
}
declare const hotp: (options: HotpOptions) => string;
export interface OTPAuthURLOptions extends CommonOptions {
    issuer?: string;
    label?: string;
    counter?: number;
    type: 'totp' | 'hotp';
    period?: number;
}
declare const signURL: (option: OTPAuthURLOptions) => string;
export { totp, hotp, signURL };
