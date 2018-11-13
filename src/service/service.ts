import { Config, ConfigBuilderChild, Network, Service } from '../builder'
import { ConfigBuilder } from '../config'
import { ServiceWithBuilder } from './with'
import { ServiceVolumeBuilder } from './volume'
import { ConfigBuilderOptions } from '../options'
import { assertFeatureSupported, Feature, Version } from '../version'

export type EnvValue = string | number | null

export class ServiceBuilder implements ConfigBuilderChild<Service, ConfigBuilder> {
  public readonly item: Service

  constructor(private readonly parent: ConfigBuilder, public readonly name: string) {
    if (!parent.item.services) {
      parent.item.services = {}
    }

    if (!parent.item.services[name]) {
      parent.item.services[name] = {}
    }

    this.item = parent.item.services[name]
  }

  get options(): ConfigBuilderOptions {
    return this.parent.options
  }

  get(): Config {
    return this.parent.item
  }

  get and(): ConfigBuilder {
    return this.parent
  }

  get with(): ServiceWithBuilder {
    return this.parent.factory.serviceWithBuilder(this)
  }

  get volume(): ServiceVolumeBuilder {
    return this.parent.factory.serviceVolumeBuilder(this)
  }

  build(): this {
    this.item.build = this.options.buildConfiguration(this.name)
    return this
  }

  image(): this {
    this.item.image = this.options.imageName(this.name)
    return this
  }

  init(): this {
    assertFeatureSupported(Feature.init, this.get().version as Version)
    this.item.init = true
    return this
  }

  restart(value: string = this.options.restart): this {
    this.item.restart = value
    return this
  }

  env(envOrKey: { [key: string]: EnvValue } | string, value?: EnvValue): this {
    return this.environment(envOrKey, value)
  }

  environment(envOrKey: { [key: string]: EnvValue } | string, value?: EnvValue): this {
    if (typeof envOrKey === 'object') {
      for (const key of Object.keys(envOrKey)) {
        this.addEnvironment(key, envOrKey[key])
      }
    } else {
      this.addEnvironment(envOrKey, value)
    }
    return this
  }

  net(name: string, options: Network = {}, withDefault: boolean = true): this {
    return this.network(name, options, withDefault)
  }

  network(name: string, options: Network = {}, withDefault: boolean = true): this {
    if (withDefault) {
      this.addNetwork('default')
    }
    this.addNetwork(name)

    this.parent.network(name, options)

    return this
  }

  port(port: string | number): this {
    if (!this.item.ports) {
      this.item.ports = []
    }

    let effectivePort = port
    if (this.options.portPrefix) {
      effectivePort = '' + effectivePort
      const portItems = effectivePort.split(':', 3)
      if (portItems.length === 1) {
        const mapped = this.prependPortPrefix(portItems[0], this.options.portPrefix)
        effectivePort = `${mapped}:${portItems[0]}`
      } else if (portItems.length === 2) {
        const mapped = this.prependPortPrefix(portItems[0], this.options.portPrefix)
        effectivePort = `${mapped}:${portItems[1]}`
      } else if (portItems.length === 3) {
        const mapped = this.prependPortPrefix(portItems[1], this.options.portPrefix)
        effectivePort = `${portItems[0]}:${mapped}:${portItems[2]}`
      }
    }

    this.item.ports.push(effectivePort)
    return this
  }

  user(user: string = this.options.user): this {
    this.item.user = user
    return this
  }

  private prependPortPrefix(portOrRange: string, portPrefix: string) {
    const portOrRangeSplit = portOrRange.split('-', 2)

    if (portOrRangeSplit.length === 2) {
      const start = portOrRangeSplit[0]
      const end = portOrRangeSplit[1]
      return `${portPrefix}${start}-${portPrefix}${end}`
    } else {
      return `${portPrefix}${portOrRange}`
    }
  }

  private addNetwork(name: string) {
    if (!this.item.networks) {
      this.item.networks = []
    }

    const networks = this.item.networks
    if (Array.isArray(networks)) {
      networks.push(name)
    } else {
      networks[name] = null
    }
  }

  private addEnvironment(key: string, value?: EnvValue) {
    if (!this.item.environment) {
      this.item.environment = []
    }

    const environment = this.item.environment
    if (Array.isArray(environment)) {
      if (value) {
        environment.push(`${key}=${value}`)
      } else {
        environment.push(key)
      }
    } else {
      environment[key] = value === undefined ? null : value
    }
  }
}
