import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideClientHydration, withEventReplay, ɵSharedStylesHost } from "@angular/platform-browser";
import { provideServerRendering, withRoutes } from "@angular/ssr";
import { appConfig } from "./config";
import { serverRoutesPromise } from "./routes.server";
import { environment } from "./environment/environment";

export class NoopStylesHost extends ɵSharedStylesHost {
    override addStyles(styles: string[]): void {
        // No-op
    }
}

export async function getServerConfig() {
    const routes = await serverRoutesPromise;

    // Only enable hydration for non-static builds
    // Static pages don't need hydration - they work as plain HTML
    const serverConfigOverrides: ApplicationConfig = {
        providers: environment.staticPages
            ? [
                provideServerRendering(withRoutes(routes)),
                { provide: ɵSharedStylesHost, useClass: NoopStylesHost },
            ]
            : [
                provideServerRendering(withRoutes(routes)),
                { provide: ɵSharedStylesHost, useClass: NoopStylesHost },
                provideClientHydration(withEventReplay()),
            ]
    };

    return mergeApplicationConfig(appConfig, serverConfigOverrides);
}
