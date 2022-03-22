import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ImageData {
  title: string;
  description: string;
  url: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptedFormatsRegex =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;

  const formValidations = {
    image: {
      required: 'Required file',

      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 ||
          'The file size has to be less than 10MB.',
        acceptedFormats: fileList =>
          acceptedFormatsRegex.test(fileList[0].type) ||
          'File format has to be PNG, JPEG or GIF.',
      },
    },
    title: {
      required: 'Required title',
      minLength: {
        value: 2,
        message: 'Should be at least 2 characters long',
      },
      maxLength: {
        value: 20,
        message: 'Should not be longer than 20 characters',
      },
    },
    description: {
      required: 'Required description',
      maxLength: {
        value: 65,
        message: 'Should not be longer than 65 characters',
      },
    },
  };

  const sendImage = async (image: ImageData): Promise<void> => {
    await api.post('/api/images', {
      ...image,
      url: imageUrl,
    });
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(sendImage, {
    onSuccess: () => queryClient.invalidateQueries('images'),
  });

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: ImageData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Error adding image',
          description: 'You should wait image upload before registering it.',
        });

        return;
      }

      await mutation.mutateAsync(data);

      toast({
        status: 'success',
        title: 'Registered image',
        description: 'Your image has been successfully registered.',
      });
    } catch {
      toast({
        status: 'error',
        title: 'Upload failed',
        description: 'Error to register your image.',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          name="image"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Image title"
          name="title"
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Image description"
          name="description"
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
