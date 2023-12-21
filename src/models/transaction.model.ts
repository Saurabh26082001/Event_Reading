import * as mongoose from "mongoose";
const TransactionModel = new mongoose.Schema(
  {
    address: {
      type: String,
      require: true
    },
    blockHash: {
      type: Number
    },
    blockNumber: {
      type: Number
    },
    data: {
      type: String
    },
    removed : {
      type : Boolean
    },
    topics : {
      type : [String]
    },
    transactionHash : {
      type: String
    },
    returnValues : {
      '0' : { type: String , required: true },
      '1' : { type : String , required: true },
      '2' : { type: mongoose.Schema.Types.Mixed , required: true },
      __length__ : { type : Number , required: true },
      from :  { type : String },
      to : { type : String },
      tokenId : { type : mongoose.Schema.Types.Mixed , required: true }
    },
    event : { type : String , required : true},
    signature : { type : String , required: true}
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Transactions", TransactionModel);
