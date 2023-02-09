import { file } from 'bun'

async function sync(
  filename: string,
  webhookUrl: string,
  messageIds: string[],
) {
  const contents = (await file(filename).text())
    .split('\\pagebreak')
    .map((x) => x.trim())
  if (contents.length > messageIds.length) {
    contents.push(contents.splice(messageIds.length - 1).join('\n\n'))
  }
  for (const [index, content] of contents.entries()) {
    const messageId = messageIds[index]
    const response = await fetch(`${webhookUrl}/messages/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    console.log('Update', filename, response.status)
  }
}

await sync('messages/rules.txt', process.env.RULES_WEBHOOK_URL!, [
  '1070380691969290372',
  '1073110053944565790',
])

await sync('messages/resources.txt', process.env.RESOURCES_WEBHOOK_URL!, [
  '1070367687647166474',
])
