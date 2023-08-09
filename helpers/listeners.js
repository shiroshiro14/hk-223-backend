import mqtt from "mqtt";
import Notifications from "../models/dataModel.js";
const SaveToDatabase = async (content, feed, createAt) => {
    let notifi = new Notifications(feed,content,createAt)
    //console.log(notifi.toString());
    await notifi.save()
        .then((res) => {
            console.log(`${content} and saved into database`);
            return true;
        })
        .catch((e) => {
            console.log(`Error ${e}`);
        });
}
const listeners = (io) => {
    let feed_list = ['dadn.temperature','dadn.led','dadn.fan','dadn.humidity','dadn.anti-theft','dadn.detection']
    const username = `${process.env.ADAFRUIT_USERNAME}`;
    const key = `${process.env.ADAFRUIT_KEY}`;
    const host = "mqtt://io.adafruit.com";
    const client = mqtt.connect(host, {
        username: username,
        password: key,
    });

    client.on("connect", () => {
        // console.log("Connected to adafruit");
        feed_list.map((item => {
            client.subscribe(`${username}/feeds/${item}`);
        }))
    });

    client.on("message", (topic, message) => {
        // Parse the message data as a float
        let data = null;
        let createAt = new Date().toISOString()
        if (!topic.endsWith("dadn.detection")) {
            data = parseFloat(message.toString());
        } else {
            data = message.toString();
        }
         if (topic.endsWith("dadn.fan")) {
            if (data == 1){
                SaveToDatabase("Turn on fan","dadn.fan", createAt)
            }
            else{
                SaveToDatabase("Turn off fan","dadn.fan", createAt)
            }
        } else if (topic.endsWith("dadn.led")) {
            // Emit a "lightUpdate" event with the new light data
            if (data == 1){
                SaveToDatabase("Turn on light","dadn.led", createAt)
            }
            else{
                SaveToDatabase("Turn off light","dadn.led", createAt)
            }
        } else if (topic.endsWith("dadn.anti-theft")) {
            if (data == 1){
                SaveToDatabase("Anti-theft on","dadn.anti-theft", createAt)
            }
            else{
                SaveToDatabase("Anti-theft off","dadn.anti-theft", createAt)
            }
        }else if (topic.endsWith("dadn.detection")){
                SaveToDatabase(data,"dadn.detection", createAt)
         }
    });
};

export default listeners;