// Controller handler to handle functionality in room page

const roomGenerator = require('../util/roomIdGenerator.js');
const Room = require('../models/Rooms')

// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response){

    console.log(request.params.roomName)
    
    Room.find({name: request.params.roomName}).lean().then( data => {

        response.render('room', {title: 'chatroom',
                                roomName: request.params.roomName,
                                newRoomId: data[0].roomId,
                                Messages: data[0].Messages});

    }).catch(error => (console.log(error)))
}

module.exports = {
    getRoom
};