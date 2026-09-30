package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	items := []string{}
	demo(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			var input struct {
				Title string `json:"title"`
			}
			r.Body = http.MaxBytesReader(w, r.Body, 1024)
			if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Title == "" {
				w.WriteHeader(400)
				w.Write([]byte(`{"error":"title required"}`))
				return
			}
			items = append(items, input.Title)
			w.WriteHeader(201)
		case "DELETE":
			items = []string{}
		case "GET":
		default:
			w.WriteHeader(405)
			return
		}
		json.NewEncoder(w).Encode(items)
	}), []Request{{"POST", "/todos", `{"title":"learn Node"}`}, {"GET", "/todos", ""}, {"DELETE", "/todos", ""}, {"GET", "/todos", ""}})
}
