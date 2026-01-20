declare module 'multicoin-address-validator' {
    export function validate(address: string, currency: string, networkType?: string): boolean;
    export function getCurrencies(): Array<{name: string, symbol: string}>;
}