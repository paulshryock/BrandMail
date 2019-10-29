# BrandMail

[![JavaScript Style Guide][standard-badge]][standard]

BrandMail empowers you to send HTML emails at scale, from any branded email address, without writing code.

**This app is currently in development**

<!--[Download Latest Release](https://github.com/paulshryock/BrandMail/releases/latest)-->

## BrandMail is for:

- Brand Managers
- Brand Coordinators
- Brand Communicators
- Project Managers
- Project Coordinators
- Administrative Assistants
- Executive Assistants
- Designers
- Clients

## BrandMail fits in many contexts:

- Internal Communications
- External Communications
- Brand Communications
- Client Communcations
- Marketing
- Transactions
- Outreach and prospecting

This is an open source project which uses the [The Hippocratic License][license].

## Quick Start

### Requirements

1. Node
  - Check if Node is installed: `node --version`
  - If you see a version number, such as `v11.6.0`, proceed to [Get Started](#get-started)
  - If Node isn't installed, [download][node-download] and install it, then proceed to [Get Started](#get-started)

2. **Wine**: for packaging Windows apps on MacOS
  - Install Wine (and its dependency xquartz) with homebrew
    - `brew cask install xquartz && brew install wine`

3. **Mono**: for generating Windows installer files on MacOS
  - Install Mono with homebrew
    - `brew install mono`

4. **Fakeroot**: for generating Linux installer files on MacOS
  - Install Fakeroot with homebrew
    - `brew install fakeroot`

5. **Debian Package**: for generating Linux installer files on MacOS
  - Install dpkg with homebrew
    - `brew install dpkg`

### Get Started

Fork or clone this repo and install dependencies:

```bash
git clone https://github.com/paulshryock/Gulp-Starter.git
cd Gulp-Starter
npm i
```

Create a `.env` file, and set the `SENDGRID_API_KEY`:

```bash
SENDGRID_API_KEY=THE_KEY_GOES_HERE
```

## Distribution

- Run `npm run dist` to create executable application files for MacOS, Windows, and Linux in `/dist`.
- Run `npm run installer` to create application installer files for MacOS, Windows, and Linux in `/dist/installers`.

## Documentation

[Project documentation][docs] files are in the `_docs` directory.

## Contributing

If you'd like to contribute, please read the [Code of Conduct][code-of-conduct] and [Contributing instructions][contributing], then fork the repository and use a feature branch. Pull requests are welcome.

[standard-badge]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard]: https://standardjs.com
[license]: https://firstdonoharm.dev/
[node-download]: https://nodejs.org/en/download/
[pkg]: package.json
[docs]: _docs/
[code-of-conduct]: CODE_OF_CONDUCT.md
[contributing]: CONTRIBUTING.md