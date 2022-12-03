const transactionRepo = require("../repo/transaction");
const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
});

// let coreApi = new midtransClient.CoreApi({
//   isProduction: false,
//   serverKey: process.env.SERVER_KEY_MIDTRANS,
//   clientKey: process.env.CLIENT_KEY_MIDTRANS,
// });

// const paymentMidtrans = async (total_price, bank, payment_id) => {
//   const parameter = {
//     payment_type: "bank_transfer",
//     transaction_details: {
//       gross_amount: parseInt(total_price),
//       order_id: payment_id,
//       payment_link_id: "for-payment-123",
//     },
//     bank_transfer: {
//       bank: bank,
//     },
//   };
//   return await coreApi.charge(parameter);
// };

const createTransaction = async (req, res) => {
  const body = req.body;
  const user_id = req.userPayload.user_id;
  const order_id = "xxxxxxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  const payment_id = `XYZ-${Math.floor(Math.random() * 100000000000000000000)}`;

  const result = await transactionRepo.createTransaction({
    ...body,
    order_id,
    payment_id,
    user_id,
  });

  let parameter = {
    transaction_details: {
      order_id: payment_id,
      gross_amount: body.total_price,
    },
    credit_card: {
      secure: true,
    },
  };

  const Redirect = await snap
    .createTransaction(parameter)
    .then((transaction) => {
      // transaction redirect_url
      return transaction.redirect_url;
    });

  // snap.transaction.notification(parameter).then((statusResponse) => {
  //   let orderId = statusResponse.order_id;
  //   let transactionStatus = statusResponse.transaction_status;
  //   let fraudStatus = statusResponse.fraud_status;

  //   console.log(
  //     `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
  //   );
  // });

  // const midtrans = await paymentMidtrans(
  //   body.total_price,
  //   body.payment_method,
  //   payment_id
  // );
  // let redirectUrl = midtrans.redirect_url;
  const sendData = {
    ...result,
    redirctUrl: Redirect,
  };
  // console.log(midtrans);
  res.status(result.statusCode).send(sendData);
};

const handleMidtrans = async (req, res) => {
  const { fraud_status, payment_type, transaction_id } = req.body;
  const status_order = fraud_status;
  const status = "Active";
  const payment_id = payment_type;
  const ts_id = order_id;
  const result = await transactionRepo.updatePayment(
    status_order,
    status,
    payment_id,
    ts_id
  );
  return res.status(200).send({ message: "get checkout by id succes" });
};

const create = async (req, res) => {
  const result = await transactionRepo.createTransaction(req.body);
  res.status(result.statusCode).send(result);
};

const getHistory = async (req, res) => {
  const result = await transactionRepo.getHistory(
    req.query,
    req.userPayload.user_id
  );
  res.status(result.statusCode).send(result);
};

const transactionController = {
  createTransaction,
  getHistory,
  handleMidtrans,
};

module.exports = transactionController;
