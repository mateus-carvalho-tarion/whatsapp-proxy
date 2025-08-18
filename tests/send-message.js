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

    // Interactive CTA message with text header and footer
    // req.type = 'interactive_cta';
    // req.params = {
    //     header: {
    //         type: 'text',
    //         text: 'Header text example'
    //     },
    //     body: 'Body text example',
    //     footer: 'Footer text example',
    //     action: {
    //         url: 'https://www.google.com.br',
    //         displayText: 'Open URL'
    //     }
    // };

    // Interactive CTA message with image header and text footer
    // req.type = 'interactive_cta';
    // req.params = {
    //     header: {
    //         type: 'image',
    //         link: 'https://file-examples.com/storage/fef6248bef689f7bb9c274f/2017/10/file_example_PNG_500kB.png'
    //     },
    //     body: 'Body text example',
    //     footer: 'Footer text example',
    //     action: {
    //         url: 'https://www.google.com.br',
    //         displayText: 'Open URL'
    //     }
    // };

    // Interactive CTA message with video header and text footer
    // req.type = 'interactive_cta';
    // req.params = {
    //     header: {
    //         type: 'video',
    //         link: 'https://file-examples.com/storage/fef6248bef689f7bb9c274f/2017/04/file_example_MP4_480_1_5MG.mp4'
    //     },
    //     body: 'Body text example.\nThis is a video header.',
    //     footer: 'Footer text example',
    //     action: {
    //         url: 'https://www.google.com.br',
    //         displayText: 'Open URL'
    //     }
    // };

    // Interactive CTA message with document header and text with emoji footer
    // req.type = 'interactive_cta';
    // req.params = {
    //     header: {
    //         type: 'document',
    //         link: 'https://file-examples.com/storage/fef6248bef689f7bb9c274f/2017/10/file-sample_150kB.pdf',
    //         filename: 'filename-example.pdf',
    //     },
    //     body: 'Body text example.\nThis is a document header.',
    //     footer: 'Footer text example \uD83D\uDE00',
    //     action: {
    //         url: 'https://www.google.com.br',
    //         displayText: 'Open URL'
    //     }
    // };

    // Interactive list message with header (only text accepted) and text footer
    // req.type = 'interactive_list';
    // req.params = {
    //     header: {
    //         type: 'text',
    //         text: 'Sample text header'
    //     },
    //     body: 'Body text example',
    //     footer: 'Footer text example',
    //     action: {
    //         displayText: 'Open URL',
    //         groups: [
    //             {
    //                 title: 'Example group 1',
    //                 options: [
    //                     { id: 'option1', title: 'Option Item 1', description: 'Sample description for option item 1' },
    //                     { id: 'option2', title: 'Option Item 2' },
    //                 ],
    //             },
    //             {
    //                 title: 'Example group 2',
    //                 options: [
    //                     { id: 'option1', title: 'Option Item 1 Group 2', description: 'Sample description for option item 1' },
    //                     { id: 'option2', title: 'Option Item 2 Group 2', description: 'Sample with emoji \uD83D\uDE00' },
    //                     { id: 'option3', title: 'Option Item 3 Group 2', description: 'Sample description for option item 1. This is a larger Option.' },
    //                 ],
    //             },
    //         ],
    //     }
    // };

    // Interactive buttons message with text header and text footer
    // req.type = 'interactive_buttons';
    // req.params = {
    //     header: {
    //         type: 'text',
    //         text: 'Sample text header'
    //     },
    //     body: 'Body text example',
    //     footer: 'Footer text example',
    //     action: {
    //         buttons: [
    //             { id: 'option1', title: 'Button option 1' },
    //             { id: 'option2', title: 'Button Item 2' },
    //             { id: 'option3', title: 'Button Item 3' },
    //         ]
    //     }
    // };

    result = await sendMessage.sendMessage(req);
    console.log(JSON.stringify(result, null, 2));
})();