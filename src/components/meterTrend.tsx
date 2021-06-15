import React,{useState,useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import {dataArray} from '../libs//common';

const MeterTrend:React.FC<any> = () => {
  
  const [ dataArray,setDataArray ] = useState<dataArray[]>([]);
  const [ data,setData ] = useState<any>([]);                //溫度計資料
  const dataKey = Object.keys(data);
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

  useEffect(()=>{
    getMeterData();
  })


  useEffect(()=>{
    if(dataKey.length !== 0){
      let nine = data.parameters['9'].value; //庫內溫度
      let ten = data.parameters['10'].value; //蒸發器溫度
      console.log(nine,ten,dataArray)
      let timestamp = data.timestamp;
      let timestampDate = dayjs(timestamp).format('YYYY-MM-DD');
      let timestampMin = dayjs(timestamp).format('HH:mm:ss');
      let tmpArr = {title:`${timestampDate} ${timestampMin}`,Warehouse_Temperature:nine,Evaporator_Temperature:ten};
      //2021-03-17T07:48:18.656
      if(dataArray.length <= 19){
        setDataArray([...dataArray,tmpArr ]);
      }else{
        dataArray.shift();
        dataArray.push(tmpArr);
        setDataArray(dataArray);
      }
    }
  },[data])
  
  return(
      <ResponsiveContainer width="100%" height="75%">
          <LineChart
              data={dataArray}
              margin={{
              top: 30,
              right: 20,
              left: 20,
              bottom: 50
              }}
          >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={10} tick={{fontSize: 12, fontWeight:'bold'}}/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
              type="monotone"
              dataKey="Warehouse_Temperature"
              stroke="#FE6B8B"
              activeDot={{ r: 8 }}
              strokeWidth={2.5}
              />
              <Line type="monotone" dataKey="Evaporator_Temperature" stroke="#FF8E53" strokeWidth={2.5}/>
          </LineChart>
      </ResponsiveContainer>
  )
}

export default MeterTrend