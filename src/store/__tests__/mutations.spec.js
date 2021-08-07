import mutations from "../mutations";

describe('mutations', () => {
  test('setItems set state.items to items', () => {
    const state = {
      items: []
    }
    const items = [{id:1}, {id:2}]
    mutations.setItems(state, { items })
    expect(state.items).toBe(items)
  })
})