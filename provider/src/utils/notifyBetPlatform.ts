const axios = require('axios')

export async function notifyBetPlatform(eventId: string, newStatus: string) {
    const webhookUrl = 'http://localhost:3001/api/webhook'

    try {
        const response = await axios.post(webhookUrl, {eventId, status: newStatus})
        console.log('Webhook sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending webhook:', error);
    }
}