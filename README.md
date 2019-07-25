# BrandMail

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

BrandMail empowers you to send HTML emails at scale, from any branded email address, without writing code.

**This app is currently in development**

<!--[Download Latest Release](https://github.com/paulshryock/BrandMail/releases/latest)-->

## BrandMail is for:

- Brand Managers
- Brand Coordinators
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

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Distribution](#distribution)
- [Contributing](#contributing)

## Requirements

1. Node
  - Check if Node is installed: `node --version`
  - If you see a version number, such as `v11.6.0`, proceed to [Installation](#installation)
  - If Node isn't installed, [download](https://nodejs.org) and install it, then proceed to [Installation](#installation)

2. Wine (for packaging Windows apps on MacOS)
  - Install Wine (and its dependency xquartz) with homebrew
    - `brew cask install xquartz && brew install wine`

3. Mono (for generating Windows installer files on MacOS)
  - Install Mono with homebrew
    - `brew install mono`

4. Fakeroot (for generating Linux installer files on MacOS)
  - Install Fakeroot with homebrew
    - `brew install fakeroot`

5. Debian Package (dpkg) (for generating Linux installer files on MacOS)
  - Install dpkg with homebrew
    - `brew install dpkg`

## Installation

1. Run the command below to clone this repository, enter the directory, and install dependencies.

  ```bash
  git clone https://github.com/paulshryock/BrandMail.git && cd Infosec-Password-Violation && npm install
  ```

2. Create a `.env` file, and set the `SENDGRID_API_KEY`:

  ```bash
  SENDGRID_API_KEY=THE_KEY_GOES_HERE
  ```

## Distribution

- Run `npm run dist` to create executable application files for MacOS, Windows, and Linux in `/dist`.
- Run `npm run installer` to create application installer files for MacOS, Windows, and Linux in `/dist/installers`.

## Contributing

If you'd like to contribute, please read the [Code of Conduct](https://github.com/paulshryock/BrandMail/blob/master/CODE_OF_CONDUCT.md) and [Contributing instructions](https://github.com/paulshryock/BrandMail/blob/master/CONTRIBUTING.md), then fork the repository and use a feature branch. Pull requests are welcome.