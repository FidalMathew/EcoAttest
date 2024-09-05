import type { IProvider } from '@web3auth/base'

export default interface IRPC {

    getChainId(): Promise<any>;
    getAccounts(): Promise<any>;
    getBalance(): Promise<string>;
    getPrivateKey(): Promise<any>;
}