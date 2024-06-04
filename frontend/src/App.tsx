import { useState, useMemo } from "react";
import { useConnectUI, useIsConnected, useWallet, useDisconnect } from "@fuels/react";
import { ContractAbi__factory } from "./contracts";
import AllItems from "./components/AllItems";
import ListItem from "./components/ListItem";


import "./App.css";

const CONTRACT_ID =
  "0x50119b4437351c4d5872f21ea4191d8e0e40d9c94406670cdc382061e52e236b";

function App() {
  const [active, setActive] = useState<"all-items" | "list-item">("all-items");
  const { isConnected } = useIsConnected();
  const { connect, isConnecting, } = useConnectUI();
  const { disconnect } = useDisconnect();
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    if (wallet) {
      const contract = ContractAbi__factory.connect(CONTRACT_ID, wallet);
      return contract;
    }
    return null;
  }, [wallet]);




  async function setOwner() {
    if (contract !== null) {
      try {
        await contract.functions.initialize_owner()
          .txParams({
            variableOutputs: 1,
          })
          .call()
      } catch (e) {
        console.log("ERROR:", e);
      }
    }
  }

  async function withdrawFunds() {
    if (contract !== null) {
      try {
        await contract.functions.withdraw_funds()
          .txParams({
            variableOutputs: 1,
          })
          .call()
      } catch (e) {
        console.log("ERROR:", e);
      }
    }
  }

  return (
    <div className="App">
      <header>
        <h1>Sway Marketplace</h1>

        {
          contract && <button onClick={setOwner}>set Owner</button>
        }
        {
          contract && <button onClick={withdrawFunds}>withdrawFunds</button>
        }

      </header>

      <nav>
        <ul>
          <li
            className={active === "all-items" ? "active-tab" : ""}
            onClick={() => setActive("all-items")}
          >
            See All Items
          </li>
          <li
            className={active === "list-item" ? "active-tab" : ""}
            onClick={() => setActive("list-item")}
          >
            List an Item
          </li>
        </ul>
      </nav>
      <div>
        {isConnected ? (
          <>
            <div>
              {active === "all-items" && <AllItems contract={contract} />}
              {active === "list-item" && <ListItem contract={contract} />}
            </div>
            <button onClick={() => {
              disconnect();
            }}
            >disconnect</button>
          </>

        ) : (
          <div>
            <button
              onClick={() => {
                connect();
              }}
            >
              {isConnecting ? "Connecting" : "Connect"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;