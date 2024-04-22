const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../config/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faq-create")
    .setDescription("Créer une question.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Entrez votre question.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("réponse")
        .setDescription("Entrez votre réponse.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    const response = interaction.options.getString("réponse");

    // Insérer la question dans la table Questions
    db.run(
      "INSERT INTO Questions (question) VALUES (?)",
      question,
      function (err) {
        if (err) {
          console.error(err);
          return;
        }

        const questionId = this.lastID; // Récupérer l'ID de la question nouvellement insérée

        // Insérer la réponse liée à la question dans la table Réponses
        db.run(
          "INSERT INTO Reponses (reponse, question_id) VALUES (?, ?)",
          [response, questionId],
          function (err) {
            if (err) {
              console.error(err);
              return;
            }

            interaction.reply(
              `Vous avez créé la question: **${question}.** \nEt la réponse: **${response}.**`
            );
          }
        );
      }
    );
  },
};
