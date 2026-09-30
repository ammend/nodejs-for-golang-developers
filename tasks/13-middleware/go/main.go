package main

import (
	"fmt"
	"net/http"
)

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("before")
		next.ServeHTTP(w, r)
		fmt.Println("after")
	})
}
func main() {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) })
	demo(logRequest(handler), []Request{{"GET", "/", ""}})
}
