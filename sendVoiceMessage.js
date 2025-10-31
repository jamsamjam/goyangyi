import { readFileSync } from 'fs';
import { getAudioDurationInSeconds } from 'get-audio-duration';

export async function sendVoiceMessage(channelId, audioFilePath, botToken) {
    const fileBuffer = readFileSync(audioFilePath);
    const fileSize = fileBuffer.length;
    const duration = await getAudioDurationInSeconds(audioFilePath);

    const uploadResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}/attachments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${botToken}`
        },
        body: JSON.stringify({
            files: [{
                filename: 'voice-message.ogg',
                file_size: fileSize,
                id: '2'
            }]
        })
    });

    const uploadData = await uploadResponse.json();
    const { upload_url, upload_filename } = uploadData.attachments[0];

    await fetch(upload_url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'audio/ogg',
            'Authorization': `Bot ${botToken}`
        },
        body: fileBuffer
    });

    const waveform = Buffer.from(new Uint8Array(256).fill(128)).toString('base64');

    const messageResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${botToken}`
        },
        body: JSON.stringify({
            flags: 8192, // IS_VOICE_MESSAGE
            attachments: [{
                id: '0',
                filename: 'voice-message.ogg',
                uploaded_filename: upload_filename,
                duration_secs: duration,
                waveform: waveform
            }]
        })
    });

    return await messageResponse.json();
}

