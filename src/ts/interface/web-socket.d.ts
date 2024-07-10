declare namespace WebSocket {
  interface interface {
    options: UniApp.ConnectSocketOption;
    socketTask?: UniApp.SocketTask;
    header?: UniApp.OnSocketOpenCallbackResult;
    isOpened: Boolean;
    isConnected: Boolean;
    isSendMessage: Boolean;
    isSendLoading: Boolean;
    connect: () => Promise<unknown>;
    send: (data: any) => Promise<unknown>;
  }
}
