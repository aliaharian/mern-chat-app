import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import { isLastMessage, isSameSender } from "../config/chatLogics";
import { ChatState } from "../context/chatState";
import PropTypes from "prop-types";
import { Message } from "../types/types";

const ScrollableChats = ({ messages }: { messages?: Message[] }) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {user &&
                messages?.map((message, index) => (
                    <Box
                        mb={
                            isSameSender(messages, message, index, user._id)
                                ? 4
                                : 1
                        }
                        display={"flex"}
                        key={message._id}
                    >
                        {(isSameSender(messages, message, index, user._id) ||
                            isLastMessage(messages, index, user._id)) && (
                            <Tooltip
                                label={message.sender.name}
                                placement={"bottom-start"}
                                hasArrow
                            >
                                <Avatar
                                    mt={"7px"}
                                    mr={1}
                                    size={"sm"}
                                    cursor={"pointer"}
                                    name={message.sender.name}
                                    src={message.sender.pic ?? ""}
                                />
                            </Tooltip>
                        )}
                        <span
                            style={{
                                backgroundColor:
                                    message.sender._id === user._id
                                        ? "#bee3f8"
                                        : "#b9f5d0",
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                marginLeft:
                                    message.sender._id === user._id
                                        ? "auto"
                                        : isSameSender(
                                                messages,
                                                message,
                                                index,
                                                user._id,
                                            ) ||
                                            isLastMessage(
                                                messages,
                                                index,
                                                user._id,
                                            )
                                          ? 0
                                          : 36,
                            }}
                        >
                            {message.content}
                        </span>
                    </Box>
                ))}
        </ScrollableFeed>
    );
};
ScrollableChats.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            content: PropTypes.string.isRequired,
            _id: PropTypes.string.isRequired,
            sender: PropTypes.shape({
                _id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                pic: PropTypes.string,
            }),
        }),
    ).isRequired,
};
export default ScrollableChats;
