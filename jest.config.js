module.exports = {
    clearMocks: true,
    testEnvironment: "node",
    testMatch: [
        "**/tests/**/*.test.[tj]s?(x)"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    }
};