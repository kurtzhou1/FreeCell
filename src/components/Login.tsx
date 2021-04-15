import React,{useState,useEffect} from 'react';
import '../scss/login.scss';
import {localStorageService} from './storage/storeLocalStorage';
import axios from 'axios';
import MachineInfo from './machineInfo';
import MeterTrend from './meterTrend';

const Login:React.FC<any> = (props) => {

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
  useEffect(()=>{
    if(props.isLogin){
      getData();
      getMeterData();
    }    
  },[props.isLogin])
  return(
    <div className={`content ${props.isLogin ? 'isLogin':''}`}>
            <MachineInfo objKey={objKey} objValue={objValue} />
            <MeterTrend data={data}/>
    </div>
  )
}

export default Login;