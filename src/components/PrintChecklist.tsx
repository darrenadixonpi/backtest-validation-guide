import { ASSUMPTIONS } from '../data/statistician';

type Props = {
  checked: Record<string, boolean>;
};

export function PrintChecklistButton({ checked }: Props) {
  const checkedCount = Object.values(checked).filter(Boolean).length;

  function handlePrint() {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    // Group assumptions by category
    const groups = new Map<string, typeof ASSUMPTIONS>();
    for (const a of ASSUMPTIONS) {
      if (!groups.has(a.category)) groups.set(a.category, []);
      groups.get(a.category)!.push(a);
    }

    const rows = [...groups.entries()].map(([cat, items]) => `
      <tr class="cat-row"><td colspan="3"><strong>${cat}</strong></td></tr>
      ${items.map(a => `
        <tr class="${checked[a.id] ? 'done' : ''}">
          <td class="check-cell">${checked[a.id] ? '☑' : '☐'}</td>
          <td class="assumption-cell">${a.assumption.replace(/\$([^$]+)\$/g, '<em>$1</em>')}</td>
          <td class="check-col">${a.howToCheck.replace(/\$([^$]+)\$/g, '<em>$1</em>')}</td>
        </tr>
      `).join('')}
    `).join('');

    const html = `<!doctype html>
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
  <p class="meta">Printed ${date} · ${checkedCount} / ${ASSUMPTIONS.length} items documented · backtest-validation-guide.vercel.app</p>
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Assumption</th>
        <th>How to check</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    Source: Backtest Validation Guide · Lopez de Prado; Bailey et al.; White; Hansen; Künsch; Lo (2002)
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  return (
    <button type="button" className="print-checklist-btn" onClick={handlePrint}>
      ⎙ Print checklist
    </button>
  );
}
