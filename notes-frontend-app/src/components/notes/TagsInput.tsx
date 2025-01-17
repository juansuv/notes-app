import React, { useEffect, useState } from "react";
import { TextField, Chip, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateNoteTags } from "../../redux/actions/notes/notes";

interface TagsInputProps {
  noteId: number;
  currentTags: string[];
  onChange: (tags: string[]) => void;
  textColor: string; // Recibe el color de texto dinámico
}

const TagsInput: React.FC<TagsInputProps> = ({
  noteId,
  currentTags,
  onChange,
  textColor,
}) => {
  const [tags, setTags] = useState<string[]>(currentTags || []);
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    setTags(currentTags || []);
  }, [currentTags]);

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue)) {
      const updatedTags = [...tags, inputValue.trim()];
      setTags(updatedTags);
      dispatch(updateNoteTags(noteId, updatedTags));
      onChange(updatedTags);
      setInputValue("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
    dispatch(updateNoteTags(noteId, updatedTags));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Box>
      <TextField
        label="Añadir Etiqueta"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: textColor } }}
        InputProps={{
          style: { color: textColor, borderColor: textColor },
        }}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
            sx={{
              color: textColor,
              border: `1px solid ${textColor}`,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: textColor,
                color: "#fff",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagsInput;
