# candor
## HTML structure
```html
<div class="container">
  <img src="image.jpg">
  <img src="image.jpg">
  <img src="image.jpg">
</div>
```
## JavaScript initialization
### jQuery
```js
candor($('.container'), { options });
```
### Vanilla JS
```js
candor(document.getElementsByClassName('container'), { options });
```
## Settings
Option | Type | Default
--- | --- | ---
btnPrev | selector | n/a
btnNext | selector | n/a
bullets | selector | n/a
autoplay | boolean | true
animationSpeed | number | 300
interval | number | 3000
stopOnHover | boolean | false
infinite | boolean | true
