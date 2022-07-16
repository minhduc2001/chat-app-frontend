import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';

function Login() {
  const navigate = useNavigate();
  const [values, setValue] = useState({
    email: '',
    password: '',
  });

  const toastOption = {
    position: 'top-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  useEffect(() => {
    if(localStorage.getItem('chat-app-user')){
      navigate('/');
    }
  },[]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      const { email, password } = values;
      const { data } = await axios.post(loginRoute, {
        email,
        password
      })

      if (data.status === false) {
        toast.error(data.msg, toastOption)
      } else {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user))
        if(data.user.isAvatarSet || data.user.username !=='') navigate('/');
        else navigate('/setAvatar')
      }

    }
  };

  const handleValidation = () => {
    const { email } = values;
    if (email === '') {
      toast.error('email is required!', toastOption);
      return 0;
    }
    return 1;
  }

  const handleChange = (event) => {
    event.preventDefault();
    setValue({ ...values, [event.target.name]: event.target.value })
  }
  return (
    <>
      <FormComponent>
        <div className="body">
          <div className="logo">
            <div className="logo-img">
              <img src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" alt="facebook.com" />
            </div>

            <h1>Facebook helps you connect and share with the people in your life.</h1>
          </div>

          <div className="input">
            <form onSubmit={(event) => handleSubmit(event)}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) => handleChange(e)}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => handleChange(e)}
              />

              <button type="submit">Login</button>
              <span>
                <Link to='#'
                  style={{
                    paddingLeft: 13,
                    textDecoration: 'none',
                    color: '#1877f2'
                  }}>Forgotten password?</Link>
              </span>

            </form>
            <div className="line"></div>
            <div className="create">
              <div>
                <Link to='/register' style={{ textDecoration: 'none', color: 'white', padding: '14px 0' }}>Create New Account</Link>
              </div>
            </div>

          </div>
        </div>

      </FormComponent>
      <ToastContainer />
    </>
  );
}

const FormComponent = styled.div`
  height: 550px;
  witdh: 100vw;
  display: flex;
  justify-content: center;

  padding-bottom: 600px;
  padding-top: 72px;
  background: #f0f2f5;
  .body{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  };
  .logo{
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-top: 40px;
    padding-right: 32px;
    width: 580px;
    .logo-img{
      width: 385px;
      height: auto;

      img{
      width: 100%;
      margin-left: -30px;
      }
    };
    
    h1{
      font-weight: 350;
      font-size: 30px;
      margin-left: 8px;
    }
  };
  .input{
    padding-bottom: 24px;
    padding-top: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    box-sizing: border-box;
    margin: 40px 0 0;
    padding: 20px 0 28px;
    width: 396px;
    flex-direction: column;

    form{
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        
        input{
          border: 1px solid blue;
          border-radius: 6px;
          font-size: 17px;
          padding: 14px 16px;
          width: 95%;
          margin: 5px 0;
        }
        
        button{
          background-color: #1877f2;
          border: none;
          border-radius: 6px;
          font-size: 20px;
          line-height: 48px;
          padding: 0 16px;
          width: 95%;
          margin: 10px 0;
          color: white;
          cursor: pointer;

          &:hover{
            background-color: #1877f2;
          };

          
        }
        span{
          margin-top: 10px;
        }
      };

      .line{
        align-items: center;
        border-bottom: 1px solid #dadde1;
        display: flex;
        margin: 20px 16px;
        text-align: center;

    //     color: #1c1e21;
    // direction: ltr;
    // line-height: 1.34;
      };

      .create{
        display: flex;
        justify-content: center;
        align-items: center;
       
        div{
          border: none;
          border-radius: 6px;
          font-size: 17px;
          line-height: 48px;
          padding: 0 16px;
          background-color: #42b72a;
        };
      }
      
  };
  
`;

export default Login;
