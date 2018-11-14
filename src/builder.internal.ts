import mergeWith from 'lodash/mergeWith'
import { ConfigItemContainer, Extension, ExtensionConstructor, ExtensionSupport } from './builder'

function mergeWithCustomizer(objValue: any, srcValue: any): any {
  if (Array.isArray(objValue)) {
    if (!Array.isArray(srcValue)) {
      srcValue = [srcValue]
    }
    return objValue.concat(srcValue)
  } else if (Array.isArray(srcValue)) {
    objValue = [objValue]
    return mergeWithCustomizer(objValue, srcValue)
  }
}

export abstract class AbstractBuilder<I> implements ConfigItemContainer<I>, ExtensionSupport {
  readonly item: I

  protected constructor(item: I) {
    this.item = item
  }

  merge(item: Partial<I>): this {
    mergeWith(this.item, item, mergeWithCustomizer)
    return this
  }

  assign(item: Partial<I>): this {
    Object.assign(this.item, item)
    return this
  }

  ext<E extends Extension>(ext: ExtensionConstructor<E>): E {
    return new ext(this)
  }
}
