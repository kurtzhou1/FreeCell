import React,{useState,useEffect} from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import MeterTrend from './meterTrend';
// import MachineInfo from './';

const MachineInfo:React.FC<any> = (props) => {
    const objKey = props.objKey;
    const objValue = props.objValue;
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
   
    
    return(
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow  className={classes.root}>
                            {objKey ? objKey.map((i:any)=><TableCell className={classes.themeCell} key={i}>{i}</TableCell>):''}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow className={classes.content}>
                            {objValue ? objValue.map((i:any)=><TableCell className={classes.contentCell} key={i}>{typeof(i) == "boolean" ? i ? 'Y':'N': i}</TableCell>):''}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default MachineInfo;