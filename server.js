require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://viteauxmarie_db_user:Armel40561457@cluster0.sstr5xt.mongodb.net/";
const dbName = process.env.MONGODB_DB || "cardcode";
const collName = process.env.MONGODB_COLLECTION || "kendji";

let client;
let collection;
let useFileStorage = false;
const paymentsFile = path.join(__dirname, "payments.json");

// Email transporter configuration
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  console.log("Email transporter configured");
} else {
  console.warn("Email credentials not configured - emails will not be sent");
}

// Function to send payment notification email
async function sendPaymentNotification(paymentData) {
  if (!transporter) {
    console.log("Email not sent: transporter not configured");
    return;
  }

  const alertEmail = process.env.ALERT_EMAIL || process.env.GMAIL_USER;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
        h1 { color: #1e4a7a; border-bottom: 3px solid #d4a574; padding-bottom: 10px; }
        .info-row { padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .highlight { background: #fff3cd; padding: 5px 10px; border-radius: 5px; display: inline-block; margin-top: 10px; }
        .promo { color: #4ade80; font-weight: bold; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #d4a574; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎫 Nouveau Paiement Reçu - Kendji Girac</h1>
        
        <div class="info-row">
          <span class="label">Client :</span>
          <span class="value">${paymentData.firstName} ${paymentData.lastName}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Email :</span>
          <span class="value">${paymentData.email}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Téléphone :</span>
          <span class="value">${paymentData.phone}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Montant payé :</span>
          <span class="value">${paymentData.amount.toFixed(2)} ${paymentData.currency}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Code promo utilisé :</span>
          <span class="value ${paymentData.promoCodeUsed ? 'promo' : ''}">${paymentData.promoCodeUsed ? '✅ OUI (90% de réduction)' : '❌ Non'}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Événement :</span>
          <span class="value">${paymentData.eventName}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Date :</span>
          <span class="value">${paymentData.eventDate}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Lieu :</span>
          <span class="value">${paymentData.eventLocation}</span>
        </div>
        
        <div class="highlight">
          📅 Enregistré le : ${new Date(paymentData.timestamp).toLocaleString('fr-FR')}
        </div>
        
        <div class="footer">
          Ceci est une notification automatique du système de billetterie Kendji Girac.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Kendji Concert Tickets" <${process.env.GMAIL_USER}>`,
    to: alertEmail,
    subject: `🎫 Nouveau paiement - ${paymentData.firstName} ${paymentData.lastName} (${paymentData.amount.toFixed(2)} €)`,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${alertEmail}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    // Don't throw - email failure shouldn't block payment processing
  }
}

async function start() {
  client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection(collName);
    console.log("Connected to MongoDB", dbName, collName);
  } catch (err) {
    console.error('MongoDB connection failed (SSL/TLS or network issue):', err.message || err);
    console.warn('Falling back to local file storage for payments (development only).');
    useFileStorage = true;
    // Ensure payments file exists
    try {
      if (!fs.existsSync(paymentsFile)) fs.writeFileSync(paymentsFile, "[]", "utf8");
    } catch (fsErr) {
      console.error('Failed to create payments file:', fsErr);
      throw fsErr;
    }
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/payments", async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.firstName || !data.lastName || !data.email) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    if (!useFileStorage && collection) {
      const result = await collection.insertOne({ ...data });
      
      // Send email notification (non-blocking)
      sendPaymentNotification(data).catch(err => 
        console.error("Email notification failed:", err.message)
      );
      
      return res.json({ success: true, id: result.insertedId });
    }

    // Fallback: append to local JSON file
    const payments = JSON.parse(fs.readFileSync(paymentsFile, "utf8") || "[]");
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const doc = { _id: id, ...data };
    payments.push(doc);
    fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2), "utf8");
    
    // Send email notification (non-blocking)
    sendPaymentNotification(data).catch(err => 
      console.error("Email notification failed:", err.message)
    );
    
    return res.json({ success: true, id });
  } catch (err) {
    console.error("Error inserting payment:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
