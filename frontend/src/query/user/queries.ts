const SEARCH_USERS = `
    query ($search: String) {
        users(search: $search) {
            _id
            name
            email
            pic
        }
    }
`;

export { SEARCH_USERS };
