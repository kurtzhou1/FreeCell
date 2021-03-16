// import React,{useState,useEffect,useRef,memo,useCallback,useMemo} from 'react';
import React,{useState,useEffect} from 'react';
import {getSession} from './storage/makeSession';
import axios from 'axios';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MeterTrend from './meterTrend';

const App = () => {

    // const [ outputVo,setOutputVo ] = useState();  
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
    
    const getMeterData = () => {
      if(data.length === 0){
        //獲取溫度計資料
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
        // padding: '0 20px',
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

    useEffect(()=>{
      getSession();
      getData();
      getMeterData();
    },[])

    console.log()
  
    const classes = useStyles();
    return(
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow  className={classes.root}>
                  {objKey ? objKey.map(i=><TableCell className={classes.themeCell} key={i}>{i}</TableCell>):''}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                  {objValue ? objValue.map(i=><TableCell className={classes.contentCell} key={i}>{typeof(i) == "boolean" ? i ? 'Y':'N': i}</TableCell>):''}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      <MeterTrend data={data}/>
      </>
    )
};

export default App;