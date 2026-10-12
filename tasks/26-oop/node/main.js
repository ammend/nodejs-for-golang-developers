// Abstraction: checkout only needs a pay(amount) behavior.
// 抽象：结账只依赖 pay(amount) 行为，不关心具体支付方式。
class Wallet {
  #balance;
  constructor(balance) { this.#balance = balance; }
  pay(amount) {
    if (amount <= 0 || amount > this.#balance) return "declined";
    this.#balance -= amount;
    return `wallet balance ${this.#balance}`;
  }
}
class GiftCard {
  pay(amount) { return `gift paid ${amount}`; }
}
class Checkout {
  constructor(payment) { this.payment = payment; } // composition / 组合
  buy(amount) { return this.payment.pay(amount); }
}
const wallet = new Wallet(100);
for (const payment of [wallet, new GiftCard()]) {
  console.log(new Checkout(payment).buy(30));
}
console.log(new Checkout(wallet).buy(80)); // state is encapsulated / 状态被封装
// No inheritance needed: both objects provide pay(amount).
// 不要求共同父类：两个对象都提供 pay(amount)。
