// Anzo © 2026
'use strict';

require('dotenv').config();
const { Client, RichPresence } = require('discord.js-selfbot-v13');

const animateLogo = () => {
    const frames = [
        ['\x1b[38;2;160;32;240m', '\x1b[38;2;120;80;255m', '\x1b[38;2;0;191;255m'],
        ['\x1b[38;2;0;191;255m',  '\x1b[38;2;160;32;240m', '\x1b[38;2;120;80;255m'],
        ['\x1b[38;2;120;80;255m', '\x1b[38;2;0;191;255m',  '\x1b[38;2;160;32;240m'],
    ];
    let i = 0;
    const iv = setInterval(() => {
        process.stdout.write('\x1b[2J\x1b[H');
        const f = frames[i % frames.length];
        console.log(`
    ${f[0]}██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗ ███████╗██████╗ 
    ${f[0]}██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗██╔════╝██╔══██╗
    ${f[1]}██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝█████╗  ██║  ██║
    ${f[1]}██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝ ██╔══╝  ██║  ██║
    ${f[2]}██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║     ███████╗██████╔╝
    ${f[2]}╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚══════╝╚═════╝ 

    ${f[0]}██████╗ ██╗   ██╗    ███████╗████████╗ █████╗ ██████╗ ██╗  ██╗
    ${f[1]}██╔══██╗╚██╗ ██╔╝    ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║ ██╔╝
    ${f[1]}██████╔╝ ╚████╔╝     ███████╗   ██║   ███████║██████╔╝█████╔╝ 
    ${f[2]}██╔══██╗  ╚██╔╝      ╚════██║   ██║   ██╔══██║██╔══██╗██╔═██╗ 
    ${f[2]}██████╔╝   ██║       ███████║   ██║   ██║  ██║██║  ██║██║  ██╗
    ${f[2]}╚═════╝    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝\x1b[0m
`);
        i++;
        if (i >= 6) clearInterval(iv);
    }, 200);
    return new Promise(r => setTimeout(r, 1300));
};

const config = {
    token:         process.env.TOKEN,
    guildId:       process.env.GUILD_ID,
    vcId:          process.env.VC_ID,
    appId:         '383226320970055681',
    imageMessage:  process.env.IMAGE_MSG_LARGE,
    imageMessage2: process.env.IMAGE_MSG_SMALL,
};

if (!config.token || !config.guildId || !config.vcId) {
    console.error('[-] Set TOKEN, GUILD_ID, VC_ID in .env');
    process.exit(1);
}

const sleep  = (ms) => new Promise(r => setTimeout(r, ms));
const jitter = (base, spread = 0.3) =>
    Math.round(base + (Math.random() * 2 - 1) * base * spread);

let cachedLargeImage = null;
let cachedSmallImage = null;

async function fetchImageUrls(c) {
    const fetchUrl = async (link) => {
        if (!link) return null;
        try {
            const parts = link.split('/');
            const msgId = parts[parts.length - 1];
            const chId  = parts[parts.length - 2];
            const channel = await c.channels.fetch(chId);
            const message = await channel.messages.fetch(msgId);
            const attachments = [...message.attachments.values()];
            return attachments[0]?.url || null;
        } catch { return null; }
    };
    const large = await fetchUrl(config.imageMessage);
    const small = await fetchUrl(config.imageMessage2);
    if (large) cachedLargeImage = large;
    if (small) cachedSmallImage = small;
}

const buildPresence = (c) => {
    const rpc = new RichPresence(c)
        .setApplicationId(config.appId)
        .setType('WATCHING')
        .setName('Vampire')
        .setDetails('Lust or Love ?')
        .setState('Asha4ever ?')
        .setStartTimestamp(Date.now());
    if (cachedLargeImage) rpc.setAssetsLargeImage(cachedLargeImage);
    rpc.setAssetsLargeText('Vamp');
    if (cachedSmallImage) rpc.setAssetsSmallImage(cachedSmallImage);
    rpc.setAssetsSmallText('AshaQt ?');
    return rpc;
};

