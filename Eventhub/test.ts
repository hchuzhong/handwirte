import EventHub from './EventHub';

let eventHub1 = new EventHub();
console.log('check EventHub is a Object: ', eventHub1 instanceof Object);
eventHub1.addEventListener('test1', () => {
    console.log("this is test1 event");
})
eventHub1.dispatchEvent('test1');

let eventHub2 = new EventHub();
let fn2 = () => {
    console.log("this is test2 event");
}
eventHub2.addEventListener('test2', fn2)
eventHub2.removeEventListener('test2', fn2);
eventHub2.dispatchEvent('test2');