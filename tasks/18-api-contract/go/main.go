package main

import (
	"encoding/json"
	"html"
	"net/http"
	"os"
)

func main() {
	responses := demo(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"name":"Ada"}`))
	}), []Request{{"GET", "/api/profile", ""}})
	var user struct{ Name string }
	if err := json.Unmarshal([]byte(responses[0]), &user); err != nil {
		panic(err)
	}
	if err := os.WriteFile("preview.html", []byte("<h1>Profile / 用户</h1><p>"+html.EscapeString(user.Name)+"</p>"), 0600); err != nil {
		panic(err)
	}
}
