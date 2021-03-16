import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'

const UploadModule = () => {
  return(
    <>
      <App />
    </>
  )
}

ReactDOM.render(
    <UploadModule />,
  document.getElementById('root')
);