import {
  Labels,
  ListOfStrings,
  ListOrDict
} from '@gfi-centre-ouest/docker-compose-spec-typescript/lib/docker-compose-spec-v2.0'
import { Version } from './version'

export type BuildDefinition = string | {
  context?: string;
  dockerfile?: string;
  args?: ListOrDict;
  labels?: Labels;
  cache_from?: ListOfStrings;
  network?: string;
  isolation?: string;
}

export class DefaultConfigBuilderOptions implements ConfigBuilderOptions {
  version: Version = Version.v20
  user: string = '1000'
  restart: string = 'unless-stopped'
  projectDir: string = '.'
  portPrefix: string | null = null

  buildConfiguration: (name: string) => BuildDefinition = (name: string) => `${name}/Dockerfile`
  imageName: (name: string) => string = (name: string) => name
  serviceDir: (name: string) => string = (name: string) => `${this.projectDir}/${name}`
}

export interface ConfigBuilderOptions {
  version: Version
  user: string
  restart: string
  projectDir: string
  portPrefix: string | null

  buildConfiguration: (name: string) => BuildDefinition
  imageName: (name: string) => string
  serviceDir: (name: string) => string


}
