# NearClaw

Anonymous confessions and confidential matchmaking on NEAR Protocol.

Users join themed confession pools to post anonymously through a relay server that strips identity before uploading to Nova TEE-encrypted storage. A separate matchmaking system lets users submit encrypted preferences and get paired with compatible people for private 1-on-1 chats.

## Architecture

```
Frontend (React)  -->  Relay Server (Express)  -->  Nova SDK (TEE + IPFS)
     |                                                     |
     +--- Wallet Selector (MyNearWallet, testnet) ---------+
     |
     +--- NEAR Social (profiles)
```

- **Frontend** -- React 19, TypeScript, Vite, Tailwind CSS v4
- **Relay Server** -- Express server that acts as the pool operator, strips sender identity from confessions before uploading
- **Nova SDK** -- Handles TEE encryption, IPFS storage, and group-based access control on NEAR
- **NEAR Social** -- User profiles stored on-chain via near-social-js

## Features

- **Confession Pools** -- Themed anonymous confession feeds (crypto, dating, life, campus, work, general)
- **Anonymous Posting** -- Relay server strips identity; confessions are uploaded by the operator account
- **TEE Encryption** -- All data encrypted inside Trusted Execution Environments via Nova SDK
- **Matchmaking** -- Submit encrypted preferences, get paired by compatibility score
- **Encrypted Chat** -- 1-on-1 messaging between matched users through Nova group channels
- **Data Sovereignty** -- Export your data as JSON or permanently delete your account from the protocol
- **On-Chain Profiles** -- NEAR Social integration for display names and avatars

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v7 |
| State | Zustand |
| Wallet | NEAR Wallet Selector (MyNearWallet, Meteor, Here) |
| Encryption | Nova SDK (TEE + IPFS) |
| Profiles | near-social-js |
| Relay Server | Express, Node.js |
| Network | NEAR Testnet |

## Project Structure

```
near-hinged/
  src/
    components/    # UI components (Navigation, ConfessionCard, CreateConfessionModal)
    pages/         # Route pages (Home, ConfessionFeed, PoolDetail, Matching, Matches, Chat, Profile, DataSovereignty)
    providers/     # Context providers (WalletProvider, NovaProvider, SocialProvider)
    store/         # Zustand stores (confessionStore, matchingStore)
    config/        # Constants and configuration
  server/
    src/index.ts   # Express relay server
```

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- A NEAR testnet wallet (create at https://testnet.mynearwallet.com)
- A Nova SDK account (create at https://nova-sdk.dev)

### Environment Variables

Frontend (`.env`):

```
VITE_NOVA_API_KEY=<your-nova-api-key>
VITE_RELAY_URL=http://localhost:3001
VITE_MOCK_MODE=true
```

Relay Server (`server/.env`):

```
POOL_OPERATOR_ACCOUNT=<your-account>.nova-sdk-6.testnet
NOVA_API_KEY=<your-nova-api-key>
PORT=3001
MOCK_MODE=true
```

Set `MOCK_MODE=false` to use the real Nova SDK instead of the in-memory mock store.

### Install and Run

```bash
# Frontend
pnpm install
pnpm dev

# Relay server (separate terminal)
cd server
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:5173`, relay server on `http://localhost:3001`.

## How It Works

1. User connects their NEAR testnet wallet.
2. User joins a confession pool. The relay server registers a Nova group and adds them as a member.
3. User writes a confession. The relay server verifies membership, strips the sender identity, and uploads the encrypted confession as the operator account.
4. Other pool members retrieve and decrypt confessions through Nova SDK.
5. For matchmaking, users submit encrypted preferences which are compared inside TEEs to produce compatibility scores.
6. Matched users communicate through encrypted Nova group channels.

## Accounts

Two types of NEAR accounts are involved:

- **User wallet** (e.g. `yourname.testnet`) -- connects in the app, joins pools, browses confessions
- **Operator account** (e.g. `yourname.nova-sdk-6.testnet`) -- server-side only, manages Nova groups and posts confessions anonymously

## License

MIT