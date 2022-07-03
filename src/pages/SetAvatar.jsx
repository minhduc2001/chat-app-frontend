import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';
import loading from '../assets/loading.gif'
import { Buffer } from 'buffer';

function SetAvatar() {
    
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();
    
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectAvatar, setSelectAvatar] = useState(undefined);
    const [username, setUsername] = useState('');
    
    useEffect(() => {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login');
        }
        else if(JSON.parse(localStorage.getItem('chat-app-user')).isAvatarSet){
            navigate('/')
        }
    }, [])

    const toastOption = {
        position: 'top-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    

    const handleChange = (e) => {
        setUsername(e.target.value)
    }

    const setProfile = async () => {
        if (selectAvatar === undefined) {
            toast.error('Please select an avatar', toastOption);

        }
        else if(username===''){
            toast.error('Please input your name!', toastOption);
        }
        else{
            const user = await JSON.parse(localStorage.getItem('chat-app-user'));
            
            console.log(user);
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                avatar: avatars[selectAvatar],
                username: username
            })

            console.log('data',data);

            if (data.isSet) {
                user.isAvatarSet = true;
                user.avatar = data.avatar;
                user.username = data.username;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                navigate('/');
            }
            else {
                toast.error('Error setting avatar. Please try again!', toastOption)
            }
        }
    }
    const getImage = async () => {
        const data = [];
        for (let i = 0; i < 4; i++) {
            const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
            const buffer = new Buffer(`${image.data}`);
            data.push(buffer.toString('base64'));


        }
        setAvatars(data);
        setIsLoading(false);
    }

    useEffect(() => {
        getImage();
    }, [])

    return (
        <>
            {
                isLoading ? (<Container>
                    <h1 style={{ color: 'white' }}>Please Wait...</h1>
                    <img src={loading} alt="loading" className="loading" />
                </Container>) : (<Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>

                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (<div
                                key={index}
                                className={`avatar ${selectAvatar === index ? 'selected' : ''}`}>
                                <img
                                    src={`data:image/svg+xml;base64,${avatar}`}
                                    alt='avatar'
                                    onClick={() => { setSelectAvatar(index); console.log(`${selectAvatar === index ? 'selected' : ':v'}`); }} />
                            </div>)
                        })}
                    </div>
                    <div className="choose-name">
                        <h2>Input your name</h2>
                        <input type="text" onChange={(e) => { handleChange(e) }} />
                    </div>
                    <button className="submit-btn" onClick={() => setProfile()}>Set as profile picture</button>
                </Container>)
            }


            <ToastContainer />
        </>

    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader{
         max-inline-size: 100%;
    }

    .title-container{
        h1{
            color: #fff;
        }
    }

    .avatars{
        display: flex;
        gap: 2rem;

        .avatar{
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5 ease-in-out;
            img{
                height: 6rem;
                
            };
        };

        .selected{
            border: 0.4rem solid #fff;
        }
   }

    .choose-name{
        display: flex;
        flex-direction: column;
        align-items: center;

        h2{
            color: white;
            font-weight: 500;
            margin: 10px;
        }

            input{
                padding: 0.5rem;
        }
   }

    .submit-btn{
            background-color: #1877f2;
            border: none;
            border-radius: 6px;
            font-size: 20px;
            line-height: 48px;
            padding: 0 16px;
            width: 300px;
            margin: 10px 0;
            color: white;
            cursor: pointer;
   }
   .loading{

   }
`;

export default SetAvatar