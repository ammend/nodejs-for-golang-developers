package main

import (
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message":"hello"}`))
}

func main() {
	demonstrate(http.HandlerFunc(handler), []string{"/hello"})
}
