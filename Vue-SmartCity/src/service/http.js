/**
 * @desc 基础服务请求处理
 */
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers['withCredentials'] = true;

// 创建axios实例
const serviceBase = axios.create({
  timeout: 10000 // 请求的超时时间
});

// 请求拦截器
serviceBase.interceptors.request.use(
  (config) => {
    if (config.loading) {
      console.log('loading');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let flag = true;
// 响应拦截器
serviceBase.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      return {};
    }
    const { data } = response;
    if (data && parseInt(data.code, 10) === 403 && flag) {
      flag = false;
    }
    return data;
  },
  (error) => {
    console.log('网络错误,请刷新重试!', 'error');
    return Promise.reject(error);
  }
);

function errorHandler(error) {
  if (process.env.NODE_ENV !== 'production') {
    console.info('%c [axios error]:', 'color: yellow', error);
  }
}
/**
 * @desc 封装axios的请求
 * @param url {String} 请求url
 * @param queryParams {Object} 请求参数，参数为对象
 * @param axiosParams {Object} axios的相关设置参数，如 method，loading，responseType
 */
function request(url, queryParams, axiosParams) {
  if (!url) {
    console.log('url为空', 'error');
    return;
  }
  queryParams = queryParams || {};
  axiosParams = axiosParams || {};

  // queryParams._$_ = new Date().getTime();
  // 丑陋的设置默认值
  axiosParams.method = axiosParams.method || 'GET';
  axiosParams.url = url;
  // axiosParams.responseType = axiosParams.responseType || "json";
  axiosParams.loading = axiosParams.loading || false;
  // 根据请求类型，将params设置到对应的属性中
  if (axiosParams.method.toLowerCase() === 'post') {
    if (axiosParams.type === 'form-data') {
      axiosParams.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      var result = '';
      for (let name in queryParams) {
        if (typeof queryParams[name] != 'function') {
          result += '&' + name + '=' + encodeURI(queryParams[name]);
        }
      }
      axiosParams.data = result.substring(1);
    } else {
      axiosParams.data = queryParams;
    }
  } else {
    axiosParams.params = queryParams;
  }
  return serviceBase(axiosParams).catch(errorHandler);
}

class HttpRequest {
  request = request;
}

export default HttpRequest;
