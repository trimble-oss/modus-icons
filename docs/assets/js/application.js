/* eslint-env browser */

/* global ClipboardJS:false */

(function () {
  'use strict'

  var btnHtml = '<div class="bd-clipboard"><button type="button" class="btn-clipboard rounded border-0" title="Copy to clipboard"><svg width="16" height="16" fill="currentColor" viewBox="0 0 32 32"><g><path d="M25,5H19.87a3.9961,3.9961,0,0,0-7.74,0H7A1.0029,1.0029,0,0,0,6,6V29a1.0029,1.0029,0,0,0,1,1H26V6A1.0029,1.0029,0,0,0,25,5ZM24,28H8V7h2V9a1.0029,1.0029,0,0,0,1,1H21a1.0029,1.0029,0,0,0,1-1V7h2Z"/></g></svg></button></div>';

  [].slice.call(document.querySelectorAll('div.highlight'))
    .forEach(function (element) {
      element.insertAdjacentHTML('beforebegin', btnHtml)
    })

  var clipboard = new ClipboardJS('.btn-clipboard', {
    target: function (trigger) {
      return trigger.parentNode.nextElementSibling
    }
  })

  clipboard.on('success', function (event) {
    var iconFirstChild = event.trigger.querySelector('.mi').firstChild
    var namespace = 'http://www.w3.org/1999/xlink'
    var originalXhref = iconFirstChild.getAttributeNS(namespace, 'href')
    var originalTitle = event.trigger.title

    event.clearSelection()
    iconFirstChild.setAttributeNS(namespace, 'href', originalXhref.replace('clipboard', 'check2'))
    event.trigger.title = "Copied!"

    setTimeout(function () {
      iconFirstChild.setAttributeNS(namespace, 'href', originalXhref)
      event.trigger.title = originalTitle
    }, 2000)
  })

  clipboard.on('error', function () {
    var modifierKey = /mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
    var fallbackMsg = 'Press ' + modifierKey + 'C to copy'
    var errorElement = document.getElementById('copy-error-callout')

    if (!errorElement) {
      return
    }

    errorElement.classList.remove('d-none')
    errorElement.insertAdjacentHTML('afterbegin', fallbackMsg)
  })

  var searchInput = document.getElementById('search')
  if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault()
      }
    })
  }

  // Disable empty links in docs
  [].slice.call(document.querySelectorAll('[href="#"]'))
    .forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault()
      })
    })
})()
