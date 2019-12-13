class UserInfo {
  constructor(options = {}) {
    this.setUserInfo(options);
  }

  get number() {
    return this.longNumber.split('.')[1] || '';
  }

  setUserInfo(userInfo = {}) {
    this.password = userInfo.password || '';
    this.longNumber = userInfo.longNumber || '';
    this.displayText = userInfo.displayText || '';
  }

  setUserId(id) {
    this.userId = id;
  }
}

export default UserInfo;
