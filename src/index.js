import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/module';
import {Provider} from 'react-redux';
export const APP = () => <Provider><App /></Provider>

ReactDOM.render(
    <App />,
  document.getElementById('root')
);