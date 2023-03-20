import { readFileSync } from 'fs'
import { injectState } from '../src/Reconciler.js'
import { Category } from '../src/Discord.js'

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
      { name: only(resource.instances).attributes.name },
      { id: only(resource.instances).attributes.id },
    )
  }
}
