const FETCH_CHATS = `
    query {
        chats {
            chatName
            isGroupChat
            updatedAt
            _id
            users {
                _id
                name
                pic
                email
            }
        }
    }
`;

export { FETCH_CHATS };
