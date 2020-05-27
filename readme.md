forked from [kurtobando/simple-tags](https://github.com/kurtobando/simple-tags)

# Simple Tags

### enhanced and added validations, error messasges, input support

### Getting Started
Simply add the `data-simple-tags` with your desired values, for example `Article, Blog, Page, Post, Category, Updates` then, include `.simple-tags` for the default style.
```html
<input type="hidden" id="targetinput" name="targetinput">
<div
   class="simple-tags"
   data-simple-tags="Article, Blog, Page, Post, Category, Updates"
   data-allow-duplicate="false"
   data-target-element="targetinput"  
   data-placeholder='Whatever Placeholder you want #'   
   data-regex-validation='^([a-z]{1,20})$'
     >
</div>
```
NOTE!  Ensure these files are included on your project.
```html
<link href="build/css/style.css" rel="stylesheet">
<script src="build/js/script.js"></script>
```
### License
[MIT](https://choosealicense.com/licenses/mit/)
