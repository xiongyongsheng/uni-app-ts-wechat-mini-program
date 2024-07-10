import HttpRequest from "./index";
import { useUserStore } from "@/stores/user";
/**
 * ApiRequest 类，继承自 HttpRequest 类
 * 用于发送特定的 API 请求，并管理请求和响应的拦截器任务
 */
class ApiRequest extends HttpRequest {
  /**
   * ApiRequest 类的构造函数
   * 初始化请求选项，并使用特定的请求头信息
   * 调用 useInterceptors 方法来设置拦截器
   *
   * @param options - 请求的配置选项
   */
  constructor(
    options: UniApp.RequestOptions = { url: import.meta.env.VITE_API_URL }
  ) {
    super({
      header: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    this.useInterceptors();
  }

  /**
   * 使用请求拦截器和响应拦截器
   * 请求拦截器：检查用户信息，并在请求头中添加 token
   * 响应拦截器：根据响应状态码处理业务逻辑，包括显示错误提示和处理 token 失效问题
   */
  useInterceptors() {
    let userInfo: any;
    this.interceptors.request.use(
      /**
       * 请求拦截器 - 成功回调函数
       * 在请求发送前检查并获取用户信息
       * 如果用户信息存在，将 token 添加到请求头中
       * 最后返回配置对象，使其继续传递给下一个拦截器或发送请求
       *
       * @param config - 请求配置对象
       * @returns 请求配置对象
       */
      (config) => {
        if (!userInfo) {
          userInfo = useUserStore();
        }
        // config.header.token = userInfo.data.token;
        return config;
      },
      /**
       * 请求拦截器 - 失败回调函数
       * 当请求失败时，直接 reject 配置对象，阻止请求的发送
       *
       * @param config - 请求配置对象
       * @returns Promise 被 reject 的配置对象
       */
      (config) => {
        return Promise.reject(config);
      }
    );

    this.interceptors.response.use(
      /**
       * 响应拦截器 - 成功回调函数
       * 根据响应状态码决定处理方式
       * 当状态码为 200 时，解析数据并根据业务逻辑进行处理
       * 不同的业务状态码对应不同的操作，如显示错误提示或处理特定逻辑
       * 最后返回 Promise.resolve 或 Promise.reject，取决于业务逻辑
       *
       * @param response - 响应对象，包含状态码和数据
       * @returns Promise，解析为响应数据、错误信息或被 reject
       */
      (response) => {
        const { statusCode } = response;
        const data = response.data as { [key: string]: any };
        switch (statusCode) {
          case 200:
            // @ts-ignore
            const { status, msg, message }: { status: number } = response.data;
            let errMessage = msg || message || "请求错误.";
            switch (status) {
              case 200:
                return Promise.resolve(response.data);
              case 400:
                uni.showToast({
                  title: errMessage,
                  icon: "none",
                  duration: 3000,
                });
                return Promise.reject(response);
              default:
                uni.showToast({
                  title: errMessage,
                  icon: "none",
                  duration: 3000,
                });
                return Promise.reject(response);
            }
          case 400:
            if (data?.message) {
              uni.showToast({
                title: data.message,
                icon: "none",
                duration: 3000,
              });
            } else {
              uni.showToast({
                title: "请求错误.",
                icon: "none",
                duration: 3000,
              });
            }
            return Promise.reject(response);
          case 401:
            userInfo.logout(data.message);
            return Promise.reject(response);
          default:
            uni.showToast({
              title: "请求错误.",
              icon: "none",
              duration: 3000,
            });
            return Promise.reject(response);
        }
      },
      /**
       * 响应拦截器 - 失败回调函数
       * 当响应失败时，什么都不做，直接返回 Promise.reject，将错误信息传递给 catch 块或下一个错误处理程序
       *
       * @param error - 错误对象，包含失败信息
       * @returns Promise 被 reject 的错误对象
       */
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export default ApiRequest;
