import { file } from 'bun'

async function sync(filename: string, webhookUrl: string, messageId: string) {
  const response = await fetch(`${webhookUrl}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: await file(filename).text(),
    }),
  })
  console.log('Update', filename, response.status)
}

await sync(
  'messages/rules.txt',
  process.env.RULES_WEBHOOK_URL!,
  process.env.RULES_MESSAGE_ID!,
)

await sync(
  'messages/resources.txt',
  process.env.RESOURCES_WEBHOOK_URL!,
  process.env.RESOURCES_MESSAGE_ID!,
)
