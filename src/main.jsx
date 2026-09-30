import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  SandpackProvider,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { go } from "@codemirror/lang-go";
import { stages, lessons, lessonFiles } from "./catalog";
import "./style.css";
import Tips from "./tips.jsx";
import { translator } from "./i18n";

const languages = [
  { name: "Go", id: "go", detail: "net/http · 标准库" },
  { name: "Node.js", id: "node", detail: "node:http · JavaScript" },
];
const goLanguage = [{ name: "go", extensions: ["go"], language: go() }];
const theme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#edf2f5",
    surface3: "#dce5eb",
    clickable: "#566677",
    base: "#253c4f",
    disabled: "#a2adb6",
    hover: "#0d6882",
    accent: "#0d6882",
    error: "#a93036",
    errorSurface: "#fff1f1",
  },
  font: {
    body: "system-ui, sans-serif",
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    size: "13px",
    lineHeight: "22px",
  },
};
const sessionValues = new Map();
let storageFailed = false;
function load(key, fallback) {
  if (sessionValues.has(key)) return sessionValues.get(key);
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  // Keep working edits even when storage is disabled or full.
  sessionValues.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    storageFailed = true;
    window.dispatchEvent(new Event("nodejs-for-golang-developers:storage-error"));
  }
}

function Preview({ html, t }) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none';">`;
  const errors = `<script>function showError(text){const pre=document.createElement('pre');pre.textContent=text;pre.style.color='crimson';(document.body||document.documentElement).append(pre)};addEventListener('error',e=>showError(e.message));addEventListener('unhandledrejection',e=>showError(String(e.reason)));</script>`;
  return (
    <div className="preview">
      <h2>{t("页面预览")}</h2>
      {html ? (
        <iframe
          title={t("页面预览")}
          sandbox="allow-scripts"
          srcDoc={policy + errors + html}
        />
      ) : (
        <p>{t("先运行，再与页面交互。")}</p>
      )}
    </div>
  );
}

