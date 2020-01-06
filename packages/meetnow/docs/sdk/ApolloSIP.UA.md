# ApolloSIP.UA #

UA(User Agent)为ApolloSIP的核心，创建UA实例后用来注册SIP账号到服务器，后续加入会议、会议操作都需要在用户创建UA注册到服务器之后才能进行。

## UA Instance ##

* UA实例创建
```js
const phone = 'bob';
const realm = 'example';
const password = 'superpassword';
const ha1 = 'superha1';

const configuration = {
  user_agent: 'Yealink SIP-WEB 1.0.0',   // 前缀不可改变，空格不可省略，后面版本号可自己修改，可未Yealink SIP-WEB 1.4.1 (Chrome 79.0)，括号里内容可自行定制
  client_info: 'Apollo_WebRTC 1.0.0',    // 前缀不可改变，空格不可省略，后面版本号可自己修改，通常默认此值即可
  uri           : `${phone}@${realm}`,   // 账号的uri，phone为账号，realm为服务器配置的主域名
  password      : password,              // 账号的密码 ，传入密码就不需传入ha1
  ha1           : ha1,                   // 账号的A1Hash值，需从服务端获取
  realm         : realm,                 // 可以不传，认证时用uri中的realm
  servers       : 'wss://server/',   // 服务器地址 如果使用websocket服务器地址为wss://server/meeting/join/ ，使用socketio为wss://server/
  socketOptions : {
    type               : 'socketio',    // 连接方式 'websocket'或'socketio'，默认推荐使用socketio
    rejectUnauthorized : false,
    protocol           : 'sip'
  }
};

const ua = new ApolloSIP.UA(configuration);
```

## Instance Methods

### start()
* 创建UA实例后，需调用start接口进行UA注册操作
```js
  ua.start();
```

### stop()
* UA不再使用,注销UA，需注销UA释放相关的资源
```js
  ua.stop();
```

### register()
* 手动注册UA账号借口，调用ua.start()会自动调用此接口,用于设置新的账号后手动重新注册，若UA已经注册需要调用unregister()先注销。若UA账号需更换时，推荐直接使用stop()后再执行start()
```js
  ua.register();
```

### unregister()
* 注销账号接口，用于手动注销当前UA注册的账号
```
  ua.unregister();
```

### isConnected()
* 获取UA是否连接上服务器
```js
  const status = ua.isConnected();  // true为已连接，false为未连接
```

### isRegistered()
* 获取UA是否注册导服务器
```js
  ua.isRegistered(); // true未已注册，false为未注册
```

### subscribeApolloService()
* apolloProvision和apolloControl订阅接口，若需要重新订阅需调用此接口,默认ua.start()时会执行此接口进行订阅操作
```js
  ua.subscribeApolloService();
```

### set(parameter, value)
* 允许运行时可设置参数(正常情況不需要用到)

| parameter |
| ---- | 
| password |
| realm |
| ha1 |
| display_name |
| language |
| bundlePolicy |
| iceServers |
| iceTransportPolicy |
| iceCandidatePoolSize |
| rtcpMuxPolicy |
| DtlsSrtpKeyAgreement |
| googIPv6 |
| offerToReceiveAudio |
| offerToReceiveVideo |
| conferenceFactoryUri |
| webresourceUri |
| capabilities |
| negotiateUrl |
| phonebookUrl |
| autopUrl |
| permission |
| endpointConfig |
| serverConfig |
| anonymous |
```js
  ua.set(parameter, value);
```

### get(parameter)
* 设置参数
 
| parameter | 
| ---- | 
| realm |
| ha1 |
| display_name |
| language |
| bundlePolicy |
| iceServers |
| iceTransportPolicy |
| iceCandidatePoolSize |
| rtcpMuxPolicy |
| DtlsSrtpKeyAgreement |
| googIPv6 |
| offerToReceiveAudio |
| offerToReceiveVideo |
| conferenceFactoryUri |
| webresourceUri |
| capabilities |
| negotiateUrl |
| phonebookUrl |
| autopUrl |
| permission |
| endpointConfig |
| serverConfig |
| anonymous |
| uri | 
```js
  ua.get(parameter);
```

## Events ##

### connected
```js
  ua.on('connected', (data) => {
    // 连接服务器成功时触发
    // Your Code
  });
```
data字段:
* socket ： 连接的socket实例；

### connecting
```js
ua.on('connecting', (data) => {
  // 连接服务器中时触发
  // Your Code
});
```
data字段：
* socket：正在连接的socket实例； 

### disconnected
```js
  ua.on('disconnected', (data) => {
    // 连接服务器失败时触发
    // Your Code
  });
```
data字段：
* socket： socket实例；
* error ： 是否由于错误而断开；
* code ： 断开代码；
* reason ： 断开原因 

### registered
```js
  ua.on('registered', (data) => {
    // 连接并注册成功时触发
    // Your Code
  });
```
data字段：
* response：收到的响应实例

### unregistered ###
```js
ua.on('unregistered', (data) => {
  // 注销账号成功时触发
  // Your Code
});
```
data字段：
* response：收到的响应实例
* cause： 取消的原因

### registrationFailed ###
```js
  ua.on('registrationFailed', (data) => {
    // 注册失败时触发
    // Your Code
  });
```
data字段：
* response：收到的响应实例
* cause： 注册失败的原因

### conferenceFactoryUriUpdated
```js
  ua.on('conferenceFactoryUriUpdated', (data) => {
    // 会议服务器的URI信息更新
    // Your Code
  });
```
### iceServersUpdated
```js
  ua.on('iceServersUpdated', (data) => {
    // 服务器的穿透服务器更新，通常在注册成功后会收到此更新
    // 注：会议监视与会议都应确保在注册成功收到穿透服务地址更新在加入会议，防止外网的环境下无法正常加入会议
    // Your Code
  });
```
