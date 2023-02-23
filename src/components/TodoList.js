import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function TodoList(props) {

  //const [checked, setChecked] = React.useState([1]);

  const [inputText, setInputText] = React.useState("");

  const [elements, setElements] = React.useState([]);

  React.useEffect(() => {
    const storedData = localStorage.getItem('todoItems');
    if (storedData) {
      setElements(JSON.parse(storedData));
    }
  }, []); 

  React.useEffect(() => {
    if (elements.length > 0) localStorage.setItem('todoItems', JSON.stringify(elements))  
  }, [elements]); 


  const handleToggle = (id) => () => {
    setElements(
      prevState => prevState.map(
        x => (
          x.id == id
          ? {
            ...x,
            checked: !x.checked
          }
          : x
        )
      )
    )
  };

  const handleChangeInputText = (e) => {
    setInputText(e.target.value)
  }

  const handleAddItem = () => {
    if (inputText.trim() == "") {
      return
    }
    console.log(`Adding ${inputText}`)
    setInputText("")
    const newDate = getDates(props.context)
    const newObj = {
      id:Math.random().toString(16).slice(2),
      name:inputText,
      date:newDate,
      checked:false
    }
    const updatedArray = [...elements,newObj]
    setElements(updatedArray)

    localStorage.setItem('todoItems', JSON.stringify(updatedArray));
  }

  return (
    <>
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {elements.length > 0 ? (
      elements.map((element) => {
        const labelId = `checkbox-list-secondary-label-${element}`;
        return (
          <ListItem
            key={element.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(element.id)}
                checked={element.checked}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${element + 1}`}
                  src={`/static/images/avatar/${element + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${element.name}`} />
            </ListItemButton>
          </ListItem>           

        );
      })
    ):(
          <ListItem
            key="0"
            disablePadding
          >
            <ListItemButton>
              <ListItemText id="0" primary={`Nothing to do yet!`} />
            </ListItemButton>
          </ListItem>
    )}
    </List>
    {props.context === "old" ||
    <Stack className="inputfield" direction="row" spacing={2}>
      <TextField size="small" id="outlined-basic" label="New task" variant="outlined" value={inputText} onChange={handleChangeInputText}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleAddItem();
        }
      }}
      />
      <Button onClick={handleAddItem} variant="contained" endIcon={<SendIcon />}>
        Add
      </Button>
    </Stack>}
    </>
  );
}

function getDates(context) {
  const today = new Date();
  if (context === "today") {
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // add leading zero if month is single digit
    let day = String(today.getDate()).padStart(2, '0'); // add leading zero if day is single digit

    const newDate = `${year}-${month}-${day}`;
    return newDate

  } else {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let year = tomorrow.getFullYear();
    let month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // add leading zero if month is single digit
    let day = String(tomorrow.getDate()).padStart(2, '0'); // add leading zero if day is single digit

    const newDate = `${year}-${month}-${day}`;
    return newDate
  }
}