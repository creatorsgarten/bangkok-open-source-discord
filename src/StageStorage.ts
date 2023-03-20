import { dump, load } from 'js-yaml'
import fs from 'fs'
import { isEqual } from 'lodash-es'

let state: Record<string, any> | undefined

const cloneDeep = <T>(value: T): T => value && JSON.parse(JSON.stringify(value))

export async function loadState() {
  if (!fs.existsSync('state.yml')) {
    state = {}
    return
  }
  state = load(fs.readFileSync('state.yml', 'utf8')) as Record<string, any>
}

export async function getState(key: string) {
  if (!state) {
    await loadState()
  }
  return cloneDeep(state![key])
}

export async function setState(key: string, data: any) {
  if (!state) {
    await loadState()
  }
  const oldState = state![key] ? cloneDeep(state![key]) : undefined
  const newState = cloneDeep(data)
  if (isEqual(oldState, newState)) {
    return
  }
  state![key] = newState
  fs.writeFileSync(
    'state.yml',
    dump(state, {
      sortKeys: true,
      forceQuotes: true,
      lineWidth: -1,
    }),
  )
}
