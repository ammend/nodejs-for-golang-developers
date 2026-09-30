package main

import (
	"encoding/json"
	"errors"
	"fmt"
)

type User struct {
	Name string `json:"name"`
}

func parse(s string) (User, error) {
	var u User
	if err := json.Unmarshal([]byte(s), &u); err != nil {
		return u, err
	}
	if u.Name == "" {
		return u, errors.New("name is required")
	}
	return u, nil
}
func main() {
	for _, s := range []string{`{"name":"Ada"}`, `{}`} {
		u, err := parse(s)
		if err != nil {
			fmt.Println(err)
		} else {
			fmt.Println(u.Name)
		}
	}
}
