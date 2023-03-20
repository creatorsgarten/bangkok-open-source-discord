import { z } from 'zod'
import { defineResourceKind } from './Reconciler.js'
import { Env } from '@(-.-)/env'
import {
  ChannelType,
  RESTPatchAPIGuildRoleJSONBody,
  RESTPostAPIGuildChannelJSONBody,
  RESTPostAPIGuildChannelResult,
  RESTPostAPIGuildRoleJSONBody,
  RESTPostAPIGuildRoleResult,
} from 'discord-api-types/v10'
import Ky from 'ky'

const env = Env(
  z.object({
    DISCORD_TOKEN: z.string(),
  }),
)

interface RequestOptions {
  json: any
}

function getClient() {
  const request = (method: string, url: string, options: RequestOptions) => {
    return Ky(url, {
      method,
      prefixUrl: 'https://discord.com/api/',
      headers: {
        authorization: `Bot ${env.DISCORD_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(options.json),
      fetch: fetch as any,
    })
  }
  return {
    post: (url: string, options: RequestOptions) =>
      request('POST', url, options),
    patch: (url: string, options: RequestOptions) =>
      request('PATCH', url, options),
  }
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

export const Role = defineResourceKind({
  id: 'role',
  spec: z.object({
    name: z.string(),
    guildId: z.string(),
    color: z.number().optional(),
    mentionable: z.boolean().optional(),
  }),
  state: z.object({
    id: z.string(),
  }),
  reconcile: async (state, data) => {
    const client = getClient()
    if (state) {
      await client.patch(`guilds/${data.guildId}/roles/${state.id}`, {
        json: {
          name: data.name,
          color: data.color,
          mentionable: data.mentionable,
        } as RESTPatchAPIGuildRoleJSONBody,
      })
      return state
    } else {
      const response = (await client
        .post(`guilds/${data.guildId}/roles`, {
          json: {
            name: data.name,
            color: data.color,
            mentionable: data.mentionable,
          } as RESTPostAPIGuildRoleJSONBody,
        })
        .json()) as RESTPostAPIGuildRoleResult
      return { id: response.id }
    }
  },
})
