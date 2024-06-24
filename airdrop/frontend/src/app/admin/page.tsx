"use client"

import { useMemo, useState } from "react";
import { useWallet } from "@fuels/react";
import { AirdropContractAbi__factory } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GenerateMerkleTree from "@/components/GenerateMerkleTree";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datePicker";

const CONTRACT_ID = "0xf8c99476762a8f85d4194816618fe7545fc2e40c3d0f92927d82ce55ed3cdc9b";

export default function Admin() {
  const { wallet } = useWallet();
  const [date, setDate] = useState<Date>()

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

  async function handleeSubmit(data: FormData) {
    const admin = data.get("admin") as string
    const claim_time = new Date(date!).getTime()
    const merkle_root = data.get("merkle_root") as string
    const num_leaves = data.get("num_leaves") as string
    if (!admin || !date || !merkle_root || !num_leaves) {
      alert('请填写完表单')
    }
    if (!contract) return
    try {
      const res = await contract.functions.constructor({ Address: { bits: admin } }, claim_time, merkle_root, num_leaves)
      console.log('[ res ] >', res)

    } catch (error) {

    }
  }

  return <div className="max-w-[500px] m-auto flex min-h-screen flex-col gap-4 items-center py-14 px-2">
    <GenerateMerkleTree />
    <form action={handleeSubmit} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>初始化合约</CardTitle>
          <CardDescription>调用constructor来初始化合约</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="admin">管理员地址</Label>
              <Input id="admin" name="admin" placeholder="admin address" defaultValue={wallet?.address.toString()} />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="claim_time">领取时间</Label>
              {/* <Input id="claim_time" name="claim_time" placeholder="claim time" /> */}
              <DatePicker selected={date} onSelect={setDate} />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="merkle_root">Merkle Root</Label>
              <Input id="merkle_root" name="merkle_root" placeholder="merkle root" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="num_leaves">叶子节点个数</Label>
              <Input id="num_leaves" name="num_leaves" type="number" placeholder="The number of leaves in the Merkle Tree" />
            </div>

          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">提交设置</Button>
        </CardFooter>
      </Card>
    </form>
  </div>
}