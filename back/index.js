import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import mangadexService from './src/services/mangadex.service.js'

dotenv.config(); 

const app = express(); 

app.use(cors({ origin: "*" ,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
})); 
app.use(express.json());

const startServer = async () => {
  try {
    console.log ("Initialisation de l'api Mangadex...");
    await mangadexService.initMangaDex();
    console.log("Api Mangadex prête");
  } catch (error) {
    console.error("Erreur lors de l'initialisation ou de la connexion à l'api Mangadex:", error);
  }

const PORT = process.env.PORT || 3000; 

app.use("/", router);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log("-----------------------------");
  console.log("--        LANCEMENT        --");
  console.log("-----------------------------");

  console.log(`Le serveur est lancé sur http://localhost:${PORT}`);
});

};

startServer();
