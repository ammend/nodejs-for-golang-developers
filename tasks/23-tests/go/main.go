package main

import "fmt"

func clamp(n int) int {
	if n < 0 {
		return 0
	}
	if n > 10 {
		return 10
	}
	return n
}
func main() {
	for _, c := range []struct{ input, want int }{{-2, 0}, {5, 5}, {12, 10}} {
		got := clamp(c.input)
		if got != c.want {
			panic(fmt.Sprintf("clamp(%d): got %d, want %d", c.input, got, c.want))
		}
	}
	fmt.Println("3 checks passed")
}
