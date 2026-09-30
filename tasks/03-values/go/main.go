package main

import "fmt"

type User struct{ Name string }

func main() {
	a := User{"Ada"}
	b := a
	b.Name = "Grace"
	fmt.Println("original:", a.Name)
	ref := &a
	ref.Name = "Lin"
	fmt.Println("shared:", a.Name)
}
