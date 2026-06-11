module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ message: "POST only" });
    return;
  }

  const { company, target } = request.body || {};
  const searchKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchCx = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!company) {
    response.status(400).json({ message: "企業名が必要です。" });
    return;
  }

  if (!searchKey || !searchCx || !geminiKey) {
    response.status(501).json({
      message: "自動調査には GOOGLE_SEARCH_API_KEY、GOOGLE_SEARCH_ENGINE_ID、GEMINI_API_KEY が必要です。"
    });
    return;
  }

  try {
    const sources = await searchCompanyPages({
      company,
      target: target || "新卒採用 選考フロー ES Webテスト 面接 締切",
      searchKey,
      searchCx
    });

    const extracted = await extractSelectionFlow({ company, sources, geminiKey });

    response.status(200).json({
      company: extracted.company || company,
      flow: Array.isArray(extracted.flow) ? extracted.flow : [],
      sources
    });
  } catch (error) {
    response.status(500).json({
      message: "自動調査に失敗しました。",
      detail: error.message
    });
  }
};

async function searchCompanyPages({ company, target, searchKey, searchCx }) {
  const query = `${company} ${target}`;
  const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");

  searchUrl.searchParams.set("key", searchKey);
  searchUrl.searchParams.set("cx", searchCx);
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("num", "6");
  searchUrl.searchParams.set("lr", "lang_ja");

  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  if (!searchResponse.ok) {
    throw new Error(searchData.error?.message || "Google検索に失敗しました。");
  }

  return (searchData.items || []).map((item) => ({
    title: item.title,
    url: item.link,
    snippet: item.snippet
  }));
}

async function extractSelectionFlow({ company, sources, geminiKey }) {
  const prompt = `
あなたは日本の就活情報を整理するアシスタントです。
以下の検索結果だけを根拠に、企業の選考フローをJSONで返してください。
根拠が弱い場合は summary に「要確認」と入れてください。

企業: ${company}

検索結果:
${sources.map((source, index) => `${index + 1}. ${source.title}
URL: ${source.url}
${source.snippet}`).join("\n\n")}

返すJSON:
{
  "company": "企業名",
  "flow": [
    {"stage": "ES", "summary": "締切や内容", "sourceUrl": "根拠URL"},
    {"stage": "Webテスト", "summary": "期限や形式", "sourceUrl": "根拠URL"},
    {"stage": "面接", "summary": "回数や形式", "sourceUrl": "根拠URL"},
    {"stage": "最終面接", "summary": "内容", "sourceUrl": "根拠URL"},
    {"stage": "内定", "summary": "時期", "sourceUrl": "根拠URL"}
  ]
}
`;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  const geminiData = await geminiResponse.json();

  if (!geminiResponse.ok) {
    throw new Error(geminiData.error?.message || "Geminiでの抽出に失敗しました。");
  }

  const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  try {
    return JSON.parse(rawText);
  } catch (error) {
    throw new Error("Geminiの出力をJSONとして読めませんでした。");
  }
}
