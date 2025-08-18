const sendMessage = require('../utils/send-message');


(async () => {
    const recipientPhoneNumber = '5519994940824';
    let result = null;
    let req = {
        recipientPhoneNumber,
        type: '',
        params: {}
    };

    // Text message with URL preview.
    // req.type = 'text';
    // req.params = {
    //     previewUrl: true,
    //     body: 'Olá, tudo bem?\n\nAcesse https://www.google.com.br/',
    // };

    // Audio message
    // req.type = 'audio';
    // req.params = {
    //     link: 'https://file-examples.com/storage/fef6248bef689f7bb9c274f/2017/11/file_example_MP3_700KB.mp3'
    // };

    // Contacts message
    // req.type = 'contacts';
    // req.params = {
    //     firstName: 'Name',
    //     lastName: 'Lastname',
    //     emails: ['contactemail@gmail.com'],
    //     phones: ['155512345', '5519987654321']
    // };

    // Document message
    // req.type = 'document';
    // req.params = {
    //     link: 'https://file-examples.com/storage/fef6248bef689f7bb9c274f/2017/10/file-sample_150kB.pdf',
    //     caption: 'Document caption example.',
    //     filename: 'filename-example.pdf'
    // };

    // Image message
    // req.type = 'image';
    // req.params = {
    //     link: 'https://file-examples.com/storage/fef6248bef689f7bb9c274f/2017/10/file_example_PNG_500kB.png',
    //     caption: 'Image caption example.'
    // };

    // Video message
    // req.type = 'video';
    // req.params = {
    //     link: 'https://file-examples.com/storage/fef6248bef689f7bb9c274f/2017/04/file_example_MP4_480_1_5MG.mp4',
    //     caption: 'Video caption example.'
    // };

    // Reaction message
    // req.type = 'reaction';
    // req.params = {
    //     messageId: 'wamid.HBgNNTUxOTk5NDk0MDgyNBUCABEYEjA3NkE5RTcwNkUyNDAzMTVFMQA=',
    //     emoji: '\uD83D\uDE00' // C/C++ Java Source Code https://it-tools.tech/emoji-picker
    // };

    result = await sendMessage.sendMessage(req);
    console.log(JSON.stringify(result, null, 2));
})();