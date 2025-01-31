import { setExternalLogs } from '../setExternalLogs'
import { getNamespace } from 'cls-hooked'

jest.mock('cls-hooked', () => {
  const mNamespace = {
    get: jest.fn(),
    set: jest.fn(),
  }
  return {
    getNamespace: jest.fn(() => mNamespace),
  }
})
describe('setExternalLogs', () => {
  test('Should set externalLog with success when namespace is []', () => {
    const fakeLog = {
      data: {
        name: 'any_name',
        phone: 'any_phone',
      },
    }

    jest.spyOn(getNamespace('externalLogs'), 'get').mockReturnValueOnce([])

    setExternalLogs({ externalLog: fakeLog, externalName: 'external_api' })

    expect(getNamespace).toHaveBeenCalledWith('scoped-request')
    expect(getNamespace('externalLogs').get).toHaveBeenCalledTimes(1)
    expect(getNamespace('externalLogs').set).toHaveBeenCalledWith(
      'externalLogs',
      [
        {
          externalLog: fakeLog,
          externalName: 'external_api',
        },
      ],
    )
  })

  test('Should set externalLog with success when namespace is not empty', () => {
    const fakeLog = {
      data: {
        name: 'any_name',
        phone: 'any_phone',
      },
    }

    jest
      .spyOn(getNamespace('externalLogs'), 'get')
      .mockReturnValueOnce([
        { externalLog: fakeLog, externalName: 'external_api_2' },
      ])

    setExternalLogs({ externalLog: fakeLog, externalName: 'external_api_1' })

    expect(getNamespace).toHaveBeenCalledWith('scoped-request')
    expect(getNamespace('externalLogs').get).toHaveBeenCalledTimes(1)
    expect(getNamespace('externalLogs').set).toHaveBeenCalledWith(
      'externalLogs',
      [
        {
          externalLog: fakeLog,
          externalName: 'external_api_2',
        },
        {
          externalLog: fakeLog,
          externalName: 'external_api_1',
        },
      ],
    )
  })
})
