export interface AbstractRouter {
    navigateByUrl: (url: string) => any;
}

export interface SetupLinksOptions {
    /** If true, skip setting up click handlers (let hrefs work naturally) */
    staticPages?: boolean;
}

export const setupLinks = (el: HTMLElement | null, router: AbstractRouter, options?: SetupLinksOptions) => {
    // In static page mode, let hrefs work naturally (full page navigation)
    if (options?.staticPages) return;

    const links = el?.querySelectorAll("a");
    links?.forEach((link) =>
        link.addEventListener("click", (ev) => {
            if (ev.ctrlKey || ev.metaKey || link.dataset["type"] === "external") {
                return;
            }
            const href = link.getAttribute("href");
            if (!href || href.includes("//")) {
                return;
            }
            ev.preventDefault();

            const url = href.startsWith("?") ? `${window.location.pathname}${href}` : href;
            router.navigateByUrl(url);
        }),
    );
};
