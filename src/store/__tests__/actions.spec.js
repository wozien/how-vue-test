import actions from "../actions";
import { fetchListData } from '../../api/api'
import flushPromise from 'flush-promises'

jest.mock('../../api/api.js')

describe('actions', () => {
  test('fetchList calls commit with the result', async () => {
    const items = [{}, {}]
    fetchListData.mockImplementationOnce(type => {
      return Promise.resolve(type === 'top' ? items : [])
    })
    const context = { commit: jest.fn() }
    actions.fetchListData(context, { type: 'top' })
    await flushPromise()
    
    expect(context.commit).toHaveBeenCalledWith('setItems', { items })
  })
})
