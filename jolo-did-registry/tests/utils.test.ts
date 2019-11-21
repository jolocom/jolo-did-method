import { serializeJSON } from "../ts/utils";

describe('Utils', ()=>{
  it('should test serialization', () => {
    const result = serializeJSON({data: 'data'})
    expect(result).toEqual('some')
  });
})