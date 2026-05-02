import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateMatchingPasswords(
  passwordControlName: string,
  passwordConfirmControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const password = formGroup.get(passwordControlName);
    const confirmPassword = formGroup.get(passwordConfirmControlName);
    let errorObj: ValidationErrors | null = confirmPassword?.errors
      ? { ...confirmPassword?.errors }
      : null;

    if (
      !!password?.value &&
      !!confirmPassword?.value &&
      password.value !== confirmPassword.value
    ) {
      if (errorObj === null) {
        errorObj = {
          passwordsNotMatched: true,
        };
      } else {
        errorObj['passwordsNotMatched'] = true;
      }
    }

    confirmPassword?.setErrors(errorObj);
    return errorObj;
  };
}
