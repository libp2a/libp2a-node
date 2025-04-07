import { call, chat, translateResponseIntoResult, translateOptionsIntoParams } from "./function";
import fetchMock from 'jest-fetch-mock';

describe("parseResult", () => {
  it("parses the result with run events", () => {
    const result = translateResponseIntoResult<string>({
      value: "foo",
      run: {
        id: 1,
        transport_name: "http",
        events: [{ id: 1, name: "foo", data: { bar: "baz" } }]
      }
    })

    expect(result).toEqual({
      value: "foo",
      run: {
        id: 1,
        transportName: "http",
        events: [{ id: 1, name: "foo", data: { bar: "baz" } }]
      }
    })
  });
});

describe("translateOptionsIntoParams", () => {
  it("translates the options into params", () => {
    const params = translateOptionsIntoParams({ withRunEvents: true });

    expect(params).toEqual({ with_run_events: true });
  });
});

describe("call", () => {
  it("returns a result when response is successful", async () => {
    fetchMock.mockOnce(JSON.stringify({
      "value": "value",
      "run": {
        "id": 286,
        "transport_name": "rest_prompt",
        "events": [
          {
            "id": 182,
            "name": "name",
            "data": { "key": "value" }
          },
        ]
      }
    }));

    const result = await call("prompt content");

    expect(result.value).toEqual("value");
    expect(result.run?.id).toEqual(286);
    expect(result.run?.transportName).toEqual("rest_prompt");
    expect(result.run?.events).toEqual([
      { id: 182, name: "name", data: { key: "value" } }
    ]);
  });

  it("raises an error when response is not successful", async () => {
    fetchMock.mockRejectOnce(new Error("something went wrong"));

    await expect(call("prompt content")).rejects.toThrow("something went wrong");
  });
});

describe("chat", () => {
  it("returns a result when response is successful", async () => {
    fetchMock.mockOnce(JSON.stringify({
      "value": "value",
    }));

    const result = await chat("prompt content");

    expect(result.value).toEqual("value");
  });

  it("raises an error when response is not successful", async () => {
    fetchMock.mockRejectOnce(new Error("something went wrong"));

    await expect(chat("prompt content")).rejects.toThrow("something went wrong");
  });
});