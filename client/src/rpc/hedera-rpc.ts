import type { IProvider } from '@web3auth/base'
import { Abi, Account, createPublicClient, createWalletClient, custom, formatEther, Hex, PublicClient, TransactionReceipt, WaitForTransactionReceiptReturnType, WalletClient, WriteContractReturnType } from 'viem'
import IRPC from './IRPC'
import { hederaTestnet } from 'viem/chains'
export default class EthereumRPC implements IRPC {
    private provider: IProvider
    public walletClient: WalletClient;
    public publicClient: PublicClient;

    constructor(provider: IProvider) {
        this.provider = provider

        const walletClient = createWalletClient({
            chain: hederaTestnet,
            transport: custom(this.provider)
        })

        this.walletClient = walletClient



        const publicClient = createPublicClient({
            chain: hederaTestnet,
            transport: custom(this.provider)
        })

        this.publicClient = publicClient
    }

    async getChainId(): Promise<string> {
        try {
            const chainId = await this.publicClient.getChainId()

            return chainId.toString()
        } catch (error) {
            return error as string
        }
    }

    public async getAccounts(): Promise<any> {
        try {
            // Get user's Ethereum public address
            const address = (await this.walletClient.getAddresses())[0]

            return address
        } catch (error) {
            return error
        }
    }

    async getBalance(): Promise<string> {
        try {

            // Get user's Ethereum public address
            const address = (await this.walletClient.getAddresses())[0]

            // Get user's balance in ether
            const balance = await this.publicClient.getBalance({
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


    async writeFunction(contractAddress: Hex, abi: Abi, functionName: string, userAddress: Hex | Account, args: any[]): Promise<Hex | any> {
        try {
            const tx = await this.walletClient.writeContract({
                address: contractAddress,
                abi: abi,
                functionName: functionName,
                account: userAddress,
                args: args,
                chain: hederaTestnet
            })

            return tx
        } catch (error) {
            return error as any
        }
    }


    async readFunction(contractAddress: Hex, abi: Abi, functionName: string, args: any[]): Promise<any> {
        try {
            const result = await this.publicClient.readContract({
                address: contractAddress,
                abi: abi,
                functionName: functionName,
                args: args,
            })

            return result
        } catch (error) {
            return error as any
        }
    }


    async waitForTransactionReceipt(tx: Hex): Promise<TransactionReceipt | string | undefined> {
        try {
            const receipt = await this.publicClient.waitForTransactionReceipt({
                hash: tx,
            })

            return receipt;
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