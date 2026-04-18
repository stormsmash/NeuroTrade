export type OrderStyle = "market" | "smart_limit" | "passive_iceberg";
export type RiskMode = "defensive" | "balanced" | "aggressive";

export type ScenarioParams = {
  delayMs: number;
  spreadMultiplier: number;
  orderStyle: OrderStyle;
  riskMode: RiskMode;
};

type EventInput = {
  id: string;
  name: string;
  alphaBps: number;
  volatility: number;
  liquidity: number;
  spreadBps: number;
  notional: number;
};

type EventOutput = EventInput & {
  fillProbability: number;
  delayPenaltyBps: number;
  spreadCostBps: number;
  liquidityDragBps: number;
  edgeBps: number;
  pnl: number;
};

type SimulationMetrics = {
  pnl: number;
  winRate: number;
  maxDrawdown: number;
  expectedShortfall: number;
  fillRate: number;
  profitFactor: number;
  executionRegret: number;
};

type SimulationResult = {
  params: ScenarioParams;
  metrics: SimulationMetrics;
  events: EventOutput[];
};

type FlipState = "unchanged" | "flipped_to_loss" | "flipped_to_win";

export type CounterfactualRow = {
  id: string;
  name: string;
  baselinePnl: number;
  scenarioPnl: number;
  deltaPnl: number;
  flipState: FlipState;
};

export type SensitivityPoint = {
  delayMs: number;
  orderStyle: OrderStyle;
  deltaPnl: number;
};

export type CounterfactualReport = {
  baseline: SimulationResult;
  scenario: SimulationResult;
  delta: {
    pnl: number;
    winRate: number;
    maxDrawdown: number;
    expectedShortfall: number;
    executionRegret: number;
  };
  rows: CounterfactualRow[];
  sensitivity: SensitivityPoint[];
};

export const BASELINE_PARAMS: ScenarioParams = {
  delayMs: 45,
  spreadMultiplier: 1,
  orderStyle: "smart_limit",
  riskMode: "balanced",
};

const ORDER_STYLE_CONFIG: Record<
  OrderStyle,
  { baseFill: number; slippage: number; impact: number }
> = {
  market: { baseFill: 0.97, slippage: 1.34, impact: 1.12 },
  smart_limit: { baseFill: 0.86, slippage: 0.84, impact: 0.74 },
  passive_iceberg: { baseFill: 0.67, slippage: 0.52, impact: 0.48 },
};

const RISK_CONFIG: Record<RiskMode, { leverage: number; drawdownAmp: number }> = {
  defensive: { leverage: 0.76, drawdownAmp: 0.82 },
  balanced: { leverage: 1, drawdownAmp: 1 },
  aggressive: { leverage: 1.24, drawdownAmp: 1.31 },
};

