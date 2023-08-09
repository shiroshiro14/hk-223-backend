import { adaRequest, publishData } from "../helpers/adaHelper.js";
import axios from "axios";

import Notifications  from "../models/dataModel.js"
import {firebaseDb} from "../config/firebase.js";
import {getDatabase,ref,onValue} from "firebase/database";
const database = getDatabase(firebaseDb)

const feed_list = {
  "temperature": "dadn.temperature",
  "led": "dadn.led",
  "fan": "dadn.fan",
  "humidity": "dadn.humidity",
  "antitheft": "dadn.anti-theft",
  "detection": "dadn.detection",
}
export const getLastTemp = async (req, res) => {
  adaRequest
    .get(`/feeds/${feed_list.temperature}/data/last`)
    .then(({ data }) => {
      res.status(200).json({
        ...data,
        feed_key: "temperature",
        message: "successful",
      });
    })
    .catch((error) => {
      res.status(200).json(error);
    });
};
export const getDayTemperature = async (startDate, endDate) => {
  adaRequest
    .get(`/feeds/${feed_list.temperature}/data/last`, {
      params: {
        start_time: startDate,
        end_time: endDate,
      },
    })
    .then(({ data }) => {
      //console.log(data.data);
      return data;
    })
    .catch((error) => {
      res.status(200).json(error);
    });
};
export const getTemperature = async (req, res) => {
  //console.log(req.body);
  const { type } = req.body;
  if (type === "hour") {
    adaRequest
      .get(`/feeds/${feed_list.temperature}/data/chart`, {
        params: {
          hours: 24,
        },
      })
      .then(({ data }) => {
        //console.log(data);
        res.status(200).json({
          ...data,
          message: "successful",
        });
      })
      .catch((error) => {
        res.status(200).json(error);
      });
  } else if (type === "day") {
    let date = new Date();
    let start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 6
    );
    adaRequest
      .get(`/feeds/${feed_list.temperature}/data/chart`, {
        params: {
          start_time: start.toISOString(),
          end_time: date.toISOString(),
        },
      })
      .then(({ data }) => {
        let data_res = data.data;
        let start_day = date.getDate() - 6;
        let arr = new Array(7).fill(0);
        let count = new Array(7).fill(0)
        data_res.map((item) => {
            let newdate = new Date(item[0]);
            arr[newdate.getUTCDate() - start_day] = arr[newdate.getUTCDate() - start_day] + Number(item[1]);
            count[newdate.getUTCDate() - start_day] = count[newdate.getUTCDate() - start_day] +1;
        })
        arr.map(((item,idx) => {
            if(item != 0){
                arr[idx] = item / count[idx]
            }
        }))
        res.status(200).json({
            data: arr,
          feed_key: "temperature",
          message: "successful",
        });
      })
      .catch((error) => {
        res.status(200).json(error);
      });
  }
};
///
export const getLastHumidity = async (req, res) => {
  adaRequest
      .get(`/feeds/${feed_list.humidity}/data/last`)
      .then(({ data }) => {
        res.status(200).json({
          ...data,
          feed_key: "humidity",
          message: "successful",
        });
      })
      .catch((error) => {
        res.status(200).json(error);
      });
};
export const getDayHumidity = async (startDate, endDate) => {
  adaRequest
      .get(`/feeds/${feed_list.humidity}/data/last`, {
        params: {
          start_time: startDate,
          end_time: endDate,
        },
      })
      .then(({ data }) => {
        //console.log(data.data);
        return data;
      })
      .catch((error) => {
        res.status(200).json(error);
      });
};
export const getHumidity = async (req, res) => {
  //console.log(req.body);
  const { type } = req.body;
  if (type === "hour") {
    adaRequest
        .get(`/feeds/${feed_list.humidity}/data/last`, {
          params: {
            hours: 24,
          },
        })
        .then(({ data }) => {
          //console.log(data);
          res.status(200).json({
            ...data,
            message: "successful",
          });
        })
        .catch((error) => {
          res.status(200).json(error);
        });
  } else if (type === "day") {
    let date = new Date();
    let start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 6
    );
    adaRequest
        .get(`/feeds/${feed_list.humidity}/data/last`, {
          params: {
            start_time: start.toISOString(),
            end_time: date.toISOString(),
          },
        })
        .then(({ data }) => {
          let data_res = data.data;
          let start_day = date.getDate() - 6;
          let arr = new Array(7).fill(0);
          let count = new Array(7).fill(0)
          data_res.map((item) => {
            let newdate = new Date(item[0]);
            arr[newdate.getUTCDate() - start_day] = arr[newdate.getUTCDate() - start_day] + Number(item[1]);
            count[newdate.getUTCDate() - start_day] = count[newdate.getUTCDate() - start_day] +1;
          })
          arr.map(((item,idx) => {
            if(item != 0){
              arr[idx] = item / count[idx]
            }
          }))
          res.status(200).json({
            data: arr,
            feed_key: "humidity",
            message: "successful",
          });
        })
        .catch((error) => {
          res.status(200).json(error);
        });
  }
};

