import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  Field,
  FileUpload,
  Heading,
  HStack,
  IconButton,
  Input,
  SegmentGroup,
  Stack,
  Steps,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MailIcon,
  MessageCircleIcon,
  PlusIcon,
  RotateCcwIcon,
  TrashIcon,
  UploadIcon,
} from "@gds/icons";
import { useStudy } from "../context/StudyContext";
import {
  generateStudyQuestions,
  generateStudyQuestionsFromText,
  type StudyConfig,
} from "../context/StudyContext";
import { extractTextFromPdf } from "../utils/extractPdfText";

function toLocalDatetimeIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function isoToLocalDatetime(iso: string): string {
  const d = new Date(iso);
  return toLocalDatetimeIso(isNaN(d.getTime()) ? new Date() : d);
}
const defaultStart = () => {
  const d = new Date();
  d.setMinutes(0);
  return toLocalDatetimeIso(d);
};
const defaultEnd = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setMinutes(0);
  return toLocalDatetimeIso(d);
};

const MAX_QUESTIONS = 5;

const STEP_ITEMS = [
  { title: "Details", description: "Study info" },
  { title: "Questions", description: "Generate & edit" },
  { title: "Schedule", description: "Open & close" },
  { title: "Go live", description: "Save & share" },
] as const;

/** Demo study: we don't have a portal yet, about to create one, need to find out user needs (terrace glazings) */
const DEMO_CONFIG: StudyConfig = {
  title: "Customer portal – we need your input before we build it",
  description:
    "We don't have a customer portal yet, but we're about to create one. You have bought terrace glazings from us, and we want to find out what you would need from such a portal — for example order info, payment info, installation info — so we can design it around real user needs.",
  focusPoints: ["Order status and history", "Payment and invoices", "Installation and delivery"],
  url: "",
  startAt: new Date().toISOString(),
  endAt: "",
  openUntilClosed: true,
  closed: false,
};

const DEMO_QUESTIONS = [
  "We don't have a customer portal yet but are about to build one. What would you need from it most?",
  "When you think about checking your order or delivery status, what would make that easier for you?",
  "What would you need from a portal when it comes to payments and invoices?",
  "What would help you most when it comes to installation or delivery information?",
  "Is there anything else we should know about your needs before we design the portal?",
];

