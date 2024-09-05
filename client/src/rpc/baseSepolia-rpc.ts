import type { IProvider } from '@web3auth/base'
import { createPublicClient, createWalletClient, custom, formatEther } from 'viem'
import IRPC from './IRPC'
import { baseSepolia } from 'viem/chains'
export default class EthereumRPC implements IRPC {
    private provider: IProvider

    constructor(provider: IProvider) {
        this.provider = provider
    }

    async getChainId(): Promise<string> {
        try {

            const publicClient = createPublicClient({
                chain: baseSepolia,
                transport: custom(this.provider)
            })

            // Get the connected Chain's ID
            const chainId = await publicClient.getChainId()

            return chainId.toString()
        } catch (error) {
            return error as string
        }
    }

    public async getAccounts(): Promise<any> {
        try {

            const walletClient = createWalletClient({
                chain: baseSepolia,
                transport: custom(this.provider)
            })


            // Get user's Ethereum public address
            const address = (await walletClient.getAddresses())[0]

            return address
        } catch (error) {
            return error
        }
    }

    async getBalance(): Promise<string> {
        try {
            const walletClient = createWalletClient({
                chain: baseSepolia,
                transport: custom(this.provider)
            })


            const publicClient = createPublicClient({
                chain: baseSepolia,
                transport: custom(this.provider)
            })


            // Get user's Ethereum public address
            const address = (await walletClient.getAddresses())[0]

            // Get user's balance in ether
            const balance = await publicClient.getBalance({
                address: address,
            })

            return formatEther(balance)
        } catch (error) {
            return error as string
        }
    }


    async getPrivateKey(): Promise<any> {
        try {
            const privateKey = await this.provider.request({
                method: 'eth_private_key',
            })

            return privateKey
        } catch (error) {
            return error as string
        }
    }

    async getGeneralPrivateKey(): Promise<any> {
        try {
            const privateKey = await this.provider.request({
                method: 'private_key',
            })

            return privateKey
        } catch (error) {
            return error as string
        }
    }

    toStringJson(data: any) {
        // can't serialize a BigInt, so this hack
        return JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ));
    }
}