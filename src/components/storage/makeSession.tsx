import {localStorageService} from './storeLocalStorage';
import axios from 'axios';

// 全局設定 AJAX Request 攔截器 (interceptor)
axios.interceptors.request.use(async function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

export const getSession = () => {

    axios({
      method: 'post',
      url:'https://venus.comismart.com/auth/rest/token',
      data:{"login": "demo","password":"demop@ssw0rd"},
    }).then(response => {
      localStorageService(response.data);
        console.log(`成功:${response.data.accessToken}`)
    }).catch(err => {
        console.log(`失敗:${err}`);
      }
    )

    //全局設定 AJAX Request 攔截器 (interceptor)
    axios.interceptors.request.use(async function (config) {
      return config
    }, function (error) {
      return Promise.reject(error)
    })

    //全局設定 AJAX Response 攔截器 (interceptor)
    axios.interceptors.response.use(function (response){
        return response
      },function(error){
        if(error.response){
          console.log('error==>',error.response)
          switch(error.response.status){
            case 400:
              {
                const { message } = error.response.data
                alert(`${error.response.status}: ${message || '資料錯誤'}。`)
              }
              break      
            case 401:
              // 當不是 refresh token 作業發生 401 才需要更新 access token 並重發
              // 如果是就略過此刷新 access token 作業，直接不處理(因為 catch 已經攔截處理更新失敗的情況了)
              {
                // 依據 refresh_token 刷新 access_token 並重發 request
                const originalRequest = error.config;
                console.log('originalRequest=>>',originalRequest)
                return axios({
                  method: 'post',
                  url: 'https://venus.comismart.com/auth/rest/token/refresh',
                  data:{"refreshToken": "string"},
                  }).then(response=>{
                    console.log('更新 access_token 成功=>>',response)
                    // localStorage.setItem('refreshToken',dataJWT.refreshToken);
                    // return axios(originalRequest)
                  }).catch(err => {
                    console.log(`失敗YYYYY:${err}`);
                    // return Promise.reject(error)
                })
              }
              break
          }
        }
      }
    )
  
}

//為了滿足換發 access_token 的機制，我們可以善用 axios 的 response interceptor 功能來實作
//簡單的來說就是透過 AOP 概念統一處理 401(Unauthorized) 錯誤，當發現 401(Unauthorized) 錯誤時就表示 access_token 失效了
//此時直接呼叫 API 來換發 access_token，當換發成功，表示 refresh_token 合法且仍在效期內)
//此時自動重新發送先前發生 401(Unauthorized) 的 request 來取得資料，可以完全在背景自動處理掉這段過程
//另外當換發失敗 (表示 refresh_token 也失效) 時，那就是真的無法保持登入狀態(可能是太久沒操作系統)，所以就直接導向登出頁面。


//https://www.dotblogs.com.tw/wasichris/2020/10/25/223728