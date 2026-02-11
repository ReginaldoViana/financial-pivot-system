import { Injectable } from '@angular/core';
import { CalculatedField } from '../models/field.model';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  evaluateFormula(formula: string, context: any): number {
    try {
      let expression = formula;
      
      // Substituir funções de agregação como sum("Nome do Campo") pelo valor
      expression = expression.replace(/\b(sum|count|avg|min|max)\s*\(\s*"([^"]+)"\s*\)/gi, 
        (match, func, fieldName) => {
          const value = context[fieldName];
          return value !== undefined ? String(value) : '0';
        }
      );
      
      // Substituir campos entre colchetes [Nome do Campo] pelo valor
      expression = expression.replace(/\[([^\]]+)\]/g, (match, fieldName) => {
        const value = context[fieldName];
        return value !== undefined ? String(value) : '0';
      });
      
      // Substituir campos diretos (sem colchetes)
      for (const [key, value] of Object.entries(context)) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        expression = expression.replace(regex, String(value));
      }

      expression = this.replaceSpecialFunctions(expression, context);
      const result = this.safeEval(expression);
      
      return typeof result === 'number' ? result : 0;
    } catch (error) {
      console.error('Erro ao avaliar fórmula:', error);
      return 0;
    }
  }

  private replaceSpecialFunctions(expression: string, context: any): string {
    expression = expression.replace(/ABS\(([^)]+)\)/g, (match, p1) => {
      return `Math.abs(${p1})`;
    });

    expression = expression.replace(/MIN\(([^)]+)\)/g, (match, p1) => {
      return `Math.min(${p1})`;
    });

    expression = expression.replace(/MAX\(([^)]+)\)/g, (match, p1) => {
      return `Math.max(${p1})`;
    });

    expression = expression.replace(/RD\(([^)]+)\)/g, (match, p1) => {
      return `Math.round(${p1})`;
    });

    expression = expression.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/g, 
      (match, condition, trueVal, falseVal) => {
        return `(${condition} ? ${trueVal} : ${falseVal})`;
      }
    );

    return expression;
  }

  private safeEval(expression: string): any {
    const allowedOperators = /^[\d\s+\-*/%().<>=!&|]+$/;
    
    if (!allowedOperators.test(expression)) {
      throw new Error('Expressão inválida');
    }

    return Function(`"use strict"; return (${expression})`)();
  }

  validateFormula(formula: string, availableFields: string[]): boolean {
    if (!formula || !formula.trim()) {
      return false;
    }

    // Verificar se a fórmula tem pelo menos um campo referenciado ou é uma expressão matemática válida
    const hasFieldReference = /\[[^\]]+\]/.test(formula);
    const hasAggregationFunction = /\b(sum|count|avg|min|max)\s*\([^)]+\)/i.test(formula);
    const hasBasicOperator = /[\+\-\*\/]/.test(formula);
    const hasFunction = /\b(ABS|MIN|MAX|IF|RD|OR|AND)\b/i.test(formula);

    // A fórmula é válida se tem pelo menos um campo ou operador/função
    return hasFieldReference || hasAggregationFunction || hasBasicOperator || hasFunction;
  }

  extractDependencies(formula: string, availableFields: string[]): string[] {
    const dependencies: string[] = [];
    
    // Extrair campos entre colchetes
    const bracketMatches = formula.match(/\[([^\]]+)\]/g);
    if (bracketMatches) {
      bracketMatches.forEach(match => {
        const fieldName = match.slice(1, -1); // Remove os colchetes
        if (!dependencies.includes(fieldName)) {
          dependencies.push(fieldName);
        }
      });
    }

    // Extrair campos de funções de agregação como sum("Campo")
    const aggregationMatches = formula.match(/\b(?:sum|count|avg|min|max)\s*\(\s*"([^"]+)"\s*\)/gi);
    if (aggregationMatches) {
      aggregationMatches.forEach(match => {
        const fieldMatch = match.match(/"([^"]+)"/);
        if (fieldMatch && !dependencies.includes(fieldMatch[1])) {
          dependencies.push(fieldMatch[1]);
        }
      });
    }

    // Também verificar campos sem colchetes
    availableFields.forEach(field => {
      const regex = new RegExp(`\\b${field}\\b`);
      if (regex.test(formula) && !dependencies.includes(field)) {
        dependencies.push(field);
      }
    });

    return dependencies;
  }
}
