import {
  BuilderFactory,
  Config,
  ConfigBuilder,
  ConfigBuilderOptions,
  DefaultBuilderFactory,
  DefaultConfigBuilderOptions,
  Extension,
  ServiceBuilder,
  Version
} from '../src'

class TestExt implements Extension {
  constructor(private parent: ConfigBuilder) {}

  custom() {
    this.parent.network('test', { external: true })
  }
}

describe('ConfigBuilder', () => {
  let config: Config
  let options: ConfigBuilderOptions
  let factory: BuilderFactory
  let configBuilder: ConfigBuilder

  beforeEach(() => {
    config = { version: Version.v20 }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)
  })

  it('gets the current config', () => {
    expect(configBuilder.get()).toBe(config)
  })

  it('merge another config', () => {
    config = { version: Version.v20, networks: { test: { external: true } } }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)

    configBuilder.merge({ networks: { test2: { external: false } } })
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      networks: { test: { external: true }, test2: { external: false } }
    })
  })

  it('assign another config', () => {
    config = { version: Version.v20, networks: { test: { external: true } } }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)

    configBuilder.assign({ networks: { test2: { external: false } } })
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      networks: { test2: { external: false } }
    })
  })

  it('supports ext', () => {
    configBuilder.ext(TestExt).custom()

    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      networks: { test: { external: true } }
    })
  })

  it('creates a service', () => {
    const serviceBuilder = configBuilder.service('test')
    expect(serviceBuilder).toBeInstanceOf(ServiceBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      services: { test: {} }
    })
  })

  it('creates many services', () => {
    const serviceBuilder = configBuilder.service('one').and.service('two')
    expect(serviceBuilder).toBeInstanceOf(ServiceBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      services: { one: {}, two: {} }
    })
  })

  it('creates a network', () => {
    const response = configBuilder.network('test')
    expect(response).toBe(configBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      networks: { test: {} }
    })
  })

  it('creates a network with custom options', () => {
    const response = configBuilder.network('test', { external: true })
    expect(response).toBe(configBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      networks: { test: { external: true } }
    })
  })

  it('creates many networks', () => {
    const response = configBuilder.network('one', { external: true }).network('two', { driver: 'testing' })
    expect(response).toBe(configBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      networks: { one: { external: true }, two: { driver: 'testing' } }
    })
  })

  it('creates a volume', () => {
    const response = configBuilder.volume('test')
    expect(response).toBe(configBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      volumes: { test: null }
    })
  })

  it('creates a volume with custom options', () => {
    const response = configBuilder.volume('test', { volumeOption: 'opt' })
    expect(response).toBe(configBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      volumes: { test: { volumeOption: 'opt' } }
    })
  })

  it('creates many volumes', () => {
    const response = configBuilder.volume('one', { volumeOption: 'opt1' }).volume('two', { bla: 'opt2' })
    expect(response).toBe(configBuilder)
    expect(configBuilder.get()).toEqual({
      version: Version.v20,
      volumes: { one: { volumeOption: 'opt1' }, two: { bla: 'opt2' } }
    })
  })
})
