import { MathBlock, MathNote } from './MathDisplay';
import {
  CV_BIAS,
  ESTIMAND_BLOCKS,
  PREQUENTIAL,
  PURGE_FORMAL,
  SHARPE_INFERENCE,
} from '../data/statistician';

export function MathFramework() {
  return (
    <section className="panel math-panel">
      <div className="panel-head">
        <h2>Unified mathematical framework</h2>
        <p className="muted">
          Core notation plus estimands, Sharpe inference, and formal purge rules. See Statistics tab for
          hypotheses, assumptions, and panel methods.
        </p>
      </div>

      <div className="math-blocks">
        <article className="math-block-highlight">
          <h3>{ESTIMAND_BLOCKS.fixedTheta.title}</h3>
          <MathNote text={ESTIMAND_BLOCKS.fixedTheta.description} />
          <MathBlock compact lines={ESTIMAND_BLOCKS.fixedTheta.latex} />
        </article>

        <article className="math-block-highlight">
          <h3>{ESTIMAND_BLOCKS.policy.title}</h3>
          <MathNote text={ESTIMAND_BLOCKS.policy.description} />
          <MathBlock compact lines={ESTIMAND_BLOCKS.policy.latex} />
        </article>

        <article>
          <h3>{ESTIMAND_BLOCKS.excessReturn.title}</h3>
          <MathNote text={ESTIMAND_BLOCKS.excessReturn.description} />
          <MathBlock compact lines={ESTIMAND_BLOCKS.excessReturn.latex} />
        </article>

        <article>
          <h3>Strategy accounting</h3>
          <MathBlock compact
            lines={[
              's_t(\\theta) = w_{t-1}(\\theta) r_t - c_t',
              '\\hat{\\theta} = \\arg\\max_{\\theta \\in \\Theta} Score(\\theta; T_{\\text{train}})',
            ]}
          />
        </article>

        <article>
          <h3>Leakage condition (labels)</h3>
          <MathBlock compact
            lines={[
              'y_t = h(r_{t+1}, \\ldots, r_{t+H})',
              '\\text{Leak if } \\exists t \\in T_{\\text{train}}, \\tau \\in T_{\\text{test}} : t < \\tau \\leq t+H',
            ]}
          />
        </article>

        <article>
          <h3>{PURGE_FORMAL.title}</h3>
          <MathBlock compact lines={PURGE_FORMAL.latex} />
          <MathNote text={PURGE_FORMAL.note} />
        </article>

        <article>
          <h3>Walk-forward & prequential view</h3>
          <MathBlock compact
            lines={[
              '\\hat{\\theta}_k \\text{ fit on } T_k ; \\text{ evaluate on } V_k, \\quad \\max(T_k) < \\min(V_k)',
              'T_k = \\{b_k - L + 1,\\ldots,b_k\\} \\text{ (rolling)} ; \\quad T_k = \\{1,\\ldots,b_k\\} \\text{ (expanding)}',
              ...PREQUENTIAL.latex,
            ]}
          />
          <MathNote text={PREQUENTIAL.note} />
        </article>

        <article>
          <h3>Bias decomposition</h3>
          <MathBlock compact
            lines={[
              '\\widehat{SR}_{IS}(\\hat{\\theta}) - SR^*(\\hat{\\theta}) =',
              '[\\widehat{SR}_{IS} - \\widehat{SR}_{OOS}] + [\\widehat{SR}_{OOS} - SR^*]',
            ]}
          />
          <MathNote text="Left: leakage / overfit / selection. Right: finite-sample estimation error." />
        </article>

        <article>
          <h3>{CV_BIAS.title}</h3>
          <MathBlock compact lines={CV_BIAS.latex} />
          <MathNote text={CV_BIAS.note} />
        </article>

        <article>
          <h3>{SHARPE_INFERENCE.lo.title}</h3>
          <MathBlock compact lines={SHARPE_INFERENCE.lo.latex} />
          <MathNote text={SHARPE_INFERENCE.lo.note} />
        </article>

        <article>
          <h3>{SHARPE_INFERENCE.nonNormal.title}</h3>
          <MathBlock compact lines={SHARPE_INFERENCE.nonNormal.latex} />
          <MathNote text={SHARPE_INFERENCE.nonNormal.note} />
        </article>

        <article>
          <h3>{SHARPE_INFERENCE.dsr.title}</h3>
          <MathBlock compact lines={SHARPE_INFERENCE.dsr.latex} />
          <MathNote text={SHARPE_INFERENCE.dsr.note} />
        </article>

        <article>
          <h3>Multiplicity (summary)</h3>
          <MathBlock compact
            lines={[
              'PBO = \\frac{1}{|S|}\\sum_{s\\in S} \\mathbf{1}\\{\\operatorname{rank}_{\\mathrm{OOS}}(\\text{IS-best}) > \\lfloor |\\Theta|/2 \\rfloor\\}',
              'T_M = \\max_m \\sqrt{T}\\,\\bar{d}_m \\quad \\text{(Reality Check / SPA family)}',
            ]}
          />
        </article>
      </div>
    </section>
  );
}
