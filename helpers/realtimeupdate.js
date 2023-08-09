import mqtt from "mqtt";
import Notifications from "../models/dataModel.js";


const realtimeUpdate = (io) => {
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
        if (!topic.endsWith("dadn.person")) {
            data = parseFloat(message.toString());
        } else {
            data = message.toString();
        }
        if (topic.endsWith("dadn.temperature")) {
            io.emit("temperatureUpdate", { temperature: data });
            console.log(`Temperature: ${data}°C`);
        } else if (topic.endsWith("dadn.humidity")) {
            io.emit("humidityUpdate", { humidity: data });
            console.log(`Humidity: ${data}%`);
        }
         else if (topic.endsWith("dadn.fan")) {
            io.emit("fanUpdate", { fan: data });
            console.log(`Fan: ${data}`);
        } else if (topic.endsWith("dadn.led")) {
            // Emit a "lightUpdate" event with the new light data
            io.emit("lightUpdate", { light: data });
            console.log(`Light: ${data}`);
        } else if (topic.endsWith("dadn.anti-theft")) {
            io.emit("AntiTheftUpdate", {antitheft: data});
            console.log(`Anti-theft: ${data}`);
        }else if (topic.endsWith("dadn.detection")){
             io.emit("DetectionUpdate", {detection: data});
             console.log(`Detection: ${data}`);
        }
    });
};

export default realtimeUpdate;
