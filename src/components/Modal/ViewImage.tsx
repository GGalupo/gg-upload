import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent maxW="900px" maxH="600px" mx="auto">
        <ModalBody p="0">
          <Image src={imgUrl} w="100%" h="100%" maxW="900px" maxH="600px" />
        </ModalBody>

        <ModalFooter h="2rem" bgColor="pGray.800" borderBottomRadius="6px">
          <Link href={imgUrl} isExternal mr="auto">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
