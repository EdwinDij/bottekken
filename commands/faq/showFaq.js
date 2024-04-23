const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../config/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faq-show")
    .setDescription("Afficher la FAQ."),
  async execute(interaction) {
    // Récupérer toutes les questions et réponses de la base de données
    db.all("SELECT * FROM Questions", async function (err, questionRows) {
      if (err) {
        console.error(err);
        return await interaction.reply(
          "Une erreur s'est produite lors de la récupération de la FAQ."
        );
      }
      if (!questionRows || questionRows.length === 0) {
        return await interaction.reply({
          content: "La FAQ est vide.",
          ephemeral: true,
        });
      }

      try {
        let faqMessage = "";

        // Pour chaque question, récupérer ses réponses correspondantes
        for (let index = 0; index < questionRows.length; index++) {
          const questionRow = questionRows[index];
          const responseRows = await db.all(
            "SELECT * FROM Reponses WHERE question_id = ?",
            [questionRow.id]
          );

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
        }

        // Répondre à l'interaction avec le message FAQ
        interaction.reply(
          { content: faqMessage, ephemeral: True } || {
            content: "La FAQ est vide.",
            ephemeral: true,
          }
        );
      } catch (error) {
        console.error(error);
        interaction.reply({
          content:
            "Une erreur s'est produite lors de la récupération de la FAQ.",
          ephemeral: true,
        });
      }
    });
  },
};
