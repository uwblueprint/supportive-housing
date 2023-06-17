import type { ComponentStyleConfig } from "@chakra-ui/theme";
import textStyles from "./textStyles";

const Table: ComponentStyleConfig = {
  variants: {
    logRecordsTable: {
      th: {
        color: "teal.500",
        backgroundColor: "teal.50",
        textTransform: "none",
        ...textStyles["table-header"],
      },
      tr: {
        borderBottom: "1px",
        borderColor: "gray.100",
      },
    },
  },
};

export default Table;
