class ApiResponse {
  data;
  status;
  error;
  constructor(data?: any, status?: any, error?: any) {
    this.data = data;
    this.status = status;
    this.error = error;
  }
}

export default ApiResponse;
