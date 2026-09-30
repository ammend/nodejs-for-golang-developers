package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	nums := []int{1, 2, 3, 4}
	out := []int{}
	sum := 0
	for _, n := range nums {
		if n%2 == 0 {
			out = append(out, n*2)
			sum += n * 2
		}
	}
	data, _ := json.Marshal(out)
	fmt.Println(string(data))
	fmt.Println(sum)
}
