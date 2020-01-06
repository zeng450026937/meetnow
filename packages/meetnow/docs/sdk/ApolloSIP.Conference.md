# ApolloSIP.Conference

ApolloSIP.Conference实例是对某个加入的会议进行会议操作的核心，会议涉及到了媒体通道、会控通道、辅流通道，Conference将这些通道进行了一定的封装，创建conference实例需要先创建UA实例并注册成功

## Conference Instance

连接会议时至少需要以下信息

- 会议entity
- 会议focusUri

或者

- 会议number
- 会议pin

两者都设置时，优先使用entity和focusUri

```js
const conference = new ApolloSIP.Conference(ua); // ua可在创建conference实例时传入或者在加入会议之前设置，UA必须是已经注册成功的

// 直接使用会议number和会议pin加入会议较为简便
conference.number = 'number'; // 会议号码
conference.pin = 'pin';       // 会议pin码
// 或者
conference.entity = 'entity';     // 会议号码做base64加密 示例：MjAwMDA=
conference.focusUri = 'focusUri'; // 会议uri，示例：sip:20000@10.200.112.165.xip.io;opaque=app:conf:focus:id:20000 （20000为会议号码，10.200.112.165.xip.io为会议realm）
```

## Instance Attributes

### id
会议的id，加入会议时候生成，每次加入的生成的id不一致
```js
conference.id
```

### ua
加入会议前需设置的UA实例
```js
conference.ua
```

### number
加入会议的号码
```js
conference.number
```

### pin
加入会议的pin码
```js
conference.pin
```

### entity
加入会议的entity值
```js
conference.entity
```

### foucuUri
会议控制通道的Uri
```js
conference.foucuUri
```

### chatUri
会议聊天通道的Uri
```js
conference.chatUri
```

### mediaUri
会议媒体通道的Uri
```js
conference.mediaUri
```

### information
包含会议的成员信息、布局信息等会议数据的实例，详见information里的接口说明
```js
conference.information
```

### lobby
会议大厅的实例，包含大厅的控制接口，详见lobby里的接口说明
```js
conference.lobby
```

### rtmp
rtmp直播的实例，包含rtmp的控制接口，详见rtmp里的接口说明
```js
conference.rtmp
```

### record
录播的实例，包含录播的控制接口，详见record里的接口说明
```js
conference.record
```

### rollcall
点名操作的实例，包含点名操作的控制接口，详见rollcall里的接口说明
```js
conference.rollcall
```

### description
会议的描述信息，实际为information的属性，详见information里的接口说明
```js
conference.description
```

### state
会议的状态信息，实际为information的属性，详见information里的接口说明
```js
conference.state
// 等价于
conference.information.state
```

### view
会议的布局信息，实际为information的属性，详见information里的接口说明
```js
conference.view
// 等价于
conference.information.view
```

### users
会议的用户信息，实际为information的属性，详见information里的接口说明
```js
conference.users
// 等价于
conference.information.users
```

### rtmpUsers
会议的rtmp直播用户信息，实际为information的属性，详见information里的接口说明
```js
conference.rtmpUsers
// 等价于
conference.information.rtmpUsers
```

### recordUsers
会议的录播用户的信息，实际为information的属性，详见information里的接口说明
```js
conference.recordUsers
// 等价于
conference.information.recordUsers
```

### guests
会议的访客列表，历史参会成员，实际为information的属性，详见information里的接口说明
```js
conference.guests
// 等价于
conference.information.guests
```

### invitees
会议的邀请成员列表，还未入会的成员，实际为information的属性，详见information里的接口说明
```js
conference.invitees
// 等价于
conference.information.invitees
```

### relaties
会议的关联成员列表，实际为information的属性，详见information里的接口说明
```js
conference.relaties
// 等价于
conference.information.relaties
```

### privateData
会议的私有信息，实际为information的属性，详见information里的接口说明
```js
conference.privateData
// 等价于
conference.information.privateData
```

### error
会议最后一次出现错误时候的错误信息
```js
conference.error
```

### focusChannel
会议的控制通道,参考Channel的说明
```js
conference.focusChannel
```

### mediaChannel
会议的媒体通道,参考Channel的说明
```js
conference.mediaChannel
```

