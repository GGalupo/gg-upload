import { useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { Card } from './Card';

import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleViewImage = (url: string): void => {
    setSelectedImageUrl(url);
    if (!isOpen) onToggle();
  };

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={() => handleViewImage(card.url)}
          />
        ))}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={selectedImageUrl}
      />
    </>
  );
}
