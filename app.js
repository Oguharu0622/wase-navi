const steps = ["ES", "Webテスト", "1次面接", "最終面接", "内定"];
const storageKey = "waseNaviCompanies";

let companies = loadCompanies();

const state = {
  filter: "all",
  query: "",
  calendarEvents: []
};

const flowBody = document.querySelector("#flowBody");
const companyBody = document.querySelector("#companyBody");
const searchInput = document.querySelector("#searchInput");
const feedbackCompany = document.querySelector("#feedbackCompany");
const interviewCompany = document.querySelector("#interviewCompany");
const feedbackButton = document.querySelector("#feedbackButton");
const feedbackBox = document.querySelector("#feedbackBox");
const fitScore = document.querySelector("#fitScore");
const startInterview = document.querySelector("#startInterview");
const chatPanel = document.querySelector("#chatPanel");
const geminiKey = document.querySelector("#geminiKey");
const geminiStatus = document.querySelector("#geminiStatus");
const researchCompanyInput = document.querySelector("#researchCompanyInput");
const researchTarget = document.querySelector("#researchTarget");
const runResearchButton = document.querySelector("#runResearchButton");
const researchStatus = document.querySelector("#researchStatus");
const researchOutput = document.querySelector("#researchOutput");
const addCompanyButton = document.querySelector("#addCompanyButton");
const newCompanyName = document.querySelector("#newCompanyName");
const newCompanyIndustry = document.querySelector("#newCompanyIndustry");
const newCompanyPriority = document.querySelector("#newCompanyPriority");
const newCompanyNextLabel = document.querySelector("#newCompanyNextLabel");
const newCompanyDate = document.querySelector("#newCompanyDate");

function loadCompanies() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveCompanies() {
  localStorage.setItem(storageKey, JSON.stringify(companies));
}

