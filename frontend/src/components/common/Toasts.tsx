import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";

type ToastStatus = "success" | "error" | "warning" | "info";

type ToastProps = {
  title: string;
  description: string;
  status: ToastStatus;
};
const CreateToast = (): ((
  title: string,
  description: string,
  status: ToastStatus,
) => void) => {
  const toast = useToast();
  const [details, setDetails] = useState<ToastProps | null>();

  const makeToast = (
    title: string,
    description: string,
    status: ToastStatus,
  ) => {
    const newToast: ToastProps = { title, description, status };
    setDetails(newToast);
  };

  useEffect(() => {
    if (details) {
      toast({
        title: details.title,
        description: details.description,
        status: details.status,
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  }, [details, toast]);

  return makeToast;
};

export default CreateToast;
