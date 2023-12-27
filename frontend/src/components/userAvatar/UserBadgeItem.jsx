import { Box } from "@chakra-ui/react";
import { CloseCircle } from "iconsax-react";
import PropTypes from "prop-types";

const UserBadgeItem = ({ user, handleDeleteUser }) => {
    return (
        <Box
            display={"flex"}
            px={3}
            py={2}
            bg={"#6348be"}
            color={"white"}
            borderRadius={"xl"}
            my={2}
            mx={1}
        >
            {user.name}
            <Box pl={2} cursor={"pointer"} onClick={handleDeleteUser}>
                <CloseCircle />
            </Box>
        </Box>
    );
};
UserBadgeItem.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
        pic: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
    handleDeleteUser: PropTypes.func.isRequired,
};
export default UserBadgeItem;
