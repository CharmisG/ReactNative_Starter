import axios from 'axios';
import UrlConstants from '../constants/UrlConstants';
import ApiLogModel from '../models/ApiLogModel';
import ApiResponse from '../models/ApiResponseModel';

const showLogs = false;

export async function getData(url: string, authToken: string) {
  let axiosInstance = axios.create({
    baseURL: UrlConstants.baseUrl,
  });
  let response: any;
  let apiLogModel = new ApiLogModel();
  apiLogModel.callTime = new Date().toLocaleTimeString();
  apiLogModel.requestMethod = 'GET';
  apiLogModel.url = `${axiosInstance.defaults.baseURL}/${url}`;
  try {
    axiosInstance.defaults.headers.common['auth'] = authToken;
    axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
    response = await axiosInstance.get(url);
    apiLogModel.status = response.status;
    apiLogModel.data = response.data;
  } catch (error) {
    apiLogModel.error = error;
  } finally {
    if (showLogs) {
      console.log('API LOG', apiLogModel);
    }
    return response;
  }
}

export async function getDataById(url: string, authToken: string, id: string) {
  let response;
  try {
    response = await axios.get(`${UrlConstants.baseUrl}/${url}/${id}`);
  } catch (error) {
  } finally {
    return response;
  }
}

export async function sendData(
  url: string,
  authToken: string = '',
  payload: any,
  contentType: any = null,
) {
  let axiosInstance = axios.create({
    baseURL: UrlConstants.baseUrl,
  });
  let response = new ApiResponse();
  let apiLogModel = new ApiLogModel();
  apiLogModel.callTime = new Date().toLocaleTimeString();
  apiLogModel.requestMethod = 'POST';
  apiLogModel.url = `${axiosInstance.defaults.baseURL}/${url}`;
  apiLogModel.payload = payload;
  try {
    if (authToken !== '') {
      axiosInstance.defaults.headers.common['auth'] = authToken;
    }
    if (contentType !== null) {
      axiosInstance.defaults.headers['Content-Type'] = contentType;
    }
    const result = await axiosInstance.post(url, payload);
    response.data = result.data;
    response.status = result.status;
    apiLogModel.status = response.status;
    apiLogModel.data = response.data;
  } catch (error) {
    response.error = error;
    apiLogModel.error = error;
  } finally {
    if (showLogs) {
      console.log('API LOG', apiLogModel);
    }
    return response;
  }
}

export async function updateData(
  url: string,
  authToken: string,
  payload: any,
  contentType: any = null,
) {
  let axiosInstance = axios.create({
    baseURL: UrlConstants.baseUrl,
  });
  let response = new ApiResponse();
  let apiLogModel = new ApiLogModel();
  apiLogModel.callTime = new Date().toLocaleTimeString();
  apiLogModel.requestMethod = 'POST';
  apiLogModel.url = `${axiosInstance.defaults.baseURL}/${url}`;
  apiLogModel.payload = payload;
  try {
    if (authToken !== '') {
      axiosInstance.defaults.headers.common['auth'] = authToken;
    }
    if (contentType !== null) {
      axiosInstance.defaults.headers['Content-Type'] = contentType;
    }
    const result = await axiosInstance.put(url, payload);
    response.data = result.data;
    response.status = result.status;
    apiLogModel.status = result.status;
    apiLogModel.data = result.data;
  } catch (error) {
    response.error = error;
    apiLogModel.error = error;
  } finally {
    if (showLogs) {
      console.log('API LOG', apiLogModel);
    }
    return response;
  }
}

export async function deleteData(url: string, authToken: string, payload: any) {
  let axiosInstance = axios.create({
    baseURL: UrlConstants.baseUrl,
  });
  let response;
  let apiLogModel = new ApiLogModel();
  apiLogModel.callTime = new Date().toLocaleTimeString();
  apiLogModel.requestMethod = 'DELETE';
  apiLogModel.url = `${axiosInstance.defaults.baseURL}/${url}`;
  axiosInstance.defaults.headers.common['auth'] = authToken;
  try {
    response = await axiosInstance.delete(url);
    apiLogModel.status = response.status;
    apiLogModel.data = response.data;
  } catch (error) {
    apiLogModel.error = error;
  } finally {
    if (showLogs) {
      console.log('API LOG', apiLogModel);
    }
    return response;
  }
}
