export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser?._id ? users[1] : users[0];
};

export function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
