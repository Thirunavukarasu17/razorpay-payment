//rzp_test_No3k5g3iOip3nS id
//tbayMoPTn7fzDlRCulioXgVn key


const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: "rzp_test_No3k5g3iOip3nS",
      key_secret: "tbayMoPTn7fzDlRCulioXgVn",
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const gen = crypto.createHmac("sha256", "tbayMoPTn7fzDlRCulioXgVn");
  //order_id + "|" + razorpay_payment_id
  gen.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = gen.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
