import axios from 'axios';
import UrlConstants from '../constants/UrlConstants';
import ApiResponse from '../models/ApiResponseModel';
import ApiLogModel from '../models/ApiLogModel';

const showLogs = true;

export async function MakeCall(url: string, graphQuery?: any, payload?: any) {
  let axiosInstance = axios.create({
    baseURL: UrlConstants.baseUrl,
  });
  let response = new ApiResponse();
  let apiLogModel = new ApiLogModel();
  apiLogModel.callTime = new Date().toLocaleTimeString();
  apiLogModel.requestMethod = 'POST';
  apiLogModel.url = `${url}`;
  apiLogModel.payload = payload;
  try {
    const result = await axiosInstance.post(url, {query: graphQuery});
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
