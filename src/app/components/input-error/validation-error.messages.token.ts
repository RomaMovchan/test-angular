import { InjectionToken } from "@angular/core"

export const ERROR_MESSAGES: { [key: string]: (args?: any) => string } = {
  required: () => `This field is required`,
  username: () => `Please provide a correct Username`,
  dateError: () => `Please provide a correct Birthday`,
  restrictedCountries: () => `Please provide a correct Country`,
}

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(`Validation Messages`, {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES
})
