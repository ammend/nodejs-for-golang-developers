package main

import (
	"encoding/json"
	"html"
	"net/http"
	"strings"
)

func main() {
	demo(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Name string `json:"name"`
		}
		r.Body = http.MaxBytesReader(w, r.Body, 1024)
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "invalid JSON", 400)
			return
		}
		if strings.TrimSpace(input.Name) == "" {
			http.Error(w, "name is required", 422)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte("<h1>Saved / 已保存</h1><p>" + html.EscapeString(input.Name) + "</p>"))
	}), []Request{{"POST", "/signup", `{"name":""}`}, {"POST", "/signup", `{"name":"Ada"}`}})
}
