import * as cron from "node-cron";
import stakeEvents from "../controllers/contractEvent";
import * as dotenv from 'dotenv';

dotenv.config();
class CronHandler {
    public cronScheduler() {
        cron.schedule("*/10 * * * * *", async () => {
            console.log("================fetching the events===================");
            // stakeEvents.getStakeEvents("Staked",
            //     process.env.CONTRACT_ADDRESS,
            //     "Polygon"
            // )
            stakeEvents.getAllEvents(
                process.env.CONTRACT_ADDRESS,
                process.env.CHAIN
            )
        })
    }
}

export default new CronHandler();
