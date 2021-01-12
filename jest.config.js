module.exports = {
    clearMocks: true,
    testEnvironment: "node",
    testMatch: [
        "**/tests/**/*.test.[tj]s?(x)"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    globals: {
      Uint8Array: Uint8Array,
      ArrayBuffer: ArrayBuffer
    }
};
