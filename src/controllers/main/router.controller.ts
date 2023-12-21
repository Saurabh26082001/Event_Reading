import { Application, Router,Request,Response } from "express";
import eventReading from "../contractEvent";

const router :any= Router();

router
// .get("/healthCheck",eventReading.healthCheck)
// .get("/eventRead", eventReading.eventRead)
export default router;