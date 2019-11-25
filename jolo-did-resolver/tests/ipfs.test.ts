import { IpfsStorageAgent } from "../ts/ipfs";

describe('IPFS Agent', () => {
  it('should resolve IPFS hash', () => {
    const ipfs = new IpfsStorageAgent('host')
    ipfs.fetchImplementation = jest.fn()
    ipfs.catJSON('hash')
    expect(ipfs.fetchImplementation).toBeCalledWith('host/api/v0/cat/hash')
  });
})