export const getLastLed = async (req, res) => {
  adaRequest
    .get(`/feeds/${feed_list.led}/data/last`)
    .then(({ data }) => {
      //console.log(data);
      res.status(200).json({
        ...data,
        feed_key: "led",
        message: "successful",
      });
    })
    .catch((error) => {
      res.status(200).json(error);
    });
};

export const setLed = async (req, res, next) => {
  const { value } = req.body;
  if (!value) {
    res.status(400);
    return next(new Error("Value is not sent!"));
  } else {
    publishData(feed_list.led, value, (result) => {
      if (result) {
        res.status(201).json({
          message: "Set data successful",
        });
      } else {
        res.status(400);
        return next(new Error("Set data failed"));
      }
    });
  }
};

export const getLastFan = async (req, res) => {
  adaRequest
    .get(`/feeds/${feed_list.fan}/data/last`)
    .then(({ data }) => {
      //console.log(data);
      res.status(200).json({
        ...data,
        feed_key: "fan",
        message: "successful",
      });
    })
    .catch((error) => {
      res.status(200).json(error);
    });
};

export const setFan = async (req, res, next) => {
  const { value } = req.body;
  if (!value) {
    res.status(400);
    return next(new Error("Value is not sent!"));
  } else {
    publishData(feed_list.fan, value, (result) => {
      if (result) {
        res.status(201).json({
          message: "Set data successful",
        });
      } else {
        res.status(400);
        return next(new Error("Set data failed"));
      }
    });
  }
};

export const getLastAntiTheft = async (req, res, next) => {
    try{
        adaRequest
            .get(`/feeds/${feed_list.antitheft}/data/last`)
            .then(({ data }) => {
                //console.log(data);
                res.status(200).json({
                    ...data,
                    feed_key: "anti-theft",
                    message: "successful",
                });
            })
            .catch((error) => {
                res.status(200).json(error);
            });
    }
    catch (err){
        throw err;
    }
}
export const setAntiTheft = async (req, res, next) => {
    const {value} = req.body;
    try {
        if (!value) {
            res.status(400);
            return next(new Error("Value is not sent!"));
        } else {
            publishData(feed_list.antitheft, value, (result) => {
                if (result) {
                    res.status(201).json({
                        message: "Set data successful",
                    });
                } else {
                    res.status(400);
                    return next(new Error("Set data failed"));
                }
            });
        }
    }
    catch(err){
        throw err;
    }
}
export const getNotification = async(req,res,next) => {
    const {limit, api_key } = req.body;
    const noti = ref(database,"notifications")
    try{
        const notifications = [];
        onValue(noti, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                let key = Object.keys(data)
                key.forEach( (val) => {
                    let newnoti = new Notifications(data[val].feed,data[val].content,data[val].createAt)
                    notifications.push(JSON.parse(newnoti.toString()));
                })
                const notiArray = Object.keys(data).map((key) => ({ postId: key, ...data[key] }));
                notifications.sort((a, b) => a.createAt - b.createAt);
                res.status(200).json({
                    notifications,
                    message: "success"
                })
            } else {
                console.log('No data found.');
            }
        }, {
            // Optional error callback
            errorCallback: (error) => {
                console.error('Error fetching top user notifications:', error);
            }
        });
    }
    catch(err){
        throw err;
    }
}