import React, { RefObject } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { VscKebabVertical } from "react-icons/vsc";
import { Tag } from "../../../types/TagTypes";

type Props = {
  tags: Tag[];
  tableRef: RefObject<HTMLDivElement>;
  userPageNum: number;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  getRecords: (pageNumber: number) => Promise<void>;
  countTags: () => Promise<void>;
};

const TagsTable = ({
  tags,
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
              <Th>Tag Name</Th>
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tags.map((tag) => {
              return (
                <Tr key={tag.tagId} verticalAlign="middle">
                  <Td>{tag.name}</Td>
                  <Td width="1%">
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<VscKebabVertical />}
                        w="36px"
                        variant="ghost"
                      />
                      <MenuList>
                        <MenuItem>Edit Tag</MenuItem>
                        <MenuItem>Delete Tag</MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TagsTable;
