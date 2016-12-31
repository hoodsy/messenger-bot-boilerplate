<style>
  body a {
    color: #655F8A;
  }
  .header {
    border-bottom: 2px solid #655F8A;
    border-radius: 2px;
  }
</style>

![messenger-bot-boilerplate](./docs/logo.png)
# [Messenger Bot Boilerplate](https://www.facebook.com/messengerbotboilerplate/)
[![Dependency Status](https://david-dm.org/hoodsy/messenger-bot-boilerplate.svg)](https://david-dm.org/hoodsy/messenger-bot-boilerplate)
[![devDependency Status](https://david-dm.org/hoodsy/messenger-bot-boilerplate/dev-status.svg)](https://david-dm.org/hoodsy/messenger-bot-boilerplate#info=devDependencies)


# About
This is a **Chatbot boilerplate** app for **[Facebook Messenger](https://www.messenger.com)** with **NLP** by **[Wit.ai](https://wit.ai)** and **analytics** by **[Dashbot.io](https://www.dashbot.io/)**.

![logo-tools](./docs/logo-tools.png)

<u>**TOOLS INCLUDED / PROJECT OVERVIEW**</u>

# Usage
```
git clone https://github.com/hoodsy/messenger-bot-boilerplate.git
cd messenger-bot-boilerplate
npm install
npm start
```

# <span class="header">Setup: Facebook Messenger</span>
1. Follow the steps at **[Messenger Bot Tutorial](https://github.com/jw84/messenger-bot-tutorial#setup-the-facebook-app)** to create a Facebook App or Page, setup Webhooks, and set Environmental Variables.

2. Set ```FB_PAGE_TOKEN```, ```FB_APP_SECRET``` and ```FB_VERIFY_TOKEN``` in ```example.env```.

3. Move ```example.env``` -> ```.env```.


# <span class="header">Setup: Wit.ai</span>
1. Sign up for a [Wit.ai account here](https://wit.ai).

2. Clone [messenger-bot-boilerplate on Wit.ai](https://wit.ai/hoodsy/messenger-bot-boilerplate).

3. Set ```WIT_TOKEN``` with your *Server Access Token* from Wit.ai.

4. Checkout **[Messenger Bot Wit.ai Tutorial](https://github.com/jw84/messenger-bot-witai-tutorial#setup-witai)** to learn why and how and why we want to use Wit.ai for NLP in our bot.


# Setup: Dashbot
Point to Dashbot
