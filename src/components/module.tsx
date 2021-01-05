import React,{useState} from 'react';

const Uploading = () => {

  const [imgSrc,setImgSrc] = useState('');

  const fileload = (e:any) => {
    setImgSrc(e.target.result)
  }
  
  const onChange = (e:any) => {
    console.log('onChange=>>',e)
    const imgFile = e.target.files.item(0) //利用e.target.files取得選取到的檔案們
    const fr = new FileReader(); //利用FileReader讀取一個檔案內容成為 -> 1
    fr.addEventListener("load", fileload);
    fr.readAsDataURL(imgFile); //成為一個data的url
    console.log('imgFile=>>',imgFile)
  }

  return (
    <div className="freeCell_Module">
        <input type="file" onChange={onChange} />
        <img width="10%" src={imgSrc}/>
    </div>
  );
}

export default Uploading;