export function ThemePage() {
  const {
    config,
    questions,
    saveConfigWithQuestions,
    isStudyOpen,
    closeStudy,
    resetStudy,
  } = useStudy();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState(config?.title ?? "");
  const [description, setDescription] = useState(config?.description ?? "");
  const [focusPoints, setFocusPoints] = useState<string[]>(
    config?.focusPoints?.length ? config.focusPoints : [""]
  );
  const [url, setUrl] = useState(config?.url ?? "");
  const [startAt, setStartAt] = useState(
    config?.startAt ? isoToLocalDatetime(config.startAt) : defaultStart()
  );
  const [endAt, setEndAt] = useState(
    config?.endAt ? isoToLocalDatetime(config.endAt) : defaultEnd()
  );
  const [openUntilClosed, setOpenUntilClosed] = useState(
    config?.openUntilClosed ?? false
  );
  const [draftQuestions, setDraftQuestions] = useState<string[]>([]);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [detailsInputMode, setDetailsInputMode] = useState<"manual" | "pdf">("manual");
  const prevStepRef = useRef(1);

  const buildConfigFromForm = (): StudyConfig => ({
    title: title.trim(),
    description: description.trim(),
    focusPoints: focusPoints.map((p) => p.trim()).filter(Boolean),
    url: url.trim() || undefined,
    startAt: new Date(startAt).toISOString(),
    endAt: openUntilClosed ? "" : new Date(endAt).toISOString(),
    openUntilClosed: openUntilClosed || undefined,
    closed: config?.closed,
  });

  // Auto-generate questions when entering step 2 (Questions) from step 1
  useEffect(() => {
    if (currentStep === 2 && prevStepRef.current === 1 && detailsInputMode === "manual") {
      const c = buildConfigFromForm();
      const q = generateStudyQuestions(c);
      setDraftQuestions(q.length ? q : ["What would you like to tell us?"]);
    }
    prevStepRef.current = currentStep;
  }, [currentStep, detailsInputMode, title, description, focusPoints, url]);

  const handlePdfAccept = async (details: { files: File[] }) => {
    const file = details.files[0];
    if (!file?.name.toLowerCase().endsWith(".pdf")) return;
    setPdfExtracting(true);
    try {
      const text = await extractTextFromPdf(file);
      const q = generateStudyQuestionsFromText(text);
      setDraftQuestions(q.length ? q : ["What would you like to tell us?"]);
    } catch (err) {
      console.error("PDF extraction failed", err);
      setDraftQuestions(["Could not extract text from PDF. Generate from form or edit manually."]);
    } finally {
      setPdfExtracting(false);
    }
  };

  const handleSaveAndGoLive = (e: React.FormEvent) => {
    e.preventDefault();
    const c = buildConfigFromForm();
    const q = draftQuestions.map((s) => s.trim()).filter(Boolean);
    if (q.length === 0) return;
    const configToSave: StudyConfig = {
      ...c,
      ...(c.openUntilClosed ? { closed: false } : {}),
    };
    saveConfigWithQuestions(configToSave, q.slice(0, MAX_QUESTIONS));
    setDraftQuestions([]);
  };

  const setDraftQuestion = (i: number, value: string) =>
    setDraftQuestions((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  const addDraftQuestion = () =>
    setDraftQuestions((prev) => (prev.length < MAX_QUESTIONS ? [...prev, ""] : prev));
  const removeDraftQuestion = (i: number) =>
    setDraftQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const addFocusPoint = () => setFocusPoints((prev) => [...prev, ""]);
  const removeFocusPoint = (i: number) =>
    setFocusPoints((prev) => prev.filter((_, idx) => idx !== i));
  const setFocusPoint = (i: number, value: string) =>
    setFocusPoints((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/study` : "/study";
  const shareSubject = config?.title || "Study";
  const shareMessage = `Please take part in this short study: ${shareUrl}`;
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };
  const mailtoShareUrl = `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(`Please take part in this short study:\n\n${shareUrl}`)}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  const handleResetTheme = () => {
    resetStudy();
    setCurrentStep(1);
    setDetailsInputMode("manual");
    setTitle("");
    setDescription("");
    setFocusPoints([""]);
    setUrl("");
    setStartAt(defaultStart());
    setEndAt(defaultEnd());
    setOpenUntilClosed(false);
    setDraftQuestions([]);
  };

  const handleLoadDemo = () => {
    const now = new Date().toISOString();
    const demoConfigToSave: StudyConfig = {
      ...DEMO_CONFIG,
      startAt: now,
      openUntilClosed: true,
      closed: false,
    };
    const start = isoToLocalDatetime(now);
    const end = defaultEnd();
    setDetailsInputMode("manual");
    setTitle(DEMO_CONFIG.title);
    setDescription(DEMO_CONFIG.description);
    setFocusPoints(
      DEMO_CONFIG.focusPoints?.length ? [...DEMO_CONFIG.focusPoints] : [""]
    );
    setUrl(DEMO_CONFIG.url ?? "");
    setStartAt(start);
    setEndAt(end);
    setOpenUntilClosed(true);
    setDraftQuestions([...DEMO_QUESTIONS]);
    saveConfigWithQuestions(demoConfigToSave, DEMO_QUESTIONS);
    setCurrentStep(1);
  };

  const studyIsLive = config && questions.length > 0;
  const showCloseStudy =
    config?.openUntilClosed && !config.closed && config.startAt && isStudyOpen();

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEP_ITEMS.length));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <Box py="10" px="6">
      <Container maxW="2xl">
        <VStack align="stretch" gap="8">
          <Box>
            <Heading size="xl" mb="2">
              Set up your study theme
            </Heading>
            <Text color="fg.muted" mb="4">
              Configure the study in steps: details, schedule, questions, then go live.
            </Text>
            <HStack gap="2" flexWrap="wrap">
              <Button
                type="button"
                variant="solid"
                size="sm"
                colorPalette="brand"
                onClick={handleLoadDemo}
              >
                Load demo study
              </Button>
              {(studyIsLive || draftQuestions.length > 0) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  colorPalette="gray"
                  onClick={handleResetTheme}
                >
                  <RotateCcwIcon /> Reset theme and start new study
                </Button>
              )}
            </HStack>
          </Box>

          <Steps.Root
            count={STEP_ITEMS.length}
            step={currentStep - 1}
            onStepChange={(e) => setCurrentStep((e.step ?? 0) + 1)}
            colorPalette="brand"
          >
            <Steps.List mb="8">
              {STEP_ITEMS.map((item, index) => (
                <Steps.Item key={index} index={index} title={item.title}>
                  <Steps.Indicator />
                  <Steps.Title>{item.title}</Steps.Title>
                  <Steps.Separator />
                </Steps.Item>
              ))}
            </Steps.List>

            <Box
              as="form"
              onSubmit={handleSaveAndGoLive}
              bg="bg.subtle"
              p="6"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border.muted"
              width="full"
            >
              {/* Step 0: Details */}
              <Steps.Content index={0}>
                <Stack gap="5">
                  <Field.Root>
                    <Field.Label mb="2">How do you want to provide study details?</Field.Label>
                    <SegmentGroup.Root
                      value={detailsInputMode}
                      onValueChange={(e) => setDetailsInputMode(e.value as "manual" | "pdf")}
                      colorPalette="brand"
                      size="md"
                    >
                      <SegmentGroup.Indicator />
                      <SegmentGroup.Items
                        items={[
                          { value: "manual", label: "Enter manually" },
                          { value: "pdf", label: "Upload PDF" },
                        ]}
                      />
                    </SegmentGroup.Root>
                  </Field.Root>
                  {detailsInputMode === "manual" && (
                    <Stack gap="5">
                      <Field.Root>
                        <Field.Label>Study title</Field.Label>
                        <Input
                          placeholder="e.g. Usability study for checkout flow"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          bg="bg.default"
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          placeholder="Brief description of what the study is about and what you want to learn."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          bg="bg.default"
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label mb="2">Focus points</Field.Label>
                        <VStack align="stretch" gap="2">
                          {focusPoints.map((point, i) => (
                            <HStack key={i} gap="2">
                              <Input
                                placeholder="Focus point"
                                value={point}
                                onChange={(e) => setFocusPoint(i, e.target.value)}
                                bg="bg.default"
                                flex="1"
                              />
                              <IconButton
                                aria-label="Remove focus point"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFocusPoint(i)}
                                disabled={focusPoints.length <= 1}
                              >
                                <TrashIcon />
                              </IconButton>
                            </HStack>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            alignSelf="flex-start"
                            onClick={addFocusPoint}
                          >
                            <PlusIcon /> Add focus point
                          </Button>
                        </VStack>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>URL (optional)</Field.Label>
                        <Field.HelperText>If the study focuses on an existing web service, add its URL.</Field.HelperText>
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          bg="bg.default"
                        />
                      </Field.Root>
                    </Stack>
                  )}
                  {detailsInputMode === "pdf" && (
                    <Field.Root>
                      <Field.Label mb="2">Theme document (PDF)</Field.Label>
                      <Field.HelperText mb="2">Upload a PDF with the study theme. We’ll generate study questions from its text.</Field.HelperText>
                      <FileUpload.Root
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        onFileAccept={handlePdfAccept}
                        disabled={pdfExtracting}
                      >
                        <FileUpload.HiddenInput />
                        <FileUpload.Trigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            colorPalette="brand"
                            disabled={pdfExtracting}
                          >
                            <UploadIcon /> {pdfExtracting ? "Extracting…" : "Upload PDF"}
                          </Button>
                        </FileUpload.Trigger>
                        <FileUpload.List />
                      </FileUpload.Root>
                      {pdfExtracting && (
                        <Text color="fg.muted" textStyle="sm" mt="2">
                          Extracting text from PDF…
                        </Text>
                      )}
                    </Field.Root>
                  )}
                </Stack>
              </Steps.Content>

              {/* Step 2: Questions */}
              <Steps.Content index={1}>
                <Stack gap="5">
                  <Text color="fg.muted" textStyle="sm">
                    Questions are generated from the details you gave in step one. Review and edit them below before going live.
                  </Text>
                  {draftQuestions.length > 0 && (
                    <Box width="full">
                      <Heading size="sm" mb="3">
                        Edit study questions (max {MAX_QUESTIONS})
                      </Heading>
                      <Text color="fg.muted" textStyle="sm" mb="3">
                        Review and edit the questions before going live.
                      </Text>
                      <VStack align="stretch" gap="2">
                        {draftQuestions.map((q, i) => (
                          <HStack key={i} gap="2" align="flex-start">
                            <Text textStyle="sm" color="fg.muted" mt="2" flexShrink={0}>
                              {i + 1}.
                            </Text>
                            <Input
                              value={q}
                              onChange={(e) => setDraftQuestion(i, e.target.value)}
                              placeholder="Question"
                              bg="bg.default"
                              flex="1"
                            />
                            <IconButton
                              aria-label="Remove question"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDraftQuestion(i)}
                              disabled={draftQuestions.length <= 1}
                            >
                              <TrashIcon />
                            </IconButton>
                          </HStack>
                        ))}
                        {draftQuestions.length < MAX_QUESTIONS && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            alignSelf="flex-start"
                            onClick={addDraftQuestion}
                          >
                            <PlusIcon /> Add question
                          </Button>
                        )}
                      </VStack>
                    </Box>
                  )}
                </Stack>
              </Steps.Content>

              {/* Step 3: Schedule */}
              <Steps.Content index={2}>
                <Stack gap="5">
                  <Field.Root>
                    <Field.Label>Study opens (date & time)</Field.Label>
                    <Input
                      type="datetime-local"
                      value={startAt}
                      onChange={(e) => setStartAt(e.target.value)}
                      bg="bg.default"
                    />
                  </Field.Root>
                  <Checkbox.Root
                    checked={openUntilClosed}
                    onCheckedChange={(details) => setOpenUntilClosed(details.checked === true)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Study stays open until I close it</Checkbox.Label>
                  </Checkbox.Root>
                  {!openUntilClosed && (
                    <Field.Root>
                      <Field.Label>Study closes (date & time)</Field.Label>
                      <Input
                        type="datetime-local"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                        bg="bg.default"
                      />
                    </Field.Root>
                  )}
                </Stack>
              </Steps.Content>

              {/* Step 4: Go live */}
              <Steps.Content index={3}>
                <Stack gap="5">
                  <Text color="fg.muted">
                    Review your study setup. When you’re ready, save and go live. You’ll get a link to share with participants.
                  </Text>
                  {draftQuestions.length > 0 ? (
                    <VStack align="stretch" gap="2" mb="2">
                      <Text fontWeight="medium" textStyle="sm">
                        Study: {title || "(no title)"}
                      </Text>
                      <Text textStyle="xs" color="fg.muted">
                        {draftQuestions.length} question{draftQuestions.length !== 1 ? "s" : ""} · Opens {new Date(startAt).toLocaleString()}
                        {!openUntilClosed && ` · Closes ${new Date(endAt).toLocaleString()}`}
                      </Text>
                    </VStack>
                  ) : (
                    <Text textStyle="sm" color="fg.muted">
                      Go back to the Questions step to generate or edit questions, then return here to go live.
                    </Text>
                  )}
                  <Button
                    type="submit"
                    colorPalette="brand"
                    width="full"
                    disabled={draftQuestions.length === 0}
                  >
                    <CheckIcon /> Save and go live
                  </Button>
                </Stack>
              </Steps.Content>

              <ButtonGroup size="sm" variant="outline" mt="6" gap="2">
                <Button
                  type="button"
                  colorPalette="brand"
                  onClick={goPrev}
                  disabled={currentStep === 1}
                >
                  <ChevronLeftIcon /> Previous
                </Button>
                {currentStep < STEP_ITEMS.length ? (
                  <Button type="button" colorPalette="brand" variant="solid" onClick={goNext}>
                    Next <ChevronRightIcon />
                  </Button>
                ) : null}
              </ButtonGroup>
            </Box>
          </Steps.Root>

          {currentStep === STEP_ITEMS.length && showCloseStudy && (
            <Box
              bg="bg.muted"
              p="4"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border.muted"
              width="full"
            >
              <Text textStyle="sm" mb="3">
                Study is open for participants (no end date — you close it manually).
              </Text>
              <Button variant="outline" colorPalette="red" size="sm" onClick={closeStudy}>
                Close study now
              </Button>
            </Box>
          )}

          {currentStep === STEP_ITEMS.length && studyIsLive && (
            <Box
              bg="bg.muted"
              p="6"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border.muted"
              width="full"
            >
              <Heading size="md" mb="3">
                Study is live
              </Heading>
              <Text color="fg.muted" textStyle="sm" mb="4">
                Participants will be asked these questions on the Study page.
              </Text>
              <VStack align="stretch" gap="2" mb="6">
                {questions.map((q, i) => (
                  <Text key={i} textStyle="sm" pl="2" borderLeftWidth="2px" borderColor="border.muted">
                    {i + 1}. {q}
                  </Text>
                ))}
              </VStack>
              <Heading size="sm" mb="2">
                Share the study
              </Heading>
              <Text color="fg.muted" textStyle="sm" mb="2">
                Share this link with participants.
                {config?.openUntilClosed && !config?.closed
                  ? " The study stays open until you close it."
                  : " The study is open between the start and end times you set."}
              </Text>
              <HStack gap="2">
                <Input readOnly value={shareUrl} size="sm" bg="bg.default" fontFamily="mono" />
                <Button size="sm" variant="outline" onClick={copyShareLink}>
                  {shareCopied ? "Copied!" : "Copy link"}
                </Button>
              </HStack>
              <HStack gap="2" mt="2" flexWrap="wrap">
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="gray"
                  asChild
                >
                  <a href={mailtoShareUrl}>
                    <HStack gap="2" as="span">
                      <MailIcon boxSize="4" />
                      <span>Share via email</span>
                    </HStack>
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="gray"
                  asChild
                >
                  <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer">
                    <HStack gap="2" as="span">
                      <MessageCircleIcon boxSize="4" />
                      <span>Share via WhatsApp</span>
                    </HStack>
                  </a>
                </Button>
              </HStack>
              <Button
                type="button"
                variant="outline"
                size="sm"
                colorPalette="gray"
                mt="4"
                onClick={handleResetTheme}
              >
                <RotateCcwIcon /> Reset theme and start new study
              </Button>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
