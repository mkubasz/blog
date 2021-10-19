import { Account, Payment, PaymentDetails, PaymentStatus } from "../Payment";

describe("Payment", () => {
  it(`should check if payment without data
  return CANCELLED status of the current order`, () => {
    const payment = new Payment();
    const paymentOrder = payment.pay(undefined);
    expect(paymentOrder.paymentStatus).toBe(PaymentStatus.CANCELLED);
  });

  it(`should check if payment with corrected data
  return HOLD status of the current order`, () => {
    const client: Account = new Account(
      1,
      "Mr Beast",
      100,
    );
    const seller: Account = new Account(
      2,
      "Amazon",
    );
    const paymentDetails: PaymentDetails = {
      id: 1,
      money: 20,
      isExpress: false,
      from: client,
      to: seller,
    };
    const payment = new Payment();
    const paymentOrder = payment.pay(paymentDetails);
    expect(paymentOrder.paymentStatus).toBe(PaymentStatus.HOLD);
  });

  it(`should return CANCELLED status if amount from client's account 
  is less then the money wich will be send`, () => {
    const client: Account = new Account(
      1,
      "Mr Beast",
      10,
    );
    const seller: Account = new Account(
      2,
      "Amazon",
    );
    const paymentDetails: PaymentDetails = {
      id: 1,
      money: 20,
      isExpress: false,
      from: client,
      to: seller,
    };
    const payment = new Payment();
    const paymentOrder = payment.pay(paymentDetails);
    expect(paymentOrder.paymentStatus).toBe(PaymentStatus.CANCELLED);
  });

  it(`should return SETTLED status 
  if amount will be added to seller and substract from client`, () => {
    const client: Account = new Account(
      1,
      "Mr Beast",
      30,
    );
    const seller: Account = new Account(
      2,
      "Amazon",
    );

    const paymentDetails: PaymentDetails = {
      id: 1,
      money: 20,
      isExpress: false,
      from: client,
      to: seller,
    };
    const payment = new Payment();
    const paymentOrder = payment.pay(paymentDetails);
    expect(paymentOrder.paymentStatus).toBe(PaymentStatus.HOLD);
    const paymentAmount = payment.amount(paymentOrder.paymentId);
    client.decAmount(paymentAmount);
    seller.incAmount(paymentAmount);
    const paymentOrderStatus = payment.checkStatus(paymentOrder.paymentId);
    expect(paymentOrderStatus).toBe(PaymentStatus.SETTLED);
    expect(seller.amount).toBeCloseTo(paymentDetails.money);
    expect(client.amount).toBeCloseTo(10);
  });
});
