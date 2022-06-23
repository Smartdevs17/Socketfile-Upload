// Require the libraries:
var SocketIOFileUpload = require("socketio-file-upload")
const connection  = require("./db/db-config");
const File = require("./models/Penthouse");

const express = require('express')
const app = express()
app.use(express.json());
app.use(SocketIOFileUpload.router);
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)
app.use(express.static(__dirname + '/uploads'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/files",async(req,res) => {
  try {
    const files = await File.find()
    res.status(200).json(files)
  } catch (error) {
    console.log(error.message)
    res.status(500).json(error.message)
  }
})



io.sockets.on("connection", function (socket) {
  // Make an instance of SocketIOFileUpload and listen on this socket:
  var uploader = new SocketIOFileUpload();
  uploader.dir = "uploads";
  uploader.listen(socket);

  

  const  setData = async(data) => {
   let result = JSON.stringify(data);
   
    const newfile = await new File({
      file: result
    });
    // console.log(newfile)
     newfile.save()
  }

//   uploader.on("complete", (event) => {
//     const file=  event.file;
//     //saving to mongodb
//     setData(file)  
 
//  });

// Do something when a file is saved:
  uploader.on("saved", function (event) {
      event.file.clientDetail.name = event.file.name; 
          const file=  event.file;
    //saving to mongodb
    setData(file) 
  });

  // Error handler:
  uploader.on("error", function (event) {
    console.log("Error from uploader", event);
  });
});

const port = 5000 || process.env.PORT;
server.listen(port, () => {
  console.log(`Server started  running on port ${port}`); 
});
