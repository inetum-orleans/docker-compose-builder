import { ConfigBuilder } from './config'
import { ServiceBuilder } from './service/service'
import { ServiceWithBuilder } from './service/with'
import { ServiceVolumeBuilder } from './service/volume'
import { Config } from './builder'
import { ConfigBuilderOptions } from './options'
import { Version } from './version'

export function defaultFactory(version: Version) {
  return new DefaultBuilderFactory()
}

export interface BuilderFactory<
  C = Config,
  CB extends ConfigBuilder = ConfigBuilder,
  SB extends ServiceBuilder = ServiceBuilder,
  SWB extends ServiceWithBuilder = ServiceWithBuilder,
  SVB extends ServiceVolumeBuilder = ServiceVolumeBuilder
> {
  builder(config: C, options: ConfigBuilderOptions): CB

  serviceBuilder(configBuilder: CB, name: string): SB

  serviceWithBuilder(serviceBuilder: SB): SWB

  serviceVolumeBuilder(serviceBuilder: SB): SVB
}

export class DefaultBuilderFactory<
  C extends Config = Config,
  CB extends ConfigBuilder = ConfigBuilder,
  SB extends ServiceBuilder = ServiceBuilder,
  SWB extends ServiceWithBuilder = ServiceWithBuilder,
  SVB extends ServiceVolumeBuilder = ServiceVolumeBuilder
> implements BuilderFactory<C, CB, SB, SWB, SVB> {
  builder(config: C, options: ConfigBuilderOptions): CB {
    return new ConfigBuilder(config, options, this) as CB
  }

  serviceBuilder(configBuilder: CB, name: string): SB {
    return new ServiceBuilder(configBuilder, name) as SB
  }

  serviceWithBuilder(serviceBuilder: SB): SWB {
    return new ServiceWithBuilder(serviceBuilder) as SWB
  }

  serviceVolumeBuilder(serviceBuilder: SB): SVB {
    return new ServiceVolumeBuilder(serviceBuilder) as SVB
  }
}
