<img src="src/assets/memo_logo_left.svg"/>

Memo is an opensource browser and desktop app that allows you to take smarter notes with GitHub Gists. Own your own private data, store it with Github's gists and access it from anywhere, anytime.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run app`

Creates and starts the electron app for your local OS.<br>
This is intended for development tests. Also you can toggle `dev` constant in `src/electron.js` file to change between production and development.

### `npm run package`

Try to package electron app for all OS.<br>
Make sure you `dev` constant in `src/electron.js` file is set to false.

### `npm run push`

Take a new build and upload this new build to amazon s3 server.<br>
This will work only if you have proper access and credentials.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Contributing

Memo is currently in beta, it needs your help but not fully documented, or might have big systematic changes. But pull requests and bug fixes are still welcome.

Additionally, you might want to make an addon. We will publish a dedicated page or tutorial for how to do this. But you can go to `src/addons` and duplicate one of the addons to use as a template for yours.

Overall, please be respectful and inclusive, keep in mind that this app does not come with any warranty or liability.
