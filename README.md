# libp2a

This package is a Typescript/Javascript client for the [P2A service](https://p2a.telescope.chat/api/v1/docs).

* [Function call](#function-call)
* [Function chat](#function-chat)


#### Function call

Runs one of the available functions based on the prompt and returns the exact
output of the function in the value field.

```ts
import { call } from "libp2a";

const { value } = await call("get the address of Outback downtown Houston");

console.log(value); // # => { "full": "10001 Westheimer Rd #1010, Houston, TX 77042, USA", "postal_code": "77042", "street_name": "Westheimer Road", "complement": "1010", "neighborhood": "Westside", "city_name": "Houston", "state_name": "Texas", "state_code": "TX", "country_name": "United States", "country_code": "US" }
```

#### Function chat

Runs one of the available functions based on the prompt and returns a modified
version of the function’s output according to the prompt instructions.

```ts
import { chat } from "libp2a";

const { value } = await chat("get the address of zipcode 77042 and return only the city name")

console.log(value); // # => "Houston"
```
