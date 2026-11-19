import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { dictionaries } from "@/i18n/dictionaries";
import { FeatureSection } from "../FeatureSection";

const panels = () => screen.getAllByRole("tabpanel");

describe("FeatureSection", () => {
  it("lays each tab out like the original: VALORANT, League, then the AI panel", () => {
    render(<FeatureSection dict={dictionaries["zh-CN"].feature} />);

    const layouts = panels().map((p) => p.querySelector("article")?.dataset.layout);
    expect(layouts).toEqual(["val", "lol", "ai"]);
  });

  it("shows the AI assistant's points as real, translated text with icons", () => {
    render(<FeatureSection dict={dictionaries.en.feature} />);

    const items = within(panels()[2]).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["Match recaps", "Personal coach", "Live help"]);
    for (const li of items) expect(li.querySelector("img")).not.toBeNull();
  });

  it("labels each tool screenshot and keeps the decorative guide out of the accessibility tree", () => {
    const dict = dictionaries["zh-CN"].feature;
    const { container } = render(<FeatureSection dict={dict} />);

    expect(screen.getByAltText(`${dict.items[1].title} ${dict.screenAlt}`)).toBeInTheDocument();
    expect(screen.getByAltText(`智能有趣的 AI 助手 ${dict.screenAlt}`)).toBeInTheDocument();
    // Desktop overlay copy is hidden from assistive tech; the mobile copy is not.
    const guides = [...container.querySelectorAll("p")].filter((p) => p.textContent === dict.guideTitle);
    expect(guides).toHaveLength(2);
    expect(guides.filter((p) => p.closest('[aria-hidden="true"]'))).toHaveLength(1);
  });
});
