import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./helpers/db.helper";
import cronHandler from "./cronHandler/cronHandler";
dotenv.config();

class ExpressServer {
  public app: Application;
  
  constructor() {
    this.app = express();
    this.app.use(cors());
    dbConnect.dbConnection();

    // cron service
    cronHandler.cronScheduler();
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default new ExpressServer();