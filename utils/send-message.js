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

        case 'interactive_cta':
        case 'interactive_list':
        case 'interactive_buttons':
            return await this.sendInteractiveMessage(recipientPhoneNumber, type, params);

        default:
            throw new Error(`Unsupported message type: ${type}`);
    }
}

module.exports.setRead = async (recipientPhoneNumber = '', externalId = '') => {
    if (!recipientPhoneNumber) throw new Error('Missing "recipientPhoneNumber" parameter');
    if (!externalId) throw new Error('Missing "externalId" parameter');

    let req = {
        messaging_product: "whatsapp",
        status: "read",
        message_id: externalId,
    };

    return await executeRequest(req, noResponse = true);
}

module.exports.setTypingIndicator = async (recipientPhoneNumber = '', externalId = '') => {
    if (!recipientPhoneNumber) throw new Error('Missing "recipientPhoneNumber" parameter');
    if (!externalId) throw new Error('Missing "externalId" parameter');

    let req = {
        messaging_product: "whatsapp",
        status: "read",
        message_id: externalId,
        typing_indicator: {
            type: "text"
        }
    };

    return await executeRequest(req, noResponse = true);
}

async function executeRequest(params, noResponse) {
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

        if (noResponse) return;

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

    if (params.replyToId) req.context = { message_id: params.replyToId };

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

    if (params.replyToId) req.context = { message_id: params.replyToId };

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

    if (params.replyToId) req.context = { message_id: params.replyToId };

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

    if (params.replyToId) req.context = { message_id: params.replyToId };

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

    if (params.replyToId) req.context = { message_id: params.replyToId };

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

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-cta-url-messages
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-list-messages
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-reply-buttons-messages
 */
module.exports.sendInteractiveMessage = async (recipientPhoneNumber = '', type, params = {}) => {
    if (!params.body) throw new Error('Missing "body" parameter for interactive message');
    if (params.body.length > 4096) throw new Error('Body text must be 4096 characters or less');
    if (!params.action) throw new Error('Missing "action" parameter for interactive message');
    if (params.footer && params.footer.length > 60) throw new Error('Footer text must be 60 characters or less');

    let req = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "interactive",
        interactive: {
            body: {
                text: params.body,
            },
            action: {}
        },
    };

    if (params.header?.type) req.interactive.header = getInteractiveHeader(params.header);
    if (params.footer) req.interactive.footer = { text: params.footer };

    switch (type) {
        case 'interactive_cta':
            req.interactive.type = 'cta_url';
            req.interactive.action = getInteractiveCTAAction(params.action);
            break;

        case 'interactive_list':
            if (params.header?.type !== 'text') throw new Error('Interactive list messages must have a text header');
            req.interactive.type = 'list';
            req.interactive.action = getInteractiveListAction(params.action);
            break;

        case 'interactive_buttons':
            req.interactive.type = 'button';
            req.interactive.action = getInteractiveButtonsAction(params.action);
            break;

        default:
            throw new Error(`Unsupported interactive message type: ${type}`);
    }

    return await executeRequest(req);
}

function getInteractiveHeader(header = { type: 'text' }) {
    if (!header) return null;

    switch (header.type) {
        case 'document':
            if (!header.link) throw new Error('Missing "header.link" parameter for document header');
            return {
                type: "document",
                document: {
                    link: header.link,
                    filename: header.filename || '',
                }
            };

        case 'image':
            if (!header.link) throw new Error('Missing "header.link" parameter for image header');
            return {
                type: "image",
                image: {
                    link: header.link
                }
            };

        case 'text':
            if (!header.text) throw new Error('Missing "header.text" parameter for text header');
            if (header.text.length > 60) throw new Error('Header text must be 60 characters or less');
            return {
                type: "text",
                text: header.text || ''
            };

        case 'video':
            if (!header.link) throw new Error('Missing "header.link" parameter for video header');
            return {
                type: "video",
                video: {
                    link: header.link
                }
            };

        default:
            throw new Error(`Unsupported header type: ${header.type}`);
    }
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-cta-url-messages
 */
function getInteractiveCTAAction(action = {}) {
    if (!action.displayText) throw new Error('Missing "displayText" parameter for interactive CTA action');
    if (!action.url) throw new Error('Missing "url" parameter for interactive CTA action');
    if (action.displayText.length > 20) throw new Error('Display text must be 20 characters or less');

    return {
        name: "cta_url",
        parameters: {
            display_text: action.displayText,
            url: action.url
        }
    }
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-list-messages
 */
function getInteractiveListAction(action = {}) {
    if (!action.displayText) throw new Error('Missing "displayText" parameter for interactive list message');
    if (!action.groups || !Array.isArray(action.groups) || action.groups.length === 0) throw new Error('Missing "groups" parameter for interactive list message');

    return {
        "button": action.displayText,
        "sections": action.groups.map(g => {
            if (!g.title) throw new Error('Missing "title" parameter for interactive list group');
            if (g.title.length > 24) throw new Error('Title text must be 24 characters or less');
            if (!g.options || !Array.isArray(g.options) || g.options.length === 0) throw new Error('Missing "options" parameter for interactive list group');

            return {
                "title": g.title,
                "rows": g.options.map(o => {
                    if (!o.id) throw new Error('Missing "id" parameter for interactive list option');
                    if (o.id.length > 200) throw new Error('ID text must be 200 characters or less');
                    if (!o.title) throw new Error('Missing "title" parameter for interactive list option');
                    if (o.title.length > 24) throw new Error('Title text must be 24 characters or less');
                    if (o.description && o.description.length > 72) throw new Error('Description text must be 72 characters or less');

                    return {
                        "id": o.id,
                        "title": o.title,
                        "description": o.description || ''
                    }
                })
            }
        })
    };
}

/**
 * https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-reply-buttons-messages
 */
function getInteractiveButtonsAction(action = {}) {
    if (!action.buttons || !Array.isArray(action.buttons) || action.buttons.length === 0) throw new Error('Missing "buttons" parameter for interactive reply buttons message');

    return {
        buttons: action.buttons.map(b => {
            if (!b.id) throw new Error('Missing "id" parameter for reply button');
            if (b.id.length > 200) throw new Error('ID text must be 200 characters or less');
            if (!b.title) throw new Error('Missing "title" parameter for reply button');
            if (b.title.length > 20) throw new Error('Title text must be 20 characters or less');
            return {
                type: "reply",
                reply: {
                    id: b.id,
                    title: b.title
                }
            }
        })
    }
}