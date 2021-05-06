import React,{useState} from 'react';
import Login from './Login';
import '../scss/login.scss';
import {localStorageService} from './storage/storeLocalStorage';
import axios from 'axios';

const App = () => {
    const calssName = 'login_module';
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isLogin,setIsLogin ] = useState(false);

    // 全局設定 AJAX Request 攔截器 (interceptor)
    axios.interceptors.request.use(async function (config) {
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    const getSession = () => {
        //axios方式
        axios({
            method: 'post',
            url:'https://venus.comismart.com/auth/rest/token',
            data:{"login": username,"password":password},
        }).then(response => {
            localStorageService(response.data);
            console.log(`成功:${response.data.accessToken}`)
            setIsLogin(true);
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

    return (
        <>
            <div className={`${calssName} ${isLogin ? 'isLogin':''}`}>
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
                            <div onClick={()=>getSession()}>Login</div>
                        </div>
                    </div>
                </div>
            </div>
            <Login isLogin={isLogin}/>
        </>
    )
}

export default App;