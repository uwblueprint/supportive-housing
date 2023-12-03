import React, { RefObject } from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

type Props = {
  /* TODO: tags: Tag[]; */
  tableRef: RefObject<HTMLDivElement>;
  userPageNum: number;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  getRecords: (pageNumber: number) => Promise<void>;
  countTags: () => Promise<void>;
};

const TagsTable = ({
  /* TODO: tags, */
  tableRef,
  userPageNum,
  setUserPageNum,
  getRecords,
  countTags,
}: Props): React.ReactElement => {
  return (
    <Box>
      <TableContainer
        marginTop="12px"
        height="70vh"
        overflowY="unset"
        ref={tableRef}
      >
        <Table variant="showTable" verticalAlign="middle">
          <Thead>
            <Tr>
              <Th>
                Tag Name
              </Th>
            </Tr>
          </Thead>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TagsTable;
