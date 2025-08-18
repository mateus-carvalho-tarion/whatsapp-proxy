/**
 * Extracts data from WhatsApp Business API webhook payloads.
 * @param {Object} data - The incoming data from the WhatsApp Business API webhook.
 * @param {Object} data.object - The object type of the incoming data, expected to be 'whatsapp_business_account'.
 * @returns {Array} An array of the extracted entries.
 * @throws {Error} If the object type is not 'whatsapp_business_account' or if required fields are missing in the data.
 */
module.exports.extract = ({ data = {} }) => {
    if (data?.object != 'whatsapp_business_account') throw new Error('The object is not a WhatsApp Business Account');

    let extractedEntries = [];
    for (let entry of data?.entry || []) {
        if (!entry?.id) {
            console.warn(`No ID found in entry  ${data?.entry.indexOf(entry)}`);
            continue;
        }

        if (entry.id !== process.env.ACCOUNT_ID) {
            console.warn(`Entry ID ${entry.id} does not match ACCOUNT_ID ${process.env.ACCOUNT_ID}`);
            continue;
        }

        for (let change of entry.changes || []) {
            if (change?.value?.messaging_product !== 'whatsapp') {
                console.warn(`Messaging product is not 'whatsapp' in entry ${data?.entry.indexOf(entry)} (${change?.value?.messaging_product})`);
                continue;
            }

            if (!change?.value?.metadata) {
                console.warn(`No metadata found in change ${entry.changes.indexOf(change)} of entry ${data?.entry.indexOf(entry)}`);
                continue;
            }

            if (change?.value?.metadata?.phone_number_id !== process.env.PHONE_NUMBER_ID) {
                console.warn(`Phone number ID ${change?.value?.metadata?.phone_number_id} does not match PHONE_NUMBER_ID ${process.env.PHONE_NUMBER_ID}`);
                continue;
            }

            let sender = this.extractSender({ metadata: change?.value?.metadata });

            if (change?.field == 'messages') {
                let extractedEntry = { sender };

                if (change?.value?.contacts?.[0]) extractedEntry.recipient = this.extractRecipient({ contact: change?.value?.contacts?.[0] });
                if (change?.value?.messages) extractedEntry.messages = this.extractMessages({ messages: change?.value?.messages });
                if (change?.value?.statuses) extractedEntry.statuses = this.extractStatuses({ statuses: change.value.statuses });

                extractedEntries.push(extractedEntry);
            }
        }
    }

    return extractedEntries;
}

/**
 * Extract status information from the contact object of the incoming data.
 * @param {Array} statuses - The statuses array containing status objects.
 * @param {string} statuses.id - The id of the refered message.
 * @param {string} statuses.status - The status of the refered message.
 * @returns {Array} An array of content objects extracted from the statuses.
 */
module.exports.extractStatuses = ({ statuses = [{ id: 'wamid.JHaksjdga', status: 'sent', timestamp: '1755291448' }] }) => {
    let result = [];
    for (let status of statuses) {
        if (!status.id) {
            console.warn(`No id found in status ${statuses.indexOf(status)}`);
            continue;
        }

        if (!status.status) {
            console.warn(`No status found in status ${statuses.indexOf(status)}`);
            continue;
        }

        result.push({
            externalId: status.id,
            status: status.status,
            timestamp: status.timestamp
        });
    }

    return result;
}

/** 
 * Extracts sender information from the metadata of the incoming data.
 * @param {Object} metadata - The metadata object containing sender information.
 * @param {string} metadata.display_phone_number - The phone number of the sender.
 * @param {string} metadata.phone_number_id - The phone number ID of the sender.
 * @returns {Object} An object containing the phone number and phone number ID of the sender.
 * @throws {Error} If the display_phone_number or phone_number_id is not found in the metadata.
 */
module.exports.extractSender = ({ metadata = { display_phone_number: "15550000000", phone_number_id: "119900000000000" } }) => {
    if (!metadata?.display_phone_number) throw new Error('No display_phone_number found in metadata');
    if (!metadata?.phone_number_id) throw new Error('No phone_number_id found in metadata');

    return {
        phoneNumber: metadata?.display_phone_number || null,
        phoneNumberId: metadata?.phone_number_id || null,
    };
}

