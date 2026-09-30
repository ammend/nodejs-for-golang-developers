package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	demo(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, 1024)
		var input map[string]any
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			w.WriteHeader(400)
			w.Write([]byte(`{"error":"invalid JSON"}`))
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(input)
	}), []Request{{"POST", "/users", `{"name":"Ada"}`}, {"POST", "/users", `broken`}})
}
