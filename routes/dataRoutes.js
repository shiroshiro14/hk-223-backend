import express from "express";
import * as dataController from "../controllers/dataController.js";

const router = express.Router();
//get last feed data
router.get("/lasttemperature", dataController.getLastTemp);
router.get("/gettemperature", dataController.getTemperature);
router.get("/lasthumidity", dataController.getLastTemp);
router.get("/gethumidity", dataController.getTemperature);
router.get("/lastled", dataController.getLastLed);
router.get("/lastfan", dataController.getLastFan);
router.get("/lastanti-theft", dataController.getLastAntiTheft)
router.get("/getnotification",dataController.getNotification)

//post new data 
router.post("/setled", dataController.setLed)
router.post("/setfan", dataController.setFan)
router.post("/setanti-theft", dataController.setAntiTheft)
export default router;