const client = new Client({
    checkUpdate: false,
    ws: {
        properties: {
            os:                       'Windows',
            browser:                  'Discord Client',
            device:                   '',
            system_locale:            'en-US',
            browser_user_agent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) discord/1.0.9162 Chrome/120.0.6099.291 ' +
                'Electron/28.2.10 Safari/537.36',
            browser_version:          '28.2.10',
            os_version:               '10',
            referrer:                 '',
            referring_domain:         '',
            referrer_current:         '',
            referring_domain_current: '',
            release_channel:          'stable',
            client_build_number:      319653,
            client_event_source:      null,
        },
    },
    presence: {
        status:     'dnd',
        activities: [],
    },
});

function sendVoiceStateUpdate({ channelId = config.vcId, mute = false, deaf = false, video = false } = {}) {
    return client.ws.broadcast({
        op: 4,
        d: {
            guild_id:   config.guildId,
            channel_id: channelId,
            self_mute:  mute,
            self_deaf:  deaf,
            self_video: video,
        },
    });
}

async function joinVC() {
    const guild   = client.guilds.cache.get(config.guildId);
    if (!guild)   { console.error('[-] Guild not found'); return; }
    const channel = guild.channels.cache.get(config.vcId);
    if (!channel) { console.error('[-] VC channel not found'); return; }
    try {
        await sendVoiceStateUpdate({ channelId: config.vcId, mute: false, deaf: false });
        console.log(`[+] Joined VC → ${channel.name}`);
        await sleep(jitter(3800, 0.5));
        await sendVoiceStateUpdate({ deaf: true });
        await sleep(jitter(1200, 0.4));
        await sendVoiceStateUpdate({ deaf: false });
        console.log('[+] VC stable');
        scheduleVCPulse();
    } catch (err) {
        console.error('[-] VC join error:', err.message);
        const retryIn = jitter(14_000, 0.4);
        console.log(`[~] Retrying in ${(retryIn / 1000).toFixed(1)}s`);
        setTimeout(joinVC, retryIn);
    }
}

function scheduleVCPulse() {
    const delay = jitter(47_000, 0.28);
    setTimeout(async () => {
        try {
            await sendVoiceStateUpdate();
        } catch {
            console.warn('[!] VC pulse failed — rejoining');
            await joinVC();
            return;
        }
        scheduleVCPulse();
    }, delay);
}

function startRPCRefresh() {
    const tick = () => {
        const delay = jitter(62_000, 0.12);
        setTimeout(() => {
            client.user.setPresence({
                status:     'dnd',
                activities: [buildPresence(client)],
            });
            tick();
        }, delay);
    };
    tick();
}

client.on('ready', async () => {
    console.log(`[+] Authenticated as ${client.user.tag} (${client.user.id})`);
    await sleep(jitter(4000, 0.35));
    await fetchImageUrls(client);
    client.user.setPresence({
        status:     'dnd',
        activities: [buildPresence(client)],
    });
    console.log('[+] Presence set');
    startRPCRefresh();
    await sleep(jitter(3200, 0.45));
    await joinVC();
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (
        oldState.member?.id === client.user.id &&
        oldState.channelId  === config.vcId &&
        !newState.channelId
    ) {
        console.log('[!] Removed from VC — rejoining');
        await sleep(jitter(5500, 0.5));
        await joinVC();
    }
});

client.on('shardReconnecting', (id) => console.log(`[~] Shard ${id} reconnecting…`));

client.on('shardResume', async () => {
    console.log('[+] Shard resumed — restoring state');
    await sleep(jitter(2200, 0.4));
    client.user.setPresence({
        status:     'dnd',
        activities: [buildPresence(client)],
    });
    await joinVC();
});

client.on('error', (e) => console.error('[-] WS error:', e.message));

animateLogo().then(() => {
    client.login(config.token).catch((e) => {
        console.error('[-] Login failed:', e.message);
        process.exit(1);
    });
});
