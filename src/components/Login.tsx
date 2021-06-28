import React,{useState,useEffect} from 'react';
import '../scss/login.scss';
import axios from 'axios';
import { isLogin } from '../libs/common';
import {localStorageService} from './storage/storeLocalStorage';
import { Route } from 'react-router-dom'
import { Redirect } from 'react-router'

const Login:React.FC<any> = (props) => {
    
    // const [ objKey,setObjKey] = useState<string[]>([]);   //設備基本資料Key
    // const [ objValue,setObjValue ] = useState<any[]>([]); //設備基本資料Value
    const [ username, setUsername ] = useState('dmmo');
    const [ password, setPassword ] = useState('demop@ssw0rd');
    // dmmo demop@ssw0rd

    const getSession = (username:string,password:string):void => {
        //axios方式
        axios({
            method: 'post',
            url:'https://venus.comismart.com/auth/rest/token',
            data:{"login": username,"password":password},
        }).then(response => {
            localStorageService(response.data);
            console.log(`成功:${response.data.accessToken}`)
            props.setIsLogin(true);
        }).catch(err => {
            console.log(`失敗:${err}`);
            alert('帳號或密碼錯誤，請重新檢查')
            }
        )

        // //全局設定 AJAX Request 攔截器 (interceptor)
        // axios.interceptors.request.use(async function (config) {
        //   return config
        // }, function (error) {
        //   return Promise.reject(error)
        // })
    
        // //全局設定 AJAX Response 攔截器 (interceptor)
        // axios.interceptors.response.use(function (response){
        //     return response
        //   },function(error){
        //     if(error.response){
        //       console.log('error==>',error.response)
        //       switch(error.response.status){
        //         case 400:
        //           {
        //             const { message } = error.response.data
        //             alert(`${error.response.status}: ${message || '資料錯誤'}。`)
        //           }
        //           break      
        //         case 401:
        //           // 當不是 refresh token 作業發生 401 才需要更新 access token 並重發
        //           // 如果是就略過此刷新 access token 作業，直接不處理(因為 catch 已經攔截處理更新失敗的情況了)
        //           {
        //             // 依據 refresh_token 刷新 access_token 並重發 request
        //             const originalRequest = error.config;
        //             console.log('originalRequest=>>',originalRequest)
        //             return axios({
        //               method: 'post',
        //               url: 'https://venus.comismart.com/auth/rest/token/refresh',
        //               data:{"refreshToken": "string"},
        //               }).then(response=>{
        //                 console.log('更新 access_token 成功=>>',response)
        //                 // localStorage.setItem('refreshToken',dataJWT.refreshToken);
        //                 // return axios(originalRequest)
        //               }).catch(err => {
        //                 console.log(`失敗YYYYY:${err}`);
        //                 // return Promise.reject(error)
        //             })
        //           }
        //           break
        //       }
        //     }
        //   }
        // )
    }

    const onCommentSubmit = (e:any) => {
        e.preventDefault();
        getSession(username,password);
    }
  
    return(
        <Route render={() => (
            props.isLogin
            ?   <Redirect to={{ pathname: '/'}} />
            :   <div className={`content`}>
                    <div className={`login_module`}>
                        <div className="login">
                            <form className="loginForm" onSubmit={(e:any)=>{onCommentSubmit(e)}}>
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
                                    <button type="submit">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        )}/>
    )
}

export default Login;