/**
 * Extracts recipient information from the contact object of the incoming data.
 * @param {Object} contact - The contact object containing recipient information.
 * @param {Object} contact.profile - The profile object containing the name of the recipient.
 * @param {string} contact.profile.name - The name of the recipient.
 * @param {string} contact.wa_id - The WhatsApp ID of the recipient.
 * @returns {Object} An object containing the name and phone number of the recipient.
 * @throws {Error} If the wa_id is not found in the contact object.
 */
module.exports.extractRecipient = ({ contact = { profile: { name: "Profile Name" }, wa_id: "5519000000000" } }) => {
    if (!contact?.wa_id) throw new Error('No wa_id found in contact');

    return {
        name: contact?.profile?.name || null,
        phoneNumber: contact?.wa_id || null,
    };
}

/** 
 * Extracts content from the messages array of the incoming data.
 * It handles various message types such as text, image, audio, video, document, sticker, location, and contacts.
 * @param {Object} messages - The messages array containing message objects.
 * @param {Array} messages.messages - An array of message objects in the WhatsApp Business API format.
 * @returns {Array} An array of content objects extracted from the messages.
 * @throws {Error} If the messages array is not found or is empty.
 */
module.exports.extractMessages = ({ messages = [{ from: "5519000000000", id: "wamid.HBgNNTUxOTk5NDk0MDgyNB767777", timestamp: "1755291448", type: "text" }] }) => {
    let contents = [];
    for (let message of messages) {
        if (!message?.id) {
            console.warn(`No id found in message ${messages.indexOf(message)}`);
            continue;
        }

        if (!message?.from) {
            console.warn(`No from found in message ${messages.indexOf(message)}`);
            continue;
        }

        if (!message?.timestamp) {
            console.warn(`No timestamp found in message ${messages.indexOf(message)}`);
            continue;
        }

        let content = null;
        switch (message?.type) {
            case 'text':
                content = this.extractText({ text: message?.text });
                break;

            case 'image':
                content = this.extractImage({ image: message?.image });
                break;

            case 'audio':
                content = this.extractAudio({ audio: message?.audio });
                break;

            case 'video':
                content = this.extractVideo({ video: message?.video });
                break;

            case 'document':
                content = this.extractDocument({ document: message?.document });
                break;

            case 'sticker':
                content = this.extractSticker({ sticker: message?.sticker });
                break;

            case 'location':
                content = this.extractLocation({ location: message?.location });
                break;

            case 'contacts':
                content = this.extractContacts({ contacts: message?.contacts });
                break;

            case 'interactive':
                content = this.extractInteractive({ interactive: message?.interactive });
                break;

            case 'reaction':
                content = this.extractReaction({ reaction: message?.reaction });
                break;

            case 'order':
                content = this.extractOrder({ order: message?.order });
                break;

            case 'button':
                content = this.extractButton({ button: message?.button });
                break;

            default:
                throw new Error(`Unsupported message type '${message?.type}' in message ${messages.indexOf(message)}`);
        }

        if (content) {
            if (message?.context) content.reference = this.extractReferenceMessage({ context: message?.context });
            content.externalId = message?.id || null;
            content.timestamp = message?.timestamp || null;
            contents.push(content);
        }
    }

    return contents;
}

/**
 * Extracts text content from the text object of the incoming data.
 * @param {Object} text - The text object containing the body of the message.
 * @param {string} text.body - The body of the text message.
 * @returns {Object} An object containing the type and text of the message.
 * @throws {Error} If the body is not found in the text object.
 */
module.exports.extractText = ({ text = { body: "body message" } }) => {
    if (!text?.body) throw new Error('No text body found in text object');

    return {
        type: 'text',
        text: text?.body || null,
    };
}

/**
 * Extracts image information from the image object of the incoming data.
 * @param {Object} image - The image object containing media information.
 * @param {string} image.id - The ID of the image.
 * @param {string} image.caption - The caption of the image.
 * @param {string} image.mime_type - The MIME type of the image.
 * @returns {Object} An object containing the type, media ID, caption, and MIME type of the image.
 * @throws {Error} If the id is not found in the image object.
 */
module.exports.extractImage = ({ image = { id: "wamid.HBgNNTUxOTk5NDk0MDgyNB767777", caption: "Image caption", mime_type: "image/jpeg" } }) => {
    if (!image?.id) throw new Error('No image id found in image object');

    return {
        type: 'image',
        mediaId: image?.id || null,
        caption: image?.caption || null,
        mimeType: image?.mime_type || null,
    };
}

