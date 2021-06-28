import React,{useState,useEffect} from 'react';
import Login from './Login';
import '../scss/login.scss';
import {localStorageService} from './storage/storeLocalStorage';
import axios from 'axios';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import NotFoundPage from "../libs/notFoundPage";
import HomePage from './HomePage';
import MachineInfo from './machineInfo';
import MeterTrend from './meterTrend';
import { PrivateRoute } from './PrivateRoute';

const App = () => {

    const [ isLogin,setIsLogin ] = useState(localStorage.getItem('accessToken') ? true : false);
    const [ objKey,setObjKey] = useState<string[]>([]);   //設備基本資料Key
    const [ objValue,setObjValue ] = useState<any[]>([]); //設備基本資料Value

    // 全局設定 AJAX Request 攔截器 (interceptor)
    axios.interceptors.request.use(async function (config) {
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    const getSession = (username:string,password:string):void => {
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

    const route = (
        <Switch>
            <Route path="/Login" component={()=><Login isLogin={isLogin} getSession={getSession} setIsLogin={setIsLogin}/>} />
            <PrivateRoute exact path="/" component={()=><HomePage />} />
            <PrivateRoute path="/MachineInfo" component={()=><MachineInfo objKey={objKey} objValue={objValue} />} />
            <PrivateRoute path="/MeterTrend" component={()=><MeterTrend />} />
            <PrivateRoute component={NotFoundPage} />
        </Switch>
    );

    const headers = {
        "Accept":"application/json",
        "Authorization":`Bearer ${localStorage.getItem('accessToken')}`,
        "tenant":localStorage.getItem('tenant')
    }

    // 獲取設備基本資料
    const getData = () => {
        axios({
            method: 'get',
            url:'https://venus.comismart.com/api/rest/device/1557544144141',
            headers: headers
        }).then(response => {
            // setOutputVo(response.data);
            const dataKey = Object.keys(response.data)
            dataKey.splice(dataKey.indexOf('data'),1)
            setObjKey(dataKey)
            const dataValue = Object.values(response.data)
            dataValue.splice(dataValue.indexOf(response.data.data),1)
            setObjValue(dataValue)
            console.log(`成功:${response.data}`)
        }).catch(err => {
            console.log(`失敗:${err}`);
            }
        )
    }

    // 登出
    const logOut = () => {
        setIsLogin(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tenant');
    }

    useEffect(()=>{
        if(isLogin){
        getData();
        }    
    },[isLogin])

    return (
        <>
            <BrowserRouter>
                <div className="contentContain">
                    <ul>
                        {/*Link組件中的to會改變網址，但不會刷新頁面*/}
                        <li onClick={logOut}><Link to="/Login">登出</Link></li>
                        <li><Link to="/">首頁</Link></li>
                        <li><Link to="/MachineInfo">設備資料</Link></li>
                        <li><Link to="/MeterTrend">溫度計資料</Link></li>
                    </ul>
                        {route}
                </div>
            </BrowserRouter>
            {/* <Login isLogin={isLogin} getSession={getSession}/> */}
        </>
    )
}

export default App;