import {
  Box,
  Button,
  Checkbox,
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
  InputLeftElement,
  InputGroup,
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
  const [donationSelected, setDonationSelected] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>("");

  const [currentDateTime] = useState(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });

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
      date: currentDateTime.date,
      time: currentDateTime.time,
      books: selectedBooks.map((b) => b.name),
      bookPrices: selectedBooks.reduce((acc, book) => {
        acc[book.name] = book.price * book.quantity;
        return acc;
      }, {} as Record<string, number>),
      totalOverride: overrideTotal ? parseFloat(overrideTotal) : undefined,
      donation: donationSelected
        ? donationAmount
          ? parseFloat(donationAmount)
          : 0
        : 0,
    };

    try {
      await api.post("/tickets", payload);
      toast({ title: "Ticket submitted successfully!", status: "success" });
      // navigate("/success");
    } catch (error) {
      toast({ title: "Submission failed", status: "error" });
    }
  };

  const totalPrice = selectedBooks.reduce(
    (total, book) => total + book.price * book.quantity,
    0
  );

  return (
    <Box
      p={6}
      maxW="lg"
      mx="auto"
      fontFamily="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    >
      <HStack
        justifyContent="space-between"
        mb={6}
        spacing={6}
        fontFamily="'Roboto', sans-serif"
      >
        <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="300">
          Create a Ticket
        </Heading>
        <Box textAlign="right">
          <Text fontWeight="300" fontSize={{ base: "md", md: "lg" }}>
            Date: {currentDateTime.date}
          </Text>
          <Text fontWeight="300" fontSize={{ base: "md", md: "lg" }} mt={1}>
            Time: {currentDateTime.time}
          </Text>
        </Box>
      </HStack>

      <VStack spacing={4} align="stretch" fontSize={{ base: "sm", md: "md" }}>
        <FormControl isRequired>
          <FormLabel fontSize={{ base: "md", md: "lg" }}>Name</FormLabel>
          <Input name="name" onChange={handleInputChange} />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={{ base: "md", md: "lg" }}>
            Email (optional)
          </FormLabel>
          <Input name="email" type="email" onChange={handleInputChange} />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={{ base: "md", md: "lg" }}>
            Phone (optional)
          </FormLabel>
          <Input name="phone" onChange={handleInputChange} />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={{ base: "md", md: "lg" }}>Select Book</FormLabel>
          <Stack>
            <HStack>
              <Select
                placeholder="Choose a book"
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
                fontSize={{ base: "sm", md: "md" }}
              >
                {BOOK_OPTIONS.map((book) => (
                  <option key={book.label} value={book.label}>
                    {book.label} (${book.price})
                  </option>
                ))}
              </Select>
              <Button size="sm" onClick={handleAddBook}>
                Add
              </Button>
            </HStack>
            {bookInput === "Other" && (
              <>
                <Input
                  placeholder="Enter custom book name"
                  value={customBookName}
                  onChange={(e) => setCustomBookName(e.target.value)}
                  mt={2}
                  fontSize={{ base: "sm", md: "md" }}
                />
                <Input
                  placeholder="Enter price"
                  type="number"
                  value={customBookPrice}
                  onChange={(e) => setCustomBookPrice(e.target.value)}
                  mt={2}
                  fontSize={{ base: "sm", md: "md" }}
                />
              </>
            )}
          </Stack>
        </FormControl>

        {selectedBooks.length > 0 && (
          <Box borderWidth="1px" p={4} borderRadius="md">
            <Heading size="sm" mb={3} fontSize={{ base: "md", md: "lg" }}>
              Selected Books
            </Heading>
            <VStack spacing={3} align="stretch">
              {selectedBooks.map((book) => (
                <HStack
                  key={book.name}
                  justify="space-between"
                  flexWrap="wrap"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <Text fontWeight="medium" minW="120px">
                    {book.name}
                  </Text>
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
                  <Text minW="120px" textAlign="right">
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
          </Box>
        )}

        <FormControl>
          <Checkbox
            isChecked={donationSelected}
            onChange={(e) => {
              setDonationSelected(e.target.checked);
              if (!e.target.checked) setDonationAmount("");
            }}
            fontSize={{ base: "md", md: "lg" }}
          >
            Would you like to make a donation?
          </Checkbox>
        </FormControl>

        {donationSelected && (
          <FormControl>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.500"
                fontSize={{ base: "sm", md: "md" }}
              >
                $
              </InputLeftElement>
              <Input
                type="number"
                placeholder="Enter donation amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                min={0}
                step="0.01"
                pl="2.5rem"
                fontSize={{ base: "sm", md: "md" }}
              />
            </InputGroup>
          </FormControl>
        )}

        {(selectedBooks.length > 0 || (donationSelected && donationAmount)) && (
          <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} mt={2}>
            Final Total: $
            {(
              (overrideTotal ? parseFloat(overrideTotal) : totalPrice) +
              (donationSelected && donationAmount
                ? parseFloat(donationAmount)
                : 0)
            ).toFixed(2)}
          </Text>
        )}

        <Button colorScheme="teal" size="md" onClick={handleSubmit}>
          Submit Ticket
        </Button>
      </VStack>
    </Box>
  );
};

export default TicketForm;
