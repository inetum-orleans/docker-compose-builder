import { Version } from './version'
import {
  ConfigSchemaV20Json,
  DefinitionsNetwork as DefinitionsNetworkV20,
  DefinitionsService as DefinitionsServiceV20,
  DefinitionsVolume as DefinitionsVolumeV20
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v2.0'
import {
  ConfigSchemaV21Json,
  DefinitionsNetwork as DefinitionsNetworkV21,
  DefinitionsService as DefinitionsServiceV21,
  DefinitionsVolume as DefinitionsVolumeV21
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v2.1'
import {
  ConfigSchemaV22Json,
  DefinitionsNetwork as DefinitionsNetworkV22,
  DefinitionsService as DefinitionsServiceV22,
  DefinitionsVolume as DefinitionsVolumeV22
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v2.2'
import {
  ConfigSchemaV23Json,
  DefinitionsNetwork as DefinitionsNetworkV23,
  DefinitionsService as DefinitionsServiceV23,
  DefinitionsVolume as DefinitionsVolumeV23
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v2.3'
import {
  ConfigSchemaV24Json,
  DefinitionsNetwork as DefinitionsNetworkV24,
  DefinitionsService as DefinitionsServiceV24,
  DefinitionsVolume as DefinitionsVolumeV24
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v2.4'

import {
  ConfigSchemaV30Json,
  DefinitionsNetwork as DefinitionsNetworkV30,
  DefinitionsService as DefinitionsServiceV30,
  DefinitionsVolume as DefinitionsVolumeV30
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.0'
import {
  ConfigSchemaV31Json,
  DefinitionsNetwork as DefinitionsNetworkV31,
  DefinitionsService as DefinitionsServiceV31,
  DefinitionsVolume as DefinitionsVolumeV31
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.1'
import {
  ConfigSchemaV32Json,
  DefinitionsNetwork as DefinitionsNetworkV32,
  DefinitionsService as DefinitionsServiceV32,
  DefinitionsVolume as DefinitionsVolumeV32
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.2'
import {
  ConfigSchemaV33Json,
  DefinitionsNetwork as DefinitionsNetworkV33,
  DefinitionsService as DefinitionsServiceV33,
  DefinitionsVolume as DefinitionsVolumeV33
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.3'
import {
  ConfigSchemaV34Json,
  DefinitionsNetwork as DefinitionsNetworkV34,
  DefinitionsService as DefinitionsServiceV34,
  DefinitionsVolume as DefinitionsVolumeV34
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.4'
import {
  ConfigSchemaV35Json,
  DefinitionsNetwork as DefinitionsNetworkV35,
  DefinitionsService as DefinitionsServiceV35,
  DefinitionsVolume as DefinitionsVolumeV35
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.5'
import {
  ConfigSchemaV36Json,
  DefinitionsNetwork as DefinitionsNetworkV36,
  DefinitionsService as DefinitionsServiceV36,
  DefinitionsVolume as DefinitionsVolumeV36
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.6'
import {
  ConfigSchemaV37Json,
  DefinitionsNetwork as DefinitionsNetworkV37,
  DefinitionsService as DefinitionsServiceV37,
  DefinitionsVolume as DefinitionsVolumeV37
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v3.7'

import { ConfigBuilder } from './config'
import { ConfigBuilderOptions, DefaultConfigBuilderOptions } from './options'
import { BuilderFactory, defaultFactory } from './factory'

export type ConfigV2x =
  | ConfigSchemaV20Json
  | ConfigSchemaV21Json
  | ConfigSchemaV22Json
  | ConfigSchemaV23Json
  | ConfigSchemaV24Json

export type ConfigV3x =
  | ConfigSchemaV30Json
  | ConfigSchemaV31Json
  | ConfigSchemaV32Json
  | ConfigSchemaV33Json
  | ConfigSchemaV34Json
  | ConfigSchemaV35Json
  | ConfigSchemaV36Json
  | ConfigSchemaV37Json

export type ConfigVx = ConfigV2x | ConfigV3x

export type ConfigV2 = ConfigSchemaV20Json &
  ConfigSchemaV21Json &
  ConfigSchemaV22Json &
  ConfigSchemaV23Json &
  ConfigSchemaV24Json
export type ConfigV3 = ConfigSchemaV30Json &
  ConfigSchemaV31Json &
  ConfigSchemaV32Json &
  ConfigSchemaV33Json &
  ConfigSchemaV34Json &
  ConfigSchemaV35Json &
  ConfigSchemaV36Json &
  ConfigSchemaV37Json

export type ServiceV2 = DefinitionsServiceV20 &
  DefinitionsServiceV21 &
  DefinitionsServiceV22 &
  DefinitionsServiceV23 &
  DefinitionsServiceV24
export type ServiceV3 = DefinitionsServiceV30 &
  DefinitionsServiceV31 &
  DefinitionsServiceV32 &
  DefinitionsServiceV33 &
  DefinitionsServiceV34 &
  DefinitionsServiceV35 &
  DefinitionsServiceV36 &
  DefinitionsServiceV37

export type NetworkV2 = DefinitionsNetworkV20 &
  DefinitionsNetworkV21 &
  DefinitionsNetworkV22 &
  DefinitionsNetworkV23 &
  DefinitionsNetworkV24
export type NetworkV3 = DefinitionsNetworkV30 &
  DefinitionsNetworkV31 &
  DefinitionsNetworkV32 &
  DefinitionsNetworkV33 &
  DefinitionsNetworkV34 &
  DefinitionsNetworkV35 &
  DefinitionsNetworkV36 &
  DefinitionsNetworkV37

export type VolumeV2 = DefinitionsVolumeV20 &
  DefinitionsVolumeV21 &
  DefinitionsVolumeV22 &
  DefinitionsVolumeV23 &
  DefinitionsVolumeV24
export type VolumeV3 = DefinitionsVolumeV30 &
  DefinitionsVolumeV31 &
  DefinitionsVolumeV32 &
  DefinitionsVolumeV33 &
  DefinitionsVolumeV34 &
  DefinitionsVolumeV35 &
  DefinitionsVolumeV36 &
  DefinitionsVolumeV37

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
