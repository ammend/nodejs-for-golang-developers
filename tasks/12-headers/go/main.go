package main

import "net/http"

func main() {
	demo(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-store")
		if r.URL.Path != "/item" {
			w.WriteHeader(404)
			w.Write([]byte(`{"error":"not found"}`))
			return
		}
		w.WriteHeader(200)
		w.Write([]byte(`{"id":1}`))
	}), []Request{{"GET", "/item", ""}, {"GET", "/missing", ""}})
}
