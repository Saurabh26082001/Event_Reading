import Web3 from "web3";
import { getPastEvents, updateBlockInfo, web3Instance } from "./web3Helper";
import blockInfo from "../models/blockInfo";
import { log } from "console";
import stakeEvents from "./contractEvent"
import dotenv from "dotenv";

dotenv.config();

export default class web3Service {
    //  declaring variables 
    contractInstance: any;
    web3Instance: any;
    dynamicInstance: any;

    //fetching events from the smart contract
    public getWeb3Events = async (
        contractAddress: string,
        contractAbisObject: any,
        eventName: any,
        chain: string,
        contractName: string
    ): Promise<any> => {

        try {

            // console.log(contractAbisObject,".....");
            // creating instance using contract abi and address
            const contractAbisArray = Object.values(contractAbisObject);
            // console.log(contractAbisArray,"=======");
            
            const instance: any = await web3Instance(chain, contractAbisArray, contractAddress);

            // console.log(instance, "instance.....")
            let webInstance: any;
            let startBlock: any;
            let endBlock: any;

            webInstance = new Web3(process.env.RPC as string);
            startBlock = Number(process.env.ethFromBlock);
            log("startBlock============", startBlock)


            //Block batch size  & start and end block calculation begins
            const eventBatchSize = Number(process.env.eventBatchSize);
            const currentBlock = await webInstance?.eth.getBlockNumber();
            log("eventBatchSize============", eventBatchSize);
            //getting block info from database
            const block_info = await blockInfo.findOne({
                address: contractAddress,
                contractName: contractName,
                chain: chain,
            });
            log("block info present in DB");

            // if block info exist then assigning start block to block number from database
            if (block_info) {
                startBlock = block_info.blockNumber;                
            }

            // if start block plus batch size is greater than current block then it will set end block to current block
            if (Number(startBlock) + Number(eventBatchSize) > Number(currentBlock)) {
                endBlock = await stakeEvents.removeNFromBigInt(currentBlock);
                
            } else {
                endBlock = startBlock + eventBatchSize;
            }
            log(endBlock, startBlock, "start+++++++++++++++++++");

            // get events
            const event = await getPastEvents(
                instance,
                eventName,
                startBlock,
                endBlock
            );

            // log(event, eventName, startBlock, endBlock, "eventttttttttttttttttt")

            // update block number in database
            await updateBlockInfo(
                contractAddress,
                contractName,
                [eventName],
                endBlock,
                chain
            );

            // log(event, "Event ++++++++++++++");
            return event
        } catch (error) {
            console.log("getWeb3Events error", error);
        }
    }

};