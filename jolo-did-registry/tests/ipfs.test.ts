import { IpfsStorageAgent, jolocomIpfsStorageAgent } from "../ts/ipfs";

describe('IPFS Agent', () => {
  it('should store file on ipfs', async () => {
    const ipfs = new IpfsStorageAgent('http://127.0.0.1:5001')
    // ipfs.fetchImplementation = jest.fn()
    const resutl  = await ipfs.storeJSON({ data: 'test' }, true)
    console.log(resutl)
    // expect(ipfs.fetchImplementation.mock.calls[0]).toMatchSnapshot()
  });

  it('should store file on ipfs really', async () => {
    const ipfs = new IpfsStorageAgent('http://127.0.0.1:5001')
    // ipfs.fetchImplementation = jest.fn()
    const result  = await ipfs.storeJSON({ data: 'test' }, true)
    console.log(result)
    // expect(ipfs.fetchImplementation).toMatchSnapshot()
  });
})