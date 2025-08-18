const axios = require('axios');

const API_VERSION = 'v23.0'; // Example: 'v23.0'

module.exports.sendMessage = async ({
    recipientPhoneNumber = '',
    type = 'text',
    params = {},
}) => {
    if (!recipientPhoneNumber) throw new Error('Missing "recipientPhoneNumber" parameter');
    if (!type) throw new Error('Missing type parameter');

    switch (type) {
        case 'audio':
            return await this.sendAudioMessage(recipientPhoneNumber, params);

        case 'contacts':
            return await this.sendContactsMessage(recipientPhoneNumber, params);

        case 'document':
            return await this.sendDocumentMessage(recipientPhoneNumber, params);

        case 'image':
            return await this.sendImageMessage(recipientPhoneNumber, params);

        case 'text':
            return await this.sendTextMessage(recipientPhoneNumber, params);

        case 'video':
            return await this.sendVideoMessage(recipientPhoneNumber, params);

        case 'reaction':
            return await this.sendReactionMessage(recipientPhoneNumber, params);

        default:
            throw new Error(`Unsupported message type: ${type}`);
    }
}

async function executeRequest(params) {
    try {
        let result = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
            params,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                }
            }
        );
        return {
            recipientPhoneNumber: result?.data?.contacts[0]?.wa_id,
            externalId: result?.data?.messages[0]?.id
        }
    } catch (error) {
        console.error('Error sending message:', error.response ? JSON.stringify(error.response.data) : error.message);
        throw error;
    }
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/audio-messages
 */
module.exports.sendAudioMessage = async (recipientPhoneNumber = '', params = {}) => {
    if (!params.link) throw new Error('Missing link parameter for audio message');

    let req = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "audio",
        audio: {
            link: params.link
        }
    }

    return await executeRequest(req);
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/contacts-messages
 */
module.exports.sendContactsMessage = async (recipientPhoneNumber = '', params = {}) => {
    if (!params.firstName) throw new Error('Missing "firstName" parameter for contacts message');
    if (!params.emails?.length || !params.phones?.length) throw new Error('Missing "emails" or "phones" parameter for contacts message');

    let req = {
        messaging_product: "whatsapp",
        to: recipientPhoneNumber,
        type: "contacts",
        contacts: [
            {
                emails: (params.emails || []).map(e => {
                    return { email: e }
                }),
                name: {
                    formatted_name: [params.firstName, params.lastName].filter(Boolean).join(' '),
                    first_name: params.firstName,
                    last_name: params.lastName || '',
                },
                phones: (params.phones || []).map(p => {
                    return { phone: p }
                }),
            }
        ]
    }

    return await executeRequest(req);
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/document-messages
 */
module.exports.sendDocumentMessage = async (recipientPhoneNumber = '', params = {}) => {
    if (!params.link) throw new Error('Missing link parameter for document message');

    let req = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "document",
        document: {
            link: params.link,
            caption: params.caption || '',
            filename: params.filename || '',
        }
    }
    return await executeRequest(req);
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/image-messages
 */
module.exports.sendImageMessage = async (recipientPhoneNumber = '', params = {}) => {
    if (!params.link) throw new Error('Missing link parameter for image message');

    let req = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "image",
        image: {
            link: params.link,
            caption: params.caption || '',
        }
    }

    return await executeRequest(req);
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages
 */
module.exports.sendTextMessage = async (recipientPhoneNumber = '', params = {}) => {
    if (!params.body) throw new Error('Missing "body" parameter for text message');

    let req = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "text",
        text: {
            preview_url: params.previewUrl || false,
            body: params.body
        }
    }

    return await executeRequest(req);
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/video-messages
 */
module.exports.sendVideoMessage = async (recipientPhoneNumber = '', params = {}) => {
    if (!params.link) throw new Error('Missing link parameter for video message');

    let req = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "video",
        video: {
            link: params.link,
            caption: params.caption || ''
        }
    }

    return await executeRequest(req);
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/reaction-messages
 */
module.exports.sendReactionMessage = async (recipientPhoneNumber = '', params = {}) => {
    if (!params.messageId) throw new Error('Missing "messageId" parameter for reaction message');
    if (!params.emoji) throw new Error('Missing "emoji" parameter for reaction message');

    let req = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "reaction",
        reaction: {
            message_id: params.messageId,
            emoji: params.emoji,
        }
    }

    return await executeRequest(req);
}