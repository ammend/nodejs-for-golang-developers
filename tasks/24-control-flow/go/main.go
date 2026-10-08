package main

import "fmt"

func main() {
	score := 75
	if score >= 90 {
		fmt.Println("grade A")
	} else if score >= 60 {
		fmt.Println("grade B")
	} else {
		fmt.Println("grade C")
	}
	switch {
	case score >= 60:
		fmt.Println("pass")
	default:
		fmt.Println("retry")
	}
	for i := 0; i < 3; i++ {
		if i == 1 {
			continue
		}
		fmt.Printf("count %d\n", i)
	}
	remaining := 2
	for remaining > 0 {
		fmt.Printf("remaining %d\n", remaining)
		remaining--
	}
	// Go has no do…while / 用 for + break 表达至少执行一次
	once := 0
	for {
		fmt.Printf("once %d\n", once)
		once++
		if !(once < 0) {
			break
		}
	}
	names := []string{"Ada", "Lin"}
	for i, name := range names {
		fmt.Printf("%d %s\n", i, name)
	}
	for _, name := range names {
		fmt.Printf("first %s\n", name)
		break
	}
}
