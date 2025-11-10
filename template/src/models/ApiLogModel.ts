class ApiLogModel {
  url;
  requestHeader;
  requestMethod;
  callTime;
  status;
  data;
  error;
  payload;

  constructor(
    url?: string,
    requestHeader?: any,
    requestMethod?: string,
    callTime?: string,
    status?: number,
    data?: any,
    error?: any,
    payload?: any,
  ) {
    this.url = url;
    this.requestHeader = requestHeader;
    this.requestMethod = requestMethod;
    this.callTime = callTime;
    this.status = status;
    this.data = data;
    this.error = error;
    this.payload = payload;
  }
}

export default ApiLogModel;
