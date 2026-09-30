package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	Name string `json:"name"`
}

func main() {
	var u User
	if err := json.Unmarshal([]byte(`{"name":"Ada"}`), &u); err != nil {
		panic(err)
	}
	fmt.Println("hello", u.Name)
}