const MARKET_TAPE: EventInput[] = [
  {
    id: "open-impulse",
    name: "Open impulse breakout",
    alphaBps: 12.7,
    volatility: 0.71,
    liquidity: 0.62,
    spreadBps: 2.4,
    notional: 180000,
  },
  {
    id: "liq-fade",
    name: "Liquidity fade rebound",
    alphaBps: 8.6,
    volatility: 0.53,
    liquidity: 0.74,
    spreadBps: 1.8,
    notional: 160000,
  },
  {
    id: "news-shock",
    name: "Macro news shock",
    alphaBps: 17.2,
    volatility: 0.92,
    liquidity: 0.48,
    spreadBps: 3.9,
    notional: 210000,
  },
  {
    id: "mean-revert",
    name: "Mean reversion pocket",
    alphaBps: 6.9,
    volatility: 0.41,
    liquidity: 0.81,
    spreadBps: 1.3,
    notional: 140000,
  },
  {
    id: "spoof-burst",
    name: "Orderbook spoof burst",
    alphaBps: -2.4,
    volatility: 0.84,
    liquidity: 0.45,
    spreadBps: 4.1,
    notional: 190000,
  },
  {
    id: "trend-resume",
    name: "Trend resume trigger",
    alphaBps: 14.3,
    volatility: 0.66,
    liquidity: 0.67,
    spreadBps: 2.2,
    notional: 200000,
  },
  {
    id: "close-auction",
    name: "Close auction drift",
    alphaBps: 7.4,
    volatility: 0.58,
    liquidity: 0.79,
    spreadBps: 1.9,
    notional: 155000,
  },
  {
    id: "overnight-gap",
    name: "Overnight gap continuation",
    alphaBps: 10.8,
    volatility: 0.76,
    liquidity: 0.57,
    spreadBps: 2.9,
    notional: 175000,
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function evaluateEvent(event: EventInput, params: ScenarioParams): EventOutput {
  const style = ORDER_STYLE_CONFIG[params.orderStyle];
  const risk = RISK_CONFIG[params.riskMode];

  const fillProbability = clamp(
    style.baseFill -
      params.delayMs * 0.00082 -
      event.volatility * 0.087 +
      event.liquidity * 0.14,
    0.18,
    1
  );

  const delayPenaltyBps =
    Math.log1p(params.delayMs / 18) * (0.63 + event.volatility * 0.44);
  const spreadCostBps = event.spreadBps * params.spreadMultiplier * style.slippage;
  const liquidityDragBps = (1 - event.liquidity) * style.impact * 4.9;

  const edgeBps =
    event.alphaBps - delayPenaltyBps - spreadCostBps - liquidityDragBps;
  const pnl =
    (edgeBps / 10000) * event.notional * fillProbability * risk.leverage;

  return {
    ...event,
    fillProbability,
    delayPenaltyBps,
    spreadCostBps,
    liquidityDragBps,
    edgeBps,
    pnl,
  };
}

function summarize(events: EventOutput[], params: ScenarioParams): SimulationMetrics {
  const risk = RISK_CONFIG[params.riskMode];
  const pnlSeries = events.map((event) => event.pnl);
  const totalPnl = pnlSeries.reduce((sum, value) => sum + value, 0);
  const wins = pnlSeries.filter((value) => value > 0).length;
  const winRate = wins / pnlSeries.length;

  let peak = 0;
  let equity = 0;
  let maxDrawdown = 0;
  for (const pnl of pnlSeries) {
    equity += pnl;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
  }
  maxDrawdown *= risk.drawdownAmp;

  const sorted = [...pnlSeries].sort((a, b) => a - b);
  const worstSlice = sorted.slice(0, 3);
  const expectedShortfall =
    worstSlice.reduce((sum, value) => sum + value, 0) / worstSlice.length;

  const positive = pnlSeries.filter((value) => value > 0).reduce((a, b) => a + b, 0);
  const negativeAbs = Math.abs(
    pnlSeries.filter((value) => value < 0).reduce((a, b) => a + b, 0)
  );
  const fillRate =
    events.reduce((sum, event) => sum + event.fillProbability, 0) / events.length;
  const profitFactor = negativeAbs === 0 ? 9.99 : positive / negativeAbs;
  const executionRegret = events.reduce(
    (sum, event) => sum + Math.max(0, event.delayPenaltyBps + event.spreadCostBps - 4),
    0
  );

  return {
    pnl: totalPnl,
    winRate,
    maxDrawdown,
    expectedShortfall,
    fillRate,
    profitFactor,
    executionRegret,
  };
}

function simulate(params: ScenarioParams): SimulationResult {
  const events = MARKET_TAPE.map((event) => evaluateEvent(event, params));
  return {
    params,
    events,
    metrics: summarize(events, params),
  };
}

export function buildCounterfactualReport(params: ScenarioParams): CounterfactualReport {
  const baseline = simulate(BASELINE_PARAMS);
  const scenario = simulate(params);

  const rows: CounterfactualRow[] = scenario.events.map((event, index) => {
    const base = baseline.events[index];
    let flipState: FlipState = "unchanged";
    if (base.pnl >= 0 && event.pnl < 0) flipState = "flipped_to_loss";
    if (base.pnl < 0 && event.pnl >= 0) flipState = "flipped_to_win";

    return {
      id: event.id,
      name: event.name,
      baselinePnl: base.pnl,
      scenarioPnl: event.pnl,
      deltaPnl: event.pnl - base.pnl,
      flipState,
    };
  });

  const sensitivityDelays = [50, 140, 280, 500];
  const sensitivityStyles: OrderStyle[] = [
    "market",
    "smart_limit",
    "passive_iceberg",
  ];
  const sensitivity: SensitivityPoint[] = [];

  for (const delayMs of sensitivityDelays) {
    for (const orderStyle of sensitivityStyles) {
      const test = simulate({
        ...params,
        delayMs,
        orderStyle,
      });
      sensitivity.push({
        delayMs,
        orderStyle,
        deltaPnl: test.metrics.pnl - baseline.metrics.pnl,
      });
    }
  }

  return {
    baseline,
    scenario,
    delta: {
      pnl: scenario.metrics.pnl - baseline.metrics.pnl,
      winRate: scenario.metrics.winRate - baseline.metrics.winRate,
      maxDrawdown: scenario.metrics.maxDrawdown - baseline.metrics.maxDrawdown,
      expectedShortfall:
        scenario.metrics.expectedShortfall - baseline.metrics.expectedShortfall,
      executionRegret:
        scenario.metrics.executionRegret - baseline.metrics.executionRegret,
    },
    rows,
    sensitivity,
  };
}