### shareChannel
会议的辅流通道,参考Channel的说明
```js
conference.shareChannel
```

### chatChannel
会议的聊天通道,参考Channel的说明
```js
conference.chatChannel
```

### media
加入的媒体信息,加入会议前需设置，实际也是设置mediaChannel的媒体
```js
  // 示例1
  // localMedia为通过Web接口mediaDevices.getUserMedia()获取到的音视频流
  // 电脑可能有多个音视频设备，通常需要获取出设备列表，选择指定的设备获取音视频流
  conference.media.constraints = localMedia.constraints;
  conference.media.stream = localMedia.stream;

  // 示例2
  // 若加入会议只接收音视频数据或者无音视频设备
  conference.media.constraints = {
            audio : false,
            video : false
          };
  conference.media.stream = null;

  // 示例3
  // 如果不指定设备，但音视频均置为true时，则会默认获取电脑当前默认的音视频设备
  // 注意由SDK获取默认视频流时需保证设置为true时有对应的设备，否则会导致出错。
  conference.media.constraints = {
            audio : true,
            video : true
          };
```

## Instance Methods ##

### dialIn()
* 加入会议并连接控制通道，带有媒体信息，即会带有连接媒体通道和辅流通道，调用前需设置好要加入的会议信息，加入结果以事件通知为准
```js
conference.dialIn();

// 会议监视与正常加入会议的流程一样，但需要在调用dialIn接口传入参数
// 传true为加入会议监视，false或不传为普通加入会议
// 注意：会议监视时则通道的媒体不需要设置，仅设置为接收音视频即可
conference.dialIn(true);
```

### connect()
* 连接会议控制通道,创建会议实例后调用connect()只连接会议的控制通道，只作为单纯会议控制使用，如果涉及音频需要使用dialIn()接口连接会议

```js
conference.connect(); // 连接focusChannel通道
```

### disconnect()
* 断开会议,需要离开会议时可调用，内部会断开所有通道，退出会议必须调用，否则服务无法知道当前用户已经退出。

```js
conference.disconnect();
```

### connectChat()
* 连接聊天的channel，聊天的channel由外部决定是否需要连接，如果加入会议成功后conference.chatUri不为空，说明服务器支持聊天功能，可调用此接口连接聊天通道

```js
conference.connectChat();
```

### sendMessage()
* 发送聊天消息

```js
const msg = 'send message';     // 发送的消息内容
const users = [ 'userEntity' ]; // userEntity为用户的entity，目前user支持指定1个人，没有user代表发送给全体成员

conference.sendMessage(meg, users)
  .then((res) => {
    //
    /*
    res为返回结果，发送消息需自己记录处理
    {
      "conferenceKeys": {
          "@confEntity": "MjAwMDA="
      }, 
      "message-info": {
          "message-id": 9,  // 消息id，为服务器记录的值
          "message-timestamp": 1576552477268608 // 消息时间，以服务时间为准
    }
}
    */

  })
  .catch(() => {})
```

### deleteConference()
* 结束当前会议
```js

//所有参会成员退出会议，如果会议还未到结束时间，则会议仍会存在，可重新再加入，如果会议已经超过结束时间，则会议正常结束，无法再加入。
conference.deleteConference()
  .then(() => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  })
```

## Events ##

### connecting ###
* 连接会议时触发：
```js
conference.on('connecting', () => {
  // your code
});
```

### connected ###
* 会议连接成功后触发：
```js
conference.on('connected', () => {
  // your code
});
```

### disconnected ###
* 会议断开（主动或被动）连接触发：
```js
conference.on('disconnected', (data) => {
  // your code
  // 断开后会议无法再进行操作
});
```

### connectFailed ###
* 会议连接失败时候触发：
```js
conference.on('connectFailed', (data) => {
  // your code
  // 连接失败时，会议无法进行操作
});
```
data字段：
- cause：连接失败的原因

