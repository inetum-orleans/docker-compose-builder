import { ServiceBuilder } from './service'
import { Feature, isFeatureSupported, Version } from '../version'

const deprecate = require('deprecate')

export interface DefaultOptions {
  restart: boolean | string
  name?: string
  image?: string
  rawName?: boolean
}

export class ServiceWithBuilder {
  constructor(private builder: ServiceBuilder) {}

  default(
    options: boolean | string | DefaultOptions = { restart: true },
    name?: string,
    image?: string,
    rawName?: boolean
  ): ServiceBuilder {
    if (typeof options === 'boolean' || typeof options === 'string') {
      deprecate(
        'ServiceWithBuilder.default()',
        'this method should now be called with an options object as single argument.'
      )
      options = {
        restart: options,
        name,
        image,
        rawName
      }
    }
    this.builder.build(options.name, options.rawName)
    this.builder.image(options.image, options.rawName)

    if (isFeatureSupported(Feature.init, this.builder.get().version as Version)) {
      this.builder.init()
    }

    if (options.restart) {
      if (typeof options.restart === 'string') {
        this.builder.restart(options.restart)
      } else {
        this.builder.restart()
      }
    }

    return this.builder
  }
}
