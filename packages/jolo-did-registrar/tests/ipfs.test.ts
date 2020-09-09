import { IpfsStorageAgent } from "../ts/ipfs";

describe("IPFS Agent", () => {
  beforeAll(() => {
    global.Math.random = jest.fn().mockReturnValue(0.5)
  });

  it("should store json on ipfs", () => {
    const ipfs = new IpfsStorageAgent("host");
    ipfs.fetchImplementation = jest.fn().mockResolvedValue({json: () => ({
      Hash: "QM"
    })});
    ipfs.storeJSON({ data: "data" });
    expect(ipfs.fetchImplementation.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "host/api/v0/add?pin=true",
        Object {
          "body": FormData {
            "_boundary": "--------------------------555555555555555555555555",
            "_currentStream": null,
            "_insideLoop": false,
            "_overheadLength": 143,
            "_pendingNext": false,
            "_released": false,
            "_streams": Array [
              "----------------------------555555555555555555555555
      Content-Disposition: form-data; name=\\"file\\"
      Content-Type: application/octet-stream

      ",
              Object {
                "data": Array [
                  123,
                  34,
                  100,
                  97,
                  116,
                  97,
                  34,
                  58,
                  34,
                  100,
                  97,
                  116,
                  97,
                  34,
                  125,
                ],
                "type": "Buffer",
              },
              [Function],
            ],
            "_valueLength": 15,
            "_valuesToMeasure": Array [],
            "dataSize": 0,
            "maxDataSize": 2097152,
            "pauseStreams": true,
            "readable": true,
            "writable": false,
          },
          "method": "POST",
        },
      ]
    `);
  });
});