### subscribe ###
* 订阅事件,修改设置订阅的内容
```js
const INFORMATION_TYPE = {
  INFO       : 'application/conference-info+xml',                 // 会议信息
  CASTVIEWER : 'application/conference-info-castviewer+xml',      // 广播成员,非主持人入会请勿订阅广播方信息
  HISTORY    : 'application/conference-users-history+xml',        // 历史入会成员
  RELATE     : 'application/conference-users-relate+xml',         // 所有会议相关成员
  WAITING    : 'application/conference-invitees-waiting-for+xml', // 未入会成员
  ANSWER     : 'application/conference-answer-info+xml'           // 答题会议通过
};

// 加入前设置好监听
conference.on('subscribe', (sub_info) =>
{
  sub_info.contentType = [ INFORMATION_TYPE.INFO ]; // 可指定订阅的类型，这里不修改会议控制默认订阅所有类型,通常只做会议控制的话默认订阅所有类型，若带有音视频则指订阅INFO信息，可减少无用数据的传输
});
```

### informationUpdated ###
* 会议信息更新事件，连接会议成功后，
* 会议信息有变化时，下发信息更新时触发

```js
conference.on('informationUpdated', (information) => {
  // information带有会议的更新消息，可以从中获取更新的信息
  // 也可收到会议信息更新事件后，直接从conference的属性information中获取更新的会议信息
  // 详见information里的接口说明
});
```

### usersUpdated ###
* 用户更新事件，当会议中的成员信息更新、或加入、或退出会议时会收到此事件

```js
conference.on('usersUpdated', (users) => {
  // users为当前最新的所有会议成员信息，users等价于conference.users
  // 详见information里的接口说明
});
```

### userUpdated ###
* 某一个成员状态信息变化的时候，会收到此事件

```js
conference.on('userUpdated', (user) => {
  // user为某一个会议成员更新的信息
  // 详见information里的接口说明
});
```

### userAdded ###
* 新的成员加入会议的时候，会收到此事件

```js
conference.on('userAdded', (user) => {
  // user为某一个新加入的成员信息
  // 详见information里的接口说明
});
```

### userDeleted ###
* 成员离开会议的时候，会收到此事件

```js
conference.on('userDeleted', (user) => {
  // user为某一个离开会议的成员信息
  // 详见information里的接口说明
});
```

### messageUpdated ###
* 聊天消息接收

```js
conference.on('messageUpdated', (msg) => {
  /*
  msg为收到的消息，自己发出的消息不会触发messageUpdated事件
  {
    "@is-private": false, // 是否为私聊
    "user": {             // 发送消息的用户信息
        "@entity": "b2f1bced1b783d1e404c60c0dfdf8dbf", 
        "@display-text": "我是测试账号不要问我是谁", 
        "uid": "d2641f06895142df814897535cc90b0e"
    }, 
    "message-id": 5,      // 消息id
    "message-timestamp": 1576552139788606, // 消息时间
    "msg": 'test\n'  // 消息内容
  }
  */
});
```

### addUserResultUpdated ###
* 批量邀请结果事件，使用批量邀请接口时，每个被邀请的用户邀请结果会通过此事件上报，每次事件包含1个用户邀请结果，通过与邀请的成员列表比对，来最终得知邀请结果。

```js
conference.on('addUserResultUpdated', (data) => {
  // data返回某个被邀请成员的邀请结果
  /*
  邀请成功
  data = {
    'conferenceKeys' : {
      '@confEntity' : 'MjAwMDA='
    },
    'user' : {
      '@requestUri': 'sip:10.81.45.1',  // 返回邀请成员的uri或uid
      'uid' : '1qicn3asd3das44asdu8v'
    }
  };

  邀请失败
  data = {
    'conferenceKeys' : {
      '@confEntity' : 'MjAwMDA='
    },
    'user' : {
      '@requestUri': 'sip:10.81.45.1',  // 返回邀请成员的uri或uid
      'uid' : '1qicn3asd3das44asdu8v'
    },
    'reason' : {                  // 邀请失败返回的data带有reason
      '@cause': 40004             // 错误码
      '@protocol': 'APOLLO'
      '@text': 'Force reject by peer'
    }
  };
  */
});
```

其他信息更新事件还有:
'descriptionUpdated',
'stateUpdated',
'privateDataUpdated'，
'viewUpdated',
'rtmpUsersUpdated',
'recordUsersUpdated',

以上事件和用户更新通知事件类似，通过这些事件，当会议对应的信息发生变化时，可以得到更新的通知以及相关的更新信息。
