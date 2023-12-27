import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { Eye } from "iconsax-react";
import PropTypes from "prop-types";

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={"flex"} icon={<Eye />} onClick={onOpen} />
            )}
            <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h={"410px"}>
                    <ModalHeader
                        display={"flex"}
                        fontSize={"40px"}
                        fontFamily={"Work Sans"}
                        justifyContent={"center"}
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                    >
                        <Image
                            borderRadius={"full"}
                            boxSize={"150px"}
                            src={user.pic}
                            alr={user.name}
                        />
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily={"Work Sans"}
                            mt={2}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
ProfileModal.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
        pic: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,
};

export default ProfileModal;
