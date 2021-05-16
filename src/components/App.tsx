import React,{useState,useEffect} from 'react';
import Login from './Login';
import '../scss/login.scss';
import {localStorageService} from './storage/storeLocalStorage';
import axios from 'axios';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import NotFoundPage from "../libs/notFoundPage";
import MachineInfo from './machineInfo';
import MeterTrend from './meterTrend';

const App = () => {

    const [ isLogin,setIsLogin ] = useState(localStorage.getItem('accessToken') ? true : false);
    const [ objKey,setObjKey] = useState<string[]>([]);   //設備基本資料Key
    const [ objValue,setObjValue ] = useState<any[]>([]); //設備基本資料Value
    const [ data,setData ] = useState([]);                //溫度計資料

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

    const mySocket = new WebSocket("wss://venus.comismart.com/api/websocket");
    const info1 = {
        action: "authenticate",
        token: localStorage.getItem('accessToken')
    }
    const info2 = {
        action: "notification/subscribe",
        deviceId: "1557544144141",
        names: ["measurements"]
    }

    //獲取溫度計資料
    const getMeterData = () => {
        if(data.length === 0){
            mySocket.onopen = function() {
            mySocket.send(JSON.stringify(info1));
            mySocket.send(JSON.stringify(info2));
            };
            mySocket.onmessage = function(e) {
            if(JSON.parse(e.data).action.includes('insert')){
                // mySocket.close(); //關閉webSocket
                const tmpData = JSON.parse(e.data);
                setData(tmpData.notification);
            }
            }
        }
    }

    const route = (
        <Switch>
            {!isLogin ? 
                <Route exact path="/" component={()=><Login isLogin={isLogin} getSession={getSession}/>} /> :
                <>
                    <Route exact path="/" component={()=><MachineInfo objKey={objKey} objValue={objValue} setIsLogin={setIsLogin}/>} />
                    <Route exact path="/MeterTrend" component={()=><MeterTrend data={data} setIsLogin={setIsLogin}/>} />
                </>
            }
            <Route component={NotFoundPage} />
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

    useEffect(()=>{
        if(isLogin){
        getData();
        getMeterData();
        }    
    },[isLogin])

    return (
        <>
            <BrowserRouter>
                <div className="contentContain">
                        {route}
                </div>
            </BrowserRouter>
        </>
    )
}

export default App;