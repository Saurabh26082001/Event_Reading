import * as mongoose from "mongoose";
const BlockInfo = new mongoose.Schema(
    {
        chain: { type: String, require: true },
        address: { type: String, require: true },
        contractName: { type: String, require: true },
        eventName: { type: Array, require: true },
        blockNumber: { type: Number },
        count: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("blockInfo", BlockInfo);
