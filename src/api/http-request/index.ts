/**
 * asyncGenerator 函数是一个异步生成器函数，它接受一个函数列表和一个结果对象
 * 它遍历函数列表，对每个函数应用结果对象，并异步生成每个函数调用的结果
 *
 * @param list - 一个函数列表，每个函数应接受一个参数并返回一个 Promise 对象
 * @param result - 一个结果对象，将作为参数传递给列表中的每个函数
 * @returns 一个异步迭代器，可以遍历每个函数应用到结果对象后的 Promise 对象
 */
async function* asyncGenerator(
  list: Function[],
  result:
    | CHttpRequest.response
    | UniApp.RequestSuccessCallbackResult
    | UniApp.GeneralCallbackResult
) {
  let i = 0;
  while (i < list.length) {
    yield await list[i](result);
    i++;
  }
}

// 定义一个HttpRequest类，实现了CHttpRequest.instance接口
class HttpRequest implements CHttpRequest.instance {
  // 拦截器属性，包含请求和响应拦截器
  public interceptors: CHttpRequest.instanceInterceptors;

  // 构造函数，初始化options和interceptors
  constructor(
    public options: UniApp.RequestOptions = {
      url: import.meta.env.VITE_API_URL,
    }
  ) {
    this.interceptors = {
      // 请求拦截器对象
      request: {
        // 请求成功时的任务列表
        successTasks: [],
        // 请求失败时的任务列表
        failTasks: [],
        /**
         * 分派请求拦截器任务
         * 根据任务类型（成功或失败）执行相应的任务列表
         * 每个任务都是一个函数，接受请求配置和任务索引作为参数
         *
         * @param type - 任务类型，"success"或"fail"
         * @param config - 请求配置对象
         */
        dispatch(type, config) {
          this[`${type}Tasks`].forEach((item: Function, index: number) => {
            if (typeof item === "function") {
              item(config, index);
            }
          });
        },
        // 使用请求拦截器，添加成功和失败时的任务函数
        use(successTask, failTask) {
          this.successTasks.push(successTask);
          if (typeof failTask === "function") {
            this.failTasks.push(failTask);
          }
        },
      },
      // 响应拦截器对象
      response: {
        // 响应成功时的任务列表
        successTasks: [],
        // 响应失败时的任务列表
        failTasks: [],
        /**
         * 分派响应拦截器任务
         * 为响应成功或失败的每个任务创建一个异步迭代器，并等待它们完成
         * 每个任务都是一个函数，接受响应结果对象作为参数
         * 完成后，返回一个 Promise，解析为最后一个任务的结果
         *
         * @param type - 任务类型，"success"或"fail"
         * @param result - 请求结果对象
         * @returns 一个 Promise，解析为最后一个任务的结果
         */
        async dispatch(type, result) {
          let response;
          for await (let item of asyncGenerator(this[`${type}Tasks`], result)) {
            // 同步执行拦截器任务
            response = item;
          }
          return Promise.resolve(response);
        },
        use(successTask, failTask) {
          // 使用响应拦截器，添加成功和失败时的任务函数
          this.successTasks.push(successTask);
          if (typeof failTask === "function") {
            this.failTasks.push(failTask);
          }
        },
      },
    };
  }

  /**
   * 创建并发送 HTTP 请求，并在请求完成时解决或拒绝 Promise
   * 如果提供了 options 对象中的 url，则将其拼接到默认 url 之后
   * requestConfig 对象是通过扩展 this.options 的属性创建的，其中包含了默认和传递的选项。
   * 任务调度使用拦截器来处理成功和失败的情况
   * 在请求过程中抛出的任何错误都会导致 Promise 被拒绝
   *
   * @param options 包含请求配置的对象
   * @returns 一个 Promise，在请求成功时解析为响应数据，否则为错误
   */
  create(options: UniApp.RequestOptions) {
    if (options.url) {
      options.url = `${this.options.url}${options.url}`;
    }

    return new Promise(
      (
        resolve: (value: CHttpRequest.response) => void,
        reject: (value: UniApp.GeneralCallbackResult) => void
      ) => {
        let requestConfig: UniApp.RequestOptions;
        try {
          requestConfig = {
            ...this.options,
            ...options,
          };
          // 分派请求拦截器任务 - 成功
          this.interceptors.request.dispatch("success", requestConfig);
          const requestTask: {
            abort: Function;
            offHeadersReceived: Function;
            onHeadersReceived: Function;
          } = uni.request({
            ...requestConfig,
            success: async (res) => {
              // 分派响应拦截器任务 - 成功
              const response = await this.interceptors.response.dispatch(
                "success",
                res
              );
              resolve(response);
            },
            fail: async (error: UniApp.GeneralCallbackResult) => {
              // 分派响应拦截器任务 - 失败
              await this.interceptors.response.dispatch("fail", error);
              reject(error);
            },
            complete: () => {},
          });
        } catch (error: any) {
          // 请求创建过程中出现错误，直接 reject
          reject(error);
        }
      }
    );
  }
}

export default HttpRequest;
