// "use client";

import config from "@/config/config";
import {
  ErrorType,
  UnspecifiedErrorCode,
  WalletException,
} from "@injectivelabs/exceptions";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { ChainGrpcWasmApi, toBase64 } from "@injectivelabs/sdk-ts";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { WalletStrategy } from "@injectivelabs/wallet-ts";

const isTestnet = config.network === ChainId.Testnet;
const isMainnet = config.network === ChainId.Mainnet;
const isDevnet = config.network === ChainId.Devnet;

export const walletStrategy = new WalletStrategy({
  chainId: config.network as ChainId,
  ethereumOptions: isMainnet
    ? {
        ethereumChainId: 1,
        rpcUrl: "https://eth-mainnet.alchemyapi.io/v2",
      }
    : {
        ethereumChainId: 11155111 as EthereumChainId, // Note: Refactor this when injective-ts supports sepolia chainId
        rpcUrl: "https://rpc.sepolia.org/",
      },
});

export async function getAddresses(): Promise<string[]> {
  const addresses = await walletStrategy.getAddresses();

  if (addresses.length === 0) {
    throw new WalletException(
      new Error("There are no addresses linked in this wallet."),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
      }
    );
  }

  if (!addresses.every((address) => !!address)) {
    throw new WalletException(
      new Error("There are no addresses linked in this wallet."),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
      }
    );
  }

  return addresses;
}

export function isEthereumAddress(address: string) {
  return address.startsWith("0x");
}

export const network = isMainnet
  ? Network.Mainnet
  : isTestnet
  ? Network.Testnet
  : Network.Devnet;

export async function queryWasmContract<T>(
  contractAddress: string,
  queryMsg: object
) {
  const endpoints = getNetworkEndpoints(network);
  const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc);

  const contractState = await chainGrpcWasmApi.fetchSmartContractState(
    contractAddress,
    toBase64(queryMsg)
  );
  const jsonString = Buffer.from(contractState.data).toString("utf8");

  const res = JSON.parse(jsonString) as T;
  if (!res) throw new Error("Error querying contract state");
  return res;
}
