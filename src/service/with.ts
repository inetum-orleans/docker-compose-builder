import { ServiceBuilder } from './service'
import { Feature, isFeatureSupported, Version } from '../version'

export class ServiceWithBuilder {
  constructor(private builder: ServiceBuilder) {}

  default(restart: boolean | string = true, name?: string, image?: string, rawName?: boolean): ServiceBuilder {
    this.builder.build(name, rawName)
    this.builder.image(image, rawName)

    if (isFeatureSupported(Feature.init, this.builder.get().version as Version)) {
      this.builder.init()
    }

    if (restart) {
      if (typeof restart === 'string') {
        this.builder.restart(restart)
      } else {
        this.builder.restart()
      }
    }

    return this.builder
  }
}
