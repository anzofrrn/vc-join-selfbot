# VC Join 24/7 SelfBot

Join VC 24/7 & also have a RPC.

## Setup

### 1. Download

Download or clone the files and open a terminal in the project folder.

### 2. Install Dependencies

```bash
npm i
```

### 3. Configure `.env`

Rename:

```text
example.env
```

to:

```text
.env
```

Then open `.env` and add your values:

```env
TOKEN=
GUILD_ID=
VC_ID=
IMAGE_MSG_LARGE=
IMAGE_MSG_SMALL=
```

### 4. Start

Run:

```bash
node index.js
```

## Configuration

| Variable | Description |
|---|---|
| `TOKEN` | Discord account token |
| `GUILD_ID` | Discord server ID |
| `VC_ID` | Voice channel ID |
| `IMAGE_MSG_LARGE` | Discord message URL containing the large image |
| `IMAGE_MSG_SMALL` | Discord message URL containing the small image |
Note: I suggest make an gc (with account which is used here) > send image > copy message link > paste in .env

## Author

Username: loveinruin

[![Support Server](https://img.shields.io/discord/1070267471958614057?color=7289da&label=Support%20Server&logo=discord)](https://discord.gg/codez)

## Copyright

Copyright Anzo © 2026
