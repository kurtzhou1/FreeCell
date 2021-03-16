import React,{useState,useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MeterTrend:React.FC<any> = (props) => {

  const dataKey = Object.keys(props.data);
  const [dataArray, setDataArray] = useState<any[]>([]);

  useEffect(()=>{
    if(dataKey.length !== 0){
      let nine = props.data.parameters['9'].value; //庫內溫度
      let ten = props.data.parameters['10'].value; //蒸發器溫度
      let tmpArr = {Warehouse_Temperature:nine,Evaporator_Temperature:ten};
      if(dataArray.length <= 2){
        setDataArray([...dataArray,tmpArr ]);
      }else{
        const shiftArray = dataArray.shift()
        setDataArray([...shiftArray,tmpArr ]);
      }
    }
  },[props.data])
  console.log('dataArr=>>',dataArray)
  
  return(
      <LineChart
          width={1000}
          height={500}
          data={dataArray}
          margin={{
          top: 30,
          right: 20,
          left: 20,
          bottom: 5
          }}
      >
          <CartesianGrid strokeDasharray="3 3" />
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
  )
}

export default MeterTrend