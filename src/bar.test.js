import { expect, it, vi } from "vitest";
import { Bar } from "./bar.js";

vi.mock("./foo.js");

it("should work", () => expect(new Bar()).toBeInstanceOf(Bar));
