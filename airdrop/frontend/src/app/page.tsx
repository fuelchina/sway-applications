"use client"

import { useMemo } from "react";
import { useWallet } from "@fuels/react";
import { AirdropContractAbi__factory } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CONTRACT_ID = "0xf8c99476762a8f85d4194816618fe7545fc2e40c3d0f92927d82ce55ed3cdc9b";

export default function Home() {
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    if (wallet) {
      const contract = AirdropContractAbi__factory.connect(CONTRACT_ID, wallet);
      return contract;
    }
    return null;
  }, [wallet]);

  return (
    <main className="flex min-h-screen flex-col items-center p-14">
      <h1 className="text-3xl font-semibold tracking-tight">Airdrop</h1>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Claim Airdrop</CardTitle>
            <CardDescription>You have 3 ETH.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full">
              Claim
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
