import { z, ZodType } from 'zod'

export interface ResourceKind<T extends ZodType, S extends ZodType> {
  id: string
  spec: T
  state?: S
  reconcile: (
    state: z.infer<S> | undefined,
    data: z.infer<T>,
  ) => Promise<z.infer<S>>
}

export function defineResource<T extends ZodType>(
  kind: ResourceKind<T, any>,
  id: string,
  resolveData: () => z.infer<T>,
) {}

export function defineResourceKind<T extends ZodType, S extends ZodType>(
  kind: ResourceKind<T, S>,
) {
  return kind
}