function makeDate(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toLocalISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateText) {
  if (!dateText || dateText === "未定") return dateText || "-";
  const date = makeDate(dateText);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function daysUntil(dateText) {
  if (!dateText || dateText === "未定") return 999;
  const today = makeDate(toLocalISO(new Date()));
  const target = makeDate(dateText);
  return Math.ceil((target - today) / 86400000);
}

function priorityClass(priority) {
  if (priority === "本命") return "main";
  if (priority === "準本命") return "mid";
  return "practice";
}

function statusClass(status) {
  return {
    完了: "done",
    対応中: "current",
    予定: "waiting",
    要注意: "danger",
    未定: "blank"
  }[status] || "blank";
}

function blankStages(nextLabel, nextDate) {
  const stages = {};
  steps.forEach((step) => {
    stages[step] = { status: "未定", date: "", note: "" };
  });

  const matchingStep = steps.includes(nextLabel) ? nextLabel : nextLabel.includes("Web") ? "Webテスト" : nextLabel.includes("面接") ? nextLabel : "ES";
  if (stages[matchingStep]) {
    stages[matchingStep] = {
      status: nextDate ? "対応中" : "予定",
      date: nextDate || "",
      note: nextLabel
    };
  }
  return stages;
}

function renderProgressDots(company) {
  return `
    <span class="progress-dots" aria-label="進捗">
      ${steps.map((step) => {
        const klass = statusClass(company.stages[step]?.status);
        return `<span class="${klass === "blank" || klass === "waiting" ? "" : klass}"></span>`;
      }).join("")}
    </span>
  `;
}

function companyHasRisk(company) {
  return steps.some((step) => company.stages[step]?.status === "要注意") || daysUntil(company.next.date) <= 3;
}

function filteredCompanies() {
  return companies.filter((company) => {
    const matchesPriority = state.filter === "all" || company.priority === state.filter;
    const haystack = `${company.name} ${company.industry}`.toLowerCase();
    return matchesPriority && haystack.includes(state.query.toLowerCase());
  });
}

function emptyRow(colspan, text) {
  return `<tr><td colspan="${colspan}" class="empty-cell">${text}</td></tr>`;
}

function renderFlowMatrix() {
  const visible = filteredCompanies();
  flowBody.innerHTML = visible.length ? visible.map((company) => {
    const until = daysUntil(company.next.date);
    const rowClass = companyHasRisk(company) ? "risk-row" : "";
    const stepCells = steps.map((step) => {
      const stage = company.stages[step] || { status: "未定", date: "", note: "" };
      const klass = statusClass(stage.status);
      return `
        <td>
          <div class="stage-cell">
            <span class="status ${klass}">${stage.status}</span>
            <strong>${formatDate(stage.date)}</strong>
            <span class="cell-note">${stage.note || "-"}</span>
          </div>
        </td>
      `;
    }).join("");

    return `
      <tr class="${rowClass}">
        <td class="sticky-col">
          <span class="company-name">${company.name}</span>
          <span class="company-sub">${company.industry || "業界未入力"}</span>
          <span class="priority ${priorityClass(company.priority)}">${company.priority}</span>
          ${renderProgressDots(company)}
        </td>
        <td class="deadline-cell">
          <span class="date-strong">${formatDate(company.next.date)} ${company.next.time || ""}</span>
          <strong>${company.next.label}</strong>
          <span class="cell-note">${until === 999 ? "日付未定" : `あと${until}日`}</span>
        </td>
        ${stepCells}
        <td>
          <span class="cell-note">締切3日前</span>
          <span class="cell-note">面接前日</span>
          <span class="cell-note">Webテスト未完了</span>
        </td>
        <td>
          <strong>${company.share}</strong>
          <span class="cell-note">ES本文・結果・志望度・メモは非共有</span>
        </td>
        <td>
          <button class="danger-button" data-delete-company="${company.id}">削除</button>
        </td>
      </tr>
    `;
  }).join("") : emptyRow(10, "企業はまだありません。上のフォームから追加してください。");

  renderCommandBoard();
}

function renderCommandBoard() {
  const visible = filteredCompanies();
  const top = [...visible].filter((company) => company.next.date).sort((a, b) => a.next.date.localeCompare(b.next.date))[0];
  const risks = visible.filter(companyHasRisk).length;
  const weekEvents = visible.filter((company) => daysUntil(company.next.date) >= 0 && daysUntil(company.next.date) <= 7).length;

  document.querySelector("#topPriorityTitle").textContent = top ? `${top.name} ${top.next.label}` : "未登録";
  document.querySelector("#topPriorityMeta").textContent = top ? `${formatDate(top.next.date)} ${top.next.time || ""} ・ あと${daysUntil(top.next.date)}日` : "企業を追加してください";
  document.querySelector("#riskCount").textContent = `${risks}件`;
  document.querySelector("#weekCount").textContent = `${weekEvents}件`;
}

function renderCompanyTable() {
  companyBody.innerHTML = companies.length ? companies.map((company) => `
    <tr>
      <td class="sticky-col">
        <span class="company-name">${company.name}</span>
      </td>
      <td>${company.industry || "-"}</td>
      <td><span class="priority ${priorityClass(company.priority)}">${company.priority}</span></td>
      <td>${company.info.role}</td>
      <td>${company.info.salary}</td>
      <td>${company.info.location}</td>
      <td>${company.info.hiring}</td>
      <td><button class="danger-button" data-delete-company="${company.id}">削除</button></td>
    </tr>
  `).join("") : emptyRow(8, "企業情報はまだありません。選考フロー画面から企業を追加してください。");
}

function renderSelects() {
  const options = companies.map((company) => `<option value="${company.name}">${company.name}</option>`).join("");
  [feedbackCompany, interviewCompany].forEach((select) => {
    select.innerHTML = options || `<option value="">企業未登録</option>`;
  });
}

function renderAll() {
  renderFlowMatrix();
  renderCompanyTable();
  renderSelects();
  renderCalendar();
}

function addCompany() {
  const name = newCompanyName.value.trim();
  if (!name) {
    newCompanyName.focus();
    return;
  }

  const date = newCompanyDate.value;
  const company = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    name,
    industry: newCompanyIndustry.value.trim(),
    priority: newCompanyPriority.value,
    next: { label: newCompanyNextLabel.value, date, time: "" },
    stages: blankStages(newCompanyNextLabel.value, date),
    events: [],
    info: { salary: "-", location: "-", role: "-", hiring: "-" },
    share: "締切のみ",
    privateMemo: ""
  };

  companies = [company, ...companies];
  saveCompanies();
  newCompanyName.value = "";
  newCompanyIndustry.value = "";
  newCompanyDate.value = "";
  renderAll();
}

function deleteCompany(id) {
  companies = companies.filter((company) => company.id !== id);
  saveCompanies();
  renderAll();
}

