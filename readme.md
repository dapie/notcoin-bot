<p align="center">
    <picture align="center">
        <img width="180" height="104" src="logo.png">
    </picture><h3 align="center">Notcoin autoclicker</h3>
</p>
<p align="center">
    Small script to automatically clicks on coin, collect rockets and use available boosts.
    <br/>Works well in one session, it will refresh the page if click request is failed or page is not loaded. You can change a timeouts by changing variables if you need.
</p>

### Run Notcoin in browser

This method allows you to use only one session (you don't need to recreate it everytime)

1. Open [Telegram Web](https://web.telegram.org)
2. Open [Notcoin Bot](https://web.telegram.org/k/#@notcoin_bot)
3. Open Dev Tools (`Command+Option+I / F12 or Control+Shift+I`)
4. Press `Command+O / Control+O` and open file `telegram-web-app.js`.
5. In file find string `Object.defineProperty(WebApp, 'platform',`, it should be on 1325 position
6. Change `return webAppPlatform;` to `return 'ios';` and [save for overrides](https://senuravihanjayadeva.medium.com/local-overrides-in-chrome-devtools-f4a148de30c2#:~:text=Locate%20the%20file%20you%20want,overrides%E2%80%9D%20from%20the%20context%20menu.) this file
7. Refresh the page and try to open Notcoin Bot

If you can see the coin and doesn't see an message that you should use mobile then everything is ok

### Run autoclicker

1. Install [Violentmonkey](https://violentmonkey.github.io/)
2. Open Dev Tools (`Command+Option+I / F12 or Control+Shift+I`)
3. Add script from [index.js](https://github.com/dapie/notcoin-bot/blob/main/index.js) into Violentmonkey
4. Open [Notcoin Bot](https://web.telegram.org/k/#@notcoin_bot)
5. Refresh the page

The script should automatically open bot and reload it if needed. If something breaks, just try to reload the page.

### Script

You can find it [here in index.js](https://github.com/dapie/notcoin-bot/blob/main/index.js)
