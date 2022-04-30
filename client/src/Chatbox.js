import React, {useEffect, useState} from 'react'
import socket from './io'

function Chatbox() {
    const [inputField, setInputField] = useState({
        name: '',
        room: '',
        message: ''
    });
    const [isChating, setIsChating] = useState(false);
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList([...messageList, data])
        })
    })

    const inputHandler = (e) => {
        setInputField({
            ...inputField, [e.target.name]: e.target.value
        })
    }

    const enterRoom = () => {
        console.log(inputField);
        setIsChating(true);
        socket.emit('join-room', inputField.room)
    }

    const sendMessage = async () => {
        console.log("message", inputField);
        await socket.emit('send_message', inputField);
        setMessageList([...messageList, inputField]);
        setInputField({...inputField, message: ''});
        // console.log("setMessageList", messageList);
    }

    console.log('message', messageList)
    return (

        <div className=' container flex-column d-flex justify-content-center'>
            <h1>Chat App</h1>
            {
                !isChating ? (
                    <div className='container d-flex p-3 flex-column justify-content-center'>
                        <input className='input-teg' type='text' placeholder='Name' name='name'
                               onChange={inputHandler}/>
                        <input className='input-teg' type='text' placeholder='Room' name='room'
                               onChange={inputHandler}/>
                        <br/>
                        <button className=' btn btn-secondary' onClick={enterRoom}>Enter chat room</button>
                    </div>
                ) : (
                    <div>
                        <h2>Chat Box</h2>
                        {
                            messageList.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {item.name}:{item.message}
                                    </div>
                                )
                            })
                        }
                        <div className='container d-flex p-3  justify-content-center'>
                            <input className='input-teg' type='text' placeholder='Message...' name='message'
                                   value={inputField.message}
                                   onChange={inputHandler}/>
                            <button className='btn mx-3 btn-outline-primary chat_button' onClick={sendMessage}>Send.</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Chatbox;