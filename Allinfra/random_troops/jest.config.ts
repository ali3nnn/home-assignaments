import { Config } from "@jest/types";

/*tslint:disable:no-default-export */
export default async (): Promise<Config.InitialOptions> => {

    return {
        moduleFileExtensions: [
            "js",
            "json",
            "ts"
        ],
        collectCoverageFrom: [
            "./src/**/*.ts",
            "!./src/**/*.d.ts",
            "!./src/__tests__/**/*",
            "!./dist/**/*"
        ],
        rootDir: ".",
        testRegex: ".spec.ts$",
        testTimeout: 10000,
        transform: {
            "^.+\\.ts$": "ts-jest"
        },
        coverageDirectory: "./reports/coverage",
        testEnvironment: "node",
        reporters: [
            "default",
            ["jest-junit", { outputDirectory: "./reports/tests" }]
        ]
    };

};