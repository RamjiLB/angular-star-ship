import "./test/global-jasmine";
import "jasmine-core/lib/jasmine-core/jasmine-html.js";
import "jasmine-core/lib/jasmine-core/boot.js";

declare var jasmine;

import "./polyfills";

import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";


import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";

// Import test files to run them in stackblitz
import "./app/app.component.spec.ts";
import "./app/star-ship-catalogue/star-ship-catalogue.component.spec.ts";
import "./app/service/star-wars.service.spec.ts";

bootstrap();

function bootstrap() {
  if (window["jasmineRef"]) {
    location.reload();
    return;
  } else {
    window.onload(undefined);
    window["jasmineRef"] = jasmine.getEnv();
  }

  // First, initialize the Angular testing environment.
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
}

