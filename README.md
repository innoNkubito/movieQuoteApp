# Node Movie Quote Sample App
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

This project is a voice and SMS app built with FreeClimb that takes a phrase via call or text and says/texts back a movie quote containing the
provided phrase

# Description 
Specifically this app will:
- Provide a user with a number to call/text 
- The user will then call or text the number and provide a phrase
- The text feature will allow any random phrases
- However, the call/audio feature will only allow a specific set of phrases as specified by the Grammar
- The app will then respond with a movie quote containing the phrase using either text/audio depending on the initial action

# Requirements
A [FreeClimbAccount](https://www.freeclimb.com/dashboard/signup/)

A [registered application](https://docs.freeclimb.com/docs/registering-and-configuring-an-application#register-an-app)

A [configured FreeClimb number](https://docs.freeclimb.com/docs/getting-and-configuring-a-freeclimb-number) assigned to your application

# Tools
- [Node.js](https://nodejs.org/en/download/) 17.5.0 or higher
- [Yarn](https://yarnpkg.com/en/)

## Setting up the Sample App

1. Install the required packages

    ```bash
    yarn install
    ```

2. Create a .env file and configure the following environment variables within it:


    | ENV VARIABLE    | DESCRIPTION                                                                                                                                                                                                                               |
    | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | ACCOUNT_ID      | Account ID which can be found under [API credentials](https://www.freeclimb.com/dashboard/portal/account/authentication) in dashboard.                                                                                                    |
    | API_KEY         | Authentication token which can be found under [API credentials](https://www.freeclimb.com/dashboard/portal/account/authentication) in dashboard                                                                                           |
    | HOST_URL        | Specifies your app's url that freeclimb will use for redirects |
    | MOVIE_API       | Specifies the movie quote api host |
    | PORT            | Specifies the port on which the app will run (e.g. PORT=3000 means you would direct your browser to http://localhost:3000). | 
    
   ## Running the Sample App

```bash
yarn start:dev
```

## Testing the app 

1. To test against the audio functionality, please use only phrases/words that have been specified in the Grammar file. If you need to expand the list of words that can be recognized by the Speech Recognizer, please make changes to the grammar file accordingly.
The following guide will help you understand Grammar file usage in FC: [Grammars](https://docs.freeclimb.com/docs/how-to-write-grammars) 

Below is list of words/phrases that can be recognized by this code sample:

```
1. father
2. Go ahead
3. force
4. dreams
5. dead people
6. You talking to me
7. show me
8. suspects
9. hello
10. rob banks

```

2. For text functionality any words or phrases can be utilized during testing

## Feedback & Issues
If you would like to give the team feedback or you encounter a problem, please [contact support](https://www.freeclimb.com/support/) or [submit a ticket](https://freeclimb.com/dashboard/portal/support) in the dashboard.
