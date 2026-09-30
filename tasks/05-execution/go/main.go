package main

import "fmt"

func main() {
	fmt.Println("start")
	done := make(chan struct{})
	go func() { fmt.Println("work"); close(done) }()
	<-done
	fmt.Println("end")
}