/**
 * Extracts audio information from the audio object of the incoming data.
 * @param {Object} audio - The audio object containing media information.
 * @param {string} audio.id - The ID of the audio.
 * @param {string} audio.mime_type - The MIME type of the audio.
 * @param {boolean} audio.voice - Whether the audio is a voice message.
 * @returns {Object} An object containing the type, media ID, MIME type, and voice flag of the audio.
 * @throws {Error} If the id is not found in the audio object.
 */
module.exports.extractAudio = ({ audio = { id: "wamid.HBgNNTUxOTk5NDk0MDgyNB767777", mime_type: "audio/ogg", voice: true } }) => {
    if (!audio?.id) throw new Error('No audio id found in audio object');

    return {
        type: 'audio',
        mediaId: audio?.id || null,
        mimeType: audio?.mime_type || null,
        voice: audio?.voice || false,
    };
}

/**
 * Extracts video information from the video object of the incoming data.
 * @param {Object} video - The video object containing media information.
 * @param {string} video.id - The ID of the video.
 * @param {string} video.caption - The caption of the video.
 * @param {string} video.mime_type - The MIME type of the video.
 * @returns {Object} An object containing the type, media ID, caption, and MIME type of the video.
 * @throws {Error} If the id is not found in the video object.
 */
module.exports.extractVideo = ({ video = { id: "wamid.HBgNNTUxOTk5NDk0MDgyNB767777", caption: "Video caption", mime_type: "video/mp4" } }) => {
    if (!video?.id) throw new Error('No video id found in video object');

    return {
        type: 'video',
        mediaId: video?.id || null,
        caption: video?.caption || null,
        mimeType: video?.mime_type || null,
    };
}

/**
 * Extracts document information from the document object of the incoming data.
 * @param {Object} document - The document object containing media information.
 * @param {string} document.id - The ID of the document.
 * @param {string} document.filename - The filename of the document.
 * @param {string} document.mime_type - The MIME type of the document.
 * @param {string} document.caption - The caption of the document.
 * @returns {Object} An object containing the type, media ID, filename, MIME type, and caption of the document.
 * @throws {Error} If the id is not found in the document object.
 */
module.exports.extractDocument = ({ document = { id: "wamid.HBgNNTUxOTk5NDk0MDgyNB767777", filename: "file.pdf", mime_type: "application/pdf", caption: "Document caption" } }) => {
    if (!document?.id) throw new Error('No document id found in document object');

    return {
        type: 'document',
        mediaId: document?.id || null,
        filename: document?.filename || null,
        mimeType: document?.mime_type || null,
        caption: document?.caption || null,
    };
}

/**
 * Extracts sticker information from the sticker object of the incoming data.
 * @param {Object} sticker - The sticker object containing media information.
 * @param {string} sticker.id - The ID of the sticker.
 * @param {string} sticker.mime_type - The MIME type of the sticker.
 * @param {boolean} sticker.animated - Whether the sticker is animated.
 * @returns {Object} An object containing the type, media ID, MIME type, and animated flag of the sticker.
 * @throws {Error} If the id is not found in the sticker object.
 */
module.exports.extractSticker = ({ sticker = { id: "wamid.HBgNNTUxOTk5NDk0MDgyNB767777", mime_type: "image/webp", animated: false } }) => {
    if (!sticker?.id) throw new Error('No sticker id found in sticker object');

    return {
        type: 'sticker',
        mediaId: sticker?.id || null,
        mimeType: sticker?.mime_type || null,
        animated: sticker?.animated || false,
    };
}

/**
 * Extracts location information from the location object of the incoming data.
 * @param {Object} location - The location object containing coordinates and optional details.
 * @param {number} location.latitude - The latitude of the location.
 * @param {number} location.longitude - The longitude of the location.
 * @param {string} location.name - The name of the location.
 * @param {string} location.address - The address of the location.
 * @returns {Object} An object containing the type, latitude, longitude, name, and address of the location.
 * @throws {Error} If the latitude or longitude is not found in the location object.
 */
module.exports.extractLocation = ({ location = { latitude: -23.55052, longitude: -46.633308, name: "São Paulo", address: "SP, Brazil" } }) => {
    if (!location?.latitude || !location?.longitude) throw new Error('No location coordinates found in location object');

    return {
        type: 'location',
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        name: location?.name || null,
        address: location?.address || null,
    };
}

