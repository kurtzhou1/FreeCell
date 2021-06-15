import React,{useState,useEffect} from 'react';
import '../scss/login.scss';
import axios from 'axios';
import { isLogin } from '../libs/common'

const Login:React.FC<isLogin> = (props) => {

    // const [ objKey,setObjKey] = useState<string[]>([]);   //設備基本資料Key
    // const [ objValue,setObjValue ] = useState<any[]>([]); //設備基本資料Value
    const [ username, setUsername ] = useState('dmmo');
    const [ password, setPassword ] = useState('demop@ssw0rd');
    // dmmo demop@ssw0rd
  
    return(
        <div className={`content ${props.isLogin ? 'close' : ''}`}>
            <div className={`login_module`}>
                <div className="login">
                    <div className="loginForm">
                        <div className="container input">
                            <div>
                                <div>Username</div>
                                <input type="text" onChange={e=>setUsername(e.target.value)} placeholder="Enter Username" name="uname" required />
                            </div>
                            <div>
                                <div>Password</div>
                                <input type="password" onChange={e=>setPassword(e.target.value)} placeholder="Enter Password" name="psw" required />
                            </div>
                        </div>
                        <div className="container button">
                            <div onClick={()=>props.getSession(username,password)}>Login</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;