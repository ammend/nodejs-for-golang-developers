package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	demo(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := r.URL.Query().Get("name")
		if name == "" {
			name = "world"
		}
		json.NewEncoder(w).Encode(map[string]string{"hello": name})
	}), []Request{{"GET", "/hello", ""}, {"GET", "/hello?name=Ada", ""}})
}
