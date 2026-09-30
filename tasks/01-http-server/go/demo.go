package main

// 演示辅助：启动真实 HTTP 服务、请求路由、打印响应，然后关闭。
import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
)

func demonstrate(handler http.Handler, paths []string) {
	server := httptest.NewServer(handler)
	defer server.Close()
	for _, path := range paths {
		response, err := http.Get(server.URL + path)
		if err != nil { panic(err) }
		body, err := io.ReadAll(response.Body)
		response.Body.Close()
		if err != nil { panic(err) }
		fmt.Printf("GET %s → %d %s\n", path, response.StatusCode, strings.TrimSpace(string(body)))
	}
}
