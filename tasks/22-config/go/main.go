package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

func port() (int, error) {
	raw := os.Getenv("APP_PORT")
	if raw == "" {
		raw = "3000"
	}
	n, e := strconv.Atoi(raw)
	if e != nil || n < 1 || n > 65535 {
		return 0, errors.New("invalid port")
	}
	return n, nil
}
func main() {
	for _, v := range []string{"3000", "oops"} {
		os.Setenv("APP_PORT", v)
		n, e := port()
		if e != nil {
			fmt.Println(e)
		} else {
			fmt.Println(n)
		}
	}
}
