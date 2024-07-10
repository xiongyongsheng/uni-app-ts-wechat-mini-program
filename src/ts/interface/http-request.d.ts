declare namespace CHttpRequest {
  interface instance {
    options: UniApp.RequestOptions;
    create: Function;
  }
  interface instanceInterceptors {
    request: {
      successTasks: Array<Function>;
      failTasks: Array<Function>;
      dispatch: (
        type: "success" | "fail",
        config: UniApp.RequestOptions
      ) => void;
      use: (
        successTask: (config: UniApp.RequestOptions) => void,
        failTask?: (config: UniApp.RequestOptions) => void
      ) => void;
    };
    response: {
      successTasks: Array<Function>;
      failTasks: Array<Function>;
      dispatch: (
        type: "success" | "fail",
        config:
          | UniApp.RequestSuccessCallbackResult
          | UniApp.GeneralCallbackResult
      ) => Promise<CHttpRequest.response>;
      use: (
        successTask: (config: UniApp.RequestSuccessCallbackResult) => void,
        failTask?: (config: UniApp.GeneralCallbackResult) => void
      ) => void;
    };
  }
  interface response {
    data: {
      [key: string]: unknown;
    };
    msg: string;
    status: number;
    success: boolean;
    time: string;
    total: string | number | null;
    totalPage: string | number | null;
  }
}
