import { useState } from "react";
import { ItemOutput } from "../contracts/contracts/ContractAbi";
import { ContractAbi } from "../contracts";
import { BN } from 'fuels';
 
interface ItemCardProps {
  contract: ContractAbi | null;
  item: ItemOutput;
}
 
export default function ItemCard({ item, contract }: ItemCardProps) {
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');

  async function handleBuyItem() {
    if (contract !== null) {
      setStatus('loading')
      try {
        const baseAssetId = contract.provider.getBaseAssetId();
        await contract.functions.buy_item(item.id)
        .txParams({ 
          variableOutputs: 1,
        })
        .callParams({
            forward: [item.price, baseAssetId],
          })
        .call()
        setStatus("success");
      } catch (e) {
        console.log("ERROR:", e);
        setStatus("error");
      }
    }
  }
  return (
    <div className="item-card">
      <div>Id: {new BN(item.id).toNumber()}</div>
      <div>Metadata: {item.metadata}</div>
      <div>Price: {new BN(item.price).formatUnits()} ETH</div>
      <h3>Total Bought: {new BN(item.total_bought).toNumber()}</h3>
      {status === 'success' && <div>Purchased ✅</div>}
      {status === 'error' && <div>Something went wrong ❌</div>}
      {status === 'none' &&  <button data-testid={`buy-button-${item.id}`} onClick={handleBuyItem}>Buy Item</button>}
      {status === 'loading' && <div>Buying item..</div>}
    </div>
  );
}