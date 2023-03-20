import { readFileSync } from 'fs'
import { injectState } from '../src/Reconciler.js'
import { Category, Role, TextChannel } from '../src/Discord.js'

const tfstate = JSON.parse(readFileSync('terraform.tfstate', 'utf8'))

const only = <T>(value: T[]): any => {
  if (value.length !== 1) {
    throw new Error('Expected exactly one value')
  }
  return value[0]
}

for (const resource of tfstate.resources) {
  if (resource.type === 'discord_category_channel') {
    await injectState(
      Category,
      resource.name.replace(/_category$/, ''),
      {
        name: only(resource.instances).attributes.name,
        guildId: '1062609208106832002',
      },
      { id: only(resource.instances).attributes.id },
    )
  }
  if (resource.type === 'discord_text_channel') {
    if (resource.name.match(/_text$/)) {
      await injectState(
        TextChannel,
        resource.name.replace(/_text$/, ''),
        {
          name: only(resource.instances).attributes.name,
          guildId: '1062609208106832002',
          parentId: only(resource.instances).attributes.category,
        },
        { id: only(resource.instances).attributes.id },
      )
    }
  }
  if (resource.type === 'discord_role') {
    if (resource.name.match(/_role$/)) {
      await injectState(
        Role,
        resource.name.replace(/_role$/, ''),
        {
          name: only(resource.instances).attributes.name,
          guildId: '1062609208106832002',
          color: only(resource.instances).attributes.color,
          mentionable: only(resource.instances).attributes.mentionable,
        },
        { id: only(resource.instances).attributes.id },
      )
    }
  }
}
