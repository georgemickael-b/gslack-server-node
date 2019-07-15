let sockets = {}
function intitSocket(io) {
    io.on('connection', function (socket) {
        console.log(socket.handshake.query.userId, "in socket")
        sockets[socket.handshake.query.userId] = socket
    });
}

module.exports = {
    sockets: sockets,
    intitSocket: intitSocket
}
