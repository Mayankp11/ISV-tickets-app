import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Ticket } from "../types/ticket";
import api from "../api/axios";

const BOOK_OPTIONS = [
  { label: "Bhagavad Gita", price: 10 },
  { label: "Bhagavatam", price: 150 },
  { label: "Other", price: 0 },
];

type BookItem = {
  name: string;
  price: number;
  quantity: number;
};

const TicketForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const [bookInput, setBookInput] = useState("");
  const [customBookName, setCustomBookName] = useState("");
  const [customBookPrice, setCustomBookPrice] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<BookItem[]>([]);
  const [overrideTotal, setOverrideTotal] = useState<string | null>(null);


  const toast = useToast();
  const navigate = useNavigate();

  const handleAddBook = () => {
    const bookName = bookInput === "Other" ? customBookName.trim() : bookInput;
    if (!bookName) {
      toast({ title: "Please enter a valid book name.", status: "warning" });
      return;
    }

    const existing = selectedBooks.find((b) => b.name === bookName);
    if (existing) {
      toast({ title: "Book already added.", status: "info" });
      return;
    }

    const bookData = BOOK_OPTIONS.find((b) => b.label === bookInput);
    let price = bookData?.price ?? 0;
    if (bookInput === "Other") {
      const parsedPrice = parseFloat(customBookPrice);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        toast({ title: "Please enter a valid price.", status: "warning" });
        return;
      }
      price = parsedPrice;
    }

    setSelectedBooks((prev) => [
      ...prev,
      { name: bookName, price, quantity: 1 },
    ]);
    setBookInput("");
    setCustomBookName("");
    setCustomBookPrice("");
  };

  const updateQuantity = (bookName: string, delta: number) => {
    setSelectedBooks((prev) =>
      prev.map((b) =>
        b.name === bookName
          ? { ...b, quantity: Math.max(1, b.quantity + delta) }
          : b
      )
    );
  };

  const removeBook = (bookName: string) => {
    setSelectedBooks((prev) => prev.filter((b) => b.name !== bookName));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload: Ticket = {
      ...form,
      books: selectedBooks.map((b) => b.name),
      bookPrices: selectedBooks.reduce((acc, book) => {
        acc[book.name] = book.price * book.quantity;
        return acc;
      }, {} as Record<string, number>),
      totalOverride: overrideTotal ? parseFloat(overrideTotal) : undefined,
    };

    try {
      await api.post("/tickets", payload);
      toast({ title: "Ticket submitted successfully!", status: "success" });
      navigate("/success");
    } catch (error) {
      toast({ title: "Submission failed", status: "error" });
    }
  };

  const totalPrice = selectedBooks.reduce(
    (total, book) => total + book.price * book.quantity,
    0
  );

  return (
    <Box p={6} maxW="lg" mx="auto">
      <Heading mb={6}>Book a Ticket</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input name="name" onChange={handleInputChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Email (optional)</FormLabel>
          <Input name="email" type="email" onChange={handleInputChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Phone (optional)</FormLabel>
          <Input name="phone" onChange={handleInputChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Select Book</FormLabel>
          <Stack>
            <HStack>
              <Select
                placeholder="Choose a book"
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
              >
                {BOOK_OPTIONS.map((book) => (
                  <option key={book.label} value={book.label}>
                    {book.label} (${book.price})
                  </option>
                ))}
              </Select>
              <Button onClick={handleAddBook}>Add</Button>
            </HStack>
            {bookInput === "Other" && (
              <>
                <Input
                  placeholder="Enter custom book name"
                  value={customBookName}
                  onChange={(e) => setCustomBookName(e.target.value)}
                  mt={2}
                />
                <Input
                  placeholder="Enter price"
                  type="number"
                  value={customBookPrice}
                  onChange={(e) => setCustomBookPrice(e.target.value)}
                  mt={2}
                />
              </>
            )}
          </Stack>
        </FormControl>

        {selectedBooks.length > 0 && (
          <Box borderWidth="1px" p={4} borderRadius="md">
            <Heading size="sm" mb={3}>
              Selected Books
            </Heading>
            <VStack spacing={3} align="stretch">
              {selectedBooks.map((book) => (
                <HStack key={book.name} justify="space-between">
                  <Text fontWeight="medium">{book.name}</Text>
                  <HStack>
                    <IconButton
                      size="sm"
                      icon={<MinusIcon />}
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(book.name, -1)}
                    />
                    <Text>{book.quantity}</Text>
                    <IconButton
                      size="sm"
                      icon={<AddIcon />}
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(book.name, 1)}
                    />
                  </HStack>
                  <Text>
                    ${book.price.toFixed(2)} × {book.quantity} = $
                    {(book.price * book.quantity).toFixed(2)}
                  </Text>
                  <IconButton
                    size="sm"
                    icon={<RiDeleteBin7Line />}
                    aria-label="Remove book"
                    onClick={() => removeBook(book.name)}
                  />
                </HStack>
              ))}
            </VStack>

            <FormControl mt={4}>
              <FormLabel fontWeight="bold">
                Total Price (optional override)
              </FormLabel>
              <Input
                type="number"
                value={overrideTotal ?? totalPrice.toFixed(2)}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) >= 0 || val === "") {
                    setOverrideTotal(val);
                  }
                }}
              />
            </FormControl>
          </Box>
        )}

        <FormControl isRequired>
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" onChange={handleInputChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Time</FormLabel>
          <Input type="time" name="time" onChange={handleInputChange} />
        </FormControl>

        <Button colorScheme="teal" onClick={handleSubmit}>
          Submit Ticket
        </Button>
      </VStack>
    </Box>
  );
};

export default TicketForm;
