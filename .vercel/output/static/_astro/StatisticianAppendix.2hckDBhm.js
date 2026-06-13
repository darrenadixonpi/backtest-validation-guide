import{j as t,r as b}from"./vendor-react.Dyd0XSxC.js";import{A as h,H as y,N,b as j,R as k}from"./statistician.COtaXXmX.js";import{u as v}from"./useTabList.v3mEcVbp.js";import{c as n,M as f,a as $}from"./MathDisplay.BiHy4HST.js";import{t as S}from"./terms.DuusnnjV.js";function T({checked:r}){const d=Object.values(r).filter(Boolean).length;function p(){const l=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),c=new Map;for(const o of h)c.has(o.category)||c.set(o.category,[]),c.get(o.category).push(o);const m=[...c.entries()].map(([o,u])=>`
      <tr class="cat-row"><td colspan="3"><strong>${o}</strong></td></tr>
      ${u.map(s=>`
        <tr class="${r[s.id]?"done":""}">
          <td class="check-cell">${r[s.id]?"☑":"☐"}</td>
          <td class="assumption-cell">${s.assumption.replace(/\$([^$]+)\$/g,"<em>$1</em>")}</td>
          <td class="check-col">${s.howToCheck.replace(/\$([^$]+)\$/g,"<em>$1</em>")}</td>
        </tr>
      `).join("")}
    `).join(""),x=`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Backtest Validation Checklist</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; font-size: 11pt; color: #111; padding: 24px 32px; }
    h1 { font-size: 16pt; margin-bottom: 2px; }
    .meta { font-size: 9pt; color: #555; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 9pt; border-bottom: 2px solid #111; padding: 4px 6px; }
    td { padding: 5px 6px; vertical-align: top; font-size: 9.5pt; border-bottom: 1px solid #ddd; }
    .check-cell { width: 22px; font-size: 13pt; }
    .assumption-cell { width: 55%; }
    .check-col { color: #444; font-size: 9pt; }
    .cat-row td { background: #f5f5f5; font-size: 9pt; padding: 5px 6px 3px; border-top: 1px solid #bbb; }
    .done td { color: #555; }
    .done .check-cell { color: #2a7a2a; }
    .footer { margin-top: 20px; font-size: 8.5pt; color: #777; border-top: 1px solid #ccc; padding-top: 8px; }
    em { font-style: italic; font-family: 'Times New Roman', serif; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Backtest Validation Assumptions Checklist</h1>
  <p class="meta">Printed ${l} · ${d} / ${h.length} items documented · backtest-validation-guide.vercel.app</p>
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Assumption</th>
        <th>How to check</th>
      </tr>
    </thead>
    <tbody>${m}</tbody>
  </table>
  <div class="footer">
    Source: Backtest Validation Guide · Lopez de Prado; Bailey et al.; White; Hansen; Künsch; Lo (2002)
  </div>
</body>
</html>`,e=window.open("","_blank","width=800,height=900");e&&(e.document.write(x),e.document.close(),e.focus(),setTimeout(()=>e.print(),300))}return t.jsx("button",{type:"button",className:"print-checklist-btn",onClick:p,children:"⎙ Print checklist"})}const w=["hypotheses","assumptions","limits","panel"];function z({onSelectTerm:r,checked:d,onChecked:p}){const[l,c]=b.useState("hypotheses"),{listRef:m,getTabProps:x,getPanelProps:e}=v(w,l,c),o=b.useMemo(()=>{const s=new Map;for(const a of h){const i=s.get(a.category)??[];i.push(a),s.set(a.category,i)}return[...s.entries()]},[]),u=Object.values(d).filter(Boolean).length;return t.jsxs("section",{className:"panel stats-panel",children:[t.jsxs("div",{className:"panel-head",children:[t.jsx("h2",{children:"Statistical appendix"}),t.jsx("p",{className:"muted",children:"Formal estimands, hypotheses, assumptions, and limits of inference — for serious validation work and model-review documentation."})]}),t.jsx("div",{className:"sub-tabs",role:"tablist","aria-label":"Statistics sections",ref:m,children:[["hypotheses","Hypothesis tests"],["assumptions","Assumptions checklist"],["limits","What this does NOT prove"],["panel","Panel / factor methods"]].map(([s,a])=>t.jsx("button",{type:"button",className:l===s?"sub-tab active":"sub-tab",onClick:()=>c(s),...x(s),children:a},s))}),l==="hypotheses"&&t.jsx("div",{...e("hypotheses"),children:t.jsx("div",{className:"table-wrap",children:t.jsxs("table",{className:"stats-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:"Method"}),t.jsxs("th",{children:["Null hypothesis ",t.jsx(n,{text:"$H_0$"})]}),t.jsx("th",{children:"Test statistic"}),t.jsx("th",{children:"Bootstrap / null mechanism"}),t.jsx("th",{children:"If rejected / significant, means…"})]})}),t.jsx("tbody",{children:y.map(s=>t.jsxs("tr",{children:[t.jsx("td",{children:s.relatedTermId?t.jsx("button",{type:"button",className:"linkish",onClick:()=>r(s.relatedTermId),children:s.method}):s.method}),t.jsx("td",{children:t.jsx(n,{text:s.nullHypothesis})}),t.jsx("td",{children:t.jsx(n,{text:s.statistic})}),t.jsx("td",{children:t.jsx(n,{text:s.bootstrapOrNull})}),t.jsx("td",{children:t.jsx(n,{text:s.rejectionMeans})})]},s.method))})]})})}),l==="assumptions"&&t.jsxs("div",{...e("assumptions"),children:[t.jsxs("div",{className:"assumption-progress",children:[t.jsxs("span",{children:["Documented checks: ",t.jsx("strong",{children:u})," / ",h.length]}),t.jsx(T,{checked:d})]}),o.map(([s,a])=>t.jsxs("div",{className:"assumption-group",children:[t.jsx("h3",{children:s}),t.jsx("ul",{className:"assumption-list",children:a.map(i=>t.jsx("li",{children:t.jsxs("label",{children:[t.jsx("input",{type:"checkbox",checked:!!d[i.id],onChange:g=>p({...d,[i.id]:g.target.checked})}),t.jsxs("span",{className:"assumption-text",children:[t.jsx("strong",{children:t.jsx(n,{text:i.assumption})}),t.jsx("span",{className:"muted",children:t.jsx(n,{text:i.whyItMatters})}),t.jsxs("span",{className:"check-hint",children:["Check: ",t.jsx(n,{text:i.howToCheck})]})]})]})},i.id))})]},s))]}),l==="limits"&&t.jsx("div",{...e("limits"),children:t.jsx("ul",{className:"limits-list",children:N.map(s=>t.jsxs("li",{children:[t.jsx("strong",{children:t.jsx(n,{text:s.claim})}),t.jsx(f,{text:s.why})]},s.claim))})}),l==="panel"&&t.jsxs("div",{...e("panel"),className:"panel-stats",children:[t.jsx("p",{className:"muted",children:j.title}),j.blocks.map(s=>t.jsxs("article",{className:"panel-stat-block",children:[t.jsx("h3",{children:s.heading}),t.jsx($,{compact:!0,lines:s.latex})]},s.heading)),t.jsx("h3",{children:"Notes"}),t.jsx("ul",{children:j.notes.map(s=>t.jsx("li",{children:t.jsx(f,{text:s,className:"math-note panel-stat-note"})},s))}),t.jsxs("div",{className:"related",children:[t.jsx("span",{className:"muted",children:"Glossary:"}),["factor-model","monte-carlo-simulation","purged-cv"].map(s=>{const a=S(s);return a?t.jsx("button",{type:"button",className:"chip",onClick:()=>r(s),children:a.name},s):null})]})]}),t.jsxs("footer",{className:"stats-references",children:[t.jsx("h3",{children:"Extended references"}),t.jsx("ul",{children:k.map(s=>t.jsx("li",{children:s},s))})]})]})}export{z as StatisticianAppendix};
