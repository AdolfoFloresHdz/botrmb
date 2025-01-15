/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";
import 'dotenv/config';

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, API_TOKEN, BUSINESS_PHONE, API_VERSION, PORT } = process.env;

// Función para limpiar el número de teléfono
const cleanPhoneNumber = (number) => {
  return number.startsWith('521') ? number.replace("521", "52") : number;
};

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text
  if (message?.type === "text") {
    // send a reply message
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: cleanPhoneNumber(message.from), // Usa la función cleanPhoneNumber aquí
        text: { body:  message.text.body },
        context: {
          message_id: message.id,
        },
      },
    });

    // mark incoming message as read
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }

  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
