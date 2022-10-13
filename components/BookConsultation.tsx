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
} from "@chakra-ui/react";

const DEFAULT_FORM_SUBMISSION = {
  email: "",
  name: "",
  phone: "",
  interests: "",
};

export default function BookConsultation({ isOpen, onClose }) {
  const [form, setForm] = useState(DEFAULT_FORM_SUBMISSION);
  const { email, name, phone, interests } = form;

  const handleSetForm = ({
    target: { value, name },
  }: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: value });

  const handleSubmit = () => {
    console.log(email, name, phone, interests);
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
      label: "How May I Help You?",
      type: "textarea",
      value: interests,
      id: "interests",
      formHelperText:
        "This is a confidential intake form, please take your time to describe what you are seeking help with to prepare for our consultation.",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book Your Med Spa Consultation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {FORM_INPUTS.map(({ label, type, value, id, formHelperText }) => (
            <>
              <FormControl mb={4}>
                <FormLabel>{label}</FormLabel>
                {type !== "textarea" && (
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
                {formHelperText && (
                  <FormHelperText>{formHelperText}</FormHelperText>
                )}
              </FormControl>
            </>
          ))}
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
