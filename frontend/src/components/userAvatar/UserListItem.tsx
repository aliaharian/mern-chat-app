import { Avatar, Box, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { User } from "../../types/types";

interface UserListItemProps {
    user: User;
    handleFunction: () => void;
}
const UserListItem = ({ handleFunction, user }: UserListItemProps) => {
    return (
        <Box
            onClick={handleFunction}
            cursor={"pointer"}
            bg={"#ebebeb"}
            _hover={{
                background: "#38b2ac",
                color: "white",
            }}
            w={"100%"}
            display={"flex"}
            alignItems={"center"}
            color={"black"}
            px={3}
            py={2}
            mb={2}
            borderRadius={"lg"}
        >
            <Avatar
                mr={2}
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic ?? undefined}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize={"xs"}>
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    );
};
UserListItem.propTypes = {
    handleFunction: PropTypes.func.isRequired,
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
        pic: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
};
export default UserListItem;
