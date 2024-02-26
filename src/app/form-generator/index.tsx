"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateForm } from "@/actions/generateForm";
import { useFormState, useFormStatus } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import { navigate } from "@/actions/navigateToForm";

import { useSession, signIn } from "next-auth/react";

type Props = {};

const initialState: {
  message: string;
  data?: any;
} = {
  message: "",
};

export function SubmitButton() {
  const { pending } = useFormStatus();
  console.log("inside sumni");
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate Form"}
    </Button>
  );
}

const FormGenerator = (props: Props) => {
  const [state, formAction] = useFormState(generateForm, initialState);
  const [open, setOpen] = useState(false);
  const session = useSession();
  //   console.log(session);

  useEffect(() => {
    if (state?.message == "success") {
      setOpen(false);
      navigate(state.data.formId);
    }
    console.log(state?.data);
  }, [state?.message]);

  const onFormCreate = () => {
    if (session.data?.user) {
      setOpen(true);
    } else {
      signIn();
    }
  };

  // console.log("uuid", uuidv4());
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={onFormCreate}>Create Form</Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          <Textarea
            // value={"who is elon musk"}
            id="description"
            name="description"
            required
            placeholder="Share what your form is about, who is it for, and what information you would like to collect. And AI will do the rest!"
          />
          <DialogFooter>
            <SubmitButton />
            <Button variant="outline">Create Manually</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default FormGenerator;
