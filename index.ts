import './style.css';

import {
  Observable,
  of,
  tap,
  delay,
  catchError,
  interval,
  takeWhile,
  BehaviorSubject,
  mergeMap,
  map,
  concatMap,
  mergeAll,
  filter,
  concatAll,
  from,
  mapTo,
  toArray,
  fromEvent,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

// Створити Observable, яка буде віддавати 2 синхронні значення "1", "2", а через 2 секунди викидувати помилку. Ваша задача використовуючи існуючі оператори обробити цю помилку всередині pipe, для того, щоб вона не дійшла до subscribe

// 1 variant

// const observable = new Observable((subscriber) => {
//   subscriber.next(1);
//   subscriber.next(2);

//   setTimeout(() => {
//     subscriber.error('Oops!');
//   }, 2000);
// });

// observable
//   .pipe(
//     catchError((err) => {
//       console.log('Catched error => ', err);

//       return of();
//     })
//   )
//   .subscribe({
//     next: console.log,
//     error: console.log,
//     complete: () => {
//       console.log('Completed');
//     },
//   });

// 2 variant

// of(1, 2).pipe(
//   tap(console.log),
//   delay(2000),
//   tap(() => {
//     throw new Error('Oops!')
//   }),
//   catchError((err) => {
//     console.log('Catched error => ', err.message)

//     return of()
//   })
// ).subscribe({
//   next: console.log,
//   error: console.log,
//   complete: () => {
//     console.log('Completed')
//   }
// })

// Створити аналог fromEvent оператора( який під капотом використовує addEventListener).
// Не забувайте про витоки пам'яті і те, як їх уникати в RxJS(після відписання від цього оператора ми не повинні більше слухати події)

// const fromEvent = (target: HTMLElement, eventName: string) => {
//   return new Observable((subscriber) => {
//     const handler = (e) => {
//       subscriber.next(e);
//     };

//     target.addEventListener(eventName, handler);

//     return function unsubscribe() {
//       target.removeEventListener(eventName, handler);
//     };
//   });
// };

// Використовуючи оператор interval, підписатися на нього і слухати до того моменту, доки значення не буде більше 5(використовуючи оператор в pipe)

// interval(1000).pipe(
//   takeWhile(v => v <= 5)
// ).subscribe(console.log)

// Перетворіть coldInterval нижче на hotInterval, щоб він став гарячим(віддавав одні і ті ж значення різним підписникам)
// Приклад:
// sub1 subscribed
// sub1 0
// sub1 1
// sub2 subscribed
// sub1 2
// sub2 2
// sub1 3
// sub2 3

// 1 variant

// function hotInterval() {
//   let count = 0;

//   return new Observable((subscriber) => {
//     const intervalId = setInterval(() => {
//       if (count < 5) {
//         subscriber.next(count++);
//       } else {
//         subscriber.complete();
//       }
//     }, 2000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   });
// }

// const hotInterval$ = hotInterval();

// hotInterval$.subscribe((value) => console.log('sub1:', value));

// setTimeout(
//   () => hotInterval$.subscribe((value) => console.log('sub2:', value)),
//   3000
// );

// Обробити відповідь запиту, в pipe спочатку витягнути об'єкт response(це масив), відфільтруєте масив так, щоб залишилися тільки пости з id менше 5.
// Hint: так як response - це буде масив постів, ви не можете просто фідфільтрувати його через filter(він приймає кожен елемент масиву, а не цілий масив). Для рішення цієї задачі вам потрібні оператори mergeMap або concatMap, в яких ви зробите з(перекладіть англійською) масиву потік окремих елементів масиву([1, 2, 3] => 1, 2, 3), відфільтруєте їх,а потім зберете назад в масив за допомогою оператора. В subscribe ми отримаємо масив з 4 об'єктів id яких менше 5

// ajax
//   .getJSON('https://jsonplaceholder.typicode.com/posts')
//   .pipe(
//     mergeMap((response) =>
//       from<any>(response).pipe(
//         filter((value: any) => value.id < 5),
//         toArray()
//       )
//     )
//   )
//   .subscribe(console.log);

// Використовуючи Rxjs написати потік, який буде слухати кліки по кнопці і відправляти при натисканню на неї запит на сервер із текстом введеним в пошук. В subscribe ми маємо отримати дані з серверу.
// Оператори, які можуть знадобитися: fromEvent, switchMap, ajax, map, etc

// const URL = 'https://fake-movie-database-api.herokuapp.com/api?s=';

// let inputValue = '';

// const search = document.querySelector('input');
// const button = document.querySelector('button');

// const searchObs$ = fromEvent<InputEvent>(search, 'keyup');
// const buttonObs$ = fromEvent<MouseEvent>(button, 'click');

// searchObs$
//   .pipe(map((event: InputEvent) => (event.target as HTMLInputElement).value))
//   .subscribe((value) => {
//     inputValue = value;
//   });

// buttonObs$
//   .pipe(switchMap(() => ajax.getJSON(URL + inputValue)))
//   .subscribe((response: { property: [] }) => {
//     console.log(...response['Search']);
//   });

// Використовуючи RxJs зробити свою імплементацію Drag&Drop.
// Деталі: Створіть 3 observable mousedown$, mousemove$, mouseup$. Які будуть слухати події mousedown, mousemove, mouseup відповідно. Ваша задача поєднати їх так, щоб mousemove$ починав працювати тільки коли користувач натикає  на mousedown, і переставали слухати, коли відбувається mouseup. Тобто постійно ви маєте слухати тільки mousedown, а підписуватися на зміну mousemove i mouseup тільки після івенту mousedown
// const mousedown$ = ... .pipe().subscribe(value - колекція mousemove подій, яка починається віддаватися при mousedown і закінчує стрім при mouseup)

// const body = document.querySelector('body');

// const mousedown$ = fromEvent(body, 'mousedown');
// const mousemove$ = fromEvent(body, 'mousemove');
// const mouseup$ = fromEvent(body, 'mouseup');

// mousedown$
//   .pipe(mergeMap(() => mousemove$.pipe(takeUntil(mouseup$))))
//   .subscribe(console.log);
