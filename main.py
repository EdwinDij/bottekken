import discord
import os

intents = discord.Intents.default()
intents.messages = True

client = discord.Client(intents=intents)


@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content == 'hello':
        await message.channel.send('Hello!')


if __name__ == '__main__':
    print('Starting bot...')
    client .run(os.getenv('TOKEN_DISCORD'))

