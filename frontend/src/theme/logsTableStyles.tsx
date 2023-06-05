// import type { ComponentStyleConfig } from "@chakra-ui/theme";
// import textStyles from "./textStyles";
// import colors from "./colors";

// const Thead: ComponentStyleConfig = {
//   baseStyle: {
//     color: colors.blue[600],
//   },
//   variants: {
//     logRecordsTableHeader: {
//       background: colors.blue[50],
//       textTransform: "none",
//       ...textStyles["header-medium"]
//     },
//   },
//   defaultProps: {
//     variant: "logRecordsTableHeader",
//   },
// };

// export default Thead;

import type { ComponentStyleConfig } from "@chakra-ui/theme";
import textStyles from "./textStyles";
// TODO: separate out each component into different files

const Table: ComponentStyleConfig = {
  variants: {
    logRecordsTable: {
      thead: {
        // textTransform: "none",
        // ...textStyles["header-medium"],
        // fontSize: "16px"
        background: "blue.50",
        color: "blue.600",
        textTransform: "none",
      },
      th: {
        textTransform: "none",
        ...textStyles["header-medium"],
      },
      td: {
        ...textStyles["body-medium"],
      },
    },
  },
};

export default Table;
