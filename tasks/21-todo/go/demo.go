package main

// Demo harness: real local HTTP requests, then automatic shutdown.
import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
)

type Request struct{ Method, Path, Body string }

func demo(handler http.Handler, requests []Request) []string {
	results := []string{}
	server := httptest.NewServer(handler)
	defer server.Close()
	for _, input := range requests {
		req, err := http.NewRequest(input.Method, server.URL+input.Path, strings.NewReader(input.Body))
		if err != nil {
			panic(err)
		}
		if input.Body != "" {
			req.Header.Set("Content-Type", "application/json")
		}
		res, err := http.DefaultClient.Do(req)
		if err != nil {
			panic(err)
		}
		body, err := io.ReadAll(res.Body)
		res.Body.Close()
		if err != nil {
			panic(err)
		}
		results = append(results, string(body))
		fmt.Printf("%s %s → %d %s\n", input.Method, input.Path, res.StatusCode, strings.TrimSpace(string(body)))
		if strings.HasPrefix(res.Header.Get("Content-Type"), "text/html") && res.StatusCode == 200 {
			if err := os.WriteFile("preview.html", body, 0600); err != nil {
				panic(err)
			}
		}
	}
	return results
}
