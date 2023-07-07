export const x = 'x';
// import { DebugElement } from '@angular/core';
// import { ComponentFixture } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';

// /**
//  * Spec helpers for working with the DOM
//  *  credits https://testing-angular.com/
//  */

// export function findEl<T>(fixture: ComponentFixture<T>, testId: string): DebugElement {
//   return queryByCss<T>(fixture, testIdSelector(testId));
// }

// export function findEls<T>(fixture: ComponentFixture<T>, testId: string): DebugElement[] {
//   return fixture.debugElement.queryAll(By.css(testIdSelector(testId)));
// }

// export function testIdSelector(testId: string): string {
//   return `[data-testid="${testId}"]`;
// }

// export function queryByCss<T>(
//   fixture: ComponentFixture<T>,
//   selector: string,
// ): DebugElement {
//   const debugElement = fixture.debugElement.query(By.css(selector));
//   if (!debugElement) {
//     throw new Error(`queryByCss: Element with ${selector} not found`);
//   }
//   return debugElement;
// }


// export function findComponent<T>(
//   fixture: ComponentFixture<T>,
//   selector: string,
// ): DebugElement {
//   return queryByCss(fixture, selector);
// }

// export function findComponents<T>(
//   fixture: ComponentFixture<T>,
//   selector: string,
// ): DebugElement[] {
//   return fixture.debugElement.queryAll(By.css(selector));
// }

// export function expectText<T>(
//   fixture: ComponentFixture<T>,
//   testId: string,
//   text: string,
// ): void {
//   expect(getText(fixture, testId)).toBe(text);
// }

// export function getText<T>(fixture: ComponentFixture<T>, testId: string): string {
//   return findEl(fixture, testId).nativeElement.textContent;
// }

// export function expectContainedText<T>(fixture: ComponentFixture<T>, text: string): void {
//   expect(fixture.nativeElement.textContent).toContain(text);
// }

// export function expectContent<T>(fixture: ComponentFixture<T>, text: string): void {
//   expect(fixture.nativeElement.textContent).toBe(text);
// }


// export function makeClickEvent(target: EventTarget): Partial<MouseEvent> {
//   return {
//     preventDefault(): void { },
//     stopPropagation(): void { },
//     stopImmediatePropagation(): void { },
//     type: 'click',
//     target,
//     currentTarget: target,
//     bubbles: true,
//     cancelable: true,
//     button: 0
//   };
// }
