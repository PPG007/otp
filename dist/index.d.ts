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
export { totp, hotp };
