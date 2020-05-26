function Tags(element) {
    let DOMParent = element
    let DOMList
    let DOMInput
    let dataAttribute
    let arrayOfList
    let allowDuplicate
    let targetElement
    let inputPlaceholder
    let checkValue
    let enableRegExValidation
    let flashMessageElem


    function DOMCreate() {
        let ul = document.createElement('ul');
        let li = document.createElement('li');
        let input = document.createElement('input');
        if (inputPlaceholder != '')
            input.setAttribute('placeholder', inputPlaceholder);
        DOMParent.appendChild(ul);
        DOMParent.appendChild(input);

        // first child is <ul>
        DOMList = DOMParent.firstElementChild;
        // last child is <input>
        DOMInput = DOMParent.lastElementChild;
    }
    function flashMessage(message) {
        if (typeof flashMessageElem == 'undefined') {
            flashMessageElem = document.createElement('div');
            flashMessageElem.className = "error";
            flashMessageElem.innerHTML = message;
            DOMParent.appendChild(flashMessageElem);
            setTimeout(function () {
                hideError();
            }, 1000);
        } else {
            flashMessageElem.innerHTML = message;
        }

    }
    function hideError(message) {
        DOMParent.removeChild(flashMessageElem);
        flashMessageElem = undefined;
    }
    function DOMRender() {
        // clear the entire <li> inside <ul> 
        DOMList.innerHTML = ''

        // render each <li> to <ul>
        arrayOfList.forEach((currentValue, index) => {
            let li = document.createElement('li');
            li.innerHTML = `${currentValue.label} <a>&times;</a>`;
            li.className = currentValue.class;
            li.querySelector('a').addEventListener('click', function () {
                if (confirm('Continue to remove tag?')) {
                    onDelete(index);
                }
                return false;
            });

            DOMList.appendChild(li);
            setAttribute();
        });
    }
    function testValue(input) {
        return input.value == checkValue;
    }
    function validateInput(inputValue) {
        if (enableRegExValidation) {
            let regex = new RegExp(enableRegExValidation);
            return  regex.test(inputValue);
        }
        return true;
    }
    function inputTextUpdate(newInput) {
        newInput = newInput.trim();
        // check if empty text when ',' is remove
        if (newInput != '') {
            if (!validateInput(newInput)) {
                flashMessage(newInput + " is not a valid input");
                return false;
            }

            //temporarily set value to checkinput duplicacy
            checkValue = newInput;
            if (allowDuplicate || (!allowDuplicate && arrayOfList.findIndex(testValue) === -1)) {
                let tagAttr = {
                    "label": newInput.trim(),
                    "value": newInput.trim(),
                    "class": "valid-input"
                };
                arrayOfList.push(tagAttr);
            } else {
                flashMessage(newInput + " is a duplicate entry");
                return false;
            }
        }
    }
    function onKeyUp() {
        DOMInput.addEventListener('keyup', function (event) {
            let text = this.value.trim()

            // check if ',' or 'enter' key was press
            if (text.includes(',') || event.keyCode == 13) {
                let newInput = text.replace(',', '');
                // check if empty text when ',' is remove
                if (newInput != '') {

                    // push to array and remove ','
                    inputTextUpdate(newInput);
                }
                // clear input
                this.value = checkValue = ''
            }

            DOMRender()
        });
    }
    function onPaste() {
        DOMInput.addEventListener('paste', function (event) {
            event.preventDefault();
            var clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
            var pastedData = clipboardData.getData('text');
            let text = pastedData.trim()
            let valueArray = text.split(',');
            valueArray.map(inputTextUpdate);
            // clear input
            this.value = checkValue = '';
            DOMRender();
            return false;
        });
    }


    function onDelete(id) {
        arrayOfList = arrayOfList.filter(function (currentValue, index) {
            if (index == id) {
                return false;
            }
            return currentValue;
        })

        DOMRender();
        /**
         * added as on removal of last element the value was not geting removed
         * from data set
         */
        if (arrayOfList.length == 0) {
            setAttribute();
        }
    }

    function getAttribute() {
        inputPlaceholder = "";
        enableRegExValidation = false;

        let targetElementAttr = DOMParent.getAttribute('data-target-element');
        /*
         * target element for saving value 
         * addded by himanhsu
         */
        if (typeof targetElementAttr !== 'undefined')
            targetElement = document.getElementById(targetElementAttr);
        /*
         * custom addded to add functionality to allow duplicate entries
         * addded by himanhsu
         */
        allowDuplicate = DOMParent.getAttribute('data-allow-duplicate');
        if (typeof allowDuplicate == 'undefined')
            allowDuplicate = true;
        else {
            allowDuplicate = allowDuplicate == 'false' ? false : true;
        }
        /*
         * placeholder attribute added by himanshu
         */
        let placeholder = DOMParent.getAttribute('data-placeholder');
        if (placeholder != null) {
            inputPlaceholder = placeholder;
        }
        /*
         * placeholder attribute added by himanshu
         */
        let regexValidate = DOMParent.getAttribute('data-regex-validation');
        if (regexValidate != null && regexValidate != "") {

            enableRegExValidation = regexValidate.replace(/^\/|\/$/g, '');
            console.log(enableRegExValidation);
        }

        dataAttribute = DOMParent.getAttribute('data-simple-tags');
        dataAttribute = dataAttribute.split(',');

        // store array of data attribute in arrayOfList
        arrayOfList = dataAttribute.map((inputValue) => {
            let tagAttr = {
                "label": inputValue.trim(),
                "value": inputValue.trim(),
                "class": "valid-input"
            };
            return tagAttr;
        });
    }

    function setAttribute() {
        DOMParent.setAttribute('data-simple-tags', arrayOfList.toString());
        if (typeof targetElement !== 'undefined' && targetElement !== null) {
            let setInputValue = arrayOfList.map(function (itemValue) {
                return itemValue.value;
            });
            targetElement.value = setInputValue.toString();
        }
    }

    getAttribute()
    DOMCreate()
    DOMRender()
    onKeyUp()
    onPaste()
}



// run immediately
(function () {
    let DOMSimpleTags = document.querySelectorAll('.simple-tags')
    DOMSimpleTags = Array.from(DOMSimpleTags)
    DOMSimpleTags.forEach(function (currentValue, index) {
        // create Tags
        new Tags(currentValue)
    })
})()
