import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Confere se os campos "senha" e "confirmarSenha" são iguais
export const senhasIguais: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const senha = grupo.get('senha')?.value;
  const confirmar = grupo.get('confirmarSenha')?.value;
  return senha && confirmar && senha !== confirmar ? { senhasDiferentes: true } : null;
};

// Não aceita campo preenchido só com espaços
export const semEspacosVazios: ValidatorFn = (campo: AbstractControl): ValidationErrors | null => {
  const valor = campo.value as string;
  return valor && valor.trim().length === 0 ? { espacos: true } : null;
};
