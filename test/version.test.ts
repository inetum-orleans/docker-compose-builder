import { assertFeatureSupported, Feature, greaterOrEqual, isFeatureSupported, Version } from '../src'

describe('Version', () => {
  it('can compare version properly', () => {
    expect(greaterOrEqual(Version.v24, Version.v24)).toBeTruthy()
    expect(greaterOrEqual(Version.v24, Version.v23)).toBeTruthy()
    expect(greaterOrEqual(Version.v24, Version.v22)).toBeTruthy()
    expect(greaterOrEqual(Version.v24, Version.v21)).toBeTruthy()
    expect(greaterOrEqual(Version.v24, Version.v20)).toBeTruthy()

    expect(greaterOrEqual(Version.v1, Version.v1)).toBeTruthy()

    expect(greaterOrEqual(Version.v32, Version.v32)).toBeTruthy()

    expect(() => greaterOrEqual('ble' as Version, 'bla' as Version)).toThrow()
  })

  it('throws an error when comparing version from different lines', () => {
    expect(() => greaterOrEqual(Version.v1, Version.v37)).toThrow()
    expect(() => greaterOrEqual(Version.v22, Version.v37)).toThrow()
    expect(() => greaterOrEqual(Version.v24, Version.v22)).not.toThrow()
  })

  it('checks if feature is supported', () => {
    expect(isFeatureSupported(Feature.init, Version.v1)).toBeFalsy()
    expect(isFeatureSupported(Feature.init, Version.v20)).toBeFalsy()
    expect(isFeatureSupported(Feature.init, Version.v22)).toBeTruthy()
    expect(isFeatureSupported(Feature.init, Version.v31)).toBeFalsy()
    expect(isFeatureSupported(Feature.init, Version.v37)).toBeTruthy()

    expect(isFeatureSupported('bla' as Feature, Version.v37)).toBeTruthy()
  })

  it('assert feature is supported', () => {
    expect(() => assertFeatureSupported(Feature.init, Version.v20)).toThrow(
      `Feature 'init' is not supported in version '2.0'. You should consider upgrading to version '2.2'.`
    )
  })
})
