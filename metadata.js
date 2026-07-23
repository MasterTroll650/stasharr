import meta from './package.json' with { type: 'json' };

export default {
  name: 'stashharr-mastertroll',
  description: meta.description,
  version: meta.version,
  author: meta.author,
  source: meta.repository.url,
  updateURL:
    meta.repository.url +
    '/releases/latest/download/stashharr-mastertroll.meta.js',
  downloadURL:
    meta.repository.url + '/releases/latest/download/stashharr-mastertroll.user.js',
  supportURL: meta.repository.url,
  license: meta.license,
  match: ['*://stashdb.org/*'],
  require: [],
  grant: [
    'GM_registerMenuCommand',
    'GM_xmlhttpRequest',
    'GM.xmlHttpRequest',
    'GM_getValue',
    'GM_setValue',
    'GM_setClipboard',
  ],
};
