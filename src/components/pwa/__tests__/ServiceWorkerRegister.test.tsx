import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceWorkerRegister } from "../ServiceWorkerRegister";

/**
 * A worker registered by an earlier production run (`npm start`) keeps
 * controlling the same origin when `next dev` takes over the port. Dev chunk
 * URLs don't change between edits, so its cache-first rule would keep serving
 * stale CSS and JS — the dev page has to clear it out.
 */
describe("ServiceWorkerRegister outside production", () => {
  afterEach(() => vi.unstubAllGlobals());

  function stubWorkerAndCaches() {
    const registration = { unregister: vi.fn().mockResolvedValue(true) };
    const serviceWorker = {
      register: vi.fn(),
      getRegistrations: vi.fn().mockResolvedValue([registration]),
    };
    Object.defineProperty(navigator, "serviceWorker", { value: serviceWorker, configurable: true });
    const cacheStorage = {
      keys: vi.fn().mockResolvedValue(["wegame-abc123", "someone-else"]),
      delete: vi.fn().mockResolvedValue(true),
    };
    vi.stubGlobal("caches", cacheStorage);
    return { registration, serviceWorker, cacheStorage };
  }

  it("unregisters a leftover worker and deletes only this app's caches", async () => {
    const { registration, serviceWorker, cacheStorage } = stubWorkerAndCaches();

    render(<ServiceWorkerRegister />);

    await waitFor(() => expect(registration.unregister).toHaveBeenCalled());
    await waitFor(() => expect(cacheStorage.delete).toHaveBeenCalledWith("wegame-abc123"));
    expect(cacheStorage.delete).not.toHaveBeenCalledWith("someone-else");
    expect(serviceWorker.register).not.toHaveBeenCalled();
  });
});
