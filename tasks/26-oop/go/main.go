package main

import "fmt"

type Payment interface{ Pay(amount int) string }
type Wallet struct{ balance int }

func (w *Wallet) Pay(amount int) string {
	if amount <= 0 || amount > w.balance {
		return "declined"
	}
	w.balance -= amount
	return fmt.Sprintf("wallet balance %d", w.balance)
}

type GiftCard struct{}

func (g GiftCard) Pay(amount int) string { return fmt.Sprintf("gift paid %d", amount) }

// Composition and implicit interface satisfaction / 组合与隐式实现接口
type Checkout struct{ payment Payment }

func (c Checkout) Buy(amount int) string { return c.payment.Pay(amount) }
func main() {
	wallet := &Wallet{balance: 100}
	for _, payment := range []Payment{wallet, GiftCard{}} {
		fmt.Println((Checkout{payment: payment}).Buy(30))
	}
	fmt.Println((Checkout{payment: wallet}).Buy(80))
}
