# Background

In vitest, when mocking a module that exports a Class, the expectation is that without passing a factory, _all_ exports (including the exported Class are automocked).

This seems to work as expected with `--environment=jsdom`, but when used in `--browser=chrome` it fails with:

```
TypeError: Class constructor <name of class> cannot be invoked without 'new'
```

It is unclear if this is by design or a bug.

# Steps to reproduce

1. `git clone https://github.com/scottohara/vitest-browser-automock-class`
2. `cd vitest-browser-automock-class`
3. `npm install`
4. `vitest --environment=jsdom`
5. `vitest --browser=chrome`

Expectation is that the test run in step 4 passes with no errors, but the test run in step 5 fails with the above `TypeError` message.

# Description of files

The `/src` directory contains the following files:

#### `foo.js`

This module exports a single, empty class definition.

```js
export class Foo {}
```

#### `bar.js`

This module imports the `Foo` class, and exports a `Bar` class that holds an instance of `Foo`.

```js
import { Foo } from "./foo.js";

export class Bar {
  constructor() {
    this.foo = new Foo();
  }
```

#### `bar.test.js`

This test file calls `vi.mock("./foo.js");` which in theory should automock the `Foo` class.

```js
import { expect, it, vi } from "vitest";
import { Bar } from "./bar.js";

vi.mock("./foo.js");

it("should work", () => {
  expect(new Bar()).toBeInstanceOf(Bar);
});
```

# Workaround

We can avoid the `TypeError` in browser mode by supplying a factory to the mock, e.g.

```js
vi.mock("./foo.js", () => {
	return {
		Foo: vi.fn();
	};
});
```

But the question is: why is this necessary only for browser mode?
