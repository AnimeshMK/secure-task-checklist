import React, { useState, useEffect } from 'react';

const Checklist = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [lists, setLists] = useState(() => {
    const storedLists = localStorage.getItem('lists');
    return storedLists ? JSON.parse(storedLists) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showTaskBox, setShowTaskBox] = useState(false);

  const [highlightedTaskId, setHighlightedTaskId] = useState(null);
  const [highlightShadowColor, setHighlightShadowColor] = useState('');

  const [showListBox, setShowListBox] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listItems, setListItems] = useState(['']);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedLists = JSON.parse(localStorage.getItem("lists")) || [];
    setTasks(storedTasks);
    setLists(storedLists);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [tasks, lists]);

  const handleAddTaskClick = () => {
    setShowTaskBox(true);
  };

  const handleTaskSubmit = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        deadline: deadline,
        completed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
      setDeadline('');
      setShowTaskBox(false);
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCompleteTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const changedTask = updatedTasks.find(task => task.id === id);
    setHighlightShadowColor(changedTask.completed ? '0 0 10px #22c55e' : '0 0 10px #eab308');
    setHighlightedTaskId(id);

    setTimeout(() => {
      setHighlightedTaskId(null);
      setHighlightShadowColor('');
    }, 700);
  };

  // 🧩 LIST FUNCTIONS
  const handleListSubmit = () => {
    if (listTitle.trim() !== '' && listItems.some(item => item.trim() !== '')) {
      const newList = {
        id: Date.now(),
        title: listTitle,
        items: listItems.filter(item => item.trim() !== ''),
      };
      setLists([...lists, newList]);
      setListTitle('');
      setListItems(['']);
      setShowListBox(false);
    }
  };

  const handleCancelList = () => {
    setShowListBox(false);
    setListTitle('');
    setListItems(['']);
  };

  const handleItemChange = (index, value) => {
    const updatedItems = [...listItems];
    updatedItems[index] = value;
    setListItems(updatedItems);
  };

  const addNewItemField = () => {
    setListItems([...listItems, '']);
  };

  return (
    <div style={{ padding: '40px', color: 'white', backgroundColor: '#111827', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '100px', width: '200px', objectFit: 'contain', borderRadius: '8px' }} />
      </div>

      <h1 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 'bold', color: '#facc15', marginBottom: '30px', marginTop: '5px' }}>
        Secure Task Checklist
      </h1>
      <div style={{ borderBottom: '2px solid #334155', margin: '0 auto 20px auto', maxWidth: '6000px' }} />

      <div style={{
        display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px',
        borderBottom: '2px solid #334155', paddingBottom: '15px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto'
      }}>
        <button
          onClick={handleAddTaskClick}
          style={{
            backgroundColor: '#2563eb', color: 'white', border: 'none',
            borderRadius: '30px', padding: '10px 20px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)', transition: 'box-shadow 0.3s ease-in-out'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.9)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 10px rgba(37, 99, 235, 0.5)'; }}
        >
          <span style={{ fontSize: '18px' }}>➕</span> Add Task
        </button>

        <button
          style={{
            backgroundColor: '#38bdf8', color: '#fff', border: 'none',
            borderRadius: '30px', padding: '10px 20px', fontWeight: 'bold',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)', transition: 'box-shadow 0.3s ease-in-out'
          }}
          onClick={() => setShowListBox(true)}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.9)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.5)'; }}
        >
          <span style={{ fontSize: '18px' }}>📋</span> Add List
        </button>
      </div>

      {showTaskBox && (
        <div style={{ margin: '0 auto 20px auto', padding: '20px', maxWidth: '400px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}>
          <input type="text" placeholder="Enter your task..." value={newTask} onChange={(e) => setNewTask(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: 'none', marginBottom: '10px', width: '100%', backgroundColor: '#374151', color: 'white' }} />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: 'none', marginBottom: '10px', width: '100%', backgroundColor: '#374151', color: 'white' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px' }}>
            <button onClick={handleTaskSubmit}
              style={{ width: '50%', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '30px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              Done
            </button>
            <button onClick={() => setShowTaskBox(false)}
              style={{ width: '50%', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '30px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ Add List Box Popup */}
      {showListBox && (
        <div style={{ margin: '0 auto 20px auto', padding: '20px', maxWidth: '400px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}>
          <input type="text" placeholder="List Title" value={listTitle} onChange={(e) => setListTitle(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: 'none', marginBottom: '10px', width: '100%', backgroundColor: '#374151', color: 'white' }} />
          {listItems.map((item, index) => (
            <input key={index} type="text" placeholder={`Item ${index + 1}`} value={item} onChange={(e) => handleItemChange(index, e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: 'none', marginBottom: '10px', width: '100%', backgroundColor: '#374151', color: 'white' }} />
          ))}
          <button onClick={addNewItemField} style={{ marginBottom: '10px', color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer' }}>➕ Add Another Item</button>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <button onClick={handleListSubmit}
              style={{ width: '50%', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '30px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              Done
            </button>
            <button onClick={handleCancelList}
              style={{ width: '50%', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '30px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 📄 Split View Container */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '30px', maxWidth: '90%', margin: '0 auto', marginTop: '40px', border: '1px solid #334155', borderRadius: '12px', padding: '20px', backgroundColor: '#1e293b' }}>
        {/* Left - Tasks */}
        <div style={{ flex: 1, borderRight: '2px solid #334155', paddingRight: '20px' }}>
          <h2 style={{ color: '#facc15', marginBottom: '15px', borderBottom: '1px solid #475569', paddingBottom: '8px' }}>Your Tasks</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#1f2937', borderRadius: '10px', border: '1px solid #374151', boxShadow: highlightedTaskId === task.id ? highlightShadowColor : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#22c55e' : '#f3f4f6' }}>{task.text}</p>
                    {task.deadline && <small style={{ color: '#9ca3af' }}>Deadline: {new Date(task.deadline).toLocaleDateString('en-GB')}</small>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleCompleteTask(task.id)} style={{ backgroundColor: task.completed ? '#eab308' : '#22c55e', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}>
                      {task.completed ? 'Undo' : 'Completed'}
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right - Lists */}
        <div style={{ flex: 1, paddingLeft: '20px' }}>
          <h2 style={{ color: '#38bdf8', marginBottom: '10px', borderBottom: '1px solid #475569', paddingBottom: '8px' }}>Your Lists</h2>
          {lists.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center' }}>No lists created yet.</p>
          ) : (
            lists.map((list) => (
              <div key={list.id} style={{ backgroundColor: '#1f2937', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #374151' }}>
                <h3 style={{ color: '#fbbf24', fontSize: '18px', marginBottom: '8px' }}>{list.title}</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: 'white' }}>
                  {list.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklist;
