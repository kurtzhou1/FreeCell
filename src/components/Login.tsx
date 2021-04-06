import React,{useState,useEffect} from 'react';
import '../scss/login.scss';
import {getSession} from './storage/makeSession';

const Login = () => {
    const calssName = 'login'
    useEffect(()=>{
        getSession();
    },[])
    return (
    <div className={calssName}>
        <div className="login_block">
            <form>
                <label>
                    <p>Username</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" />
                </label>
                {/* <div>
                    <button type="submit">Submit</button>
                </div> */}
                <div className="button">登入</div>
            </form>
        </div>
    </div>)
}

export default Login;