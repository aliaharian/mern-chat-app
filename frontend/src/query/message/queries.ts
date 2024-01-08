const FETCH_MESSAGES = `
    query($chatId: ID!) {
        messages(chatId: $chatId) {
            _id
            sender {
                _id
                name
                email
                pic
            }
            content
            chat {
                _id
                chatName
            }
        }
    }
`;

export { FETCH_MESSAGES };
