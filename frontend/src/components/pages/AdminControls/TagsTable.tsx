import React, { RefObject, useState } from "react";
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
import EditTag from "../../forms/EditTag";
import ConfirmationModal from "../../common/ConfirmationModal";
import TagAPIClient from "../../../APIClients/TagAPIClient";
import CreateToast from "../../common/Toasts";

type Props = {
  tags: Tag[];
  tableRef: RefObject<HTMLDivElement>;
  userPageNum: number;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  getTags: (pageNumber: number) => Promise<void>;
  countTags: () => Promise<void>;
};

const DELETE_CONFIRMATION_HEADER = "Delete Tag";
const deleteConfirmationMessage = (name: string) =>
  `Are you sure you want to delete tag ${name}? Deleting a tag will permanently remove it from the system.`;

const TagsTable = ({
  tags,
  tableRef,
  userPageNum,
  setUserPageNum,
  getTags,
  countTags,
}: Props): React.ReactElement => {
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const newToast = CreateToast();

  const handleEditClick = (tag: Tag) => {
    setEditingTag(tag);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (tag: Tag) => {
    setDeletingTag(tag);
    setIsDeleteModalOpen(true);
  };

  const deleteTag = async (tagId: number) => {
    const statusCode = await TagAPIClient.deleteTag(tagId);
    if (statusCode === 200) {
      newToast("Tag Deleted", "Tag has been successfully deleted.", "success");
      const newUserPageNum = tags.length === 1 ? userPageNum - 1 : userPageNum;
      countTags();
      getTags(newUserPageNum);
      setUserPageNum(newUserPageNum);
      setIsDeleteModalOpen(false);
    } else {
      newToast("Error Deleting Tag.", "Tag was unable to be deleted.", "error");
    }
  };

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
                        <MenuItem onClick={() => handleEditClick(tag)}>
                          Edit Tag
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(tag)}>
                          Delete Tag
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        {editingTag && (
          <EditTag
            tag={editingTag}
            isOpen={isEditModalOpen}
            userPageNum={userPageNum}
            getTags={getTags}
            toggleClose={() => setIsEditModalOpen(false)}
          />
        )}
        {deletingTag && (
          <ConfirmationModal
            header={DELETE_CONFIRMATION_HEADER}
            message={deleteConfirmationMessage(deletingTag.name)}
            isOpen={isDeleteModalOpen}
            action={() => deleteTag(deletingTag.tagId)}
            toggleClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default TagsTable;
