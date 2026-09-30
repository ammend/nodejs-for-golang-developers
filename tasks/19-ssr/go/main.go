package main

import (
	"html/template"
	"net/http"
)

func main() {
	page := template.Must(template.New("page").Parse(`<h1>Hello / 你好</h1><p>{{.Name}}</p>`))
	demo(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		if err := page.Execute(w, struct{ Name string }{"Ada"}); err != nil {
			panic(err)
		}
	}), []Request{{"GET", "/", ""}})
}
