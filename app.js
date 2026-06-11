const steps = ["ES", "Webテスト", "1次面接", "最終面接", "内定"];

const companies = [
  {
    name: "アクセンチュア",
    industry: "外資コンサル",
    priority: "本命",
    next: { label: "ES締切", date: "2026-06-14", time: "23:59" },
    stages: {
      ES: { status: "対応中", date: "2026-06-14", note: "提出前" },
      Webテスト: { status: "予定", date: "2026-06-17", note: "締切3日前通知" },
      "1次面接": { status: "未定", date: "", note: "ES通過後" },
      最終面接: { status: "未定", date: "", note: "" },
      内定: { status: "未定", date: "", note: "" }
    },
    events: [
      { type: "ES締切", date: "2026-06-14", title: "アクセンチュア ES締切" },
      { type: "Webテスト期限", date: "2026-06-17", title: "アクセンチュア Webテスト" },
      { type: "合否予定日", date: "2026-06-21", title: "ES結果予定" }
    ],
    info: { salary: "初任給目安 430万円前後", location: "東京・関西ほか", role: "ビジネスコンサルタント", hiring: "大規模採用" },
    share: "締切のみ",
    privateMemo: "ケース対策を厚めにする"
  },
  {
    name: "デロイト トーマツ コンサルティング",
    industry: "外資コンサル",
    priority: "本命",
    next: { label: "Webテスト期限", date: "2026-06-15", time: "12:00" },
    stages: {
      ES: { status: "完了", date: "2026-06-10", note: "提出済" },
      Webテスト: { status: "要注意", date: "2026-06-15", note: "未完了" },
      "1次面接": { status: "予定", date: "2026-06-24", note: "オンライン" },
      最終面接: { status: "未定", date: "", note: "" },
      内定: { status: "未定", date: "", note: "" }
    },
    events: [
      { type: "Webテスト期限", date: "2026-06-15", title: "DTC Webテスト期限" },
      { type: "1次面接", date: "2026-06-24", title: "DTC 1次面接" }
    ],
    info: { salary: "初任給目安 430万円前後", location: "東京中心", role: "経営コンサルタント", hiring: "採用人数非公開" },
    share: "締切のみ",
    privateMemo: "Webテスト未完了"
  },
  {
    name: "三菱商事",
    industry: "総合商社",
    priority: "準本命",
    next: { label: "1次面接", date: "2026-06-18", time: "10:30" },
    stages: {
      ES: { status: "完了", date: "2026-06-03", note: "通過" },
      Webテスト: { status: "完了", date: "2026-06-07", note: "通過" },
      "1次面接": { status: "対応中", date: "2026-06-18", note: "対面" },
      最終面接: { status: "予定", date: "未定", note: "1次通過後" },
      内定: { status: "未定", date: "", note: "" }
    },
    events: [
      { type: "1次面接", date: "2026-06-18", title: "三菱商事 1次面接" },
      { type: "合否予定日", date: "2026-06-23", title: "面接結果予定" }
    ],
    info: { salary: "総合職水準", location: "国内・海外", role: "総合職", hiring: "年度により変動" },
    share: "締切のみ",
    privateMemo: "海外事業と志望動機を結びつける"
  },
  {
    name: "楽天グループ",
    industry: "IT・メガベンチャー",
    priority: "練習",
    next: { label: "説明会", date: "2026-06-16", time: "18:00" },
    stages: {
      ES: { status: "予定", date: "2026-06-20", note: "未着手" },
      Webテスト: { status: "未定", date: "", note: "" },
      "1次面接": { status: "未定", date: "", note: "" },
      最終面接: { status: "未定", date: "", note: "" },
      内定: { status: "未定", date: "", note: "" }
    },
    events: [
      { type: "説明会", date: "2026-06-16", title: "楽天 説明会" },
      { type: "ES締切", date: "2026-06-20", title: "楽天 ES締切" }
    ],
    info: { salary: "職種別", location: "東京ほか", role: "ビジネス総合職", hiring: "大規模採用" },
    share: "締切のみ",
    privateMemo: "英語経験の具体例を入れる"
  },
  {
    name: "PwCコンサルティング",
    industry: "外資コンサル",
    priority: "準本命",
    next: { label: "最終面接", date: "2026-06-19", time: "14:00" },
    stages: {
      ES: { status: "完了", date: "2026-05-25", note: "通過" },
      Webテスト: { status: "完了", date: "2026-05-31", note: "通過" },
      "1次面接": { status: "完了", date: "2026-06-09", note: "通過" },
      最終面接: { status: "対応中", date: "2026-06-19", note: "14:00" },
      内定: { status: "未定", date: "", note: "" }
    },
    events: [
      { type: "最終面接", date: "2026-06-19", title: "PwC 最終面接" },
      { type: "合否予定日", date: "2026-06-26", title: "最終結果予定" }
    ],
    info: { salary: "初任給目安 400万円台", location: "東京・大阪ほか", role: "コンサルタント", hiring: "採用人数非公開" },
    share: "締切のみ",
    privateMemo: "カルチャーフィットを確認"
  }
];

