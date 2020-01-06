# conference.lobby
成功加入会议后，conference实例的lobby主要用来进行会议大厅的会议控制

## Instance Attributes
```js
// conference为已连接会议的会议实例
const lobby = conference.lobby;
```

### userList
```js
// 会议大厅的等待用户列表
const userList = lobby.userList;
```

### admissionPolicy
```js
// 根据权限判断当前会议是否锁定，有以下三个值closedAuthenticated表示主持人和邀请的用户; openAuthenticated表示与组织者同一个域或者联盟内的用户; anonymous表示任何人都可以加入会议(非此值这会议处于锁定状态，部分成员无法直接入会)
const admissionPolicy = lobby.admissionPolicy;
```

### attendeeLobbyBypass
```js
// false为进入会议需要进入大厅等待，true不用进入大厅等待
const attendeeLobbyBypass = lobby.attendeeLobbyBypass;
```

### autopromote
```js
// 表示哪些人加入之后可以成为主持人,这个是一个整型值，有三种情况 None:0，由组织者安排主持人; Everyone:所有人2147483648，默认值，转为二级制即0x80000000(bit 31); Company:(同一个域或者联盟内的) 32768转为二进制即0x00008000(bit 15)
const autopromote = lobby.autopromote
```

## Instance Methods

### getUser()
* 获取当前会议大厅里某个用户是否存在

```js
const entity = 'lobbyUser entity'; //可传用户的entity或者用户的uid

const user = conference.lobby.getUser(entity);
```

### hasUser()
* 判断指定的用户是否在会议大厅内

```js
const entity = 'lobbyUser entity'; //可传用户的entity或者用户的uid

const user = conference.lobby.hasUser(entity);
```

### apply()
* 设置会议大厅参数
```js
const lobby = conference.lobby;

const options = {
  locked : false                // 组织者锁，暂时未启用
  admissionPolicy: 'anonymous', // 参照属性说明
  attendeeLobbyBypass: true,    // 参照属性说明
  autopromote: 0                // 参照属性说明
};

// 修改会议大厅设置
lobby.apply(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### hold()
* 将会议中的成员移到会议大厅
```js
const lobby = conference.lobby;

const entity = [ 'user entity' ]; // 会议成员的entity

// 将成员挪到大厅,参数为空则默认把所有会议中成员(有权限控制的成员)移动到会议大厅
lobby.hold(entity)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### unhold()
* 将会议大厅中的成员加入到会议中
```js
const lobby = conference.lobby;

const entity = [ 'user entity' ]; // 会议成员的entity

// 将成员挪到大厅,参数为空则默认把所有会议大厅中的成员(有权限控制的成员)移动到会议
lobby.unhold(entity)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### kick()
* 将会议大厅中的成员移出会议大厅
```js
const lobby = conference.lobby;

const entity = [ 'user entity' ]; // 会议成员的entity

// 将成员挪到会议中,不指定entity则默认所有大厅中成员
lobby.kick(entity)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```
