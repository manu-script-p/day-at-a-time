const initialBlocks = [
  { time: '08:00 AM', title: 'Begin gently', detail: 'Morning reset · no rushing' },
  { time: '09:00 AM', title: 'Deep work', detail: 'The one thing that moves the needle' },
  { time: '12:30 PM', title: 'Pause & refuel', detail: 'Step away from the screen' },
  { time: '02:00 PM', title: 'Lighter tasks', detail: 'Messages, admin, small wins' },
  { time: '06:00 PM', title: 'Close the loop', detail: 'Celebrate progress. Let tomorrow wait.' }
];
const storageKey = 'one-day-at-a-time';
const $ = (s) => document.querySelector(s);
const taskList = $('#task-list');
const timeline = $('#timeline');
let state;

function todayString() { return new Date().toISOString().slice(0, 10); }
function defaultState() { return { date: todayString(), intention: '', tasks: [{ text: '', done: false }, { text: '', done: false }, { text: '', done: false }], blocks: initialBlocks }; }
function load() { try { return { ...defaultState(), ...JSON.parse(localStorage.getItem(storageKey)) }; } catch { return defaultState(); } }
function save() { localStorage.setItem(storageKey, JSON.stringify(state)); }
function renderTasks() {
  taskList.innerHTML = '';
  state.tasks.forEach((task, index) => {
    const node = $('#task-template').content.cloneNode(true);
    const row = node.querySelector('.task-row'); const input = node.querySelector('.task-input');
    input.value = task.text; row.classList.toggle('done', task.done);
    input.addEventListener('input', () => { state.tasks[index].text = input.value; save(); });
    row.querySelector('.check').addEventListener('click', () => { state.tasks[index].done = !state.tasks[index].done; save(); renderTasks(); });
    row.querySelector('.remove').addEventListener('click', () => { state.tasks.splice(index, 1); save(); renderTasks(); });
    taskList.append(node);
  });
}
function renderBlocks() {
  timeline.innerHTML = '';
  state.blocks.forEach((block, index) => {
    const node = $('#block-template').content.cloneNode(true);
    const fields = [['.time-input', 'time'], ['.block-title', 'title'], ['.block-detail', 'detail']];
    fields.forEach(([selector, key]) => { const field = node.querySelector(selector); field.value = block[key]; field.addEventListener('input', () => { state.blocks[index][key] = field.value; save(); }); });
    node.querySelector('.block-remove').addEventListener('click', () => { state.blocks.splice(index, 1); save(); renderBlocks(); });
    timeline.append(node);
  });
}
function render() {
  $('#date').value = state.date;
  $('#intention').value = state.intention;
  $('#intention-count').textContent = `${state.intention.length} / 300`;
  renderTasks(); renderBlocks();
}
state = load(); render();
$('#date').addEventListener('change', (e) => { state.date = e.target.value; save(); });
$('#intention').addEventListener('input', (e) => { state.intention = e.target.value; $('#intention-count').textContent = `${state.intention.length} / 300`; save(); });
$('#add-task').addEventListener('click', () => { state.tasks.push({ text: '', done: false }); save(); renderTasks(); taskList.lastElementChild?.querySelector('input').focus(); });
$('#add-block').addEventListener('click', () => { state.blocks.push({ time: '', title: '', detail: '' }); save(); renderBlocks(); timeline.lastElementChild?.querySelector('.time-input').focus(); });
$('#reset-day').addEventListener('click', () => { if (confirm('Start a fresh plan for today?')) { state = defaultState(); save(); render(); } });
