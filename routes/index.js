
import dataRouter from "./dataRoutes.js";
import userRouter from "./userRoutes.js";
const route = (app) => {
    app.use("/api/data", dataRouter);
    app.use("/api/user", userRouter);
};

export default route;
