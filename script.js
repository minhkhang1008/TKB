const timetable = [
  ["SHDC", "KHTN", "LSĐL", "Tiếng Anh", "GDCD"],
  ["HĐTN", "KHTN", "LSĐL", "LSĐL", "KNS"],
  ["Ngữ văn", "GDTC", "Âm nhạc", "Ngữ văn", "Toán"],
  ["Ngữ văn", "GDTC", "Toán", "Ngữ văn", "Văn"],
  ["Toán", "Công nghệ", "HĐ TNHN", "HĐ TNHN", "Văn"],
  ["EMG English", "Anh", "Tin học", "EMG Math", "EMG Science"],
  ["EMG English", "Anh", "Toán", "EMG Math", "EMG Science"],
  ["EMG English", "Mỹ thuật", "GDĐP", "KHTN", "EMG Science"],
  ["N khóa", "", "", "KHTN", ""],
];

const daysOfWeek = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : {};
};

let tasks = loadTasksFromLocalStorage();

const tableBody = document.getElementById("table-body");
timetable.forEach((row, periodIndex) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${periodIndex + 1}</td>
    ${row
      .map(
        (subject) =>
          `<td class="subject" data-subject="${subject}">${subject}</td>`
      )
      .join("")}
  `;
  tableBody.appendChild(tr);
});

const taskList = document.getElementById("task-list");
const pendingTaskList = document.getElementById("pending-task-list");

const renderTasks = () => {
  const today = new Date().getDay();
  const tomorrowIndex = (today + 1) % 7;
  const tomorrowSubjects = timetable.map((row) => row[tomorrowIndex - 1]);

  taskList.innerHTML = "";

  Object.keys(tasks).forEach((subject) => {
    if (tomorrowSubjects.includes(subject)) {
      tasks[subject].forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("fade-in");
        li.innerHTML = `
          <span>${subject}: ${task}</span>
          <div>
            <button onclick="markDone('${subject}', ${index})">Hoàn thành</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }
  });

  renderPendingTasks(today);
};

const renderPendingTasks = (today) => {
  pendingTaskList.innerHTML = "<h2>Các công việc cần hoàn thành</h2>";

  Object.keys(tasks).forEach((subject) => {
    tasks[subject].forEach((task, index) => {
      const nextLesson = calculateNextLesson(subject);
      const nextLessonDayIndex = daysOfWeek.indexOf(
        nextLesson.match(/Thứ \d|Chủ nhật/)[0]
      );

      if (nextLessonDayIndex !== (today + 1) % 7) {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${subject}: ${task} - Tiết tiếp theo diễn ra vào ${nextLesson}</span>
          <div>
            <button onclick="markDone('${subject}', ${index})">Đánh dấu đã hoàn thành</button>
            <button onclick="editTask('${subject}', ${index})">Chỉnh sửa</button>
          </div>
        `;
        pendingTaskList.appendChild(li);
      }
    });
  });
};

const markDone = (subject, index) => {
  tasks[subject].splice(index, 1);
  if (tasks[subject].length === 0) delete tasks[subject];
  saveTasksToLocalStorage();
  renderTasks();
};

const editTask = (subject, index) => {
  const newTask = prompt("Chỉnh sửa công việc:", tasks[subject][index]);
  if (newTask !== null && newTask.trim() !== "") {
    tasks[subject][index] = newTask;
    saveTasksToLocalStorage();
    renderTasks();
  }
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("subject")) {
    const subject = event.target.dataset.subject;
    if (!subject) return;

    const input = prompt(`Thêm công việc cho môn "${subject}"`, "");
    if (input) {
      if (!tasks[subject]) tasks[subject] = [];
      tasks[subject].push(input);
      saveTasksToLocalStorage();
      renderTasks();
    }
  }
});

const calculateNextLesson = (subject) => {
  const today = new Date().getDay();
  const daysInWeek = 7;
  const schoolDays = 5;

  for (let i = 1; i <= daysInWeek; i++) {
    const dayIndex = (today + i) % daysInWeek;

    if (dayIndex === 0 || dayIndex > schoolDays) continue;

    if (timetable.some((row) => row[dayIndex - 1] === subject)) {
      const nextLessonDate = new Date();
      nextLessonDate.setDate(new Date().getDate() + i);
      const dayName = daysOfWeek[dayIndex];
      const dateString = nextLessonDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      return `<b>${dayName} ${dateString}</b>`;
    }
  }
  return "<b>Không rõ</b>";
};

renderTasks();