import 'dotenv/config';
import embeddings from "@themaximalist/embeddings.js";

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
    
    return dot / (normA * normB);
}

export async function isWeatherColdMessage(message) {
    const positives = [
        "It's cold outside.",
        "The weather is freezing.",
        "My hands are freezing.",
        "It's so chilly today.",
        "It's freezing right now.",
    ];

    const negatives = [
        "I caught a cold.",
        "I have a fever and chills.",
        "The atmosphere feels cold.",
        "That person is cold-hearted.",
        "I'm hungry.",
    ];

    const msgEmbedding = await embeddings(message);

    const posEmbeddings = await Promise.all(positives.map(p => embeddings(p)));
    const negEmbeddings = await Promise.all(negatives.map(n => embeddings(n)));

    const avgPosSim = posEmbeddings.reduce((sum, e) => sum + cosineSimilarity(msgEmbedding, e), 0) / posEmbeddings.length;
    const avgNegSim = negEmbeddings.reduce((sum, e) => sum + cosineSimilarity(msgEmbedding, e), 0) / negEmbeddings.length;

    const isCold = avgPosSim > avgNegSim && avgPosSim > 0.5;

    // console.log({
    //     message,
    //     avgPosSim: avgPosSim.toFixed(3),
    //     avgNegSim: avgNegSim.toFixed(3),
    //     result: isCold,
    // });

    return isCold;
}