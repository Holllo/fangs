import browser from 'webextension-polyfill';

import Bang, {BangParameters} from '../bang/bang.js';

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage();
});

browser.runtime.onInstalled.addListener(async () => {
  if (import.meta.env.DEV) {
    await browser.runtime.openOptionsPage();
  }
});

browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const detailsUrl = new URL(details.url);
  if (detailsUrl.host !== 'duckduckgo.com') {
    return;
  }

  const qParameter = detailsUrl.searchParams.get('q') ?? undefined;
  if (qParameter === undefined) {
    return;
  }

  const id = Bang.parseId(qParameter);
  if (id === undefined) {
    return;
  }

  const data = await browser.storage.local.get(id);
  if (data[id] === undefined) {
    return;
  }

  const bang = Bang.parseParameters(qParameter, data[id] as BangParameters);
  await browser.tabs.update({url: bang.destination});
});
