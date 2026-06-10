const express = require("express");
const cors = require("cors");
const midtransClient = require("midtrans-client");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-transaction", async (req, res) => {
  try {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "Mid-server-vDqqVWCcL4Ic_3_P16Jmo93d";
    console.log("Server Key:", serverKey ? "Found" : "NOT FOUND");

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: serverKey,
    });

    const { orderId, amount, customerName, customerEmail, customerPhone, items } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(amount),
      },
      customer_details: {
        first_name: customerName || "Customer",
        email: customerEmail || "customer@sanjayastore.com",
        phone: customerPhone || "08123456789",
      },
      item_details: items.map(item => ({
        id: String(item.id),
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.name,
      })),
    };

    const transaction = await snap.createTransaction(parameter);
    return res.status(200).json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Midtrans Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/webhook", async (req, res) => {
  return res.status(200).json({ message: "OK" });
});

app.get("/", (req, res) => {
  res.json({ status: "SanjayaStore Server Running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});