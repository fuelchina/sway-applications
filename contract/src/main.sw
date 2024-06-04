contract;

use std::{
    asset::transfer,
    auth::msg_sender,
    call_frames::msg_asset_id,
    context::{
        msg_amount,
        this_balance,
    },
    hash::Hash,
};

struct Item {
    id: u64,
    price: u64,
    owner: Identity,
    metadata: str[20],
    total_bought: u64,
}

abi SwayStore {
    // a function to list an item for sale
    // takes the price and metadata as args
    #[storage(read, write)]
    fn list_item(price: u64, metadata: str[20]);

    // a function to buy an item
    // takes the item id as the arg
    #[storage(read, write), payable]
    fn buy_item(item_id: u64);

    // a function to get a certain item
    #[storage(read)]
    fn get_item(item_id: u64) -> Item;

    // a function to set the contract owner
    #[storage(read, write)]
    fn initialize_owner() -> Identity;

    // a function to withdraw contract funds
    #[storage(read)]
    fn withdraw_funds();

    // return the number of items listed
    #[storage(read)]
    fn get_count() -> u64;
}

storage {
    // counter for total items listed
    item_counter: u64 = 0,
    // map of item IDs to Items
    item_map: StorageMap<u64, Item> = StorageMap {},
    // owner of the contract
    owner: Option<Identity> = Option::None,
}

enum InvalidError {
    IncorrectAssetId: AssetId,
    NotEnoughTokens: u64,
    OnlyOwner: Identity,
}

impl SwayStore for Contract {
    // a function to list an item for sale
    // takes the price and metadata as args
    #[storage(read, write)]
    fn list_item(price: u64, metadata: str[20]) {
        storage
            .item_counter
            .write(storage.item_counter.try_read().unwrap() + 1);

        let sender = msg_sender().unwrap();
        let new_item: Item = Item {
            id: storage.item_counter.try_read().unwrap(),
            price: price,
            owner: sender,
            metadata: metadata,
            total_bought: 0,
        };
        storage.item_map.insert(new_item.id, new_item);
    }

    // a function to buy an item
    // takes the item id as the arg
    #[storage(read, write), payable]
    fn buy_item(item_id: u64) {
      // 获取 资产id
      let asset_id = msg_asset_id();
      // 判断 资产 类型
      require(asset_id == AssetId::base(), InvalidError::IncorrectAssetId(asset_id));

      let amount = msg_amount();

      let mut item = storage.item_map.get(item_id).try_read().unwrap();

      require(item.price <= amount, InvalidError::NotEnoughTokens(amount));

      item.total_bought += 1;

      storage.item_map.insert(item.id, item);

       if amount > 100_000_000 {
        // 收取5%的手续费
        let commission = amount / 20;
        let new_amount = amount - commission;
        // send the payout minus commission to the seller
        transfer(item.owner, asset_id, new_amount);
    } else {
        // send the full payout to the seller
        transfer(item.owner, asset_id, amount);
    }


    }

    // a function to get a certain item
    #[storage(read)]
    fn get_item(item_id: u64) -> Item {
        storage.item_map.get(item_id).try_read().unwrap()
    }

    // a function to set the contract owner
    #[storage(read, write)]
    fn initialize_owner() -> Identity {
        // return owner;
        let owner = storage.owner.try_read().unwrap();

        require(owner.is_none(), "owner already initialized");

        let sender = msg_sender().unwrap();
        storage.owner.write(Some(sender));

        sender

    }

    // a function to withdraw contract funds
    #[storage(read)]
    fn withdraw_funds() {
      let owner = storage.owner.try_read().unwrap();
      require(owner.is_some(), "owner not initialized");

      let sender = msg_sender().unwrap();
      require(sender == owner.unwrap(), InvalidError::OnlyOwner(sender));

      let amount = this_balance(AssetId::base());

      require(amount > 0, InvalidError::NotEnoughTokens(amount));
      
      transfer(sender, AssetId::base(), amount);


    }

    // return the number of items listed
    #[storage(read)]
    fn get_count() -> u64 {
        storage.item_counter.try_read().unwrap()
    }
}
