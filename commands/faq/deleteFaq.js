const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { db } = require("../../config/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faq-delete")
    .setDescription(
      "Affiche les questions. Sélectionnez celle que vous souhaitez supprimer avec son numéro."
    ),
  async execute(interaction) {
    try {
      console.log(interaction.member.roles.cache.has("caca"));
      // Récupérer toutes les questions de la base de données
      db.all("SELECT * FROM Questions", function (err, questionRows) {
        if (err) {
          console.error(err);
          interaction.reply(
            "Une erreur s'est produite lors de la récupération des questions."
          );
          return;
        }

        // Vérifier si l'utilisateur est un administrateur
        if (
          !interaction.member.permissions.has("superuser") ||
          !interaction.member.permissions.has("Helper")
        ) {
          interaction.reply(
            "Vous devez être administrateur pour supprimer une question."
          );
          return;
        }
        // Vérifier si la FAQ est vide
        if (!questionRows || questionRows.length === 0) {
          interaction.reply("La FAQ est vide.");
          q;
          return;
        }

        // Créer un message avec les questions de la FAQ
        let faqMessage =
          "Sélectionnez la question que vous souhaitez supprimer:\n";
        let deleteQuestion = new ActionRowBuilder();

        // Pour chaque question, ajouter son numéro et son contenu au message
        questionRows.forEach((questionRow, index) => {
          faqMessage += `**${index + 1}:** ${
            questionRow.question.charAt(0).toUpperCase() +
            questionRow.question.slice(1)
          }\n`;
          let button = new ButtonBuilder()
            .setLabel(`Question ${index + 1}`)
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`${questionRow.id}`);
          deleteQuestion.addComponents(button);
        });

        // Répondre à l'interaction avec le message et les boutons
        interaction.reply({
          content: faqMessage,
          components: [deleteQuestion],
        });

        // Gérer les interactions de bouton
        interaction.client.once(
          "interactionCreate",
          async (buttonInteraction) => {
            if (!buttonInteraction.isButton()) return;
            const buttonId = buttonInteraction.customId;

            // Supprimer la question de la base de données
            db.run(
              "DELETE FROM Questions WHERE id = ?",
              buttonId,
              function (err) {
                if (err) {
                  console.error(err);
                  buttonInteraction.reply(
                    "Une erreur s'est produite lors de la suppression de la question."
                  );
                  return;
                }

                // Supprimer les réponses liées à la question
                db.run(
                  "DELETE FROM Reponses WHERE question_id = ?",
                  buttonId,
                  function (err) {
                    if (err) {
                      console.error(err);
                      buttonInteraction.reply(
                        "Une erreur s'est produite lors de la suppression de la réponse."
                      );
                      return;
                    }

                    buttonInteraction.reply(
                      "La question et sa réponse ont été supprimées avec succès."
                    );
                  }
                );
              }
            );
          }
        );
      });
    } catch (error) {
      console.error(error);
      interaction.reply(
        "Une erreur s'est produite lors de la suppression de la question."
      );
    }
  },
};
