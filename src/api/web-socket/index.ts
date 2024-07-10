class WebSocket implements WebSocket.interface {
  public options;
  //@ts-ignore
  public socketTask;
  //@ts-ignore
  public header;
  public isOpened = false;
  public isConnected = false;
  public get isSendMessage() {
    return this.isConnected && this.isOpened && !this.isSendLoading;
  }
  public isSendLoading = false;
  constructor(options: UniApp.ConnectSocketOption) {
    this.options = options;
  }
  onOpen?: (res: UniApp.OnSocketOpenCallbackResult) => void;
  onError?: (res: UniApp.GeneralCallbackResult) => void;
  onMessage?: (res: UniApp.OnSocketMessageCallbackResult<any>) => void;
  onClose?: (res: UniApp.OnSocketCloseOptions) => void;
  connect() {
    return new Promise((resolve, reject) => {
      this.socketTask = uni.connectSocket({
        ...this.options,
        success: () => {
          console.log("WebSocket连接成功");
          resolve(this);
          this.isConnected = true;
          console.log("this.isConnected: ", this.isConnected);
        },
        fail: (err) => {
          console.error("WebSocket连接失败", err);
          reject(this);
          this.isConnected = false;
        },
        complete: () => {},
      });
      uni.onSocketOpen((res) => {
        console.log("WebSocket连接已打开！");
        this.header = res;
        this.isOpened = true;
        if (typeof this.onOpen === "function") {
          this.onOpen(res);
        }
      });
      uni.onSocketError((error) => {
        console.log("onSocketError: ", this);
        console.log("onSocketError", error);
        this.isConnected = this.isOpened = false;
        if (typeof this.onError === "function") {
          this.onError(error);
        }
      });
      // uni.onSocketMessage((res) => {
      //   console.log("收到服务器内容：" + res);
      //   if (typeof this.onMessage === "function") {
      //     this.onMessage(res);
      //   }
      // });
    });
  }
  send(data: any) {
    return new Promise(async (resolve, reject) => {
      data.prompt = data.prompt.trim();
      if (data && data.prompt) {
        console.log("this: ", this);
        if (this.isSendMessage) {
          this.isSendLoading = true;
          uni.sendSocketMessage({
            data: JSON.stringify(data),
            success: () => {
              resolve(true);
            },
            reject: () => {
              reject(false);
            },
            complete: () => {
              this.isSendLoading = false;
            },
          });
        } else if (!this.isConnected) {
          uni.showToast({
            title: "web socket尚未链接.",
            icon: "none",
          });
          reject(false);
        } else if (!this.isOpened) {
          uni.showToast({
            title: "web socket尚未打开.",
            icon: "none",
          });
          reject(false);
        } else if (!this.isSendLoading) {
          uni.showToast({
            title: "发送中...",
            icon: "none",
          });
          reject(false);
        }
      } else {
        uni.showToast({
          title: "不能发送空白消息",
          icon: "none",
          duration: 2000,
        });
        return;
      }
    });
  }
  close(option?: any) {
    uni.closeSocket(option);
  }
}

export default WebSocket;
