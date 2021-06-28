import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage =()=> {
    return(
        <div>
            <h4>頁面維護中...</h4>
            <Link to="/"> 按此回首頁 </Link>
        </div>
    )
}


export default NotFoundPage;