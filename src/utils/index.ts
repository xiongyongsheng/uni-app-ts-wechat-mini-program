export const checkIsVideo = (url: string) => {
  return url.endsWith(".mp4");
};

/**
 * 预览图像函数
 * @param {Object} 参数对象
 * @param {number} [参数对象.index] - 要预览的图像索引，默认为 undefined
 * @param {string} [参数对象.url] - 要预览的图像 URL，默认为 undefined
 * @param {string[]} 参数对象.images - 一个字符串数组，包含要预览的图像 URL
 * @example
 * // 使用索引预览图像
 * preViewImage({ index: 0, images: ['img1', 'img2'] });
 * // 使用 URL 预览图像
 * preViewImage({ url: 'img1', images: ['img1', 'img2'] });
 */
export const preViewImage = ({
  index,
  url,
  images,
}: {
  index?: number;
  url?: string;
  images: string[];
}) => {
  /**
   * 过滤掉数组中的视频项，只留下图像 URL
   * @param {string} item - 数组中的每个项
   * @returns {boolean} - 如果项不是视频则返回 true，否则返回 false
   */
  images = images.filter((item) => !checkIsVideo(item));

  /**
   * 设置当前预览图像的索引
   * 如果传入的索引值有效（大于等于 0），则设置当前索引为传入值，否则默认为 0
   * 如果传入了 URL，则通过索引找到对应的图像 URL 在数组中的位置作为当前索引
   */
  let current = 0;
  if ((index ?? -1) >= 0) {
    current = index ?? 0;
  } else if (url) {
    current = images.indexOf(url);
  }

  /**
   * 调用 uni.previewImage 方法预览图像
   * @param {number} current - 预览的当前索引
   * @param {string[]} urls - 要预览的图像 URL 数组
   */
  return uni.previewImage({
    current,
    urls: images,
  });
};

export const setClipboardData = (content: string) => {
  uni.vibrateShort();
  return uni.setClipboardData({
    data: content,
  });
};

type paramsObject = {
  [key: string]: string | number;
};
/**
 * 处理参数字符串或对象，将其转换为对象或字符串
 * 如果传入的是字符串，将其解析为键值对对象
 * 如果传入的是对象，将其转换为查询字符串格式的字符串
 *
 * @param params 要处理的参数字符串或对象
 * @return 处理后的参数，对象或字符串
 */
export const handleParams = (params: string | paramsObject) => {
  if (typeof params === "string") {
    const obj: paramsObject = {};
    const arr = params.split("&");
    arr.forEach((item) => {
      const [key, value] = item.split("=");
      obj[key] = value;
    });
    return obj;
  } else {
    const arr = [];
    for (let key in params) {
      arr.push(`${key}=${params[key]}`);
    }
    return arr.join("&");
  }
};
/**
 * 一个超时滚动到页面底部的异步操作函数
 * 在指定的超时时间后，尝试滚动当前页面到底部，并返回一个 Promise 判断是否成功
 * 如果在超时时间内页面路径发生了变化，则 Promise 解析为 false，表示滚动操作失败或被取消
 *
 * @param timeout - 等待页面滚动到底部的超时时间，默认为 1000 毫秒
 * @return 一个 Promise，当在超时时间内滚动到底部成功则解析为 true，否则解析为 false
 */
export const timeoutScrollToBottom: (timeout?: number) => Promise<boolean> = (
  timeout = 1000
) => {
  const currentPages = getCurrentPages();
  const currentPagePath = currentPages[currentPages.length - 1].route;
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentPages = getCurrentPages();
      // 如果当前页面路径与开始时相同，尝试滚动到底部
      if (currentPagePath === currentPages[currentPages.length - 1].route) {
        const duration = 300;
        uni.pageScrollTo({
          scrollTop: 999999,
          duration,
          success() {
            // 滚动到底部成功后，延迟 duration 时间后解决 Promise，表示操作成功
            setTimeout(() => {
              resolve(true);
            }, duration);
          },
        });
      } else {
        // 在超时时间内页面路径发生变化，直接解决 Promise 为 false，表示操作失败
        resolve(false);
      }
    }, timeout);
  });
};
