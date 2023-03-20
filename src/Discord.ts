import { z } from 'zod'
import { defineResourceKind } from './Reconciler.js'
import { Env } from '@(-.-)/env'
import Ky from 'ky'

const env = Env(
  z.object({
    DISCORD_TOKEN: z.string(),
  }),
)

function getClient() {
  return Ky.extend({
    prefixUrl: 'https://discord.com/api/',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
  })
}

export const Category = defineResourceKind({
  id: 'category',
  spec: z.object({
    name: z.string(),
  }),
  state: z.object({
    id: z.string(),
  }),
  reconcile: async (state, data) => {
    throw new Error('unimplemented')
  },
})
