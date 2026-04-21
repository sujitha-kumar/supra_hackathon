import { useEffect, useMemo, useRef } from 'react';

type EvaluateRules<TInput, TOutput> = (clientInput: TInput) => TOutput;

export function useRuleEngine<TInput, TOutput>(
  clientInput: TInput | null | undefined,
  evaluateRules: EvaluateRules<TInput, TOutput>
): TOutput | null {
  const evaluateRulesRef = useRef(evaluateRules);

  useEffect(() => {
    evaluateRulesRef.current = evaluateRules;
  }, [evaluateRules]);

  return useMemo(() => {
    if (!clientInput) {
      return null;
    }

    return evaluateRulesRef.current(clientInput);
  }, [clientInput]);
}
