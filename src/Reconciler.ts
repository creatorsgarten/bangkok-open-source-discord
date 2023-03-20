import { z, ZodType } from 'zod'
import { getState, setState } from './StageStorage.js'
import { isEqual } from 'lodash-es'

const resources = new Map<string, Resource>()

export interface ResourceKind<T extends ZodType, S extends ZodType> {
  id: string
  spec: T
  state?: S
  reconcile: (
    state: z.infer<S> | undefined,
    spec: z.infer<T>,
  ) => Promise<z.infer<S>>
}

export interface Resource {
  id: string
  kind: ResourceKind<any, any>
  resolveSpec: () => any
}

export function defineResource<T extends ZodType>(
  kind: ResourceKind<T, any>,
  id: string,
  resolveSpec: () => z.infer<T>,
) {
  const key = [id, kind.id].join('#')
  if (resources.has(key)) {
    throw new Error(`Resource "${key}" already exists`)
  }
  const resource: Resource = {
    id,
    kind,
    resolveSpec,
  }
  resources.set(key, resource)
}

export function defineResourceKind<T extends ZodType, S extends ZodType>(
  kind: ResourceKind<T, S>,
) {
  return kind
}

export async function reconcile() {
  for (const [key, resource] of resources) {
    await reconcileResource(key, resource)
  }

  async function reconcileResource(
    key: string,
    resource: Resource,
  ): Promise<void> {
    const oldData = await getState(key)
    const oldSpec = oldData?.spec
    const oldState = oldData?.state
      ? resource.kind.state.parse(oldData?.state)
      : undefined
    const newSpec = resource.kind.spec.parse(resource.resolveSpec())
    if (isEqual(oldSpec, newSpec)) {
      console.log(`* ${key}: Skipping reconciliation (unchanged)`)
      return
    }
    console.log(`* ${key}: Reconciling...`)
    const started = Date.now()
    const newState = await resource.kind.reconcile(oldState, newSpec)
    await setState(key, {
      spec: newSpec,
      state: newState,
    })
    console.log(`    -> Done in ${Date.now() - started} ms`)
  }
}

export async function injectState<T extends ZodType, S extends ZodType>(
  kind: ResourceKind<T, S>,
  id: string,
  spec: z.infer<T>,
  state: z.infer<S>,
) {
  const key = [id, kind.id].join('#')
  await setState(key, {
    spec: kind.spec.parse(spec),
    state: kind.state ? kind.state.parse(state) : undefined,
  })
}
