"use client"

import { useMemo } from "react";
import { useWallet } from "@fuels/react";
import { AirdropContractAbi__factory } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getProof } from "@/components/GenerateMerkleTree";

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

  const handleClaim = async (data: FormData) => {
    const address = data.get('address') as string
    const proof = getProof(address, '0.001')
    // TODO 
    contract?.functions.claim('0.001', 0, proof, address)
    console.log('[ address ] >', address)
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-14">
      <h1 className="text-3xl font-semibold tracking-tight">Airdrop</h1>
      <form className="mt-10" action={handleClaim}>
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>领取空投</CardTitle>
            <CardDescription>你可以领取 0.001 ETH</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">领取空投地址</Label>
              <Input id="address" name="address" placeholder="address" defaultValue={wallet?.address.toString()} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Claim
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
