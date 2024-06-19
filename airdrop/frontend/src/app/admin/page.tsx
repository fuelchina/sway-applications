"use client"

import { useMemo } from "react";
import { useWallet } from "@fuels/react";
import { AirdropContractAbi__factory } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONTRACT_ID = "0xf8c99476762a8f85d4194816618fe7545fc2e40c3d0f92927d82ce55ed3cdc9b";

export default function Admin() {
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    if (wallet) {
      const contract = AirdropContractAbi__factory.connect(CONTRACT_ID, wallet);
      return contract;
    }
    return null;
  }, [wallet]);

  async function seeAdmin() {
    if (contract !== null) {
      try {
        const res = await contract.functions.admin()
          .call()
        console.log('[ res ] >', res)
      } catch (e) {
        console.log("ERROR:", e);
      }
    }
  }

  return <div className="flex min-h-screen flex-col items-center p-24">
    <div>
      admin
      <Button onClick={seeAdmin}>See admin</Button>
      <form>
        <Input placeholder="admin address" />
        <Input placeholder="claim time" />
        <Input placeholder="merkle root" />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  </div>
}