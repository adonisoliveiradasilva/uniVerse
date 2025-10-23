package br.com.my_universe.api.infrastructure.web.dto.shared;

public class ApiResponse<T> {

    private T data;

    public ApiResponse(T data) {
        this.data = data;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}