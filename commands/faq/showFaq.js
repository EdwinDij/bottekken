const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../config/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faq-show")
    .setDescription("Afficher la FAQ."),
  async execute(interaction) {
    // Récupérer toutes les questions et réponses de la base de données
    db.all("SELECT * FROM Questions", function (err, questionRows) {
      if (err) {
        console.error(err);
        return;
      }
      if (questionRows.length === 0 || questionRows === undefined || questionRows === null) {
        interaction.reply("La FAQ est vide.");
        return;
      }
      // Créer un message avec la FAQ
      let faqMessage = "";

      // Pour chaque question, récupérer ses réponses correspondantes
      questionRows.forEach((questionRow, index) => {
        db.all(
          "SELECT * FROM Reponses WHERE question_id = ?",
          [questionRow.id],
          function (err, responseRows) {
            if (err) {
              console.error(err);
              return;
            }

            // Ajouter la question et ses réponses au message FAQ
            faqMessage += `**Q${index + 1}:** ${
              questionRow.question.charAt(0).toUpperCase() +
              questionRow.question.slice(1)
            }\n`;
            responseRows.forEach((responseRow, responseIndex) => {
              faqMessage += `${
                responseRow.reponse.charAt(0).toUpperCase() +
                responseRow.reponse.slice(1)
              }\n`;
            });

            // Ajouter une ligne vide après chaque question
            faqMessage += "\n";

            // Si nous sommes arrivés à la dernière question, répondre à l'interaction
            if (index === questionRows.length - 1) {
              // Vérifier si faqMessage n'est pas vide avant de répondre
              if (faqMessage.trim() !== "") {
                interaction.reply(faqMessage);
              } else {
                interaction.reply("La FAQ est vide.");
              }
            }
          }
        );
      });
    });
  },
};
