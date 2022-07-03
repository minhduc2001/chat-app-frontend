import React, { useEffect, useState, useRef } from 'react';
import styled from "styled-components";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { allUsersRoute } from '../utils/APIRoutes';
import axios from 'axios';
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer'
import { host } from '../utils/APIRoutes'
import { io } from 'socket.io-client'

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('chat-app-user')));
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // let currentUser;

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login')
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
      setIsLoading(true);
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      console.log(socket);
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser])

  const handleEffect = async () => {
    if (currentUser) {
      if (currentUser.isAvatarSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data)

      } else {
        navigate('/setAvatar');
      }
    }
  }

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  useEffect(() => {
    handleEffect()
  }, [currentUser])

  // console.log(currentChat);
  return (
    <>
      {currentChat === null ? <Navigate to='/login' /> :
        (<Container>
          <div className="container">
            <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}></Contacts>
            {
              isLoading && currentChat === undefined ?
                (<Welcome currentUser={currentUser} />) :
                (
                  <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                )
            }
          </div>
        </Container>)
      }
    </>


  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000078;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width:720px) and (max-width: 1080px){
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat