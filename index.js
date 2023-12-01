const express = require("express");
const http = require("http"); // Import http module
const socketIO = require("socket.io"); // Import socket.io

const app = express();
const server = http.createServer(app); // Create an http server
const io = socketIO(server); // Create a socket.io instance attached to the server

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

// Increase payload size limit to handle larger images
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Cloudinary configuration
const {cloudinary} = require ('./utils/cloudinary');
// Importing the routers
const userRouter = require("./routers/userRouter");
const profileRouter = require("./routers/profileRouter");
const requestRouter = require("./routers/requestRouter");
const bidRouter = require("./routers/bidRouter");

app.use("/users", userRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/bid", bidRouter);

app.use(express.json());

// Define a socket.io connection event
io.on("connection", (socket) => {
  console.log("A user connected via socket.io");

  // Event listener for when the client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected via socket.io");
  })
  
});

const port = 3000;

server.listen(port, () => {
  console.log(`The Server is running on port ${port}`);
});
