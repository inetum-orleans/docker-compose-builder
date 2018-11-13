import { Config, ConfigBuilderItem, Network, Volume } from './builder'

import { ServiceBuilder } from './service'
import { ConfigBuilderOptions } from './options'
import { BuilderFactory } from './factory'

export class ConfigBuilder implements ConfigBuilderItem<Config> {
  constructor(
    public readonly item: Config,
    public readonly options: ConfigBuilderOptions,
    public readonly factory: BuilderFactory<Config>
  ) {}

  get() {
    return this.item
  }

  service(name: string): ServiceBuilder {
    return this.factory.serviceBuilder(this, name)
  }

  network(name: string, options: Network = {}): this {
    if (!this.item.networks) {
      this.item.networks = {}
    }
    this.item.networks[name] = options
    return this
  }

  volume(name: string, options: Volume = null): this {
    if (!this.item.volumes) {
      this.item.volumes = {}
    }

    this.item.volumes[name] = options
    return this
  }
}