function allEvents() {
  return state.calendarEvents.sort((a, b) => a.date.localeCompare(b.date));
}

function renderCalendar() {
  const calendarStrip = document.querySelector("#calendarStrip");
  const eventList = document.querySelector("#eventList");
  const base = makeDate(toLocalISO(new Date()));
  const labels = ["日", "月", "火", "水", "木", "金", "土"];
  calendarStrip.innerHTML = "";

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    const iso = toLocalISO(date);
    const day = document.createElement("button");
    day.className = `calendar-day${index === 0 ? " active" : ""}`;
    day.innerHTML = `<span>${labels[date.getDay()]}</span><strong>${date.getDate()}</strong>`;
    day.addEventListener("click", () => renderEventsForDate(iso));
    calendarStrip.appendChild(day);
  }

  function renderEventsForDate(date) {
    document.querySelectorAll(".calendar-day").forEach((day) => day.classList.remove("active"));
    const index = Math.max(0, Math.min(6, Math.round((makeDate(date) - base) / 86400000)));
    document.querySelectorAll(".calendar-day")[index]?.classList.add("active");
    const events = allEvents().filter((event) => event.date === date);
    eventList.innerHTML = events.length
      ? events.map((event) => `
        <div class="event-row">
          <span class="event-date">${formatDate(event.date)}<br>${event.type}</span>
          <span class="event-title">${event.title}<br><small>${event.company}</small></span>
        </div>
      `).join("")
      : `<div class="event-row"><span class="event-date">${formatDate(date)}</span><span class="event-title">予定なし<br><small>サンプル予定は表示しない設定です</small></span></div>`;
  }

  renderEventsForDate(toLocalISO(base));
}

function calculateFit(text, companyName) {
  const company = companies.find((item) => item.name === companyName);
  const consulting = company?.industry.includes("コンサル");
  const signals = ["課題", "改善", "分析", "仮説", "実行", "成果", "チーム", "数字", "リーダー", "顧客"];
  const hits = signals.filter((word) => text.includes(word)).length;
  const base = consulting ? 58 : 52;
  return Math.min(96, base + hits * 5);
}

function renderFeedback() {
  const text = document.querySelector("#essayInput").value;
  const companyName = feedbackCompany.value;
  const company = companies.find((item) => item.name === companyName);
  if (!company) {
    feedbackBox.innerHTML = `<p><strong>企業未登録:</strong> 先に選考フロー画面で企業を追加してください。</p>`;
    fitScore.textContent = "-";
    return;
  }

  const score = calculateFit(text, companyName);
  const hasNumber = /\d|一|二|三|四|五|六|七|八|九|十/.test(text);
  fitScore.textContent = score;
  feedbackBox.innerHTML = `
    <p><strong>企業との一致度:</strong> ${company.industry || "この企業"}で見られやすい「課題を見つけて動く力」は伝わっています。</p>
    <p><strong>直すと強い点:</strong> ${hasNumber ? "数字は入っています。" : "成果を数字で足すと強くなります。"} ${company.name}でどう活きるかを最後の1文に入れると一致度が上がります。</p>
    <p><strong>追加したい観点:</strong> 自分の役割、周囲を巻き込んだ方法、再現できる強み。</p>
  `;
}

function fallbackQuestion(company, mode) {
  if (mode === "ケース面接") {
    return `${company.name}のケース面接です。地方大学生向けの就活支援サービスの売上を2倍にするには、どの市場・顧客・施策から考えますか。まず前提確認から答えてください。`;
  }
  return `${company.name}の面接です。学生時代に力を入れた経験について、課題設定、あなたの役割、成果、入社後に活かせる強みに分けて話してください。`;
}

