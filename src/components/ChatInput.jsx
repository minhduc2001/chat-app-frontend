import React, { useState } from 'react'
import styled from "styled-components";
import Picker from "emoji-picker-react"
import { IoMdFastforward, IoMdSend } from 'react-icons/io'
import { BsEmojiSmileFill } from 'react-icons/bs'
function ChatInput({handleSendMessage}) {
    const [showEmoji, setShowEmoji] = useState(false);
    const [msg, setMsg] = useState('');

    const handleEmoji = () => {
        setShowEmoji(!showEmoji);

    }

    const handleEmojiClick = (event, emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    }

    const sendChat = (event) => {
        event.preventDefault();
        if(msg.length>0){
            handleSendMessage(msg);
            setMsg('');
        }
    }

    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={() => { handleEmoji() }} />
                    {showEmoji && <Picker onEmojiClick={handleEmojiClick} />}
                </div>
            </div>
            <form className="input-container" onSubmit={(e) => sendChat(e)}>
                <input type="text" placeholder="type your message here" value={msg} onChange={(e)=>{setMsg(e.target.value)}}/>
                <button className="submit">
                    <IoMdSend></IoMdSend>
                </button>
            </form>
        </Container>
    )
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 5% 95%;
    background-color: #000;
    padding: 0 2rem;
    padding-bottom: 0.3rem;

    .button-container{
        display: flex;
        align-items: center;
        color: white;
        gap: 1rem;

        .emoji{
            position: relative;
            svg{
                font-size: 1.5rem;
                color: #ffff00c8;
                cursor: pointer;
            }
            .emoji-picker-react{
                position: absolute;
                top: -350px;
                background-color: #080420;
                box-shadow: 0 5px 10px #9a86f3;
                border-color: #9186f3;

                .emoji-scroll-wrapper::-webkit-scrollbar{
                    background-color: #000;
                    width: 5px;
    
                    &-thumb{
                        background-color: #9168f3;
                    }
                }
                .emoji-categories{
                    button{
                        filter: contrast(0);
                    }
                }
    
                .emoji-search{
                    background-color: transparent;
                    border-color: #9186f3;
                }
    
                .emoji-group:before{
                    background-color: #080420;
                }
            }


        }
    }

    .input-container{
        width: 100%;
        border-radius: 2rem;
        display:flex;
        align-content: center;
        gap: 2rem;
        background-color: #ffffff34;

        input{
            width: 90%;
            height: 100%;
            background-color: transparent;
            color: white;
            border: none;
            padding-left: 1rem;
            font-size: 1.2rem;
            &::selection{
                background-color: #9186f3;
            }
            &:focus{
                outline: none;
            }
        }
        button{
            padding: 0.3rem 2rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #9a86f3;
            border: none;
            svg{
                font-size: 2rem;
                color: white;
            }
        }
    }
`;
export default ChatInput