
const STORAGE_KEY = "schoolPlannerReports";

const reportList = document.getElementById("reportList");
const addReportButton = document.getElementById("addReport");

let reports = [];

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  reports = Array.isArray(saved) ? saved : [];
} catch (error) {
  reports = [];
}

function saveReports() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function renderReports() {
  reportList.replaceChildren();

  if (reports.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "レポートはまだ登録されていません。";
    reportList.appendChild(empty);
    return;
  }

  reports.forEach((report) => {
    const card = document.createElement("div");
    card.className = "task-item";
    card.style.padding = "16px";
    card.style.marginBottom = "12px";
    card.style.border = "1px solid #dce5f3";
    card.style.borderRadius = "12px";

    const title = document.createElement("h3");
    title.textContent = `${report.subject} ${report.number}`;
    title.style.margin = "0 0 8px";

    const deadline = document.createElement("p");
    deadline.textContent = `提出期限：${report.deadline}`;
    deadline.style.margin = "0 0 8px";

    const status = document.createElement("p");
    status.textContent = report.submitted
      ? "✅ 提出済み"
      : "⏳ 未提出";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = report.submitted
      ? "未提出に戻す"
      : "提出済みにする";

    toggleButton.addEventListener("click", () => {
      report.submitted = !report.submitted;
      saveReports();
      renderReports();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.style.marginLeft = "12px";

    deleteButton.addEventListener("click", () => {
      if (!confirm("このレポートを削除しますか？")) return;

      reports = reports.filter((item) => item.id !== report.id);
      saveReports();
      renderReports();
    });

    card.append(title, deadline, status, toggleButton, deleteButton);
    reportList.appendChild(card);
  });
}

addReportButton.addEventListener("click", () => {
  const subject = prompt("教科を入力してください（例：国語）");
  if (subject === null || !subject.trim()) return;

  const number = prompt("レポート番号を入力してください（例：No.1）");
  if (number === null || !number.trim()) return;

  const deadline = prompt("提出期限を入力してください（例：2026-11-10）");
  if (deadline === null || !deadline.trim()) return;

  const report = {
    id: crypto.randomUUID(),
    subject: subject.trim(),
    number: number.trim(),
    deadline: deadline.trim(),
    submitted: false
  };

  reports.push(report);
  saveReports();
  renderReports();
});

renderReports();

