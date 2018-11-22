import { Config, Service } from '../builder'
import { ServiceBuilder } from './service'

export class ServiceVolumeBuilder {
  private item: Service
  private config: Config

  constructor(private builder: ServiceBuilder) {
    this.item = builder.item
    this.config = builder.get()
  }

  project(containerDir: string, mountOptions: string = ''): ServiceBuilder {
    this.addVolume(this.builder.options.projectDir, containerDir, mountOptions)
    return this.builder
  }

  relative(filepath: string, containerDir: string, mountOptions: string = ''): ServiceBuilder {
    const directory = this.builder.options.serviceDir(this.builder.name)
    if (directory) {
      filepath = `${directory}/${filepath}`
    }
    this.addVolume(filepath, containerDir, mountOptions)
    return this.builder
  }

  add(filepath: string, containerDir: string, mountOptions: string = ''): ServiceBuilder {
    this.addVolume(filepath, containerDir, mountOptions)
    return this.builder
  }

  named(volumeName: string, containerDir: string, mountOptions: string = ''): ServiceBuilder {
    this.addVolume(volumeName, containerDir, mountOptions)

    if (!this.config.volumes) {
      this.config.volumes = {}
    }
    this.config.volumes[volumeName] = null

    return this.builder
  }

  from(service: string, ...services: string[]) {
    if (!this.builder.item.volumes_from) {
      this.builder.item.volumes_from = []
    }

    this.builder.item.volumes_from.push(service)
    if (services) {
      this.builder.item.volumes_from.push(...services)
    }
  }

  private addVolume(volumeName: string, containerDir: string, mountOptions: string = '') {
    if (!this.item.volumes) {
      this.item.volumes = []
    }

    let volumeSpec = `${volumeName}:${containerDir}`
    if (mountOptions) {
      volumeSpec = `${volumeSpec}:${mountOptions}`
    }
    this.item.volumes.push(volumeSpec)
  }
}
