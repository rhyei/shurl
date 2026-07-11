import fs from 'node:fs'

const commitMsgPath = process.argv[2]
if (!commitMsgPath) throw new Error('No commit message path provided')

// oxfmt-ignore
const emojis = ['✨', '🌸', '🗻', '🤍', '🍥', '💎', '🎉', '🏮', '💥', '👾', '🐉', '🔥', '⚜️', '⛩️', '🥀']

const currentMessage = fs.readFileSync(commitMsgPath, 'utf8')
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
const newMessage = `${randomEmoji} ${currentMessage}`

fs.writeFileSync(commitMsgPath, newMessage)
