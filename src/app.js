import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector, addButtonSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$addButton = document.querySelector(addButtonSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
  }

  addTask(task) {
    // Using Spinner & disabled add button
    this.$addButton.innerHTML = `<div class="spinner-border 
    spinner-border-sm" role="status" ></div>`;
    this.$addButton.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$addButton.innerHTML = 'Add Task';
        this.$addButton.disabled = false;
      }) // Yeni eklenen taskleri silebilmek için handle delete fonksiyonu cağırıldı.
      .then(() => this.handleDeleteTask());
  }

  deleteTask(taskId, button) {
    button.innerHTML = `<div class="spinner-border 
    spinner-border-sm" role="status" ></div>`;
    deleteTaskFromApi(taskId)
      .then((res) => res.json())
      .then((data) => {
        this.deleteTaskFromTable(data);
      });
  }

  addTaskToTable(task, index) {
    const { id, title } = task;
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.id = id;
    $newTaskEl.innerHTML = `<th scope="row">${id}</th><td>${title}</td>
    <td><button id="${id}" class="btn btn-danger"><i class="bi bi-trash-fill"></i></button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  deleteTaskFromTable(task) {
    const deletedRow = document.getElementById(`${task.id}`);
    this.$tableTbody.removeChild(deletedRow);
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  getDeleteButtons() {
    return this.$tableTbody.querySelectorAll('tr td button');
  }

  handleDeleteTask() {
    const deleteButtons = this.getDeleteButtons();
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const { id } = button;
        this.deleteTask(id, button);
      });
    });
  }

  fillTasksTable() {
    getDataFromApi()
      .then((currentTasks) => {
        currentTasks.forEach((task, index) => {
          this.addTaskToTable(task, index + 1);
        });
      }) // Tabloyu Doldurma işlemi asenkron olduğu için handle delete fonksiyonunu burada çağırdık.
      .then(() => this.handleDeleteTask());
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
