import { Config } from '../../src/builder'
import {
  ConfigBuilderOptions,
  DefaultConfigBuilderOptions
} from '../../src/options'
import { BuilderFactory, DefaultBuilderFactory } from '../../src/factory'
import { ConfigBuilder } from '../../src/config'
import { ServiceBuilder } from '../../src/service/service'
import { ServiceWithBuilder } from '../../src/service/with'
import { ServiceVolumeBuilder } from '../../src/service/volume'
import { Version } from '../../src/version'

describe('ServiceBuilder', () => {
  let config: Config
  let options: ConfigBuilderOptions
  let factory: BuilderFactory
  let configBuilder: ConfigBuilder
  let serviceBuilder: ServiceBuilder

  beforeEach(() => {
    config = { version: Version.v20 }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)
    serviceBuilder = new ServiceBuilder(configBuilder, 'test')
  })

  it('creates ServiceWithBuilder', () => {
    const serviceWithBuilder = serviceBuilder.with
    expect(serviceWithBuilder).toBeInstanceOf(ServiceWithBuilder)
  })

  it('creates ServiceVolumeBuilder', () => {
    const serviceVolumeBuilder = serviceBuilder.volume
    expect(serviceVolumeBuilder).toBeInstanceOf(ServiceVolumeBuilder)
  })

  it('adds build section', () => {
    const compose = serviceBuilder.build().get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          build: 'test/Dockerfile'
        }
      }
    })
  })

  it('adds build section using buildConfiguration option', () => {
    options.buildConfiguration = name => ({
      context: '.docker',
      dockerfile: `${name}/Dockerfile`
    })

    const compose = serviceBuilder.build().get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          build: { context: '.docker', dockerfile: 'test/Dockerfile' }
        }
      }
    })
  })

  it('adds image section', () => {
    const compose = serviceBuilder.image().get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          image: 'test'
        }
      }
    })
  })

  it('adds image section using imageName option', () => {
    options.imageName = name => `custom-registry/${name}`

    const compose = serviceBuilder.image().get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          image: 'custom-registry/test'
        }
      }
    })
  })

  it('fails to add init if not available in version 2', () => {
    expect(() => serviceBuilder.init()).toThrow(
      `Feature 'init' is not supported in version '2.0'. You should consider upgrading to version '2.2'.`
    )
  })

  it('fails to add init if not available in version 3', () => {
    config.version = Version.v30

    expect(() => serviceBuilder.init()).toThrow(
      `Feature 'init' is not supported in version '3.0'. You should consider upgrading to version '3.7'.`
    )
  })

  it('adds init if available in version', () => {
    config.version = Version.v22

    const compose = serviceBuilder.init().get()
    expect(compose).toEqual({
      version: Version.v22,
      services: {
        test: {
          init: true
        }
      }
    })
  })

  it('adds restart with unless-stopped as default value', () => {
    const compose = serviceBuilder.restart().get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          restart: 'unless-stopped'
        }
      }
    })
  })

  it('adds restart with given value', () => {
    const compose = serviceBuilder.restart('always').get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          restart: 'always'
        }
      }
    })
  })

  it('adds restart with default value from restart option', () => {
    options.restart = 'unless-stopped'

    const compose = serviceBuilder.restart().get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          restart: options.restart
        }
      }
    })
  })

  it('adds environment variable without value', () => {
    const compose = serviceBuilder.env('TEST_ENV').get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          environment: ['TEST_ENV']
        }
      }
    })
  })

  it('adds environment variable with value', () => {
    const compose = serviceBuilder.env('TEST_ENV', 'test_value').get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          environment: ['TEST_ENV=test_value']
        }
      }
    })
  })

  it('adds environment variable with object', () => {
    const compose = serviceBuilder.env({ TEST_ENV: 'test_value' }).get()
    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          environment: ['TEST_ENV=test_value']
        }
      }
    })
  })

  it('adds environment variable with existing variable as object', () => {
    config = {
      version: '2.0',
      services: {
        test: {
          environment: { EXISTING: 'TRUE' }
        }
      }
    }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)
    serviceBuilder = new ServiceBuilder(configBuilder, 'test')
    const compose = serviceBuilder.env({ TEST_ENV: 'test_value' }).get()

    expect(compose).toEqual({
      version: Version.v20,
      services: {
        test: {
          environment: { EXISTING: 'TRUE', TEST_ENV: 'test_value' }
        }
      }
    })
  })

  it('adds network with default options', () => {
    const compose = serviceBuilder.net('nginx-proxy').get()
    expect(compose).toEqual({
      version: '2.0',
      networks: { 'nginx-proxy': {} },
      services: {
        test: {
          networks: ['default', 'nginx-proxy']
        }
      }
    })
  })

  it('adds network with custom options', () => {
    const compose = serviceBuilder.net('nginx-proxy', { external: true }).get()
    expect(compose).toEqual({
      version: '2.0',
      networks: { 'nginx-proxy': { external: true } },
      services: {
        test: {
          networks: ['default', 'nginx-proxy']
        }
      }
    })
  })

  it('adds network without default', () => {
    const compose = serviceBuilder.net('nginx-proxy', {}, false).get()
    expect(compose).toEqual({
      version: '2.0',
      networks: { 'nginx-proxy': {} },
      services: {
        test: {
          networks: ['nginx-proxy']
        }
      }
    })
  })

  it('adds network with existing external as object', () => {
    config = {
      version: '2.0',
      networks: { existing: { external: true } },
      services: {
        test: {
          networks: { existing: null }
        }
      }
    }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)
    serviceBuilder = new ServiceBuilder(configBuilder, 'test')

    const compose = serviceBuilder.net('nginx-proxy', {}, false).get()
    expect(compose).toEqual({
      version: '2.0',
      networks: { existing: { external: true }, 'nginx-proxy': {} },
      services: {
        test: {
          networks: { existing: null, 'nginx-proxy': null }
        }
      }
    })
  })

  it('adds port as number', () => {
    const compose = serviceBuilder.port(80).get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: [80]
        }
      }
    })
  })

  it('adds port as string', () => {
    const compose = serviceBuilder.port('80').get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['80']
        }
      }
    })
  })

  it('adds port with portPrefix option', () => {
    options.portPrefix = '12'

    const compose = serviceBuilder.port(80).get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['1280:80']
        }
      }
    })
  })

  it('adds port mapping with portPrefix option', () => {
    options.portPrefix = '12'

    const compose = serviceBuilder.port('80:80').get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['1280:80']
        }
      }
    })
  })

  it('adds ip+port mapping with portPrefix option', () => {
    options.portPrefix = '12'

    const compose = serviceBuilder.port('192.168.1.1:80:80').get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['192.168.1.1:1280:80']
        }
      }
    })
  })

  it('adds port range', () => {
    const compose = serviceBuilder.port('5000-5100').get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['5000-5100']
        }
      }
    })
  })

  it('adds port range portPrefix option', () => {
    options.portPrefix = '12'

    const compose = serviceBuilder.port('5000-5100').get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['125000-125100:5000-5100']
        }
      }
    })
  })

  it('adds ip+port range', () => {
    const compose = serviceBuilder.port('192.168.1.1:5000-5100').get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['192.168.1.1:5000-5100']
        }
      }
    })
  })

  it('adds ip+port mapping range with portPrefix', () => {
    options.portPrefix = '12'

    const compose = serviceBuilder.port('192.168.1.1:5000-5100:5000-5100').get()
    expect(compose).toEqual({
      version: '2.0',
      services: {
        test: {
          ports: ['192.168.1.1:125000-125100:5000-5100']
        }
      }
    })
  })
})
