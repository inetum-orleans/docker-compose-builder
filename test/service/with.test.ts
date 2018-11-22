import {
  BuilderFactory,
  Config,
  ConfigBuilder,
  ConfigBuilderOptions,
  DefaultBuilderFactory,
  DefaultConfigBuilderOptions,
  ServiceBuilder,
  ServiceWithBuilder,
  Version
} from '../../src'

describe('ServiceWithBuilder', () => {
  let config: Config
  let options: ConfigBuilderOptions
  let factory: BuilderFactory
  let configBuilder: ConfigBuilder
  let serviceBuilder: ServiceBuilder
  let serviceWithBuilder: ServiceWithBuilder

  beforeEach(() => {
    config = { version: Version.v20 }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)
    serviceBuilder = new ServiceBuilder(configBuilder, 'test')
    serviceWithBuilder = new ServiceWithBuilder(serviceBuilder)
  })

  it('defaults', () => {
    serviceWithBuilder.default()

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          build: 'test/Dockerfile',
          image: 'test',
          restart: 'unless-stopped'
        }
      }
    })
  })

  it('defaults with restart as string', () => {
    serviceWithBuilder.default({ restart: 'no' })

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          build: 'test/Dockerfile',
          image: 'test',
          restart: 'no'
        }
      }
    })
  })

  it('defaults with custom service name and image', () => {
    serviceWithBuilder.default({ restart: 'no', name: 'service', image: 'image' })

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          build: 'service/Dockerfile',
          image: 'image',
          restart: 'no'
        }
      }
    })
  })

  it('defaults with restart as boolean', () => {
    serviceWithBuilder.default({ restart: false })

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          build: 'test/Dockerfile',
          image: 'test'
        }
      }
    })
  })

  it('defaults with version supporting init', () => {
    config.version = '2.2'

    serviceWithBuilder.default()

    expect(serviceBuilder.get()).toEqual({
      version: '2.2',
      services: {
        test: {
          build: 'test/Dockerfile',
          image: 'test',
          restart: 'unless-stopped',
          init: true
        }
      }
    })
  })
})
