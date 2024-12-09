const timetable = [
    ["SHDC", "KHTN", "LSĐL", "Tiếng Anh", "GDCD"],
    ["HĐTN", "KHTN", "LSĐL", "LSĐL", "KNS"],
    ["Ngữ văn", "GDTC", "Âm nhạc", "Ngữ văn", "Toán"],
    ["Ngữ văn", "GDTC", "Toán", "Ngữ văn", "Văn"],
    ["Toán", "Công nghệ", "HĐ TNHN", "HĐ TNHN", "Văn"],
    ["EMG Englisn", "Anh", "Tin học", "EMG Math", "EMG Science"],
    ["EMG English", "Anh", "Toán", "EMG Math", "EMG Science"],
    ["EMG English", "Mỹ thuật", "GDĐP", "KHTN", "EMG Science"],
    ["N khóa", "", "", "KHTN", ""],
  ];
  
  const daysOfWeek = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const tasks = {}; // Danh sách công việc động
  
  // Hiển thị thời khóa biểu với các môn học có thể nhấp
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
  
  // Xử lý nhấp chuột vào môn học
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("subject")) {
      const subject = event.target.dataset.subject;
      if (!subject) return;
  
      const input = prompt(`Thêm công việc cho môn "${subject}"`, "");
      if (input) {
        if (!tasks[subject]) tasks[subject] = [];
        tasks[subject].push(input);
        renderTasks();
      }
    }
  });
  
  // Tính ngày và tiết học tiếp theo
  const calculateNextLesson = (subject) => {
    const today = new Date().getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
    const daysInWeek = 7; // Full week
    const schoolDays = 5; // Monday to Friday (Thứ 2 to Thứ 6)

    for (let i = 1; i <= daysInWeek; i++) { // Start from tomorrow (i = 1)
        const dayIndex = (today + i) % daysInWeek; // Loop through days starting from tomorrow

        // Skip non-school days
        if (dayIndex === 0 || dayIndex > schoolDays) continue;

        if (timetable.some((row) => row[dayIndex - 1] === subject)) { // `dayIndex - 1` for timetable index
            const nextLessonDate = new Date();
            nextLessonDate.setDate(new Date().getDate() + i); // Add i days to today
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
  
  // Hiển thị công việc cho ngày mai
  const taskList = document.getElementById("task-list");
  const renderTasks = () => {
    const tomorrowSubjects = [...new Set(timetable.map((row) => row[1]))]; // Môn học duy nhất cho Thứ 3
    taskList.innerHTML = "";
  
    tomorrowSubjects.forEach((subject) => {
      if (subject && tasks[subject]) {
        tasks[subject].forEach((task, index) => {
          const li = document.createElement("li");
          li.classList.add("fade-in");
          li.innerHTML = `
            ${subject}: ${task}
            <div>
              <button onclick="markDone('${subject}', ${index})">Hoàn thành</button>
            </div>
          `;
          taskList.appendChild(li);
        });
      }
    });
  
    renderPendingTasks();
  };
  
  // Hiển thị các công việc cần hoàn thành
  const pendingTaskList = document.createElement("ul");
  pendingTaskList.id = "pending-task-list";
  pendingTaskList.style.marginTop = "20px";
  document.querySelector(".tasks").appendChild(pendingTaskList);
  
  const renderPendingTasks = () => {
    pendingTaskList.innerHTML = "<h2>Các công việc cần hoàn thành</h2>";
    Object.keys(tasks).forEach((subject) => {
      tasks[subject].forEach((task) => {
        const nextLesson = calculateNextLesson(subject);
        const li = document.createElement("li");
        li.innerHTML = `${subject}: ${task} - Tiết tiếp theo diễn ra vào ${nextLesson}`;
        pendingTaskList.appendChild(li);
      });
    });
  };
  
  // Đánh dấu công việc đã hoàn thành
  const markDone = (subject, index) => {
    tasks[subject].splice(index, 1);
    if (tasks[subject].length === 0) delete tasks[subject];
    renderTasks();
  };
  
  
  // Hiển thị ban đầu
  renderTasks();