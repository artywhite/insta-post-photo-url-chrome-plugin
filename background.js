'use strict';

const INSTA_QUERY_PARAMS = '__a=1';

function getNormalizedUrl(url) {
  const querySignIndex = url.indexOf('?');
  const urlWithoutQuery = url.slice(0, querySignIndex);

  return `${urlWithoutQuery}?${INSTA_QUERY_PARAMS}`;
}

function tryGetInstaPhotoUrl(tabUrl) {
  const url = getNormalizedUrl(tabUrl);
  return fetch(url)
    .then(response => response.json())
    .then(result => {
      console.warn('Got result', result);
      const { graphql } = result;
      const { shortcode_media } = graphql;
      const { display_url } = shortcode_media;
      copyTextToClipboard(display_url);
    });
}

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to.
  var copyFrom = document.createElement('textarea');

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child.
  //"execCommand()" only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

chrome.omnibox.onInputEntered.addListener(text => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    const { url } = tabs[0];
    tryGetInstaPhotoUrl(url);
  });
});
