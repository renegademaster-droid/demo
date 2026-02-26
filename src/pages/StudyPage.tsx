import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { BotIcon, MicIcon, MicOffIcon, SendIcon, UserIcon } from "@gds/icons";
import { useStudy } from "../context/StudyContext";

function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const start = useCallback((onResult: (text: string) => void) => {
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition);
    if (!SR) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    setError(null);
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  return { start, stop, listening, error };
}

export function StudyPage() {
  const { config, questions, answers, addAnswer, isStudyOpen } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { start: startMic, stop: stopMic, listening, error: micError } = useSpeechRecognition();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [answers, currentIndex, input]);

  const currentQuestion = questions[currentIndex];
  const canSubmit = input.trim().length > 0;

  const handleMicResult = useCallback(
    (text: string) => {
      if (currentQuestion && text.trim()) setInput((prev) => (prev ? `${prev} ${text}` : text));
    },
    [currentQuestion]
  );

  const handleSend = () => {
    if (!currentQuestion || !canSubmit) return;
    addAnswer(currentIndex, currentQuestion, input.trim());
    setInput("");
    setCurrentIndex((i) => i + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!config || questions.length === 0) {
    return (
      <Box py="10" px="6">
        <Container maxW="2xl">
          <VStack gap="4" textAlign="center">
            <Heading size="lg">No study configured</Heading>
            <Text color="fg.muted">
              Set up a study on the Theme page first: add a title, description, focus points, and dates, then save to generate questions.
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!isStudyOpen()) {
    const start = config.startAt ? new Date(config.startAt).toLocaleString() : "—";
    const end = config.endAt ? new Date(config.endAt).toLocaleString() : "—";
    return (
      <Box py="10" px="6">
        <Container maxW="2xl">
          <VStack gap="4" textAlign="center">
            <Heading size="lg">Study is not open</Heading>
            <Text color="fg.muted">
              This study is only open for participants between the start and end times set by the admin.
            </Text>
            <Text color="fg.muted" textStyle="sm">
              Opens: {start} — Closes: {end}
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  const allAnswered = !currentQuestion && answers.length === questions.length;

  return (
    <Box
      py="0"
      px="0"
      height="100%"
      minH={0}
      display="flex"
      flexDirection="column"
      bg="bg.subtle"
      overflow="hidden"
    >
      {/* Header: study title only */}
      <Box py="4" px="4" borderBottomWidth="1px" borderColor="border.muted" bg="bg.default" flexShrink={0}>
        <Container maxW="2xl">
          <Heading size="md" fontWeight="semibold">
            {config.title}
          </Heading>
        </Container>
      </Box>

      {allAnswered ? (
        /* Thank you: no Q&A, no intro */
        <Box flex="1" minH={0} overflowY="auto" display="flex" flexDirection="column" alignItems="center" justifyContent="center" py="10" px="4">
          <Container maxW="2xl">
            <VStack gap="6" textAlign="center" maxW="md" mx="auto">
              <Heading size="lg" fontWeight="semibold">
                Thank you
              </Heading>
              <Text color="fg.muted" textStyle="md" lineHeight="tall">
                Your answers have been saved. We appreciate you taking the time to share your needs — they will help us design a better experience for you.
              </Text>
            </VStack>
          </Container>
        </Box>
      ) : (
        <>
          {/* Intro: meaning of the study for the participant */}
          <Box py="6" px="4" bg="bg.default" borderBottomWidth="1px" borderColor="border.muted" flexShrink={0}>
            <Container maxW="2xl">
              <VStack align="stretch" gap="4" textAlign="left">
                <Heading size="sm" fontWeight="semibold" color="fg">
                  About this study
                </Heading>
                <Text color="fg" textStyle="md" lineHeight="tall">
                  {config.description}
                </Text>
                <Text textStyle="sm" color="fg.muted">
                  Your answers will help us improve. There are no wrong answers—we want to hear your experience in your own words.
                </Text>
              </VStack>
            </Container>
          </Box>

          {/* Chat thread: only this area scrolls; extra padding so content clears fixed input bar */}
          <Box flex="1" minH={0} overflowY="auto" display="flex" flexDirection="column" pb={currentQuestion ? "28" : "0"}>
            <Container maxW="2xl" py="6" px="4" flex="1" display="flex" flexDirection="column" gap="4">
              {/* Q&A pairs + current question */}
              {answers.map((a) => (
            <Box key={a.questionIndex} display="flex" flexDirection="column" width="100%" alignItems="stretch">
              {/* Assistant: question — left */}
              <HStack align="flex-start" gap="3" alignSelf="flex-start" maxW="85%">
                <Box
                  flexShrink={0}
                  w="9"
                  h="9"
                  borderRadius="full"
                  bg="bg.muted"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="fg.muted"
                >
                  <BotIcon boxSize="5" />
                </Box>
                <Box
                  bg="bg.default"
                  color="fg"
                  px="4"
                  py="3"
                  borderRadius="xl"
                  borderBottomLeftRadius="sm"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor="border.muted"
                >
                  <Text textStyle="sm">{a.question}</Text>
                </Box>
              </HStack>
              {/* User: answer — right */}
              <HStack align="flex-start" gap="3" alignSelf="flex-end" maxW="85%" mt="2">
                <Box
                  bg="brand.subtle"
                  color="fg"
                  px="4"
                  py="3"
                  borderRadius="xl"
                  borderBottomRightRadius="sm"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor="brand.muted"
                >
                  <Text textStyle="sm">{a.answer}</Text>
                </Box>
                <Box
                  flexShrink={0}
                  w="9"
                  h="9"
                  borderRadius="full"
                  bg="brand.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="brand.solid"
                >
                  <UserIcon boxSize="5" />
                </Box>
              </HStack>
            </Box>
          ))}

          {/* Current question (assistant) — left */}
          {currentQuestion && (
            <HStack align="flex-start" gap="3" alignSelf="flex-start" maxW="85%">
              <Box
                flexShrink={0}
                w="9"
                h="9"
                borderRadius="full"
                bg="bg.muted"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="fg.muted"
              >
                <BotIcon boxSize="5" />
              </Box>
              <Box
                bg="bg.default"
                color="fg"
                px="4"
                py="3"
                borderRadius="xl"
                borderBottomLeftRadius="sm"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="border.muted"
              >
                <Text textStyle="sm">{currentQuestion}</Text>
              </Box>
            </HStack>
          )}

              <div ref={messagesEndRef} />
            </Container>
          </Box>

          {/* Input bar: sticky at bottom of browser screen */}
          {currentQuestion && (
            <Box
              position="fixed"
              bottom="0"
              left="0"
              right="0"
              zIndex="10"
              py="4"
              px="4"
              borderTopWidth="1px"
              borderColor="border.muted"
              bg="bg.default"
              boxShadow="0 -2px 10px rgba(0,0,0,0.08)"
            >
              <Container maxW="2xl">
                <VStack gap="2" align="stretch">
                  <HStack
                    gap="2"
                    align="flex-end"
                    p="2"
                    borderRadius="xl"
                    bg="bg.subtle"
                    borderWidth="1px"
                    borderColor="border.muted"
                  >
                    <Textarea
                      placeholder="Type your answer..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      bg="transparent"
                      border="none"
                      resize="none"
                      minH="44px"
                      maxH="200px"
                      rows={1}
                      _focus={{ boxShadow: "none" }}
                    />
                    <IconButton
                      aria-label={listening ? "Stop recording" : "Start voice input"}
                      variant={listening ? "solid" : "outline"}
                      colorPalette={listening ? "red" : "gray"}
                      size="md"
                      flexShrink={0}
                      onClick={listening ? stopMic : () => startMic(handleMicResult)}
                    >
                      {listening ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                    <Button
                      colorPalette="brand"
                      variant="solid"
                      size="md"
                      flexShrink={0}
                      onClick={handleSend}
                      disabled={!canSubmit}
                    >
                      <SendIcon /> Send
                    </Button>
                  </HStack>
                  {micError && (
                    <Text color="fg.error" textStyle="xs">
                      {micError}
                    </Text>
                  )}
                </VStack>
              </Container>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
