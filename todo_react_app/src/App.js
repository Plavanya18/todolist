import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
	Checkbox,
  } from '@mantine/core';
  import { FaPlus, FaPencilAlt } from 'react-icons/fa';
  import { useState, useEffect } from 'react';
  import { MoonStars, Sun, Trash } from 'tabler-icons-react'; 
  import {
	MantineProvider,
	ColorSchemeProvider,
  } from '@mantine/core';
  import { useColorScheme } from '@mantine/hooks';
  import { useHotkeys, useLocalStorage } from '@mantine/hooks';
  
  export default function App() {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);
	const [editIndex, setEditIndex] = useState(null); // Track task being edited
	const [editTitle, setEditTitle] = useState(''); // Track title of task being edited
	const [searchText, setSearchText] = useState(''); // State for search bar input
  
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
	  key: 'mantine-color-scheme',
	  defaultValue: 'light',
	  getInitialValueInEffect: true,
	});
  
	const toggleColorScheme = (value) =>
	  setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  
	useHotkeys([['mod+J', () => toggleColorScheme()]]);
  
	function createTask(taskTitle) {
	  if (!taskTitle.trim()) return; // Don't create an empty task
  
	  const newTask = {
		title: taskTitle,
		isCompleted: false,
	  };
  
	  setTasks([...tasks, newTask]);
	  saveTasks([...tasks, newTask]);
	  setEditTitle(''); // Reset input field
	  setOpened(false); // Close the modal
	}
  
	function deleteTask(index) {
	  const clonedTasks = [...tasks];
	  clonedTasks.splice(index, 1);
	  setTasks(clonedTasks);
	  saveTasks(clonedTasks);
	}
  
	function toggleCompletion(index) {
	  const clonedTasks = [...tasks];
	  clonedTasks[index].isCompleted = !clonedTasks[index].isCompleted;
	  setTasks(clonedTasks);
	  saveTasks(clonedTasks);
	}
  
	function loadTasks() {
	  let loadedTasks = localStorage.getItem('tasks');
	  let tasks = JSON.parse(loadedTasks);
  
	  if (tasks) {
		setTasks(tasks);
	  }
	}
  
	function saveTasks(tasks) {
	  localStorage.setItem('tasks', JSON.stringify(tasks));
	}
  
	function handleEdit(index) {
	  setEditIndex(index);
	  setEditTitle(tasks[index].title); // Set the title of the task being edited
	  setOpened(true); // Open the modal for editing
	}
  
	function saveEdit() {
	  const clonedTasks = [...tasks];
	  clonedTasks[editIndex].title = editTitle; // Update task title
	  setTasks(clonedTasks);
	  saveTasks(clonedTasks);
	  setOpened(false); // Close modal after saving
	}
  
	useEffect(() => {
	  loadTasks();
	}, []);
  
	return (
	  <ColorSchemeProvider colorScheme={colorScheme} >
		<MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
		  <div className="App">
			<Modal
			  opened={opened}
			  size={'md'}
			  title={<div style={{ paddingLeft: '10rem', fontWeight: 'bolder' }}>
				{editIndex !== null ? 'Edit Task' : 'New Task'}
			  </div>}
			  withCloseButton={false}
			  onClose={() => setOpened(false)}
			>
			  <TextInput
				
				value={editTitle}
				style={{ border: '2px solid #6C63FF', borderRadius: '7px'}}
				onChange={(e) => setEditTitle(e.target.value)} // Update state when input changes
				placeholder={'Input your task...'}
			  />
			  <Group mt={'md'} position={'apart'}>
				<Button style={{color:'#6C63FF', borderColor:'#6C63FF'}} onClick={() => setOpened(false)} variant={'subtle'}>
				  Cancel
				</Button>
				<Button style={{backgroundColor:'#6C63FF'}} onClick={() => (editIndex !== null ? saveEdit() : createTask(editTitle))}>
				  {editIndex !== null ? 'Save Changes' : 'Apply'}
				</Button>
			  </Group>
			</Modal>
  
			<Container size={700} my={40} >
			  <Title
				sx={(theme) => ({
				  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
				  fontWeight: 900,
				  paddingLeft: '10rem',
				})}
			  >
				TODO LIST
			  </Title>
  
			  <Group position={'apart'} mt={10}>
				{/* Search Bar */}
				<TextInput
				  style={{ width: '70%', color:'#6C63FF',  border: '2px solid #6C63FF', borderRadius: '7px' }}
				  placeholder={'Search or add a new task...'}
				  value={searchText}
				  onChange={(e) => setSearchText(e.target.value)}
				  onKeyDown={(e) => {
					if (e.key === 'Enter' && searchText.trim()) {
					  createTask(searchText); // Add task when pressing Enter
					}
				  }}
				/>
				{/* Add Button */}
				<Button style={{backgroundColor: '#6C63FF'}} onClick={() => createTask(searchText)}>ADD</Button>
  
				{/* Toggle Color Scheme */}
				<ActionIcon style={{ backgroundColor: '#6C63FF', color:'white'}} onClick={() => toggleColorScheme()} size="lg">
				  {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
				</ActionIcon>
			  </Group>
  
			  {/* Task List */}
			  {tasks.length > 0 ? (
				tasks.map((task, index) => (
					<>
					<Card mt={0.5} style={{backgroundColor:'transparent'}}>  {/* Removed the margin-top from Card */}
					<Group position={'apart'} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
					  <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
						<Checkbox
						  checked={task.isCompleted}
						  onChange={() => toggleCompletion(index)}
						  style={{ marginRight: '10px' }}
						/>
						<div
						  style={{
							textDecoration: task.isCompleted ? 'line-through' : 'none',
							opacity: task.isCompleted ? 0.5 : 1,
							flexGrow: 1,
						  }}
						>
						  <Text weight={'bold'} style={{fontSize:'1rem'}} >{task.title}</Text>
						</div>
					  </div>
					  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
						<ActionIcon
						  style={{ color: 'grey' }}
						  onClick={() => handleEdit(index)}
						  color={'blue'}
						  variant={'transparent'}
						  onMouseEnter={(e) => (e.target.style.color = '#6C63FF')}
						  onMouseLeave={(e) => (e.target.style.color = 'grey')}
						>
						  <FaPencilAlt />
						</ActionIcon>
						<ActionIcon
						  style={{ color: 'grey' }}
						  onClick={() => deleteTask(index)}
						  color={'red'}
						  variant={'transparent'}
						  onMouseEnter={(e) => (e.target.style.color = 'red')}
						  onMouseLeave={(e) => (e.target.style.color = 'grey')}
						>
						  <Trash />
						</ActionIcon>
					  </div>
					</Group>
					
				  </Card>
				  
				  <div>
					  <hr style={{ border: '1px solid #6C63FF', margin: '0.5rem 0' }} /> {/* Reduced margin of <hr /> */}
					</div>
				  </>
				))
				
			  ) : (
				<div style={{ textAlign: 'center', marginTop: '2rem', marginRight:'7rem' }}>
 				 <img
    			src={require('./asset/Detective-check-footprint 1.png')}
  				alt="No tasks placeholder"
    			style={{ marginBottom: '1rem', width: '200px', height: 'auto'}}
  				/>
  				<Text size={'lg'} color={'dimmed'}>
   				 Empty...
 				 </Text>
				</div>

			  )}
  
			  {/* Floating Plus Button */}
			  <Button
				onClick={() => { setOpened(true); setEditIndex(null); }}
				style={{
					marginTop: '1rem',
					marginLeft: '34rem',
					backgroundColor: '#6C63FF',
					borderRadius: '50%',  // Makes the button round
					width: '40px',  // Adjust the width
					height: '40px',  // Adjust the height
					display: 'flex',  // Optional: to center the content (icon) inside the button
					justifyContent: 'center',  // Optional: center the icon horizontally
					alignItems: 'center',  // Optional: center the icon vertically
				}}
				mt={'md'}
				>
				<FaPlus />
				</Button>

			</Container>
		  </div>
		</MantineProvider>
	  </ColorSchemeProvider>
	);
  }
  