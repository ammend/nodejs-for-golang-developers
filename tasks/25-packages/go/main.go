package main

import "fmt"

// Same-package function; go.mod identifies the module.
// 同包函数；go.mod 声明模块，外部包才需要额外依赖。
func main() {
	fmt.Println(greet("Ada"))
	fmt.Println("package learning-packages")
	fmt.Println("external dependencies 0")
}
