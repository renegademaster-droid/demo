import { Box, Container, Heading, Separator, Text, VStack } from "@chakra-ui/react";
import { useStudy } from "../context/StudyContext";

function buildSummaryFromAnswers(
  questions: string[],
  answers: { questionIndex: number; question: string; answer: string }[]
): string {
  if (answers.length === 0) return "No answers yet. Complete the Study page to see a summary here.";
  const sorted = [...answers].sort((a, b) => a.questionIndex - b.questionIndex);
  const points = sorted.map(
    (a) => `• ${a.question.slice(0, 60)}${a.question.length > 60 ? "…" : ""}: "${a.answer.slice(0, 120)}${a.answer.length > 120 ? "…" : ""}"`
  );
  return [
    `Participant answered ${answers.length} of ${questions.length} questions.`,
    "",
    "Summary of responses:",
    ...points,
  ].join("\n");
}

export function SummaryPage() {
  const { config, questions, answers } = useStudy();

  if (!config || questions.length === 0) {
    return (
      <Box py="10" px="6">
        <Container maxW="2xl">
          <VStack gap="4" textAlign="center">
            <Heading size="lg">No study data</Heading>
            <Text color="fg.muted">
              Set up a study on the Theme page and complete it on the Study page. Results will appear here.
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  const summaryText = buildSummaryFromAnswers(questions, answers);
  const sortedAnswers = [...answers].sort((a, b) => a.questionIndex - b.questionIndex);

  return (
    <Box py="10" px="6">
      <Container maxW="2xl">
        <VStack align="stretch" gap="8">
          <Box>
            <Heading size="xl" mb="2">
              Summary
            </Heading>
            <Text color="fg.muted">
              All answers from the study and a system-generated summary.
            </Text>
          </Box>

          <Box
            bg="bg.subtle"
            p="6"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.muted"
            width="full"
          >
            <Heading size="md" mb="3">
              Study: {config.title}
            </Heading>
            <Text color="fg.muted" textStyle="sm" mb="4" whiteSpace="pre-wrap">
              {summaryText}
            </Text>
          </Box>

          <Box width="full">
            <Heading size="md" mb="4">
              All answers
            </Heading>
            <VStack align="stretch" gap="4">
              {sortedAnswers.length === 0 ? (
                <Text color="fg.muted">No answers yet. Complete the Study page first.</Text>
              ) : (
                sortedAnswers.map((a) => (
                  <Box
                    key={a.questionIndex}
                    bg="bg.muted"
                    p="4"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="border.muted"
                  >
                    <Text textStyle="xs" color="fg.muted" mb="1">
                      Question {a.questionIndex + 1}
                    </Text>
                    <Text fontWeight="medium" mb="2">
                      {a.question}
                    </Text>
                    <Separator mb="2" />
                    <Text textStyle="sm" color="fg">
                      {a.answer}
                    </Text>
                  </Box>
                ))
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
