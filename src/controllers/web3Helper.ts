import Web3 from "web3";
import blockInfo from "../models/blockInfo";
import { log } from "console";
import dotenv from "dotenv";

dotenv.config();

export const web3Instance = async (chain: string, abi: any, address: string) => {
    try {
        let rpc = process.env.RPC;
        const web3Instance: any = new Web3(rpc as string);
        
        let contractInstance = new web3Instance.eth.Contract(abi, address);
        return contractInstance;

    } catch (error) {
        console.log("error under web3 instance", error);
    }
}

// get events  helper function
export const getPastEvents = async (contractInstance: any,
    eventName: String,
    fromBlock: Number,
    toBlock: Number

) => {
    log("eventName=============", eventName)
    const event: any = await contractInstance.getPastEvents(eventName, {
        fromBlock: fromBlock,
        toBlock: toBlock
    });

    log(event, fromBlock, toBlock,"pastEvents---")
    if (event?.length > 0) {
        return event;
    } else {
        return []
    }
}

// update blocknumber
export const updateBlockInfo = async (
    address: string,
    contractName: string,
    eventName: Array<string>,
    blockNumber: number,
    chain: string
) => {
    log("entered=================updateBlockInfo", address, blockNumber)
    let result = await blockInfo.updateOne(
        {
            address: address,
            contractName: contractName,
            eventName: eventName,
            chain: chain,
        },
        { $set: { blockNumber: Number(blockNumber) + 1 } },
        { upsert: true }
    );
    // log(result,"result")
    return result
};
