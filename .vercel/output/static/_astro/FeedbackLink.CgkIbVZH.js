import{r as u,j as t}from"./vendor-react.Dyd0XSxC.js";const p="darrenadixonpi/backtest-validation-guide";function k({section:o,detail:r,termName:e,termId:n}){const i=`[Suggestion] ${o}${e?`: ${e}`:""}`,a=["## Section",o,r?`
## Page context
${r}`:"",e?`
## Term / topic
${e}${n?` (\`${n}\`)`:""}`:"",`
## Suggestion`,"_Describe what should change — definition, formula, tool recommendation, missing content, etc._",`
---`,"_Submitted from the [Backtest Validation Guide](https://backtest-validation-guide.vercel.app/)._"].filter(Boolean).join(`
`),s=new URLSearchParams({title:i,body:a});return`https://github.com/${p}/issues/new?${s.toString()}`}function j({className:o="feedback-link",label:r="Suggest an edit",...e}){const[n,i]=u.useState("idle"),[a,s]=u.useState(""),[b,m]=u.useState(""),l=k(e);async function f(){if(!a.trim())return;i("submitting");const d=`[Suggestion] ${e.section}${e.termName?`: ${e.termName}`:""}`,g=["## Section",e.section,e.detail?`
## Page context
${e.detail}`:"",e.termName?`
## Term / topic
${e.termName}${e.termId?` (\`${e.termId}\`)`:""}`:"",`
## Suggestion`,a.trim(),`
---`,"_Submitted from the [Backtest Validation Guide](https://backtest-validation-guide.vercel.app/)._"].filter(Boolean).join(`
`);try{const c=await fetch("/api/feedback",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:d,body:g})});if(c.status===503){window.open(l,"_blank","noopener"),i("idle"),s("");return}if(!c.ok)throw new Error(await c.text());const{url:h}=await c.json();m(h),i("done"),s("")}catch{i("error")}}return n==="done"?t.jsxs("span",{className:"feedback-done",children:["✓ Thanks — ",t.jsx("a",{href:b,target:"_blank",rel:"noopener noreferrer",children:"view issue"})," · ",t.jsx("button",{type:"button",className:"feedback-reset",onClick:()=>i("idle"),children:"close"})]}):n==="idle"?t.jsx("button",{type:"button",className:o,onClick:()=>i("open"),children:r}):t.jsxs("div",{className:"feedback-form",children:[t.jsx("textarea",{className:"feedback-textarea",placeholder:"Describe what should change — definition, formula, tool, missing content…",value:a,onChange:d=>s(d.target.value),rows:3,autoFocus:!0,disabled:n==="submitting"}),t.jsxs("div",{className:"feedback-actions",children:[t.jsx("button",{type:"button",className:"feedback-submit",disabled:n==="submitting"||!a.trim(),onClick:f,children:n==="submitting"?"Sending…":"Submit"}),t.jsx("button",{type:"button",className:"feedback-cancel",onClick:()=>{i("idle"),s("")},disabled:n==="submitting",children:"Cancel"}),n==="error"&&t.jsxs("span",{className:"feedback-error",children:["Failed — ",t.jsx("a",{href:l,target:"_blank",rel:"noopener noreferrer",children:"use GitHub"})]}),t.jsx("a",{className:"feedback-github",href:l,target:"_blank",rel:"noopener noreferrer",children:"Open in GitHub instead"})]})]})}export{j as FeedbackLink};
