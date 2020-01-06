# conference.rollcall
成功加入会议后，conference实例的rollcall主要用来进行点名的会议控制

## Instance Attributes
```js
// conference为已连接会议的会议实例
const rollcall = conference.rollcall;
```

## Instance Methods

### getStatus()
* 获取点名状态，点名名单等点名相关的参数
```js
conference.rollcall.getStatus()
 .then((result) =>
 {
   const rollCall = result['roll-call'];
   /*
   rollCall 结构如下
   {
     'type': 'automatic', // 点名方式：自动点名automatic(默认)、手动点名manual
     'status': 'ready',   // 点名状态 完成finish 正在点名pending、准备状态(没有
点名)ready 已暂停(on-hold)
     'interval': 5,       // 自动点名间隔
     'start-time': '',    // 点名开始时间，有开启点名才会有
     'end-time': '',      // 点名结束时间
     'roll-call-list': {  // 点名的名单
       'user': [
         {
           '@entity': ''       // 点名用户的entity
           'uid': ''           // 点名用户的uid
           'display-text': '', // 用户显示名字
           'status': '',       // 点名状态缺席absence、在场attendant、待定(即未点名)unknown 点名的状态要在点名过程中实时获取，点名结束后，用户的点名状态会被置为unknown
           'when': ''          // 如果被点过名了，对应的点名时间
         }
       ]
     }
   }
   */
 })
 .catch((e) => {
   // Your Code
 });
```

### getRecord()
* 获取点名结果记录

```js

const params = {
  'conferenceRecordId': 'xxx' // 会议RecordId
  'enterpriseId' : 'xxx'      // 企业Id
};

conference.rollcall.getRecord(params)
 .then((result) => {
  // Your Code
  /*
  // 数据参考：点名结果保存会议过程中每次点名的结果
    {
      "createTime": 1531985721262, // 创建时间
      "modifyTime": 1531985721262, // 修改时间
      "deleted": false,
      "_id": "8d87433f27654d79bded0702648f8e08",                // 点名结果id
      "conferenceRecordId": "d4e35cfc016c4c95924c2a41861b7f5e", // 会议的recordid
      "rollCallResults": [
        {
          "uid": "2c06ca064c5e45128c151b091f11c5c2",        // 用户uid
          "userName": "9001",                               // 用户名
          "userEntity": "2c06ca064c5e45128c151b091f11c5c2", // 用户entity
          "status": "Absent",                               // 点名结果
          "callDate": 1531985706000,                        // 点名时间
          "name": "10001"                                   // 用户名称
        }
      ],
      "rollCallType": null,
      "frequency": null,
      "enterpriseId": "f4a4a4ee02ac4bb8875bbd08e03d4de0",
      "id": "8d87433f27654d79bded0702648f8e08"
    }
  */
 })
 .catch((e) => {
   // Your Code
 });
```

### apply()
* 设置点名名单

```js
const users = [           // 一次可设置多个点名成员
  {
    '@entity' : 'entity', // 用户entity（已入会的都有）
    'uid'    : 'uid'      // 用户uid（第三方设备没有不需要填）
  }
];

conference.rollcall.apply(users)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### start() 
* 开始点名

```js
const options = {
  type : 'automatic',       // 点名方式自动点名automatic(默认)、手动点名manual
  interval: 5,              // 点名间隔 1-3600
  user : [                  // 手动点名暂时只支持1次点名1个人
    {
      '@entity' : 'xxxxxx', // 用户entity（已入会的都有）
      'uid'     : 'xxxxxx'  // 用户uid，成员有uid就带上，没有的话就不需要携带
    }
  ]
};

// 如果 type 是 automatic，则无需 user 参数
// 如果 type 是 manul， 则 user 是必选参数
// 如果没有options，则默认自动点名（type: automatic）
conference.rollcall.start(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### pause()
* 暂停点名

```js
conference.rollcall.pause()
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### resume()
* 继续点名

```js
conference.rollcall.resume()
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### stop()
* 结束点名

```js
conference.rollcall.stop()
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### reset()
* 重置点名

```js
conference.rollcall.reset()
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### modify() 
* 手动修改点名

```js
const options = {
  user : [
    {
      '@entity' : 'xxxxxx',    // 用户entity（已入会的都有）
      'uid'     : 'xxxxxx',    // 用户uid
      'status'  : 'attendant'  // 新的状态:缺席absence、在场attendant、待定(即未点名)unknown
    }
  ]
};

conference.rollcall.modify(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```
