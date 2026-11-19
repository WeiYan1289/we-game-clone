import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchBox } from "../SearchBox";

const props = { label: "搜索游戏", submitLabel: "搜索", suggestions: ["a", "b"] };

describe("SearchBox", () => {
  it("gives each instance a unique id so every label targets its own input", () => {
    // Several SearchBoxes may be on the page at once.
    render(
      <>
        <SearchBox {...props} />
        <SearchBox {...props} />
      </>,
    );
    const inputs = screen.getAllByLabelText("搜索游戏");
    expect(inputs).toHaveLength(2);
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });
});
