"use client"

import { useConnectUI, useDisconnect, useIsConnected, useWallet } from "@fuels/react";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { truncateAddress } from "@/lib/utils";

export default function Header() {
  const { isConnected } = useIsConnected();
  const { connect, isConnecting, } = useConnectUI();
  const { disconnect } = useDisconnect();
  const { wallet } = useWallet();

  return <>
    <header className="flex items-center py-4">
      <p className="flex-1 text-center font-mono">
        {truncateAddress(wallet?.address.toAddress() || '')}
      </p>
      {
        isConnected
          ? <Button onClick={() => disconnect()}>
            disconnect
          </Button>
          : <Button disabled={isConnecting} onClick={connect}>
            {
              isConnecting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            }
            {isConnecting ? "Connecting" : "Connect"}
          </Button>
      }
    </header>
  </>
}