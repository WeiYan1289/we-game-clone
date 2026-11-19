import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchBox } from "../SearchBox";

describe("SearchBox", () => {
  it("gives each instance a unique id so every label targets its own input", () => {
    // The header and the mobile drawer both render a SearchBox at the same time.
    render(
      <>
        <SearchBox />
        <SearchBox />
      </>,
    );
    const inputs = screen.getAllByLabelText("搜索游戏");
    expect(inputs).toHaveLength(2);
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });
});
