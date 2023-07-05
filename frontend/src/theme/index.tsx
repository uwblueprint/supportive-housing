import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import fontStyles from "./fontStyles";
import Button from "./common/buttonStyles";
import Table from "./common/logsTableStyles";
import Text from "./common/textStyles";
import { Input, Textarea } from "./forms/inputStyles";
import { FormLabel, Modal } from "./forms/formTextStyles";

const customTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  colors,
  fontStyles,
  components: {
    Button,
    Input,
    Table,
    Textarea,
    FormLabel,
    Modal,
    Text,
  },
});

export default customTheme;
