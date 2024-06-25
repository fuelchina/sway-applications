import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { Badge } from "./ui/badge";


// TODO fuel Leaf
export function generateLeaf(address: string, amount: string) {
  return keccak256(address + amount).toString('hex');
}
const users = [
  { "address": "fuel153tnnazum86cd4aw7gj3akhlq8cfffagy4zzmau5mujd25hmwsvqwt30ef", "amount": "0.0001" },
  { "address": "fuel1dmzk46zp4z9yel9xn0tagk0h4kmf6wmp9rhxd3ukredeecdt7h9sux2ds2", "amount": "0.0001" },
]
const leaves = users.map(user => generateLeaf(user.address, user.amount));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

export function getProof(address: string, amount: string) {
  const leaf = generateLeaf(address, amount)
  return tree.getProof(leaf)
}

const GenerateMerkleTree = () => {
  const [merkleRoot, setMerkleRoot] = useState('');
  const onGenerate = () => {
    // 获取根节点
    const root = tree.getRoot().toString('hex');
    console.log('Merkle Root:', root);
    setMerkleRoot(root)
  }
  return <div className="w-full">
    <Card>
      <CardHeader>
        <CardTitle>Generate Merkle Tree</CardTitle>
        <CardDescription>根据空投用户列表生成 Merkle Root</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="max-w-[400px] overflow-auto">
          {JSON.stringify(users, null, 2)}
        </pre>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onGenerate}>生成</Button>
      </CardFooter>
    </Card>
    {
      merkleRoot && (
        <div>
          <Badge variant="secondary">{merkleRoot}</Badge>
          <div className="text-right">复制后填入下方表单</div>
        </div>
      )

    }
  </div>
}

export default GenerateMerkleTree