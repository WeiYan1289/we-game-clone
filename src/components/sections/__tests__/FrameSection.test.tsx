import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { dictionaries } from "@/i18n/dictionaries";
import { FrameSection } from "../FrameSection";

describe("FrameSection", () => {
  it("names step 1 by its update title and also carries the title it changes into", () => {
    const dict = dictionaries["zh-CN"].frame;
    render(<FrameSection dict={dict} />);

    expect(screen.getByRole("heading", { name: "WEGAME 3.0 轻装上阵" })).toBeInTheDocument();
    expect(screen.getByText("体验革新 轻松掌控")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "性能升级 轻快畅玩" })).toBeInTheDocument();
  });

  it("wraps the version so it can turn gold, in every locale", () => {
    for (const [locale, { frame }] of Object.entries(dictionaries)) {
      const { container, unmount } = render(<FrameSection dict={frame} />);
      const versions = [...container.querySelectorAll("h2 span span, h2 > span")].filter((el) => el.textContent === frame.version);
      expect(versions.length, locale).toBeGreaterThan(0);
      unmount();
    }
  });

  it("shows the three performance stats as text", () => {
    render(<FrameSection dict={dictionaries.en.frame} />);
    expect(screen.getAllByRole("definition").map((d) => d.textContent)).toEqual(dictionaries.en.frame.stats.map((s) => s.value));
  });
});
