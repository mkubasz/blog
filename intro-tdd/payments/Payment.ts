class Account {
  id: number;
  name: string;
  amount: number;

  constructor(id: number, name: string, amount = 0) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  }

  incAmount = (amount: number): number => this.amount += amount; 

  decAmount = (amount: number): number => this.amount -= amount;
  
}

class PaymentDetails {
  from: Account;
  to: Account;
  id: number;
  money: number;
  isExpress: boolean;

  constructor(from: Account, to: Account, id: number, money: number,
    isExpress: boolean) {
    this.from = from;
    this.to = to;
    this.id = id;
    this.money = money;
    this.isExpress = isExpress;
  }
}

enum PaymentStatus {
  SETTLED = 0,
  HOLD = 1,
  CANCELLED,
}

class PaymentOrder {
  paymentStatus: PaymentStatus;
  paymentId: number;

  constructor(paymentStatus: PaymentStatus) {
    this.paymentStatus = paymentStatus;
    this.paymentId = Math.floor(Math.random() * 100) + 1;
  }
}

class Payment {
  payments: Map<number, [PaymentDetails, PaymentStatus]>;
  constructor() {
    this.payments = new Map();
  }


  pay(details: PaymentDetails): PaymentOrder {
    if (details === undefined) {
      return new PaymentOrder(PaymentStatus.CANCELLED);
    }
    if (details.from?.amount < details.money) {
      return new PaymentOrder(PaymentStatus.CANCELLED);
    }
    const paymentOrder = new PaymentOrder(PaymentStatus.HOLD);
    this.payments.set(paymentOrder.paymentId, [details, PaymentStatus.HOLD]);
    return paymentOrder;
  }

  amount(paymentId: number): number {
    const paymentDetails = this.payments.get(paymentId)[0];
    this.payments.set(paymentId, [paymentDetails, PaymentStatus.SETTLED]);
    return paymentDetails.money; 
  }

  checkStatus = (paymentId: number): PaymentStatus => this.payments.get(paymentId)[1];
}

export {PaymentOrder, Payment, PaymentStatus, Account, PaymentDetails};
