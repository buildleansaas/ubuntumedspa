import React, { useState, ChangeEvent } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Textarea,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { LeadsTable } from "lib/airtable";

const DEFAULT_FORM_SUBMISSION = {
  email: "",
  name: "",
  phone: "",
  comments: "",
  interests: [],
  referral: "",
};

export default function BookConsultation({ isOpen, onClose }) {
  const [form, setForm] = useState(DEFAULT_FORM_SUBMISSION);
  const { email, name, phone, comments, interests, referral } = form;

  const handleSetForm = ({
    target: { value, name },
  }: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: value });

  const handleSubmit = async () => {
    console.log(email, name, phone, comments, interests, referral);
    const res = await LeadsTable.create({
      email,
      name,
      phone,
      comments,
      interests,
      referral,
    });

    console.log(res);
  };

  const FORM_INPUTS = [
    { label: "Preferred Name", type: "string", value: name, id: "name" },
    {
      label: "Email",
      type: "string",
      value: email,
      id: "email",
      formHelperText: "We'll never share your email.",
    },
    {
      label: "Phone",
      type: "string",
      value: phone,
      id: "phone",
      formHelperText: "We'll also never share your phone.",
    },
    {
      label: "Interests",
      type: "checkboxes",
      value: interests,
      id: "interests",
      options: [
        "Vampire Facial",
        "Breast Lift",
        "Joint Restoration",
        "Hair Restoration",
        "Vampire Face Lift",
        "P Shot",
        "O Shot",
      ],
      formHelperText:
        "If you want specific consultation on certain procedures, please let us know which!",
    },
    {
      label: "How May I Help You?",
      type: "textarea",
      value: comments,
      id: "comments",
      formHelperText:
        "This is a confidential intake form, please take your time to describe what you are seeking help with to prepare for our consultation.",
    },
    {
      label: "Who Referred You?",
      type: "string",
      value: referral,
      id: "referral",
      formHelperText: "Send your friends and get free med spa services!",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book Your Med Spa Consultation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {FORM_INPUTS.map(
            ({ label, type, value, id, formHelperText, options }) => (
              <>
                <FormControl mb={4}>
                  <FormLabel fontSize="lg">{label}</FormLabel>
                  {type !== "textarea" && type !== "checkboxes" && (
                    <Input
                      onChange={(e) => handleSetForm(e)}
                      {...{ type, value, name: id }}
                    />
                  )}
                  {type === "textarea" && (
                    <Textarea
                      onChange={(e) => handleSetForm(e)}
                      {...{ type: "string", value, name: id }}
                    />
                  )}
                  {type === "checkboxes" && (
                    <Stack
                      spacing={0}
                      direction="row"
                      flexWrap="wrap"
                      align="start"
                      justify="start"
                    >
                      {options.map((option) => (
                        <Checkbox
                          p={2}
                          size="md"
                          onChange={({
                            target: { checked },
                          }: ChangeEvent<HTMLInputElement>) => {
                            setForm({
                              ...form,
                              interests: interests.includes(option)
                                ? [
                                    ...form.interests.filter(
                                      (i) => i !== option
                                    ),
                                  ]
                                : [...form.interests, option],
                            });
                          }}
                        >
                          {option}
                        </Checkbox>
                      ))}
                    </Stack>
                  )}
                  {formHelperText && (
                    <FormHelperText>{formHelperText}</FormHelperText>
                  )}
                </FormControl>
              </>
            )
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleSubmit} colorScheme="blue">
            Schedule Consultation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
