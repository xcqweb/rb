import {getToken} from './auth'
import {getWsHost} from './util'
//获取websocket实时数据
/**
 * config = {
 *    subApi: function 订阅websocket接口
 *    params: object  订阅接口参数
 * }
 */

export function getWebsocketRealData(config) {
  let wsConNumber = 0;
  let ws = null;
  let wsTimer = null;
  let wsInterTimer = null;
  config.subApi(config.params).then(({data: {data}}) => {
    wsInit(data);
  });
  //初始化wenbsocket
  function wsInit(url) {
    if (!url) {
        return;  
    }
    closeWs();
    ws = new WebSocket(getWsHost() + url, [getToken]);
    ws.onopen = () => {
      console.log('websocket online');
      clearTimer();
      clearInterTimer();
      //每隔30s向后台发送消息
      wsInterTimer = setInterval( () => {
        ws.send(JSON.stringify({timestamp: +new Date()}));
      }, 30000);
    };
    ws.onmessage = (res = {}) => {
        config.success(res);
    };
    ws.onerror = () => {
        console.log('websocket onerror');
        reconnectWs();
    };
    ws.onclose = () => {
        console.log('websocket onclose');
        reconnectWs();
    };
  }
  //重连websocket
  function reconnectWs() {
      if (!ws) {
          return;
      }
      if (wsConNumber >= 10) {
          console.error(`websocket重连第${wsConNumber}失败， 请刷新重试！`);
          close();
          return;
      }
      if (!wsTimer) {//每5s重连一次
          wsTimer = setInterval(() => {
              wsConNumber ++;
              getWebsocketRealData(config);
          }, 5000);
      }
  }
  function close() {
    closeWs();
    clearTimer();
    clearInterTimer();
    wsConNumber = 0;
  }
  function closeWs() {
    if (ws) {
        ws.close();
        ws = null;
    }
  }
  function clearTimer() {
    if (wsTimer) {
        clearInterval(wsTimer);
        wsTimer = null;
    }
  }
  function clearInterTimer() {
    if (wsInterTimer) {
        clearInterval(wsInterTimer);
        wsInterTimer = null;
    }
  }
  return close;
}