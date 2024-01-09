Donate TON: UQA4uD3Mq-yxPlrO7Vv_sTCX_jysYaTplv4f_TUdV9EuK2UI

## Run Notcoin in browser

https://github.com/SashaTail/notcoin_automation

(warn) I am using iPhone 14 Pro Max dimensions in devtools.

(warn) Look at click requests (if it is start to fail - you should to change session)

## Script

Script automatically clicks on coin, boosts, uses available boosts.

```javascript
let intervalId;
let clicksCount = 0;
const delay = (time) => new Promise(r => setTimeout(r, time));
const getEvent = () => ({
    touches: [{clientX: Math.random() * 250 + 52, clientY: Math.random() * 582 + 512}]
})
const getReactProps = (component) => component ? Object.entries(component).find(([key]) => key.startsWith("__reactProps$"))[1] : null;
const getIdleTime = () => Math.floor(Math.random() * 18222 + 12111);
const getRandomClickTime = () => Math.floor(Math.random() * 142 + 12);

const MIN_SCORE = 500;
const MAX_CLICKS_PER_ITTERATION = 100;
const coinClick = async () => {
    const coin = document.querySelector('div[class^="_notcoin"]');
    const scoreElement = document.querySelector('div[class^="_scoreCurrent"]');
    const buttonGroup = document.querySelector('div[class^="_buttonGroup"]');
    const boostButton = buttonGroup && buttonGroup.lastChild;
    const score = scoreElement ? parseInt(scoreElement.textContent) : 0;

    // Rocket click
    const rocket = document.querySelector('img[class^="_root"]');
    const rocketProps = getReactProps(rocket);
    if (rocketProps) rocketProps.onClick()

    // Coin click
    if (score > MIN_SCORE && clicksCount < MAX_CLICKS_PER_ITTERATION && coin) {
        clicksCount++;
        const {onTouchStart, onTouchEnd} = getReactProps(coin);
        onTouchStart(getEvent());
        await delay(50);
        onTouchEnd();
    } else {
        clearInterval(intervalId)
        clicksCount = 0;
        console.info('INFO: idle time')
        if (score < MIN_SCORE) boostClick()
        await delay(getIdleTime());
        if (intervalId === null) return;
        console.info('INFO: trying again')
        start()
    }
}

const start = () => intervalId = setInterval(coinClick, getRandomClickTime());
const end = () => {
    clearInterval(intervalId);
    intervalId = null
};

const BOOST_CLICK_TIMEOUT = 1500;
const boostClick = async () => {
    console.info('INFO: boost click');
    const buttonGroup = document.querySelector('div[class^="_buttonGroup"]');
    const boostButton = buttonGroup && getReactProps(buttonGroup.lastChild);
    await delay(BOOST_CLICK_TIMEOUT);
    if(!boostButton) return
    boostButton.onClick();
    await delay(BOOST_CLICK_TIMEOUT);
    const dailyTask = document.querySelector('div[class^="_taskDailyItem"]:not([class*="_completed"])');
    const dailyBoost = getReactProps(dailyTask)
    const taskCarousel = document.querySelector('div[class^="_taskCarousel"][class*="_willChange"]');
    const boost = getReactProps(taskCarousel && taskCarousel.querySelector('div[class*="_rippleEffect"]'));
    const boosterButton = dailyBoost || boost;
    if (boosterButton) {
        boosterButton.onClick();
        await delay(BOOST_CLICK_TIMEOUT);
        const getButton = getReactProps(document.querySelector('button[class*="_typeBlue"]'));
        if(getButton) getButton.onClick();
        await delay(BOOST_CLICK_TIMEOUT);
        console.info('INFO: boosted')
    }
    history.back();
}

start();
```