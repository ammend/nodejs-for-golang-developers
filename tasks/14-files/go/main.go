package main

import (
	"encoding/json"
	"fmt"
	"os"
)

func main() {
	data, err := json.Marshal([]string{"learn", "build"})
	if err != nil {
		panic(err)
	}
	if err = os.WriteFile("notes.json", data, 0600); err != nil {
		panic(err)
	}
	saved, err := os.ReadFile("notes.json")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(saved))
}
