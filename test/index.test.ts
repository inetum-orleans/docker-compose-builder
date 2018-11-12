import {
  BuilderFactory,
  ConfigBuilder,
  DefaultBuilderFactory,
  DefaultConfigBuilderOptions,
  newBuilder,
  ServiceBuilder,
  ServiceWithBuilder,
  Version
} from '../src'

describe('newBuilder', () => {
  it('creates a new ConfigBuilder instance with default initial config, options and factory', () => {
    expect(newBuilder).toBeDefined()
    const builder = newBuilder()
    expect(builder).toBeInstanceOf(ConfigBuilder)
    expect(builder.factory).toBeInstanceOf(DefaultBuilderFactory)
    expect(builder.item).toEqual({ version: Version.v20 })
    expect(builder.options).toBeInstanceOf(DefaultConfigBuilderOptions)
  })

  it('creates a new ConfigBuilder instance with custom initial config, options and factory', () => {
    expect(newBuilder).toBeDefined()

    class CustomOptions extends DefaultConfigBuilderOptions {
      user: string = 'testUser'
    }

    class CustomServiceWithBuilder extends ServiceWithBuilder {
      constructor(builder: ServiceBuilder) {
        super(builder)
      }

      yolo() {
        return 42
      }
    }

    class CustomBuilderFactory extends DefaultBuilderFactory {
      constructor() {
        super()
      }

      serviceWithBuilder = (serviceBuilder: ServiceBuilder) =>
        new CustomServiceWithBuilder(serviceBuilder)
    }

    const customFactory: (version: Version) => BuilderFactory = version => {
      return new CustomBuilderFactory()
    }

    const builder = newBuilder(
      { version: Version.v37 },
      new CustomOptions(),
      customFactory
    )
    expect(builder).toBeInstanceOf(ConfigBuilder)
    expect(builder.options).toBeInstanceOf(CustomOptions)
    expect(builder.factory).toBeInstanceOf(CustomBuilderFactory)

    const config = builder
      .service('test')
      .user()
      .get()
    expect(config.services).toBeDefined()
    expect(Object.keys(config.services!)).toEqual(['test'])

    expect(config.services!['test'].user).toBeDefined()
    expect(config.services!['test'].user).toBe('testUser')

    expect((builder.service('test').with as any).yolo()).toBe(42)
  })

  it('sets default version', () => {
    const builder = newBuilder()
    expect(builder.get().version).toBe(builder.options.version)
  })

  it('sets version from version defined in options', () => {
    class CustomOptions extends DefaultConfigBuilderOptions {
      version: Version = Version.v35
    }

    const builder = newBuilder({} as any, new CustomOptions())
    expect(builder.get().version).toBe(Version.v35)
  })
})
