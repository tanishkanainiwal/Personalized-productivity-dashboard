// Load and display user name
let userName = localStorage.getItem('userName');
if (!userName) {
  userName = prompt("Enter your name:");
  if (userName) localStorage.setItem('userName', userName);
}
document.querySelector('.user-name').textContent = userName || "User";

// Avatar initials and background color
function updateAvatar() {
  const avatar = document.querySelector('.user-avatar');
  const name = localStorage.getItem('userName') || "User";
  avatar.textContent = name.charAt(0).toUpperCase();
  const hue = Math.floor(Math.random() * 360);
  avatar.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
}
updateAvatar();

function changeUserName() {
  const newName = prompt("Enter your new name:");
  if (newName) {
    localStorage.setItem('userName', newName);
    document.querySelector('.user-name').textContent = newName;
    updateAvatar();
  }
}

// Theme toggle (dark/light)
document.getElementById('darkModeSwitch').addEventListener('change', function() {
  const theme = this.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('bsTheme', theme);
  updateIcons();
});

function updateIcons() {
  const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  document.querySelector('.fa-moon').style.display = isDark ? 'none' : 'inline-block';
  document.querySelector('.fa-sun').style.display = isDark ? 'inline-block' : 'none';
}

if (localStorage.getItem('bsTheme') === 'dark') {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
  document.getElementById('darkModeSwitch').checked = true;
  updateIcons();
}

// Clock and greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning!";
  if (hour < 18) return "Good Afternoon!";
  return "Good Evening!";
}

function updateTime() {
  document.getElementById('greeting').textContent = getGreeting();
  document.getElementById('clock').textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Get user location using browser
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(2);
        const lng = pos.coords.longitude.toFixed(2);
        document.querySelector('.weather-info h4').textContent = `Lat: ${lat}, Lng: ${lng}`;
        document.querySelector('.weather-info p').textContent = "Your current location (GPS)";
      },
      () => {
        document.querySelector('.weather-info p').textContent = "Location access denied or unavailable";
      }
    );
  } else {
    document.querySelector('.weather-info p').textContent = "Geolocation not supported";
  }
}

// Get location using IP
function getLocationByIP() {
  fetch('https://geolocation-db.com/json/')
    .then(res => res.json())
    .then(data => {
      document.querySelector('.weather-info h4').textContent = `${data.city}, ${data.state}, ${data.country_name}`;
      document.querySelector('.weather-info p').textContent = `Lat: ${data.latitude}, Lng: ${data.longitude}`;
    })
    .catch(() => {
      document.querySelector('.weather-info p').textContent = "Location by IP not available";
    });
}

// To-Do list functionality
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function renderTasks() {
  const list = document.getElementById('tasks-list');
  list.innerHTML = '';

  let filtered = tasks;
  if (currentFilter === 'pending') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

  filtered.forEach((task, i) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <span ondblclick="editTask(${i})">${task.text}</span>
      <button onclick="toggleTaskCompletion(${i})" class="complete-btn">✓</button>
      <button data-index="${i}">×</button>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll('#tasks-list button:not(.complete-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteTask(parseInt(btn.getAttribute('data-index')));
    });
  });
}

document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = document.getElementById('new-task').value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('new-task').value = '';
    renderTasks();
  }
}

function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function editTask(index) {
  const li = document.querySelectorAll('#tasks-list li')[index];
  const taskText = tasks[index].text;

  li.innerHTML = `
    <input type="text" value="${taskText}" class="form-control" onkeypress="handleEditKeyPress(event, ${index})">
    <button onclick="updateTask(${index})" class="btn btn-sm btn-success">Save</button>
    <button onclick="toggleTaskCompletion(${index})" class="complete-btn">✓</button>
    <button data-index="${index}">×</button>
  `;
  li.querySelector('input').focus();
}

function handleEditKeyPress(e, index) {
  if (e.key === 'Enter') updateTask(index);
}

function updateTask(index) {
  const input = document.querySelectorAll('#tasks-list li')[index].querySelector('input');
  const newText = input.value.trim();
  if (newText) {
    tasks[index].text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}

function deleteTask(index) {
  const li = document.querySelectorAll('#tasks-list li')[index];
  li.classList.add('deleting');
  setTimeout(() => {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }, 300);
}

function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.task-filter button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === filter) btn.classList.add('active');
  });
  renderTasks();
}
renderTasks();

// Show random motivational quote
const quotes = [
  "The secret of getting ahead is getting started.",
  "You don't have to be great to start, but you have to start to be great.",
  "Every day is a new beginning. Take a deep breath and start again.",
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts."
];
function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('daily-quote').textContent = quote;
}
showRandomQuote();

// Notes functionality
const notesTextarea = document.getElementById('notes');
notesTextarea.value = localStorage.getItem('notes') || '';
notesTextarea.addEventListener('input', () => {
  localStorage.setItem('notes', notesTextarea.value);
});
