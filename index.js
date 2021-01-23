var express = require("express");
var app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const Instamojo = require("instamojo-payment-nodejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/paymentGateway", async (req, res) => {
  Instamojo.setKeys(process.env.API_KEY, process.env.API_AUTH);

  let data = {};
  Instamojo.isSandboxMode(true);

  data.purpose = req.body.purpose;
  data.amount = req.body.amount;
  data.buyer_name = req.body.buyer_name;
  data.redirect_url = req.body.redirect_url;
  data.email = req.body.email;
  data.phone = req.body.phone;
  data.send_email = false;
  data.webhook = "http://www.example.com/webhook/";
  data.send_sms = false;
  data.allow_repeated_payments = false;

  const paymentData = Instamojo.PaymentData(data);
  try {
    const response = await Instamojo.createNewPaymentRequest(paymentData);
    const redirectUrl = response.payment_request.longurl;
    res.status(200).json(redirectUrl);
  } catch (e) {
    console.log(e);
  }
});

app.get("/", (req, res) => {
  res.send("heloo work");
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
