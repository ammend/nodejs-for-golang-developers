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

// defer runs at function return / 用独立函数让每次计算都收尾
func attempt(n float64) {
	defer fmt.Println("cleanup")
	v, e := divide(n)
	if e != nil {
		fmt.Println(e)
		return
	}
	fmt.Println(v)
}
func main() {
	for _, n := range []float64{3, 0, 2} {
		attempt(n)
	}
}
