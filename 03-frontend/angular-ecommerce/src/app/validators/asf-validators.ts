import { FormControl, ValidationErrors } from "@angular/forms";

export class AsfValidators {

  static notOnlyWhitespace(formControl: FormControl): ValidationErrors | null {
    if (formControl.value != null && formControl.value.trim().length === 0) {
      return {
        'notOnlyWhitespace': true
      }
    }

    else return null;
  }
}
