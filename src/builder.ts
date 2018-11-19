import { Version } from './version'
import {
  ConfigSchemaV24Json,
  DefinitionsNetwork as DefinitionsNetworkV24,
  DefinitionsService as DefinitionsServiceV24,
  DefinitionsVolume as DefinitionsVolumeV24
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v2.4'

import {
  ConfigSchemaV37Json,
  DefinitionsNetwork as DefinitionsNetworkV37,
  DefinitionsService as DefinitionsServiceV37,
  DefinitionsVolume as DefinitionsVolumeV37
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.7'

import { ConfigBuilder } from './config'
import { ConfigBuilderOptions, DefaultConfigBuilderOptions } from './options'
import { BuilderFactory, defaultFactory } from './factory'

export type ConfigV2x = ConfigSchemaV24Json

export type ConfigV3x = ConfigSchemaV37Json

export type ConfigVx = ConfigV2x | ConfigV3x

export type ConfigV2 = ConfigSchemaV24Json
export type ConfigV3 = ConfigSchemaV37Json

export type ServiceV2 = DefinitionsServiceV24
export type ServiceV3 = DefinitionsServiceV37

export type NetworkV2 = DefinitionsNetworkV24
export type NetworkV3 = DefinitionsNetworkV37

export type VolumeV2 = DefinitionsVolumeV24
export type VolumeV3 = DefinitionsVolumeV37

export type Config = ConfigV2 & ConfigV3
export type Service = ServiceV2 & ServiceV3
export type Network = NetworkV2 & NetworkV3
export type Volume = VolumeV2 & VolumeV3

export interface ConfigItemContainer<I> {
  readonly item: I

  merge(item: Partial<I>): this
  assign(item: Partial<I>): this
}

export interface ExtensionConstructor<E extends Extension> {
  new (builder: any): E
}

export interface Extension {}

export interface ExtensionSupport {
  ext<E extends Extension>(ext: ExtensionConstructor<E>): E
}

export interface ConfigBuilderItem<I> extends ConfigItemContainer<I>, ExtensionSupport {
  readonly options: ConfigBuilderOptions
  get(): Config
}

export interface ConfigBuilderChild<I, P> extends ConfigBuilderItem<I> {
  readonly and: P
}

export function newBuilder(
  config?: Config,
  options: ConfigBuilderOptions = new DefaultConfigBuilderOptions(),
  factory: (v: Version) => BuilderFactory<Config> = defaultFactory
): ConfigBuilder {
  if (!config) {
    config = { version: options.version }
  }

  if (!config.version) {
    config.version = options.version
  }

  const builderFactory = factory(config.version as Version)
  return builderFactory.builder(config, options)
}
