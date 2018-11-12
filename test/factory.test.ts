import createMockInstance from 'jest-create-mock-instance'

import {
  BuilderFactory,
  DefaultBuilderFactory,
  defaultFactory
} from '../src/factory'
import { Config } from '../src/builder'
import { ConfigBuilder } from '../src/config'
import { ServiceBuilder } from '../src/service/service'
import { ServiceWithBuilder } from '../src/service/with'
import { ServiceVolumeBuilder } from '../src/service/volume'
import { DefaultConfigBuilderOptions } from '../src/options'
import { Version } from '../src/version'

describe('defaultFactory', () => {
  it('creates a new DefaultBuilderFactory instance with default initial config and options', () => {
    const factory = defaultFactory(Version.v20)
    expect(factory).toBeInstanceOf(DefaultBuilderFactory)
  })
})

describe('DefaultBuilderFactory', () => {
  let factory: BuilderFactory<
    Config,
    ConfigBuilder,
    ServiceBuilder,
    ServiceWithBuilder,
    ServiceVolumeBuilder
  >

  beforeAll(() => {
    factory = new DefaultBuilderFactory()
  })

  it('creates a new ConfigBuilder', () => {
    const config = { version: Version.v20 }
    const options = new DefaultConfigBuilderOptions()

    const configBuilder = factory.builder(config, options)
    expect(configBuilder).toBeInstanceOf(ConfigBuilder)
  })

  it('creates a new ServiceBuilder', () => {
    const config = { version: Version.v20 }
    const options = new DefaultConfigBuilderOptions()
    const configBuilder = new ConfigBuilder(config, options, factory)

    const serviceBuilder = factory.serviceBuilder(configBuilder, 'testService')
    expect(serviceBuilder).toBeInstanceOf(ServiceBuilder)
  })

  it('creates a new ServiceWithBuilder', () => {
    const serviceBuilder = createMockInstance(ServiceBuilder)

    const serviceWithBuilder = factory.serviceWithBuilder(serviceBuilder)
    expect(serviceWithBuilder).toBeInstanceOf(ServiceWithBuilder)
  })

  it('creates a new ServiceVolumeBuilder', () => {
    const serviceBuilder = createMockInstance(ServiceBuilder)

    const configWithBuilder = factory.serviceVolumeBuilder(serviceBuilder)
    expect(configWithBuilder).toBeInstanceOf(ServiceVolumeBuilder)
  })
})
