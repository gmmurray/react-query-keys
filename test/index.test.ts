import ReactQueryKeys from "../src/index";

const testName = "test";

const testConfig = {
  keyDefinitions: {
    first: {},
    second: {
      dynamicVariableNames: ["id", "age"],
    },
    third: {
      childOf: "first",
    },
  },
};

const testDynamicVariables = { id: "123", age: 27 };

const testResult = {
  all: [testName],
  first: [testName, "first"],
  second: [testName, "second", testDynamicVariables],
  third: [testName, "first", "third"],
};

const testKeys = new ReactQueryKeys(testName, testConfig);
test("all keys", () => {
  expect(testKeys.all()).toEqual(testResult.all);
});

test("basic key", () => {
  const keyName = "first";

  expect(testKeys.key(keyName)).toEqual(testResult.first);
});

test("key with dynamic variables", () => {
  const keyName = "second";

  expect(testKeys.key(keyName, testDynamicVariables)).toEqual(
    testResult.second
  );
});

test("key with parent", () => {
  const keyName = "third";

  expect(testKeys.key(keyName)).toEqual(testResult.third);
});
