import type { ComponentStyleConfig } from "@chakra-ui/theme";
import fontStyles from "../fontStyles";

const Table: ComponentStyleConfig = {
  variants: {
    showTable: {
      th: {
        color: "teal.500",
        backgroundColor: "teal.50",
        textTransform: "none",
        ...fontStyles["header-table"],
      },
      tr: {
        borderBottom: "1px",
        borderColor: "gray.100",
      },
      thead: {
        position: "sticky",
        top: 0,
        zIndex: 1
      },
      td: {
        wordBreak: "break-word"
      }
    },
  },
};

export default Table;
