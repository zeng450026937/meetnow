# ApolloSIP.ConferenceManager #

ConferenceManager为提供会议管理的功能，提供部分会议内容查询的功能接口

## ConferenceManager Instance ##

```js
const conferenceManager = new ApolloSIP.conferenceManager();

conferenceManager.ua = ua; // ua为已经注册上的UA实例，创建完conferenceManager后必须设置，否则无法调用接口
```

## Instance Attributes

### ua
使用的User Agent实例
```js
conferenceManager.ua
```

### factoryUri
会议服务器地址
```js
conferenceManager.factoryUri
```

## Instance Methods

### createConference()
* 创建一个即时会议

```js
const info = {
  'conference-description' : {
    'subject' : 'Conference',   // 创建会议的主题名称
  }
};

// info参数为空，则生成的会议主题名称由服务默认生成
conferenceManager.createConference(info)
  .then((res) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### queryConferenceByNumber()

* 查询指定会议号码的会议信息

```js

// 查询时候需要UA收到conferenceFactoryUriUpdated事件后才能请
const number = 'conference number'; // 会议号码 必须携带

conferenceManager.queryConferenceByNumber(number)
  .then((res) => {
    // res['conference-info'] 带有查询的会议的信息
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });

```

### queryGlobalConference()

* 查询指定用户的可控会议列表

```js
// 查询时候需要UA收到conferenceFactoryUriUpdated事件后才能请
const uid = 'user uid'; // 用户的uid 必须携带

conferenceManager.queryConference(uid)
  .then((result) => {
    // result['conference-info'] 携带该用户可以控制会议信息，如果有可控会议的话
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### endConference()

* 删除结束会议

```js
const params = {
  number   : conference.number,               // 删除结束的会议号码
  recordId : conference.information.recordId  // 该会议的recordId，获取到可控会议列表后通过queryConferenceByNumber可以获取到每个会议的信息，里面带有recordId信息
};

conferenceManager.endConference(params)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### getFederationInfo()

* 获取联盟会议的信息

```js
const params = {
  number   : 'xxx', // 联盟会议号码
  domain : 'xxxx'   // 联盟服务器的域
};

conferenceManager.getFederationInfo(params)
  .then((result) => {
    // Your Code
    // result.applicationsharer => 辅流分享者
    // result.users => 信息结构等同于会议中的user信息
  })
  .catch((e) => {
    // Your Code
  });
```

### getFederationStatistics()

* 获取联盟会议成员的通话统计信息

```js
const params = {
  number   : 'xxx', // 联盟会议号码
  domain : 'xxxx'   // 联盟服务器的域
  entity : 'xxxx'   // 成员的entity
};

conferenceManager.getFederationStatistics(params)
  .then((result) => {
    // media为数组带有音视频或辅流的通话统计信息
    let audio = result.user.media;
    let video = result.user.media;
    let sharing = result.user.media;

    // 统计信息的收发参数 audio.send/audio.recv
    audio = {
      'ip',
      'codec', // 编码
      'sample-rate', // 采样率
      'bandwidth', // 带宽
      'bitrate', // 实际码率
      'lossrate', // 丢包率
      'packetlost', // 丢包数
      'jitter', // 抖动
      'rtt' // 环回延时
    };
    video = sharing = {
      'ip',
      'codec', // 编码
      'width', // 宽
      'height', // 高
      'fr', // 帧率
      'evtbr', // 估计带宽
      'bitrate', // 实际码率
      'lossrate', // 丢包率
      'packetlost', // 丢包数
      'jitter', // 抖动
      'rtt' // 环回延时
    };
  })
  .catch((e) => {
    // Your Code
  });
```

### getSubordinates()

* 获取联盟节点信息

```js
conferenceManager.getSubordinates()
  .then((result) => {
    /*
    {
      "ret": 2,
      "data": [
          {
              "_id": "5ed78c01ba914d0b909dfe1a33dd82db",
              "parentId": null,
              "path": "5ed78c01ba914d0b909dfe1a33dd82db",
              "index": 0,
              "domain": "10.200.112.171.xip.io",  // 域名
              "name": "YMS_171",                  // 服务器名称
              "namePinyin": "YMS_171",
              "namePinyinAlia": "YMS_171",
              "subAccount": {                     // 子账号用于登录下级系统
                  "principle": "fffd1313d96349b1baa5949f05a97fab",
                  "credential": "+dPCgi9KwY6qjJMq1DlCTwnNthOG2WytlPx0uvWf75n8HPewg9cic4O6Nhh42Gua",
                  "type": "meetingServer"
              },
              "via": null,
              "webService": {
                  "networkType": "intranet",
                  "url": "https://10.200.112.171:443" // 下级服务器地址
              }
          },
          {
              "_id": "da2e0d901b6a4ef2b48ac9e12c6e0b95",
              "parentId": "5ed78c01ba914d0b909dfe1a33dd82db",
              "path": "5ed78c01ba914d0b909dfe1a33dd82db:da2e0d901b6a4ef2b48ac9e12c6e0b95",
              "index": 10000,
              "domain": "10.200.112.102.xip.io",
              "name": "YMS_102集群",
              "namePinyin": "YMS_102jiqun",
              "namePinyinAlia": "YMS_102jq",
              "subAccount": {
                  "principle": "6121ed684cf94eeca9135f19fd8f8da5",
                  "credential": "4QGFJ4lXkARNbWw18Ha9d5Z5CvPTRl3gYeHuX1jSVjz8HPewg9cic4O6Nhh42Gua",
                  "type": "meetingServer"
              },
              "via": null,
              "webService": {
                  "networkType": "intranet",
                  "url": "https://10.200.112.102:443"
              }
          }
      ],
      "error": null
    }
    */
  })
  .catch((e) => {
    // Your Code
  });
```

## Events
