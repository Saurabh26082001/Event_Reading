import web3Service from "./eventService";
import * as assetABI from "../utils/abi/contractABI.json";
import { log } from "console";
import TransactionModel from "../models/transaction.model";
import dotenv from "dotenv";

dotenv.config();

class stakeEvents {

    public removeNFromBigInt = async (bigIntValue: any) => {
        if (typeof bigIntValue !== 'bigint') {
            throw new Error('Input must be a BigInt');
        }

        const stringValue: any = bigIntValue.toString();
        const stringWithoutN = stringValue.replace('n', '');

        return stringWithoutN;
    }

    public getAllEvents = async (address: any, chain: any) => {
        try {
            const contractName = "Asset";
            const web3_service = new web3Service();
            const eventName = "Transfer";
            const result: any = await web3_service.getWeb3Events(address, assetABI, eventName, chain, contractName)
            console.log(result, "fetched=+++++++++++==========>>>>>>>>>>>>>>");

            if (result) {

                const Staked: any = result.filter((data: any) => {
                    return data.event == "Transfer" || data.event == "Approval";
                })
                log("Staked-----------", Staked);

                for (let val of Staked) {
                    const pushedVal = await TransactionModel.create({
                        address: val.address,
                        blockNumber: Number(val.blockNumber),
                        transactionHash: val.transactionHash,
                        returnValues: val.returnValues,
                        event: val.event,
                        signature: val.signature
                    });
                    pushedVal.save();
                    if(pushedVal){
                        console.log("saved in DB");
                    }else{
                        console.log("failed to push in DB", val);
                    }
                }
            }
            /*
                        if (Staked.length) {
                            // await Staked?.map(async (eventData: any) => {
                            for (let i = 0; i < Staked.length; i++) {
                                // const element = array[i];
                                console.log("Boolean==============================", Staked[i].event == "Staked")
                                if (Staked[i].event == "Staked") {
                                    const userExists: any = await userModel.findOne({ walletAddress: Staked[i].returnValues?.user.toLowerCase() })
                                    if (userExists) {
                                        const updateStakeInfo = await userModel.findByIdAndUpdate(userExists?._id, {
                                            $set: {
                                                timestamp: await this.removeNFromBigInt(Staked[i].returnValues?.depositTime),
                                                totalStaked: Number(await this.removeNFromBigInt(Staked[i].returnValues?.totalInvestment)),
                                            }
                                        })
            
                                        log("updateStakeInfo", updateStakeInfo)
                                    }
                                    else {
                                        log("else==============")
                                        console.log("staked AMount", await this.removeNFromBigInt(Staked[i].returnValues?.amount))
                                        const create = await userModel.insertMany({
                                            walletAddress: Staked[i].returnValues?.user.toLowerCase(),
                                            referrerAddress: Staked[i].returnValues?.referrer.toLowerCase(),
                                            timestamp: await this.removeNFromBigInt(Staked[i].returnValues?.depositTime),
                                            totalStaked: Number(await this.removeNFromBigInt(Staked[i].returnValues?.amount)),
                                            referralLink: "",
                                            nexaRank: 0,
                                            countOfReferree: 0,
                                            claimableAmount: 0,
                                        })
                                        log({ create })
                                        await userModel.findOneAndUpdate({
                                            walletAddress: Staked[i].returnValues?.referrer.toLowerCase()
                                        }, { $inc: { countOfReferree: 1 } })
                                    }
            
                                    const txHistory: any = await TransactionModel.create({
                                        receiverAddress: Staked[i].returnValues?.user.toLowerCase(),
                                        amount: Number(await this.removeNFromBigInt(Staked[i].returnValues?.amount)),
                                        event: Staked[i].event,
                                        timestamp: Number(await this.removeNFromBigInt(Staked[i].returnValues?.depositTime)),
                                        transactionHash: Staked[i].transactionHash
                                    })
                                    log("Staked txHistory==============================", txHistory)
                                } else if (Staked[i].event == "rankUpgrade") {
                                    await userModel.findOneAndUpdate({
                                        walletAddress: Staked[i].returnValues?.user.toLowerCase()
                                    },
                                        {
                                            $set: {
                                                nexaRank: Number(await this.removeNFromBigInt(Staked[i].returnValues?.newRank))
                                            }
                                        },
                                        {
                                            returnOriginal: false
                                        })
                                }
                                else {
                                    log("before tx history==========", Staked[i])
                                    const txHistory: any = await TransactionModel.create({
                                        receiverAddress: Staked[i].returnValues?.receiver.toLowerCase(),
                                        amount: Number(await this.removeNFromBigInt(Staked[i].returnValues?.amount)),
                                        event: Staked[i].event,
                                        timestamp: Number(await this.removeNFromBigInt(Staked[i].returnValues?.timestamp)),
                                        transactionHash: Staked[i].transactionHash
                                    })
                                    log("rest events txHistory==============================", txHistory)
                                }
            
                            }
                            
                        }
                        */
        } catch (error) {
            log(error)
        }
    }
}
export default new stakeEvents();
