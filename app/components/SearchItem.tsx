import { ListItem, IconButton, ListItemText } from "@mui/material";
import { Undo, Edit } from "@mui/icons-material";

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16).replace('T', ' '); // YYYY-MM-DD HH:mm
};

const SearchItem = ({ task, onEdit, onUndo }) => {
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton edge="end" color="info" onClick={() => onEdit(task.id)}>
            <Edit />
          </IconButton>
          <IconButton edge="end" color="error" onClick={() => onUndo(task.id)}>
            <Undo />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={task.text}
        secondary={
          task.completedAt
            ? `Completed at: ${formatDate(task.completedAt)}`
            : null
        }
      />
    </ListItem>
  );
};

export default SearchItem;
