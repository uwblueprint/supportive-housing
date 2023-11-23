import React from "react";
import { Box, Flex } from "@chakra-ui/react";

import NavigationBar from "../../common/NavigationBar";
import CreateTag from "../../forms/CreateTag";
import TagsTable from "./TagsTable";
import Pagination from "../../common/Pagination";

const TagsPage = (): React.ReactElement => {
  return (
    <Box>
      <NavigationBar />
      <Box
        textStyle="dm-sans-font"
        textAlign="center"
        width="75%"
        paddingTop="2%"
        margin="0px auto"
        color="blue.600"
      >
        <Flex marginBottom="16px" justify="space-between">
          <Box textStyle="hero-table">Tags</Box>
          <CreateTag 

          />
        </Flex>

        <TagsTable

        />
        <Pagination
        
        />
      </Box>
    </Box>
  );
};

export default TagsPage;
