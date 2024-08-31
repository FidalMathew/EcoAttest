export interface NillionEnvConfig {
    clusterId: string;
    bootnodes: string[];
    chain: {
        endpoint: string;
        keys: string[];
    };
}

export const config: NillionEnvConfig = {
    clusterId: process.env.REACT_APP_NILLION_CLUSTER_ID || '',
    bootnodes: [process.env.REACT_APP_NILLION_BOOTNODE_WEBSOCKET || ''],
    chain: {
        endpoint: `${process.env.NEXT_PUBLIC_HOSTNAME!}/nilchain-proxy`,
        keys: [process.env.REACT_APP_NILLION_NILCHAIN_PRIVATE_KEY || ''],
    },
};
