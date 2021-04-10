import React,{useState,useEffect} from 'react';
import '../scss/login.scss';
import {localStorageService} from './storage/storeLocalStorage';
import axios from 'axios';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MeterTrend from './meterTrend';
import { makeStyles } from '@material-ui/core/styles';

const Login = () => {
    const calssName = 'login_module';
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isLogin,setIsLogin ] = useState(false);
    const [ objKey,setObjKey] = useState<string[]>([]);   //設備基本資料Key
    const [ objValue,setObjValue ] = useState<any[]>([]); //設備基本資料Value
    const [ data,setData ] = useState([]);                //溫度計資料

    const headers = {
        "Accept":"application/json",
        "Authorization":`Bearer ${localStorage.getItem('accessToken')}`,
        "tenant":localStorage.getItem('tenant')
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
  
      const useStyles = makeStyles({
        root: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            height: 48,
            width: '100%',
            // padding: '0 20px',
        },
        content: {
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            height: 48,
        },
        themeCell: {
          color: 'white',
          textAlign: 'center',
          fontSize: '16px',
          padding: '10px',
        },
        contentCell:{
          textAlign: 'center',
          fontSize: '14px',
          padding: '5px',
        }
      });
    const classes = useStyles();
  
    useEffect(()=>{
        if(isLogin){
            getData();
            getMeterData();
        }
    },[isLogin])


    // 全局設定 AJAX Request 攔截器 (interceptor)
    axios.interceptors.request.use(async function (config) {
        return config
    }, function (error) {
        return Promise.reject(error)
    })


    const getSession = (username:string,password:string) => {
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

    console.log('isLogin=>>',isLogin)
    return (
    <>
        {!isLogin ? 
        <div className={calssName}>
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
                        <div onClick={()=>getSession(username,password)}>Login</div>
                    </div>
                </div>
            </div>
        </div> : 
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow  className={classes.root}>
                            {objKey ? objKey.map(i=><TableCell className={classes.themeCell} key={i}>{i}</TableCell>):''}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow className={classes.content}>
                            {objValue ? objValue.map(i=><TableCell className={classes.contentCell} key={i}>{typeof(i) == "boolean" ? i ? 'Y':'N': i}</TableCell>):''}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <MeterTrend data={data}/>
        </>}
    </>)
}

export default Login;