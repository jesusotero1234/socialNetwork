import * as io from 'socket.io-client';
import chatMessages  from '../actions/chatMessages';
import newMessage  from '../actions/newMessage';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();


        socket.on('muffinMagic', mymuffin=>{

            console.log('myMuffin on the client side', mymuffin)

        })

        socket.on(
            'chatMessages',
            msgs => store.dispatch(
                chatMessages(msgs)
            )
        );

        socket.on(
            'newMessage',
            msg => store.dispatch(
                newMessage(msg)
            )
        );
    }
};