/**
 * Extracts contacts information from the contacts object of the incoming data.
 * @param {Array} contacts - An array of contact objects.
 * @returns {Object} An object containing the type and an array of contacts with formatted names and phone numbers.
 * @throws {Error} If contacts is not found or is empty.
 */
module.exports.extractContacts = ({ contacts = [{ name: { formatted_name: "John Doe", first_name: "John", last_name: "Doe" }, phones: [{ wa_id: "5519000000000" }] }] }) => {
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) throw new Error('No contacts found in contacts object');

    return {
        type: 'contacts',
        contacts: contacts.map(contact => ({
            name: contact?.name?.formatted_name || ([contact?.name?.first_name, contact?.name?.last_name].filter(Boolean).join(" ")) || null,
            phones: contact?.phones?.map(p => p.wa_id || p.phone).filter(Boolean) || [],
        })),
    };
}

/**
 * Extracts reference message information from the context of the incoming data.
 * @param {Object} context - The context object containing reference message information.
 * @param {string} context.from - The phone number of the sender of the reference message.
 * @param {string} context.id - The ID of the reference message.
 * @returns {Object} An object containing the phone number and ID of the reference message.
 * @throws {Error} If the from or id is not found in the context.
 */
module.exports.extractReferenceMessage = ({ context = { "from": "15190000000000", "id": "wamid.HBgNNTUxOTk5NDk0MDgyNBU8888" } }) => {
    if (!context) return null;

    if (!context?.from) {
        console.warn('No from found in context');
        return null;
    }
    if (!context?.id) {
        console.warn('No id found in context');
        return null;
    }

    return {
        from: context?.from || null,
        id: context?.id || null,
    };
}

module.exports.extractInteractive = ({ interactive = { type: '' } }) => {
    switch (interactive?.type) {
        case 'button_reply':
            return this.extractInteractiveButtonReply({ interactive });

        case 'list_reply':
            return this.extractInteractiveListReply({ interactive });

        default:
            throw new Error(`Unsupported interactive type '${interactive?.type}'`);
    }
}

module.exports.extractInteractiveButtonReply = ({ button_reply = { id: 'button1', title: 'Button 1' } }) => {
    return {
        type: 'button_reply',
        id: button_reply?.id || null,
        title: button_reply?.title || null,
    };
}

module.exports.extractInteractiveListReply = ({ list_reply = { id: 'list1', title: 'List 1', description: 'Desription 1' } }) => {
    return {
        type: 'list_reply',
        id: list_reply?.id || null,
        title: list_reply?.title || null,
        description: list_reply?.description || null,
    };
}

module.exports.extractReaction = ({ reaction = { message_id: 'wamid.HBgNNTUxOTk5NDk0MDgyNB767777', emoji: '👍' } }) => {
    if (!reaction?.message_id) throw new Error('No message_id found in reaction object');
    if (!reaction?.emoji) throw new Error('No emoji found in reaction object');

    return {
        type: 'reaction',
        messageId: reaction?.message_id || null,
        emoji: reaction?.emoji || null,
    };
}

module.exports.extractButton = ({ button = { payload: 'reply', text: 'Text' } }) => {
    if (!button?.payload) throw new Error('No payload found in button object');
    if (!button?.text) throw new Error('No text found in button object');

    return {
        type: 'button',
        payload: button?.payload || null,
        text: button?.text || null,
    };
}

module.exports.extractOrder = ({ order = { catalog_id: 'catalog_id_123', text: 'Order text', product_items: [{ product_retailer_id: 'product_id_123', quantity: 1, item_price: 199.99, currency: 'BRL' }] } }) => {
    if (!order?.catalog_id) throw new Error('No catalog_id found in order object');
    if (!order?.product_items || !Array.isArray(order.product_items) || order.product_items.length === 0) throw new Error('No product_items found in order object');

    return {
        type: 'order',
        catalogId: order?.catalog_id,
        text: order?.text || null,
        productItems: order.product_items.map(item => {
            return {
                productRetailerId: item?.product_retailer_id || null,
                quantity: item?.quantity || 1,
                itemPrice: item?.item_price || 0,
                currency: item?.currency || 'USD',
            }
        }),
    };
}