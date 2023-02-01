import { file } from 'bun'
const response = await fetch(
  `${process.env.RESOURCES_WEBHOOK_URL}/messages/${process.env.RESOURCES_MESSAGE_ID}`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: await file('messages/resources.txt').text(),
    }),
  },
)
console.log('Update message', response.status)
