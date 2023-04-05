/* eslint-disable react/react-in-jsx-scope */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";

type LogComponentProps = {
  employee: string;
};

// eslint-disable-next-line react/prop-types
const LogComponent: React.FC<LogComponentProps> = ({ employee }) => {
  const [building, setBuilding] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const handleBuildingChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setBuilding(event.target.value);
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // eslint-disable-next-line no-console
    console.log(
      `Employee: ${employee}, Date: ${new Date()}, Building: ${building}, Tags: ${tags}`,
    );
  };

  return (
    <div className="log-entry">
      <h1>New Log Entry Details</h1>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Employee</FormLabel>
          <Input type="text" value={employee} isDisabled />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Date</FormLabel>
          <Input type="text" value={new Date().toString()} isDisabled />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Building</FormLabel>
          <Select
            placeholder="Select building"
            value={building}
            onChange={handleBuildingChange}
          >
            <option value="Building A">Building A</option>
            <option value="Building B">Building B</option>
            <option value="Building C">Building C</option>
          </Select>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Tags</FormLabel>
          <Input type="text" value={tags} onChange={handleTagsChange} />
        </FormControl>
        <Button type="submit" mt={4}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default LogComponent;

export {};
