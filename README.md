# dgnengi

A fork of nengi and nengi-2d-csp updated to work with Node.js 22.

## Changes Made

- Replaced deprecated `@clusterws/cws` with standard `ws` package
- Removed `esm` module dependency and converted to native ES modules  
- Added `.js` extensions to all import statements (434 files updated)
- Updated webpack configuration for Node.js 22 compatibility
- Added `--openssl-legacy-provider` flag for webpack 4 compatibility

## Installation

```bash
git clone https://github.com/velimirj1/dgnengi.git
cd dgnengi

# Install nengi dependencies
cd nengi
npm install

# Install nengi-2d-csp dependencies
cd ../nengi-2d-csp
npm install
```

## Running the Example

```bash
cd nengi-2d-csp

# Run both server and client
npm start

# Or run separately:
# Terminal 1
npm run server

# Terminal 2
npm run client
```

The client will be available at http://localhost:8080

## Original Projects

- [nengi](https://github.com/timetocode/nengi)
- [nengi-2d-csp](https://github.com/timetocode/nengi-2d-csp)