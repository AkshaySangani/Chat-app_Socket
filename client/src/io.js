const { io } = require("socket.io-client");

const CONN_PORT='localhost:4004/';

let socket;
export default socket=io(CONN_PORT)