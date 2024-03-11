"use client";

import { createContext, useContext, useState } from "react";

import {
    getAddresses,
    isEthereumAddress,
    network,
    walletStrategy,
} from "@/lib/wallet";

import {
    Msgs,
    TxResponse,
    getEthereumAddress,
    getInjectiveAddress,
} from "@injectivelabs/sdk-ts";
import { MsgBroadcaster, Wallet } from "@injectivelabs/wallet-ts";

export type WalletState =
    | {
        injectiveAddress: string | undefined;
        ethereumAddress: string | undefined;
        wallet: Wallet | undefined;
    }
    | undefined;

export type WalletContextType = WalletState & {
    connected: boolean;
    connect: (wallet: Wallet) => void;
    disconnect: () => void;
    broadcast: (msgs: Msgs | Msgs[]) => Promise<TxResponse | undefined>;
};

const WalletContext = createContext<WalletContextType>({
    injectiveAddress: undefined,
    ethereumAddress: undefined,
    wallet: undefined,
    connected: false,
    connect: (_wallet: Wallet) => { },
    disconnect: () => { },
    broadcast: async (_msgs: Msgs | Msgs[]) => undefined,
});

type ProviderProps = {
    children?: React.ReactNode;
};

export function WalletContextProvider(props: ProviderProps) {
    const [walletState, setWalletState] = useState<WalletState>();

    const connect = async (wallet: Wallet) => {
        walletStrategy.setWallet(wallet);
        const injectiveAddresses = await getAddresses();

        const defaultAddress = injectiveAddresses[0];

        const injectiveAddress = isEthereumAddress(defaultAddress)
            ? getInjectiveAddress(defaultAddress)
            : defaultAddress;
        const ethereumAddress = getEthereumAddress(injectiveAddress);
        await walletStrategy.confirm(injectiveAddress);
        setWalletState({
            ethereumAddress: ethereumAddress,
            injectiveAddress: injectiveAddress,
            wallet: wallet,
        });
    };

    const isUserWalletConnected =
        !!walletState?.injectiveAddress && !!walletState?.ethereumAddress;

    const disconnect = () => {
        walletStrategy.disconnect();
        setWalletState(undefined);
    };

    const broadcast = async (msgs: Msgs | Msgs[]) => {
        const msgBroadcaster = new MsgBroadcaster({
            walletStrategy,
            network: network,
        });

        return msgBroadcaster.broadcast({
            injectiveAddress: walletState?.injectiveAddress!,
            msgs,
        });
    };

    return (
        <WalletContext.Provider
            value={{
                ethereumAddress: walletState?.ethereumAddress,
                injectiveAddress: walletState?.injectiveAddress,
                wallet: walletState?.wallet,
                connected: isUserWalletConnected,
                broadcast,
                connect,
                disconnect,
            }}
        >
            {props.children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext)!;
