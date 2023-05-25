import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import textStyles from "./textStyles";
import Button from "./buttonStyles";
import Table from "./logsTableStyles";

const customTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  colors,
  textStyles,
  components: {
    Button,
    Table,
  },
});

export default customTheme;
