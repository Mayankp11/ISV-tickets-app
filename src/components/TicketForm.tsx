import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  IconButton,
  HStack,
  Select
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import type { Book } from '../types/Book';

const TicketForm = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    books: [''],
  });

const [books, setBooks] = useState<Book[]>([]);
const [selectedBookName, setSelectedBookName] = useState<Book[]>([]);
const [customBookName, setCustomBookName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookChange = (index: number, value: string) => {
    const updatedBooks = [...formData.books];
    updatedBooks[index] = value;
    setFormData(prev => ({ ...prev, books: updatedBooks }));
  };

  const addBookField = () => {
    setFormData(prev => ({ ...prev, books: [...prev.books, ''] }));
  };

  const removeBookField = (index: number) => {
    const updatedBooks = formData.books.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, books: updatedBooks }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: 'Name is required.',
        status: 'warning',
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      toast({
        title: 'Ticket submitted!',
        status: 'success',
        isClosable: true,
      });

      setFormData({ name: '', email: '', phone: '', books: [''] });
    } catch (err: any) {
      toast({
        title: 'Submission failed',
        description: err.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxW="600px" mx="auto">
      <FormControl mb={4} isRequired>
        <FormLabel>Name</FormLabel>
        <Input name="name" value={formData.name} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Phone</FormLabel>
        <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Select Book</FormLabel>
        <Select placeholder="Select Book" value={selectedBookName} onChange={(e) => setSelectedBookName(e.target.value)}>
          <option value="Bhagvad Gita">Bhagvad Gita ($10)</option>
          <option value="Bhagvatam Set">Bhagvatam Set ($150)</option>
          <option value="Other">Other</option>
        </Select>
      </FormControl>

      {selectedBookName === 'Other' && (
        <FormControl mb={4}>
          <FormLabel>Custom Book Name</FormLabel>
          <Input value={customBookName} onChange={(e) => setCustomBookName(e.target.value)} />
        </FormControl>
      )}
          <Button
            leftIcon={<AddIcon />}
            onClick={addBookField}
            size="sm"
            variant="outline"
            colorScheme="teal"
          >
            Add Book
          </Button>
       

      <Button colorScheme="teal" onClick={handleSubmit}>
        Submit Ticket
      </Button>
    </Box>
  );
};

export default TicketForm;
