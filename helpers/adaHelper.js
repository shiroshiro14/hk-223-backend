import axios from "axios";
import dotenv from "dotenv";
import mqtt from "mqtt";

dotenv.config();

const adaRequest = axios.create({
    baseURL: `https://io.adafruit.com/api/v2/${process.env.ADAFRUIT_USERNAME}`,
    headers: {
        "X-AIO-Key": process.env.ADAFRUIT_KEY,
        "Content-Type": "application/json",
    },
});


function publishData(feedName, data, callback) {
    const broker = "mqtt://io.adafruit.com";
    const port = 1883;
    const username = `${process.env.ADAFRUIT_USERNAME}`;
    const password = `${process.env.ADAFRUIT_KEY}`;
    const client = mqtt.connect(broker, {
        port: port,
        username: username,
        password: password,
    });
    const jsonData = JSON.stringify({
        value: data,
    });
    client.on("connect", function () {
        client.publish(`${username}/feeds/${feedName}`, jsonData, (error) => {
            if (error !== undefined) {
                callback(false);
            } else {
                callback(true);
            }
            client.end();
        });
    });
}
export { adaRequest, publishData };
