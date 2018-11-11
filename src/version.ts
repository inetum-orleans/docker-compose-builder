export enum Version {
  v1 = '1',
  v20 = '2.0',
  v21 = '2.1',
  v22 = '2.2',
  v23 = '2.3',
  v24 = '2.4',
  v30 = '3.0',
  v31 = '3.1',
  v32 = '3.2',
  v33 = '3.3',
  v34 = '3.4',
  v35 = '3.5',
  v36 = '3.6',
  v37 = '3.7'
}

export const versionLine1: Version[] = [Version.v1]

export const versionLine2: Version[] = [
  Version.v20,
  Version.v21,
  Version.v22,
  Version.v23,
  Version.v24
]

export const versionLine3: Version[] = [
  Version.v30,
  Version.v31,
  Version.v32,
  Version.v33,
  Version.v34,
  Version.v35,
  Version.v36,
  Version.v37
]

export enum Feature {
  init = 'init'
}

export function getVersionLine(version: Version): Version[] {
  if (versionLine3.indexOf(version) > -1) {
    return versionLine3
  }
  if (versionLine2.indexOf(version) > -1) {
    return versionLine2
  }
  if (versionLine1.indexOf(version) > -1) {
    return versionLine1
  }
  throw new Error(`Can\'t find version line for ${version}`)
}

export function greaterOrEqual(version: Version, thanVersion: Version) {
  const versionLine = getVersionLine(version)
  const versionIndex = versionLine.indexOf(version)

  const thanVersionIndex = versionLine.indexOf(thanVersion)
  if (thanVersionIndex <= -1) {
    throw new Error(`${version} can't be compared to ${thanVersion}`)
  }

  return versionIndex >= thanVersionIndex
}

const supportedFeatureFrom: {
  [feature: string]: [Version | null, Version | null, Version | null]
} = {
  [Feature.init]: [null, Version.v22, Version.v37]
}

export function isFeatureSupported(
  feature: Feature,
  version: Version,
  throwIfUnsupported: boolean = false
) {
  const versions = supportedFeatureFrom[feature]
  if (!versions) {
    return true
  }

  const versionLine = getVersionLine(version)

  let supportedVersion: Version | null = null
  if (versionLine === versionLine3) {
    supportedVersion = versions[2]
  } else if (versionLine === versionLine2) {
    supportedVersion = versions[1]
  } else if (versionLine === versionLine1) {
    supportedVersion = versions[0]
  }

  if (!supportedVersion) {
    return false
  }

  const supported = greaterOrEqual(version, supportedVersion)

  if (!supported && throwIfUnsupported) {
    throw new UnsupportedFeatureError(feature, version, supportedVersion)
  }
  return supported
}

export function assertFeatureSupported(feature: Feature, version: Version) {
  return isFeatureSupported(feature, version, true)
}

export class UnsupportedFeatureError extends Error {
  constructor(feature: Feature, version: Version, supportedVersion: Version) {
    super(
      `Feature '${feature}' is not supported in version '${version}'. You should consider upgrading to version '${supportedVersion}'.`
    )
  }
}
