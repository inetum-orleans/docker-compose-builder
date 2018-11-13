import { ServiceBuilder } from './service'
import { Feature, isFeatureSupported, Version } from '../version'

export class ServiceWithBuilder {
  constructor(private builder: ServiceBuilder) {}

  default(restart: boolean = true): ServiceBuilder {
    this.builder.build()
    this.builder.image()

    if (isFeatureSupported(Feature.init, this.builder.get().version as Version)) {
      this.builder.init()
    }

    if (restart) {
      this.builder.restart()
    }

    return this.builder
  }
}