async function generateInterviewQuestion() {
  const key = geminiKey.value.trim();
  const companyName = interviewCompany.value;
  const mode = document.querySelector("#interviewMode").value;
  const company = companies.find((item) => item.name === companyName);
  if (!company) {
    chatPanel.innerHTML = `<p>先に選考フロー画面で企業を追加してください。</p>`;
    return;
  }

  const currentStep = steps.find((step) => ["対応中", "要注意"].includes(company.stages[step]?.status)) || "ES";
  chatPanel.innerHTML = `<p><strong>${companyName}</strong> / ${mode} / 現在の選考: ${currentStep}</p>`;

  if (!key) {
    geminiStatus.textContent = "未接続";
    geminiStatus.classList.remove("connected");
    chatPanel.innerHTML += `<p>${fallbackQuestion(company, mode)}</p>`;
    return;
  }

  geminiStatus.textContent = "接続中";
  const prompt = `あなたは日本の就活面接官です。企業名:${companyName}、業界:${company.industry}、選考段階:${currentStep}、モード:${mode}。大学3年生向けに、最初の質問を1つだけ日本語で出してください。ケース面接なら前提確認を促してください。`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackQuestion(company, mode);
    geminiStatus.textContent = "接続済み";
    geminiStatus.classList.add("connected");
    chatPanel.innerHTML += `<p>${text}</p>`;
  } catch (error) {
    geminiStatus.textContent = "未接続";
    geminiStatus.classList.remove("connected");
    chatPanel.innerHTML += `<p>${fallbackQuestion(company, mode)}</p>`;
  }
}

function shareDeadlines() {
  const text = companies
    .filter((company) => company.next.date)
    .map((company) => `${formatDate(company.next.date)} ${company.next.label}: ${company.name}`)
    .join("\n");
  navigator.clipboard?.writeText(text || "共有できる締切はまだありません。");
  document.querySelector("#shareDeadlines").setAttribute("aria-label", "締切をコピーしました");
}

function renderResearchSetup(reason) {
  researchStatus.textContent = reason;
  researchStatus.classList.remove("ready");
  researchOutput.innerHTML = `
    <div class="setup-box">
      <strong>自動調査を本当に動かすために必要なもの</strong>
      <p>検索APIキー、検索エンジンID、Gemini APIキーをサーバー側に設定してください。フロントに直接キーを置くと友人にも見えてしまうため危険です。</p>
      <p>このフォルダには、Vercelなどで使える <strong>api/research-company.js</strong> を追加しています。</p>
    </div>
  `;
}

function renderResearchResult(data) {
  const rows = (data.flow || []).map((item) => `
    <tr>
      <td>${item.stage || "-"}</td>
      <td>${item.summary || "-"}</td>
      <td>${item.sourceUrl ? `<a href="${item.sourceUrl}" target="_blank" rel="noreferrer">根拠を見る</a>` : "-"}</td>
    </tr>
  `).join("");

  researchStatus.textContent = `調査完了: ${data.company || researchCompanyInput.value}`;
  researchStatus.classList.add("ready");
  researchOutput.innerHTML = `
    <table class="result-table">
      <thead>
        <tr>
          <th>項目</th>
          <th>抽出結果</th>
          <th>根拠</th>
        </tr>
      </thead>
      <tbody>${rows || `<tr><td colspan="3">抽出結果がありません</td></tr>`}</tbody>
    </table>
  `;
}

async function runCompanyResearch() {
  const company = researchCompanyInput.value.trim();
  if (!company) {
    renderResearchSetup("企業名を入力してください");
    return;
  }

  if (location.protocol === "file:") {
    renderResearchSetup("ローカルファイル表示中のため、Web検索APIには接続できません");
    return;
  }

  researchStatus.textContent = "調査中...";
  researchStatus.classList.remove("ready");

  try {
    const response = await fetch("./api/research-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, target: researchTarget.value })
    });
    const data = await response.json();
    if (!response.ok) {
      renderResearchSetup(data.message || "自動調査APIが未設定です");
      return;
    }
    renderResearchResult(data);
  } catch (error) {
    renderResearchSetup("自動調査APIに接続できませんでした");
  }
}

function switchPanel(panelName) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
  document.querySelector(`[data-panel="${panelName}"]`)?.classList.add("active");
  document.querySelector(`#panel-${panelName}`)?.classList.add("active");
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => switchPanel(button.dataset.panel));
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segment").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderFlowMatrix();
  });
});

document.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-company]");
  if (deleteButton) {
    deleteCompany(deleteButton.dataset.deleteCompany);
  }
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderFlowMatrix();
});

addCompanyButton.addEventListener("click", addCompany);
feedbackButton.addEventListener("click", renderFeedback);
startInterview.addEventListener("click", generateInterviewQuestion);
runResearchButton.addEventListener("click", runCompanyResearch);
document.querySelector("#shareDeadlines").addEventListener("click", shareDeadlines);
document.querySelector("#researchButton").addEventListener("click", () => switchPanel("research"));
document.querySelector("#todayButton").addEventListener("click", renderCalendar);

renderAll();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js");
}
