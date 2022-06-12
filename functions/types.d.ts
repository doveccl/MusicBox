type IContext = EventContext<{
  admin: string
  user: KVNamespace
  song: KVNamespace
}, string, Record<string, unknown>>
