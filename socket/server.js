const express = require('express');
const socket = require('socket.io');
const app = express();
const cors = require('cors');

const PORT = 4004;

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

// app.get('/', (req, resp) => resp.send('yessss me'));


const server = app.listen(PORT, () => {
    console.log("server start at " + PORT)
});

// const io = socket(server);
const io = socket(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('join-room', (data) => {
        console.log("join-room(data):-", data);
        socket.join(data);
    });

    //{room:'',name:'',message:''}=data
    socket.on('send_message', (data) => {
        console.log('message send..', data)
        socket.to(data.room).emit('receive_message', data)
    });

    socket.on('disconnect', () => {
        console.log("user disconnected")
    });
});


// const express = require("express");
// const app = express();
// const socket = require("socket.io");
// const jwt = require('jsonwebtoken');
// const color = require("colors");
// const cors = require("cors");
// const checkAuth = require("./middleware/auth");
// const mongoose = require("mongoose");
// const Message = require("./Models/Messages");
// const Room = require("./Models/Rooms");
// const User = require("./Models/User");
// const uri = "mongodb://localhost:27017/ChatApp";
// const {secret_key} = require("./uils/config");
// const {to_Encrypt, to_Decrypt} = require("./uils/encryptDecrypt");
//
// app.use(cors());
// app.use(express.json());
//
// app.use(express());
// app.post("/message/:type", checkAuth, async (req, res) => {
//     let data = [];
//     const {id, user} = req.body;
//     const d = await Message.find({messageType: req.params.type});
//     if (req.params.type === "Group") {
//         d.map((item, index) => {
//             if (item.msgTo === id) {
//                 data.push(item);
//             }
//         });
//     } else if (req.params.type === "Personal") {
//         d.map((item, index) => {
//             if ((item.msgBy === user._id && item.msgTo === id) || (item.msgBy === id && item.msgTo === user._id)) {
//                 data.push(item);
//             }
//         });
//     }
//     res.send(data);
// });
// app.get("/messages", checkAuth, async (req, res) => {
//     const d = await Message.find();
//     res.send(d);
// });
// app.delete("/message/:id", checkAuth, async (req, res) => {
//     const d = await Message.deleteOne({_id: req.params.id});
//     res.send(d);
// });
//
// app.get("/users", checkAuth, async (req, res) => {
//     const users = await User.find();
//     res.send(users);
// });
//
// app.post("/login", async (req, res) => {
//     const {email, password} = req.body;
//     const p_user = await User.findOne({email: email});
//     if (p_user) {
//         if (to_Decrypt(p_user.password) === to_Decrypt(password)) {
//             const token = jwt.sign(
//                 {user_id: p_user._id, email},
//                 secret_key,
//                 {
//                     expiresIn: "2h",
//                 }
//             );
//             res.status(200).send({success: true, data: p_user, token: token});
//         } else {
//             res.send({error: "password can't match"});
//         }
//     } else {
//         res.send({error: "user not found"});
//     }
// });
//
// app.post("/register", async (req, res) => {
//     const {name, email, userName, password, socketId} = req.body;
//     const p_user = await User.findOne({email: email});
//     if (p_user && p_user.email === email) {
//         res.send({error: "User Already Exists"});
//     } else {
//         const user = new User({name: name, userName: userName, email: email, password: password, socketId: socketId});
//         const token = jwt.sign(
//             {user_id: user._id, email},
//             secret_key,
//             {
//                 expiresIn: "2h",
//             }
//         );
//         console.log("token", token);
//         user.save(function (error, document) {
//             if (error) console.error(error);
//             console.log(document)
//             res.status(200).send({success: true, msg: "successfully Register", data: document, token: token});
//         });
//     }
// });
// app.put("/editFullProfile", checkAuth, async (req, res) => {
//     const {_id} = req.body;
//     User.findOneAndUpdate({_id: _id}, req.body, (error, document) => {
//         if (error) {
//             console.error(error);
//             res.status(403).send(error);
//         }
//         if (document !== null) {
//             res.status(200).send({msg: "Profile Updated", data: document, success: true})
//         }
//     });
// });
// app.put("/editProfile", checkAuth, async (req, res) => {
//     const {_id} = req.body;
//     User.findOneAndUpdate({_id: _id}, {
//         socketId: req.body.socketId,
//     }, (error, document) => {
//         if (error) {
//             console.error(error);
//             res.status(403).send(error);
//         }
//         if (document !== null) {
//             res.status(200).send({msg: "Profile Updated", data: document})
//         }
//     });
// });
// app.put("/updatePassword", async (req, res) => {
//     const {email, oldPassword, newPassword} = req.body;
//     const p_user = await User.findOne({email: email});
//     if (p_user) {
//         if (to_Decrypt(p_user.password) === oldPassword) {
//             User.findOneAndUpdate({email: email}, {
//                 email: p_user.email,
//                 password: to_Encrypt(newPassword),
//                 name: p_user.name,
//                 userName: p_user.userName
//             }, (error, document) => {
//                 if (error) {
//                     console.error(error);
//                     res.send(error)
//                 }
//                 res.status(200).send({msg: "Password Updated", data: document, success: true})
//             });
//         } else {
//             res.send({error: "Old password can not match"});
//         }
//     }
// });
//
// app.post("/createGroup", async (req, res) => {
//     const {name, members, createdBy} = req.body;
//     const room = new Room({
//         createdBy: createdBy,
//         roomName: name,
//         members: members
//     });
//     room.save(function (error, document) {
//         if (error) console.error(error);
//         console.log(document)
//     });
//     res.status(200).send({msg: "Group Successfully Created", success: true});
// });
//
// app.get("/groups/:user", checkAuth, async (req, res) => {
//     let data = await Room.find();
//     let group = [];
//     data.map((item, i) => {
//         if (item.members.includes(req.params.user)) {
//             group.push(item);
//         }
//     });
//     res.status(200).send(group);
// });
//
// app.get("/group/:name", async (req, res) => {
//     let data = await Room.findOne({roomName: req.params.name});
//     if (data) {
//         res.status(200).send(data);
//     }
//     res.status(400).send("group not found");
// });
//
// app.get("/name/:id", async (req, res) => {
//     let data = await User.findOne({_id: req.params.id});
//     res.status(200).send({data: data.name});
// });
//
// const port = 8000;
// mongoose.connect(uri).then(() => {
//     console.log("Mongodb Connected");
// }).catch(() => {
//     console.log("Mongodb Error");
// });
//
// var server = app.listen(
//     port,
//     console.log(
//         `Server is running on the port no: ${(port)} `
//             .green
//     )
// );
