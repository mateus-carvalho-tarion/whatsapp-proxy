const extractData = require('../utils/extract-data');
const sampleAudio = require('../samples/audio.json');
const sampleContacts = require('../samples/contacts.json');
const sampleDocument = require('../samples/document.json');
const sampleImage = require('../samples/image.json');
const sampleLocation = require('../samples/location.json');
const sampleSticker = require('../samples/sticker.json');
const sampleText = require('../samples/text.json');
const sampleTextReply = require('../samples/text-reply.json');
const sampleVideo = require('../samples/video.json');
const sampleMessageStatusUpdate = require('../samples/message-status-update.json');

let result;

result = null;
result = extractData.extract({ data: sampleMessageStatusUpdate });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleTextReply });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleText });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleAudio });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleContacts });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleDocument });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleImage });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleLocation });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleSticker });
console.log(JSON.stringify(result, null, 2));

result = null;
result = extractData.extract({ data: sampleVideo });
console.log(JSON.stringify(result, null, 2));