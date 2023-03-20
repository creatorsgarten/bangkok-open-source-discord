import { Plugin, colord, extend } from 'colord'
import lchPlugin from 'colord/plugins/lch'

extend([lchPlugin as unknown as Plugin])
export { colord }
