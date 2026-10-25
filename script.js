
"use strict";

// カレンダーの初期設定
const today = new Date();
let displayedYear = today.getFullYear();
let displayedMonth = today.getMonth();
let selectedDate = formatDate(today);

const STORAGE_KEY = "school-planner-tasks-v1";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    alert("保存できませんでした。ブラウザの保存設定を確認してください。");
    return false;
  }
}

function renderCalendar() {
  const title = document.getElementById("monthTitle");
  const container = document.getElementById("calendarDays");

  title.textContent = `${displayedYear}年${displayedMonth + 1}月`;
  container.replaceChildren();

  const firstDay = new Date(displayedYear, displayedMonth, 1).getDay();
  const daysInMonth = new Date(
    displayedYear,
    displayedMonth + 1,
    0
  ).getDate();

  // 月初めの空白
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("span");
    blank.className = "blank";
    container.appendChild(blank);
  }

  // 日付ボタンを作成
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(displayedYear, displayedMonth, day);
    const dateKey = formatDate(date);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(day);
    button.setAttribute("aria-label", `${displayedMonth + 1}月${day}日`);

    if (dateKey === formatDate(today)) {
      button.classList.add("today");
    }

    if (dateKey === selectedDate) {
      button.classList.add("selected");
    }

    if (tasks.some(task => task.date === dateKey)) {
      button.classList.add("has-task");
    }

    button.addEventListener("click", () => {
      selectedDate = dateKey;
      renderCalendar();
      renderTasks();
    });

    container.appendChild(button);
  }
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const dateLabel = document.getElementById("selectedDate");

  const [year, month, day] = selectedDate.split("-");
  dateLabel.textContent = `${year}年${Number(month)}月${Number(day)}日`;

  list.replaceChildren();

  const dailyTasks = tasks.filter(task => task.date === selectedDate);

  if (dailyTasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "予定はまだありません。";
    list.appendChild(empty);
    return;
  }

  dailyTasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";

    const name = document.createElement("strong");
    name.textContent = task.title;

    const category = document.createElement("small");
    category.textContent = task.category;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "削除";
    remove.setAttribute("aria-label", `${task.title}を削除`);
    remove.style.cssText =
      "float:right;border:0;background:#fff0f0;color:#c0392b;" +
      "border-radius:8px;padding:5px 9px;font-size:12px;";

    remove.addEventListener("click", () => {
      if (!confirm(`「${task.title}」を削除しますか？`)) return;

      const previous = tasks;
      tasks = tasks.filter(item => item.id !== task.id);

      if (!saveTasks()) {
        tasks = previous;
        return;
      }

      renderCalendar();
      renderTasks();
    });

    card.appendChild(remove);
    card.appendChild(name);
    card.appendChild(category);
    list.appendChild(card);
  });
}

function addTask(category = "") {
  const title = prompt("予定・課題の名前を入力してください");

  if (title === null || title.trim() === "") return;

  const selectedCategory = category || prompt(
    "種類を入力してください（例：レポート、テスト、塾）",
    "その他"
  );

  if (selectedCategory === null) return;

  const task = {
    id: typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    title: title.trim(),
    category: selectedCategory.trim() || "その他",
    date: selectedDate
  };

  tasks.push(task);

  if (!saveTasks()) {
    tasks.pop();
    return;
  }

  renderCalendar();
  renderTasks();
}

// 前の月
document.getElementById("prevMonth").addEventListener("click", () => {
  displayedMonth--;

  if (displayedMonth < 0) {
    displayedMonth = 11;
    displayedYear--;
  }

  renderCalendar();
});

// 次の月
document.getElementById("nextMonth").addEventListener("click", () => {
  displayedMonth++;

  if (displayedMonth > 11) {
    displayedMonth = 0;
    displayedYear++;
  }

  renderCalendar();
});

// 予定を追加
document.getElementById("addTask").addEventListener("click", () => {
  addTask();
});

// カテゴリから予定を追加
document.querySelectorAll(".shortcut").forEach(button => {
  button.addEventListener("click", () => {
    addTask(button.dataset.category);
  });
});

// 未実装のメニュー
document.querySelectorAll(".bottom-nav .nav-item").forEach(button => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active")) return;
    alert("この画面は今後のアップデートで追加します。");
  });
});

document.querySelector(".icon-button").addEventListener("click", () => {
  alert("通知機能は今後のアップデートで追加します。");
});

// 最初の表示
renderCalendar();
renderTasks();

