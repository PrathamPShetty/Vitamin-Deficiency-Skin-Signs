class ApiResponse {
    constructor() {
        this.isLoading = false;
        this.isSuccess = false;
        this.isError = false;
        this.data = null;
        this.errorMessage = null;
    }

    setLoading() {
        this.isLoading = true;
        this.isSuccess = false;
        this.isError = false;
        this.data = null;
        this.errorMessage = null;
    }

    setSuccess(data) {
        this.isLoading = false;
        this.isSuccess = true;
        this.isError = false;
        this.data = data;
        this.errorMessage = null;
    }

    setError(errorMessage) {
        this.isLoading = false;
        this.isSuccess = false;
        this.isError = true;
        this.data = null;
        this.errorMessage = errorMessage;
    }
}

export default ApiResponse;
