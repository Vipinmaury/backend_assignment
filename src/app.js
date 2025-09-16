// import express from "express"
// const app = express()


// app.use(express.json({limit: "16kb"}))
// app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))



import express from "express";
import offerRoutes from "./routes/offer.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

      const app = express();

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/offer", offerRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/score", scoreRoutes);

app.get("/", (req, res) => res.send("Lead Scorer API"));

app.use(errorHandler);



export { app }