function Workbench({ lesson, language, onRun, token, needsToken, t }) {
  const { sandpack } = useSandpack();
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef(null);
  useEffect(() => () => pending.current?.abort(), []);
  const storageKey = `nodejs-for-golang-developers:files:${lesson.id}:${language.id}`;
  const restored = useRef(false);
  useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      const defaults = lessonFiles(lesson.id, language.id);
      const stored = load(storageKey, {});
      const files = Object.fromEntries(
        Object.entries(defaults).map(([name, file]) => [
          name,
          typeof stored?.[name]?.code === "string"
            ? { code: stored[name].code }
            : file,
        ]),
      );
      // Restore editor buffers after setup: invalid package.json must remain editable.
      sandpack.updateFile(files, undefined, false);
      return;
    }
    save(storageKey, sandpack.files);
  }, [storageKey, sandpack.files]);
  async function run() {
    onRun(lesson.id);
    setBusy(true);
    setResult(null);
    pending.current = new AbortController();
    try {
      const files = Object.fromEntries(
        Object.keys(lessonFiles(lesson.id, language.id)).map((name) => [
          name,
          sandpack.files[name].code,
        ]),
      );
      const response = await fetch("/api/run", {
        signal: pending.current.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          lesson: lesson.id,
          language: language.id,
          files,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setResult({ error: data.error, code: 1 });
        return;
      }
      setResult(data);
    } catch (error) {
      if (error.name !== "AbortError")
        setResult({ error: "请求失败，请检查连接后重试", code: 1 });
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className={`workbench ${language.id}`}
      aria-label={t("{name} 编辑与运行", { name: language.name })}
    >
      <header className="workbench-head">
        <div>
          <strong>{language.name}</strong>
          <span>{t(language.detail)}</span>
        </div>
        <button
          className="run"
          onClick={run}
          disabled={
            busy || typeof needsToken !== "boolean" || (needsToken && !token)
          }
        >
          {busy ? t("运行中…") : t("运行 {name}", { name: language.name })}
          <span aria-hidden="true"> ↗</span>
        </button>
      </header>
      <SandpackCodeEditor
        showRunButton={false}
        wrapContent
        showTabs
        showLineNumbers
        initMode="immediate"
        additionalLanguages={goLanguage}
        style={{ height: 410 }}
      />
      <div className="output">
        <div className="output-label">
          <span>{t("终端输出")}</span>
          <span>
            {busy
              ? t("运行中 · 最长 10 秒")
              : result
                ? `${t(result.reason || (result.code === 0 ? "完成" : "出错"))} ${result.duration ? `· ${result.duration} ms` : ""}`
                : t("等待运行")}
          </span>
        </div>
        <pre aria-live="polite">
          {busy ? (
            t("正在执行当前项目…")
          ) : result ? (
            <>
              {result.stdout}
              <span className="stderr">
                {result.stderr}
                {result.error && t(result.error)}
                {result.reason ? `\n${t(result.reason)}` : ""}
              </span>
              {!result.stdout &&
              !result.stderr &&
              !result.reason &&
              !result.error
                ? t("程序已结束，没有输出。")
                : ""}
            </>
          ) : (
            t("点击运行，观察这段代码会发生什么。")
          )}
        </pre>
      </div>
      {(language.id === "browser" || lesson.preview) && (
        <Preview html={result?.preview} t={t} />
      )}
    </section>
  );
}
function Editor(props) {
  // Setup identity is stable across progress, language and token changes.
  const [setup] = useState(() => {
    const files = lessonFiles(props.lesson.id, props.language.id);
    const entry =
      props.language.id === "go"
        ? "/main.go"
        : `/${props.language.id === "browser" ? props.lesson.entry : props.lesson.nodeEntry || "main.js"}`;
    return {
      files,
      customSetup: { environment: "static", entry },
      options: {
        activeFile: entry,
        visibleFiles: Object.keys(files).sort(
          (a, b) =>
            Number(b.startsWith("/main.")) - Number(a.startsWith("/main.")),
        ),
        autorun: false,
        autoReload: false,
      },
    };
  });
  return (
    <SandpackProvider {...setup} theme={theme}>
      <Workbench {...props} />
    </SandpackProvider>
  );
}
function App() {
  const [saveFailed, setSaveFailed] = useState(storageFailed);
  useEffect(() => {
    const notify = () => setSaveFailed(true);
    if (storageFailed) notify();
    window.addEventListener("nodejs-for-golang-developers:storage-error", notify);
    return () => window.removeEventListener("nodejs-for-golang-developers:storage-error", notify);
  }, []);
  const [locale, setLocale] = useState(() =>
    load("nodejs-for-golang-developers:locale", "zh") === "en" ? "en" : "zh",
  );
  const t = translator(locale);
  useEffect(() => {
    save("nodejs-for-golang-developers:locale", locale);
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    document.title = `Node.js for Golang Developers · ${t("从熟悉，到会用。")}`;
  }, [locale]);
  const [selected, setSelected] = useState(() =>
    load("nodejs-for-golang-developers:last", lessons[0].id),
  );
  const [done, setDone] = useState(() => {
    const value = load("nodejs-for-golang-developers:done", []);
    return Array.isArray(value)
      ? value.filter((id) => lessons.some((item) => item.id === id))
      : [];
  });
  const [resetVersion, setResetVersion] = useState(0);
  const [token, setToken] = useState("");
  const [needsToken, setNeedsToken] = useState(null);
  const [connectionError, setConnectionError] = useState("");
  const lesson = lessons.find((item) => item.id === selected) || lessons[0];
  const editors =
    lesson.mode === "browser"
      ? [
          {
            name: t("浏览器"),
            id: "browser",
            detail: "HTML / CSS / JavaScript",
          },
        ]
      : languages.map((item) =>
          item.id === "node" && lesson.nodeEntry
            ? { ...item, detail: "Node.js · TypeScript" }
            : item,
        );
  function progress(items) {
    const count = items.filter((item) => done.includes(item.id)).length;
    return `${count} / ${items.length} · ${items.length ? Math.round((count / items.length) * 100) : 0}%`;
  }
  const completed = lessons.filter((item) => done.includes(item.id)).length;
  const percent = Math.round((completed / lessons.length) * 100);
  useEffect(() => {
    fetch("/api/config")
      .then((r) => {
        if (!r.ok) throw Error("服务连接失败，请刷新重试");
        return r.json();
      })
      .then((data) => {
        if (typeof data.needsToken !== "boolean")
          throw Error("Invalid server configuration");
        setNeedsToken(data.needsToken);
      })
      .catch(() => setConnectionError("服务连接失败，请刷新重试"));
  }, []);
  function choose(id) {
    setSelected(id);
    save("nodejs-for-golang-developers:last", id);
  }
  function restart() {
    for (const language of editors) {
      save(`nodejs-for-golang-developers:files:${lesson.id}:${language.id}`, lessonFiles(lesson.id, language.id));
    }
    const next = done.filter((id) => id !== lesson.id);
    save("nodejs-for-golang-developers:done", next);
    setDone(next);
    setResetVersion((value) => value + 1);
  }
  function mark(id) {
    setDone((previous) => {
      const next = [...new Set([...previous, id])];
      save("nodejs-for-golang-developers:done", next);
      return next;
    });
  }
  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href="/">
          Node.js for Golang Developers
        </a>
        <p className="tagline">{t("从熟悉，到会用。")}</p>
        <div className="progress">
          <div>
            <span>{t("已开放子项进度")}</span>
            <strong>{percent}%</strong>
          </div>
          <progress
            max="100"
            value={percent}
            aria-label={t("已开放子项进度")}
          />
          <small>
            {t("已运行 {done} / {total} 个子项", {
              done: completed,
              total: lessons.length,
            })}
          </small>
        </div>
        <nav aria-label={t("学习阶段")}>
          {stages.map((stage, index) => (
            <details
              className={`stage ${stage.id === lesson.stage ? "active" : ""}`}
              key={stage.id}
              open={stage.id === lesson.stage}
            >
              <summary className="stage-title">
                <span className="stage-number">0{index + 1}</span>
                <strong>{t(stage.title)}</strong>
                {!lessons.some((l) => l.stage === stage.id) && (
                  <small>{t("待开放")}</small>
                )}
              </summary>
              <p>{t(stage.summary)}</p>
              {lessons.some((l) => l.stage === stage.id) && (
                <div className="stage-progress" aria-label={t("阶段进度")}>
                  {progress(lessons.filter((l) => l.stage === stage.id))}
                </div>
              )}
              <div className="stage-items">
                {lessons
                  .filter((item) => item.stage === stage.id)
                  .map((item) => (
                    <button
                      key={item.id}
                      className={`lesson-link ${lesson.id === item.id ? "selected" : ""}`}
                      onClick={() => choose(item.id)}
                      aria-current={lesson.id === item.id ? "page" : undefined}
                    >
                      <span>
                        {item.number} · {t(item.title)}
                      </span>
                      <span
                        aria-label={t(done.includes(item.id) ? "已学" : "未学")}
                      >
                        {done.includes(item.id) ? "✓" : "○"}
                      </span>
                    </button>
                  ))}
                {(stage.planned || []).map((title) => (
                  <div className="planned-item" key={title}>
                    <span>{t(title)}</span>
                    <small>{t("待开放")}</small>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </nav>
        <p className="sidebar-note">
          {t("点运行即计入进度。")}
          <br />
          {t("六阶段，循序渐进。")}
        </p>
      </aside>
      <main>
        <div className="topbar">
          <div className="breadcrumb">
            {t("学习手册")} <span>/</span>{" "}
            {t(stages.find((stage) => stage.id === lesson.stage).title)}{" "}
            <span>/</span> {lesson.number}
          </div>
          <select
            aria-label="语言 / Language"
            className="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
        <header className="page-head">
          <div>
            <p className="eyebrow">
              GO → NODE /{" "}
              {t(stages.find((stage) => stage.id === lesson.stage).title)}
            </p>
            <h1>{t(lesson.title)}</h1>
            <p>{t(lesson.description)}</p>
          </div>
          <button className="restart" onClick={restart} title={t("恢复本项默认代码、清空输出与进度")} >
            {t("重来")}
          </button>
        </header>
        <div className="observe">
          <strong>{t("观察什么")}</strong>
          <span>{t(lesson.observe)}</span>
        </div>
        {saveFailed && (
          <p role="status" className="error">
            {t("无法保存到此浏览器，当前编辑仅保留在本页，刷新后可能丢失。")}
          </p>
        )}
        {connectionError && (
          <p role="alert" className="error">
            {t(connectionError)}
          </p>
        )}
        {needsToken && (
          <label className="token">
            {t("远程访问令牌")}
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("输入启动服务时设置的令牌")}
              autoComplete="off"
            />
            <small>{t("仅保存在当前页面内存中")}</small>
          </label>
        )}
        <Tips lesson={lesson} locale={locale} />
        <div className={`editors ${lesson.mode === "browser" ? "single" : ""}`}>
          {editors.map((language) => (
            <Editor
              key={`${lesson.id}:${language.id}:${resetVersion}`}
              lesson={lesson}
              language={language}
              onRun={mark}
              token={token}
              needsToken={needsToken}
              t={t}
            />
          ))}
        </div>
        <div className="notes">
          <section>
            <h2>
              {t(lesson.mode === "browser" ? "关键概念" : "把两种写法连起来")}
            </h2>
            <ul>
              {lesson.differences.map((text) => (
                <li key={text}>{t(text)}</li>
              ))}
            </ul>
          </section>
          <section className="exercise">
            <span>{t("动手改一处")}</span>
            <p>{t(lesson.exercise)}</p>
            <small>{t("无需提交答案，运行后直接看结果。")}</small>
          </section>
        </div>
        <footer>
          {t(
            saveFailed
              ? "当前仅在本页保留代码与进度"
              : "代码与学习位置保存在此浏览器",
          )}{" "}
          <a
            href="https://github.com/miguelmota/golang-for-nodejs-developers"
            target="_blank"
            rel="noreferrer"
          >
            {t("对照学习灵感 ↗")}
          </a>
        </footer>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
