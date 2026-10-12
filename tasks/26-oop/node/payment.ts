// Compile-time behavior contract / 编译期行为契约
interface Payment {
  pay(amount: number): string;
}
class Wallet implements Payment {
  #balance: number; // runtime privacy / 运行时私有
  constructor(balance: number) { this.#balance = balance; }
  public pay(amount: number): string {
    if (amount <= 0 || amount > this.#balance) return "declined";
    this.#balance -= amount;
    return `wallet balance ${this.#balance}`;
  }
}
// Abstract class can share implementation / 抽象类可共享实现
abstract class NamedPayment implements Payment {
  protected constructor(protected readonly label: string) {}
  abstract pay(amount: number): string;
  protected receipt(amount: number): string {
    return `${this.label} paid ${amount}`;
  }
}
class GiftCard extends NamedPayment {
  constructor() { super("gift"); }
  public override pay(amount: number): string { return this.receipt(amount); }
}
class Checkout {
  // Parameter property: declare + initialize / 参数属性：声明并初始化
  constructor(private readonly payment: Payment) {}
  buy(amount: number): string { return this.payment.pay(amount); }
}
const wallet = new Wallet(100);
const payments: Payment[] = [wallet, new GiftCard()];
for (const payment of payments) console.log(new Checkout(payment).buy(30));
console.log(new Checkout(wallet).buy(80));
// Type checking example / 类型检查示例（取消注释后用 tsc 检查）:
// const invalid: Payment = { pay: (amount: string) => amount };
// The web runner transpiles only; it does not type-check.
// 网页只转译，不做类型检查。
