import { ConfigBuilder } from './config'
import { ServiceBuilder, ServiceWithBuilder, ServiceVolumeBuilder } from './service'

import { Config } from './builder'
import { ConfigBuilderOptions } from './options'
import { Version } from './version'

export function defaultFactory(version: Version) {
  return new DefaultBuilderFactory()
}

export interface BuilderFactory<C = Config> {
  builder(config: C, options: ConfigBuilderOptions): ConfigBuilder

  serviceBuilder(configBuilder: ConfigBuilder, name: string): ServiceBuilder

  serviceWithBuilder(serviceBuilder: ServiceBuilder): ServiceWithBuilder

  serviceVolumeBuilder(serviceBuilder: ServiceBuilder): ServiceVolumeBuilder
}

export class DefaultBuilderFactory<C extends Config = Config> implements BuilderFactory<C> {
  builder(config: C, options: ConfigBuilderOptions): ConfigBuilder {
    return new ConfigBuilder(config, options, this)
  }

  serviceBuilder(configBuilder: ConfigBuilder, name: string): ServiceBuilder {
    return new ServiceBuilder(configBuilder, name)
  }

  serviceWithBuilder(serviceBuilder: ServiceBuilder): ServiceWithBuilder {
    return new ServiceWithBuilder(serviceBuilder)
  }

  serviceVolumeBuilder(serviceBuilder: ServiceBuilder): ServiceVolumeBuilder {
    return new ServiceVolumeBuilder(serviceBuilder)
  }
}
