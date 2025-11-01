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

    const waveform = 'acU6Va9UcSVZzsVw7IU/80s0Kh/pbrTcwmpR9da4mvQejIMykkgo9F2FfeCd235K/atHZtSAmxKeTUgKxAdNVO8PAoZq1cHNQXT/PHthL2sfPZGSdxNgLH0AuJwVeI7QZJ02ke40+HkUcBoDdqGDZeUvPqoIRbE23Kr+sexYYe4dVq+zyCe3ci/6zkMWbVBpCjq8D8ZZEFo/lmPJTkgjwqnqHuf6XT4mJyLNphQjvFH9aRqIZpPoQz1sGwAY2vssQ5mTy5J5muGo+n82b0xFROZwsJpumDsFi4Da/85uWS/YzjY5BdxGac8rgUqm9IKh7E6GHzOGOy0LQIz3O4ntTg==';

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

