import React, { useEffect, useState, useRef } from 'react'
import styled from "styled-components";
import ChatInput from './ChatInput'
import Logout from './Logout'

import { sendMessageRoute } from '../utils/APIRoutes'
import { getMessageRoute } from '../utils/APIRoutes'
import axios from 'axios';
import { v4 as uuid } from 'uuid'
function ChatContainer({ currentChat, currentUser, socket }) {

    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const handleEffect = async () => {
            if (currentChat) {
                const response = await axios.post(getMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id
                })
                setMessages(response.data);

            }
        }
        handleEffect();
    }, [currentChat])

    const handleSendMessage = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        })

        socket.current.emit('send-msg', {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        })

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg })
        setMessages(msgs);
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('receive-msg', (msg) => {
                console.log(msg);
                setArrivalMessage({
                    fromSelf: false,
                    message: msg
                })
            })
        }
    }, [])

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <>
            {
                currentChat && (<Container>
                    <div className="chat-header">
                        <div className="user-detail">
                            <div className="avatar">
                                <img
                                    src={`data:image/svg+xml;base64,${currentChat.avatar}`}
                                    alt='avatar'
                                />
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                        <Logout></Logout>
                    </div>
                    <div className="chat-messages">
                        {
                            messages.map((message, index) => {
                                return (
                                    <div ref={scrollRef} key={uuid()}>
                                        <div
                                            key={index}
                                            className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
                                            <div className="content">
                                                <p>
                                                    {message.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <ChatInput handleSendMessage={handleSendMessage}></ChatInput>
                </Container>)
            }
        </>
    )
}


const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 78% 12%;
    gap: 0.1rem; 
    padding-top: 1rem;
    overflow: hidden;
    @media screen and (min-width:720px) and (max-width: 1080px){
        grid-template-rows:15% 70% 15%;
    }
    .chat-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;

        .user-detail{
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar{
                img{
                    height: 3rem;
                }
    
            }
            .username{
                h3{
                    color: white;
                }
            }

        }
    }

    .chat-messages{
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar{
            width: 0.2rem;
            &-thumb{
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message{
            display: flex;
            align-items: center;
            .content{
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #fff;

            }
        }

        .sended{
            justify-content: flex-end;
            .content{
                background-color: #4f04ff21;

            }
        }

        .received{
            justify-content: flex-start;
            .content{
                background-color: #9900ff20;
            }
        }
    }
`;
export default ChatContainer