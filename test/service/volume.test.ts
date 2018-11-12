import {
  BuilderFactory,
  Config,
  ConfigBuilder,
  ConfigBuilderOptions,
  DefaultBuilderFactory,
  DefaultConfigBuilderOptions,
  ServiceBuilder,
  ServiceVolumeBuilder,
  Version
} from '../../src'

describe('ServiceVolumeBuilder', () => {
  let config: Config
  let options: ConfigBuilderOptions
  let factory: BuilderFactory
  let configBuilder: ConfigBuilder
  let serviceBuilder: ServiceBuilder
  let serviceVolumeBuilder: ServiceVolumeBuilder

  beforeEach(() => {
    config = { version: Version.v20 }
    options = new DefaultConfigBuilderOptions()
    factory = new DefaultBuilderFactory()
    configBuilder = new ConfigBuilder(config, options, factory)
    serviceBuilder = new ServiceBuilder(configBuilder, 'test')
    serviceVolumeBuilder = new ServiceVolumeBuilder(serviceBuilder)
  })

  it('project', () => {
    serviceVolumeBuilder.project('/etc/test')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes: ['.:/etc/test']
        }
      }
    })
  })

  it('project with ro mount option', () => {
    serviceVolumeBuilder.project('/etc/test', 'ro')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes: ['.:/etc/test:ro']
        }
      }
    })
  })

  it('project with custom projectDir in options', () => {
    options.projectDir = '/project'

    serviceVolumeBuilder.project('/etc/test')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes: ['/project:/etc/test']
        }
      }
    })
  })

  it('named', () => {
    options.projectDir = '/project'

    serviceVolumeBuilder.named('test', '/etc/test')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes: ['test:/etc/test']
        }
      },
      volumes: {
        test: null
      }
    })
  })

  it('named with ro mount option', () => {
    options.projectDir = '/project'

    serviceVolumeBuilder.named('test', '/etc/test')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes: ['test:/etc/test']
        }
      },
      volumes: {
        test: null
      }
    })
  })

  it('relative', () => {
    serviceVolumeBuilder.relative('path', '/etc/test')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes: ['./test/path:/etc/test']
        }
      }
    })
  })

  it('relative with custom projectDir in options', () => {
    options.projectDir = '/project'

    serviceVolumeBuilder.relative('path', '/etc/test')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes: ['/project/test/path:/etc/test']
        }
      }
    })
  })

  it('from', () => {
    serviceVolumeBuilder.from('other')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes_from: ['other']
        }
      }
    })
  })

  it('from with many containers', () => {
    serviceVolumeBuilder.from('other', 'other2', 'other3')

    expect(serviceBuilder.get()).toEqual({
      version: '2.0',
      services: {
        test: {
          volumes_from: ['other', 'other2', 'other3']
        }
      }
    })
  })
})
