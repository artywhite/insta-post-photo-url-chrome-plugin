'use strict';

const INSTA_QUERY_PARAMS = '__a=1';

function getNormalizedUrl(url) {
  const querySignIndex = url.indexOf('?');
  const urlWithoutQuery = url.slice(0, querySignIndex);

  return `${urlWithoutQuery}?${INSTA_QUERY_PARAMS}`;
}

function openUrlInNewTab(url) {
  chrome.tabs.create({ url });
}

function tryGetInstaPhotoUrl(tabUrl) {
  const url = getNormalizedUrl(tabUrl);
  return fetch(url)
    .then(response => response.json())
    .then(result => {
      const { graphql } = result;
      const { shortcode_media } = graphql;
      const { display_url } = shortcode_media;
      copyTextToClipboard(display_url);
      openUrlInNewTab(display_url);
    });
}

function copyTextToClipboard(text) {
  const copyFrom = document.createElement('textarea');
  copyFrom.textContent = text;

  document.body.appendChild(copyFrom);
  copyFrom.select();

  document.execCommand('copy');
  copyFrom.blur();

  document.body.removeChild(copyFrom);
}

chrome.omnibox.onInputEntered.addListener(text => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    const { url } = tabs[0];
    tryGetInstaPhotoUrl(url);
  });
});
