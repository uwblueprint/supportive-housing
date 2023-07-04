import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import textStyles from "./fontStyles";
import Button from "./common/buttonStyles";
import Table from "./common/logsTableStyles";
import { Input, Textarea } from "./forms/inputStyles";

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
