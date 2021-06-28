import React,{useState,useEffect} from 'react';
import { Route } from 'react-router-dom'
import { Redirect } from 'react-router'

export const PrivateRoute = (props:any) => {
    
    // const [ isLogIn , setIsLogIn ] = useState(false);
    const isLogIn = localStorage.getItem('accessToken') ? true : false
    const { component: Component, ...rest } = props
    // const checkAuth = () => {
    //     console.log()
    //     if(localStorage.getItem('accessToken')){
    //         setIsLogIn(true)
    //     }
    // }
    
    // useEffect(()=>{
    //     checkAuth();
    // })
    
    return(
        <Route {...rest} render={props => (
            isLogIn
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/Login'}} />
        )}/>
    )
}