import { extendTheme } from "@chakra-ui/react";

import colors from "./common/colors";
import textStyles from "./common/textStyles";
import Button from "./buttonStyles";
import Table from "./logsTableStyles";
import Input from "./fields/inputStyles";
import Textarea from "./fields/textAreaStyles";

const customTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  colors,
  textStyles,
  components: {
    Button,
    Input,
    Table,
    Textarea,
  },
});

export default customTheme;
