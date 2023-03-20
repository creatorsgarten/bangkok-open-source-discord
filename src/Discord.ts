import { z } from 'zod'
import { defineResourceKind } from './Reconciler.js'
import { Env } from '@(-.-)/env'
import Ky from 'ky'
import {
  ChannelType,
  RESTPostAPIGuildChannelJSONBody,
  RESTPostAPIGuildChannelResult,
} from 'discord-api-types/v10'

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
    guildId: z.string(),
  }),
  state: z.object({
    id: z.string(),
  }),
  reconcile: async (state, data) => {
    const client = getClient()
    if (state) {
      await client.patch(`channels/${state.id}`, {
        json: {
          name: data.name,
        },
      })
      return state
    } else {
      const response = (await client
        .post(`guilds/${data.guildId}/channels`, {
          json: {
            name: data.name,
            type: ChannelType.GuildCategory,
          } as RESTPostAPIGuildChannelJSONBody,
        })
        .json()) as RESTPostAPIGuildChannelResult
      return { id: response.id }
    }
  },
})

export const TextChannel = defineResourceKind({
  id: 'textChannel',
  spec: z.object({
    name: z.string(),
    guildId: z.string(),
    parentId: z.string().optional(),
  }),
  state: z.object({
    id: z.string(),
  }),
  reconcile: async (state, data) => {
    const client = getClient()
    if (state) {
      await client.patch(`channels/${state.id}`, {
        json: {
          name: data.name,
        },
      })
      return state
    } else {
      const response = (await client
        .post(`guilds/${data.guildId}/channels`, {
          json: {
            name: data.name,
            type: ChannelType.GuildText,
            parent_id: data.parentId,
          } as RESTPostAPIGuildChannelJSONBody,
        })
        .json()) as RESTPostAPIGuildChannelResult
      return { id: response.id }
    }
  },
})
