import getters from "../getters";

describe('getters', () => {
  test('displayItems return the first 20 items from state.items', () => {
    const items = Array(21).fill().map((v,i) => i)
    const state = { items, route: { params: {} } }
    const displayItems = getters.displayItems(state)
    expect(displayItems).toEqual(items.slice(0, 20))
  })

  test('maxPage returns a rounded number by items number', () => {
    const items = Array(49).fill().map((v,i) => i)
    const result = getters.maxPage({ items })
    expect(result).toBe(3)
  })
})