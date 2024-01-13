// ==UserScript==
// @name        notcoin-bot
// @namespace   Violentmonkey Scripts
// @match       https://*.telegram.org/*#@notcoin_bot
// @match       https://*.joincommunity.xyz/*
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_setValue
// @version     1.0
// @author      Denis Tk (dapie.github.io)
// @homepageURL https://github.com/dapie/notcoin-bot
// ==/UserScript==

// === helpers ===
const delay = (time) => new Promise(r => setTimeout(r, time));
const getEvent = () => ({
    touches: [{clientX: Math.random() * 250 + 52, clientY: Math.random() * 582 + 512}]
})
const getReactProps = (component) => component ? Object.entries(component).find(([key]) => key.startsWith("__reactProps$"))[1] : null;
const getIdleTime = () => Math.floor(Math.random() * 10222 + 8111);
const getRandomClickTime = () => Math.floor(Math.random() * 142 + 12);
const waitForElm = (selector, wait = 0) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                clearTimeout(timeout);
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        const timeout = wait && setTimeout(
          () => {
            observer.disconnect();
            reject('Never showed up. ' + selector)
          },
          wait
        );

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// === script ===
let shouldCheckBoosts = false;
let intervalId;
let clicksCount = 0;

const MIN_SCORE = 500;
const MAX_CLICKS_PER_ITERATION = 100;
const coinClick = async () => {
    const coin = document.querySelector('div[class^="_notcoin"]');
    const scoreElement = document.querySelector('div[class^="_scoreCurrent"]');
    const score = scoreElement ? parseInt(scoreElement.textContent) : null;

    // Rocket click
    const rocket = document.querySelector('img[class^="_root"]');
    const rocketProps = getReactProps(rocket);
    if (rocketProps) rocketProps.onClick();

    if (intervalId === null || score === null) return;
    const isMinScore = score < MIN_SCORE;
    const isMaxClicksForIteration = clicksCount < MAX_CLICKS_PER_ITERATION;
    const shouldClick = !isMinScore && isMaxClicksForIteration;
    // Coin click
    if (shouldClick && coin) {
        clicksCount++;
        const {onTouchStart, onTouchEnd} = getReactProps(coin);
        onTouchStart(getEvent());
        await delay(80);
        onTouchEnd();
    } else {
        clearInterval(intervalId)
        clicksCount = 0;
        console.info('%c INFO: idle time', 'color: #64b5f6');
        if (isMinScore && shouldCheckBoosts) boostClick()
        await delay(getIdleTime());
        console.info('%c INFO: trying again', 'color: #64b5f6');
        start();
    }
}

const start = () => {
    intervalId = setInterval(coinClick, getRandomClickTime());
};
const stop = () => {
    clearInterval(intervalId);
    intervalId = null;
};

const BOOST_CLICK_TIMEOUT = 2500;
const boostClick = async () => {
    console.info('%c INFO: open boosts', 'color: #64b5f6');
    const buttonGroup = document.querySelector('div[class^="_buttonGroup"]');
    const boostButton = buttonGroup && getReactProps(buttonGroup.lastChild);
    await delay(BOOST_CLICK_TIMEOUT);
    if (!boostButton) return;
    boostButton.onClick();
    await delay(BOOST_CLICK_TIMEOUT);
    const dailyTask = document.querySelector('div[class^="_taskDailyItem"]:not([class*="_completed"])');
    const dailyBoost = getReactProps(dailyTask);
    const taskCarousel = document.querySelector('div[class^="_taskCarousel"][class*="_willChange"]');
    const boost = getReactProps(taskCarousel && taskCarousel.querySelector('div[class*="_rippleEffect"]'));
    const boosterButton = dailyBoost || boost;
    if (boosterButton) {
        boosterButton.onClick();
        await delay(BOOST_CLICK_TIMEOUT);
        const getButton = getReactProps(document.querySelector('button[class*="_typeBlue"]'));
        if(getButton) getButton.onClick();
        await delay(BOOST_CLICK_TIMEOUT);
        console.info('%c DONE: boosted', 'color: #bada55');
    }
    console.info('%c INFO: close boosts', 'color: #64b5f6');
    history.back();
}

const init = async () => {
  console.info('%c INIT: start initialization', 'color: #64b5f6');
  await waitForElm('.reply-markup-button').then(() => {
    const button = document.querySelector('.reply-markup-button');
    button.click();
    console.info('%c INIT: initializated', 'color: #64b5f6');
  });
}

if(location.host === 'web.telegram.org') {
  init();
  GM_addValueChangeListener('shouldRefresh', (_name, _oldValue, newValue) => {
    console.info('%c INFO: refreshing', 'color: #64b5f6');
    if(newValue) location.reload();
  })
}

if(location.host === 'clicker.joincommunity.xyz') {
    waitForElm('div[class^="_notcoin"]', 10000).then(start).catch(() => {
      console.info('%c INFO: not started. reload window', 'color: #64b5f6');
      location.reload()
    });

    GM_setValue('shouldRefresh', false);

    const requestRefresh = () => {
      console.info('%c INFO: click request failed', 'color: #64b5f6');
      GM_setValue('shouldRefresh', true);
    }

    const {fetch: origFetch} = window.unsafeWindow;
    window.unsafeWindow.fetch = async (...args) => {
      try {
        const response = await origFetch(...args);
        if (response && response.status === 401) requestRefresh();
        return response;
      } catch (error) {
        if(!args[0].signal.aborted) {
          requestRefresh()
        }
        throw error
      }
    };
}