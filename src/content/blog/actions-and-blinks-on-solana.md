---
title: 'Actions & Blinks on Solana'
description: 'actions and blinks explained'
pubDate: '13 Sep 2024'
category: 'home'
---

Solana is continually evolving to enhance user experiences and developer capabilities. These innovations aim to streamline blockchain interactions and make decentralized applications (dApps) more accessible.
## Solana Actions
According to Solana docs, Solana Actions are specification-compliant APIs that return transactions on the Solana blockchain. These APIs enable us to build transactions for use in various formats like QR codes, buttons, widgets, and websites.

The typical action workflow is as follows:
1. A client sends a GET request to an Action URL to fetch metadata about available actions.
2. The endpoint returns a response with metadata and a list of available actions.
3. The client displays a UI for the user to perform one of the actions.
4. When a user selects an action, the client makes a POST request to the Action URL with the user's public key to create a transaction.
5. Upon successful response, the wallet facilitates the signing of the transaction and sends it to the blockchain for confirmation.

In essence, actions are a specification for building APIs that facilitate services based on metadata and construct transactions using the user's public key. These APIs open up possibilities for users to interact with dApps without leaving their current application.
## Blinks
Blinks, short for "blockchain links," allow action-aware clients like browser extensions (of wallets) or bots to display additional UI capabilities to the user. A blink functions as a feature-rich URL that clients parse to inject additional UI directly into the application the user is browsing.
Blinks are now supported on X.com. For example, anyone can share a link to exchange their token on Jupiter exchange with a URL like [https://jup.ag/swap/SOL-JUP](https://jup.ag/swap/SOL-JUP). If the link is a blink, it'll be rendered like this:<p align="center">
<img src="https://i.imgur.com/jppFHbg.png" alt="jup blink" width="400" style=""></p>

This UI is added by the browser extension, in this case, Solflare. Whenever it encounters a link that is a blink, it turns it into such cards.

To enable Blinks in Solflare, go to Settings > Security & Privacy and Enable Actions and in Phantom, the setting is inside experimental features.

Here's an example of a blink I created for a personal project and how it works behind the scenes:
<p align="center"><img src="https://imgur.com/YQwWFHz.png" width="400" alt="solaris auction blink"/></p>

As you can see, it contains a few buttons and an option for a custom amount, just like the Jupiter blink. The blink appears whenever the wallet encounters a URL for my website, and the way it knows what to render goes like this:
It first makes a request to see if there's an `actions.json` file hosted on the root of the domain, in my case `https://solaris-auctions.alk.pw/actions.json`. This file contains information about which path patterns to match and where to look for their related actions. We can create multiple actions and map them to different endpoints on the main URL. With `actions.json`, the extension will be able to find exactly where to make the action request. For this simple blink, the `actions.json` looks like this:

```json
{
  "rules": [
    {
      "pathPattern": "/**",
      "apiPath": "/api"
    }
  ]
}
```

It's matching all the paths and leading them to `/api` where the blink is hosted.
Now, if we make a `GET` request to `<domain>/api`, we get this data:

```json
{
  "label": "Bid to purchase ",
  "icon": "...",
  "title": "Solaris Auctions - Place a bid",
  "description": "Solaris Auctions ...",
  "links": {
    "actions": [
      ...
    ]
  }
}
```

This is the metadata of an action. Using this metadata, the browser extension is able to inject that card into the X.com page. The `actions` in the `links` key represent the buttons which are rendered on the card.

```json
"actions": [
      {
        "href": "https://solaris-auctions.alk.pw/api?bid=0.1",
        "label": "0.1 SOL"
      },
      {
        "href": "https://solaris-auctions.alk.pw/api?bid=0.5",
        "label": "0.5 SOL"
      },
      {
        "href": "https://solaris-auctions.alk.pw/api?bid=1",
        "label": "1 SOL"
      }
]
```

Once any of the buttons is pressed, a `POST` request will be made to the corresponding URL specified with the user's public key. Then, from the API, the dApp can create a transaction with the user's public key and send it back. The wallet will receive it and prompt for signing the transaction.

This happens all in no time, so the user directly sees the signing prompt on the browser extension and doesn't have to leave the current page to make transactions.
![Working of Blinks](https://imgur.com/xKcgEo2.png)

📎 Resources to get started with building Blinks and Solana Actions:<br>
[Official docs from which this blog is inspired from](https://solana.com/docs/advanced/actions)<br>
[Create own Blink by Solandy - YouTube Video ](https://youtu.be/dLpu6vYsTaI?si=FZrusEV4Lszo6VZK)<br>
[Quick Start Guide - Dialect](https://dashboard.dialect.to/actions)