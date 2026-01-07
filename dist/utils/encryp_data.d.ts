declare const encryptData: (password: string) => Promise<string>;
declare const compareData: (password: string, hash: string) => Promise<boolean>;
export { encryptData, compareData };