const state = {
  filter: "all",
  query: ""
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
  const today = makeDate("2026-06-12");
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

function renderProgressDots(company) {
  return `
    <span class="progress-dots" aria-label="進捗">
      ${steps.map((step) => {
        const klass = statusClass(company.stages[step].status);
        return `<span class="${klass === "blank" || klass === "waiting" ? "" : klass}"></span>`;
      }).join("")}
    </span>
  `;
}

function companyHasRisk(company) {
  return steps.some((step) => company.stages[step].status === "要注意") || daysUntil(company.next.date) <= 3;
}

function filteredCompanies() {
  return companies.filter((company) => {
    const matchesPriority = state.filter === "all" || company.priority === state.filter;
    const haystack = `${company.name} ${company.industry}`.toLowerCase();
    return matchesPriority && haystack.includes(state.query.toLowerCase());
  });
}

function renderFlowMatrix() {
  flowBody.innerHTML = filteredCompanies().map((company) => {
    const until = daysUntil(company.next.date);
    const rowClass = companyHasRisk(company) ? "risk-row" : "";
    const stepCells = steps.map((step) => {
      const stage = company.stages[step];
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
          <span class="company-sub">${company.industry}</span>
          <span class="priority ${priorityClass(company.priority)}">${company.priority}</span>
          ${renderProgressDots(company)}
        </td>
        <td class="deadline-cell">
          <span class="date-strong">${formatDate(company.next.date)} ${company.next.time}</span>
          <strong>${company.next.label}</strong>
          <span class="cell-note">あと${until}日</span>
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
      </tr>
    `;
  }).join("");
  renderCommandBoard();
}

function renderCommandBoard() {
  const visible = filteredCompanies();
  const top = [...visible].sort((a, b) => a.next.date.localeCompare(b.next.date))[0];
  const risks = visible.filter(companyHasRisk).length;
  const weekEvents = allEvents().filter((event) => daysUntil(event.date) >= 0 && daysUntil(event.date) <= 7).length;

  document.querySelector("#topPriorityTitle").textContent = top ? `${top.name} ${top.next.label}` : "-";
  document.querySelector("#topPriorityMeta").textContent = top ? `${formatDate(top.next.date)} ${top.next.time} ・ あと${daysUntil(top.next.date)}日` : "-";
  document.querySelector("#riskCount").textContent = `${risks}件`;
  document.querySelector("#weekCount").textContent = `${weekEvents}件`;
}

function renderCompanyTable() {
  companyBody.innerHTML = companies.map((company) => `
    <tr>
      <td class="sticky-col">
        <span class="company-name">${company.name}</span>
      </td>
      <td>${company.industry}</td>
      <td><span class="priority ${priorityClass(company.priority)}">${company.priority}</span></td>
      <td>${company.info.role}</td>
      <td>${company.info.salary}</td>
      <td>${company.info.location}</td>
      <td>${company.info.hiring}</td>
    </tr>
  `).join("");
}

function renderSelects() {
  [feedbackCompany, interviewCompany].forEach((select) => {
    select.innerHTML = companies.map((company) => `<option value="${company.name}">${company.name}</option>`).join("");
  });
}

function allEvents() {
  return companies.flatMap((company) =>
    company.events.map((event) => ({ ...event, company: company.name }))
  ).sort((a, b) => a.date.localeCompare(b.date));
}

function renderCalendar() {
  const calendarStrip = document.querySelector("#calendarStrip");
  const eventList = document.querySelector("#eventList");
  const base = makeDate("2026-06-12");
  const labels = ["金", "土", "日", "月", "火", "水", "木"];
  calendarStrip.innerHTML = "";

  labels.forEach((label, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    const iso = toLocalISO(date);
    const day = document.createElement("button");
    day.className = `calendar-day${index === 2 ? " active" : ""}`;
    day.innerHTML = `<span>${label}</span><strong>${date.getDate()}</strong>`;
    day.addEventListener("click", () => renderEventsForDate(iso));
    calendarStrip.appendChild(day);
  });

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
      : `<div class="event-row"><span class="event-date">${formatDate(date)}</span><span class="event-title">予定なし</span></div>`;
  }

  renderEventsForDate("2026-06-14");
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
  const score = calculateFit(text, companyName);
  const company = companies.find((item) => item.name === companyName);
  const hasNumber = /\d|一|二|三|四|五|六|七|八|九|十/.test(text);
  fitScore.textContent = score;
  feedbackBox.innerHTML = `
    <p><strong>企業との一致度:</strong> ${company.industry}で見られやすい「課題を見つけて動く力」は伝わっています。</p>
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
  const currentStep = steps.find((step) => ["対応中", "要注意"].includes(company.stages[step].status)) || "ES";
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
  const text = allEvents()
    .filter((event) => ["ES締切", "Webテスト期限", "1次面接", "最終面接"].includes(event.type))
    .map((event) => `${formatDate(event.date)} ${event.type}: ${event.company}`)
    .join("\n");
  navigator.clipboard?.writeText(text);
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

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderFlowMatrix();
});

feedbackButton.addEventListener("click", renderFeedback);
startInterview.addEventListener("click", generateInterviewQuestion);
runResearchButton.addEventListener("click", runCompanyResearch);
document.querySelector("#shareDeadlines").addEventListener("click", shareDeadlines);
document.querySelector("#researchButton").addEventListener("click", () => {
  switchPanel("research");
});
document.querySelector("#todayButton").addEventListener("click", renderCalendar);

renderSelects();
renderFlowMatrix();
renderCompanyTable();
renderCalendar();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js");
}
