/* eslint-disable @typescript-eslint/naming-convention */

export default function createManifest(
  target: string,
): Record<string, unknown> {
  const manifest: Record<string, unknown> = {
    name: 'Fangs',
    description:
      'Inject custom DuckDuckGo Bangs into your browsing experience.',
    version: '0.1.4',
    permissions: ['storage', 'tabs', 'webNavigation'],
    options_ui: {
      page: 'options/index.html',
      open_in_tab: true,
    },
  };

  const icons = {
    128: 'assets/fangs-128.png',
  };

  const browserAction = {
    default_icon: icons,
  };

  const backgroundScript = 'background-scripts/initialize.ts';

  if (target === 'chromium') {
    manifest.manifest_version = 3;
    manifest.action = browserAction;
    manifest.background = {
      service_worker: backgroundScript,
      type: 'module',
    };
  } else {
    manifest.manifest_version = 2;
    manifest.browser_action = browserAction;
    manifest.background = {
      scripts: [backgroundScript],
    };
    manifest.applications = {
      gecko: {
        id: '{cbb8b06b-9d6f-42f2-9d8d-7581f411653c}',
      },
    };
  }

  return manifest;
}
