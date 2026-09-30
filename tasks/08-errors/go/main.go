package main

import (
	"errors"
	"fmt"
)

func divide(n float64) (float64, error) {
	if n == 0 {
		return 0, errors.New("division by zero")
	}
	return 12 / n, nil
}
func main() {
	for _, n := range []float64{3, 0, 2} {
		v, e := divide(n)
		if e != nil {
			fmt.Println(e)
		} else {
			fmt.Println(v)
		}
	}
}
